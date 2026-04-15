// ABOUTME: What tab: request type search/browse and comments for the QAlert prototype.
// ABOUTME: Request type defaults to search-first; full category tree opens only via "Browse all".
import { useState, useRef, useEffect, useCallback } from 'react';
import { REQUEST_TYPES } from '../data/requestTypes';
import type { RTNode } from '../data/requestTypes';
import { REQUEST_TYPE_PROMPTS } from '../data/prompts';

const BORDER     = '1px solid #c8d0d8';
const BORDER_ERR = '1px solid #d97706'; // amber-orange when nothing selected
const T3         = '12px';
const T4         = '11px';
const SKY_BLUE   = '#cce8f8';
const SKY_DARK   = '#a8d4ef';

const PANEL_STYLE: React.CSSProperties = {
  width: '220px',
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: '#fff',
  border: BORDER,
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  flexShrink: 0,
};

const ITEM_BASE: React.CSSProperties = {
  padding: '4px 10px',
  fontSize: T4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  userSelect: 'none',
};


// ─── Reusable comments ────────────────────────────────────────────────────────
const REUSABLE_COMMENTS = [
  'A service request has been created and forwarded to the appropriate division for review. A representative may contact you if additional information is required to properly address the matter.',
  'Thanks for bringing this to our attention. We are looking into your question and we\'ll be in touch within the next couple of days with more information.',
  'Submitter called to check on request.',
  'Thanks for bringing this to our attention. It will take a few more days to check into your concern and we\'ll get in touch once we do. Thanks for your patience. If you have any immediate concerns in the meantime, feel free to get in touch.',
  'Given to supervisor for review and assignment.',
  'We have received your request and it has been assigned to the appropriate department. You will be contacted if additional information is needed.',
  'This request has been completed. Please let us know if you have any further questions.',
];

// ─── Grouped search ──────────────────────────────────────────────────────────
interface SearchGroup { parentName: string; parentNode: RTNode; items: { node: RTNode; depth: number }[]; }

function buildGroupedResults(query: string): SearchGroup[] {
  const q = query.toLowerCase();
  const groups: SearchGroup[] = [];

  for (const l1 of REQUEST_TYPES) {
    const items: { node: RTNode; depth: number }[] = [];
    if (l1.name.toLowerCase().includes(q)) items.push({ node: l1, depth: 0 });
    for (const l2 of l1.children) {
      if (l2.name.toLowerCase().includes(q)) items.push({ node: l2, depth: 1 });
      for (const l3 of l2.children) {
        if (l3.name.toLowerCase().includes(q)) items.push({ node: l3, depth: 2 });
      }
    }
    if (items.length > 0) groups.push({ parentName: l1.name, parentNode: l1, items });
  }
  return groups;
}

// Find breadcrumb path for a selected type name
function findPath(name: string): string[] {
  for (const l1 of REQUEST_TYPES) {
    if (l1.name === name) return [l1.name];
    for (const l2 of l1.children) {
      if (l2.name === name) return [l1.name, l2.name];
      for (const l3 of l2.children) {
        if (l3.name === name) return [l1.name, l2.name, l3.name];
      }
    }
  }
  return [name];
}

