import { CloudFrontClient, CreateDistributionCommand, CreateOriginAccessControlCommand } from '@aws-sdk/client-cloudfront';
import { Route53Client, CreateHostedZoneCommand, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53';
import dotenv from 'dotenv';

dotenv.config();

const cloudFrontClient = new CloudFrontClient({
  region: 'us-east-1', // CloudFrontは常にus-east-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function setupCustomDomain() {
  try {
    const domainName = 'akito-ando.dev'; // 希望のドメイン名
    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    
    console.log('🌐 CloudFrontディストリビューション作成中...');
    
    const distributionConfig = {
      CallerReference: Date.now().toString(),
      Comment: `Portfolio site for ${domainName}`,
      DefaultRootObject: 'index.html',
      Aliases: {
        Quantity: 2,
        Items: [domainName, `www.${domainName}`]
      },
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: `S3-${bucketName}`,
            DomainName: `${bucketName}.s3-website-${region}.amazonaws.com`,
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: 'http-only'
            }
          }
        ]
      },
      DefaultCacheBehavior: {
        TargetOriginId: `S3-${bucketName}`,
        ViewerProtocolPolicy: 'redirect-to-https',
        AllowedMethods: {
          Quantity: 7,
          Items: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
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
        MaxTTL: 31536000,
        Compress: true
      },
      CustomErrorResponses: {
        Quantity: 2,
        Items: [
          {
            ErrorCode: 404,
            ResponseCode: '200',
            ResponsePagePath: '/index.html',
            ErrorCachingMinTTL: 300
          },
          {
            ErrorCode: 403,
            ResponseCode: '200', 
            ResponsePagePath: '/index.html',
            ErrorCachingMinTTL: 300
          }
        ]
      },
      Enabled: true,
      PriceClass: 'PriceClass_100' // 最安価格クラス
    };
    
    const command = new CreateDistributionCommand({
      DistributionConfig: distributionConfig
    });
    
    const response = await cloudFrontClient.send(command);
    const distributionId = response.Distribution.Id;
    const domainName = response.Distribution.DomainName;
    
    console.log('✅ CloudFrontディストリビューション作成完了');
    console.log(`Distribution ID: ${distributionId}`);
    console.log(`CloudFront Domain: https://${domainName}`);
    
    // .envファイルを更新
    console.log('📝 .envファイルを更新中...');
    
    return {
      distributionId,
      cloudfrontDomain: domainName
    };
    
  } catch (error) {
    console.error('❌ CloudFront設定エラー:', error.message);
    throw error;
  }
}

async function createShorterBucket() {
  try {
    const newBucketName = 'akito-ando-portfolio';
    console.log(`🪣 より短いバケット名でバケット作成: ${newBucketName}`);
    
    // バケット作成ロジック（既存のコードを再利用）
    // この部分は実際のドメイン名が決まってから実装
    
    return newBucketName;
  } catch (error) {
    console.error('❌ バケット作成エラー:', error.message);
  }
}

// メイン実行
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 カスタムドメイン設定を開始...');
  console.log('');
  console.log('選択肢:');
  console.log('1. CloudFront + カスタムドメイン (推奨)');
  console.log('2. より短いS3バケット名');
  console.log('3. 両方');
  console.log('');
  
  // 実際の実行は選択後に行う
  console.log('💡 次のステップ:');
  console.log('1. ドメイン名を決定 (例: akito-ando.dev)');
  console.log('2. ドメインレジストラでドメイン購入');
  console.log('3. Route53でDNS設定');
  console.log('4. SSL証明書取得 (ACM)');
  console.log('5. CloudFront設定');
}