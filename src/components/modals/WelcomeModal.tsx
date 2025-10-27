import { useState } from 'react';

interface WelcomeModalProps {
  onComplete: (nickname: string) => void;
}

const WelcomeModal = ({ onComplete }: WelcomeModalProps) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setError('ニックネームを入力してください');
      return;
    }

    if (trimmedNickname.length > 20) {
      setError('ニックネームは20文字以内で入力してください');
      return;
    }

    onComplete(trimmedNickname);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-slide-up">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            街歩き記録アプリ
          </h1>
          <p className="text-gray-600 text-sm">
            街を歩きながら、写真・メモ・音声を記録しよう
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="例: 街歩きマスター"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {nickname.length}/20文字
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            はじめる
          </button>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          このアプリでは位置情報を使用します
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