// Look up prompt text for the selected type (tries exact match, then parent)
function getPromptText(selectedType: string): string {
  // Try exact match first
  if (REQUEST_TYPE_PROMPTS[selectedType] !== undefined) {
    return REQUEST_TYPE_PROMPTS[selectedType];
  }
  // Try trimmed match
  const trimmed = selectedType.trim();
  if (REQUEST_TYPE_PROMPTS[trimmed] !== undefined) {
    return REQUEST_TYPE_PROMPTS[trimmed];
  }
  return '';
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WhatTab({ onTypeChange, onCommentsChange, initialType, initialComments }: { onTypeChange?: (t: string) => void; onCommentsChange?: (c: string) => void; initialType?: string; initialComments?: string } = {}) {
  const [selectedType, setSelectedType] = useState<string>(initialType ?? '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  /** When true, empty-query dropdown shows the cascading tree (opened only from "Browse all…"). */
  const [browseOpen, setBrowseOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [hoverL1, setHoverL1]           = useState<RTNode | null>(null);
  const [hoverL2, setHoverL2]           = useState<RTNode | null>(null);
  const [comments, setComments]               = useState(initialComments ?? '');
  const [privateNotes, setPrivateNotes]       = useState('');
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [promptsOpen, setPromptsOpen]         = useState(false);
  const [commentsOpen, setCommentsOpen]       = useState(false);
  const [commentSearch, setCommentSearch]     = useState('');

  const wrapperRef       = useRef<HTMLDivElement>(null);
  const typeInputRef     = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setBrowseOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-focus Type input when tab mounts
  useEffect(() => { typeInputRef.current?.focus(); }, []);

  function openBrowseMode() {
    setDropdownOpen(true);
    setBrowseOpen(true);
    setSearchQuery('');
    setHoverL1(null);
    setHoverL2(null);
  }

  function selectNode(name: string) {
    setSelectedType(name);
    onTypeChange?.(name);
    setDropdownOpen(false);
    setBrowseOpen(false);
    setSearchQuery('');
    setHoverL1(null);
    setHoverL2(null);
  }

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchQuery(v);
    setBrowseOpen(false);
    setDropdownOpen(v.trim().length > 0);
    setHoverL1(null);
    setHoverL2(null);
  }, []);

  function insertComment(text: string) {
    setComments(prev => prev ? prev + '\n\n' + text : text);
    setCommentsOpen(false);
  }

  const isSearching  = searchQuery.trim().length > 0;
  const searchGroups = isSearching ? buildGroupedResults(searchQuery) : [];
  const l2Items      = hoverL1?.children ?? [];
  const l3Items      = hoverL2?.children ?? [];

  const inputBorder = selectedType || isSearching ? BORDER : BORDER_ERR;

  const breadcrumb   = selectedType ? findPath(selectedType) : [];
  const promptText   = selectedType ? getPromptText(selectedType) : '';
  const hasPrompt    = promptText.length > 0;

  const filteredComments = commentSearch.trim()
    ? REUSABLE_COMMENTS.filter(c => c.toLowerCase().includes(commentSearch.toLowerCase()))
    : REUSABLE_COMMENTS;

  return (
    <div style={{ padding: '10px 24px', fontSize: T4 }}>

      {/* ─── h1 heading ─── */}
      <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a3a5c', marginBottom: '14px' }}>
        What's the issue or service request about?
      </div>

      {/* ─── Type section ─── */}
      <div style={{ marginBottom: '4px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#333', marginBottom: '6px' }}>Type <span style={{ color: '#c00', fontWeight: 700 }}>*</span></div>

        <div ref={wrapperRef} style={{ position: 'relative', width: '460px' }}>
          {/* Input + anchored dropdown (panel opens directly under the field) */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {/* Search icon — left */}
              <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.45 }} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#333" strokeWidth="2">
                <circle cx="6.5" cy="6.5" r="5" />
                <line x1="10.5" y1="10.5" x2="15" y2="15" />
              </svg>
              <input
                ref={typeInputRef}
                type="text"
                value={isSearching ? searchQuery : selectedType}
                onChange={handleInputChange}
                placeholder="Search request types"
                style={{
                  border: inputBorder,
                  borderRadius: '3px',
                  fontSize: '15px',
                  padding: '8px 12px 8px 32px',
                  width: '100%',
                  boxSizing: 'border-box',
                  outline: 'none',
                  color: '#222',
                  backgroundColor: '#fff',
                }}
              />
            </div>

          {/* Dropdown: search results (typing) or full tree (browse only) */}
          {dropdownOpen && (isSearching || browseOpen) && (
            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, marginTop: '2px', display: 'flex', flexDirection: 'row' }}>
              {isSearching ? (
                /* ─── Grouped search results ─── */
                <div style={{ ...PANEL_STYLE, width: '460px' }}>
                  {searchGroups.length === 0 ? (
                    <div style={{ padding: '6px 10px', color: '#999', fontSize: T4 }}>No results</div>
                  ) : (
                    searchGroups.map((group) => (
                      <div key={group.parentName}>
                        {/* Category header — bold, plain white */}
                        <div
                          style={{ padding: '6px 10px 2px', fontSize: T4, fontWeight: 700, color: '#222', backgroundColor: '#fff', cursor: group.items[0]?.depth === 0 ? 'pointer' : 'default' }}
                          onClick={() => { if (group.items[0]?.depth === 0) selectNode(group.parentName); }}
                        >
                          {group.parentName}
                        </div>
                        {/* Child items */}
                        {group.items.filter(i => i.depth > 0 || (group.items.length > 1 && i.depth === 0)).map((item) => (
                          <SearchResultItem
                            key={item.node.name}
                            name={item.node.name}
                            depth={item.depth}
                            onClick={() => selectNode(item.node.name)}
                          />
                        ))}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* ─── Cascading panels ─── */
                <>
                  <div style={PANEL_STYLE}>
                    {REQUEST_TYPES.map(n => (
                      <PanelItem
                        key={n.name}
                        node={n}
                        isActive={hoverL1?.name === n.name}
                        activeColor={SKY_DARK}
                        hoverColor={SKY_BLUE}
                        onHover={() => { setHoverL1(n); setHoverL2(null); }}
                        onClick={() => selectNode(n.name)}
                      />
                    ))}
                  </div>
                  {hoverL1 && l2Items.length > 0 && (
                    <div style={PANEL_STYLE}>
                      {l2Items.map(n => (
                        <PanelItem
                          key={n.name}
                          node={n}
                          isActive={hoverL2?.name === n.name}
                          activeColor={SKY_DARK}
                          hoverColor={SKY_BLUE}
                          onHover={() => setHoverL2(n)}
                          onClick={() => selectNode(n.name)}
                        />
                      ))}
                    </div>
                  )}
                  {hoverL2 && l3Items.length > 0 && (
                    <div style={PANEL_STYLE}>
                      {l3Items.map(n => (
                        <PanelItem
                          key={n.name}
                          node={n}
                          isActive={false}
                          activeColor={SKY_DARK}
                          hoverColor={SKY_BLUE}
                          onHover={() => {}}
                          onClick={() => selectNode(n.name)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          </div>

          <div style={{ marginTop: '5px' }}>
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                if (dropdownOpen && browseOpen && !isSearching) {
                  setDropdownOpen(false);
                  setBrowseOpen(false);
                } else {
                  openBrowseMode();
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: T4,
                color: '#2563eb',
                textDecoration: 'underline',
              }}
            >
              {dropdownOpen && browseOpen && !isSearching ? 'Close list' : 'Browse all request types'}
            </button>
            <span style={{ fontSize: T4, color: '#888', marginLeft: '8px' }}>
              Categories and sub-types
            </span>
          </div>
        </div>
      </div>

      {/* ─── Breadcrumb ─── */}
      {selectedType && (
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: T4, color: '#666' }}>
            {breadcrumb.join(' > ')}
          </span>
        </div>
      )}

      {/* ─── Prompt box ─── */}
      {hasPrompt && (
        <div style={{
          marginTop: '14px',
          backgroundColor: '#fffbeb',
          border: '1px solid #f59e0b',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '4px',
          padding: '10px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
            <span style={{ fontSize: '14px', lineHeight: 1.2, flexShrink: 0 }}>💡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                Prompts for: {selectedType}
              </div>
              <PromptBody text={promptText} />
            </div>
          </div>
        </div>
      )}

      {/* ─── Comments ─── */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#333' }}>
            Comments <span style={{ color: '#c00', fontWeight: 700 }}>*</span>
          </span>
          <button
            onClick={() => { setCommentsOpen(true); setPromptsOpen(false); }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: T4, color: '#888', textDecoration: 'underline' }}
          >
            Choose from saved comments
          </button>
        </div>
        <textarea
          value={comments}
          onChange={e => { setComments(e.target.value); onCommentsChange?.(e.target.value); }}
          rows={5}
          style={{ border: BORDER, borderRadius: '3px', resize: 'vertical', fontSize: T4, padding: '6px 8px', width: '100%', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', color: '#222' }}
        />
      </div>

      {/* ─── Private Notes (collapsed by default) ─── */}
      {!showPrivateNotes ? (
        <button
          onClick={() => setShowPrivateNotes(true)}
          style={{ marginTop: '8px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: T4, color: '#888', textDecoration: 'underline' }}
        >
          + Add private note
        </button>
      ) : (
        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#333' }}>Private Notes</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => { setCommentsOpen(true); setPromptsOpen(false); }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: T4, color: '#888', textDecoration: 'underline' }}
              >
                Choose from saved comments
              </button>
              <button
                onClick={() => setShowPrivateNotes(false)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: T4, color: '#bbb', textDecoration: 'underline' }}
              >
                hide
              </button>
            </div>
          </div>
          <textarea
            value={privateNotes}
            onChange={e => setPrivateNotes(e.target.value)}
            rows={4}
            style={{ border: BORDER, borderRadius: '3px', resize: 'vertical', fontSize: T4, padding: '6px 8px', width: '100%', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', color: '#222' }}
          />
        </div>
      )}

      {/* ─── Prompts slide-in panel ─── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: '300px', height: '100vh',
        backgroundColor: '#fff', boxShadow: '-3px 0 12px rgba(0,0,0,0.18)',
        zIndex: 500, overflowY: 'auto',
        transform: promptsOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.2s ease',
      }}>
        {/* Header — grey bg, large bold charcoal title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#f0f1f2', borderBottom: BORDER }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#333' }}>Prompts</span>
          <button onClick={() => setPromptsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888', lineHeight: 1, padding: '0 2px' }}>✕</button>
        </div>
        {/* Content */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '16px', color: '#16a34a', fontSize: T3, fontWeight: 600, cursor: 'pointer' }}>
            <span style={{ fontSize: '15px' }}>🌐</span>
            <span>Public</span>
          </div>
          <PromptBody text={promptText} />
        </div>
      </div>

      {/* ─── Reusable Comments slide-in panel ─── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: '340px', height: '100vh',
        backgroundColor: '#fff', boxShadow: '-3px 0 12px rgba(0,0,0,0.18)',
        zIndex: 500, overflowY: 'auto',
        transform: commentsOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.2s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header — grey bg, large bold charcoal title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#f0f1f2', borderBottom: BORDER, flexShrink: 0 }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#333' }}>Reusable Comments</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#888', padding: '0 2px' }} title="Add">⊕</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: '#888', padding: '0 2px' }} title="Settings">⚙</button>
            <button onClick={() => setCommentsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888', lineHeight: 1, padding: '0 2px' }}>✕</button>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 16px 8px', flexShrink: 0, borderBottom: BORDER }}>
          <input
            type="text"
            placeholder="Search comments"
            value={commentSearch}
            onChange={e => setCommentSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', border: BORDER, borderRadius: '3px', fontSize: T3, padding: '6px 10px', outline: 'none', color: '#222' }}
          />
        </div>

        {/* Comment list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredComments.length === 0 ? (
            <div style={{ fontSize: T4, color: '#999', padding: '16px' }}>No comments match your search.</div>
          ) : (
            filteredComments.map((text, i) => (
              <div key={i} style={{ borderBottom: '1px solid #e8e8e8', padding: '16px' }}>
                <p style={{ fontSize: T3, color: '#333', margin: '0 0 10px', lineHeight: 1.6 }}>{text}</p>
                <button
                  onClick={() => insertComment(text)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#16a34a', fontSize: T3, fontWeight: 600, padding: 0 }}
                >
                  {/* Green left-arrow circle */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#16a34a">
                    <circle cx="10" cy="10" r="9" />
                    <path d="M11.5 6.5 L7.5 10 L11.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  Insert
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Renders prompt text preserving newlines; makes URLs clickable
function PromptBody({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  return (
    <div>
      {text.split('\n').map((line, i) => {
        if (!line) return <div key={i} style={{ height: '6px' }} />;
        // Split line by URLs so we can make them clickable
        const parts = line.split(urlRegex);
        return (
          <div key={i} style={{ fontSize: T4, color: '#333', lineHeight: 1.5, marginBottom: '2px' }}>
            {parts.map((part, j) =>
              urlRegex.test(part) ? (
                <a key={j} href={part.startsWith('http') ? part : 'https://' + part}
                  target="_blank" rel="noreferrer"
                  style={{ color: '#2563eb', wordBreak: 'break-all' }}>
                  {part}
                </a>
              ) : part
            )}
          </div>
        );
      })}
    </div>
  );
}

function PanelItem({ node, isActive, activeColor, hoverColor, onHover, onClick }:{
  node: RTNode; isActive: boolean; activeColor: string; hoverColor: string; onHover: () => void; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const bg = isActive ? activeColor : hovered ? hoverColor : '#fff';
  return (
    <div style={{ ...ITEM_BASE, backgroundColor: bg }}
      onMouseEnter={() => { setHovered(true); onHover(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
      {node.children.length > 0 && <span style={{ marginLeft: '6px', color: '#666', fontSize: '9px', flexShrink: 0 }}>▶</span>}
    </div>
  );
}

function SearchResultItem({ name, depth, onClick }: { name: string; depth: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ padding: `3px 10px 3px ${10 + depth * 14}px`, fontSize: T4, cursor: 'pointer', backgroundColor: hovered ? SKY_BLUE : '#fff', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {name}
    </div>
  );
}


