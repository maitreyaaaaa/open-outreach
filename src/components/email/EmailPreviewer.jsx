import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Send, CheckCircle2, AlertCircle, Building2, Smartphone, Monitor, Sparkles, Shuffle } from 'lucide-react';
import { renderTemplate, textToHtml } from '../../utils/templateEngine';

export default function EmailPreviewer({ recipients, template, smtpConfig, isSmtpConnected, onNext }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('desktop');
  const [highlightVars, setHighlightVars] = useState(true);
  const [testEmailAddr, setTestEmailAddr] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  if (!recipients || recipients.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="glass-enterprise-panel">
          <h3>No recipients loaded</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please go back to the Directory tab and load your 198 companies list.</p>
        </div>
      </div>
    );
  }

  const currentRecord = recipients[currentIndex] || recipients[0];
  const renderedSubject = renderTemplate(template.subject, currentRecord);
  let renderedBodyText = renderTemplate(template.body, currentRecord);
  let renderedBodyHtml = textToHtml(renderedBodyText);

  if (highlightVars && currentRecord) {
    if (currentRecord.Company) {
      const companyReg = new RegExp(escapeRegExp(currentRecord.Company), 'g');
      renderedBodyHtml = renderedBodyHtml.replace(companyReg, `<span style="background: rgba(8, 10, 15, 0.9); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-weight: 600;">${currentRecord.Company}</span>`);
    }
    if (currentRecord.ContactPerson) {
      const contactReg = new RegExp(escapeRegExp(currentRecord.ContactPerson), 'g');
      renderedBodyHtml = renderedBodyHtml.replace(contactReg, `<span style="background: rgba(8, 10, 15, 0.9); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-weight: 600;">${currentRecord.ContactPerson}</span>`);
    }
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const handleNext = () => {
    if (currentIndex < recipients.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleRandom = () => {
    setCurrentIndex(Math.floor(Math.random() * recipients.length));
  };

  const handleSendTestToSelf = async (e) => {
    e.preventDefault();
    if (!testEmailAddr) return;

    if (!isSmtpConnected) {
      setTestStatus({ success: false, message: 'SMTP is not connected. Please set up SMTP first.' });
      return;
    }

    setSendingTest(true);
    setTestStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpConfig,
          emailData: {
            to: testEmailAddr.trim(),
            fromName: smtpConfig.fromName,
            subject: `[PREVIEW TEST #${currentIndex + 1}] ${renderedSubject}`,
            html: textToHtml(renderedBodyText),
            text: renderedBodyText
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setTestStatus({ success: true, message: `Test email sent to ${testEmailAddr}!` });
      } else {
        setTestStatus({ success: false, message: data.message || 'Failed to send test email.' });
      }
    } catch (err) {
      setTestStatus({ success: false, message: err.message || 'Network error.' });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div>
      
      {/* Navigation Bar */}
      <div className="glass-enterprise-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Eye size={22} color="#ffffff" />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
              1-by-1 Email Inspector
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Inspecting email <strong>#{currentIndex + 1}</strong> of <strong>{recipients.length}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'rgba(8, 10, 15, 0.6)', padding: '3px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setViewMode('desktop')}
              className="btn-enterprise"
              style={{ padding: '5px 10px', fontSize: '0.78rem', background: viewMode === 'desktop' ? '#ffffff' : 'transparent', color: viewMode === 'desktop' ? '#080a0f' : 'var(--text-muted)' }}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className="btn-enterprise"
              style={{ padding: '5px 10px', fontSize: '0.78rem', background: viewMode === 'mobile' ? '#ffffff' : 'transparent', color: viewMode === 'mobile' ? '#080a0f' : 'var(--text-muted)' }}
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>

          <button onClick={() => setHighlightVars(!highlightVars)} className="btn-enterprise btn-enterprise-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <Sparkles size={14} /> {highlightVars ? 'Highlights ON' : 'Highlights OFF'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={handlePrev} disabled={currentIndex === 0} className="btn-enterprise btn-enterprise-secondary">
            <ChevronLeft size={16} /> Prev
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              min={1}
              max={recipients.length}
              value={currentIndex + 1}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                if (val >= 1 && val <= recipients.length) setCurrentIndex(val - 1);
              }}
              className="input-enterprise"
              style={{ width: '56px', textAlign: 'center', padding: '4px' }}
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/ {recipients.length}</span>
          </div>

          <button onClick={handleNext} disabled={currentIndex === recipients.length - 1} className="btn-enterprise btn-enterprise-secondary">
            Next <ChevronRight size={16} />
          </button>

          <button onClick={handleRandom} className="btn-enterprise btn-enterprise-secondary" title="Random preview">
            <Shuffle size={14} />
          </button>
        </div>

      </div>

      {/* Email Canvas */}
      <div style={{ marginBottom: '24px' }}>
        {viewMode === 'desktop' ? (
          <div className="glass-enterprise-panel" style={{ padding: 0, overflow: 'hidden' }}>
            
            <div style={{ padding: '20px 24px', background: 'rgba(8, 10, 15, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>To:</span>
                  <strong style={{ color: '#ffffff' }}>{currentRecord.ContactPerson}</strong>
                  <span style={{ color: 'var(--text-dim)' }}>&lt;{currentRecord.Email}&gt;</span>
                </div>
                <span className="badge-enterprise">
                  <Building2 size={12} /> {currentRecord.Company}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Subject:</span>
                <strong style={{ color: '#ffffff' }}>{renderedSubject}</strong>
              </div>
            </div>

            <div style={{ padding: '36px 32px', background: '#ffffff', color: '#080a0f', minHeight: '320px', fontSize: '0.96rem', lineHeight: '1.65' }}>
              <div dangerouslySetInnerHTML={{ __html: renderedBodyHtml }} />
            </div>

          </div>
        ) : (
          <div className="mobile-frame-enterprise">
            <div style={{ background: '#080a0f', padding: '14px 16px', color: '#ffffff', fontSize: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Mobile Inbox Preview</div>
              <strong style={{ display: 'block', fontSize: '0.88rem', color: '#ffffff' }}>{renderedSubject}</strong>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>To: {currentRecord.ContactPerson}</div>
            </div>
            <div style={{ padding: '20px 16px', background: '#ffffff', color: '#080a0f', fontSize: '0.88rem', minHeight: '400px', lineHeight: '1.6' }}>
              <div dangerouslySetInnerHTML={{ __html: renderedBodyHtml }} />
            </div>
          </div>
        )}
      </div>

      {/* Test Email */}
      <div className="glass-enterprise-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Send size={16} color="#ffffff" /> Send Single Test to Personal Inbox
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Verify email layout in your inbox client before starting campaign.
        </p>

        <form onSubmit={handleSendTestToSelf} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="email"
            className="input-enterprise"
            style={{ flex: 1, minWidth: '260px' }}
            placeholder="Enter personal test email address..."
            value={testEmailAddr}
            onChange={e => setTestEmailAddr(e.target.value)}
            required
          />
          <button type="submit" className="btn-enterprise btn-enterprise-secondary" disabled={sendingTest}>
            {sendingTest ? 'Sending Test...' : 'Send Test Email'}
          </button>
        </form>

        {testStatus && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff'
          }}>
            {testStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{testStatus.message}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onNext} className="btn-enterprise btn-enterprise-primary">
          Proceed to Batch Dispatcher &rarr;
        </button>
      </div>

    </div>
  );
}
