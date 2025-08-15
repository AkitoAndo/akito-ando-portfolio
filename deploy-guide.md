# デプロイガイド

このドキュメントでは、ポートフォリオサイトをAWS S3/CloudFrontにデプロイする方法を説明します。

## 前提条件

- Node.js 18以上がインストールされていること
- AWSアカウントを持っていること
- IAMユーザーまたはロールでS3とCloudFrontへのアクセス権限があること

## 🚀 クイックスタート（自動セットアップ）

### 1. AWS環境の自動セットアップ

```bash
npm run setup:aws
```

このコマンドで以下が自動実行されます：
- AWS認証情報の設定
- S3バケットの作成
- 静的ウェブサイトホスティングの有効化
- パブリックアクセス設定
- CloudFrontディストリビューションの作成（オプション）
- 環境変数ファイル（.env）の更新

### 2. デプロイ実行

```bash
npm run deploy
```

以上で完了です！ 🎉

---

## セットアップ手順

### 1. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成します：

```bash
cp .env.example .env
```

### 2. AWS認証情報の設定

`.env`ファイルを編集して、AWS認証情報を設定します：

```env
# AWS設定
AWS_REGION=ap-northeast-1              # 使用するAWSリージョン
S3_BUCKET_NAME=your-bucket-name        # S3バケット名
CLOUDFRONT_DISTRIBUTION_ID=EXXXXXXXXX  # CloudFront Distribution ID（オプション）

# AWS認証情報
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX       # IAMユーザーのアクセスキー
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxx   # IAMユーザーのシークレットキー
```

### 3. 必要なIAM権限

デプロイに使用するIAMユーザーには以下の権限が必要です：

#### S3権限：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

#### CloudFront権限（オプション）：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::123456789012:distribution/EXXXXXXXXX"
    }
  ]
}
```

## デプロイ方法

### 開発環境へのデプロイ

```bash
npm run deploy
```

### 本番環境へのデプロイ

本番環境用の`.env.production`ファイルを作成してから：

```bash
npm run deploy:prod
```

## デプロイスクリプトの動作

1. **ビルド**: Viteでプロダクションビルドを作成
2. **アップロード**: distフォルダ内の全ファイルをS3にアップロード
3. **クリーンアップ**: S3上の不要なファイルを削除
4. **キャッシュ無効化**: CloudFrontのキャッシュを無効化（設定されている場合）

## トラブルシューティング

### 認証エラーが発生する場合

1. AWS認証情報が正しく設定されているか確認
2. IAMユーザーに必要な権限があるか確認
3. `.env`ファイルが正しく読み込まれているか確認

### S3バケットが見つからない場合

1. バケット名が正しいか確認
2. リージョンが正しいか確認
3. バケットが存在するか確認

### デプロイ後サイトが表示されない場合

1. S3バケットの静的ウェブサイトホスティングが有効か確認
2. バケットポリシーでパブリック読み取りが許可されているか確認
3. index.htmlがルートに配置されているか確認

## S3バケットの設定例

### バケットポリシー（パブリック読み取り許可）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 静的ウェブサイトホスティング設定：

- インデックスドキュメント: `index.html`
- エラードキュメント: `index.html`（SPAのため）

## セキュリティのベストプラクティス

1. **IAMユーザー**: 最小権限の原則に従い、必要最小限の権限のみ付与
2. **アクセスキー**: 定期的にローテーション
3. **環境変数**: `.env`ファイルは絶対にGitにコミットしない
4. **CloudFront**: HTTPSを強制し、セキュリティヘッダーを設定
5. **S3**: バケットのバージョニングを有効化してバックアップ

## CI/CDパイプライン

GitHub Actionsを使用した自動デプロイの例：

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build and Deploy
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ap-northeast-1
          S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
          CLOUDFRONT_DISTRIBUTION_ID: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
        run: npm run deploy
```

## サポート

問題が発生した場合は、以下を確認してください：

1. Node.jsのバージョン: `node --version`
2. AWS CLIの設定: `aws configure list`
3. 環境変数: `printenv | grep AWS`
4. デプロイログ: コンソール出力を確認