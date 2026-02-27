import { useState } from 'react';
import { TrailInput } from '../../types';
import GpxFilePicker from '../ui/GpxFilePicker';
import PhotoPicker from '../ui/PhotoPicker';
import { useGpxParser } from '../../hooks/useGpxParser';

interface TrailCreateModalProps {
  onClose: () => void;
  onSubmit: (trailInput: TrailInput) => Promise<void>;
}

const TrailCreateModal = ({ onClose, onSubmit }: TrailCreateModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { result: gpxResult, loading: gpxLoading, error: gpxError, parse: parseGpx, reset: resetGpx } = useGpxParser();

  const handleGpxFileSelect = (file: File) => {
    setGpxFile(file);
    parseGpx(file);
  };

  const handleGpxRemove = () => {
    setGpxFile(null);
    resetGpx();
  };

  const handleCoverPhotoSelect = (file: File) => {
    setCoverPhotoFile(file);
    const url = URL.createObjectURL(file);
    setCoverPhotoPreview(url);
  };

  const handleCoverPhotoRemove = () => {
    if (coverPhotoPreview) {
      URL.revokeObjectURL(coverPhotoPreview);
    }
    setCoverPhotoFile(null);
    setCoverPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('タイトルを入力してください');
      return;
    }

    if (!gpxFile || !gpxResult) {
      setError('GPXファイルを選択してください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || undefined,
        gpxFile,
        startTime: gpxResult.startTime,
        endTime: gpxResult.endTime,
        coverPhotoFile: coverPhotoFile || undefined,
      });
      onClose();
    } catch (err) {
      setError('軌跡の作成に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    const hasContent = title.trim() || description.trim() || gpxFile || coverPhotoFile;
    if (hasContent && !window.confirm('入力内容が失われますが、閉じてもよろしいですか？')) {
      return;
    }

    if (coverPhotoPreview) {
      URL.revokeObjectURL(coverPhotoPreview);
    }

    onClose();
  };

  // GPXのトラック名をタイトルのデフォルト値として使用
  if (gpxResult?.name && !title) {
    setTitle(gpxResult.name);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black bg-opacity-50 sm:items-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg animate-slide-up max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">新しい軌跡</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          {/* GPXファイル選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPXファイル <span className="text-red-500">*</span>
            </label>
            <GpxFilePicker
              onFileSelect={handleGpxFileSelect}
              parseResult={gpxResult}
              loading={gpxLoading}
              error={gpxError}
              onRemove={handleGpxRemove}
            />
          </div>

          {/* タイトル */}
          <div className="mb-4">
            <label htmlFor="trailTitle" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              id="trailTitle"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="例: 代々木公園お散歩"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          {/* 説明 */}
          <div className="mb-4">
            <label htmlFor="trailDescription" className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              id="trailDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="この散歩について..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="text-right mt-1">
              <span className="text-xs text-gray-500">{description.length}/1000文字</span>
            </div>
          </div>

          {/* カバー写真 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カバー写真
            </label>
            <PhotoPicker
              onPhotoSelect={handleCoverPhotoSelect}
              previewUrl={coverPhotoPreview}
              onRemove={handleCoverPhotoRemove}
              disabled={isSubmitting}
            />
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
            disabled={isSubmitting || !title.trim() || !gpxResult}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '作成中...' : '作成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrailCreateModal;
