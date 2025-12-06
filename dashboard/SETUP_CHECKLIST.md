# セットアップチェックリスト

## ✅ ステップ1: 開発環境のセットアップ

### Node.jsのインストール確認
```bash
node --version  # v18以上が必要
npm --version   # 9以上が必要
```

**未インストールの場合**:
- macOS: `brew install node@18` または [公式サイト](https://nodejs.org/)からインストール
- nvmを使用: `nvm install 18 && nvm use 18`

### pnpmのインストール（推奨）
```bash
npm install -g pnpm
```

または、npmを使用する場合は`package.json`のスクリプトを`npm run`に変更

---

## ✅ ステップ2: 依存関係のインストール

```bash
cd dashboard
pnpm install
# または
npm install
```

---

## ✅ ステップ3: Google Cloud プロジェクトの設定

### 3.1 プロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
   - プロジェクト名: `honma-kaitai-dashboard`（任意）
   - プロジェクトIDをメモ

### 3.2 APIの有効化
1. 「APIとサービス」→「ライブラリ」を開く
2. 以下を検索して有効化：
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**

### 3.3 サービスアカウントの作成
1. 「IAMと管理」→「サービスアカウント」を開く
2. 「サービスアカウントを作成」をクリック
3. 設定：
   - サービスアカウント名: `honma-kaitai-dashboard`
   - サービスアカウントID: 自動生成（メモ）
   - 説明: `重機稼働予測ダッシュボード用`
4. 「作成して続行」をクリック
5. ロール: 「編集者」を選択
6. 「完了」をクリック

### 3.4 サービスアカウントキーの作成
1. 作成したサービスアカウントをクリック
2. 「キー」タブを開く
3. 「キーを追加」→「新しいキーを作成」を選択
4. キーのタイプ: **JSON**
5. 「作成」をクリック
   - JSONファイルがダウンロードされる
   - このファイルは安全に保管してください

---

## ✅ ステップ4: 環境変数の設定

プロジェクトルート（`dashboard/`）に `.env.local` ファイルを作成：

```env
# Google Sheets (サービスアカウント情報)
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Sheets ID (後で設定)
GOOGLE_SHEETS_ID=""
```

**設定方法**:
1. ダウンロードしたJSONファイルを開く
2. `client_email`の値を`GOOGLE_SERVICE_ACCOUNT_EMAIL`に設定
3. `private_key`の値を`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`に設定
   - 改行文字（`\n`）はそのまま含める
   - 例: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"`

---

## ✅ ステップ5: Google Sheetsの作成

### 方法A: 自動作成（推奨）

```bash
cd dashboard
pnpm sheets:create
# または
npm run sheets:create
```

実行後、表示されるスプレッドシートIDを`.env.local`に追加：
```env
GOOGLE_SHEETS_ID="表示されたスプレッドシートID"
```

### 方法B: 手動作成

1. [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
2. 以下のシート（タブ）を作成：
   - **重機マスタ**
   - **稼働時間**
   - **メンテナンス**
   - **消耗品**
3. スプレッドシートのURLからIDを取得：
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
4. `.env.local`に追加：
   ```env
   GOOGLE_SHEETS_ID="your-spreadsheet-id"
   ```
5. スプレッドシートを共有：
   - 「共有」ボタンをクリック
   - サービスアカウントのメールアドレス（`GOOGLE_SERVICE_ACCOUNT_EMAIL`）を入力
   - 権限: 「編集者」を選択
   - 「送信」をクリック
6. サンプルデータを投入：
   ```bash
   pnpm sheets:setup
   # または
   npm run sheets:setup
   ```

---

## ✅ ステップ6: 動作確認

### 開発サーバーの起動
```bash
cd dashboard
pnpm dev
# または
npm run dev
```

### ブラウザで確認
1. `http://localhost:3000` を開く
2. ダッシュボードが表示されることを確認
3. データが読み込まれることを確認

---

## トラブルシューティング

### Node.jsが見つからない
- Node.jsをインストール: `brew install node@18` または [公式サイト](https://nodejs.org/)
- PATHを確認: `echo $PATH`

### pnpmが見つからない
- インストール: `npm install -g pnpm`
- または、npmを使用（`package.json`のスクリプトを`npm run`に変更）

### Google Sheets APIエラー
- APIが有効化されているか確認
- サービスアカウントの権限を確認
- スプレッドシートの共有設定を確認

### 環境変数エラー
- `.env.local`ファイルが正しい場所にあるか確認（`dashboard/`ディレクトリ）
- 環境変数の値が正しいか確認（特に改行文字`\n`）

---

## 次のステップ

セットアップが完了したら：
1. ✅ ダッシュボードでデータを確認
2. ⏭️ 追加機能の実装（重機一覧、故障リスク分析など）

