import { useRef } from 'react';
import { GpxParseResult } from '../../types';
import { formatDistance, formatDuration } from '../../utils/geo';

interface GpxFilePickerProps {
  onFileSelect: (file: File) => void;
  parseResult: GpxParseResult | null;
  loading: boolean;
  error: string | null;
  onRemove: () => void;
}

const GpxFilePicker = ({
  onFileSelect,
  parseResult,
  loading,
  error,
  onRemove,
}: GpxFilePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // リセットして同じファイルを再選択可能にする
    e.target.value = '';
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".gpx"
        onChange={handleChange}
        className="hidden"
      />

      {!parseResult && !loading && (
        <button
          type="button"
          onClick={handleClick}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <svg
            className="w-10 h-10 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-600 font-medium">GPXファイルを選択</p>
          <p className="text-xs text-gray-400 mt-1">
            他のアプリで記録した軌跡ファイルをアップロード
          </p>
        </button>
      )}

      {loading && (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">GPXファイルを解析中...</p>
        </div>
      )}

      {error && (
        <div className="w-full border-2 border-dashed border-red-300 rounded-xl p-4 text-center bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={handleClick}
            className="mt-2 text-sm text-blue-600 underline"
          >
            別のファイルを選択
          </button>
        </div>
      )}

      {parseResult && (
        <div className="w-full border border-green-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium text-green-800">
                GPXファイル読み込み完了
              </span>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">距離</p>
              <p className="text-sm font-bold text-gray-800">
                {formatDistance(parseResult.distance)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">時間</p>
              <p className="text-sm font-bold text-gray-800">
                {parseResult.duration > 0
                  ? formatDuration(parseResult.duration)
                  : '--'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ポイント数</p>
              <p className="text-sm font-bold text-gray-800">
                {parseResult.coordinates.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GpxFilePicker;
