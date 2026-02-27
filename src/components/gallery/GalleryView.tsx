import { Trail } from '../../types';
import TrailCard from './TrailCard';

interface GalleryViewProps {
  trails: Trail[];
  loading: boolean;
  onTrailClick: (trail: Trail) => void;
  onCreateTrail: () => void;
}

const GalleryView = ({ trails, loading, onTrailClick, onCreateTrail }: GalleryViewProps) => {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">軌跡を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (trails.length === 0) {
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
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h2 className="text-lg font-bold text-gray-700 mb-2">
            まだ軌跡がありません
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            散歩の軌跡をアップロードして、あなたの冒険を記録しましょう
          </p>
          <button
            onClick={onCreateTrail}
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            軌跡を追加する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto pb-20">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-800">ギャラリー</h1>
        <p className="text-sm text-gray-500 mt-1">みんなの散歩軌跡</p>
      </div>
      <div className="px-4 space-y-4 pb-4">
        {trails.map((trail) => (
          <TrailCard key={trail.trailId} trail={trail} onClick={onTrailClick} />
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
