import { TrailPoint, GpxParseResult } from '../types';
import { calculateTotalDistance } from '../utils/geo';

/**
 * GPXファイルをパースしてTrailPoint配列と統計情報を返す
 */
export const parseGpxFile = async (file: File): Promise<GpxParseResult> => {
  const text = await file.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');

  // パースエラーチェック
  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    throw new Error('GPXファイルの形式が正しくありません');
  }

  // トラックポイントを取得
  const trackpoints = xml.querySelectorAll('trkpt');
  if (trackpoints.length === 0) {
    throw new Error('GPXファイルにトラックポイントが含まれていません');
  }

  const coordinates: TrailPoint[] = [];

  trackpoints.forEach((trkpt) => {
    const lat = parseFloat(trkpt.getAttribute('lat') || '0');
    const lon = parseFloat(trkpt.getAttribute('lon') || '0');
    const eleEl = trkpt.querySelector('ele');
    const timeEl = trkpt.querySelector('time');

    coordinates.push({
      latitude: lat,
      longitude: lon,
      elevation: eleEl ? parseFloat(eleEl.textContent || '0') : undefined,
      timestamp: timeEl ? timeEl.textContent || undefined : undefined,
    });
  });

  // 5000点超の場合はダウンサンプリング
  const sampled = downsampleIfNeeded(coordinates, 5000);

  // 総距離を計算
  const distance = calculateTotalDistance(sampled);

  // 開始・終了時刻と所要時間を計算
  const startTime = coordinates[0]?.timestamp
    ? new Date(coordinates[0].timestamp)
    : undefined;
  const lastTimestamp = coordinates[coordinates.length - 1]?.timestamp;
  const endTime = lastTimestamp
    ? new Date(lastTimestamp)
    : undefined;
  const duration =
    startTime && endTime
      ? (endTime.getTime() - startTime.getTime()) / 1000
      : 0;

  // トラック名を取得
  const nameEl = xml.querySelector('trk > name');
  const name = nameEl?.textContent || undefined;

  return { coordinates: sampled, distance, duration, startTime, endTime, name };
};

/**
 * 座標配列が上限を超えていたら均等にダウンサンプリング
 */
const downsampleIfNeeded = (
  points: TrailPoint[],
  maxPoints: number
): TrailPoint[] => {
  if (points.length <= maxPoints) return points;

  const result: TrailPoint[] = [points[0]];
  const step = (points.length - 1) / (maxPoints - 1);

  for (let i = 1; i < maxPoints - 1; i++) {
    result.push(points[Math.round(i * step)]);
  }
  result.push(points[points.length - 1]);

  return result;
};
