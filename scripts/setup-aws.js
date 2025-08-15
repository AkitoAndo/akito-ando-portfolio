#!/usr/bin/env node

import { S3Client, CreateBucketCommand, PutBucketWebsiteCommand, PutBucketPolicyCommand, PutPublicAccessBlockCommand, GetBucketWebsiteCommand } from '@aws-sdk/client-s3'
import { CloudFrontClient, CreateDistributionCommand } from '@aws-sdk/client-cloudfront'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import readline from 'readline'

// .envファイルを読み込み
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ユーザー入力を取得
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

class AWSSetup {
  constructor() {
    this.region = process.env.AWS_REGION || 'ap-northeast-1'
    this.bucketName = null
    this.s3Client = null
    this.cloudFrontClient = null
  }

  // AWS認証情報の確認と設定
  async checkCredentials() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('\n⚠️  AWS認証情報が見つかりません')
      console.log('📝 AWS認証情報を入力してください:\n')
      
      const accessKey = await question('AWS Access Key ID: ')
      const secretKey = await question('AWS Secret Access Key: ')
      
      // .envファイルを更新
      const envPath = path.join(__dirname, '..', '.env')
      let envContent = ''
      
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8')
      }
      
      if (!envContent.includes('AWS_ACCESS_KEY_ID')) {
        envContent += `\nAWS_ACCESS_KEY_ID=${accessKey}`
      } else {
        envContent = envContent.replace(/AWS_ACCESS_KEY_ID=.*/, `AWS_ACCESS_KEY_ID=${accessKey}`)
      }
      
      if (!envContent.includes('AWS_SECRET_ACCESS_KEY')) {
        envContent += `\nAWS_SECRET_ACCESS_KEY=${secretKey}`
      } else {
        envContent = envContent.replace(/AWS_SECRET_ACCESS_KEY=.*/, `AWS_SECRET_ACCESS_KEY=${secretKey}`)
      }
      
      fs.writeFileSync(envPath, envContent)
      
      process.env.AWS_ACCESS_KEY_ID = accessKey
      process.env.AWS_SECRET_ACCESS_KEY = secretKey
      
      console.log('✅ 認証情報を.envファイルに保存しました\n')
    }

    // S3クライアントを初期化
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })

    this.cloudFrontClient = new CloudFrontClient({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })
  }

  // バケット名の入力と検証
  async getBucketName() {
    console.log('\n📦 S3バケットの設定')
    console.log('   バケット名は全世界で一意である必要があります')
    console.log('   例: akito-ando-portfolio-2024\n')
    
    let bucketName = process.env.S3_BUCKET_NAME
    
    if (!bucketName) {
      bucketName = await question('S3バケット名を入力してください: ')
    } else {
      const useExisting = await question(`既存の設定 "${bucketName}" を使用しますか? (y/n): `)
      if (useExisting.toLowerCase() !== 'y') {
        bucketName = await question('新しいS3バケット名を入力してください: ')
      }
    }
    
    this.bucketName = bucketName.toLowerCase().trim()
    
    // .envファイルを更新
    const envPath = path.join(__dirname, '..', '.env')
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    if (!envContent.includes('S3_BUCKET_NAME')) {
      envContent += `\nS3_BUCKET_NAME=${this.bucketName}`
    } else {
      envContent = envContent.replace(/S3_BUCKET_NAME=.*/, `S3_BUCKET_NAME=${this.bucketName}`)
    }
    
    if (!envContent.includes('AWS_REGION')) {
      envContent += `\nAWS_REGION=${this.region}`
    }
    
    fs.writeFileSync(envPath, envContent)
    
    console.log(`✅ バケット名を設定: ${this.bucketName}\n`)
  }

  // S3バケットの作成
  async createBucket() {
    console.log('🚀 S3バケットを作成中...')
    
    try {
      // バケット作成
      const createBucketCommand = new CreateBucketCommand({
        Bucket: this.bucketName,
        CreateBucketConfiguration: this.region !== 'us-east-1' ? {
          LocationConstraint: this.region
        } : undefined
      })
      
      await this.s3Client.send(createBucketCommand)
      console.log(`✅ バケット "${this.bucketName}" を作成しました`)
      
    } catch (error) {
      if (error.name === 'BucketAlreadyExists' || error.name === 'BucketAlreadyOwnedByYou') {
        console.log(`ℹ️  バケット "${this.bucketName}" は既に存在します`)
      } else {
        throw error
      }
    }
  }

  // パブリックアクセスブロックの設定
  async configurePublicAccess() {
    console.log('🔓 パブリックアクセスを設定中...')
    
    try {
      // パブリックアクセスブロックを無効化（静的ウェブサイトホスティングに必要）
      const publicAccessCommand = new PutPublicAccessBlockCommand({
        Bucket: this.bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false
        }
      })
      
      await this.s3Client.send(publicAccessCommand)
      console.log('✅ パブリックアクセスブロックを設定しました')
      
    } catch (error) {
      console.error('⚠️  パブリックアクセスの設定に失敗:', error.message)
    }
  }

  // 静的ウェブサイトホスティングの設定
  async configureWebsiteHosting() {
    console.log('🌐 静的ウェブサイトホスティングを設定中...')
    
    try {
      const websiteCommand = new PutBucketWebsiteCommand({
        Bucket: this.bucketName,
        WebsiteConfiguration: {
          IndexDocument: {
            Suffix: 'index.html'
          },
          ErrorDocument: {
            Key: 'index.html'  // SPAのため、404も index.html を返す
          }
        }
      })
      
      await this.s3Client.send(websiteCommand)
      console.log('✅ 静的ウェブサイトホスティングを有効化しました')
      
    } catch (error) {
      console.error('⚠️  ウェブサイトホスティングの設定に失敗:', error.message)
    }
  }

  // バケットポリシーの設定
  async configureBucketPolicy() {
    console.log('📜 バケットポリシーを設定中...')
    
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${this.bucketName}/*`
        }
      ]
    }
    
    try {
      const policyCommand = new PutBucketPolicyCommand({
        Bucket: this.bucketName,
        Policy: JSON.stringify(bucketPolicy)
      })
      
      await this.s3Client.send(policyCommand)
      console.log('✅ バケットポリシーを設定しました（パブリック読み取り許可）')
      
    } catch (error) {
      console.error('⚠️  バケットポリシーの設定に失敗:', error.message)
    }
  }

  // CloudFront ディストリビューションの作成（オプション）
  async setupCloudFront() {
    const useCloudFront = await question('\n☁️  CloudFrontを設定しますか？（HTTPSとCDNを利用可能） (y/n): ')
    
    if (useCloudFront.toLowerCase() !== 'y') {
      console.log('⏭️  CloudFrontの設定をスキップしました')
      return
    }
    
    console.log('🚀 CloudFrontディストリビューションを作成中...')
    
    try {
      const distributionConfig = {
        CallerReference: Date.now().toString(),
        Comment: `Portfolio site for ${this.bucketName}`,
        DefaultRootObject: 'index.html',
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: `S3-${this.bucketName}`,
              DomainName: `${this.bucketName}.s3-website-${this.region}.amazonaws.com`,
              CustomOriginConfig: {
                HTTPPort: 80,
                HTTPSPort: 443,
                OriginProtocolPolicy: 'http-only'
              }
            }
          ]
        },
        DefaultCacheBehavior: {
          TargetOriginId: `S3-${this.bucketName}`,
          ViewerProtocolPolicy: 'redirect-to-https',
          AllowedMethods: {
            Quantity: 2,
            Items: ['GET', 'HEAD'],
            CachedMethods: {
              Quantity: 2,
              Items: ['GET', 'HEAD']
            }
          },
          TrustedSigners: {
            Enabled: false,
            Quantity: 0
          },
          ForwardedValues: {
            QueryString: false,
            Cookies: { Forward: 'none' }
          },
          MinTTL: 0,
          DefaultTTL: 86400,
          MaxTTL: 31536000
        },
        Enabled: true,
        CustomErrorResponses: {
          Quantity: 1,
          Items: [
            {
              ErrorCode: 404,
              ResponseCode: '200',
              ResponsePagePath: '/index.html',
              ErrorCachingMinTTL: 300
            }
          ]
        }
      }
      
      const command = new CreateDistributionCommand({
        DistributionConfig: distributionConfig
      })
      
      const response = await this.s3Client.send(command)
      const distributionId = response.Distribution.Id
      const domainName = response.Distribution.DomainName
      
      console.log(`✅ CloudFrontディストリビューションを作成しました`)
      console.log(`   Distribution ID: ${distributionId}`)
      console.log(`   Domain: https://${domainName}`)
      
      // .envファイルを更新
      const envPath = path.join(__dirname, '..', '.env')
      let envContent = fs.readFileSync(envPath, 'utf8')
      
      if (!envContent.includes('CLOUDFRONT_DISTRIBUTION_ID')) {
        envContent += `\nCLOUDFRONT_DISTRIBUTION_ID=${distributionId}`
      } else {
        envContent = envContent.replace(/CLOUDFRONT_DISTRIBUTION_ID=.*/, `CLOUDFRONT_DISTRIBUTION_ID=${distributionId}`)
      }
      
      fs.writeFileSync(envPath, envContent)
      
    } catch (error) {
      console.error('⚠️  CloudFrontの設定に失敗:', error.message)
      console.log('   CloudFrontは後で手動で設定できます')
    }
  }

  // セットアップ完了メッセージ
  showCompletionMessage() {
    console.log('\n' + '='.repeat(60))
    console.log('🎉 AWSセットアップが完了しました！')
    console.log('='.repeat(60))
    
    const websiteUrl = `http://${this.bucketName}.s3-website-${this.region}.amazonaws.com`
    
    console.log('\n📝 次のステップ:')
    console.log('1. アプリケーションをビルド: npm run build')
    console.log('2. デプロイを実行: npm run deploy')
    
    console.log('\n🌐 アクセスURL:')
    console.log(`   S3 Website: ${websiteUrl}`)
    
    if (process.env.CLOUDFRONT_DISTRIBUTION_ID) {
      console.log(`   CloudFront: https://${process.env.CLOUDFRONT_DISTRIBUTION_ID}.cloudfront.net`)
    }
    
    console.log('\n💡 ヒント:')
    console.log('   - 初回デプロイ後、URLにアクセスしてサイトを確認してください')
    console.log('   - CloudFrontを使用している場合、配信開始まで15-20分かかることがあります')
    console.log('   - カスタムドメインを設定する場合は、Route 53でDNS設定を行ってください')
    
    console.log('\n📚 詳細は deploy-guide.md を参照してください')
  }

  // メイン処理
  async run() {
    try {
      console.log('🔧 AWS環境のセットアップを開始します\n')
      
      // 1. 認証情報の確認
      await this.checkCredentials()
      
      // 2. バケット名の設定
      await this.getBucketName()
      
      // 3. S3バケットの作成
      await this.createBucket()
      
      // 4. パブリックアクセスの設定
      await this.configurePublicAccess()
      
      // 5. 静的ウェブサイトホスティングの設定
      await this.configureWebsiteHosting()
      
      // 6. バケットポリシーの設定
      await this.configureBucketPolicy()
      
      // 7. CloudFrontの設定（オプション）
      await this.setupCloudFront()
      
      // 8. 完了メッセージ
      this.showCompletionMessage()
      
    } catch (error) {
      console.error('\n❌ セットアップ中にエラーが発生しました:', error.message)
      console.error('\n詳細:', error)
      process.exit(1)
    } finally {
      rl.close()
    }
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new AWSSetup()
  setup.run()
}