import Map from './components/Map';
import WelcomeModal from './components/modals/WelcomeModal';
import PostCreateModal from './components/modals/PostCreateModal';
import PostDetailModal from './components/modals/PostDetailModal';
import PostEditModal from './components/modals/PostEditModal';
import TrailCreateModal from './components/modals/TrailCreateModal';
import TrailDetailModal from './components/modals/TrailDetailModal';
import FloatingButton from './components/ui/FloatingButton';
import BottomTabBar from './components/ui/BottomTabBar';
import GalleryView from './components/gallery/GalleryView';
import { useUserStore } from './stores/userStore';
import { useModalStore } from './stores/modalStore';
import { useTabStore } from './stores/tabStore';
import { useGeolocation } from './hooks/useGeolocation';
import { usePosts } from './hooks/usePosts';
import { useTrails } from './hooks/useTrails';
import { generateUserId } from './utils/uuid';
import { createPost, deletePost, updatePost, getAllPosts } from './services/postService';
import { createTrail, deleteTrail } from './services/trailService';
import { TrailInput } from './types';

function App() {
  const { user, setUser } = useUserStore();
  const { currentModal, selectedPost, selectedTrail, openModal, closeModal } = useModalStore();
  const { activeTab } = useTabStore();
  const { location, error, loading, refetch } = useGeolocation();
  const { posts, refetch: refetchPosts } = usePosts();
  const { trails, refetch: refetchTrails } = useTrails();

  // 初回訪問時のみWelcomeModalを表示
  const showWelcomeModal = !user;

  const handleWelcomeComplete = (nickname: string) => {
    const newUser = {
      userId: generateUserId(),
      nickname,
    };
    setUser(newUser);
  };

  const handleLocationRefresh = () => {
    refetch();
  };

  const handlePostCreate = async (postInput: import('./types').PostInput) => {
    if (!user) return;

    // Trail詳細画面から呼ばれた場合、trailIdを付与
    const { selectedTrail } = useModalStore.getState();
    const input = selectedTrail
      ? { ...postInput, trailId: selectedTrail.trailId }
      : postInput;

    await createPost(user.userId, user.nickname, input);
    await refetchPosts();
  };

  const handlePostDelete = async () => {
    const { selectedPost } = useModalStore.getState();
    if (!selectedPost) return;

    try {
      await deletePost(selectedPost.postId);
      await refetchPosts();
      closeModal();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('投稿の削除に失敗しました');
    }
  };

  const handlePostEdit = () => {
    openModal('postEdit');
  };

  const handlePostUpdate = async (textMemo: string) => {
    const { selectedPost } = useModalStore.getState();
    if (!selectedPost) return;

    try {
      await updatePost(selectedPost.postId, { textMemo });
      await refetchPosts();
      const latestPosts = await getAllPosts();
      const updatedPost = latestPosts.find(p => p.postId === selectedPost.postId);

      if (updatedPost) {
        openModal('postDetail', updatedPost);
      } else {
        closeModal();
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  };

  // Trail作成
  const handleTrailCreate = async (trailInput: TrailInput) => {
    if (!user) return;

    await createTrail(user.userId, user.nickname, trailInput);
    await refetchTrails();
  };

  // Trail削除
  const handleTrailDelete = async () => {
    const { selectedTrail } = useModalStore.getState();
    if (!selectedTrail) return;

    try {
      await deleteTrail(selectedTrail.trailId);
      await refetchTrails();
      closeModal();
    } catch (error) {
      console.error('Failed to delete trail:', error);
      alert('軌跡の削除に失敗しました');
    }
  };

  // Trail内にPostを追加
  const handleAddPostToTrail = () => {
    openModal('postCreate');
  };

  return (
    <div className="relative w-full h-screen">
      {/* メインコンテンツ */}
      <div className="w-full h-full pb-14">
        {activeTab === 'map' && (
          <>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">位置情報を取得中...</p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center max-w-md px-4">
                  <div className="text-red-600 text-5xl mb-4">⚠️</div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    位置情報エラー
                  </h2>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <p className="text-sm text-gray-500">
                    ブラウザの設定で位置情報の使用を許可してください
                  </p>
                </div>
              </div>
            ) : (
              <Map
                center={location}
                posts={posts}
                trails={trails}
                onPostClick={(post) => openModal('postDetail', post)}
                onTrailClick={(trail) => openModal('trailDetail', { trail })}
              />
            )}
          </>
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            trails={trails}
            loading={false}
            onTrailClick={(trail) => openModal('trailDetail', { trail })}
            onCreateTrail={() => openModal('trailCreate')}
          />
        )}
      </div>

      {/* タブバー */}
      <BottomTabBar />

      {/* 初回登録モーダル */}
      {showWelcomeModal && (
        <WelcomeModal onComplete={handleWelcomeComplete} />
      )}

      {/* 投稿作成モーダル */}
      {currentModal === 'postCreate' && (
        <PostCreateModal
          onClose={closeModal}
          onSubmit={handlePostCreate}
          currentLocation={location}
        />
      )}

      {/* 投稿詳細モーダル */}
      {currentModal === 'postDetail' && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={closeModal}
          onEdit={handlePostEdit}
          onDelete={handlePostDelete}
        />
      )}

      {/* 投稿編集モーダル */}
      {currentModal === 'postEdit' && selectedPost && (
        <PostEditModal
          post={selectedPost}
          onClose={closeModal}
          onSubmit={handlePostUpdate}
        />
      )}

      {/* Trail作成モーダル */}
      {currentModal === 'trailCreate' && (
        <TrailCreateModal
          onClose={closeModal}
          onSubmit={handleTrailCreate}
        />
      )}

      {/* Trail詳細モーダル */}
      {currentModal === 'trailDetail' && selectedTrail && (
        <TrailDetailModal
          trail={selectedTrail}
          onClose={closeModal}
          onDelete={handleTrailDelete}
          onAddPost={handleAddPostToTrail}
        />
      )}

      {/* ローディング表示（地図の上に重ねる） */}
      {loading && !showWelcomeModal && activeTab === 'map' && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">地図を読み込んでいます...</p>
          </div>
        </div>
      )}

      {/* 現在地ボタン（地図タブで地図が表示されている時のみ） */}
      {activeTab === 'map' && !loading && !error && location && (
        <FloatingButton
          onClick={handleLocationRefresh}
          position="bottom-left"
          ariaLabel="現在地に移動"
          icon={
            <svg
              className="w-6 h-6 text-gray-700"
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
          }
        />
      )}

      {/* 投稿作成ボタン（地図タブで地図が表示されている時のみ） */}
      {activeTab === 'map' && !loading && !error && location && user && (
        <FloatingButton
          onClick={() => openModal('postCreate')}
          position="bottom-right"
          ariaLabel="新しい記録を作成"
          variant="primary"
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        />
      )}

      {/* ギャラリータブの軌跡作成ボタン */}
      {activeTab === 'gallery' && user && (
        <FloatingButton
          onClick={() => openModal('trailCreate')}
          position="bottom-right"
          ariaLabel="新しい軌跡を作成"
          variant="primary"
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        />
      )}

      {/* メニューボタン（地図タブで表示） */}
      {activeTab === 'map' && !loading && !error && location && user && (
        <FloatingButton
          onClick={() => {
            console.log('メニューボタンがクリックされました');
          }}
          position="top-right"
          ariaLabel="メニュー"
          icon={
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          }
        />
      )}
    </div>
  );
}

export default App;
