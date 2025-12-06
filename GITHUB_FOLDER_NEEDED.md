# GitHubアップロード時のフォルダ必要性チェック

## 📁 各フォルダの必要性

### ✅ **types/** - **必須**

**理由**:
- TypeScriptの型定義が含まれている
- 複数のファイルでインポートされている
- 型定義がないとコンパイルエラーが発生する

**使用箇所**:
```typescript
// app/(dashboard)/page.tsx
import { DashboardSummary } from '@/types';

// lib/mock-data.ts
import { DashboardSummary, Machine, OperationHour, Maintenance, Consumable } from '@/types';

// lib/mock-consumables.ts
import { Consumable } from '@/types';
```

**結論**: **必ずアップロードしてください** ❌ 削除するとエラーになります

---

### ⚠️ **scripts/** - **推奨（開発に便利）**

**内容**:
- `scripts/sample-data.ts`: サンプルデータ生成
- `scripts/create-sheets.ts`: Google Sheets自動作成スクリプト
- `scripts/setup-google-sheets.ts`: Google Sheetsデータ投入スクリプト

**使用箇所**:
```json
// package.json
{
  "scripts": {
    "sheets:create": "tsx scripts/create-sheets.ts",
    "sheets:setup": "tsx scripts/setup-google-sheets.ts"
  }
}
```

**結論**: 
- **アプリケーションの実行には不要**（削除しても動作する）
- **開発・セットアップには便利**（Google Sheetsのセットアップ時に使用）
- **推奨**: アップロードしておくと、他の開発者がセットアップしやすい

---

## 📋 アップロード推奨リスト

### 必須フォルダ（削除するとエラー）

```
dashboard/
├── app/              ✅ 必須（Next.jsのページ）
├── components/       ✅ 必須（Reactコンポーネント）
├── lib/              ✅ 必須（ユーティリティ関数）
├── types/            ✅ 必須（型定義）
├── prisma/           ✅ 必須（データベーススキーマ）
└── package.json      ✅ 必須（依存関係定義）
```

### 推奨フォルダ（開発に便利）

```
dashboard/
├── scripts/          ⚠️ 推奨（セットアップスクリプト）
└── README.md         ⚠️ 推奨（ドキュメント）
```

### 不要なフォルダ（アップロードしない）

```
dashboard/
├── node_modules/     ❌ 不要（npm installで生成）
├── .next/            ❌ 不要（ビルド成果物）
├── .env.local        ❌ 不要（機密情報）
└── .DS_Store         ❌ 不要（macOSシステムファイル）
```

---

## 🎯 結論

### types/ フォルダ
- **必須**: アップロードしてください
- 削除するとTypeScriptのコンパイルエラーが発生します

### scripts/ フォルダ
- **推奨**: アップロードしておくと便利です
- 削除してもアプリケーションは動作しますが、セットアップが面倒になります

---

## 💡 推奨アップロード内容

### 最小構成（動作に必要な最小限）

```
dashboard/
├── app/
├── components/
├── lib/
├── types/          ← 必須
├── prisma/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### 推奨構成（開発しやすい構成）

```
dashboard/
├── app/
├── components/
├── lib/
├── types/          ← 必須
├── scripts/        ← 推奨
├── prisma/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md       ← 推奨
└── 各種ドキュメント
```

---

## ⚠️ 注意事項

### types/を削除した場合

```bash
# エラー例
Error: Cannot find module '@/types' or its corresponding type declarations.
```

### scripts/を削除した場合

```bash
# エラー例（npm run sheets:createを実行した場合）
Error: Cannot find module './scripts/create-sheets.ts'
```

ただし、アプリケーションの実行（`npm run dev`）には影響しません。

---

## 📝 まとめ

| フォルダ | 必要性 | 理由 |
|---------|--------|------|
| `types/` | **必須** ✅ | 型定義がないとコンパイルエラー |
| `scripts/` | **推奨** ⚠️ | 開発・セットアップに便利だが、実行には不要 |

**推奨**: 両方ともアップロードしておくことをお勧めします。

