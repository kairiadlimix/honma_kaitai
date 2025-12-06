# クイックスタートガイド

## 最小限のセットアップ手順

### 1. Node.jsのインストール（未インストールの場合）

**macOS (Homebrew)**:
```bash
brew install node@18
```

**または公式サイトから**:
- [Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロード

**確認**:
```bash
node --version  # v18以上
npm --version   # 9以上
```

---

### 2. 依存関係のインストール

**まず、正しいディレクトリに移動**:
```bash
# 現在のディレクトリを確認
pwd

# dashboardディレクトリに移動（絶対パス推奨）
cd /Users/kairi.oshima/honma_kaitai/dashboard

# または、honma_kaitaiディレクトリにいる場合
cd dashboard
```

**依存関係をインストール**:
```bash
npm install
```

**確認**: `package.json`ファイルがあることを確認
```bash
ls package.json
```

**注意**: `pnpm`を使用する場合は `npm install -g pnpm` でインストール後、`pnpm install` を実行

---

### 3. Google Cloud セットアップ（5分）

#### 3.1 プロジェクト作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成

#### 3.2 API有効化
- 「APIとサービス」→「ライブラリ」
- 「Google Sheets API」を検索して有効化
- 「Google Drive API」を検索して有効化

#### 3.3 サービスアカウント作成
1. 「IAMと管理」→「サービスアカウント」
2. 「サービスアカウントを作成」
3. 名前: `honma-kaitai-dashboard`
4. ロール: 「編集者」
5. 「キーを追加」→「JSON」でキーをダウンロード

---

### 4. 環境変数の設定

`dashboard/.env.local`を作成：

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL="ダウンロードしたJSONのclient_email"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="ダウンロードしたJSONのprivate_key（\nを含む）"
```

**JSONファイルの例**:
```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@project.iam.gserviceaccount.com",
  ...
}
```

---

### 5. Google Sheetsの作成

```bash
cd dashboard
npm run sheets:create
```

実行後、表示されるスプレッドシートIDを`.env.local`に追加：
```env
GOOGLE_SHEETS_ID="表示されたID"
```

---

### 6. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

---

## 完了！

ダッシュボードが表示され、サンプルデータが読み込まれていれば成功です。

## 問題が発生した場合

詳細は `SETUP_CHECKLIST.md` を参照してください。

