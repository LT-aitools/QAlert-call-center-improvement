import { useState, useRef, useEffect } from 'react';
import type { Submitter } from '../types/qalert';

const BASE = import.meta.env.BASE_URL;

const BORDER    = '1px solid #c8d0d8';
const T3        = '12px';
const T4        = '11px';
const SKY_BLUE  = '#cce8f8';

// ─── Map helpers ─────────────────────────────────────────────────────────────

const DEFAULT_CENTER = { lat: 27.2718, lon: -80.3523 };
const DEFAULT_ZOOM   = 13;
const MIN_ZOOM       = 10;
const MAX_ZOOM       = 19;

// Hardcoded pin-drop destination — 248 SW Glenwood Dr, PSL
const PIN_LOCATION = {
  lat:          27.2718286,
  lon:          -80.3522609,
  streetNumber: '248',
  streetName:   'SW Glenwood Dr',
  coords:       '27.2718286, -80.3522609',
  district:     '18',
};

// Street view photo — save the screenshot to public/streetview-psl.jpg
const STREET_VIEW_IMG = `${BASE}streetview-psl.jpg`;
const STREET_VIEW_ADDR = '271 SW Statler Ave';
const STREET_VIEW_CITY = 'Port St. Lucie, Florida';

function buildMapSrc(
  zoom:   number,
  center: { lat: number; lon: number },
  marker?: { lat: number; lon: number },
): string {
  const lonSpan = 0.22 * Math.pow(2, DEFAULT_ZOOM - zoom);
  const latSpan = 0.12 * Math.pow(2, DEFAULT_ZOOM - zoom);
  const w = (center.lon - lonSpan / 2).toFixed(5);
  const e = (center.lon + lonSpan / 2).toFixed(5);
  const s = (center.lat - latSpan / 2).toFixed(5);
  const n = (center.lat + latSpan / 2).toFixed(5);
  let url = `https://www.openstreetmap.org/export/embed.html?bbox=${w}%2C${s}%2C${e}%2C${n}&layer=mapnik`;
  if (marker) url += `&marker=${marker.lat.toFixed(5)}%2C${marker.lon.toFixed(5)}`;
  return url;
}

const MAP_TYPES = ['Roadmap', 'Satellite', 'Hybrid', 'Terrain'] as const;

const OVERLAYS = [
  'Canals', 'City Limit', 'City Sections', 'Code Zones', 'Council Districts',
  'Culvert Master Plan', 'Culverts', 'Neighborhoods', 'Neighborhoods by Code Zone', 'Parks',
];

const STREET_NAMES = [
  'SW Burlington St', 'SW Cameo Blvd', 'SW Aleon St', 'W McKeen St',
  'NW Kilpatrick Ave', 'SW Cashmere Blvd', 'SE Melanore Blvd',
  'SE Capahart Ave', 'NW Marion Ave', 'W Aleen St', 'SW California Blvd',
  'SW Glenwood Dr',
];

const MOCK_LOOKUPS: Record<string, { streetName: string; coords: string; district: string }> = {
  '2175': { streetName: 'SW Burlington St', coords: '27.2768620, -80.3626541', district: '16' },
  '2171': { streetName: 'SW Burlington St', coords: '27.2770192, -80.3527115', district: '16' },
  '1501': { streetName: 'SW Cameo Blvd',    coords: '27.2712843, -80.3491205', district: '14' },
  '224':  { streetName: 'W Aleen St',       coords: '27.5218497, -80.3698907', district: '27' },
  '1890': { streetName: 'SE Capahart Ave',  coords: '27.2789012, -80.3345678', district: '21' },
  '2814': { streetName: 'SE Melanore Blvd', coords: '27.2645123, -80.3512345', district: '14' },
};

const CIRCLE_BTN: React.CSSProperties = {
  width: '24px', height: '24px', borderRadius: '50%',
  backgroundColor: '#3d3d3d', border: 'none', cursor: 'pointer',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, lineHeight: 1, padding: 0,
};

const INPUT_STYLE: React.CSSProperties = {
  border: BORDER, borderRadius: '3px', fontSize: T3,
  padding: '4px 6px', outline: 'none', color: '#222',
  width: '100%', boxSizing: 'border-box',
};

