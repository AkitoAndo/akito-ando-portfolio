# AWS設定ガイド

このガイドでは、ポートフォリオサイトのデプロイに必要なAWSアカウントとアクセスキーの設定方法を説明します。

## 🔐 Step 1: IAMユーザー作成

### 1.1 AWSマネジメントコンソールにログイン
[AWS Console](https://console.aws.amazon.com/) にログインします。

### 1.2 IAMサービスに移動
1. サービス検索で「IAM」と入力
2. 「Identity and Access Management (IAM)」を選択

### 1.3 新しいユーザーを作成
1. 左メニューの「ユーザー」をクリック
2. 「ユーザーを追加」ボタンをクリック
3. ユーザー名: `portfolio-deployer` と入力
4. 「次のステップ: アクセス許可」をクリック

## 🎯 Step 2: ポリシー作成とアタッチ

### 2.1 カスタムポリシーを作成
1. IAMダッシュボードで「ポリシー」をクリック
2. 「ポリシーの作成」をクリック
3. 「JSON」タブを選択
4. 以下のポリシーをコピー&ペースト:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3FullAccessForPortfolio",
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::*portfolio*",
                "arn:aws:s3:::*portfolio*/*",
                "arn:aws:s3:::akito-ando-portfolio*",
                "arn:aws:s3:::akito-ando-portfolio*/*"
            ]
        },
        {
            "Sid": "CloudFrontAccess",
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations",
                "cloudfront:GetDistribution",
                "cloudfront:GetDistributionConfig",
                "cloudfront:CreateDistribution",
                "cloudfront:UpdateDistribution",
                "cloudfront:ListDistributions"
            ],
            "Resource": "*"
        },
        {
            "Sid": "S3ListAllBuckets",
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "s3:GetBucketLocation"
            ],
            "Resource": "*"
        }
    ]
}
```

5. 「次のステップ: タグ」→「次のステップ: 確認」
6. ポリシー名: `PortfolioDeploymentPolicy`
7. 「ポリシーの作成」をクリック

### 2.2 ユーザーにポリシーをアタッチ
1. 「ユーザー」→作成した`portfolio-deployer`を選択
2. 「アクセス許可」タブ→「アクセス許可を追加」
3. 「既存のポリシーを直接アタッチ」
4. `PortfolioDeploymentPolicy`を検索して選択
5. 「次のステップ: 確認」→「アクセス許可を追加」

## 🔑 Step 3: アクセスキー作成

### 3.1 プログラマティックアクセス用キー作成
1. ユーザー詳細画面で「セキュリティ認証情報」タブ
2. 「アクセスキーを作成」をクリック
3. 「コマンドラインインターフェイス (CLI)」を選択
4. 確認チェックボックスにチェック
5. 「次へ」→「アクセスキーを作成」

### 3.2 認証情報の保存
⚠️ **重要**: この情報は再表示されません！安全に保存してください。

- **Access Key ID**: `AKIA...` で始まる文字列
- **Secret Access Key**: 長いランダム文字列

## 📝 Step 4: .envファイルの設定

プロジェクトの`.env`ファイルを編集:

```env
# AWS設定
AWS_REGION=ap-northeast-1
S3_BUCKET_NAME=akito-ando-portfolio-2024
CLOUDFRONT_DISTRIBUTION_ID=

# AWS認証情報 (上記で取得した値を設定)
AWS_ACCESS_KEY_ID=AKIA1234567890EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# アプリケーション設定
VITE_APP_TITLE=Akito Ando Portfolio
VITE_GITHUB_USERNAME=your-github-username
VITE_APP_URL=https://your-domain.com

# 開発環境設定
VITE_DEV_PORT=3000
```

## 🪣 Step 5: S3バケット作成

### 5.1 AWSコンソールでバケット作成
1. S3サービスに移動
2. 「バケットを作成」をクリック
3. バケット名: `akito-ando-portfolio-2024` (グローバル一意である必要があります)
4. リージョン: `アジアパシフィック (東京) ap-northeast-1`
5. 「パブリックアクセスをすべてブロック」のチェックを**外す**
6. 確認チェックボックスにチェック
7. 「バケットを作成」

### 5.2 バケットポリシー設定
1. 作成したバケットを選択
2. 「アクセス許可」タブ
3. 「バケットポリシー」→「編集」
4. 以下のポリシーを設定:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::akito-ando-portfolio-2024/*"
        }
    ]
}
```

### 5.3 静的ウェブサイトホスティング有効化
1. 「プロパティ」タブ
2. 「静的ウェブサイトホスティング」→「編集」
3. 「有効にする」を選択
4. インデックスドキュメント: `index.html`
5. エラードキュメント: `index.html` (SPAの場合)
6. 「変更の保存」

## ☁️ Step 6: CloudFront設定 (オプション)

### 6.1 ディストリビューション作成
1. CloudFrontサービスに移動
2. 「ディストリビューションを作成」
3. オリジンドメイン: S3バケットのウェブサイトエンドポイントを選択
4. デフォルトルートオブジェクト: `index.html`
5. 「ディストリビューションを作成」

### 6.2 ディストリビューションIDを取得
作成完了後、ディストリビューションIDを`.env`ファイルの`CLOUDFRONT_DISTRIBUTION_ID`に設定

## 🧪 Step 7: デプロイテスト

### 7.1 プロジェクトのビルドとデプロイ
```bash
# 依存関係インストール
npm install

# プロダクションビルド
npm run build

# AWSにデプロイ
npm run deploy
```

### 7.2 成功確認
デプロイが成功すると以下のようなメッセージが表示されます:
```
🎉 Deployment completed successfully!
📍 Access URLs:
   S3 Website: https://akito-ando-portfolio-2024.s3-website-ap-northeast-1.amazonaws.com
   CloudFront: https://d123456789.cloudfront.net
```

## 💰 料金の目安

### S3料金
- ストレージ: ~$0.025/GB/月
- リクエスト: ~$0.0004/1000 GET リクエスト

### CloudFront料金
- データ転送: ~$0.114/GB (最初の10TB)
- リクエスト: ~$0.0075/10000 リクエスト

**小規模なポートフォリオサイトの場合、月額 $1-5 程度**

## 🔒 セキュリティの注意点

1. **アクセスキーの管理**
   - `.env`ファイルをGitにコミットしない
   - 定期的にローテーション
   - 不要になったら削除

2. **最小権限の原則**
   - 必要最小限の権限のみ付与
   - 定期的に権限の見直し

3. **モニタリング**
   - CloudTrailでAPI呼び出しを監視
   - 異常なアクティビティに注意

## 🆘 トラブルシューティング

### よくあるエラーと解決法

**エラー1: Access Denied**
```
解決法: バケットポリシーとIAMユーザーの権限を確認
```

**エラー2: Bucket name already exists**
```
解決法: バケット名を変更 (グローバル一意である必要があります)
```

**エラー3: Region mismatch**
```
解決法: .envのAWS_REGIONとS3バケットのリージョンを一致させる
```

これで設定完了です！何か問題があれば、エラーメッセージと一緒にお知らせください。