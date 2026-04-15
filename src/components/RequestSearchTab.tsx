import { useState, useRef, useEffect } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import type { RelatedRequest } from '../types/qalert';
import { mockSearchTickets } from '../data/mockData';

const BASE = import.meta.env.BASE_URL;

const NAV_BG   = '#1a3a5c';
const BORDER   = '1px solid #c8d0d8';
const T3       = '12px';
const T4       = '11px';

const INPUT: React.CSSProperties = {
  border: BORDER, borderRadius: '3px', fontSize: T3,
  padding: '5px 6px', outline: 'none', color: '#222',
  width: '100%', boxSizing: 'border-box', backgroundColor: '#fff',
};
const SELECT: React.CSSProperties = { ...INPUT, backgroundColor: '#fff' };
const LABEL: React.CSSProperties  = { fontSize: T3, color: '#333', display: 'block', marginBottom: '3px', fontWeight: 500 };

interface Props {
  onOpenTicket: (ticket: RelatedRequest) => void;
}

export function RequestSearchTab({ onOpenTicket }: Props) {
  const today   = new Date();
  const twoWeekAgo = new Date(today); twoWeekAgo.setDate(today.getDate() - 14);
  const fmt = (d: Date) => `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;

  const [submitter,   setSubmitter]   = useState('');
  const [requestId,   setRequestId]   = useState('');
  const [requestType, setRequestType] = useState('');
  const [keywords,    setKeywords]    = useState('');
  const [dateFrom,    setDateFrom]    = useState(fmt(twoWeekAgo));
  const [dateTo,      setDateTo]      = useState(fmt(today));
  const [city,        setCity]        = useState('');
  const [street,      setStreet]      = useState('');
  const [streetFrom,  setStreetFrom]  = useState('');
  const [streetTo,    setStreetTo]    = useState('');
  const [unit,        setUnit]        = useState('');
  const [geoArea,     setGeoArea]     = useState('');
  const [priority,    setPriority]    = useState(3);

  const [results,     setResults]     = useState<RelatedRequest[]>(mockSearchTickets);
  const [searched,    setSearched]    = useState(false);
  const [resultView,  setResultView]  = useState<'list'|'map'>('list');
  const [statusFilter, setStatusFilter] = useState<string[]>(['Open','In Progress','Closed','On Hold']);
  const [statusOpen,  setStatusOpen]  = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function handleSearch() {
    let filtered = mockSearchTickets;
    if (requestId.trim())   filtered = filtered.filter(t => t.id.includes(requestId.trim()));
    if (submitter.trim())   filtered = filtered.filter(t => t.submitter.toLowerCase().includes(submitter.toLowerCase()));
    if (requestType.trim()) filtered = filtered.filter(t => t.requestType.toLowerCase().includes(requestType.toLowerCase()));
    if (keywords.trim())    filtered = filtered.filter(t =>
      t.address.toLowerCase().includes(keywords.toLowerCase()) ||
      t.requestType.toLowerCase().includes(keywords.toLowerCase()) ||
      t.submitter.toLowerCase().includes(keywords.toLowerCase())
    );
    if (city.trim())        filtered = filtered.filter(t => t.address.toLowerCase().includes(city.toLowerCase()));
    if (street.trim())      filtered = filtered.filter(t => t.address.toLowerCase().includes(street.toLowerCase()));
    filtered = filtered.filter(t => t.priority <= priority);
    setResults(filtered);
    setSearched(true);
  }

  function handleReset() {
    setSubmitter(''); setRequestId(''); setRequestType(''); setKeywords('');
    setDateFrom(fmt(twoWeekAgo)); setDateTo(fmt(today));
    setCity(''); setStreet(''); setStreetFrom(''); setStreetTo(''); setUnit(''); setGeoArea('');
    setPriority(3);
    setResults(mockSearchTickets);
    setSearched(false);
  }

  const visibleResults = results.filter(r => statusFilter.includes(r.status));

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>

      {/* ── Left: Search form ── */}
      <div style={{ width: '55%', flexShrink: 0, overflowY: 'auto', padding: '12px 20px', borderRight: BORDER }}>

        {/* Search / Reset / Save row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <button onClick={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: T3, fontWeight: 600, color: '#333' }}>
            <img src={`${BASE}icons/search.png`} alt="" style={{ height: '14px', opacity: 0.7 }} />
            Search
          </button>
          <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: T3, fontWeight: 600, color: '#333' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2"/><polyline points="11 2 14 5 11 8" fill="none"/></svg>
            Reset
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: T3, fontWeight: 600, color: '#333' }}>
            <img src={`${BASE}icons/save.png`} alt="" style={{ height: '14px', opacity: 0.7 }} />
            Save
          </button>
        </div>

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>

          {/* Left column */}
          <div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Submitter</label>
              <input value={submitter} onChange={e => setSubmitter(e.target.value)} placeholder="Submitter" style={INPUT} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Request ID</label>
              <input value={requestId} onChange={e => setRequestId(e.target.value)} placeholder="Request ID" style={INPUT} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Request Type</label>
              <div style={{ position: 'relative' }}>
                <input value={requestType} onChange={e => setRequestType(e.target.value)} style={{ ...INPUT, paddingRight: '22px' }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                <span style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '10px', pointerEvents: 'none' }}>▼</span>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Keywords</label>
              <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Keywords" style={INPUT} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Date Range</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...INPUT, flex: 1 }} />
                <span style={{ color: '#888', fontSize: T4 }}>-</span>
                <input value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...INPUT, flex: 1 }} />
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Priority Range</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: T3, backgroundColor: '#e05040', color: '#fff', borderRadius: '3px', padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>1</span>
                <input
                  type="range" min={1} max={5} value={priority}
                  onChange={e => setPriority(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#4a7ab5' }}
                />
                <span style={{ fontSize: T3, border: BORDER, borderRadius: '3px', padding: '1px 5px', color: '#444', flexShrink: 0 }}>{priority}</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>City</label>
              <div style={{ position: 'relative' }}>
                <select value={city} onChange={e => setCity(e.target.value)} style={SELECT}>
                  <option value=""></option>
                  <option>Port St. Lucie</option>
                  <option>Fort Pierce</option>
                  <option>Stuart</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Street</label>
              <div style={{ position: 'relative' }}>
                <select value={street} onChange={e => setStreet(e.target.value)} style={SELECT}>
                  <option value=""></option>
                  {['SW Cameo Blvd','SW Cashmere Blvd','SW Burlington St','SW Aleon St','NW Marion Ave','SE Capahart Ave','SE Melanore Blvd','SW Glenwood Dr'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Street # Range</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input value={streetFrom} onChange={e => setStreetFrom(e.target.value)} style={{ ...INPUT, flex: 1 }} />
                <span style={{ color: '#888', fontSize: T4 }}>-</span>
                <input value={streetTo} onChange={e => setStreetTo(e.target.value)} style={{ ...INPUT, flex: 1 }} />
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Unit #</label>
              <input value={unit} onChange={e => setUnit(e.target.value)} style={{ ...INPUT, width: '50%' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={LABEL}>Geographic Areas</label>
              <div style={{ position: 'relative' }}>
                <select value={geoArea} onChange={e => setGeoArea(e.target.value)} style={SELECT}>
                  <option value=""></option>
                  {['District 1','District 2','District 3','District 4','District 5'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Search Results ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ flexShrink: 0, padding: '8px 10px 0 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#222' }}>Search Results</span>
            <RefreshCwIcon size={13} style={{ color: '#2563eb', cursor: 'pointer' }} onClick={handleReset} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '3px solid #c8d0d8' }}>
            <button onClick={() => setResultView('list')} style={{ fontSize: T4, fontWeight: resultView === 'list' ? 700 : 400, color: resultView === 'list' ? NAV_BG : '#888', background: 'none', border: 'none', borderBottom: resultView === 'list' ? `3px solid ${NAV_BG}` : '3px solid transparent', marginBottom: '-3px', paddingBottom: '5px', paddingRight: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              List View
            </button>
            <span style={{ color: '#ccc', fontSize: T4, paddingBottom: '5px', paddingRight: '6px', marginBottom: '-3px' }}>|</span>
            <button onClick={() => setResultView('map')} style={{ fontSize: T4, fontWeight: resultView === 'map' ? 700 : 400, color: resultView === 'map' ? NAV_BG : '#888', background: 'none', border: 'none', borderBottom: resultView === 'map' ? `3px solid ${NAV_BG}` : '3px solid transparent', marginBottom: '-3px', paddingBottom: '5px', paddingRight: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Map View
            </button>
            {/* Status filter */}
            <div ref={statusRef} style={{ marginLeft: 'auto', position: 'relative', paddingBottom: '5px' }}>
              <button onClick={() => setStatusOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: T4, fontWeight: 400, color: '#888', padding: '0 2px', whiteSpace: 'nowrap' }}>
                Status
              </button>
              {statusOpen && (
                <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 200, backgroundColor: '#fff', border: BORDER, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: '3px', minWidth: '130px', padding: '6px 0' }}>
                  {['Open','In Progress','Closed','On Hold'].map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', fontSize: T4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <input type="checkbox" checked={statusFilter.includes(s)} onChange={e => setStatusFilter(prev => e.target.checked ? [...prev, s] : prev.filter(x => x !== s))} style={{ accentColor: '#16a34a', width: '12px', height: '12px', cursor: 'pointer' }} />
                      {s}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ height: '8px' }} />
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: 'max-content', minWidth: '100%', borderCollapse: 'collapse', fontSize: T4 }}>
            <thead>
              <tr style={{ backgroundColor: NAV_BG, position: 'sticky', top: 0 }}>
                {['ID','Priority','Address','Last Action','Request Type','Submitter','Created On','Routed To'].map(h => (
                  <th key={h} style={{ color: '#fff', fontWeight: 600, fontSize: T4, padding: '5px 8px', textAlign: 'left', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.15)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleResults.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: T3 }}>
                  {searched ? 'No results found.' : 'Enter search criteria and click Search.'}
                </td></tr>
              ) : (
                visibleResults.map((r, i) => (
                  <tr
                    key={r.id}
                    onClick={() => onOpenTicket(r)}
                    style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7f9fb', borderBottom: '1px solid #c8d0d8', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e8f0f8')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#fff' : '#f7f9fb')}
                  >
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap', fontWeight: 600, color: ['Open','In Progress'].includes(r.status) ? '#16a34a' : '#1a5c9e' }}>
                      {r.id}
                    </td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', minWidth: '18px', padding: '1px 4px', textAlign: 'center',
                        borderRadius: '3px', fontWeight: 600, fontSize: T4,
                        backgroundColor: r.priority === 1 ? '#e05040' : '#e8eaed',
                        color: r.priority === 1 ? '#fff' : '#444',
                        border: r.priority !== 1 ? BORDER : 'none',
                      }}>
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.address}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.lastAction}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.requestType}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.submitter}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.createdOn}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.routedTo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderTop: BORDER, fontSize: T4, color: '#666', flexShrink: 0 }}>
          <div>
            {['|<','<','>','>|'].map(s => (
              <button key={s} style={{ padding: '1px 4px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: T4 }}>{s}</button>
            ))}
          </div>
          <span style={{ fontSize: T4, color: '#888' }}>* - Master Service Request</span>
          <span>Page 1 of {Math.max(1, Math.ceil(visibleResults.length / 25))}</span>
        </div>
      </div>
    </div>
  );
}
