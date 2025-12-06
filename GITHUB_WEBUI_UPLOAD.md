# GitHub WebUIでファイルをアップロードする方法

GitHubのWebインターフェースを使って、コマンドラインを使わずにファイルをアップロードする方法です。

---

## 🚀 基本的な手順

### ステップ1: GitHubリポジトリの作成

1. GitHubにログイン
2. 右上の「+」ボタンをクリック → 「New repository」を選択
3. リポジトリ名を入力（例: `honma-kaitai-dashboard`）
4. 説明を追加（任意）
5. **Public** または **Private** を選択
6. **「Initialize this repository with a README」はチェックしない**（既存のファイルをアップロードするため）
7. 「Create repository」をクリック

### ステップ2: ファイルのアップロード

#### 方法A: ドラッグ&ドロップ（推奨）

1. リポジトリページで「uploading an existing file」をクリック
   - または、リポジトリが空の場合は「upload files」ボタンが表示されます
2. ファイルやフォルダをドラッグ&ドロップ
   - **フォルダごとドラッグ&ドロップできます**
   - 複数のファイル/フォルダを同時にアップロード可能
3. コミットメッセージを入力（例: "Initial commit: 重機稼働予測ダッシュボード PoC"）
4. 「Commit changes」をクリック

#### 方法B: 「Add file」ボタンから

1. リポジトリページで「Add file」→「Upload files」をクリック
2. 「choose your files」をクリックしてファイルを選択
   - または、ファイル/フォルダをドラッグ&ドロップ
3. コミットメッセージを入力
4. 「Commit changes」をクリック

---

## 📁 フォルダ構造を保持したままアップロードする方法

### 方法1: フォルダをドラッグ&ドロップ（最も簡単）

**macOSの場合**:
1. Finderで `dashboard` フォルダを開く
2. フォルダ全体をドラッグ（フォルダ名をクリックしてドラッグ）
3. GitHubのアップロード画面にドロップ
4. **フォルダ構造がそのまま保持されます**

**例**:
```
dashboard/              ← このフォルダをドラッグ
├── app/
│   ├── (dashboard)/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   └── dashboard/
└── lib/
```

ドラッグ&ドロップすると、GitHub上でも同じ構造でアップロードされます：
```
dashboard/
├── app/
│   ├── (dashboard)/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   └── dashboard/
└── lib/
```

### 方法2: 複数フォルダを同時にアップロード

1. Finderで複数のフォルダを選択（Cmd+クリック）
   - 例: `dashboard/` と `docs/` を同時に選択
2. 選択したフォルダをドラッグ
3. GitHubのアップロード画面にドロップ

### 方法3: フォルダ内のファイルを個別にアップロード（構造を手動で作成）

フォルダ構造を手動で作成する場合：

1. GitHubのアップロード画面で「Add file」→「Create new file」をクリック
2. ファイルパスに `dashboard/app/page.tsx` のように入力
   - スラッシュ（`/`）を含めると、自動的にフォルダが作成されます
3. ファイル内容を入力または貼り付け
4. 「Commit changes」をクリック

**注意**: この方法は時間がかかるため、**方法1（ドラッグ&ドロップ）を推奨**します。

### 方法4: ZIPファイルをアップロードして展開（非推奨）

1. フォルダをZIP圧縮
2. ZIPファイルをアップロード
3. GitHub上でZIPを展開

**注意**: GitHubのWebUIではZIPファイルを直接展開できないため、この方法は**推奨しません**。

---

## ⚠️ 注意事項

### アップロードすべきでないファイル

以下のファイルは**アップロードしないでください**：

- ❌ `node_modules/` フォルダ（大容量、不要）
- ❌ `.env.local` ファイル（機密情報）
- ❌ `.next/` フォルダ（ビルド成果物）
- ❌ `*.pdf` ファイル（機密情報が含まれる可能性）
- ❌ `.DS_Store` ファイル（macOSのシステムファイル）

### 事前準備

アップロード前に、不要なファイルを除外：

```bash
# macOSの場合、.DS_Storeを削除
find . -name ".DS_Store" -delete

# node_modulesを確認（アップロードしない）
# dashboard/node_modules/ は除外
```

