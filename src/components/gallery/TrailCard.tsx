import { Trail } from '../../types';
import { formatDistance, formatDuration } from '../../utils/geo';
import { format } from 'date-fns';

interface TrailCardProps {
  trail: Trail;
  onClick: (trail: Trail) => void;
}

const TrailCard = ({ trail, onClick }: TrailCardProps) => {
  return (
    <button
      onClick={() => onClick(trail)}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left hover:shadow-md transition-shadow"
    >
      {/* カバー写真 */}
      <div className="w-full h-40 bg-gray-200 relative">
        {trail.coverPhotoUrl ? (
          <img
            src={trail.coverPhotoUrl}
            alt={trail.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
            <svg
              className="w-12 h-12 text-blue-300"
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
          </div>
        )}
      </div>

      {/* 情報 */}
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-base truncate">
          {trail.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          <span>{trail.nickname}</span>
          <span>·</span>
          <span>{format(trail.createdAt, 'yyyy/MM/dd')}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {formatDistance(trail.distance)}
          </span>
          {trail.duration > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(trail.duration)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default TrailCard;
