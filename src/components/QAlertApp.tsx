import { useState, useEffect, useRef } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import type { Submitter, RelatedRequest, FormTab } from '../types/qalert';
import { mockTicketsBySubmitter, mockSubmitters } from '../data/mockData';
import { WhoTab } from './WhoTab';
import { WhatTab } from './WhatTab';
import { WhereTab } from './WhereTab';
import { FilesTab } from './FilesTab';
import { RequestSearchTab } from './RequestSearchTab';

interface QAlertAppProps {
  trainingTarget?: string;
  freePanel?: React.ReactNode;
  onBeforeSave?: (data: unknown) => boolean;
}

const EMPTY_FORM: Partial<Submitter> = {
  firstName: '', lastName: '', mi: '', address: '',
  city: 'Port St. Lucie', state: 'FL', zip: '',
  email: '', phone: '', unit: '', phoneExt: '', altPhone: '', altPhoneExt: '',
  notificationPrefs: {
    primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false,
    alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false,
  },
};

type MainTab = 'details' | 'search';
type RelatedView = 'list' | 'map';

const BASE = import.meta.env.BASE_URL;

const NAV_BG    = '#1a3a5c';
const NAV_DARK  = '#0d2137';
const TOOLBAR_BG = '#eaecef';   // lighter grey
const SEP_COLOR  = '#b0bbc6';
const GREY_LINE  = '1px solid #c8d0d8';

// Font tiers
const T1 = '15px'; // nav + toolbar labels
const T2 = '14px'; // section headings (Notif Prefs, Related Info, Submitter Stats)
const T4 = '11px'; // standard body text (table rows, pagination, filters)

function formatDateTime(d: Date): string {
  const m = d.getMonth() + 1, day = d.getDate(), y = d.getFullYear();
  let h = d.getHours();
  const min = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'P' : 'A';
  h = h % 12 || 12;
  return `${m}/${day}/${y} ${h}:${min}${ampm}`;
}

let _nextId = 114729;

