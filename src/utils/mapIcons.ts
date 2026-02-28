import L from 'leaflet';

// アプリのブランドカラーに合わせたカスタムピンアイコン（SVG）
const createPinSvg = (color: string, strokeColor: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
  <defs>
    <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
        fill="${color}" stroke="${strokeColor}" stroke-width="1" filter="url(#shadow)"/>
  <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
</svg>`;

// 投稿マーカー（プライマリカラー: Blue-600）
export const postIcon = L.divIcon({
  html: createPinSvg('#2563EB', '#1D4ED8'),
  className: '',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

// Trail開始地点マーカー（Green-600）
export const trailStartIcon = L.divIcon({
  html: createPinSvg('#16A34A', '#15803D'),
  className: '',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

// 現在地マーカー（赤）
export const currentLocationIcon = L.divIcon({
  html: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="8" fill="#2563EB" stroke="white" stroke-width="3" opacity="0.9"/>
  <circle cx="10" cy="10" r="3" fill="white"/>
</svg>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
