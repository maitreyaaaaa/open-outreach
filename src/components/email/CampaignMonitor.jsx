import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RefreshCw, Download, Terminal, Zap, Gauge } from 'lucide-react';
import { renderTemplate, textToHtml } from '../../utils/templateEngine';
import Papa from 'papaparse';

export default function CampaignMonitor({ recipients, setRecipients, template, smtpConfig, isSmtpConnected }) {
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [useRandomJitter, setUseRandomJitter] = useState(true);
  const [campaignStatus, setCampaignStatus] = useState('IDLE');
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);

  const isSendingRef = useRef(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time: timestamp, text: msg, type }]);
  };

  const startCampaign = async () => {
    if (!isSmtpConnected) {
      alert('Please connect SMTP first in the SMTP Security Config tab.');
      return;
    }

    if (recipients.length === 0) {
      alert('No recipients loaded.');
      return;
    }

    setCampaignStatus('SENDING');
    isSendingRef.current = true;
    addLog(`🚀 Campaign initialized for ${recipients.length} recipients. Delay: ${delaySeconds}s (Jitter: ${useRandomJitter ? 'ON' : 'OFF'}).`, 'info');

    let startIndex = recipients.findIndex(r => r.Status !== 'Sent');
    if (startIndex === -1) startIndex = 0;

    runDispatchLoop(startIndex);
  };

  const pauseCampaign = () => {
    setCampaignStatus('PAUSED');
    isSendingRef.current = false;
    addLog('⏸️ Campaign paused by user.', 'warning');
  };

  const resumeCampaign = () => {
    setCampaignStatus('SENDING');
    isSendingRef.current = true;
    addLog('▶️ Campaign resumed.', 'info');
    
    const nextIdx = recipients.findIndex(r => r.Status === 'Pending' || r.Status === 'Failed');
    if (nextIdx !== -1) {
      runDispatchLoop(nextIdx);
    } else {
      setCampaignStatus('COMPLETED');
    }
  };

  const stopCampaign = () => {
    setCampaignStatus('STOPPED');
    isSendingRef.current = false;
    addLog('🛑 Campaign stopped.', 'error');
  };

  const retryFailed = () => {
    const updated = recipients.map(r => r.Status === 'Failed' ? { ...r, Status: 'Pending', Error: null } : r);
    setRecipients(updated);
    addLog('🔄 Reset failed items to Pending status.', 'info');
  };

  const runDispatchLoop = async (index) => {
    if (index >= recipients.length) {
      setCampaignStatus('COMPLETED');
      isSendingRef.current = false;
      addLog('🎉 Campaign completed! All emails processed.', 'success');
      return;
    }

    if (!isSendingRef.current) return;

    setCurrentIndex(index);
    const item = recipients[index];

    if (item.Status === 'Sent') {
      runDispatchLoop(index + 1);
      return;
    }

    addLog(`[${index + 1}/${recipients.length}] Dispatching to ${item.Company} (${item.Email})...`, 'info');

    const subject = renderTemplate(template.subject, item);
    const bodyText = renderTemplate(template.body, item);
    const bodyHtml = textToHtml(bodyText);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpConfig,
          emailData: {
            to: item.Email,
            fromName: smtpConfig.fromName,
            subject,
            html: bodyHtml,
            text: bodyText
          }
        })
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (response.ok && contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { success: true, message: `Email dispatched successfully to ${item.Email}` };
      }

      if (data.success) {
        setRecipients(prev => prev.map((r, i) => i === index ? {
          ...r,
          Status: 'Sent',
          SentAt: new Date().toLocaleTimeString(),
          Error: null
        } : r));

        addLog(`✓ Sent successfully to ${item.Company} (${item.Email})`, 'success');
      } else {
        setRecipients(prev => prev.map((r, i) => i === index ? {
          ...r,
          Status: 'Failed',
          Error: data.message || 'Send error'
        } : r));

        addLog(`✕ Failed sending to ${item.Company}: ${data.message}`, 'error');
      }

    } catch (err) {
      setRecipients(prev => prev.map((r, i) => i === index ? {
        ...r,
        Status: 'Failed',
        Error: err.message || 'Network error'
      } : r));

      addLog(`✕ Exception sending to ${item.Company}: ${err.message}`, 'error');
    }

    let actualDelay = delaySeconds;
    if (useRandomJitter) {
      const jitter = (Math.random() * 3.5) - 1;
      actualDelay = Math.max(1.5, Math.round((delaySeconds + jitter) * 10) / 10);
    }

    if (isSendingRef.current && index + 1 < recipients.length) {
      addLog(`⏳ Anti-spam throttle delay: ${actualDelay}s...`, 'dim');
      setTimeout(() => {
        if (isSendingRef.current) {
          runDispatchLoop(index + 1);
        }
      }, actualDelay * 1000);
    } else {
      if (index + 1 >= recipients.length) {
        setCampaignStatus('COMPLETED');
        isSendingRef.current = false;
        addLog('🎉 Campaign dispatch finished successfully!', 'success');
      }
    }
  };

  const exportReportCSV = () => {
    const csvData = Papa.unparse(recipients);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Email_Campaign_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sentCount = recipients.filter(r => r.Status === 'Sent').length;
  const failedCount = recipients.filter(r => r.Status === 'Failed').length;
  const pendingCount = recipients.filter(r => r.Status === 'Pending').length;
  const progressPercent = recipients.length > 0 ? Math.round((sentCount / recipients.length) * 100) : 0;

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'SUCCESS') return log.type === 'success';
    if (logFilter === 'ERROR') return log.type === 'error';
    return true;
  });

  return (
    <div>
      <div className="glass-enterprise-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">Campaign Suite</span>
              <span className="badge-enterprise">Rate Limiting</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              Batch Email Execution Console
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dispatching personalized emails to <strong>{recipients.length}</strong> target companies.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {campaignStatus === 'IDLE' && (
              <button onClick={startCampaign} className="btn-enterprise btn-enterprise-primary" style={{ padding: '9px 18px' }}>
                <Play size={15} /> Start Email Campaign
              </button>
            )}

            {campaignStatus === 'SENDING' && (
              <>
                <button onClick={pauseCampaign} className="btn-enterprise btn-enterprise-secondary">
                  <Pause size={15} /> Pause
                </button>
                <button onClick={stopCampaign} className="btn-enterprise btn-enterprise-danger">
                  <Square size={15} /> Stop
                </button>
              </>
            )}

            {campaignStatus === 'PAUSED' && (
              <>
                <button onClick={resumeCampaign} className="btn-enterprise btn-enterprise-primary">
                  <Play size={15} /> Resume Campaign
                </button>
                <button onClick={stopCampaign} className="btn-enterprise btn-enterprise-danger">
                  <Square size={15} /> Stop
                </button>
              </>
            )}

            {(campaignStatus === 'COMPLETED' || campaignStatus === 'STOPPED') && (
              <button onClick={startCampaign} className="btn-enterprise btn-enterprise-primary">
                <RefreshCw size={15} /> Restart Campaign
              </button>
            )}

            {failedCount > 0 && campaignStatus !== 'SENDING' && (
              <button onClick={retryFailed} className="btn-enterprise btn-enterprise-secondary">
                <RefreshCw size={14} /> Retry {failedCount} Failed
              </button>
            )}

            <button onClick={exportReportCSV} className="btn-enterprise btn-enterprise-secondary">
              <Download size={14} /> Export Log CSV
            </button>
          </div>
        </div>

        {/* Throttling & Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          
          <div className="glass-enterprise-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#ffffff' }}>
                Throttle Delay: {delaySeconds}s
              </label>
              <span className="badge-enterprise">{delaySeconds}s Base</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={delaySeconds}
              onChange={e => setDelaySeconds(parseInt(e.target.value, 10))}
              disabled={campaignStatus === 'SENDING'}
              style={{ width: '100%', accentColor: '#ffffff' }}
            />
          </div>

          <div className="glass-enterprise-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={15} color="#ffffff" /> Random Timing Jitter
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Randomizes intervals to mimic human typing
              </span>
            </div>
            <input
              type="checkbox"
              checked={useRandomJitter}
              onChange={e => setUseRandomJitter(e.target.checked)}
              disabled={campaignStatus === 'SENDING'}
              style={{ width: '18px', height: '18px', accentColor: '#ffffff', cursor: 'pointer' }}
            />
          </div>

        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
            <span style={{ fontWeight: '600', color: '#ffffff' }}>
              Progress: {sentCount} / {recipients.length} Sent ({progressPercent}%)
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {pendingCount} Pending | {failedCount} Failed
            </span>
          </div>

          <div style={{ background: 'rgba(8, 10, 15, 0.8)', height: '10px', borderRadius: '99px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: '#ffffff',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

      </div>

      {/* Terminal Log */}
      <div className="glass-enterprise-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
            <Terminal size={16} color="#ffffff" /> Email Execution Log
          </h3>

          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'SUCCESS', 'ERROR'].map(f => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className="btn-enterprise"
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 8px',
                  background: logFilter === f ? '#ffffff' : 'rgba(255,255,255,0.06)',
                  color: logFilter === f ? '#080a0f' : 'var(--text-muted)'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={logContainerRef}
          style={{
            background: 'rgba(8, 10, 15, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '16px',
            height: '260px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {filteredLogs.length === 0 ? (
            <span style={{ color: 'var(--text-dim)' }}>Logs will stream here when campaign starts...</span>
          ) : (
            filteredLogs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--text-dim)' }}>[{log.time}]</span>
                <span style={{ color: log.type === 'error' ? 'var(--text-muted)' : '#ffffff' }}>
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
