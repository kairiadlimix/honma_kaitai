# GitHubアップロード時のフォルダ構成について

## ⚠️ 重要：フォルダ構成は必須です

**フォルダ構成を維持する必要があります。** ファイルだけを個別にアップロードすると、プロジェクトが動作しません。

---

## 🔍 なぜフォルダ構成が必要か

### 1. Next.jsのApp Routerはフォルダ構造に依存

```
dashboard/
├── app/
│   ├── (dashboard)/      ← このフォルダ構造がルーティングを決定
│   │   └── page.tsx      ← / にアクセス
│   │   └── machines/
│   │       └── page.tsx  ← /machines にアクセス
│   └── api/
│       └── dashboard/
│           └── summary/
│               └── route.ts  ← /api/dashboard/summary にアクセス
```

**フォルダ構造がないと**:
- ルーティングが機能しない
- ページが表示されない
- APIエンドポイントが動作しない

### 2. インポートパスがフォルダ構造に依存

```typescript
// app/(dashboard)/page.tsx
import { DashboardSummary } from '@/types';  // types/index.ts を参照
import { KPICard } from '@/components/dashboard/kpi-card';  // components/dashboard/kpi-card.tsx を参照
```

**`@/`エイリアス**は`tsconfig.json`で定義されています：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]  // ルートからの相対パス
    }
  }
}
```

**フォルダ構造がないと**:
- インポートエラーが発生
- TypeScriptのコンパイルエラー
- アプリケーションが起動しない

### 3. 他の開発者がクローンした時に動作しない

```bash
# 他の開発者がクローン
git clone https://github.com/kairiadlimix/honma_kaitai.git
cd honma_kaitai/dashboard
npm install
npm run dev  # ← エラーになる！
```

**フォルダ構造がないと**:
- `npm run dev`が失敗
- ビルドエラー
- 開発環境が構築できない

---

## ✅ 正しいアップロード方法

### 方法1: Gitコマンドを使う（推奨・自動的にフォルダ構造が維持される）

```bash
cd /Users/kairi.oshima/honma_kaitai
git add .
git commit -m "Initial commit"
git push -u origin main
```

**メリット**:
- フォルダ構造が自動的に維持される
- 一度のコマンドで完了
- 確実

### 方法2: GitHub WebUIでフォルダごとドラッグ&ドロップ

1. Finderで`dashboard`フォルダを開く
2. フォルダ全体をドラッグ
3. GitHubのアップロード画面にドロップ
4. フォルダ構造が自動的に保持される

**メリット**:
- コマンドライン不要
- フォルダ構造が維持される

### 方法3: GitHub WebUIでファイルを個別にアップロード（非推奨・時間がかかる）

1. 「Add file」→「Create new file」をクリック
2. ファイルパスに`dashboard/app/page.tsx`のように入力
   - スラッシュ（`/`）を含めると、自動的にフォルダが作成される
3. ファイル内容をコピー&ペースト
4. すべてのファイルを繰り返す

**デメリット**:
- 時間がかかる（数百ファイル）
- ミスしやすい
- フォルダ構造を手動で維持する必要がある

---

## 📋 必要なフォルダ構造

### 必須フォルダ

```
dashboard/
├── app/                    ✅ 必須（Next.jsのページ）
│   ├── (dashboard)/        ✅ 必須（ルーティング）
│   └── api/                ✅ 必須（APIエンドポイント）
├── components/             ✅ 必須（Reactコンポーネント）
│   ├── dashboard/          ✅ 必須
│   ├── layout/              ✅ 必須
│   └── ui/                 ✅ 必須
├── lib/                    ✅ 必須（ユーティリティ関数）
├── types/                  ✅ 必須（型定義）
├── prisma/                 ✅ 必須（データベーススキーマ）
└── scripts/                ⚠️ 推奨（セットアップスクリプト）
```

### 設定ファイル（ルートに必要）

```
dashboard/
├── package.json            ✅ 必須
├── tsconfig.json           ✅ 必須（パスエイリアス定義）
├── tailwind.config.ts      ✅ 必須
├── next.config.js          ✅ 必須
└── .gitignore              ✅ 必須
```

---

## ❌ 間違ったアップロード方法

### 例：ファイルをフラットにアップロード

```
dashboard/
├── page.tsx
├── kpi-card.tsx
├── mock-data.ts
└── index.ts
```

**問題点**:
- インポートパスが機能しない
- ルーティングが機能しない
- プロジェクトが動作しない

---

## 🎯 結論

### フォルダ構成は必須です

- ✅ **Gitコマンドを使う**: 自動的にフォルダ構造が維持される
- ✅ **フォルダごとドラッグ&ドロップ**: フォルダ構造が維持される
- ❌ **ファイルを個別にアップロード**: 時間がかかり、ミスしやすい

### 推奨方法

**Gitコマンドを使う**のが最も確実です：

```bash
cd /Users/kairi.oshima/honma_kaitai
git push -u origin main
```

これで、フォルダ構造がそのままGitHubにアップロードされます。

---

## 📚 参考

- [Next.js公式ドキュメント - App Router](https://nextjs.org/docs/app)
- [TypeScript公式ドキュメント - Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)

