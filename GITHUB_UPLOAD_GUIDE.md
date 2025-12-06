# GitHubアップロードガイド

## 📦 アップロードすべきファイル

### ✅ dashboard/ ディレクトリ（プロジェクト本体）

**必須ファイル**:
```
dashboard/
├── app/                    # ✅ アップロード
├── components/             # ✅ アップロード
├── lib/                    # ✅ アップロード
├── types/                  # ✅ アップロード
├── prisma/                 # ✅ アップロード（schema.prisma）
├── scripts/                # ✅ アップロード
├── package.json            # ✅ アップロード
├── package-lock.json       # ✅ アップロード（またはpnpm-lock.yaml）
├── tsconfig.json           # ✅ アップロード
├── tailwind.config.ts       # ✅ アップロード
├── next.config.js          # ✅ アップロード
├── postcss.config.js       # ✅ アップロード
├── .eslintrc.json         # ✅ アップロード
├── .gitignore             # ✅ アップロード
├── README.md              # ✅ アップロード
├── QUICK_START.md         # ✅ アップロード
├── SETUP_CHECKLIST.md     # ✅ アップロード
├── GOOGLE_SHEETS_QUICK_SETUP.md  # ✅ アップロード
└── 開発スケジュール.md     # ✅ アップロード
```

**ドキュメントファイル（推奨）**:
```
dashboard/
├── SETUP.md               # ✅ アップロード
├── TROUBLESHOOTING.md     # ✅ アップロード
├── NODEJS_SETUP.md        # ✅ アップロード
├── FIX_NPM.md             # ✅ アップロード
├── デモモード起動方法.md   # ✅ アップロード
├── 環境変数設定ガイド.md   # ✅ アップロード
└── スケジュールバッファ説明.md  # ✅ アップロード
```

### ✅ プロジェクトルートのドキュメント

```
honma_kaitai/
├── PoC要件定義_重機稼働予測ダッシュボード.md  # ✅ アップロード
├── データ設計書_重機稼働予測.md              # ✅ アップロード
├── 技術スタック選定_重機稼働予測.md          # ✅ アップロード
├── 画面設計書_重機稼働予測.md                # ✅ アップロード
├── お客様向け資料作成プロンプト.md            # ✅ アップロード
├── お客様向け資料作成プロンプト_A4版.md      # ✅ アップロード
└── hearing_sheet.csv                        # ✅ アップロード（参考資料）
```

---

## ❌ アップロードすべきでないファイル

### 環境固有のファイル

```
dashboard/
├── .env.local             # ❌ アップロード禁止（機密情報）
├── .env                   # ❌ アップロード禁止
├── .env.*.local           # ❌ アップロード禁止
└── node_modules/          # ❌ アップロード禁止（npm installで生成）
```

### ビルド成果物

```
dashboard/
├── .next/                 # ❌ アップロード禁止（ビルド成果物）
├── out/                   # ❌ アップロード禁止（ビルド成果物）
├── build/                 # ❌ アップロード禁止（ビルド成果物）
└── dist/                  # ❌ アップロード禁止（ビルド成果物）
```

### システムファイル

```
dashboard/
├── .DS_Store              # ❌ アップロード禁止（macOS）
├── *.log                  # ❌ アップロード禁止（ログファイル）
└── .vscode/               # ❌ アップロード禁止（エディタ設定、任意）
```

### 機密情報を含む可能性のあるファイル

```
honma_kaitai/
├── *.pdf                  # ⚠️ 要確認（機密情報が含まれる可能性）
└── 本間解体工業_*.pdf     # ⚠️ 要確認（機密情報が含まれる可能性）
```

---

## 📝 .gitignore の確認

現在の`.gitignore`に以下が含まれていることを確認：

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma/migrations
```

---

## 🚀 GitHubへのアップロード手順

### 1. リポジトリの初期化（初回のみ）

```bash
cd /Users/kairi.oshima/honma_kaitai
git init
```

### 2. .gitignoreの確認

```bash
# dashboard/.gitignoreが正しく設定されているか確認
cat dashboard/.gitignore
```

### 3. ファイルの追加

```bash
# すべてのファイルをステージング
git add .

# または、特定のファイルのみ追加
git add dashboard/
git add *.md
git add hearing_sheet.csv
```

### 4. コミット

```bash
git commit -m "Initial commit: 重機稼働予測ダッシュボード PoC"
```

### 5. GitHubリポジトリの作成とプッシュ

```bash
# GitHubでリポジトリを作成後
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

---

## 📋 アップロード前のチェックリスト

### ✅ 必須チェック

- [ ] `.env.local`が`.gitignore`に含まれている
- [ ] `node_modules/`が`.gitignore`に含まれている
- [ ] `.next/`が`.gitignore`に含まれている
- [ ] 機密情報（APIキー、パスワード）が含まれていない
- [ ] PDFファイルに機密情報が含まれていないか確認

### ✅ 推奨チェック

- [ ] `README.md`が最新の状態
- [ ] ドキュメントファイルが含まれている
- [ ] `.gitignore`が適切に設定されている
- [ ] 不要なファイルが含まれていない

---

## 🔒 セキュリティチェック

### 機密情報の確認

以下のファイルに機密情報が含まれていないか確認：

```bash
# .env.localファイルの確認（アップロードされないことを確認）
git status | grep .env

# 機密情報が含まれていないか確認
grep -r "GOOGLE_SERVICE_ACCOUNT" dashboard/
grep -r "PRIVATE_KEY" dashboard/
grep -r "API_TOKEN" dashboard/
```

### コミット前の確認

```bash
# ステージングされたファイルを確認
git status

# 変更内容を確認
git diff --cached
```

---

## 📁 推奨リポジトリ構造

```
honma_kaitai/
├── README.md                          # プロジェクト全体の説明
├── dashboard/                         # ダッシュボードプロジェクト
│   ├── README.md                     # ダッシュボードのREADME
│   ├── package.json
│   ├── .gitignore
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── PoC要件定義_重機稼働予測ダッシュボード.md
├── データ設計書_重機稼働予測.md
├── 技術スタック選定_重機稼働予測.md
├── 画面設計書_重機稼働予測.md
└── hearing_sheet.csv
```

---

## ⚠️ 注意事項

### 1. 機密情報の取り扱い

- **絶対にアップロードしない**:
  - `.env.local`
  - APIキー、パスワード
  - サービスアカウントキー（JSONファイル）

- **要確認**:
  - PDFファイル（機密情報が含まれる可能性）
  - 設定ファイル（機密情報が含まれていないか）

### 2. 大容量ファイル

- `node_modules/`はアップロードしない（`.gitignore`に含める）
- ビルド成果物（`.next/`）はアップロードしない

### 3. ライセンス

- プロジェクトのライセンスを明確にする
- 本間解体工業様専用の場合は、READMEに記載

---

## 🎯 クイックチェックコマンド

```bash
# アップロードされるファイルを確認
git ls-files

# .gitignoreで除外されているファイルを確認
git status --ignored

# 機密情報が含まれていないか確認
git diff --cached | grep -i "password\|token\|key\|secret"
```

---

## 📚 参考

- [GitHub公式ドキュメント](https://docs.github.com/)
- [.gitignoreのベストプラクティス](https://github.com/github/gitignore)

