# npmコマンドが見つからない問題の解決方法

## 問題
`npm: command not found` エラーが出る

## 解決方法

### 方法1: ターミナルを再起動（最も簡単）

1. 現在のターミナルを閉じる
2. 新しいターミナルを開く
3. 以下を実行：
```bash
cd /Users/kairi.oshima/honma_kaitai/dashboard
npm install
```

### 方法2: 現在のターミナルでPATHを設定

```bash
# PATHを追加
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"

# 確認
node --version
npm --version

# 依存関係をインストール
npm install
```

### 方法3: 設定ファイルを更新（永続的）

```bash
# bashの場合
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile

# zshの場合
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## 確認コマンド

```bash
# Node.jsのバージョン確認
node --version
# 出力例: v18.20.8

# npmのバージョン確認
npm --version
# 出力例: 10.x.x
```

## 次のステップ

npmが使えるようになったら：

```bash
cd /Users/kairi.oshima/honma_kaitai/dashboard
npm install
```

