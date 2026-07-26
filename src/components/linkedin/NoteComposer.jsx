import React from 'react';
import { Sparkles, Tag, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function NoteComposer({ template, setTemplate, onNext }) {

  const charCount = template.body.length;
  const isOverLimit = charCount > 300;
  const remaining = 300 - charCount;

  const insertVariable = (varName) => {
    const tag = `{{${varName}}}`;
    setTemplate(prev => ({ ...prev, body: prev.body + ' ' + tag }));
  };

  const applyTemplatePreset = (presetType) => {
    if (presetType === 'networking') {
      setTemplate({
        body: `Hi {{FirstName}}, noticed your work at {{Company}} as {{Role}}. I’m also in this space and would love to connect and follow your updates!`
      });
    } else if (presetType === 'peer') {
      setTemplate({
        body: `Hello {{FirstName}}, came across your profile while researching industry leaders in {{Company}}. Would be great to connect here on LinkedIn.`
      });
    }
  };

  return (
    <div>
      <div className="glass-enterprise-panel" style={{ padding: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">Connection Note Engine</span>
              <span className="badge-enterprise">300-Char Limit</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              Personalized Connection Note Composer
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              LinkedIn connection notes are strictly limited to <strong>300 characters</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => applyTemplatePreset('networking')} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={14} /> B2B Networking
            </button>
            <button onClick={() => applyTemplatePreset('peer')} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={14} /> Industry Peer
            </button>
          </div>
        </div>

        {/* 300-Character Gauge */}
        <div className="glass-enterprise-card" style={{ padding: '16px 20px', marginBottom: '20px', border: isOverLimit ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isOverLimit ? <AlertTriangle size={18} color="#ffffff" /> : <ShieldCheck size={18} color="#ffffff" />}
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                  LinkedIn 300-Character Counter: {charCount} / 300
                </strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isOverLimit 
                    ? `⚠️ Note is ${charCount - 300} characters over LinkedIn's hard 300-char limit! Trim text to send.`
                    : `${remaining} characters remaining.`}
                </p>
              </div>
            </div>
            <span className="badge-enterprise" style={{ background: isOverLimit ? '#ffffff' : 'rgba(255,255,255,0.08)', color: isOverLimit ? '#080a0f' : '#ffffff' }}>
              {isOverLimit ? 'EXCEEDS LIMIT' : 'LIMIT SAFE ✓'}
            </span>
          </div>

          <div style={{ marginTop: '12px', background: 'rgba(8, 10, 15, 0.8)', height: '6px', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, Math.round((charCount / 300) * 100))}%`,
              height: '100%',
              background: '#ffffff',
              transition: 'width 0.2s ease'
            }} />
          </div>
        </div>

        {/* Tag Insert Chips */}
        <div className="glass-enterprise-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Tag size={14} color="#ffffff" /> CLICK TO INSERT PLACEHOLDER TAG:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['FirstName', 'Name', 'Company', 'Role', 'CustomNote'].map(varName => (
              <button
                key={varName}
                onClick={() => insertVariable(varName)}
                className="btn-enterprise btn-enterprise-secondary"
                style={{ padding: '4px 10px', fontSize: '0.76rem' }}
              >
                + {`{{${varName}}}`}
              </button>
            ))}
          </div>
        </div>

        {/* Body Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600' }}>Personalized Connection Note Text</label>
              <span style={{ fontSize: '0.78rem', color: isOverLimit ? '#ffffff' : 'var(--text-muted)' }}>
                {charCount} / 300 chars
              </span>
            </div>
            <textarea
              className="textarea-enterprise"
              rows={6}
              style={{ lineHeight: '1.6', fontSize: '0.92rem' }}
              placeholder="Hi {{FirstName}},..."
              value={template.body}
              onChange={e => setTemplate({ ...template, body: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button onClick={onNext} className="btn-enterprise btn-enterprise-primary" disabled={isOverLimit}>
              Next: LinkedIn Modal Preview &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
