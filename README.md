# 街歩き記録アプリ (Machiaruki)

街歩き中に、その場で写真・テキスト・音声を記録し、地図上のピンとして保存。すべてのユーザーの記録が1つの地図上に表示され、他の人の街歩き体験も共有できるソーシャル記録アプリ。

## 機能

- 📍 **位置情報の自動記録** - GPS で現在地を自動取得
- 📸 **写真アップロード** - 圧縮機能付き（最大5MB）
- 🎤 **音声録音・再生** - ブラウザで直接録音（最大5分）
- 📝 **テキストメモ** - 500文字まで
- 🗺️ **地図表示** - OpenStreetMap で全ユーザーの投稿を表示
- ✏️ **編集・削除** - 自分の投稿のみ編集・削除可能

## 技術スタック

- **Frontend**: React 18 + TypeScript + Vite
- **Map**: Leaflet + React-Leaflet
- **State Management**: Zustand
- **Backend**: Firebase (Firestore + Storage)
- **Styling**: Tailwind CSS v3

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd recode_01

# 依存パッケージをインストール
npm install

# 環境変数を設定
cp .env.example .env
```

### 環境変数の設定

`.env` ファイルに以下のFirebase設定を追加してください：

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Firebase の設定値は、Firebase Console の「プロジェクトの設定」から取得できます。

### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:5173 でアプリが起動します。

### ビルド

```bash
npm run build
```

## Firebase セットアップ

### 1. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名を入力（例: recode-01）

### 2. Firestore Database の設定

1. Firebase Console で「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. **テストモード**で開始（開発用）
4. ロケーションを選択（asia-northeast1 推奨）
5. 「Rules」タブで以下のルールを設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Storage の設定

1. Firebase Console で「Storage」を選択
2. 「始める」をクリック
3. **テストモード**で開始
4. ロケーションを選択（Firestoreと同じ）
5. 「Rules」タブで以下のルールを設定：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Blaze プランへのアップグレード（必須）

Storage を使用するには、Blaze プラン（従量課金）が必要です：

1. Firebase Console で「アップグレード」をクリック
2. Blaze プランを選択
3. 予算アラートを設定することを推奨

## Vercel へのデプロイ

### 1. GitHub にプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel でデプロイ

1. [Vercel](https://vercel.com/) にアクセス
2. GitHub アカウントでログイン
3. 「New Project」をクリック
4. GitHub リポジトリを選択
5. 環境変数を設定：
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. 「Deploy」をクリック

## セキュリティに関する注意

⚠️ **本番環境では、Firebase のセキュリティルールを厳格化してください**

現在のルール（`allow read, write: if true`）は、誰でもデータの読み書きができる状態です。本番環境では、以下のような制限を追加してください：

- 認証されたユーザーのみアクセス可能にする
- 投稿の編集・削除は本人のみ可能にする
- データのバリデーションを追加する

## ライセンス

MIT

## 開発者

Created with Claude Code
