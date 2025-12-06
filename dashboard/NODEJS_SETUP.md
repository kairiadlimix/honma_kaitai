# Node.js セットアップガイド

## 現在の状況
✅ ディレクトリは正しい: `/Users/kairi.oshima/honma_kaitai/dashboard`
❌ Node.js/npmがインストールされていない

## Node.jsのインストール方法

### 方法1: Homebrewを使用（推奨）

```bash
# Homebrewがインストールされているか確認
brew --version

# Homebrewが無い場合は先にインストール
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.jsをインストール
brew install node@18

# インストール確認
node --version
npm --version
```

### 方法2: 公式インストーラーを使用

1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTS版（推奨版）をダウンロード
3. ダウンロードした`.pkg`ファイルを実行してインストール
4. ターミナルを再起動

### 方法3: nvmを使用（開発環境向け）

```bash
# nvmをインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# ターミナルを再起動または
source ~/.zshrc  # または source ~/.bash_profile

# Node.js 18をインストール
nvm install 18
nvm use 18

# 確認
node --version
npm --version
```

## インストール後の確認

```bash
# Node.jsのバージョン確認（v18以上推奨）
node --version

# npmのバージョン確認（v9以上推奨）
npm --version
```

## インストール後の次のステップ

Node.jsがインストールできたら：

```bash
# dashboardディレクトリに移動（既にいる場合は不要）
cd /Users/kairi.oshima/honma_kaitai/dashboard

# 依存関係をインストール
npm install
```

## トラブルシューティング

### インストール後も`npm: command not found`が出る場合

1. **ターミナルを再起動**
   - 新しいターミナルウィンドウを開く

2. **PATHを確認**
   ```bash
   echo $PATH
   which node
   which npm
   ```

3. **Homebrewでインストールした場合**
   ```bash
   # HomebrewのPATHを追加
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
   eval "$(/opt/homebrew/bin/brew shellenv)"
   ```

4. **公式インストーラーでインストールした場合**
   - `/usr/local/bin`にインストールされるはず
   - ターミナルを再起動

