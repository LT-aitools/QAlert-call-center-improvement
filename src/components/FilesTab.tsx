import { useState, useRef } from 'react';

const BORDER = '1px solid #c8d0d8';
const T3     = '12px';
const T4     = '11px';

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  addedBy: string;
  date: string;
}

export function FilesTab() {
  const [files, setFiles]           = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  function processFiles(incoming: FileList | null) {
    if (!incoming) return;
    const now = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    const newFiles: UploadedFile[] = Array.from(incoming).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: f.size < 1024
        ? `${f.size} B`
        : f.size < 1024 * 1024
          ? `${(f.size / 1024).toFixed(1)} KB`
          : `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      addedBy: 'charlottelau',
      date: now,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  }

  return (
    <div style={{ padding: '8px 16px', fontSize: T4 }}>

      {/* Top row: "Request is not linked" left, "Files" center, "Add" right */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: T4, color: '#666', flex: 1 }}>Request is not linked</span>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#222', flex: 1, textAlign: 'center' }}>Files</span>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 16px',
              fontSize: T3,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={e => { processFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `1px dashed ${isDragOver ? '#16a34a' : '#c8d0d8'}`,
          borderRadius: '3px',
          backgroundColor: isDragOver ? '#f0fdf4' : '#fff',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
      >
        {files.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: T3, color: '#aaa' }}>Drag and drop files here to upload</span>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: T4 }}>
              <thead>
                <tr style={{ borderBottom: BORDER, backgroundColor: '#f7f9fb' }}>
                  <th style={{ textAlign: 'left', padding: '5px 10px', fontWeight: 600, color: '#555' }}>File Name</th>
                  <th style={{ textAlign: 'left', padding: '5px 10px', fontWeight: 600, color: '#555' }}>Size</th>
                  <th style={{ textAlign: 'left', padding: '5px 10px', fontWeight: 600, color: '#555' }}>Added By</th>
                  <th style={{ textAlign: 'left', padding: '5px 10px', fontWeight: 600, color: '#555' }}>Date</th>
                  <th style={{ padding: '5px 8px' }} />
                </tr>
              </thead>
              <tbody>
                {files.map((f, i) => (
                  <tr key={f.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7f9fb', borderBottom: BORDER }}>
                    <td style={{ padding: '5px 10px' }}>
                      <span style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>{f.name}</span>
                    </td>
                    <td style={{ padding: '5px 10px', color: '#555' }}>{f.size}</td>
                    <td style={{ padding: '5px 10px', color: '#555' }}>{f.addedBy}</td>
                    <td style={{ padding: '5px 10px', color: '#555', whiteSpace: 'nowrap' }}>{f.date}</td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <button
                        onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '13px', lineHeight: 1, padding: '0 2px' }}
                        title="Remove"
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
              <span style={{ fontSize: T4, color: '#ccc' }}>Drag and drop more files here to upload</span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
