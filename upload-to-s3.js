import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { lookup } from 'mime-types';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });
  
  return arrayOfFiles;
}

async function uploadFiles() {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const buildDir = path.join(__dirname, 'dist');
    
    console.log('📦 ファイルアップロード開始...');
    
    const files = getAllFiles(buildDir);
    console.log(`アップロード対象: ${files.length}ファイル`);
    
    let uploadedCount = 0;
    
    for (const filePath of files) {
      const key = path.relative(buildDir, filePath).replace(/\\/g, '/');
      const content = fs.readFileSync(filePath);
      const contentType = lookup(filePath) || 'application/octet-stream';
      
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: content,
        ContentType: contentType,
        CacheControl: key.includes('index.html') ? 'no-cache' : 'max-age=31536000'
      });
      
      await s3Client.send(command);
      uploadedCount++;
      console.log(`✅ ${key} (${uploadedCount}/${files.length})`);
    }
    
    console.log('');
    console.log('🎉 アップロード完了！');
    console.log(`URL: http://${bucketName}.s3-website-${process.env.AWS_REGION}.amazonaws.com`);
    
  } catch (error) {
    console.error('❌ アップロードエラー:', error.message);
    console.error(error);
  }
}

uploadFiles();