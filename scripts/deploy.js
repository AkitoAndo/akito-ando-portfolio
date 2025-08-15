#!/usr/bin/env node

import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'
import { lookup } from 'mime-types'
import dotenv from 'dotenv'

// .envファイルを読み込み
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 設定
const config = {
  aws: {
    region: process.env.AWS_REGION || 'ap-northeast-1',
    bucketName: process.env.S3_BUCKET_NAME || 'akito-ando-portfolio',
    cloudfrontDistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID || null,
    profile: process.env.AWS_PROFILE || 'default'
  },
  build: {
    distDir: path.resolve(__dirname, '../dist'),
    indexFile: 'index.html'
  }
}

class PortfolioDeployer {
  constructor() {
    // AWS認証情報の確認
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('⚠️  AWS credentials not found in environment variables')
      console.log('   Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env file')
      console.log('   or use AWS CLI profile configuration')
    }

    this.s3Client = new S3Client({
      region: config.aws.region,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      } : undefined
    })

    this.cloudfrontClient = new CloudFrontClient({
      region: config.aws.region,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      } : undefined
    })
  }

  // ビルドディレクトリの存在確認
  checkBuildDirectory() {
    if (!fs.existsSync(config.build.distDir)) {
      throw new Error(`Build directory not found: ${config.build.distDir}. Please run 'npm run build' first.`)
    }
    
    const indexPath = path.join(config.build.distDir, config.build.indexFile)
    if (!fs.existsSync(indexPath)) {
      throw new Error(`Index file not found: ${indexPath}`)
    }
    
    console.log('✓ Build directory verified')
  }

  // ファイル一覧を取得
  getFilesToUpload(dir, baseDir = dir) {
    const files = []
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...this.getFilesToUpload(fullPath, baseDir))
      } else {
        const relativePath = path.relative(baseDir, fullPath)
        const key = relativePath.replace(/\\/g, '/') // Windows対応
        files.push({
          localPath: fullPath,
          s3Key: key,
          contentType: lookup(fullPath) || 'application/octet-stream',
          size: stat.size
        })
      }
    }

    return files
  }

  // ファイルのMD5ハッシュを計算
  calculateMD5(filePath) {
    const content = fs.readFileSync(filePath)
    return createHash('md5').update(content).digest('hex')
  }

  // S3からオブジェクト一覧を取得
  async getS3Objects() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: config.aws.bucketName
      })
      
      const response = await this.s3Client.send(command)
      return response.Contents || []
    } catch (error) {
      console.warn('Warning: Could not list S3 objects:', error.message)
      return []
    }
  }

  // ファイルをS3にアップロード
  async uploadFile(file) {
    try {
      const content = fs.readFileSync(file.localPath)
      
      const command = new PutObjectCommand({
        Bucket: config.aws.bucketName,
        Key: file.s3Key,
        Body: content,
        ContentType: file.contentType,
        CacheControl: this.getCacheControl(file.s3Key),
        Metadata: {
          'uploaded-by': 'portfolio-deploy-script',
          'upload-time': new Date().toISOString()
        }
      })

      await this.s3Client.send(command)
      return true
    } catch (error) {
      console.error(`Failed to upload ${file.s3Key}:`, error.message)
      return false
    }
  }

  // キャッシュ制御ヘッダーを取得
  getCacheControl(key) {
    // 静的アセット（JS、CSS、画像など）は長期キャッシュ
    if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/.test(key)) {
      return 'public, max-age=31536000, immutable' // 1年
    }
    
    // HTMLファイルは短期キャッシュ
    if (/\.html$/.test(key)) {
      return 'public, max-age=300, must-revalidate' // 5分
    }
    
    // その他
    return 'public, max-age=3600' // 1時間
  }

  // 不要なファイルをS3から削除
  async deleteUnusedFiles(localFiles, s3Objects) {
    const localKeys = new Set(localFiles.map(f => f.s3Key))
    const filesToDelete = s3Objects.filter(obj => !localKeys.has(obj.Key))

    if (filesToDelete.length === 0) {
      console.log('✓ No unused files to delete')
      return
    }

    console.log(`Deleting ${filesToDelete.length} unused files...`)
    
    for (const file of filesToDelete) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: config.aws.bucketName,
          Key: file.Key
        })
        
        await this.s3Client.send(command)
        console.log(`  - Deleted: ${file.Key}`)
      } catch (error) {
        console.error(`Failed to delete ${file.Key}:`, error.message)
      }
    }
  }

  // CloudFrontキャッシュを無効化
  async invalidateCloudfront() {
    if (!config.aws.cloudfrontDistributionId) {
      console.log('⚠ CloudFront distribution ID not configured, skipping invalidation')
      return
    }

    try {
      console.log('Creating CloudFront invalidation...')
      
      const command = new CreateInvalidationCommand({
        DistributionId: config.aws.cloudfrontDistributionId,
        InvalidationBatch: {
          Paths: {
            Quantity: 1,
            Items: ['/*']
          },
          CallerReference: Date.now().toString()
        }
      })

      const response = await this.cloudfrontClient.send(command)
      console.log(`✓ CloudFront invalidation created: ${response.Invalidation.Id}`)
    } catch (error) {
      console.error('Failed to create CloudFront invalidation:', error.message)
    }
  }

  // メインデプロイ処理
  async deploy() {
    try {
      console.log('🚀 Starting deployment to AWS S3...')
      console.log(`Bucket: ${config.aws.bucketName}`)
      console.log(`Region: ${config.aws.region}`)
      
      // 1. ビルドディレクトリの確認
      this.checkBuildDirectory()
      
      // 2. アップロード対象ファイル一覧を取得
      const filesToUpload = this.getFilesToUpload(config.build.distDir)
      console.log(`Found ${filesToUpload.length} files to upload`)
      
      // 3. 既存のS3オブジェクト一覧を取得
      const s3Objects = await this.getS3Objects()
      console.log(`Found ${s3Objects.length} existing objects in S3`)
      
      // 4. ファイルをアップロード
      console.log('Uploading files...')
      let uploadedCount = 0
      let skippedCount = 0
      
      for (const file of filesToUpload) {
        const success = await this.uploadFile(file)
        if (success) {
          uploadedCount++
          console.log(`  ✓ ${file.s3Key} (${(file.size / 1024).toFixed(1)}KB)`)
        } else {
          console.log(`  ✗ ${file.s3Key}`)
        }
      }
      
      console.log(`Upload complete: ${uploadedCount} uploaded, ${skippedCount} skipped`)
      
      // 5. 不要なファイルを削除
      await this.deleteUnusedFiles(filesToUpload, s3Objects)
      
      // 6. CloudFrontキャッシュ無効化
      await this.invalidateCloudfront()
      
      console.log('')
      console.log('🎉 Deployment completed successfully!')
      
      const bucketUrl = `https://${config.aws.bucketName}.s3-website-${config.aws.region}.amazonaws.com`
      const cloudfrontUrl = config.aws.cloudfrontDistributionId 
        ? `https://${config.aws.cloudfrontDistributionId}.cloudfront.net`
        : null
      
      console.log('📍 Access URLs:')
      console.log(`   S3 Website: ${bucketUrl}`)
      if (cloudfrontUrl) {
        console.log(`   CloudFront: ${cloudfrontUrl}`)
      }
      
    } catch (error) {
      console.error('')
      console.error('❌ Deployment failed:', error.message)
      process.exit(1)
    }
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployer = new PortfolioDeployer()
  deployer.deploy()
}