const SELECT_STYLE: React.CSSProperties = {
  border: BORDER, borderRadius: '3px', fontSize: T3,
  padding: '4px 4px', outline: 'none', color: '#222',
  width: '100%', boxSizing: 'border-box', backgroundColor: '#fff',
};

const FORM_BTN: React.CSSProperties = {
  border: BORDER, borderRadius: '2px', background: '#f5f6f7',
  padding: '2px 6px', cursor: 'pointer', fontSize: '10px', lineHeight: 1, color: '#444',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '7px' }}>
      <div style={{ fontSize: T4, color: '#555', marginBottom: '2px' }}>{label}</div>
      {children}
    </div>
  );
}

function MapTypeItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: '5px 12px', fontSize: T4, cursor: 'pointer', whiteSpace: 'nowrap', backgroundColor: active ? SKY_BLUE : hovered ? '#f0f4f8' : '#fff' }}
    >
      {label}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WhereTabProps {
  onAddressChange?: (a: string) => void;
  residentFormData?: Partial<Submitter>;
}

export function WhereTab({ onAddressChange, residentFormData }: WhereTabProps = {}) {
  const [city, setCity]                       = useState('Port St. Lucie');
  const [streetNumber, setStreetNumber]       = useState('');
  const [streetName, setStreetName]           = useState('');
  const [unitNumber, setUnitNumber]           = useState('');
  const [crossStreet, setCrossStreet]         = useState('');
  const [useResidentAddress, setUseResidentAddress] = useState(false);
  const [coordinates, setCoordinates]         = useState('N/A');
  const [district, setDistrict]               = useState('UNPLATTED');
  const [autoUpdate, setAutoUpdate]           = useState(true);
  const [mapType, setMapType]                 = useState('Roadmap');
  const [mapTypeOpen, setMapTypeOpen]         = useState(false);
  const [overlaysOpen, setOverlaysOpen]       = useState(false);
  const [activeOverlays, setActiveOverlays]   = useState<string[]>([]);
  const [mapSearch, setMapSearch]             = useState('');
  const [pinDropped, setPinDropped]           = useState(false);
  const [pinPos, setPinPos]                   = useState({ x: 50, y: 50 });
  const [isDraggingPin, setIsDraggingPin]     = useState(false);
  const [isDraggingPegman, setIsDraggingPegman] = useState(false);
  const [streetViewOpen, setStreetViewOpen]   = useState(false);
  const [zoom, setZoom]                       = useState(DEFAULT_ZOOM);
  const [mapCenter, setMapCenter]             = useState(DEFAULT_CENTER);
  const [mapMarker, setMapMarker]             = useState<{ lat: number; lon: number } | undefined>();

  const mapTypeRef  = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<HTMLDivElement>(null);
  const mapDivRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (mapTypeRef.current && !mapTypeRef.current.contains(e.target as Node)) setMapTypeOpen(false);
      if (overlaysRef.current && !overlaysRef.current.contains(e.target as Node)) setOverlaysOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (useResidentAddress && residentFormData) {
      const raw = residentFormData.address?.trim() ?? '';
      const spaceIdx = raw.indexOf(' ');
      const num  = spaceIdx > -1 ? raw.slice(0, spaceIdx) : raw;
      const name = spaceIdx > -1 ? raw.slice(spaceIdx + 1) : '';
      setStreetNumber(num);
      setStreetName(name);
      setUnitNumber(residentFormData.unit ?? '');
      if (residentFormData.city) setCity(residentFormData.city);
      onAddressChange?.(raw ? `${raw}, ${residentFormData.city ?? city}` : '');
    } else if (!useResidentAddress) {
      setStreetNumber('');
      setStreetName('');
      setUnitNumber('');
    }
  }, [useResidentAddress]);

  function handleAddressSearch() {
    const mock = MOCK_LOOKUPS[streetNumber.trim()];
    if (mock) {
      setStreetName(mock.streetName);
      setCoordinates(mock.coords);
      setDistrict(mock.district);
    }
  }

  function zoomIn()  { setZoom(z => Math.min(MAX_ZOOM, z + 1)); }
  function zoomOut() { setZoom(z => Math.max(MIN_ZOOM, z - 1)); }

  const isAnythingDragging = isDraggingPin || isDraggingPegman;

  function dropLocation() {
    // Shared logic: zoom map to pin location + fill address fields
    const dest      = PIN_LOCATION;
    const newCenter = { lat: dest.lat, lon: dest.lon };
    setMapCenter(newCenter);
    setZoom(17);
    setMapMarker(newCenter);
    setPinDropped(true);
    setPinPos({ x: 50, y: 50 });
    if (autoUpdate) {
      setStreetNumber(dest.streetNumber);
      setStreetName(dest.streetName);
      setCoordinates(dest.coords);
      setDistrict(dest.district);
      onAddressChange?.(`${dest.streetNumber} ${dest.streetName}, ${city}`);
    }
  }

  function handleMapDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const kind = e.dataTransfer.getData('text/plain');

    if (kind === 'pegman') {
      setIsDraggingPegman(false);
      dropLocation();          // fill address + zoom in
      setStreetViewOpen(true); // AND show street view
      return;
    }

    // pushpin: zoom in + fill address, map stays as roadmap
    setIsDraggingPin(false);
    dropLocation();
  }

  const mapSrc = buildMapSrc(zoom, mapCenter, mapMarker);

  return (
    <div style={{ display: 'flex', padding: '10px 24px', fontSize: T4, gap: '16px' }}>

      {/* ── Left: Map panel ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* h1 heading */}
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a3a5c', marginTop: '10px', marginBottom: '14px' }}>
          Where is the issue?
        </div>

        {/* Search bar + pushpin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={mapSearch}
              onChange={e => setMapSearch(e.target.value)}
              placeholder="Search"
              style={{ ...INPUT_STYLE, fontSize: '13px', padding: '7px 32px 7px 8px' }}
            />
            <img
              src={`${BASE}icons/search.png`}
              alt="search"
              style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', opacity: 0.55, pointerEvents: 'none' }}
            />
          </div>

          {/* Draggable pushpin — div wrapper avoids native <img> drag conflicts */}
          <div
            draggable
            onDragStart={e => { e.dataTransfer.setData('text/plain', 'pushpin'); setIsDraggingPin(true); }}
            onDragEnd={() => setIsDraggingPin(false)}
            title="Drag to drop a pin on the map"
            style={{
              cursor: isDraggingPin ? 'grabbing' : 'grab',
              opacity: pinDropped ? 0.4 : 1,
              flexShrink: 0,
              lineHeight: 0,
              userSelect: 'none',
            }}
          >
            <img
              src={`${BASE}icons/pushpin.png`}
              alt="Drop pin"
              draggable={false}
              style={{ height: '22px', width: 'auto', display: 'block', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* Map area */}
        <div
          ref={mapDivRef}
          style={{ position: 'relative', width: '100%', height: '250px', border: BORDER, overflow: 'hidden', backgroundColor: '#e8e0d8' }}
        >
          <iframe
            title="Port St. Lucie Map"
            src={mapSrc}
            style={{ width: '100%', height: 'calc(100% + 32px)', border: 'none' }}
            loading="lazy"
          />

          {/* Drag-catcher overlay — activates while dragging pin or pegman */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleMapDrop}
            style={{
              position: 'absolute', inset: 0, zIndex: 5,
              pointerEvents: isAnythingDragging ? 'all' : 'none',
              // Blue tint when dragging pegman (like Google Maps)
              backgroundColor: isDraggingPegman
                ? 'rgba(66,133,244,0.22)'
                : isDraggingPin
                  ? 'rgba(100,160,255,0.08)'
                  : 'transparent',
              transition: 'background-color 0.15s ease',
              cursor: isDraggingPegman ? 'crosshair' : isDraggingPin ? 'copy' : 'default',
            }}
          />

          {/* ── Floating controls — top-left ── */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px', zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.93)',
            borderRadius: '4px', boxShadow: '0 1px 5px rgba(0,0,0,0.28)',
            padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <button onClick={zoomOut} style={{ ...CIRCLE_BTN, fontSize: '18px', fontWeight: 300 }} title="Zoom out">−</button>
            <button onClick={zoomIn}  style={{ ...CIRCLE_BTN, fontSize: '16px', fontWeight: 300 }} title="Zoom in">+</button>

            <div ref={overlaysRef} style={{ position: 'relative' }}>
              <button onClick={() => setOverlaysOpen(o => !o)} style={{ ...CIRCLE_BTN, fontSize: '15px' }} title="Map Overlays">≡</button>
              {overlaysOpen && (
                <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 300, backgroundColor: '#fff', border: BORDER, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', minWidth: '215px', maxHeight: '230px', overflowY: 'auto', borderRadius: '3px' }}>
                  {OVERLAYS.map(o => (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 10px', fontSize: T4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <input
                        type="checkbox"
                        checked={activeOverlays.includes(o)}
                        onChange={e => setActiveOverlays(prev => e.target.checked ? [...prev, o] : prev.filter(x => x !== o))}
                        style={{ accentColor: '#16a34a', width: '12px', height: '12px', cursor: 'pointer' }}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div ref={mapTypeRef} style={{ position: 'relative' }}>
              <button onClick={() => setMapTypeOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: T4, color: '#222', padding: '0 2px', whiteSpace: 'nowrap', fontWeight: 500 }}>
                Map Type: {mapType}
              </button>
              {mapTypeOpen && (
                <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 300, backgroundColor: '#fff', border: BORDER, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', minWidth: '110px', borderRadius: '3px' }}>
                  {MAP_TYPES.map(mt => (
                    <MapTypeItem key={mt} label={mt} active={mt === mapType} onClick={() => { setMapType(mt); setMapTypeOpen(false); }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Pegman — grey card covers OSM's native +/- buttons ── */}
          <div style={{
            position: 'absolute', top: '4px', right: '4px', zIndex: 10,
            backgroundColor: '#d6d2cc',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            padding: '6px 7px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '72px',
          }}>
            {/* Draggable wrapper div — avoids browser native <img> drag conflicts */}
            <div
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('text/plain', 'pegman');
                setIsDraggingPegman(true);
              }}
              onDragEnd={() => setIsDraggingPegman(false)}
              title="Drag to see Street View"
              style={{
                cursor: isDraggingPegman ? 'grabbing' : 'grab',
                userSelect: 'none',
                opacity: isDraggingPegman ? 0.5 : 1,
                transition: 'opacity 0.15s ease',
                lineHeight: 0,
              }}
            >
              {/* img must NOT be draggable — only the div drags */}
              <img
                src={`${BASE}icons/pegman.png`}
                alt="Street View"
                draggable={false}
                style={{ width: '32px', display: 'block', pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* Dropped pushpin marker */}
          {pinDropped && (
            <img
              src={`${BASE}icons/pushpin.png`}
              alt="pin"
              style={{
                position: 'absolute', left: `${pinPos.x}%`, top: `${pinPos.y}%`,
                transform: 'translate(-50%, -100%)', width: '22px', zIndex: 15,
                pointerEvents: 'none', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
              }}
            />
          )}

          {/* ── Street View overlay ── */}
          {streetViewOpen && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 20,
              backgroundImage: `url(${STREET_VIEW_IMG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#444',
            }}>
              {/* Address card — top-left, like Google Maps */}
              <div style={{
                position: 'absolute', top: '8px', left: '8px',
                backgroundColor: 'rgba(30,30,30,0.82)',
                borderRadius: '4px', padding: '8px 10px',
                display: 'flex', flexDirection: 'column', gap: '2px',
                maxWidth: '200px',
              }}>
                {/* Back button + address */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setStreetViewOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '16px', lineHeight: 1, padding: 0, flexShrink: 0 }}
                    title="Back to map"
                  >←</button>
                  <div>
                    <div style={{ fontSize: T3, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{STREET_VIEW_ADDR}</div>
                    <div style={{ fontSize: T4, color: '#ccc', lineHeight: 1.3 }}>{STREET_VIEW_CITY}</div>
                  </div>
                </div>
                {/* Pin icon row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '22px' }}>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="#4285f4"><path d="M8 0C5.24 0 3 2.24 3 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 7.5A2.5 2.5 0 1 1 8 2.5 2.5 2.5 0 0 1 8 7.5z"/></svg>
                  <span style={{ fontSize: '9px', color: '#4285f4', cursor: 'pointer' }}>View on Google Maps</span>
                </div>
              </div>

              {/* Fullscreen icon — top-right */}
              <button
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(30,30,30,0.7)', border: 'none', borderRadius: '3px', padding: '5px 6px', cursor: 'pointer', color: '#fff', fontSize: '12px', lineHeight: 1 }}
                title="Fullscreen"
              >⛶</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Address form ── */}
      <div style={{ width: '205px', flexShrink: 0 }}>

        {/* Resident address checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#222', marginBottom: '10px', padding: '6px 8px', backgroundColor: useResidentAddress ? '#e8f4ec' : '#f5f6f7', border: '1px solid #c8d0d8', borderRadius: '3px' }}>
          <input
            type="checkbox"
            checked={useResidentAddress}
            onChange={e => setUseResidentAddress(e.target.checked)}
            style={{ accentColor: '#16a34a', width: '14px', height: '14px', cursor: 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>Add resident's address from 'Who' tab</span>
        </label>

        <FormRow label="City">
          <select value={city} onChange={e => setCity(e.target.value)} disabled={useResidentAddress} style={{ ...SELECT_STYLE, backgroundColor: useResidentAddress ? '#f0f2f4' : '#fff', color: useResidentAddress ? '#555' : '#222' }}>
            <option>Port St. Lucie</option>
            <option>Fort Pierce</option>
            <option>Stuart</option>
          </select>
        </FormRow>

        <FormRow label="Street Number">
          <input
            type="text"
            value={streetNumber}
            onChange={e => setStreetNumber(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddressSearch(); }}
            disabled={useResidentAddress}
            style={{ ...INPUT_STYLE, backgroundColor: useResidentAddress ? '#f0f2f4' : '#fff', color: useResidentAddress ? '#555' : '#222' }}
          />
        </FormRow>

        <FormRow label="Street Name">
          {useResidentAddress ? (
            <input
              type="text"
              value={streetName}
              disabled
              style={{ ...INPUT_STYLE, backgroundColor: '#f0f2f4', color: '#555' }}
            />
          ) : (
            <select value={streetName} onChange={e => setStreetName(e.target.value)} style={SELECT_STYLE}>
              <option value=""></option>
              {STREET_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </FormRow>

        <FormRow label="Unit Number">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <input
              type="text"
              value={unitNumber}
              onChange={e => setUnitNumber(e.target.value)}
              disabled={useResidentAddress}
              style={{ ...INPUT_STYLE, flex: 1, width: 'auto', backgroundColor: useResidentAddress ? '#f0f2f4' : '#fff', color: useResidentAddress ? '#555' : '#222' }}
            />
            {unitNumber && !useResidentAddress && (
              <button onClick={() => setUnitNumber('')} style={{ ...FORM_BTN, padding: '2px 5px', fontSize: '9px' }}>✕</button>
            )}
          </div>
        </FormRow>

        <FormRow label="Cross Street">
          <select value={crossStreet} onChange={e => setCrossStreet(e.target.value)} style={SELECT_STYLE}>
            <option value=""></option>
            {STREET_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormRow>

        <div style={{ height: '8px' }} />

        <div style={{ marginBottom: '5px' }}>
          <div style={{ fontSize: T4, color: '#555', marginBottom: '1px' }}>Coordinates</div>
          <div style={{ fontSize: T4, color: '#222' }}>{coordinates}</div>
        </div>

        <div style={{ marginBottom: '7px' }}>
          <div style={{ fontSize: T4, color: '#555', marginBottom: '1px' }}>District</div>
          <div style={{ fontSize: T4, color: '#222' }}>{district}</div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: T4, cursor: 'pointer', color: '#222' }}>
          <input
            type="checkbox"
            checked={autoUpdate}
            onChange={e => setAutoUpdate(e.target.checked)}
            style={{ accentColor: '#16a34a', width: '13px', height: '13px', cursor: 'pointer' }}
          />
          Auto update map and form
        </label>
      </div>

    </div>
  );
}
