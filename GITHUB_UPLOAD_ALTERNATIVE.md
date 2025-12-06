# GitHubアップロード代替方法（ドラッグ&ドロップができない場合）

ドラッグ&ドロップができない場合の代替方法です。

---

## 🚀 方法1: Gitコマンドを使う（推奨・最も確実）

### ステップ1: Gitリポジトリの初期化

```bash
cd /Users/kairi.oshima/honma_kaitai

# Gitリポジトリを初期化（まだ初期化していない場合）
git init
```

### ステップ2: .gitignoreの確認

```bash
# .gitignoreが存在するか確認
ls -la .gitignore dashboard/.gitignore

# 内容を確認
cat .gitignore
cat dashboard/.gitignore
```

### ステップ3: ファイルを追加

```bash
# すべてのファイルを追加（.gitignoreで除外されるものは自動的に除外）
git add .

# 追加されたファイルを確認
git status
```

### ステップ4: コミット

```bash
git commit -m "Initial commit: 重機稼働予測ダッシュボード PoC"
```

### ステップ5: リモートリポジトリを追加

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/kairiadlimix/honma_kaitai.git

# リモートが正しく設定されたか確認
git remote -v
```

### ステップ6: プッシュ

```bash
# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

**注意**: 初回プッシュ時、GitHubの認証が必要です。

---

## 🔐 GitHub認証方法

### 方法A: Personal Access Token（推奨）

1. GitHubにログイン
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token (classic)" をクリック
4. スコープを選択: `repo`（すべてのリポジトリへのアクセス）
5. トークンを生成してコピー
6. プッシュ時にパスワードの代わりにトークンを入力

```bash
# プッシュ時に認証情報を入力
git push -u origin main
# Username: kairiadlimix
# Password: <Personal Access Token>
```

### 方法B: SSH認証

```bash
# SSH鍵を生成（まだ持っていない場合）
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH鍵をGitHubに登録
# 1. 公開鍵をコピー
cat ~/.ssh/id_ed25519.pub

# 2. GitHub → Settings → SSH and GPG keys → New SSH key
# 3. 公開鍵を貼り付け

# リモートURLをSSHに変更
git remote set-url origin git@github.com:kairiadlimix/honma_kaitai.git

# プッシュ
git push -u origin main
```

---

## 🛠️ 方法2: GitHub CLIを使う

### GitHub CLIのインストール

```bash
# macOS
brew install gh

# 認証
gh auth login
```

### アップロード

```bash
cd /Users/kairi.oshima/honma_kaitai

# リポジトリを初期化（まだの場合）
git init
git add .
git commit -m "Initial commit"

# GitHub CLIでプッシュ
gh repo create honma_kaitai --public --source=. --remote=origin --push
```

---

## 📦 方法3: ファイルを個別にアップロード（小規模な場合）

### 手順

1. GitHubのリポジトリページで「Add file」→「Create new file」をクリック
2. ファイルパスを入力（例: `dashboard/package.json`）
3. ファイル内容をコピー&ペースト
4. 「Commit changes」をクリック

**注意**: この方法は時間がかかるため、小規模なファイルのみ推奨。

---

## 🔍 トラブルシューティング

### エラー: "fatal: not a git repository"

```bash
# Gitリポジトリを初期化
git init
```

### エラー: "remote origin already exists"

```bash
# 既存のリモートを削除して再追加
git remote remove origin
git remote add origin https://github.com/kairiadlimix/honma_kaitai.git
```

### エラー: "Permission denied"

```bash
# 認証情報を確認
git remote -v

# Personal Access Tokenを使用
# またはSSH認証に切り替え
```

### エラー: "node_modules is too large"

```bash
# .gitignoreを確認
cat dashboard/.gitignore | grep node_modules

# node_modulesを除外
echo "node_modules/" >> dashboard/.gitignore
git rm -r --cached dashboard/node_modules 2>/dev/null || true
```

---

## 📋 完全な手順（コピー&ペースト用）

```bash
# 1. プロジェクトルートに移動
cd /Users/kairi.oshima/honma_kaitai

# 2. Gitリポジトリを初期化
git init

# 3. .gitignoreを確認（必要に応じて作成）
# 既に存在する場合はスキップ

# 4. すべてのファイルを追加
git add .

# 5. 追加されたファイルを確認
git status

# 6. コミット
git commit -m "Initial commit: 重機稼働予測ダッシュボード PoC"

# 7. リモートリポジトリを追加
git remote add origin https://github.com/kairiadlimix/honma_kaitai.git

# 8. メインブランチにプッシュ
git branch -M main
git push -u origin main
```

---

## ⚠️ アップロード前の確認

### 除外すべきファイル

```bash
# 確認コマンド
git status --ignored

# 以下のファイルが除外されていることを確認:
# - node_modules/
# - .next/
# - .env.local
# - *.pdf
```

### ファイルサイズの確認

```bash
# 大きなファイルを確認
find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.next/*"
```

---

## 💡 推奨手順

1. **Gitコマンドを使う**（最も確実）
2. 認証は**Personal Access Token**を使用
3. アップロード前に**git status**で確認
4. 問題があれば**トラブルシューティング**を参照

---

## 📚 参考リンク

- [GitHub公式ドキュメント - Adding a remote](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)
- [GitHub公式ドキュメント - Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub公式ドキュメント - SSH認証](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

