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
const H2 = '15px';
const H4 = '12px';
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
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState<Submitter[]>([]);
  const [showDropdown, setShowDropdown]   = useState(false);
  const [isEditing, setIsEditing]         = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [notifNone, setNotifNone]         = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Derived state
  const noSubmitter = !submitter;
  const isLocked    = !!submitter && !isEditing; // submitter loaded but not in edit mode

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
      setShowManualEntry(false);
    }
  }

  function f(field: keyof Submitter, value: string) {
    onFormDataChange({ ...formData, [field]: value });
  }
  function np(field: keyof Submitter['notificationPrefs'], value: boolean) {
    onFormDataChange({ ...formData, notificationPrefs: { ...(formData.notificationPrefs ?? emptyNotif), [field]: value } });
  }

  const notif = formData.notificationPrefs ?? emptyNotif;

  // Derived notification state
  const textEnabled = notif.primaryText || notif.alternateText;
  const textTarget  = notif.alternateText ? 'alternate' : 'primary';
  const callEnabled = notif.primaryVoice || notif.alternateVoice;
  const callTarget  = notif.alternateVoice ? 'alternate' : 'primary';

  function setTextEnabled(on: boolean) {
    if (on) setNotifNone(false);
    onFormDataChange({ ...formData, notificationPrefs: { ...(formData.notificationPrefs ?? emptyNotif), primaryText: on, alternateText: false } });
  }
  function setTextTarget(target: 'primary' | 'alternate') {
    onFormDataChange({ ...formData, notificationPrefs: { ...(formData.notificationPrefs ?? emptyNotif), primaryText: target === 'primary', alternateText: target === 'alternate' } });
  }
  function setCallEnabled(on: boolean) {
    if (on) setNotifNone(false);
    onFormDataChange({ ...formData, notificationPrefs: { ...(formData.notificationPrefs ?? emptyNotif), primaryVoice: on, alternateVoice: false } });
  }
  function setCallTarget(target: 'primary' | 'alternate') {
    onFormDataChange({ ...formData, notificationPrefs: { ...(formData.notificationPrefs ?? emptyNotif), primaryVoice: target === 'primary', alternateVoice: target === 'alternate' } });
  }

  return (
    <div style={{ fontSize: T4, padding: '8px 24px' }}>

      <div style={{ fontSize: H1, fontWeight: 700, color: '#1a3a5c', marginTop: '10px', marginBottom: '12px' }}>
        Resident's Details
      </div>

      {/* ═══ TOP SECTION: search + name ═══ */}
      <div style={{ marginBottom: '6px' }}>

          <div style={{ fontSize: H2, fontWeight: 600, color: '#333', marginBottom: '6px' }}>Find Submitter</div>

          {/* Search field */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <div style={{ position: 'relative', display: 'inline-block', width: '460px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                placeholder="Search by name…"
                style={{ ...BASE_INPUT, fontSize: H2, padding: '8px 32px 8px 10px', backgroundColor: '#fff', color: '#222', width: '460px' }}
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <img src={`${BASE}icons/search.png`} alt="Search" style={{ height: '14px', opacity: 0.6 }} />
              </button>
            </div>

            {/* Pencil — dimmed until a submitter is loaded */}
            <ImgBtn src={`${BASE}icons/pencil.gif`} alt="Edit" onClick={handlePencilClick} dimmed={noSubmitter} />
            {/* X — dimmed until a submitter is loaded; triggers confirm dialog */}
            <ImgBtn src={`${BASE}icons/cancel.gif`} alt="Clear" onClick={handleClearClick} dimmed={noSubmitter} />

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, backgroundColor: '#fff', border: BORDER, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', width: '560px', marginTop: '1px' }}>
                {searchResults.map(s => {
                  const details = [s.address, s.email, s.phone].filter(Boolean).join(' · ');
                  return (
                    <div key={s.id} onClick={() => selectSubmitter(s)}
                      style={{ padding: '6px 10px', fontSize: T3, cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', gap: '16px', alignItems: 'baseline' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#cce8f8')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                      <span style={{ fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, minWidth: '140px' }}>{s.lastName}, {s.firstName}{s.mi ? ` ${s.mi}.` : ''}</span>
                      <span style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{details}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* "Add new submitter" link — shown only when no submitter selected and not in manual-entry mode */}
          {!submitter && !showManualEntry && (
            <button
              onClick={() => setShowManualEntry(true)}
              style={{ display: 'inline-block', marginTop: '8px', background: 'none', border: 'none', padding: 0, fontSize: T3, color: '#1a6fb5', cursor: 'pointer', textDecoration: 'underline' }}
            >
              + Add new submitter
            </button>
          )}

          {/* Name row — shown when submitter selected OR adding new */}
          {(!!submitter || showManualEntry) && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={LABEL}>First Name <Req /></label>
                <input type="text" disabled={isLocked} value={formData.firstName ?? ''} onChange={e => f('firstName', e.target.value)} placeholder="First Name" style={inp()} />
              </div>
              <div style={{ width: '40px' }}>
                <label style={LABEL}>MI</label>
                <input type="text" disabled={isLocked} value={formData.mi ?? ''} onChange={e => f('mi', e.target.value)} placeholder="MI" maxLength={1} style={inp()} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={LABEL}>Last Name <Req /></label>
                <input type="text" disabled={isLocked} value={formData.lastName ?? ''} onChange={e => f('lastName', e.target.value)} placeholder="Last Name" style={inp()} />
              </div>
            </div>
          )}
      </div>

      {/* ═══ DETAIL FIELDS — shown when submitter selected OR adding new ═══ */}
      {(!!submitter || showManualEntry) && (<>

        {/* Address | Email */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={LABEL}>Address <Req /></label>
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
            <label style={LABEL}>Alt Phone</label>
            <input type="tel" disabled={isLocked} value={formData.altPhone ?? ''} onChange={e => f('altPhone', e.target.value)} placeholder="Alt Phone" style={inp()} />
          </div>
          <div style={{ width: '48px' }}>
            <label style={LABEL}>Ext</label>
            <input type="text" disabled={isLocked} value={formData.altPhoneExt ?? ''} onChange={e => f('altPhoneExt', e.target.value)} placeholder="Ext" style={inp()} />
          </div>
        </div>
      </>)}

      {/* ═══ NOTIFICATION PREFERENCES ═══ */}
      <div style={{ marginTop: '16px', borderTop: '1px solid #c8d0d8', paddingTop: '12px' }}>
        <div style={{ fontSize: H1, fontWeight: 700, color: '#333', marginBottom: '12px' }}>
          Notification Preferences <Req />
        </div>

        {/* None — explicit selection; clears all other options when checked */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notifNone}
            onChange={e => {
              setNotifNone(e.target.checked);
              if (e.target.checked) {
                onFormDataChange({ ...formData, notificationPrefs: { ...emptyNotif } });
              }
            }}
            style={CB}
          />
          <span style={{ fontSize: T3, color: '#888', fontStyle: 'italic' }}>None</span>
        </label>

        {/* Email */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={notif.primaryEmail} onChange={e => { if (e.target.checked) setNotifNone(false); np('primaryEmail', e.target.checked); }} style={CB} />
          <span style={{ fontSize: T3, color: '#222' }}>Email</span>
          {formData.email && <span style={{ fontSize: T4, color: '#888' }}>{formData.email}</span>}
        </label>

        {/* Text message */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={textEnabled} onChange={e => setTextEnabled(e.target.checked)} style={CB} />
            <span style={{ fontSize: T3, color: '#222' }}>Text message</span>
          </label>
          {textEnabled && (
            <div style={{ marginLeft: '26px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(['primary', 'alternate'] as const).map(which => {
                const num = which === 'primary' ? formData.phone : formData.altPhone;
                return (
                  <label key={which} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (!num && which === 'alternate') ? 0.45 : 1, cursor: (!num && which === 'alternate') ? 'default' : 'pointer' }}>
                    <input type="radio" disabled={!num && which === 'alternate'} checked={textTarget === which} onChange={() => setTextTarget(which)} style={{ accentColor: '#16a34a', cursor: 'pointer' }} />
                    <span style={{ fontSize: T4, color: '#444', textTransform: 'capitalize' }}>{which}</span>
                    <span style={{ fontSize: T4, color: num ? '#888' : '#bbb', fontStyle: num ? 'normal' : 'italic' }}>{num || 'no number on file'}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Phone call */}
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={callEnabled} onChange={e => setCallEnabled(e.target.checked)} style={CB} />
            <span style={{ fontSize: T3, color: '#222' }}>Phone call</span>
          </label>
          {callEnabled && (
            <div style={{ marginLeft: '26px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(['primary', 'alternate'] as const).map(which => {
                const num = which === 'primary' ? formData.phone : formData.altPhone;
                return (
                  <label key={which} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (!num && which === 'alternate') ? 0.45 : 1, cursor: (!num && which === 'alternate') ? 'default' : 'pointer' }}>
                    <input type="radio" disabled={!num && which === 'alternate'} checked={callTarget === which} onChange={() => setCallTarget(which)} style={{ accentColor: '#16a34a', cursor: 'pointer' }} />
                    <span style={{ fontSize: T4, color: '#444', textTransform: 'capitalize' }}>{which}</span>
                    <span style={{ fontSize: T4, color: num ? '#888' : '#bbb', fontStyle: num ? 'normal' : 'italic' }}>{num || 'no number on file'}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function Req() {
  return <span style={{ color: '#c00', marginLeft: '2px', fontWeight: 700 }}>*</span>;
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
