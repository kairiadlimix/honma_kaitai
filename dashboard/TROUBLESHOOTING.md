# トラブルシューティング

## 問題: `cd dashboard` で "No such file or directory" エラー

### 原因
現在のディレクトリが`honma_kaitai`ディレクトリではない可能性があります。

### 解決方法

#### 1. 現在のディレクトリを確認
```bash
pwd
```

#### 2. 正しいディレクトリに移動

**パターンA: ホームディレクトリにいる場合**
```bash
cd ~/honma_kaitai/dashboard
```

**パターンB: 別の場所にいる場合**
```bash
cd /Users/kairi.oshima/honma_kaitai/dashboard
```

**パターンC: honma_kaitaiディレクトリにいる場合**
```bash
cd dashboard
```

#### 3. ディレクトリの存在確認
```bash
ls -la
```

`package.json`ファイルが見えれば正しいディレクトリです。

---

## 正しいセットアップ手順

### ステップ1: 正しいディレクトリに移動
```bash
# 絶対パスで移動（確実）
cd /Users/kairi.oshima/honma_kaitai/dashboard

# または、honma_kaitaiディレクトリから
cd ~/honma_kaitai/dashboard
```

### ステップ2: 現在のディレクトリを確認
```bash
pwd
# 出力: /Users/kairi.oshima/honma_kaitai/dashboard

ls -la
# package.json が表示されればOK
```

### ステップ3: 依存関係のインストール
```bash
npm install
```

---

## よくある問題

### 問題1: ディレクトリが見つからない
**解決**: 絶対パスを使用
```bash
cd /Users/kairi.oshima/honma_kaitai/dashboard
```

### 問題2: パスにスペースが含まれている
**解決**: パスを引用符で囲む
```bash
cd "/Users/kairi.oshima/honma kaitai/dashboard"
```

### 問題3: 権限エラー
**解決**: ディレクトリの権限を確認
```bash
ls -ld /Users/kairi.oshima/honma_kaitai/dashboard
```

---

## 確認コマンド

正しいディレクトリにいるか確認：
```bash
# 現在のディレクトリを表示
pwd

# package.jsonがあるか確認
ls package.json

# ディレクトリの内容を確認
ls -la
```

