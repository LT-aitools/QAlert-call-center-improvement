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

// Font hierarchy
const H1 = '17px'; // major section headings
const H2 = '15px'; // sub-headings, toolbar labels, tab labels
const H3 = '13px'; // nav bar text, table column headers
const H4 = '12px'; // standard body text
// Aliases kept for backward compat with existing usages
const T1 = H3;  // nav bar items → h3
const T2 = H2;  // toolbar labels → h2
const T4 = H4;  // body text → h4

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
  const [relatedCollapsed, setRelatedCollapsed] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [draftToast, setDraftToast]             = useState(false);

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

  // Auto-expand right panel when related requests arrive; collapse when cleared
  useEffect(() => {
    setRelatedCollapsed(relatedRequests.length === 0);
  }, [relatedRequests.length]);

  function resetForm() {
    setFormData(EMPTY_FORM);
    setSubmitter(null);
    setFormTab('who');
    setSelectedType('');
    setSelectedAddress('');
    setActiveTicket(null);
  }

  function handleSaveDraft() {
    setDraftToast(true);
    setTimeout(() => setDraftToast(false), 2500);
  }

  const isInProgress = submitter !== null || selectedType !== '' || formTab !== 'who';
  const isNewTicket = !activeTicket;
  const formTabs: { key: FormTab; label: string; disabled?: boolean; warning?: boolean }[] = [
    { key: 'who',   label: 'Who' },
    { key: 'what',  label: 'What (0)', warning: true },
    { key: 'where', label: 'Where' },
    { key: 'more',  label: 'Upload Files' },
    ...(!isNewTicket ? [{ key: 'history' as FormTab, label: 'Manage & History (0)', disabled: true }] : []),
  ];
  const currentStepIdx = formTabs.findIndex(f => f.key === formTab);
  const nextStep = formTabs[currentStepIdx + 1];

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
        {isInProgress ? (
          <>
            <button
              onClick={() => setCancelDialogOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: '#b91c1c', background: 'none', border: 'none', borderRight: `1px solid ${SEP_COLOR}`, cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
            >
              ✕ Cancel
            </button>
            <button
              onClick={handleSaveDraft}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: '#444', background: 'none', border: 'none', borderRight: `1px solid ${SEP_COLOR}`, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              💾 Save Draft
            </button>
            {draftToast && (
              <span style={{ fontSize: T4, color: '#16a34a', fontWeight: 600, paddingLeft: '8px', whiteSpace: 'nowrap' }}>
                ✓ Draft saved
              </span>
            )}
          </>
        ) : (
          <button
            onClick={resetForm}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: '#333', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            <img src={`${BASE}icons/add-new-request.gif`} alt="+" style={{ height: '20px' }} /> New Request
          </button>
        )}
        {!isNewTicket && <>
          <TBtn img="save.png"        label="Save"          onClick={handleSave}      disabled={!selectedType} />
          <TBtn img="save-close.png"  label="Save + Close"  onClick={handleSaveClose}  disabled={!selectedType} />
          <TBtn img="save-add.png"    label="Save + Add"    onClick={handleSaveAdd}    disabled={!selectedType} />
          <TBtn img="link.gif"        label="Link Selected" disabled />
        </>}
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
              fontSize: H2, fontWeight: 700,
              backgroundColor: active ? NAV_BG : '#fff',
              color: active ? '#fff' : '#555',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {t === 'details' ? 'ℹ Details' : '🔎 Search Existing Request'}
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
          flex: isNarrow ? 'none' : 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isNarrow ? 'flex-start' : 'center',
          width: isNarrow ? '680px' : undefined,
          overflow: isNarrow ? 'visible' : 'hidden',
          backgroundColor: '#fff',
          borderRight: isNarrow ? 'none' : GREY_LINE,
        }}>
          {/* Inner content — capped width, centred */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%',
            maxWidth: isNarrow ? undefined : '760px',
            flex: 1,
            overflow: isNarrow ? 'visible' : 'hidden',
          }}>

          {/* Sub-header box — only shown for existing tickets */}
          {!isNewTicket && <div style={{ padding: '6px 24px', flexShrink: 0 }}>
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
          </div>}

          {/* ── Step progress bar ── */}
          <div style={{ padding: '12px 24px 0', flexShrink: 0, backgroundColor: '#fff' }}>
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
                          width: '32px', height: '32px', borderRadius: '50%',
                          backgroundColor: circleBg,
                          border: `2px solid ${circleBorder}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: H3, fontWeight: 700, color: numColor,
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
                          fontSize: H2, marginTop: '5px', fontWeight: isActive ? 700 : 400,
                          color: labelColor, whiteSpace: 'nowrap', textAlign: 'center',
                        }}>
                          {cleanLabel}
                        </div>
                      </div>

                      {/* Connector line to next step */}
                      {!isLast && (
                        <div style={{ flex: 1, height: '2px', marginTop: '14px', backgroundColor: lineColor }} />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div style={{ height: '18px', backgroundColor: '#fff', flexShrink: 0 }} />

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
            {formTab === 'where' && <WhereTab onAddressChange={setSelectedAddress} residentFormData={formData} />}
            {formTab === 'more' && <FilesTab />}
            {formTab !== 'who' && formTab !== 'what' && formTab !== 'where' && formTab !== 'more' && (
              <div style={{ padding: '14px', color: '#aaa', fontSize: T4 }}>
                {formTabs.find(t => t.key === formTab)?.label} — coming soon
              </div>
            )}
          </div>

          {/* ── Next button footer ── */}
          <div style={{ flexShrink: 0, borderTop: GREY_LINE, padding: '8px 24px', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fff', minHeight: '42px' }}>
            {nextStep && !nextStep.disabled && (
              <button
                onClick={() => setFormTab(nextStep.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 18px', backgroundColor: NAV_BG, color: '#fff',
                  border: 'none', borderRadius: '3px',
                  fontSize: T2, cursor: 'pointer',
                }}
              >
                <span style={{ fontWeight: 400 }}>Next:</span>
                <span style={{ fontWeight: 700 }}>{nextStep.label.replace(/ \(\d+\)/g, '')}</span>
                →
              </button>
            )}
          </div>
          </div>{/* end inner centred content */}
        </div>}

        {/* ── Right: Related Information (details tab only) ── */}
        {mainTab === 'details' && <div style={{
          width: relatedCollapsed ? '32px' : (isNarrow ? '680px' : '50%'),
          minWidth: relatedCollapsed ? '32px' : undefined,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          overflow: 'hidden',
          marginTop: isNarrow ? '24px' : 0,
          borderLeft: GREY_LINE,
          transition: 'width 0.2s ease',
        }}>

          {/* ── Collapsed strip ── */}
          {relatedCollapsed && (
            <div
              onClick={() => setRelatedCollapsed(false)}
              title="Show Related Information"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'flex-start', paddingTop: '18px',
                height: '100%', cursor: 'pointer', gap: '8px',
                backgroundColor: '#f7f9fb', userSelect: 'none',
              }}
            >
              <span style={{ fontSize: '13px', color: '#2563eb', lineHeight: 1 }}>›</span>
              <span style={{
                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                fontSize: '10px', color: '#888', letterSpacing: '0.05em',
                fontWeight: 600, whiteSpace: 'nowrap',
              }}>
                Related Info
              </span>
            </div>
          )}

          {/* ── Expanded panel ── */}
          {!relatedCollapsed && <>

          {/* Header: title + tabs+filters, then thick grey bottom border + white gap */}
          <div style={{ flexShrink: 0, padding: '8px 10px 0 10px' }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: H1, color: '#222' }}>Related Information</span>
              <RefreshCwIcon size={13} style={{ color: '#2563eb', cursor: 'pointer' }} />
              <button
                onClick={() => setRelatedCollapsed(true)}
                title="Collapse panel"
                style={{
                  marginLeft: 'auto', cursor: 'pointer',
                  background: '#f0f2f4', border: '1px solid #c8d0d8', borderRadius: '4px',
                  color: '#555', fontSize: '11px', lineHeight: 1,
                  padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '3px',
                }}
              >
                <span style={{ fontSize: '13px', lineHeight: 1 }}>‹</span> Collapse
              </button>
            </div>
            {/* Tabs + filters row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '3px solid #c8d0d8', paddingBottom: '0' }}>
              <button onClick={() => setRelatedView('list')} style={{ fontSize: H2, fontWeight: relatedView === 'list' ? 700 : 400, color: relatedView === 'list' ? NAV_BG : '#888', background: 'none', border: 'none', borderBottom: relatedView === 'list' ? `3px solid ${NAV_BG}` : '3px solid transparent', marginBottom: '-3px', paddingBottom: '5px', paddingRight: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Related Request List
              </button>
              <span style={{ color: '#ccc', fontSize: H2, paddingBottom: '5px', paddingRight: '6px', marginBottom: '-3px' }}>|</span>
              <button onClick={() => setRelatedView('map')} style={{ fontSize: H2, fontWeight: relatedView === 'map' ? 700 : 400, color: relatedView === 'map' ? NAV_BG : '#888', background: 'none', border: 'none', borderBottom: relatedView === 'map' ? `3px solid ${NAV_BG}` : '3px solid transparent', marginBottom: '-3px', paddingBottom: '5px', paddingRight: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Map View
              </button>
              {/* Filters right-aligned */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: H3, color: '#444', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={filterByType} onChange={e => setFilterByType(e.target.checked)} style={{ accentColor: '#16a34a', width: '12px', height: '12px' }} />
                  Selected Request Type Only
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: H3, color: '#444', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={filterBySub} onChange={e => setFilterBySub(e.target.checked)} style={{ accentColor: '#16a34a', width: '12px', height: '12px' }} />
                  Selected Submitter Only
                </label>
                {/* Status dropdown filter */}
                <div ref={statusRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setStatusOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: H3, fontWeight: 500,
                      color: statusOpen ? NAV_BG : '#444',
                      padding: '0 2px', whiteSpace: 'nowrap',
                    }}
                  >
                    {/* Funnel / filter icon */}
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M1 2h14l-5 6v5l-4-2V8L1 2z"/>
                    </svg>
                    Status
                    {statusFilter.length < 4 && (
                      <span style={{ fontSize: '10px', backgroundColor: NAV_BG, color: '#fff', borderRadius: '8px', padding: '0 5px', lineHeight: '14px' }}>
                        {statusFilter.length}
                      </span>
                    )}
                  </button>
                  {statusOpen && (
                    <div style={{
                      position: 'absolute', top: '110%', right: 0, zIndex: 200,
                      backgroundColor: '#fff', border: GREY_LINE,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '3px', minWidth: '140px', padding: '6px 0',
                    }}>
                      {['Open','In Progress','Closed','On Hold'].map(s => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', fontSize: H3, cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
                  {['ID','Status','Priority','Address','Last Action','Request Type','Submitter','Created On','Routed To'].map(h => (
                    <th key={h} style={{ color: '#fff', fontWeight: 600, fontSize: H3, padding: '5px 8px', textAlign: 'left', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.15)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {relatedRequests.filter(r => statusFilter.includes(r.status)).map((r, i) => (
                  <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7f9fb', borderBottom: GREY_LINE, color: '#444', cursor: 'pointer' }}>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap', fontWeight: 500 }}>{r.id}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 600,
                        backgroundColor:
                          r.status === 'Open'        ? '#fee2e2' :
                          r.status === 'In Progress' ? '#dbeafe' :
                          r.status === 'On Hold'     ? '#fef9c3' : '#f0f0f0',
                        color:
                          r.status === 'Open'        ? '#b91c1c' :
                          r.status === 'In Progress' ? '#1d4ed8' :
                          r.status === 'On Hold'     ? '#92400e' : '#555',
                      }}>
                        {r.status}
                      </span>
                    </td>
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

          </>}
        </div>}
      </div>

      {freePanel && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>{freePanel}</div>}

      {/* ── Cancel confirmation dialog ── */}
      {cancelDialogOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '6px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            width: '420px',
            padding: '28px 28px 20px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>Cancel this ticket?</div>
            <div style={{ fontSize: T2, color: '#444', lineHeight: 1.6 }}>
              This information will not be saved, and no request will be added.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => setCancelDialogOpen(false)}
                style={{ padding: '7px 20px', fontSize: T2, border: `1px solid ${SEP_COLOR}`, borderRadius: '3px', background: '#fff', color: '#444', cursor: 'pointer', fontWeight: 500 }}
              >
                Keep editing
              </button>
              <button
                onClick={() => { setCancelDialogOpen(false); resetForm(); }}
                style={{ padding: '7px 20px', fontSize: T2, border: 'none', borderRadius: '3px', background: '#b91c1c', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
