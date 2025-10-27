import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Geolocation, Post } from '../types';

interface MapProps {
  center: Geolocation | null;
  posts: Post[];
  onPostClick: (post: Post) => void;
  onMapReady?: () => void;
}

// 地図の中心を更新するコンポーネント
function ChangeMapView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const Map = ({ center, posts, onPostClick, onMapReady }: MapProps) => {
  const mapRef = useRef<boolean>(false);

  // デフォルト位置（東京駅）
  const defaultCenter: LatLngExpression = [35.681236, 139.767125];
  const mapCenter: LatLngExpression = center
    ? [center.latitude, center.longitude]
    : defaultCenter;

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = true;
      onMapReady?.();
    }
  }, [onMapReady]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && <ChangeMapView center={mapCenter} />}

      {/* 投稿のピンを表示 */}
      {posts.map((post) => (
        <Marker
          key={post.postId}
          position={[post.latitude, post.longitude]}
          eventHandlers={{
            click: () => onPostClick(post),
          }}
        >
          <Popup>
            <div className="max-w-xs">
              <div className="font-bold text-sm mb-1">{post.nickname}</div>
              {post.textMemo && (
                <div className="text-xs text-gray-600 line-clamp-3">
                  {post.textMemo}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                クリックして詳細を表示
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
