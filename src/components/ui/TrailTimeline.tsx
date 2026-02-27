import { Post } from '../../types';
import { format } from 'date-fns';

interface TrailTimelineProps {
  posts: Post[];
  loading: boolean;
  onAddPost?: () => void;
}

const TrailTimeline = ({ posts, loading, onAddPost }: TrailTimelineProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <svg
          className="w-12 h-12 text-gray-300 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="text-gray-500 text-sm mb-3">
          まだ写真やコメントがありません
        </p>
        {onAddPost && (
          <button
            onClick={onAddPost}
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            + 記録を追加する
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* タイムライン縦線 */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-0">
        {posts.map((post, index) => (
          <div key={post.postId} className="relative pl-10 pb-6">
            {/* タイムラインドット */}
            <div className="absolute left-2.5 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>

            {/* タイムスタンプ */}
            <div className="text-xs text-gray-400 mb-1">
              {format(post.createdAt, 'HH:mm')}
            </div>

            {/* コンテンツカード */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
              {/* 写真 */}
              {post.photoUrl && (
                <img
                  src={post.photoUrl}
                  alt=""
                  className="w-full h-48 object-cover"
                />
              )}

              {/* テキスト */}
              {post.textMemo && (
                <div className="p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {post.textMemo}
                  </p>
                </div>
              )}

              {/* 音声 */}
              {post.audioUrl && (
                <div className="px-3 pb-3">
                  <audio
                    src={post.audioUrl}
                    controls
                    className="w-full h-8"
                  />
                </div>
              )}
            </div>

            {/* 最後のアイテムの後の終端マーカー */}
            {index === posts.length - 1 && (
              <div className="absolute left-2.5 bottom-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white shadow"></div>
            )}
          </div>
        ))}
      </div>

      {/* 記録追加ボタン */}
      {onAddPost && (
        <div className="relative pl-10 pt-2">
          <div className="absolute left-2.5 top-3 w-3 h-3 bg-gray-200 rounded-full border-2 border-white"></div>
          <button
            onClick={onAddPost}
            className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            記録を追加
          </button>
        </div>
      )}
    </div>
  );
};

export default TrailTimeline;
