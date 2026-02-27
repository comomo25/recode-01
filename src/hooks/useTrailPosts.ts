import { useState, useEffect, useCallback } from 'react';
import { Post } from '../types';
import { getPostsByTrailId } from '../services/postService';

interface UseTrailPostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTrailPosts = (trailId: string | null): UseTrailPostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!trailId) return;
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getPostsByTrailId(trailId);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching trail posts:', err);
      setError(err instanceof Error ? err.message : 'Trail内の投稿取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [trailId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
  };
};
