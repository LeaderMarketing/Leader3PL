import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WAREHOUSES } from '../data/warehouses';

function createMarkerIcon(isSelected) {
  const size = isSelected ? 28 : 16;
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${isSelected ? '#2563EB' : '#64748B'};
      border: ${isSelected ? '3px solid #BFDBFE' : '2px solid #E2E8F0'};
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(37,99,235,${isSelected ? '0.45' : '0.15'});
      transition: all 0.3s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  });
}

function MapController({ selected, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      const wh = WAREHOUSES.find((w) => w.state === selected);
      if (wh) {
        // Offset the target latitude south so the popup appears in the visible
        // lower portion of the map (below the overlaid text & buttons)
        const offsetLat = wh.lat + 4.5;
        map.flyTo([offsetLat, wh.lng], 6, { duration: 1.2 });
        // Open the popup for the selected marker after fly completes
        setTimeout(() => {
          const ref = markerRefs.current[selected];
          if (ref) ref.openPopup();
        }, 1300);
      }
    }
  }, [selected, map, markerRefs]);

  return null;
}

const WarehouseMap = forwardRef(function WarehouseMap({ selected, onSelect, style }, ref) {
  const markerRefs = useRef({});

  const openPopup = useCallback((state) => {
    const mRef = markerRefs.current[state];
    if (mRef) mRef.openPopup();
  }, []);

  useImperativeHandle(ref, () => ({ openPopup }), [openPopup]);

  return (
    <div style={{ width: '100%', position: 'relative', ...style }}>
      <MapContainer
        center={[-27.5, 134.5]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={true}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController selected={selected} markerRefs={markerRefs} />
        {WAREHOUSES.map((wh) => (
          <Marker
            key={`${wh.state}-${selected === wh.state}`}
            position={[wh.lat, wh.lng]}
            icon={createMarkerIcon(selected === wh.state)}
            ref={(r) => { if (r) markerRefs.current[wh.state] = r; }}
            eventHandlers={{
              click: () => onSelect(wh.state),
            }}
          >
            <Popup maxWidth={420} minWidth={380}>
              <div
                style={{
                  display: 'flex',
                  width: 390,
                  height: 166,
                  fontFamily: "'Inter', sans-serif",
                  overflow: 'hidden',
                }}
              >
                {/* Image area */}
                <div
                  style={{
                    width: 182,
                    height: 166,
                    flexShrink: 0,
                    background: '#F1F5F9',
                    overflow: 'hidden',
                    borderRadius: '6px 0 0 6px',
                  }}
                >
                  <img
                    src={wh.image}
                    alt={`${wh.branchName} street view`}
                    style={{
                      width: 182,
                      height: 166,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div style="
                          width: 100%;
                          height: 100%;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
                          color: #2563EB;
                          font-size: 13px;
                          font-weight: 600;
                          text-align: center;
                          padding: 12px;
                          font-family: 'Inter', sans-serif;
                        ">
                          <div style="font-size: 28px; margin-bottom: 6px; font-weight: 800;">${wh.state}</div>
                          <div style="font-size: 11px; color: #64748B;">${wh.city}</div>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Info area */}
                <div
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.25,
                    }}
                  >
                    {wh.branchName}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 6,
                      fontSize: 12,
                      color: '#475569',
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: 2, color: '#2563EB' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                    <span>{wh.address}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: '#2563EB' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                    <a
                      href={`tel:${wh.phone.replace(/\s/g, '')}`}
                      style={{
                        color: '#2563EB',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {wh.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
});

export default WarehouseMap;
