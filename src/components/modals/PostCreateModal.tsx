import { useState } from 'react';
import { Geolocation, PostInput } from '../../types';
import PhotoPicker from '../ui/PhotoPicker';
import AudioRecorder from '../ui/AudioRecorder';

interface PostCreateModalProps {
  onClose: () => void;
  onSubmit: (postInput: PostInput) => Promise<void>;
  currentLocation: Geolocation | null;
}

const PostCreateModal = ({
  onClose,
  onSubmit,
  currentLocation,
}: PostCreateModalProps) => {
  const [textMemo, setTextMemo] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handlePhotoRemove = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleAudioComplete = (audioBlob: Blob, duration: number) => {
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    setAudioFile(file);
    setAudioDuration(duration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = textMemo.trim();

    // テキスト、写真、音声のいずれかが必須
    if (!trimmedText && !photoFile && !audioFile) {
      setError('テキスト、写真、音声のいずれかを入力してください');
      return;
    }

    if (trimmedText && trimmedText.length > 500) {
      setError('テキストは500文字以内で入力してください');
      return;
    }

    if (!currentLocation) {
      setError('位置情報を取得できませんでした');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        textMemo: trimmedText || undefined,
        photoFile: photoFile || undefined,
        audioFile: audioFile || undefined,
        audioDuration: audioDuration || undefined,
      });
      onClose();
    } catch (err) {
      setError('投稿に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    // 何かしらの入力がある場合は確認
    const hasContent = textMemo.trim() || photoFile || audioFile;
    if (hasContent && !window.confirm('入力内容が失われますが、閉じてもよろしいですか？')) {
      return;
    }

    // プレビューURLをクリーンアップ
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black bg-opacity-50 sm:items-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg animate-slide-up max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">新しい記録</h2>
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
              {currentLocation ? (
                <>
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
                    現在地
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    緯度: {currentLocation.latitude.toFixed(6)}, 経度: {currentLocation.longitude.toFixed(6)}
                  </div>
                </>
              ) : (
                '位置情報を取得中...'
              )}
            </div>
          </div>

          {/* 写真選択 */}
          <div className="mb-4">
            <PhotoPicker
              onPhotoSelect={handlePhotoSelect}
              previewUrl={photoPreview}
              onRemove={handlePhotoRemove}
              disabled={isSubmitting}
            />
          </div>

          {/* 音声録音 */}
          <div className="mb-4">
            <AudioRecorder
              onRecordingComplete={handleAudioComplete}
              disabled={isSubmitting}
            />
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
            disabled={isSubmitting || !textMemo.trim() || !currentLocation}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '投稿中...' : '投稿'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreateModal;
