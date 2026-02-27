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
import { Trail, TrailInput, TrailPoint } from '../types';
import { generateTrailId } from '../utils/uuid';
import { uploadTrailCoverPhoto } from './storageService';
import { parseGpxFile } from './gpxService';
import { calculateTotalDistance } from '../utils/geo';

const TRAILS_COLLECTION = 'trails';

// Trailを作成
export const createTrail = async (
  userId: string,
  nickname: string,
  trailInput: TrailInput
): Promise<string> => {
  try {
    const trailId = generateTrailId();
    const now = Timestamp.now();

    // GPXファイルからパース or 直接座標指定
    let coordinates: TrailPoint[] = [];
    let distance = 0;
    let duration = 0;
    let startTime: Date | undefined = trailInput.startTime;
    let endTime: Date | undefined = trailInput.endTime;

    if (trailInput.gpxFile) {
      const gpxResult = await parseGpxFile(trailInput.gpxFile);
      coordinates = gpxResult.coordinates;
      distance = gpxResult.distance;
      duration = gpxResult.duration;
      startTime = startTime || gpxResult.startTime;
      endTime = endTime || gpxResult.endTime;
    } else if (trailInput.coordinates) {
      coordinates = trailInput.coordinates;
      distance = calculateTotalDistance(coordinates);
    }

    // カバー写真をアップロード
    let coverPhotoUrl: string | null = null;
    if (trailInput.coverPhotoFile) {
      coverPhotoUrl = await uploadTrailCoverPhoto(
        trailInput.coverPhotoFile,
        trailId
      );
    }

    const trailData = {
      trailId,
      userId,
      nickname,
      title: trailInput.title,
      description: trailInput.description || null,
      coordinates,
      distance,
      duration,
      startTime: startTime ? Timestamp.fromDate(startTime) : null,
      endTime: endTime ? Timestamp.fromDate(endTime) : null,
      coverPhotoUrl,
      createdAt: now,
      updatedAt: now,
    };

    await addDoc(collection(db, TRAILS_COLLECTION), trailData);
    return trailId;
  } catch (error) {
    console.error('Error creating trail:', error);
    throw new Error('軌跡の作成に失敗しました');
  }
};

// 全Trailを取得
export const getAllTrails = async (): Promise<Trail[]> => {
  try {
    const q = query(
      collection(db, TRAILS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const trails: Trail[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        trailId: data.trailId,
        userId: data.userId,
        nickname: data.nickname,
        title: data.title,
        description: data.description || undefined,
        coordinates: data.coordinates || [],
        distance: data.distance || 0,
        duration: data.duration || 0,
        startTime: data.startTime?.toDate() || undefined,
        endTime: data.endTime?.toDate() || undefined,
        coverPhotoUrl: data.coverPhotoUrl || undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return trails;
  } catch (error) {
    console.error('Error getting trails:', error);
    throw new Error('軌跡の取得に失敗しました');
  }
};

// Trailを更新
export const updateTrail = async (
  trailId: string,
  updates: Partial<Trail>
): Promise<void> => {
  try {
    const trailsRef = collection(db, TRAILS_COLLECTION);
    const q = query(trailsRef);
    const querySnapshot = await getDocs(q);

    const trailDoc = querySnapshot.docs.find(
      (doc) => doc.data().trailId === trailId
    );

    if (!trailDoc) {
      throw new Error('軌跡が見つかりませんでした');
    }

    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    delete updateData.createdAt;

    await updateDoc(doc(db, TRAILS_COLLECTION, trailDoc.id), updateData);
  } catch (error) {
    console.error('Error updating trail:', error);
    throw new Error('軌跡の更新に失敗しました');
  }
};

// Trailを削除
export const deleteTrail = async (trailId: string): Promise<void> => {
  try {
    const trailsRef = collection(db, TRAILS_COLLECTION);
    const q = query(trailsRef);
    const querySnapshot = await getDocs(q);

    const trailDoc = querySnapshot.docs.find(
      (doc) => doc.data().trailId === trailId
    );

    if (!trailDoc) {
      throw new Error('軌跡が見つかりませんでした');
    }

    await deleteDoc(doc(db, TRAILS_COLLECTION, trailDoc.id));
  } catch (error) {
    console.error('Error deleting trail:', error);
    throw new Error('軌跡の削除に失敗しました');
  }
};
