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
  trailId?: string; // 紐づくTrailのID（任意）
  createdAt: Date; // 投稿日時
  updatedAt: Date; // 更新日時
}

// 軌跡ポイントの型
export interface TrailPoint {
  latitude: number;
  longitude: number;
  elevation?: number; // 標高
  timestamp?: string; // ISO 8601
}

// 散歩軌跡の型
export interface Trail {
  trailId: string; // UUID
  userId: string; // 作成者のユーザーID
  nickname: string; // 作成時点のニックネーム
  title: string; // Trail名（必須）
  description?: string; // 説明文（任意、最大1000文字）
  coordinates: TrailPoint[]; // ポリラインの座標配列
  distance: number; // 総距離（メートル）
  duration: number; // 所要時間（秒）
  startTime?: Date; // 開始日時
  endTime?: Date; // 終了日時
  coverPhotoUrl?: string; // カバー写真URL
  createdAt: Date;
  updatedAt: Date;
}

// Trail作成時の入力データ型
export interface TrailInput {
  title: string;
  description?: string;
  gpxFile?: File;
  coordinates?: TrailPoint[]; // 将来のリアルタイム記録用
  startTime?: Date;
  endTime?: Date;
  coverPhotoFile?: File;
}

// GPXパース結果の型
export interface GpxParseResult {
  coordinates: TrailPoint[];
  distance: number; // メートル
  duration: number; // 秒
  startTime?: Date;
  endTime?: Date;
  name?: string; // GPXファイル内のトラック名
}

// 投稿作成時の入力データ型（IDや日時は自動生成されるため不要）
export interface PostInput {
  latitude: number;
  longitude: number;
  photoFile?: File; // 写真ファイル
  textMemo?: string;
  audioFile?: File; // 音声ファイル
  audioDuration?: number;
  trailId?: string; // 紐づくTrailのID（任意）
}

// モーダルの状態管理用の型
export type ModalType =
  | 'welcome' // 初回登録
  | 'postCreate' // 投稿作成
  | 'postDetail' // 投稿詳細
  | 'postEdit' // 投稿編集
  | 'settings' // 設定
  | 'trailCreate' // Trail作成
  | 'trailDetail' // Trail詳細
  | null; // モーダルが開いていない状態

// タブナビゲーションの型
export type TabType = 'map' | 'gallery';

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
