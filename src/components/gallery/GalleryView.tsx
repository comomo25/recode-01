import { Post, Trail } from '../../types';
import PostCard from './PostCard';
import TrailCard from './TrailCard';

interface GalleryViewProps {
  posts: Post[];
  trails: Trail[];
  loading: boolean;
  onPostClick: (post: Post) => void;
  onTrailClick: (trail: Trail) => void;
}

const GalleryView = ({ posts, trails, loading, onPostClick, onTrailClick }: GalleryViewProps) => {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0 && trails.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 px-8">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
          <h2 className="text-lg font-bold text-gray-700 mb-2">
            まだ記録がありません
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            街歩きの記録を投稿してみましょう
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto pb-20">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-800">ギャラリー</h1>
        <p className="text-sm text-gray-500 mt-1">みんなの記録</p>
      </div>

      {/* 投稿一覧 */}
      {posts.length > 0 && (
        <div className="px-4 space-y-4 pb-4">
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} onClick={onPostClick} />
          ))}
        </div>
      )}

      {/* Trail一覧 */}
      {trails.length > 0 && (
        <>
          <div className="px-4 pt-2 pb-2">
            <h2 className="text-base font-bold text-gray-700">散歩軌跡</h2>
          </div>
          <div className="px-4 space-y-4 pb-4">
            {trails.map((trail) => (
              <TrailCard key={trail.trailId} trail={trail} onClick={onTrailClick} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryView;
