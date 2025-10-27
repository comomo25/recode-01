import { useAudioRecorder } from '../../hooks/useAudioRecorder';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

const AudioRecorder = ({
  onRecordingComplete,
  disabled = false,
}: AudioRecorderProps) => {
  const {
    isRecording,
    audioBlob,
    audioURL,
    duration,
    startRecording,
    stopRecording,
    clearRecording,
    error,
  } = useAudioRecorder();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob, duration);
    }
  };

  const handleRemoveRecording = () => {
    clearRecording();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">音声メモ</label>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {audioURL ? (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">録音時間: {formatTime(duration)}</span>
            <button
              type="button"
              onClick={handleRemoveRecording}
              disabled={disabled}
              className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
            >
              削除
            </button>
          </div>
          <audio controls className="w-full" src={audioURL}>
            お使いのブラウザは音声再生に対応していません。
          </audio>
          <button
            type="button"
            onClick={handleSaveRecording}
            disabled={disabled}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            この音声を使用
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          {isRecording ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-lg font-mono text-gray-800">
                  {formatTime(duration)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                停止
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStartRecording}
              disabled={disabled}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span className="text-sm text-gray-600">録音を開始</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
