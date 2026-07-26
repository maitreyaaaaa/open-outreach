import React from 'react';
import { Upload, Plus, Sparkles, Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No Data Available',
  description = 'Import your custom contacts file to get started.',
  onImport,
  onLoadDemo,
  onAddSingle,
  channel = 'Email'
}) {
  return (
    <div className="glass-enterprise-panel" style={{ padding: '60px 32px', textAlign: 'center', maxWidth: '640px', margin: '32px auto' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.08)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
        <Inbox size={26} color="#ffffff" />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
        {title}
      </h3>
      
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px', maxWidth: '440px', margin: '0 auto 28px' }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {onLoadDemo && (
          <Button variant="primary" onClick={onLoadDemo} icon={Sparkles}>
            Load Demo {channel} Targets
          </Button>
        )}

        {onImport && (
          <label className="btn-enterprise btn-enterprise-secondary" style={{ minHeight: '44px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} /> Import CSV File
            <input type="file" accept=".csv, .xlsx, .xls" onChange={onImport} style={{ display: 'none' }} />
          </label>
        )}

        {onAddSingle && (
          <Button variant="secondary" onClick={onAddSingle} icon={Plus}>
            Add Single Entry
          </Button>
        )}
      </div>
    </div>
  );
}
