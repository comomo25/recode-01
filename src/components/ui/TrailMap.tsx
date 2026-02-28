import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, LatLngBounds } from 'leaflet';
import { TrailPoint, Post } from '../../types';
import { postIcon } from '../../utils/mapIcons';

interface TrailMapProps {
  coordinates: TrailPoint[];
  posts?: Post[];
  onPostClick?: (post: Post) => void;
  className?: string;
}

const TrailMap = ({ coordinates, posts = [], onPostClick, className = 'h-64' }: TrailMapProps) => {
  if (coordinates.length === 0) return null;

  // 座標からboundsを計算してフィットさせる
  const positions: LatLngExpression[] = coordinates.map((p) => [p.latitude, p.longitude]);

  const lats = coordinates.map((p) => p.latitude);
  const lngs = coordinates.map((p) => p.longitude);
  const bounds = new LatLngBounds(
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)]
  );

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [20, 20] }}
      className={`w-full ${className}`}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 軌跡のポリライン */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#3B82F6', weight: 4, opacity: 0.8 }}
      />

      {/* 投稿のマーカー */}
      {posts.map((post) => (
        <Marker
          key={post.postId}
          position={[post.latitude, post.longitude]}
          icon={postIcon}
          eventHandlers={{
            click: () => onPostClick?.(post),
          }}
        >
          <Popup>
            <div className="max-w-xs">
              {post.photoUrl && (
                <img src={post.photoUrl} alt="" className="w-full h-20 object-cover rounded mb-1" />
              )}
              {post.textMemo && (
                <p className="text-xs text-gray-600 line-clamp-2">{post.textMemo}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TrailMap;
