// ABOUTME: History step for submitted tickets — Actions heading, audit toolbar, and activity table.
// ABOUTME: Used only when viewing an existing request (not during new draft entry).

import type { RelatedRequest, TicketHistoryRow } from '../types/qalert';

const H2 = '15px';
const H3 = '13px';
const T4 = '11px';
const BORDER = '1px solid #c8d0d8';
const NAV_BG = '#1a3a5c';

interface HistoryTabProps {
  ticket: RelatedRequest;
  rows: TicketHistoryRow[];
}

export function HistoryTab({ ticket, rows }: HistoryTabProps) {
  const reRouteLocked = ticket.status === 'Closed';

  return (
    <div style={{ padding: '10px 24px 20px', fontSize: T4, color: '#333', backgroundColor: '#fff' }}>
      <div style={{ fontSize: H2, fontWeight: 700, color: '#111', marginBottom: '12px' }}>
        Actions
      </div>

      {/* Action toolbar — Re-Route disabled per legacy app rules for closed tickets */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '8px 0 14px',
          borderBottom: BORDER,
          marginBottom: '12px',
        }}
      >
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: H3,
            fontWeight: 600,
            color: '#166534',
            backgroundColor: '#ecfdf3',
            border: '1px solid #86efac',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontWeight: 800, fontSize: '14px', lineHeight: 1 }}>+</span>
          Add Activity
        </button>
        <button
          type="button"
          disabled={reRouteLocked}
          title={reRouteLocked ? 'Re-routing is not available for closed requests' : 'Change routing for this request'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: H3,
            fontWeight: 600,
            ...(reRouteLocked
              ? {
                  color: '#94a3b8',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  cursor: 'not-allowed',
                  opacity: 0.85,
                }
              : {
                  color: NAV_BG,
                  backgroundColor: '#fff',
                  border: BORDER,
                  cursor: 'pointer',
                  opacity: 1,
                }),
            borderRadius: '3px',
          }}
        >
          <span style={{ fontSize: '14px' }}>→</span>
          Re-Route
        </button>
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: H3,
            fontWeight: 600,
            color: NAV_BG,
            backgroundColor: '#fff',
            border: BORDER,
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={NAV_BG} strokeWidth="1.6">
            <path d="M4 8a4 4 0 018 0c0 1.5-.8 2.8-2 3.5L14 14" />
            <path d="M12 4v4h-4" />
          </svg>
          Re-Open
        </button>
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: H3,
            fontWeight: 600,
            color: NAV_BG,
            backgroundColor: '#fff',
            border: BORDER,
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={NAV_BG} strokeWidth="1.4">
            <path d="M4 4h8v10H4z M6 2h4v2H6z" />
            <path d="M5 7h6 M5 9h4" />
          </svg>
          Print
        </button>
      </div>

      <div style={{ fontSize: H2, fontWeight: 700, color: '#333', marginTop: '22px', marginBottom: '12px' }}>
        Activity history
        <span style={{ fontWeight: 400, color: '#666', marginLeft: '8px' }}>Request #{ticket.id}</span>
      </div>

      <div style={{ overflow: 'auto', border: BORDER, borderRadius: '4px', marginTop: '4px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: T4, backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#e8eef4', color: NAV_BG, fontWeight: 700, fontSize: H3, textAlign: 'left' }}>
              <th style={{ padding: '8px 10px', borderBottom: BORDER, whiteSpace: 'nowrap' }}>Activity</th>
              <th style={{ padding: '8px 10px', borderBottom: BORDER, whiteSpace: 'nowrap' }}>Date</th>
              <th style={{ padding: '8px 10px', borderBottom: BORDER, whiteSpace: 'nowrap' }}>User</th>
              <th style={{ padding: '8px 10px', borderBottom: BORDER }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.activity}-${i}`}
                style={{
                  backgroundColor: i % 2 === 0 ? '#fff' : '#f7f9fb',
                  borderBottom: BORDER,
                }}
              >
                <td style={{ padding: '8px 10px', verticalAlign: 'top', fontWeight: 600, color: '#222' }}>{r.activity}</td>
                <td style={{ padding: '8px 10px', verticalAlign: 'top', whiteSpace: 'nowrap', color: '#444' }}>{r.date}</td>
                <td style={{ padding: '8px 10px', verticalAlign: 'top', color: '#444' }}>{r.user}</td>
                <td style={{ padding: '8px 10px', verticalAlign: 'top', color: '#333', lineHeight: 1.35 }}>{r.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
