import { useState } from 'react';
import { Post } from '../../types';

interface PostEditModalProps {
  post: Post;
  onClose: () => void;
  onSubmit: (textMemo: string) => Promise<void>;
}

const PostEditModal = ({ post, onClose, onSubmit }: PostEditModalProps) => {
  const [textMemo, setTextMemo] = useState(post.textMemo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = textMemo.trim();

    if (!trimmedText) {
      setError('テキストを入力してください');
      return;
    }

    if (trimmedText.length > 500) {
      setError('テキストは500文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(trimmedText);
      onClose();
    } catch (err) {
      setError('更新に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    // 変更があった場合のみ確認
    const hasChanges = textMemo.trim() !== (post.textMemo || '').trim();
    if (hasChanges && !window.confirm('変更内容が失われますが、閉じてもよろしいですか？')) {
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black bg-opacity-50 sm:items-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg animate-slide-up max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">記録を編集</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          {/* 位置情報表示 */}
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
              <div className="text-xs text-gray-400 mt-1">
                ※位置情報は変更できません
              </div>
            </div>
          </div>

          {/* テキスト入力 */}
          <div className="mb-4">
            <label
              htmlFor="textMemo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              メモ
            </label>
            <textarea
              id="textMemo"
              value={textMemo}
              onChange={(e) => {
                setTextMemo(e.target.value);
                setError('');
              }}
              placeholder="この場所での出来事や感想を記録..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                {textMemo.length}/500文字
              </span>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>

        {/* フッター */}
        <div className="border-t p-4 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !textMemo.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '更新中...' : '更新'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEditModal;
