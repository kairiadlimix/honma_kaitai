# Gitでフォルダ内のファイルを追加する方法

## 📁 フォルダ内のファイルを追加する方法

### 方法1: フォルダを指定して追加（推奨）

```bash
# dashboardフォルダ全体を追加
git add dashboard/

# 複数のフォルダを追加
git add dashboard/ docs/
```

**ポイント**: フォルダを指定すると、そのフォルダ内のすべてのファイルとサブフォルダが再帰的に追加されます。

### 方法2: すべてのファイルを一度に追加

```bash
# カレントディレクトリ以下のすべてのファイルを追加
git add .

# または、プロジェクトルートから
cd /Users/kairi.oshima/honma_kaitai
git add .
```

**注意**: `.gitignore`で除外されているファイル（`node_modules/`、`.env.local`など）は自動的に除外されます。

### 方法3: 特定のファイルタイプのみ追加

```bash
# すべてのMarkdownファイルを追加
git add *.md

# すべてのTypeScriptファイルを追加
git add **/*.ts

# すべてのJSONファイルを追加
git add **/*.json
```

### 方法4: インタラクティブに追加

```bash
# 対話的にファイルを選択
git add -i

# または、パッチモード（変更の一部のみ追加）
git add -p
```

---

## 🎯 実際の手順（このプロジェクトの場合）

### ステップ1: Gitリポジトリの初期化（初回のみ）

```bash
cd /Users/kairi.oshima/honma_kaitai
git init
```

### ステップ2: ファイルを追加

```bash
# すべてのファイルを追加（.gitignoreで除外されるものは自動的に除外）
git add .
```

### ステップ3: 追加されたファイルを確認

```bash
# ステージングされたファイルを確認
git status

# より詳細に確認
git status --short

# 追加されたファイルの一覧を表示
git ls-files --cached
```

### ステップ4: 除外されているファイルを確認

```bash
# .gitignoreで除外されているファイルを確認
git status --ignored
```

---

## 📋 よくあるパターン

### パターン1: dashboardフォルダのみ追加

```bash
git add dashboard/
```

### パターン2: ドキュメントファイルのみ追加

```bash
git add *.md
git add dashboard/*.md
```

### パターン3: 設定ファイルのみ追加

```bash
git add dashboard/package.json
git add dashboard/tsconfig.json
git add dashboard/tailwind.config.ts
```

### パターン4: コードファイルのみ追加（ドキュメント除外）

```bash
# app/、components/、lib/フォルダのみ追加
git add dashboard/app/
git add dashboard/components/
git add dashboard/lib/
git add dashboard/types/
```

---

## ⚠️ 注意事項

### 1. .gitignoreの確認

追加する前に、`.gitignore`が正しく設定されているか確認：

```bash
# dashboard/.gitignoreを確認
cat dashboard/.gitignore

# プロジェクトルートの.gitignoreを確認
cat .gitignore
```

### 2. 機密情報の確認

機密情報が含まれていないか確認：

```bash
# .envファイルが追加されていないか確認
git status | grep .env

# 機密情報が含まれていないか確認
git diff --cached | grep -i "password\|token\|key\|secret"
```

### 3. 大容量ファイルの確認

```bash
# 追加されるファイルのサイズを確認
git ls-files --cached | xargs ls -lh | sort -k5 -hr | head -20
```

---

## 🔍 追加前の確認コマンド

### 何が追加されるか確認（実際には追加しない）

```bash
# 追加されるファイルを確認（dry-run）
git add --dry-run .

# または、より詳細に
git add -n .
```

### 現在の状態を確認

```bash
# 変更されたファイルを確認
git status

# 変更内容を確認
git diff

# ステージングされた変更を確認
git diff --cached
```

---

## 📝 実践例

### 例1: 初回セットアップ

```bash
cd /Users/kairi.oshima/honma_kaitai

# Gitリポジトリを初期化
git init

# .gitignoreが正しく設定されているか確認
cat dashboard/.gitignore
cat .gitignore

# すべてのファイルを追加（.gitignoreで除外されるものは自動的に除外）
git add .

# 追加されたファイルを確認
git status

# コミット
git commit -m "Initial commit: 重機稼働予測ダッシュボード PoC"
```

### 例2: 特定のフォルダのみ追加

```bash
# dashboardフォルダとドキュメントファイルのみ追加
git add dashboard/
git add *.md

# 確認
git status
```

### 例3: 変更されたファイルのみ追加

```bash
# 変更されたファイルを確認
git status

# 変更されたファイルのみ追加
git add -u

# または、特定のファイルのみ追加
git add dashboard/app/page.tsx
git add dashboard/components/
```

---

## 🚀 GitHubへのプッシュ

### リモートリポジトリの追加とプッシュ

```bash
# リモートリポジトリを追加（GitHubでリポジトリを作成後）
git remote add origin https://github.com/your-username/your-repo.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

---

## 💡 便利なコマンド

### 追加をキャンセル

```bash
# ステージングを解除（ファイルは削除されない）
git reset

# 特定のファイルのステージングを解除
git reset dashboard/app/page.tsx
```

### 追加されたファイルの一覧

```bash
# ステージングされたファイルの一覧
git diff --cached --name-only

# 追加されたファイルの数
git diff --cached --name-only | wc -l
```

---

## 📚 参考

- [Git公式ドキュメント - git add](https://git-scm.com/docs/git-add)
- [Git公式ドキュメント - .gitignore](https://git-scm.com/docs/gitignore)

