# 重機稼働予測ダッシュボード

本間解体工業様向けの重機稼働予測ダッシュボードのPoCプロジェクトです。

## 📋 目次

- [プロジェクト概要](#プロジェクト概要)
- [必要な環境](#必要な環境)
- [セットアップ手順](#セットアップ手順)
- [開発サーバーの起動](#開発サーバーの起動)
- [プロジェクト構造](#プロジェクト構造)
- [主要なコマンド](#主要なコマンド)
- [トラブルシューティング](#トラブルシューティング)

---

## プロジェクト概要

重機の稼働状況、コスト、故障リスクを可視化するダッシュボードです。

### 実装済み機能

- ✅ 全社サマリービュー（KPIカード、アラート）
- ✅ 重機一覧ビュー（テーブル形式）
- ✅ 稼働ランキングビュー（複数ランキング）
- ✅ 消耗品管理ビュー（グラフ、ランキング）
- ✅ コスト分析ビュー（グラフ、ランキング）
- ✅ モックデータ機能（デモ用）

### 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **グラフ**: Recharts
- **状態管理**: TanStack Query + Zustand
- **データベース**: PostgreSQL + Prisma（将来拡張）
- **データソース**: Google Sheets（PoC） / kintone（本番）

---

## 必要な環境

### 必須

- **Node.js**: 18以上（LTS推奨）
- **npm**: 9以上 または **pnpm**: 最新版
- **Git**: 最新版

### 推奨

- **PostgreSQL**: 15以上（将来拡張時）
- **VS Code**: 最新版（推奨エディタ）

---

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd honma_kaitai/dashboard
```

### 2. Node.jsのインストール確認

```bash
node --version  # v18以上であることを確認
npm --version   # 9以上であることを確認
```

**Node.jsがインストールされていない場合**:

**macOS (Homebrew)**:
```bash
brew install node@18
```

**または公式サイトから**:
- [Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロード

### 3. pnpmのインストール（推奨）

```bash
npm install -g pnpm
```

**確認**:
```bash
pnpm --version
```

**注意**: pnpmが使えない場合は、`npm`を使用してください（`package.json`のスクリプトは`npm run`でも動作します）

### 4. 依存関係のインストール

```bash
pnpm install
# または
npm install
```

### 5. 環境変数の設定

プロジェクトルート（`dashboard/`ディレクトリ）に `.env.local` ファイルを作成：

```env
# モックデータモード（デモ用）
USE_MOCK_DATA=true

# Google Sheets連携（実際のデータを使用する場合）
# GOOGLE_SHEETS_ID="your-spreadsheet-id"
# GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
# GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**デモモードで起動する場合**:
- `USE_MOCK_DATA=true` のみ設定すればOK
- Google Sheetsの設定は不要

**実際のデータを使用する場合**:
- `GOOGLE_SHEETS_SETUP.md` を参照してGoogle Sheetsを設定
- 上記の3つの環境変数を設定

### 6. 開発サーバーの起動

```bash
pnpm dev
# または
npm run dev
```

ブラウザで `http://localhost:3000` を開く

---

## 開発サーバーの起動

### 通常起動

```bash
pnpm dev
```

### ポートを指定して起動

```bash
pnpm dev -- -p 3001
```

### 本番ビルドの確認

```bash
pnpm build
pnpm start
```

---

## プロジェクト構造

```
dashboard/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # ダッシュボードページ
│   │   ├── page.tsx             # 全社サマリー
│   │   ├── machines/            # 重機一覧
│   │   ├── rankings/            # 稼働ランキング
│   │   ├── consumables/         # 消耗品管理
│   │   ├── cost-analysis/       # コスト分析
│   │   └── risk-analysis/       # 故障リスク分析
│   ├── api/                      # API Routes
│   │   ├── dashboard/           # ダッシュボードAPI
│   │   ├── machines/            # 重機API
│   │   ├── consumables/         # 消耗品API
│   │   └── cost/                # コストAPI
│   ├── layout.tsx                # ルートレイアウト
│   └── globals.css              # グローバルスタイル
├── components/                    # Reactコンポーネント
│   ├── ui/                      # shadcn/uiコンポーネント
│   ├── dashboard/               # ダッシュボード専用
│   └── layout/                  # レイアウトコンポーネント
├── lib/                          # ユーティリティ
│   ├── prisma.ts                # Prismaクライアント
│   ├── google-sheets.ts         # Google Sheets連携
│   ├── mock-data.ts             # モックデータ
│   └── utils.ts                 # 共通関数
├── types/                        # TypeScript型定義
├── prisma/                       # Prismaスキーマ
│   └── schema.prisma
├── scripts/                      # スクリプト
│   ├── sample-data.ts           # サンプルデータ生成
│   ├── create-sheets.ts         # Google Sheets自動作成
│   └── setup-google-sheets.ts   # Google Sheetsデータ投入
├── package.json                  # 依存関係
├── tsconfig.json                 # TypeScript設定
└── tailwind.config.ts           # Tailwind CSS設定
```

---

## 主要なコマンド

### 開発

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# リント
pnpm lint

# 型チェック
pnpm type-check
```

### データベース（将来拡張時）

```bash
# Prismaクライアント生成
pnpm db:generate

# マイグレーション
pnpm db:migrate

# Prisma Studio（データベースGUI）
pnpm db:studio
```

### Google Sheets（実際のデータを使用する場合）

```bash
# 新しいスプレッドシートを作成してサンプルデータを投入
pnpm sheets:create

# 既存のスプレッドシートにサンプルデータを投入
pnpm sheets:setup
```

---

## トラブルシューティング

### Node.jsが見つからない

**macOS (Homebrew)**:
```bash
brew install node@18
```

**PATHの確認**:
```bash
echo $PATH
which node
```

**ターミナルを再起動**:
- 新しいターミナルウィンドウを開く

### npm/pnpmが見つからない

**pnpmのインストール**:
```bash
npm install -g pnpm
```

**PATHの確認**:
```bash
which pnpm
```

### 依存関係のインストールエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
rm package-lock.json  # または pnpm-lock.yaml
pnpm install
```

### ポート3000が既に使用されている

```bash
# 別のポートで起動
pnpm dev -- -p 3001
```

### モックデータが表示されない

`.env.local`ファイルを確認：
```env
USE_MOCK_DATA=true
```

ファイルが正しい場所（`dashboard/.env.local`）にあるか確認：
```bash
ls -la .env.local
```

### ビルドエラー

```bash
# キャッシュを削除
rm -rf .next
pnpm dev
```

### TypeScriptエラー

```bash
# 型チェック
pnpm type-check
```

---

## よくある質問

### Q: デモモードと実際のデータモードの違いは？

**デモモード**:
- `.env.local`に`USE_MOCK_DATA=true`を設定
- Google Sheetsの設定不要
- サンプルデータで動作

**実際のデータモード**:
- Google Sheetsの設定が必要
- 実際のデータを取得・表示

### Q: Google Sheetsの設定は必須ですか？

**いいえ**。デモモード（`USE_MOCK_DATA=true`）で起動すれば、Google Sheetsの設定なしで動作します。

### Q: PostgreSQLは必要ですか？

**PoC段階では不要**です。将来拡張時に使用予定です。

### Q: どのブラウザで動作しますか？

- Chrome（推奨）
- Firefox
- Safari
- Edge

---

## 参考資料

### セットアップガイド

- **クイックスタート**: `QUICK_START.md`
- **詳細セットアップ**: `SETUP_CHECKLIST.md`
- **環境変数設定**: `環境変数設定ガイド.md`
- **Google Sheets設定**: `GOOGLE_SHEETS_QUICK_SETUP.md`

### 開発ドキュメント

- **要件定義**: `../PoC要件定義_重機稼働予測ダッシュボード.md`
- **データ設計**: `../データ設計書_重機稼働予測.md`
- **技術スタック**: `../技術スタック選定_重機稼働予測.md`
- **画面設計**: `../画面設計書_重機稼働予測.md`
- **開発スケジュール**: `開発スケジュール.md`

### トラブルシューティング

- **Node.js/npm問題**: `NODEJS_SETUP.md`
- **npmコマンド問題**: `FIX_NPM.md`
- **スケジュールバッファ**: `スケジュールバッファ説明.md`

---

## サポート

問題が発生した場合：

1. **トラブルシューティングセクション**を確認
2. **参考資料**を確認
3. エラーメッセージを確認
4. ターミナルのログを確認

---

## ライセンス

本間解体工業様専用
