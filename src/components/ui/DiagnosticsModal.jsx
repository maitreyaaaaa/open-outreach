import React, { useState, useEffect } from 'react';
import { Terminal, Download, Trash2, X, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { getSystemAuditLogs, clearSystemAuditLogs, exportAuditLogsCSV } from '../../services/loggerService';

export default function DiagnosticsModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [filterLevel, setFilterLevel] = useState('ALL');

  const reloadLogs = () => {
    setLogs(getSystemAuditLogs());
  };

  useEffect(() => {
    if (isOpen) {
      reloadLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm('Clear system audit logs?')) {
      clearSystemAuditLogs();
      reloadLogs();
    }
  };

  const handleDownloadCSV = () => {
    const csvStr = exportAuditLogsCSV();
    if (!csvStr) return alert('No logs available.');
    
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `system_audit_diagnostics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(l => {
    if (filterLevel === 'ALL') return true;
    return l.level.toUpperCase() === filterLevel;
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 10, 15, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div className="glass-enterprise-panel" style={{ width: '820px', maxWidth: '95vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#ffffff', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={20} color="#080a0f" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>System Diagnostics & Audit Logs</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tracking execution history, CSV imports, and dispatch events</span>
            </div>
          </div>

          <button onClick={onClose} className="btn-enterprise btn-enterprise-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className="btn-enterprise"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  background: filterLevel === lvl ? '#ffffff' : 'rgba(255,255,255,0.06)',
                  color: filterLevel === lvl ? '#080a0f' : 'var(--text-muted)',
                  border: filterLevel === lvl ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {lvl} ({lvl === 'ALL' ? logs.length : logs.filter(l => l.level.toUpperCase() === lvl).length})
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={reloadLogs} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={handleDownloadCSV} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Download size={14} /> Export CSV
            </button>
            <button onClick={handleClear} className="btn-enterprise btn-enterprise-danger" style={{ fontSize: '0.78rem' }}>
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        {/* Logs Console Container */}
        <div
          style={{
            flex: 1,
            background: '#080a0f',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {filteredLogs.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '40px' }}>
              No system diagnostic logs recorded for level "{filterLevel}".
            </div>
          ) : (
            filteredLogs.map(l => (
              <div
                key={l.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingBottom: '6px',
                  lineHeight: '1.4'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>[{l.timeFormatted}]</span>
                  <span
                    className="badge-enterprise"
                    style={{
                      padding: '1px 6px',
                      fontSize: '0.68rem',
                      background: l.level === 'success' ? 'rgba(34, 197, 94, 0.2)' : l.level === 'error' ? 'rgba(239, 68, 68, 0.2)' : l.level === 'warning' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.1)',
                      color: l.level === 'success' ? '#4ade80' : l.level === 'error' ? '#f87171' : l.level === 'warning' ? '#facc15' : '#ffffff'
                    }}
                  >
                    {l.level.toUpperCase()}
                  </span>
                  <span style={{ color: '#60a5fa', fontWeight: '600', fontSize: '0.76rem' }}>[{l.category}]</span>
                  <strong style={{ color: '#ffffff' }}>{l.action}</strong>
                </div>
                {l.details && Object.keys(l.details).length > 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginLeft: '16px', marginTop: '2px' }}>
                    {JSON.stringify(l.details)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
