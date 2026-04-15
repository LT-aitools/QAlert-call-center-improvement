import { useState, useRef, useEffect } from 'react';
import type { Submitter } from '../types/qalert';
import { mockSubmitters } from '../data/mockData';

interface WhoTabProps {
  submitter: Submitter | null;
  onSubmitterChange: (submitter: Submitter | null) => void;
  formData: Partial<Submitter>;
  onFormDataChange: (data: Partial<Submitter>) => void;
}

const BASE = import.meta.env.BASE_URL;

const BORDER        = '1px solid #c8d0d8';
const BORDER_LOCKED = '1px solid #d8dde3';
const H1 = '17px';
const H4 = '12px';
const T2 = '15px'; // sub-headings → h2
const T3 = '13px'; // field labels → h3
const T4 = H4;     // body text → h4

const BASE_INPUT: React.CSSProperties = {
  border: BORDER, fontSize: T3, padding: '5px 6px',
  width: '100%', boxSizing: 'border-box', outline: 'none',
  borderRadius: '3px',
};

const LABEL: React.CSSProperties = { display: 'block', fontSize: T3, color: '#555', marginBottom: '1px' };
const CB: React.CSSProperties    = { accentColor: '#16a34a', width: '15px', height: '15px', cursor: 'pointer' };

const emptyNotif = {
  primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false,
  alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false,
};

const emptyForm = {
  firstName: '', lastName: '', mi: '', address: '',
  city: 'Port St. Lucie', state: 'FL', zip: '',
  email: '', phone: '', unit: '', phoneExt: '', altPhone: '', altPhoneExt: '',
};

