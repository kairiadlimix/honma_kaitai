# Google Sheets クイックセットアップガイド

## 方法1: 自動セットアップ（推奨）

### ステップ1: Google Cloud プロジェクトの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（例: `honma-kaitai-dashboard`）
3. 「APIとサービス」→「ライブラリ」から以下を有効化：
   - **Google Sheets API**
   - **Google Drive API**

### ステップ2: サービスアカウントの作成

1. 「IAMと管理」→「サービスアカウント」を開く
2. 「サービスアカウントを作成」をクリック
3. サービスアカウント名を入力（例: `honma-kaitai-dashboard`）
4. 「作成して続行」をクリック
5. ロールは「編集者」を選択
6. 「完了」をクリック

### ステップ3: サービスアカウントキーの作成

1. 作成したサービスアカウントをクリック
2. 「キー」タブを開く
3. 「キーを追加」→「新しいキーを作成」を選択
4. キーのタイプ: **JSON**
5. 「作成」をクリック（JSONファイルがダウンロードされる）

### ステップ4: 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
# Google Sheets (サービスアカウント情報)
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**注意**: 
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`は、ダウンロードしたJSONファイルの`client_email`の値
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`は、JSONファイルの`private_key`の値をそのまま設定（改行文字`\n`を含む）

### ステップ5: スプレッドシートの自動作成

```bash
cd dashboard
pnpm install
pnpm sheets:create
```

このコマンドで以下が自動実行されます：
1. 新しいGoogle Sheetsを作成
2. 必要なシート（重機マスタ、稼働時間、メンテナンス、消耗品）を作成
3. サンプルデータを投入
4. スプレッドシートIDを表示

### ステップ6: スプレッドシートIDを環境変数に追加

`.env.local`に以下を追加：

```env
GOOGLE_SHEETS_ID="表示されたスプレッドシートID"
```

---

## 方法2: 既存のスプレッドシートにデータ投入

既にGoogle Sheetsを作成している場合：

### ステップ1-4: 上記と同じ

### ステップ5: スプレッドシートの共有設定

1. Google Sheetsのスプレッドシートを開く
2. 「共有」ボタンをクリック
3. サービスアカウントのメールアドレス（`GOOGLE_SERVICE_ACCOUNT_EMAIL`）を入力
4. 権限: 「編集者」を選択
5. 「送信」をクリック

### ステップ6: スプレッドシートIDを取得

スプレッドシートのURLからIDを取得：
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

`.env.local`に追加：
```env
GOOGLE_SHEETS_ID="your-spreadsheet-id"
```

### ステップ7: 必要なシートを作成

Google Sheetsで以下のシート（タブ）を作成：
- **重機マスタ**
- **稼働時間**
- **メンテナンス**
- **消耗品**

### ステップ8: サンプルデータを投入

```bash
cd dashboard
pnpm install
pnpm sheets:setup
```

---

## サンプルデータの内容

### 重機マスタ
- 15台の重機（コベルコ8台、日立7台）
- 管理番号、シリアル番号、メーカー、重機クラスなど

### 稼働時間
- 過去6ヶ月分の日次稼働時間データ
- 各重機の稼働時間、アイドリング時間、累計稼働時間

### メンテナンス
- 過去6ヶ月分のメンテナンス記録
- 各重機、月1-2回のメンテナンス
- 特自検、オイル交換、部品交換など

### 消耗品
- 過去6ヶ月分の消耗品使用記録
- オイル、フィルター、グリスなど
- 使用量、単価、総コスト

---

## 動作確認

1. 開発サーバーを起動：
```bash
pnpm dev
```

2. ブラウザで `http://localhost:3000` を開く

3. ダッシュボードが表示され、データが読み込まれることを確認

---

## トラブルシューティング

### エラー: "GOOGLE_SHEETS_ID is not set"
- `.env.local`に`GOOGLE_SHEETS_ID`が設定されているか確認

### エラー: "The caller does not have permission"
- サービスアカウントにスプレッドシートの共有権限が付与されているか確認
- サービスアカウントのメールアドレスが正しいか確認

### エラー: "Invalid credentials"
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`の値が正しいか確認
- 改行文字（`\n`）が含まれているか確認
- JSONファイルの`private_key`フィールドをそのまま使用

### エラー: "API not enabled"
- Google Cloud Consoleで「Google Sheets API」と「Google Drive API」が有効化されているか確認

---

## 次のステップ

セットアップが完了したら、ダッシュボードでデータを確認できます。

追加の機能実装：
- 重機一覧画面
- 故障リスク分析
- 稼働ランキング
- 消耗品管理
- コスト分析

