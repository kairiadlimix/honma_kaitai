# 次のステップ

## ✅ 完了したこと
- ✅ Node.js/npmのセットアップ
- ✅ 依存関係のインストール（`npm install`完了）

## 📝 表示された警告について

### Deprecated Warnings（非推奨警告）
表示された警告は**無視して問題ありません**。これらは：
- 古いパッケージの警告
- 動作には影響しない
- 将来的に更新することを推奨しているだけ

### npmバージョン更新通知
- 現在: npm 10.8.2
- 最新: npm 11.6.4

**更新は任意です**。現在のバージョンで問題なく動作します。
更新する場合：
```bash
npm install -g npm@11.6.4
```

## 🚀 次のステップ

### 1. Google Cloud プロジェクトの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. 「APIとサービス」→「ライブラリ」から以下を有効化：
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**

### 2. サービスアカウントの作成

1. 「IAMと管理」→「サービスアカウント」を開く
2. 「サービスアカウントを作成」
3. 設定：
   - 名前: `honma-kaitai-dashboard`
   - ロール: 「編集者」
4. 「キーを追加」→「JSON」でキーをダウンロード

### 3. 環境変数の設定

`dashboard/.env.local`ファイルを作成：

```env
# Google Sheets (サービスアカウント情報)
GOOGLE_SERVICE_ACCOUNT_EMAIL="ダウンロードしたJSONのclient_email"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="ダウンロードしたJSONのprivate_key（\nを含む）"

# Google Sheets ID (後で設定)
GOOGLE_SHEETS_ID=""
```

**JSONファイルの例**:
```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@project.iam.gserviceaccount.com",
  ...
}
```

### 4. Google Sheetsの作成

```bash
cd /Users/kairi.oshima/honma_kaitai/dashboard
npm run sheets:create
```

実行後、表示されるスプレッドシートIDを`.env.local`に追加：
```env
GOOGLE_SHEETS_ID="表示されたID"
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## 📚 参考ドキュメント

- **クイックスタート**: `QUICK_START.md`
- **詳細セットアップ**: `SETUP_CHECKLIST.md`
- **Google Sheets設定**: `GOOGLE_SHEETS_QUICK_SETUP.md`

