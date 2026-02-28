import { Post } from '../../types';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostCard = ({ post, onClick }: PostCardProps) => {
  return (
    <button
      onClick={() => onClick(post)}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left hover:shadow-md transition-shadow"
    >
      {/* 写真 */}
      <div className="w-full h-48 bg-gray-200 relative">
        {post.photoUrl ? (
          <img
            src={post.photoUrl}
            alt="投稿写真"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg
              className="w-12 h-12 text-gray-300"
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
          </div>
        )}
        {/* 音声バッジ */}
        {post.audioUrl && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1.5 shadow-sm">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        )}
      </div>

      {/* 情報 */}
      <div className="p-3">
        {/* テキストメモ */}
        {post.textMemo && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-2">
            {post.textMemo}
          </p>
        )}
        {/* ニックネーム・日時 */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{post.nickname}</span>
          <span>·</span>
          <span>{format(post.createdAt, 'yyyy/MM/dd HH:mm')}</span>
        </div>
      </div>
    </button>
  );
};

export default PostCard;
