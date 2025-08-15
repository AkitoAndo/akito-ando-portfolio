# Akito Ando Portfolio

A modern, terminal-themed portfolio website built with React, TypeScript, and deployed on AWS. This single-page application showcases projects, skills, and professional information with a unique developer-focused design aesthetic.

🌐 **Live Demo**: [https://akito-ando.dev](https://akito-ando.dev)  
📧 **Contact**: akito.ando@example.com  
💼 **LinkedIn**: [linkedin.com/in/akito-ando](https://linkedin.com/in/akito-ando)  
🐙 **GitHub**: [@akito-ando](https://github.com/akito-ando)

## 🚀 特徴

- **React + TypeScript**: 型安全なモダンフロントエンド開発
- **ターミナルUIデザイン**: 開発者らしいユニークな見た目
- **レスポンシブ対応**: デスクトップ・タブレット・モバイル全対応
- **GitHub API統合**: リアルタイムでプロジェクト情報を取得
- **AWS デプロイメント**: S3 + CloudFrontによる高速配信
- **E2Eテスト**: Playwrightによる包括的なテスト
- **アニメーション**: Framer Motionによる滑らかな動作

## 🛠 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite (ビルドツール)
- React Router DOM
- Framer Motion (アニメーション)
- React Helmet Async (SEO)
- React Markdown (コンテンツ表示)

### スタイリング
- CSS Modules
- レスポンシブデザイン
- カスタムCSS (ターミナル風)

### テスト
- Vitest (ユニットテスト)
- React Testing Library
- Playwright (E2Eテスト)

### デプロイメント
- AWS S3 (静的ホスティング)
- AWS CloudFront (CDN)
- カスタムデプロイスクリプト

### 開発ツール
- ESLint
- Prettier
- TypeScript
- Git hooks

## 📁 プロジェクト構造

```
akito-ando-portfolio/
├── src/                    # ソースコード
│   ├── components/         # Reactコンポーネント
│   ├── pages/             # ページコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── services/          # API サービス
│   ├── styles/            # スタイルシート
│   ├── utils/             # ユーティリティ関数
│   └── test/              # テスト設定
├── test/                  # テストファイル
│   ├── e2e/              # E2Eテスト (Playwright)
│   └── unit/             # ユニットテスト
├── docs/                  # コンテンツファイル
│   ├── content/          # Markdownコンテンツ
│   └── api/              # API データ
├── scripts/              # デプロイメントスクリプト
└── dist/                 # ビルド出力
```

## 🚦 開始方法

### 前提条件

- Node.js 18+
- npm または yarn
- Git

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/akito-ando/akito-ando-portfolio.git
cd akito-ando-portfolio

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集して適切な値を設定
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 📝 利用可能なスクリプト

### 開発
```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド結果のプレビュー
```

### Testing
```bash
npm run test         # Run unit tests with Vitest
npm run test:e2e     # Run E2E tests with Playwright
npm run test:e2e:ui  # Open Playwright test UI
```

### コード品質
```bash
npm run lint         # ESLintでコードチェック
npm run lint:fix     # ESLintで自動修正
npm run format       # Prettierでコードフォーマット
```

### デプロイメント
```bash
npm run deploy       # AWS S3にデプロイ
npm run deploy:prod  # 本番環境にデプロイ
```

## ☁️ AWS デプロイメント

### 準備

1. **AWS CLI の設定**
```bash
aws configure
```

2. **S3バケットの作成**
```bash
aws s3 mb s3://your-portfolio-bucket-name
```

3. **CloudFront ディストリビューションの作成** (オプション)

### 環境変数の設定

`.env` ファイルを作成し、以下の変数を設定:

```env
AWS_REGION=ap-northeast-1
S3_BUCKET_NAME=your-portfolio-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
```

### デプロイ実行

```bash
npm run build
npm run deploy
```

## 🧪 テスト

### ユニットテスト

```bash
npm run test
```

コンポーネントとフックの単体テストが実行されます。

### E2Eテスト

```bash
npm run test:e2e
```

実際のブラウザ環境でのエンドツーエンドテストが実行されます。

## 📖 コンテンツ管理

### プロフィール情報の更新

`docs/content/profile.md` を編集してプロフィール情報を更新できます。

### プロジェクト情報の更新

- GitHub API から自動取得される情報
- フォールバック用データは `docs/api/github.json` で管理

### 技術スキルの更新

`docs/content/skills.md` で技術スキル情報を管理できます。

## 🎨 カスタマイズ

### テーマの変更

`src/styles/index.css` でカラーテーマやスタイルを調整できます。

### コンポーネントの拡張

`src/components/` に新しいコンポーネントを追加して機能を拡張できます。

## 🤝 貢献

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 📞 お問い合わせ

Akito Ando - [@akito_ando_dev](https://twitter.com/akito_ando_dev) - akito.ando@example.com

プロジェクトリンク: [https://github.com/akito-ando/akito-ando-portfolio](https://github.com/akito-ando/akito-ando-portfolio)

## 🙏 謝辞

- [lilweb-template](https://github.com/Cod-e-Codes/lilweb-template) - デザインインスピレーション
- [React](https://reactjs.org/) - フロントエンドフレームワーク
- [Vite](https://vitejs.dev/) - 高速ビルドツール
- [Playwright](https://playwright.dev/) - E2Eテストフレームワーク