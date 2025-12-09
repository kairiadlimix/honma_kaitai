# ダッシュボードのデプロイメントガイド

ローカルでしか動かないダッシュボードを、誰でも見られるように公開する方法です。

---

## 🚀 推奨方法：Vercel（最も簡単）

VercelはNext.jsの開発元が提供するホスティングサービスで、Next.jsアプリケーションのデプロイに最適です。

### メリット

- ✅ **無料プランあり**（個人・小規模プロジェクト向け）
- ✅ **自動デプロイ**（GitHubにプッシュするだけで自動デプロイ）
- ✅ **HTTPS対応**（SSL証明書が自動で設定される）
- ✅ **カスタムドメイン対応**
- ✅ **環境変数の簡単な設定**
- ✅ **プレビュー環境**（プルリクエストごとに自動生成）

---

## 📋 デプロイ手順（Vercel）

### ステップ1: Vercelアカウントの作成

1. **Vercelにアクセス**
   - https://vercel.com にアクセス

2. **アカウント作成**
   - 「Sign Up」をクリック
   - 「Continue with GitHub」を選択（推奨）
   - GitHubアカウントでログイン

### ステップ2: プロジェクトをインポート

1. **ダッシュボードに移動**
   - Vercelのダッシュボードで「Add New...」→「Project」をクリック

2. **GitHubリポジトリを選択**
   - GitHubリポジトリ一覧から `MATLyS-Co-Ltd/honma-kaitai-dashboard` を選択
   - または、`kairiadlimix/honma_kaitai` を選択

3. **プロジェクト設定**
   - **Framework Preset**: Next.js（自動検出される）
   - **Root Directory**: `dashboard` を指定
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
   - **Install Command**: `npm install`（デフォルト）

4. **環境変数の設定**
   - 「Environment Variables」セクションを開く
   - 以下の環境変数を追加：
     ```
     USE_MOCK_DATA=true
     ```
   - 実際のデータを使用する場合：
     ```
     GOOGLE_SHEETS_ID=your-spreadsheet-id
     GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
     GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
     ```

5. **デプロイ**
   - 「Deploy」をクリック
   - 数分でデプロイが完了します

### ステップ3: デプロイ完了後の確認

1. **デプロイURLを確認**
   - デプロイが完了すると、以下のようなURLが表示されます：
     ```
     https://honma-kaitai-dashboard.vercel.app
     ```
   - または、カスタムドメインを設定できます

2. **動作確認**
   - ブラウザでURLにアクセス
   - ダッシュボードが表示されることを確認

---

## 🔄 自動デプロイの設定

### GitHubにプッシュするだけで自動デプロイ

1. **VercelとGitHubの連携**
   - 初回デプロイ時に自動で連携されます

2. **自動デプロイの動作**
   - `main`ブランチにプッシュ → 本番環境に自動デプロイ
   - 他のブランチにプッシュ → プレビュー環境が自動生成

3. **デプロイ通知**
   - GitHubのコミットにデプロイステータスが表示されます
   - メール通知も設定可能

---

## 🌐 カスタムドメインの設定（オプション）

### ステップ1: ドメインを追加

1. **Vercelダッシュボードでプロジェクトを開く**
2. **Settings → Domains**
3. **ドメインを入力**
   - 例: `dashboard.honma-kaitai.com`
4. **DNS設定を確認**
   - Vercelが提供するDNSレコードをドメインのDNS設定に追加

### ステップ2: SSL証明書

- Vercelが自動でSSL証明書を発行・設定します
- HTTPSが自動で有効になります

---

## 🔧 環境変数の管理

### 本番環境の環境変数

1. **Vercelダッシュボードでプロジェクトを開く**
2. **Settings → Environment Variables**
3. **環境変数を追加**
   - Production, Preview, Development それぞれに設定可能

### 機密情報の取り扱い

- `.env.local`はGitHubにアップロードしない（`.gitignore`に含まれている）
- 機密情報はVercelの環境変数で管理

---

## 📊 デプロイ状況の確認

### Vercelダッシュボード

- デプロイ履歴の確認
- ログの確認
- パフォーマンスの確認

### GitHubとの連携

- コミットごとのデプロイ状況
- プルリクエストごとのプレビュー環境

---

## 🔄 その他のデプロイ方法

### Netlify

1. **Netlifyにアクセス**
   - https://www.netlify.com

2. **GitHubリポジトリと連携**
   - 「New site from Git」を選択
   - GitHubリポジトリを選択

3. **ビルド設定**
   - Build command: `cd dashboard && npm run build`
   - Publish directory: `dashboard/.next`

### Railway

1. **Railwayにアクセス**
   - https://railway.app

2. **GitHubリポジトリと連携**
   - 「New Project」→「Deploy from GitHub repo」

3. **環境変数の設定**
   - 環境変数を設定してデプロイ

### AWS/Azure（既存環境を活用）

既存のAWS/Azure環境がある場合：

1. **Dockerコンテナ化**
   - `Dockerfile`を作成
   - コンテナイメージをビルド

2. **クラウドサービスにデプロイ**
   - AWS: ECS, App Runner, Elastic Beanstalk
   - Azure: App Service, Container Instances

---

## ⚠️ 注意事項

### 無料プランの制限

- **Vercel**: 
  - 帯域幅: 100GB/月
  - 関数実行時間: 100GB-時間/月
  - 通常のPoC用途であれば十分

### セキュリティ

- 環境変数に機密情報を設定
- `.env.local`をGitHubにアップロードしない
- 本番環境では適切な認証を実装

### パフォーマンス

- 初回アクセス時にビルドが実行される場合がある
- キャッシュを活用してパフォーマンスを向上

---

## 📚 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式ドキュメント - Deployment](https://nextjs.org/docs/deployment)
- [Vercel - Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)

---

## 🎯 クイックスタート（Vercel）

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. 「Add New...」→「Project」
4. リポジトリを選択
5. Root Directory: `dashboard` を指定
6. 環境変数: `USE_MOCK_DATA=true` を追加
7. 「Deploy」をクリック
8. 完了！

数分で、誰でもアクセスできるURLが生成されます。


