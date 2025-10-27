import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import imageCompression from 'browser-image-compression';

// 写真をアップロード
export const uploadPhoto = async (
  file: File,
  postId: string
): Promise<string> => {
  try {
    // 画像を圧縮
    const compressedFile = await compressImage(file);

    // Firebase Storageにアップロード
    const storageRef = ref(storage, `posts/${postId}/photo.jpg`);
    await uploadBytes(storageRef, compressedFile);

    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('写真のアップロードに失敗しました');
  }
};

// 音声をアップロード
export const uploadAudio = async (
  file: File,
  postId: string
): Promise<string> => {
  try {
    // Firebase Storageにアップロード
    const storageRef = ref(storage, `posts/${postId}/audio.webm`);
    await uploadBytes(storageRef, file);

    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw new Error('音声のアップロードに失敗しました');
  }
};

// ファイルを削除
export const deleteFile = async (url: string): Promise<void> => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    // ファイルが存在しない場合はエラーを無視
    if ((error as any).code !== 'storage/object-not-found') {
      throw new Error('ファイルの削除に失敗しました');
    }
  }
};

// 画像を圧縮
export const compressImage = async (file: File): Promise<File> => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // 圧縮に失敗した場合は元のファイルを返す
    return file;
  }
};
