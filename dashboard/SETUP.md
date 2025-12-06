# セットアップ手順

## 1. 必要なツールのインストール

### Node.js (18+)
```bash
# Homebrewを使用
brew install node@18

# または nvm を使用
nvm install 18
nvm use 18
```

### pnpm
```bash
npm install -g pnpm
```

### PostgreSQL
```bash
brew install postgresql@15
brew services start postgresql@15
createdb honma_kaitai_dev
```

## 2. プロジェクトのセットアップ

### 依存関係のインストール
```bash
cd dashboard
pnpm install
```

### 環境変数の設定

`.env.local` ファイルを作成:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/honma_kaitai_dev"

# kintone (将来使用)
KINTONE_BASE_URL=""
KINTONE_API_TOKEN=""

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**注意**: `user` と `password` を実際のPostgreSQLの認証情報に置き換えてください。

### Prismaのセットアップ

```bash
# Prismaクライアントの生成
pnpm db:generate

# データベースマイグレーション
pnpm db:migrate
```

## 3. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` を開いて確認してください。

## 4. 次のステップ

1. shadcn/uiコンポーネントの追加
2. レイアウトコンポーネントの実装
3. APIエンドポイントの実装
4. ダッシュボード画面の実装

