import { Post } from '../../types';
import { useUserStore } from '../../stores/userStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PostDetailModal = ({
  post,
  onClose,
  onEdit,
  onDelete,
}: PostDetailModalProps) => {
  const { user } = useUserStore();

  // 自分の投稿かどうか
  const isOwnPost = user?.userId === post.userId;

  const handleDelete = () => {
    if (window.confirm('この投稿を削除してもよろしいですか？\nこの操作は取り消せません。')) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black bg-opacity-50 sm:items-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg animate-slide-up max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">記録の詳細</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 投稿者情報 */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {post.nickname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{post.nickname}</div>
                  <div className="text-xs text-gray-500">
                    {format(post.createdAt, 'yyyy年M月d日 HH:mm', { locale: ja })}
                  </div>
                </div>
              </div>
              {isOwnPost && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  自分の投稿
                </span>
              )}
            </div>
          </div>

          {/* 位置情報 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              記録地点
            </label>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                記録地点
              </div>
              <div className="text-xs text-gray-500 mt-1">
                緯度: {post.latitude.toFixed(6)}, 経度: {post.longitude.toFixed(6)}
              </div>
            </div>
          </div>

          {/* テキストメモ */}
          {post.textMemo && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メモ
              </label>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 whitespace-pre-wrap">
                {post.textMemo}
              </div>
            </div>
          )}

          {/* 写真（Phase 4で実装予定） */}
          {post.photoUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                写真
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <img
                  src={post.photoUrl}
                  alt="投稿画像"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}

          {/* 音声（Phase 4で実装予定） */}
          {post.audioUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                音声メモ
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <audio controls className="w-full">
                  <source src={post.audioUrl} type="audio/webm" />
                  お使いのブラウザは音声再生に対応していません。
                </audio>
                {post.audioDuration && (
                  <div className="text-xs text-gray-500 mt-2">
                    再生時間: {Math.floor(post.audioDuration / 60)}:{String(post.audioDuration % 60).padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 更新日時（作成日時と異なる場合のみ表示） */}
          {post.updatedAt.getTime() !== post.createdAt.getTime() && (
            <div className="text-xs text-gray-400 mt-4">
              最終更新: {format(post.updatedAt, 'yyyy年M月d日 HH:mm', { locale: ja })}
            </div>
          )}
        </div>

        {/* フッター（自分の投稿の場合のみ編集・削除ボタンを表示） */}
        {isOwnPost && (
          <div className="border-t p-4 flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              削除
            </button>
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              編集
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;
