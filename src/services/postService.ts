import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, PostInput } from '../types';
import { generatePostId } from '../utils/uuid';
import { uploadPhoto, uploadAudio } from './storageService';

const POSTS_COLLECTION = 'posts';

// 投稿を作成
export const createPost = async (
  userId: string,
  nickname: string,
  postInput: PostInput
): Promise<string> => {
  try {
    const postId = generatePostId();
    const now = Timestamp.now();

    // 写真をアップロード
    let photoUrl: string | null = null;
    if (postInput.photoFile) {
      photoUrl = await uploadPhoto(postInput.photoFile, postId);
    }

    // 音声をアップロード
    let audioUrl: string | null = null;
    if (postInput.audioFile) {
      audioUrl = await uploadAudio(postInput.audioFile, postId);
    }

    const postData = {
      postId,
      userId,
      nickname,
      latitude: postInput.latitude,
      longitude: postInput.longitude,
      textMemo: postInput.textMemo || null,
      photoUrl,
      audioUrl,
      audioDuration: postInput.audioDuration || null,
      createdAt: now,
      updatedAt: now,
    };

    await addDoc(collection(db, POSTS_COLLECTION), postData);
    return postId;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('投稿の作成に失敗しました');
  }
};

// 全投稿を取得
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const posts: Post[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        postId: data.postId,
        userId: data.userId,
        nickname: data.nickname,
        latitude: data.latitude,
        longitude: data.longitude,
        photoUrl: data.photoUrl || undefined,
        textMemo: data.textMemo || undefined,
        audioUrl: data.audioUrl || undefined,
        audioDuration: data.audioDuration || undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw new Error('投稿の取得に失敗しました');
  }
};

// 投稿を更新
export const updatePost = async (
  postId: string,
  updates: Partial<Post>
): Promise<void> => {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef);
    const querySnapshot = await getDocs(q);

    const postDoc = querySnapshot.docs.find((doc) => doc.data().postId === postId);

    if (!postDoc) {
      throw new Error('投稿が見つかりませんでした');
    }

    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Dateオブジェクトは使えないので削除
    delete updateData.createdAt;

    await updateDoc(doc(db, POSTS_COLLECTION, postDoc.id), updateData);
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('投稿の更新に失敗しました');
  }
};

// 投稿を削除
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef);
    const querySnapshot = await getDocs(q);

    const postDoc = querySnapshot.docs.find((doc) => doc.data().postId === postId);

    if (!postDoc) {
      throw new Error('投稿が見つかりませんでした');
    }

    await deleteDoc(doc(db, POSTS_COLLECTION, postDoc.id));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('投稿の削除に失敗しました');
  }
};