export function WhoTab({ submitter, onSubmitterChange, formData, onFormDataChange }: WhoTabProps) {
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<Submitter[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing]       = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Derived state
  const noneSelected = !submitter;
  const isLocked     = !!submitter && !isEditing; // submitter loaded but not in edit mode

  // Dynamic input style
  function inp(extra: React.CSSProperties = {}): React.CSSProperties {
    return {
      ...BASE_INPUT,
      backgroundColor: isLocked ? '#f0f2f4' : '#fff',
      border: isLocked ? BORDER_LOCKED : BORDER,
      color: isLocked ? '#555' : '#222',
      ...extra,
    };
  }

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); setShowDropdown(false); return; }
    const q = query.toLowerCase();
    const results = mockSubmitters.filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    );
    setSearchResults(results);
    setShowDropdown(true);
  }

  function selectSubmitter(s: Submitter) {
    onSubmitterChange(s);
    onFormDataChange(s);
    setSearchQuery(`${s.firstName} ${s.lastName}`);
    setShowDropdown(false);
    setIsEditing(false); // lock fields after selecting
  }

  function handlePencilClick() {
    if (submitter) setIsEditing(true);
  }

  function handleClearClick() {
    if (!submitter) return;
    if (window.confirm('Are you sure you want to clear ALL details for this submitter?')) {
      onSubmitterChange(null);
      onFormDataChange(emptyForm);
      setSearchQuery('');
      setSearchResults([]);
      setShowDropdown(false);
      setIsEditing(false);
    }
  }

  function f(field: keyof Submitter, value: string) {
    onFormDataChange({ ...formData, [field]: value });
  }
  function np(field: keyof Submitter['notificationPrefs'], value: boolean) {
    onFormDataChange({ ...formData, notificationPrefs: { ...(formData.notificationPrefs ?? emptyNotif), [field]: value } });
  }

  const notif = formData.notificationPrefs ?? emptyNotif;

  return (
    <div style={{ fontSize: T4, padding: '8px 24px' }}>

      <div style={{ fontSize: H1, fontWeight: 700, color: '#1a3a5c', marginBottom: '12px' }}>
        Resident's Details
      </div>

      {/* ═══ TOP SECTION: left = search+name, right = stats ═══ */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>

        {/* Left */}
        <div style={{ flex: 1, minWidth: 0 }}>

          <div style={{ fontSize: T3, fontWeight: 400, color: '#333', marginBottom: '4px' }}>Find Submitter</div>

          {/* Search field */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <div style={{ position: 'relative', display: 'inline-block', width: '340px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                placeholder="Search Submitter"
                style={{ ...BASE_INPUT, backgroundColor: '#fff', color: '#222', width: '340px', paddingRight: '22px' }}
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                style={{ position: 'absolute', right: '3px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <img src={`${BASE}icons/search.png`} alt="Search" style={{ height: '12px', opacity: 0.7 }} />
              </button>
            </div>

            {/* Pencil — dimmed until a submitter is loaded */}
            <ImgBtn src={`${BASE}icons/pencil.gif`} alt="Edit" onClick={handlePencilClick} dimmed={noneSelected} />
            {/* X — dimmed until a submitter is loaded; triggers confirm dialog */}
            <ImgBtn src={`${BASE}icons/cancel.gif`} alt="Clear" onClick={handleClearClick} dimmed={noneSelected} />

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, backgroundColor: '#fff', border: BORDER, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', width: '520px', marginTop: '1px' }}>
                {searchResults.map(s => {
                  const details = [s.address, s.email, s.phone].filter(Boolean).join(' · ');
                  return (
                    <div key={s.id} onClick={() => selectSubmitter(s)}
                      style={{ padding: '4px 7px', fontSize: T4, cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', gap: '16px', alignItems: 'baseline' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#cce8f8')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                      <span style={{ fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, minWidth: '130px' }}>{s.lastName}, {s.firstName}{s.mi ? ` ${s.mi}.` : ''}</span>
                      <span style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{details}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Name row */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <div style={{ flex: 1 }}>
              <label style={LABEL}>First Name</label>
              <input type="text" disabled={isLocked} value={formData.firstName ?? ''} onChange={e => f('firstName', e.target.value)} placeholder="First Name" style={inp()} />
            </div>
            <div style={{ width: '40px' }}>
              <label style={LABEL}>MI</label>
              <input type="text" disabled={isLocked} value={formData.mi ?? ''} onChange={e => f('mi', e.target.value)} placeholder="MI" maxLength={1} style={inp()} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={LABEL}>Last Name</label>
              <input type="text" disabled={isLocked} value={formData.lastName ?? ''} onChange={e => f('lastName', e.target.value)} placeholder="Last Name" style={inp()} />
            </div>
          </div>
        </div>

        {/* Submitter stats */}
        <div style={{ width: '160px', flexShrink: 0 }}>
          <div style={{ border: BORDER, borderRadius: '4px', backgroundColor: '#fff', padding: '8px 6px', fontSize: T4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '80px' }}>
            <div style={{ fontWeight: 700, fontSize: T2, color: '#1a3a5c', marginBottom: '6px' }}>Submitter stats</div>
            {submitter ? (() => {
              const stats = getMockStats(submitter);
              return (
                <>
                  <PieChart pct={stats.pct} />
                  <div style={{ marginTop: '6px', color: '#444', lineHeight: '1.4', fontSize: T4 }}>
                    <div>Last Contact:</div>
                    <div>{stats.lastContact}</div>
                  </div>
                </>
              );
            })() : (
              <div style={{ color: '#aaa', marginTop: '8px' }}>No stats to display</div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ HORIZONTAL DIVIDER ═══ */}
      <div style={{ borderTop: '1px solid #c8d0d8', marginBottom: '6px' }} />

      {/* ═══ BOTTOM SECTION ═══ */}

      {/* Address | Email */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={LABEL}>Address</label>
          <input type="text" disabled={isLocked} value={formData.address ?? ''} onChange={e => f('address', e.target.value)} placeholder="# Street" style={inp()} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={LABEL}>Email</label>
          <input type="email" disabled={isLocked} value={formData.email ?? ''} onChange={e => f('email', e.target.value)} placeholder="Email" style={inp()} />
        </div>
      </div>

      {/* Unit | Phone | Ext */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <div style={{ width: '120px' }}>
          <label style={LABEL}>Unit</label>
          <input type="text" disabled={isLocked} value={formData.unit ?? ''} onChange={e => f('unit', e.target.value)} placeholder="Suite, Apt, D/J" style={inp()} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={LABEL}>Phone</label>
          <input type="tel" disabled={isLocked} value={formData.phone ?? ''} onChange={e => f('phone', e.target.value)} placeholder="Phone" style={inp()} />
        </div>
        <div style={{ width: '48px' }}>
          <label style={LABEL}>Ext</label>
          <input type="text" disabled={isLocked} value={formData.phoneExt ?? ''} onChange={e => f('phoneExt', e.target.value)} placeholder="Ext" style={inp()} />
        </div>
      </div>

      {/* City | State | Zip | Alt Phone | Ext */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={LABEL}>City</label>
          <input type="text" disabled={isLocked} value={formData.city ?? 'Port St. Lucie'} onChange={e => f('city', e.target.value)} style={inp()} />
        </div>
        <div style={{ width: '38px' }}>
          <label style={LABEL}>State</label>
          <input type="text" disabled={isLocked} value={formData.state ?? 'FL'} onChange={e => f('state', e.target.value)} maxLength={2} style={inp()} />
        </div>
        <div style={{ width: '72px' }}>
          <label style={LABEL}>Zip</label>
          <input type="text" disabled={isLocked} value={formData.zip ?? ''} onChange={e => f('zip', e.target.value)} placeholder="Postal Code" style={inp()} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={LABEL}>All Phone</label>
          <input type="tel" disabled={isLocked} value={formData.altPhone ?? ''} onChange={e => f('altPhone', e.target.value)} placeholder="Alt Phone" style={inp()} />
        </div>
        <div style={{ width: '48px' }}>
          <label style={LABEL}>Ext</label>
          <input type="text" disabled={isLocked} value={formData.altPhoneExt ?? ''} onChange={e => f('altPhoneExt', e.target.value)} placeholder="Ext" style={inp()} />
        </div>
      </div>

      {/* ═══ NOTIFICATION PREFERENCES ═══ */}
      <div style={{ paddingTop: '6px', marginTop: '2px' }}>
        <div style={{ fontSize: H1, fontWeight: 700, color: '#333', marginBottom: '4px', borderBottom: '1px solid #c8d0d8', paddingBottom: '4px' }}>Notification Preferences</div>
        <table style={{ borderCollapse: 'collapse', fontSize: T4 }}>
          <thead>
            <tr>
              <th style={{ fontWeight: 400, fontSize: T4, color: '#444', textAlign: 'left', paddingRight: '16px', paddingBottom: '2px' }}>Phone</th>
              <th style={{ fontWeight: 400, fontSize: T4, color: '#444', textAlign: 'center', padding: '0 12px 2px', borderRight: '1px solid #888' }}>Voice</th>
              <th style={{ fontWeight: 400, fontSize: T4, color: '#444', textAlign: 'center', padding: '0 12px 2px' }}>Text</th>
              <th style={{ fontWeight: 400, fontSize: T4, color: '#444', textAlign: 'center', padding: '0 12px 2px' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontSize: T4, color: '#555', paddingRight: '16px', paddingTop: '2px', paddingBottom: '2px' }}>Primary</td>
              <td style={{ textAlign: 'center', padding: '2px 12px', borderRight: '1px solid #888' }}>
                <input type="checkbox" disabled={isLocked} checked={notif.primaryVoice}   onChange={e => np('primaryVoice', e.target.checked)}   style={CB} />
              </td>
              <td style={{ textAlign: 'center', padding: '2px 12px' }}>
                <input type="checkbox" disabled={isLocked} checked={notif.primaryText}    onChange={e => np('primaryText', e.target.checked)}    style={CB} />
              </td>
              <td style={{ textAlign: 'center', padding: '2px 12px' }}>
                <input type="checkbox" disabled={isLocked} checked={notif.primaryEmail}   onChange={e => np('primaryEmail', e.target.checked)}   style={CB} />
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: T4, color: '#555', paddingRight: '16px', paddingTop: '2px', paddingBottom: '2px' }}>Alternate</td>
              <td style={{ textAlign: 'center', padding: '2px 12px', borderRight: '1px solid #888' }}>
                <input type="checkbox" disabled={isLocked} checked={notif.alternateVoice} onChange={e => np('alternateVoice', e.target.checked)} style={CB} />
              </td>
              <td style={{ textAlign: 'center', padding: '2px 12px' }}>
                <input type="checkbox" disabled={isLocked} checked={notif.alternateText}  onChange={e => np('alternateText', e.target.checked)}  style={CB} />
              </td>
              <td style={{ padding: '2px 12px' }} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const MOCK_STATS = [
  { pct: 100, lastContact: '4/12/2021 7:56 PM' },
  { pct: 98,  lastContact: '2/26/2026 11:58 PM' },
  { pct: 87,  lastContact: '3/3/2020 10:37 PM' },
  { pct: 75,  lastContact: '1/15/2024 2:30 PM' },
  { pct: 94,  lastContact: '8/7/2023 9:15 AM' },
  { pct: 82,  lastContact: '11/30/2022 4:44 PM' },
];

function getMockStats(s: Submitter) {
  return MOCK_STATS[parseInt(s.id, 10) % MOCK_STATS.length];
}

function PieChart({ pct }: { pct: number }) {
  const cx = 40, cy = 40, r = 32;

  // Full circle special case
  if (pct >= 100) {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={r} fill="#1a3a5c" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">100%</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill="#fff" fontSize="11">Closed</text>
      </svg>
    );
  }

  // Arc end point (clockwise from 12 o'clock)
  const angle = (pct / 100) * 2 * Math.PI;
  const ex = cx + r * Math.sin(angle);
  const ey = cy - r * Math.cos(angle);
  const large = pct > 50 ? 1 : 0;

  // Grey background slice (open %)
  const startX = cx;
  const startY = cy - r;
  // openAngle, ox, oy, openLarge kept for reference but grey slice drawn as full circle

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      {/* Grey background full circle */}
      <circle cx={cx} cy={cy} r={r} fill="#d8dde4" />
      {/* Navy closed arc */}
      <path
        d={`M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`}
        fill="#1a3a5c"
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">{pct}%</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="#fff" fontSize="11">Closed</text>
    </svg>
  );
}

function ImgBtn({ src, alt, onClick, dimmed }: {
  src: string; alt: string; onClick?: () => void; dimmed?: boolean;
}) {
  return (
    <button
      onClick={dimmed ? undefined : onClick}
      style={{
        padding: '1px 2px', background: 'none', border: 'none',
        cursor: dimmed ? 'default' : 'pointer',
        display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle',
        opacity: dimmed ? 0.4 : 1,
      }}
    >
      <img src={src} alt={alt} style={{ height: '13px' }} />
    </button>
  );
}
