// ユーザー情報の型
export interface User {
  userId: string; // UUID
  nickname: string;
}

// 投稿情報の型
export interface Post {
  postId: string; // UUID
  userId: string; // 投稿者のユーザーID
  nickname: string; // 投稿時点のニックネーム
  latitude: number; // 緯度
  longitude: number; // 経度
  photoUrl?: string; // 写真のURL（任意）
  textMemo?: string; // テキストメモ（任意、最大500文字）
  audioUrl?: string; // 音声のURL（任意）
  audioDuration?: number; // 音声の長さ（秒）
  createdAt: Date; // 投稿日時
  updatedAt: Date; // 更新日時
}

// 投稿作成時の入力データ型（IDや日時は自動生成されるため不要）
export interface PostInput {
  latitude: number;
  longitude: number;
  photoFile?: File; // 写真ファイル
  textMemo?: string;
  audioFile?: File; // 音声ファイル
  audioDuration?: number;
}

// モーダルの状態管理用の型
export type ModalType =
  | 'welcome' // 初回登録
  | 'postCreate' // 投稿作成
  | 'postDetail' // 投稿詳細
  | 'postEdit' // 投稿編集
  | 'settings' // 設定
  | null; // モーダルが開いていない状態

// 位置情報の型
export interface Geolocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// エラー情報の型
export interface AppError {
  message: string;
  type: 'geolocation' | 'upload' | 'network' | 'general';
}