---

## 📋 推奨アップロード順序

### 1回目: プロジェクトルートのドキュメント

```
honma_kaitai/
├── README.md
├── PoC要件定義_重機稼働予測ダッシュボード.md
├── データ設計書_重機稼働予測.md
├── 技術スタック選定_重機稼働予測.md
├── 画面設計書_重機稼働予測.md
└── hearing_sheet.csv
```

### 2回目: dashboardフォルダ（node_modulesを除く）

**アップロード前に除外**:
- `dashboard/node_modules/` ❌
- `dashboard/.next/` ❌
- `dashboard/.env.local` ❌

**アップロードするもの**:
- `dashboard/app/` ✅
- `dashboard/components/` ✅
- `dashboard/lib/` ✅
- `dashboard/types/` ✅
- `dashboard/package.json` ✅
- `dashboard/README.md` ✅
- その他の設定ファイル ✅

---

## 🎯 実践的な手順

### ステップ1: リポジトリの作成

1. GitHubで新しいリポジトリを作成
2. リポジトリ名: `honma-kaitai-dashboard`（任意）

### ステップ2: ドキュメントファイルのアップロード

1. リポジトリページで「upload files」をクリック
2. 以下のファイルをドラッグ&ドロップ:
   - `README.md`
   - `PoC要件定義_重機稼働予測ダッシュボード.md`
   - `データ設計書_重機稼働予測.md`
   - `技術スタック選定_重機稼働予測.md`
   - `画面設計書_重機稼働予測.md`
   - `hearing_sheet.csv`
3. コミットメッセージ: "Add project documentation"
4. 「Commit changes」をクリック

### ステップ3: dashboardフォルダのアップロード

1. ファイルエクスプローラーで `dashboard` フォルダを開く
2. **`node_modules`フォルダを削除または除外**（重要！）
3. **`.next`フォルダを削除または除外**（重要！）
4. **`.env.local`ファイルを削除または除外**（重要！）
5. `dashboard`フォルダ全体をドラッグ
6. GitHubのアップロード画面にドロップ
7. コミットメッセージ: "Add dashboard application"
8. 「Commit changes」をクリック

---

## 💡 便利なテクニック

### フォルダ構造を保持したままアップロード

- フォルダごとドラッグ&ドロップすると、フォルダ構造がそのまま保持されます
- 例: `dashboard/app/page.tsx` は `dashboard/app/page.tsx` としてアップロードされます

### 複数回に分けてアップロード

- 大きなプロジェクトは複数回に分けてアップロード可能
- 各アップロードごとにコミットメッセージを入力

### アップロード後の確認

1. リポジトリページでファイル一覧を確認
2. 各ファイルをクリックして内容を確認
3. 不要なファイルが含まれていないか確認

---

## 🔍 アップロード後の確認事項

### ✅ 確認すべきこと

- [ ] `node_modules/`がアップロードされていない
- [ ] `.env.local`がアップロードされていない
- [ ] `.next/`がアップロードされていない
- [ ] PDFファイルがアップロードされていない（機密情報）
- [ ] 必要なファイルがすべてアップロードされている
- [ ] フォルダ構造が正しく保持されている

### 不要なファイルがアップロードされてしまった場合

1. GitHubのWebUIでファイルを開く
2. 右上の「...」メニューをクリック
3. 「Delete file」を選択
4. コミットメッセージを入力して削除

---

## 📚 参考

- [GitHub公式ドキュメント - Uploading files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [GitHub公式ドキュメント - Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)

---

## 🎉 完了後

アップロードが完了したら：

1. リポジトリのURLを共有
2. 他のメンバーが `git clone` でクローン可能
3. または、GitHub Codespacesで直接開発可能

---

## ⚡ クイックリファレンス

```
1. GitHubでリポジトリ作成
2. 「upload files」をクリック
3. ファイル/フォルダをドラッグ&ドロップ
4. コミットメッセージを入力
5. 「Commit changes」をクリック
```

**注意**: `node_modules/`、`.env.local`、`.next/`はアップロードしない！

