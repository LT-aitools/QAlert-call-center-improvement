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
  const savedFormData                       = EMPTY_FORM;
  const [activeTicket, setActiveTicket]     = useState<RelatedRequest | null>(null);
  const [relatedCollapsed, setRelatedCollapsed] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [draftToast, setDraftToast]             = useState(false);
  const [formKey, setFormKey]                   = useState(0);
  const [rowWarnTicket, setRowWarnTicket]       = useState<RelatedRequest | null>(null);
  const [contextMenu, setContextMenu]           = useState<{ x: number; y: number; ticket: RelatedRequest } | null>(null);
  const [notifPrefMet, setNotifPrefMet]         = useState(false);
  const [collabOpen, setCollabOpen]             = useState(false);
  const collabRef                               = useRef<HTMLDivElement>(null);
  const [comments, setComments]                 = useState('');

  useEffect(() => {
    const handler = () => setIsNarrow(window.innerWidth <= 1350);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
      if (collabRef.current && !collabRef.current.contains(e.target as Node)) setCollabOpen(false);
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
    setFormKey(k => k + 1);
  }

  function handleSaveDraft() {
    setDraftToast(true);
    setTimeout(() => setDraftToast(false), 2500);
  }

  function handleRowClick(r: RelatedRequest) {
    if (isInProgress) { setRowWarnTicket(r); return; }
    openTicket(r);
  }

  function handleRowContextMenu(e: React.MouseEvent, r: RelatedRequest) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, ticket: r });
  }

  function handleOpenInNewTab(_r: RelatedRequest) {
    // No-op in prototype — would open ticket in a new browser tab
    setContextMenu(null);
  }

  const isInProgress = submitter !== null || selectedType !== '' || formTab !== 'who';
  const isNewTicket = !activeTicket;
  const canSubmit = !!(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    notifPrefMet &&
    selectedType &&
    comments.trim() &&
    selectedAddress
  );

  function handleSubmit() {
    handleSave();
    setComments('');
    setNotifPrefMet(false);
  }
  const whoIncomplete  = !(formData.firstName?.trim() && formData.lastName?.trim() && notifPrefMet);
  const whatIncomplete = !(selectedType && comments.trim());
  const whereIncomplete = !selectedAddress;

  const formTabs: { key: FormTab; label: string; disabled?: boolean; warning?: boolean }[] = [
    { key: 'who',   label: 'Who',          warning: whoIncomplete },
    { key: 'what',  label: 'What (0)',      warning: whatIncomplete },
    { key: 'where', label: 'Where',         warning: whereIncomplete },
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

      {/* ── Toolbar ── */}
      <div style={{ backgroundColor: TOOLBAR_BG, height: '36px', display: 'flex', alignItems: 'center', flexShrink: 0, borderBottom: GREY_LINE }}>
        {!isNewTicket ? (
          /* ── Existing ticket toolbar ── */
          <>
            <button
              onClick={resetForm}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: '#333', background: 'none', border: 'none', borderRight: `1px solid ${SEP_COLOR}`, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <img src={`${BASE}icons/add-new-request.gif`} alt="+" style={{ height: '20px' }} /> New Request
            </button>
            <TBtn img="save.png" label="Save" onClick={handleSave} disabled={!selectedType} />
            {/* Collaborators dropdown */}
            <div ref={collabRef} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setCollabOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: '#444', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <img src={`${BASE}icons/handshake-collaborators.png`} alt="" style={{ height: '20px', width: '20px', objectFit: 'contain' }} />
                Collaborators
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="#666" strokeWidth="1.5"><polyline points="0.5,0.5 4,4.5 7.5,0.5"/></svg>
              </button>
              {collabOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 400, backgroundColor: '#fff', border: '1px solid #c8d0d8', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', minWidth: '140px', borderRadius: '3px', paddingTop: '4px', paddingBottom: '4px' }}>
                  <button onClick={() => setCollabOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 14px', fontSize: T2, color: '#222', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '16px', lineHeight: 1 }}>+</span> Add
                  </button>
                  <button onClick={() => setCollabOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 14px', fontSize: T2, color: '#222', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>✕</span> Remove
                  </button>
                </div>
              )}
            </div>
            <TBtn img="link.gif" label="Link Selected" disabled />
          </>
        ) : isInProgress ? (
          /* ── New ticket in progress ── */
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
            <div style={{ flex: 1 }} />
            <button
              onClick={canSubmit ? handleSubmit : undefined}
              title={canSubmit ? 'Submit this request' : 'Fill in all required fields first'}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0 14px', height: '100%',
                fontSize: T2, fontWeight: 600,
                background: canSubmit ? '#1a7a4a' : 'transparent',
                color: canSubmit ? '#fff' : '#aab',
                border: 'none',
                borderLeft: `1px solid ${SEP_COLOR}`,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5l15-9-5 9 5 9-15-9z"/></svg>
              Submit Request
            </button>
          </>
        ) : (
          /* ── Idle (no ticket open, nothing started) ── */
          <button
            onClick={resetForm}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', height: '100%', fontSize: T2, color: '#333', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            <img src={`${BASE}icons/add-new-request.gif`} alt="+" style={{ height: '20px' }} /> New Request
          </button>
        )}
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
          <div style={{ padding: '22px 24px 0', flexShrink: 0, backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              {(() => {
                const CIRCLE = 42;                   // px diameter
                const currentIdx = formTabs.findIndex(f => f.key === formTab);
                return formTabs.map((t, i) => {
                  const isLast      = i === formTabs.length - 1;
                  const isActive    = i === currentIdx;
                  const isCompleted = i < currentIdx;
                  const isDisabled  = !!t.disabled;
                  const cleanLabel  = t.label.replace(/ \(\d+\)/g, '').replace('Manage & ', '').toUpperCase();

                  const circleBg     = (isActive || isCompleted) ? NAV_BG : '#fff';
                  const circleBorder = (isActive || isCompleted) ? NAV_BG : isDisabled ? '#dde0e4' : '#c8d0d8';
                  const numColor     = (isActive || isCompleted) ? '#fff' : isDisabled ? '#ccc' : '#b0b8c4';
                  const labelColor   = isActive ? NAV_BG : isCompleted ? '#444' : isDisabled ? '#ccc' : '#b0b8c4';
                  const lineColor    = isCompleted ? NAV_BG : '#dde0e4';

                  return (
                    <div key={t.key} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? 0 : 1 }}>
                      {/* Circle + label */}
                      <div
                        onClick={() => !isDisabled && setFormTab(t.key)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: isDisabled ? 'default' : 'pointer', minWidth: '64px' }}
                      >
                        <div style={{
                          width: `${CIRCLE}px`, height: `${CIRCLE}px`, borderRadius: '50%',
                          backgroundColor: circleBg,
                          border: `2px solid ${circleBorder}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px', fontWeight: 700, color: numColor,
                          boxSizing: 'border-box', position: 'relative', zIndex: 1,
                          outline: trainingTarget === t.key ? '2px solid #f59e0b' : undefined,
                          outlineOffset: '3px',
                          flexShrink: 0,
                        }}>
                          {isCompleted
                            ? <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,7 6,12 17,1"/></svg>
                            : String(i + 1)
                          }
                          {t.warning && (
                            <div style={{
                              position: 'absolute', top: '0px', right: '0px',
                              width: '10px', height: '10px', borderRadius: '50%',
                              backgroundColor: '#f59e0b', border: '2px solid #fff',
                            }} />
                          )}
                        </div>
                        <div style={{
                          fontSize: '11px', letterSpacing: '0.06em', marginTop: '7px',
                          fontWeight: isActive ? 700 : 500,
                          color: labelColor, whiteSpace: 'nowrap', textAlign: 'center',
                        }}>
                          {cleanLabel}
                        </div>
                      </div>

                      {/* Connector line — sits at circle centre */}
                      {!isLast && (
                        <div style={{ flex: 1, height: '2px', marginTop: `${CIRCLE / 2 - 1}px`, backgroundColor: lineColor }} />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div style={{ height: '18px', backgroundColor: '#fff', flexShrink: 0 }} />

          {/* Tab content — borderTop is the thin section-divider line below the white gap */}
          <div key={formKey} style={{ flex: 1, overflow: isNarrow ? 'visible' : 'auto', borderTop: GREY_LINE }}>
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
                onNotifPrefChange={setNotifPrefMet}
              />
            )}
            {formTab === 'what' && <WhatTab onTypeChange={setSelectedType} onCommentsChange={setComments} initialType={selectedType} />}
            {formTab === 'where' && <WhereTab onAddressChange={setSelectedAddress} residentFormData={formData} initialAddress={selectedAddress} />}
            {formTab === 'more' && <FilesTab />}
            {formTab !== 'who' && formTab !== 'what' && formTab !== 'where' && formTab !== 'more' && (
              <div style={{ padding: '14px', color: '#aaa', fontSize: T4 }}>
                {formTabs.find(t => t.key === formTab)?.label} — coming soon
              </div>
            )}
          </div>

          {/* ── Footer: Next / Submit ── */}
          <div style={{ flexShrink: 0, borderTop: GREY_LINE, padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#fff', minHeight: '50px' }}>
            {/* Step 4 (Upload Files) — no "Next", just Submit */}
            {!nextStep && (
              <button
                onClick={canSubmit ? handleSubmit : undefined}
                title={canSubmit ? 'Submit this request' : 'Fill in all required fields first'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 22px',
                  background: canSubmit ? '#1a7a4a' : '#e0e4e8',
                  color: canSubmit ? '#fff' : '#aab',
                  border: 'none', borderRadius: '4px',
                  fontSize: T2, fontWeight: 700,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5l15-9-5 9 5 9-15-9z"/></svg>
                Submit Request
              </button>
            )}

            {/* Step 3 (Where) — show both Next and a secondary Submit */}
            {nextStep && !nextStep.disabled && formTab === 'where' && (
              <button
                onClick={canSubmit ? handleSubmit : undefined}
                title={canSubmit ? 'Skip Upload Files and submit now' : 'Fill in all required fields first'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 16px',
                  background: 'transparent',
                  color: canSubmit ? '#1a7a4a' : '#bbc',
                  border: `1.5px solid ${canSubmit ? '#1a7a4a' : '#d0d4da'}`,
                  borderRadius: '4px',
                  fontSize: T2, fontWeight: 600,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5l15-9-5 9 5 9-15-9z"/></svg>
                Submit Request
              </button>
            )}

            {/* Standard Next button (steps 1, 2, 3) */}
            {nextStep && !nextStep.disabled && (
              <button
                onClick={() => setFormTab(nextStep.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 18px', backgroundColor: NAV_BG, color: '#fff',
                  border: 'none', borderRadius: '4px',
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
                fontSize: H2, color: '#888', letterSpacing: '0.05em',
                fontWeight: 700, whiteSpace: 'nowrap',
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
                  color: '#555', fontSize: H2, lineHeight: 1,
                  padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '3px',
                }}
              >
                <span style={{ fontSize: '15px', lineHeight: 1 }}>‹</span> Collapse
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
                  <tr
                    key={r.id}
                    onClick={() => handleRowClick(r)}
                    onContextMenu={e => handleRowContextMenu(e, r)}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef4fb')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#fff' : '#f7f9fb')}
                    style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7f9fb', borderBottom: GREY_LINE, color: '#444', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap', fontWeight: 500 }}>{r.id}</td>
                    <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 600,
                        backgroundColor:
                          r.status === 'Open'        ? '#dcfce7' :
                          r.status === 'In Progress' ? '#dbeafe' :
                          r.status === 'On Hold'     ? '#fee2e2' : '#f0f0f0',
                        color:
                          r.status === 'Open'        ? '#15803d' :
                          r.status === 'In Progress' ? '#1d4ed8' :
                          r.status === 'On Hold'     ? '#b91c1c' : '#555',
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

      {/* ── Row-click warning dialog (in-progress guard) ── */}
      {rowWarnTicket && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '6px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            width: '440px', padding: '28px 28px 20px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>You have unsaved work</div>
            <div style={{ fontSize: T2, color: '#444', lineHeight: 1.6 }}>
              Opening ticket <strong>#{rowWarnTicket.id}</strong> here will replace what you're currently working on.
              <br /><br />
              To keep both, <strong>right-click the row</strong> and choose <em>Open in new tab</em>.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => setRowWarnTicket(null)}
                style={{ padding: '7px 20px', fontSize: T2, border: `1px solid ${SEP_COLOR}`, borderRadius: '3px', background: '#fff', color: '#444', cursor: 'pointer', fontWeight: 500 }}
              >
                Keep editing
              </button>
              <button
                onClick={() => { openTicket(rowWarnTicket); setRowWarnTicket(null); }}
                style={{ padding: '7px 20px', fontSize: T2, border: 'none', borderRadius: '3px', background: NAV_BG, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Open anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Right-click context menu ── */}
      {contextMenu && (
        <div
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1100,
            backgroundColor: '#fff',
            border: GREY_LINE,
            borderRadius: '4px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            minWidth: '180px',
            padding: '4px 0',
            fontSize: T2,
          }}
        >
          <button
            onClick={() => handleOpenInNewTab(contextMenu.ticket)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              width: '100%', padding: '8px 14px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: T2, color: '#222', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef4fb')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span style={{ fontSize: '13px' }}>↗</span> Open in new tab
          </button>
          <div style={{ borderTop: GREY_LINE, margin: '4px 0' }} />
          <button
            onClick={() => { handleRowClick(contextMenu.ticket); setContextMenu(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              width: '100%', padding: '8px 14px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: T2, color: '#222', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef4fb')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span style={{ fontSize: '13px' }}>↩</span> Open here
          </button>
        </div>
      )}

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
