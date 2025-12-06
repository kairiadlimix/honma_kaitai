# GitHubへのプッシュ手順

## ✅ 準備完了

以下の作業が完了しています：
- ✅ Gitリポジトリの初期化
- ✅ ファイルの追加（`node_modules_backup`と`.next_backup`を除外）
- ✅ コミット
- ✅ リモートリポジトリの設定

## 🚀 次のステップ：プッシュ

以下のコマンドを実行してGitHubにプッシュしてください：

```bash
cd /Users/kairi.oshima/honma_kaitai
git push -u origin main
```

## 🔐 認証が必要な場合

### Personal Access Tokenを使用（推奨）

1. GitHubにログイン
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token (classic)" をクリック
4. スコープを選択: `repo`（すべてのリポジトリへのアクセス）
5. トークンを生成してコピー
6. プッシュ時にパスワードの代わりにトークンを入力

```bash
git push -u origin main
# Username: kairiadlimix
# Password: <Personal Access Token>
```

### SSH認証を使用

```bash
# SSH鍵を生成（まだ持っていない場合）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 公開鍵をコピー
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH and GPG keys → New SSH key
# 公開鍵を貼り付け

# リモートURLをSSHに変更
git remote set-url origin git@github.com:kairiadlimix/honma_kaitai.git

# プッシュ
git push -u origin main
```

## 📋 現在の状態

- リモートリポジトリ: `https://github.com/kairiadlimix/honma_kaitai.git`
- ブランチ: `main`
- コミット: "Initial commit: 重機稼働予測ダッシュボード PoC"

## ⚠️ 注意事項

- `node_modules_backup`と`.next_backup`は除外されています
- PDFファイルは`.gitignore`で除外されています
- `.env.local`は除外されています

## 🔍 確認

プッシュ後、以下のURLで確認できます：
https://github.com/kairiadlimix/honma_kaitai

