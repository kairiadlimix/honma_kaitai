# 重機稼働予測ダッシュボード

本間解体工業様向けの重機稼働予測ダッシュボードのPoCプロジェクトです。

## 📋 プロジェクト概要

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

## 🚀 クイックスタート

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/kairiadlimix/honma_kaitai.git
cd honma_kaitai/dashboard

# 依存関係のインストール
npm install
# または
pnpm install

# 環境変数の設定
echo "USE_MOCK_DATA=true" > .env.local

# 開発サーバー起動
npm run dev
# または
pnpm dev
```

ブラウザで `http://localhost:3000` を開く

---

## 📁 プロジェクト構造

```
honma_kaitai/
├── dashboard/              # ダッシュボードアプリケーション
│   ├── app/               # Next.js App Router
│   ├── components/        # Reactコンポーネント
│   ├── lib/               # ユーティリティ
│   ├── types/             # TypeScript型定義
│   └── README.md          # 詳細なドキュメント
└── README.md              # このファイル
```

---

## 📚 詳細ドキュメント

詳細なセットアップ手順や開発ガイドは、`dashboard/README.md`を参照してください。

---

## 📝 ライセンス

本間解体工業様専用
