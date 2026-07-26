import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Send, CheckCircle2, AlertCircle, Linkedin, Shuffle } from 'lucide-react';
import { renderTemplate } from '../../utils/templateEngine';

export default function ModalInspector({ recipients, template, onNext }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sendingTest, setSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  if (!recipients || recipients.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="glass-enterprise-panel">
          <h3>No profiles loaded</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please go back to the Profiles Directory tab and load target profiles.</p>
        </div>
      </div>
    );
  }

  const currentRecord = recipients[currentIndex] || recipients[0];
  const renderedNote = renderTemplate(template.body, currentRecord);
  const isOverLimit = renderedNote.length > 300;

  const handleNext = () => {
    if (currentIndex < recipients.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleRandom = () => {
    setCurrentIndex(Math.floor(Math.random() * recipients.length));
  };

  const handleSingleConnect = async () => {
    setSendingTest(true);
    setTestStatus(null);

    try {
      const response = await fetch('/api/send-connect-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl: currentRecord.LinkedInUrl,
          noteText: renderedNote,
          recipientName: currentRecord.Name
        })
      });

      const data = await response.json();
      if (data.success) {
        setTestStatus({ success: true, message: data.message });
      } else {
        setTestStatus({ success: false, message: data.message });
      }
    } catch (err) {
      setTestStatus({ success: false, message: err.message || 'Network error sending request.' });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div>
      
      {/* Header */}
      <div className="glass-enterprise-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Eye size={22} color="#ffffff" />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
              LinkedIn Invitation Modal Inspector
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Inspecting note <strong>#{currentIndex + 1}</strong> of <strong>{recipients.length}</strong>
            </span>
          </div>
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

      {/* Faux Modal */}
      <div style={{ marginBottom: '28px' }}>
        <div className="linkedin-modal-preview">
          
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Linkedin color="#0a66c2" size={20} />
              <strong style={{ fontSize: '1rem', color: '#000000' }}>Add a note to your invitation</strong>
            </div>
            <span style={{ fontSize: '0.78rem', color: isOverLimit ? '#d97706' : '#666666', fontWeight: '600' }}>
              {renderedNote.length} / 300
            </span>
          </div>

          <div style={{ padding: '12px 20px', background: '#f8f9fa', borderBottom: '1px solid #e0e0e0', fontSize: '0.85rem' }}>
            <span style={{ color: '#666666' }}>Inviting: </span>
            <strong style={{ color: '#000000' }}>{currentRecord.Name}</strong>
            <span style={{ color: '#666666' }}> ({currentRecord.Role} @ {currentRecord.Company})</span>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{
              background: '#f3f6f8',
              border: '1px solid #0a66c2',
              borderRadius: '6px',
              padding: '12px 16px',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#000000',
              minHeight: '120px',
              whiteSpace: 'pre-wrap'
            }}>
              {renderedNote || <span style={{ color: '#999999' }}>Note text will render here...</span>}
            </div>

            <p style={{ fontSize: '0.75rem', color: '#666666', marginTop: '8px' }}>
              LinkedIn connection request invitations with custom notes receive up to 3x higher acceptance rates.
            </p>
          </div>

          <div style={{ padding: '12px 20px', background: '#f8f9fa', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button style={{ padding: '6px 14px', borderRadius: '16px', border: '1px solid #666', background: 'none', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
              Cancel
            </button>
            <button style={{ padding: '6px 16px', borderRadius: '16px', border: 'none', background: '#0a66c2', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
              Send invitation
            </button>
          </div>

        </div>
      </div>

      {/* Single Test */}
      <div className="glass-enterprise-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={16} color="#ffffff" /> Dispatch Single Invitation to {currentRecord.Name}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Launches automated Playwright browser session to send this single request.
            </p>
          </div>

          <button
            onClick={handleSingleConnect}
            className="btn-enterprise btn-enterprise-primary"
            disabled={sendingTest || isOverLimit}
          >
            {sendingTest ? 'Sending via Playwright...' : 'Send Single Request Now'}
          </button>
        </div>

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
          Proceed to Playwright Automation &rarr;
        </button>
      </div>

    </div>
  );
}