export function QAlertApp({ trainingTarget, freePanel }: QAlertAppProps) {
  const [mainTab, setMainTab]               = useState<MainTab>('details');
  const [formTab, setFormTab]               = useState<FormTab>('who');
  const [submitter, setSubmitter]           = useState<Submitter | null>(null);
  const [formData, setFormData]             = useState<Partial<Submitter>>(EMPTY_FORM);
  const [relatedView, setRelatedView]       = useState<RelatedView>('list');
  const [filterByType, setFilterByType]     = useState(true);
  const [filterBySub, setFilterBySub]       = useState(true);
  const [isNarrow, setIsNarrow]             = useState(window.innerWidth <= 1350);
  const [relatedRequests, setRelatedRequests] = useState<RelatedRequest[]>([]);
  const [statusFilter, setStatusFilter]     = useState<string[]>(['Open','In Progress','Closed','On Hold']);
  const [statusOpen, setStatusOpen]         = useState(false);
  const statusRef                           = useRef<HTMLDivElement>(null);
  const [selectedType, setSelectedType]     = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  // Keep a snapshot of the submitter for Save+Add (same person, new ticket)
  const [savedSubmitter, setSavedSubmitter] = useState<Submitter | null>(null);
  const [savedFormData, setSavedFormData]   = useState<Partial<Submitter>>(EMPTY_FORM);
  const [activeTicket, setActiveTicket]     = useState<RelatedRequest | null>(null);

  useEffect(() => {
    const handler = () => setIsNarrow(window.innerWidth <= 1350);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function buildRequest(): RelatedRequest {
    const now = formatDateTime(new Date());
    const name = formData.firstName || formData.lastName
      ? `${formData.firstName ?? ''} ${formData.lastName ?? ''}`.trim()
      : submitter ? `${submitter.firstName} ${submitter.lastName}` : 'Unknown';
    return {
      id: String(_nextId++),
      priority: 2,
      address: selectedAddress || 'N/A',
      lastAction: now,
      requestType: selectedType || 'N/A',
      submitter: name,
      createdOn: now,
      routedTo: '',
      status: 'Closed',
    };
  }

  function handleSave() {
    const req = buildRequest();
    setRelatedRequests([req]);
    setFormData(EMPTY_FORM);
    setSubmitter(null);
    setSelectedType('');
    setSelectedAddress('');
    setFormTab('who');
  }

  function handleSaveClose() {
    buildRequest(); // consume the id
    setRelatedRequests([]);
    setFormData(EMPTY_FORM);
    setSubmitter(null);
    setSelectedType('');
    setSelectedAddress('');
    setFormTab('who');
  }

  function handleSaveAdd() {
    const req = buildRequest();
    // Snapshot current submitter before resetting
    setSavedSubmitter(submitter);
    setSavedFormData({ ...formData });
    setRelatedRequests([req]);
    setSelectedType('');
    // Keep address (same person), reset to What tab
    setFormTab('what');
  }

  function openTicket(ticket: RelatedRequest) {
    setActiveTicket(ticket);
    setMainTab('details');
    setFormTab('who');
    // Load the submitter if we have them in the mock db
    if (ticket.submitterId) {
      const found = mockSubmitters.find(s => s.id === ticket.submitterId) ?? null;
      setSubmitter(found);
      setFormData(found ?? EMPTY_FORM);
      if (found) setRelatedRequests(mockTicketsBySubmitter[found.id] ?? []);
    }
    setSelectedType(ticket.requestType);
    setSelectedAddress(ticket.address);
  }

  // Apply saved submitter for Save+Add (runs after savedSubmitter/savedFormData update)
  useEffect(() => {
    if (savedSubmitter !== null) {
      setSubmitter(savedSubmitter);
      setFormData(savedFormData);
      setSavedSubmitter(null); // reset sentinel
    }
  }, [savedSubmitter]);

  const formTabs: { key: FormTab; label: string; disabled?: boolean; warning?: boolean }[] = [
    { key: 'who',     label: 'Who' },
    { key: 'what',    label: 'What (0)', warning: true },
    { key: 'where',   label: 'Where' },
    { key: 'more',    label: 'More' },
    { key: 'history', label: 'Manage & History (0)', disabled: true },
  ];

  return (
    <div style={{
      fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
      fontSize: T4,
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
    }}>

      {/* ── Top Nav ── */}
      <div style={{ backgroundColor: NAV_BG, height: '32px', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div style={{ backgroundColor: NAV_DARK, padding: '0 12px', display: 'flex', alignItems: 'center', color: '#fff', fontSize: T1, fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            CATALIS&nbsp;<sup style={{ fontSize: '8px', verticalAlign: 'super' }}>®</sup>
          </div>
          {['Call Center', 'Service Requests', 'Maps', 'Reporting', 'QAlert Administration'].map((tab) => {
            const active = tab === 'Call Center';
            return (
              <button key={tab} style={{ padding: '0 14px', fontSize: T1, fontWeight: active ? 700 : 400, color: active ? NAV_BG : '#fff', backgroundColor: active ? '#fff' : 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', height: '100%' }}>
                {tab}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px' }}>
          <span style={{ color: '#b0c4d8', fontSize: T4, marginRight: '6px' }}>jordanlee</span>
          <img src={`${BASE}icons/pushpin.png`}         alt="pin"     style={{ height: '15px', opacity: 0.8 }} />
          <img src={`${BASE}icons/help.png`}            alt="help"    style={{ height: '15px', opacity: 0.8 }} />
          <img src={`${BASE}icons/contact-support.png`} alt="support" style={{ height: '15px', opacity: 0.8 }} />
          <img src={`${BASE}icons/academy.png`}         alt="academy" style={{ height: '15px', opacity: 0.8 }} />
        </div>
      </div>

      {/* ── Toolbar — lighter bg, taller, T3 text, charcoal color ── */}
      <div style={{ backgroundColor: TOOLBAR_BG, height: '36px', display: 'flex', alignItems: 'center', flexShrink: 0, borderBottom: GREY_LINE }}>
        <button
          onClick={() => { setFormData(EMPTY_FORM); setSubmitter(null); setFormTab('who'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: '#333', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <img src={`${BASE}icons/add-new-request.gif`} alt="+" style={{ height: '20px' }} /> New Request
        </button>
        <TBtn img="save.png"        label="Save"          onClick={handleSave}      disabled={!selectedType} />
        <TBtn img="save-close.png"  label="Save + Close"  onClick={handleSaveClose}  disabled={!selectedType} />
        <TBtn img="save-add.png"    label="Save + Add"    onClick={handleSaveAdd}    disabled={!selectedType} />
        <TBtn img="link.gif"        label="Link Selected" disabled />
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', height: '100%' }}>
          <TBtn img="help.png"            label="Help" />
          <TBtn img="contact-support.png" label="Contact Support" />
          <TBtn img="academy.png"         label="Academy" />
        </div>
      </div>

      {/* ── Main tab bar — navy bottom border, thin, indented to match left padding ── */}
      <div style={{ backgroundColor: '#fff', display: 'flex', flexShrink: 0, borderBottom: `1px solid ${NAV_BG}`, paddingLeft: '24px' }}>
        {(['details', 'search'] as MainTab[]).map((t) => {
          const active = mainTab === t;
          return (
            <button key={t} onClick={() => setMainTab(t)} style={{
              padding: '0 14px', height: '28px',
              fontSize: T4, fontWeight: 700,
              backgroundColor: active ? NAV_BG : '#fff',
              color: active ? '#fff' : '#555',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {t === 'details' ? 'Service Request Details' : 'Request Search'}
            </button>
          );
        })}
      </div>

      {/* ── Body ── */}
      <div style={{
        display: 'flex',
        flexDirection: isNarrow ? 'column' : 'row',
        flex: 1,
        overflow: mainTab === 'search' ? 'hidden' : 'auto',
        alignItems: isNarrow ? 'flex-start' : 'stretch',
      }}>

        {/* ── Request Search tab — full width ── */}
        {mainTab === 'search' && (
          <RequestSearchTab onOpenTicket={openTicket} />
        )}

        {/* ── Left: form area (only in details tab) ── */}
        {mainTab === 'details' && <div style={{
          display: 'flex', flexDirection: 'column',
          flex: isNarrow ? 'none' : 1,
          width: isNarrow ? '680px' : undefined,
          flexShrink: 0,
          overflow: isNarrow ? 'visible' : 'hidden',
          backgroundColor: '#fff',
          borderRight: isNarrow ? 'none' : GREY_LINE,
        }}>

          {/* Sub-header box — dynamic when a ticket is open */}
          <div style={{ padding: '6px 24px', flexShrink: 0 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              width: '100%', boxSizing: 'border-box',
              border: GREY_LINE, borderRadius: '3px',
              padding: '5px 10px', fontSize: T4, color: '#444',
              backgroundColor: '#fff', rowGap: '3px',
            }}>
              <span><b>ID:</b> {activeTicket ? activeTicket.id : 'N/A'}</span>
              <span><b>Created:</b> {activeTicket ? activeTicket.createdOn : 'N/A'}</span>
              <span><b>Status:</b>{' '}
                <span style={{ color: activeTicket?.status === 'Open' ? '#2e8b57' : activeTicket?.status === 'In Progress' ? '#2563eb' : '#666', fontWeight: 600 }}>
                  {activeTicket ? activeTicket.status : 'Open'}
                </span>
              </span>
              <span>
                <b>Priority:</b>{' '}
                <span style={{ display: 'inline-block', padding: '0 5px', border: GREY_LINE, borderRadius: '2px', backgroundColor: '#e2eaf3', color: NAV_BG, fontWeight: 600 }}>
                  {activeTicket ? activeTicket.priority : '2'}
                </span>
              </span>
              <span><b>Origin:</b> {activeTicket?.origin ?? 'Call Center'}</span>
              <span><b>Dept:</b> {activeTicket?.dept ?? 'N/A'}</span>
            </div>
          </div>

          {/* ── Step progress bar ── */}
          <div style={{ padding: '10px 24px 0', flexShrink: 0, backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              {(() => {
                const currentIdx = formTabs.findIndex(f => f.key === formTab);
                return formTabs.map((t, i) => {
                  const isLast      = i === formTabs.length - 1;
                  const isActive    = i === currentIdx;
                  const isCompleted = i < currentIdx;
                  const isDisabled  = !!t.disabled;
                  const cleanLabel  = t.label.replace(/ \(\d+\)/g, '').replace('Manage & ', '');

                  const circleBg    = (isActive || isCompleted) ? NAV_BG : '#fff';
                  const circleBorder= isActive ? NAV_BG : isCompleted ? NAV_BG : isDisabled ? '#dde0e4' : '#c8d0d8';
                  const numColor    = (isActive || isCompleted) ? '#fff' : isDisabled ? '#ccc' : '#aaa';
                  const labelColor  = isActive ? NAV_BG : isCompleted ? '#555' : isDisabled ? '#ccc' : '#aaa';
                  const lineColor   = isCompleted ? NAV_BG : '#e0e3e7';

                  return (
                    <div key={t.key} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? 0 : 1 }}>
                      {/* Circle + label */}
                      <div
                        onClick={() => !isDisabled && setFormTab(t.key)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: isDisabled ? 'default' : 'pointer', minWidth: '52px' }}
                      >
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          backgroundColor: circleBg,
                          border: `2px solid ${circleBorder}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 700, color: numColor,
                          boxSizing: 'border-box', position: 'relative', zIndex: 1,
                          outline: trainingTarget === t.key ? '2px solid #f59e0b' : undefined,
                          outlineOffset: '2px',
                        }}>
                          {isCompleted ? '✓' : String(i + 1)}
                          {t.warning && !isCompleted && (
                            <div style={{
                              position: 'absolute', top: '-2px', right: '-2px',
                              width: '8px', height: '8px', borderRadius: '50%',
                              backgroundColor: '#f59e0b', border: '1.5px solid #fff',
                            }} />
                          )}
                        </div>
                        <div style={{
                          fontSize: '10px', marginTop: '4px', fontWeight: isActive ? 700 : 400,
                          color: labelColor, whiteSpace: 'nowrap', textAlign: 'center',
                        }}>
                          {cleanLabel}
                        </div>
                      </div>

                      {/* Connector line to next step */}
                      {!isLast && (
                        <div style={{ flex: 1, height: '2px', marginTop: '11px', backgroundColor: lineColor }} />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div style={{ height: '8px', backgroundColor: '#fff', flexShrink: 0 }} />

          {/* Tab content — borderTop is the thin section-divider line below the white gap */}
          <div style={{ flex: 1, overflow: isNarrow ? 'visible' : 'auto', borderTop: GREY_LINE }}>
            {formTab === 'who' && (
              <WhoTab
                submitter={submitter}
                onSubmitterChange={s => {
                  setSubmitter(s);
                  if (s) setRelatedRequests(mockTicketsBySubmitter[s.id] ?? []);
                  else setRelatedRequests([]);
                }}
                formData={formData}
                onFormDataChange={setFormData}
              />
            )}
            {formTab === 'what' && <WhatTab onTypeChange={setSelectedType} />}
            {formTab === 'where' && <WhereTab onAddressChange={setSelectedAddress} />}
            {formTab === 'more' && <FilesTab />}
            {formTab !== 'who' && formTab !== 'what' && formTab !== 'where' && formTab !== 'more' && (
              <div style={{ padding: '14px', color: '#aaa', fontSize: T4 }}>
                {formTabs.find(t => t.key === formTab)?.label} — coming soon
              </div>
            )}
          </div>
        </div>}

        {/* ── Right: Related Information (details tab only) ── */}
        {mainTab === 'details' && <div style={{
          width: isNarrow ? '680px' : '50%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          overflow: 'hidden',   // outer clips vertically; table div handles both axes
          marginTop: isNarrow ? '24px' : 0,
        }}>

          {/* Header: title + tabs+filters, then thick grey bottom border + white gap */}
          <div style={{ flexShrink: 0, padding: '8px 10px 0 10px' }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: T2, color: '#222' }}>Related Information</span>
              <RefreshCwIcon size={13} style={{ color: '#2563eb', cursor: 'pointer' }} />
            </div>
            {/* Tabs + filters row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '3px solid #c8d0d8', paddingBottom: '0' }}>
              <button onClick={() => setRelatedView('list')} style={{ fontSize: T4, fontWeight: relatedView === 'list' ? 700 : 400, color: relatedView === 'list' ? NAV_BG : '#888', background: 'none', border: 'none', borderBottom: relatedView === 'list' ? `3px solid ${NAV_BG}` : '3px solid transparent', marginBottom: '-3px', paddingBottom: '5px', paddingRight: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Related Request List
              </button>
              <span style={{ color: '#ccc', fontSize: T4, paddingBottom: '5px', paddingRight: '6px', marginBottom: '-3px' }}>|</span>
              <button onClick={() => setRelatedView('map')} style={{ fontSize: T4, fontWeight: relatedView === 'map' ? 700 : 400, color: relatedView === 'map' ? NAV_BG : '#888', background: 'none', border: 'none', borderBottom: relatedView === 'map' ? `3px solid ${NAV_BG}` : '3px solid transparent', marginBottom: '-3px', paddingBottom: '5px', paddingRight: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Map View
              </button>
              {/* Filters right-aligned */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: T4, color: '#444', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={filterByType} onChange={e => setFilterByType(e.target.checked)} style={{ accentColor: '#16a34a', width: '11px', height: '11px' }} />
                  Selected Request Type Only
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: T4, color: '#444', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={filterBySub} onChange={e => setFilterBySub(e.target.checked)} style={{ accentColor: '#16a34a', width: '11px', height: '11px' }} />
                  Selected Submitter Only
                </label>
                {/* Status dropdown filter */}
                <div ref={statusRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setStatusOpen(o => !o)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: T4, fontWeight: 400, color: statusOpen ? NAV_BG : '#888', padding: '0 2px', whiteSpace: 'nowrap' }}
                  >
                    Status
                  </button>
                  {statusOpen && (
                    <div style={{
                      position: 'absolute', top: '110%', right: 0, zIndex: 200,
                      backgroundColor: '#fff', border: GREY_LINE,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '3px', minWidth: '130px', padding: '6px 0',
                    }}>
                      {['Open','In Progress','Closed','On Hold'].map(s => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', fontSize: T4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(s)}
                            onChange={e => setStatusFilter(prev =>
                              e.target.checked ? [...prev, s] : prev.filter(x => x !== s)
                            )}
                            style={{ accentColor: '#16a34a', width: '12px', height: '12px', cursor: 'pointer' }}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* White spacing gap after the border */}
            <div style={{ height: '8px' }} />
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table style={{ width: 'max-content', minWidth: '100%', borderCollapse: 'collapse', fontSize: T4 }}>
              <thead>
                <tr style={{ backgroundColor: NAV_BG, position: isNarrow ? 'relative' : 'sticky', top: 0 }}>
                  {['ID','Priority','Address','Last Action','Request Type','Submitter','Created On','Routed To'].map(h => (
                    <th key={h} style={{ color: '#fff', fontWeight: 600, fontSize: T4, padding: '5px 8px', textAlign: 'left', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.15)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {relatedRequests.filter(r => statusFilter.includes(r.status)).map((r, i) => (
                  <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7f9fb', borderBottom: GREY_LINE, color: r.status === 'Open' ? '#cc2200' : '#444', cursor: 'pointer' }}>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap', fontWeight: 500 }}>{r.id}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' }}>{r.priority}</td>
                    <td style={{ padding: '4px 8px' }}>{r.address}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.lastAction}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.requestType}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.submitter}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.createdOn}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{r.routedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderTop: GREY_LINE, fontSize: T4, color: '#666', flexShrink: 0 }}>
            <div>
              {['|<','<','1','>','>|'].map(s => (
                <button key={s} style={{ padding: '1px 4px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: T4 }}>{s}</button>
              ))}
            </div>
            <span>Page 1 of 1</span>
          </div>
        </div>}
      </div>

      {freePanel && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>{freePanel}</div>}
    </div>
  );
}


function TBtn({ img, label, disabled = false, onClick, borderRight }: {
  img: string; label: string; disabled?: boolean; onClick?: () => void; borderRight?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: disabled ? '#aab' : '#444', background: 'none', border: 'none', borderRight: borderRight ? `1px solid ${SEP_COLOR}` : undefined, cursor: disabled ? 'default' : 'pointer', whiteSpace: 'nowrap', opacity: disabled ? 0.55 : 1 }}>
      <img src={`${BASE}icons/${img}`} alt="" style={{ height: '20px' }} /> {label}
    </button>
  );
}
