import { Trail } from '../../types';
import { useTrailPosts } from '../../hooks/useTrailPosts';
import { useUserStore } from '../../stores/userStore';
import TrailMap from '../ui/TrailMap';
import TrailTimeline from '../ui/TrailTimeline';
import { formatDistance, formatDuration } from '../../utils/geo';
import { format } from 'date-fns';

interface TrailDetailModalProps {
  trail: Trail;
  onClose: () => void;
  onDelete: () => void;
  onAddPost: () => void;
}

const TrailDetailModal = ({
  trail,
  onClose,
  onDelete,
  onAddPost,
}: TrailDetailModalProps) => {
  const { user } = useUserStore();
  const { posts, loading: postsLoading } = useTrailPosts(trail.trailId);

  const isOwnTrail = user?.userId === trail.userId;

  const handleDelete = () => {
    if (window.confirm('この軌跡を削除しますか？紐づく投稿は削除されません。')) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">戻る</span>
        </button>
        <h2 className="text-base font-bold text-gray-800 truncate mx-4 flex-1 text-center">
          {trail.title}
        </h2>
        {isOwnTrail ? (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            削除
          </button>
        ) : (
          <div className="w-10"></div>
        )}
      </div>

      {/* スクロール可能なコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        {/* 地図 */}
        <TrailMap
          coordinates={trail.coordinates}
          posts={posts}
          className="h-56 sm:h-72"
        />

        {/* メタ情報 */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800 mb-1">{trail.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>{trail.nickname}</span>
            <span>·</span>
            <span>
              {trail.startTime
                ? format(trail.startTime, 'yyyy/MM/dd')
                : format(trail.createdAt, 'yyyy/MM/dd')}
            </span>
          </div>

          {/* 統計情報 */}
          <div className="flex gap-4">
            <div className="bg-blue-50 rounded-lg px-4 py-2 flex-1 text-center">
              <p className="text-xs text-blue-600">距離</p>
              <p className="text-lg font-bold text-blue-800">
                {formatDistance(trail.distance)}
              </p>
            </div>
            {trail.duration > 0 && (
              <div className="bg-green-50 rounded-lg px-4 py-2 flex-1 text-center">
                <p className="text-xs text-green-600">時間</p>
                <p className="text-lg font-bold text-green-800">
                  {formatDuration(trail.duration)}
                </p>
              </div>
            )}
            <div className="bg-purple-50 rounded-lg px-4 py-2 flex-1 text-center">
              <p className="text-xs text-purple-600">ポイント</p>
              <p className="text-lg font-bold text-purple-800">
                {trail.coordinates.length}
              </p>
            </div>
          </div>

          {/* 説明文 */}
          {trail.description && (
            <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap">
              {trail.description}
            </p>
          )}
        </div>

        {/* タイムライン */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 mb-4">記録</h3>
          <TrailTimeline
            posts={posts}
            loading={postsLoading}
            onAddPost={isOwnTrail ? onAddPost : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default TrailDetailModal;
