import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RefreshCw, Download, Terminal, Globe } from 'lucide-react';
import { renderTemplate } from '../../utils/templateEngine';
import Papa from 'papaparse';

export default function PlaywrightRunner({ recipients, setRecipients, template }) {
  const [minDelay, setMinDelay] = useState(30);
  const [maxDelay, setMaxDelay] = useState(75);
  const [dailyCap, setDailyCap] = useState(25);
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

  const handleLaunchLoginBrowser = async () => {
    addLog('Launching browser window for LinkedIn session authentication...', 'info');
    try {
      const response = await fetch('/api/launch-login-browser', { method: 'POST' });
      const data = await response.json();
      addLog(data.message, data.success ? 'success' : 'error');
    } catch (err) {
      addLog(`Error launching login browser: ${err.message}`, 'error');
    }
  };

  const startCampaign = async () => {
    if (recipients.length === 0) {
      alert('No profile recipients loaded.');
      return;
    }

    setCampaignStatus('SENDING');
    isSendingRef.current = true;
    addLog(`🚀 Campaign started for ${recipients.length} LinkedIn targets. Delay: ${minDelay}s–${maxDelay}s. Daily cap: ${dailyCap}.`, 'info');

    let startIndex = recipients.findIndex(r => r.Status !== 'Sent');
    if (startIndex === -1) startIndex = 0;

    runDispatchLoop(startIndex);
  };

  const pauseCampaign = () => {
    setCampaignStatus('PAUSED');
    isSendingRef.current = false;
    addLog('⏸️ Campaign paused.', 'warning');
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

  const runDispatchLoop = async (index) => {
    const sentCountSoFar = recipients.filter(r => r.Status === 'Sent').length;
    
    if (sentCountSoFar >= dailyCap) {
      setCampaignStatus('STOPPED');
      isSendingRef.current = false;
      addLog(`🛑 Reached daily invitation limit cap (${dailyCap} requests). Stopping for account safety.`, 'warning');
      return;
    }

    if (index >= recipients.length) {
      setCampaignStatus('COMPLETED');
      isSendingRef.current = false;
      addLog('🎉 Campaign dispatch completed!', 'success');
      return;
    }

    if (!isSendingRef.current) return;

    setCurrentIndex(index);
    const item = recipients[index];

    if (item.Status === 'Sent') {
      runDispatchLoop(index + 1);
      return;
    }

    addLog(`[${index + 1}/${recipients.length}] Playwright navigating to ${item.Name} (${item.LinkedInUrl})...`, 'info');

    const noteText = renderTemplate(template.body, item);

    try {
      const response = await fetch('/api/send-connect-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl: item.LinkedInUrl,
          noteText,
          recipientName: item.Name
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecipients(prev => prev.map((r, i) => i === index ? {
          ...r,
          Status: 'Sent',
          SentAt: new Date().toLocaleTimeString(),
          Error: null
        } : r));

        addLog(`✓ ${data.message}`, 'success');
      } else {
        setRecipients(prev => prev.map((r, i) => i === index ? {
          ...r,
          Status: 'Failed',
          Error: data.message || 'Send error'
        } : r));

        addLog(`✕ Failed for ${item.Name}: ${data.message}`, 'error');
      }

    } catch (err) {
      setRecipients(prev => prev.map((r, i) => i === index ? {
        ...r,
        Status: 'Failed',
        Error: err.message || 'Network error'
      } : r));

      addLog(`✕ Exception for ${item.Name}: ${err.message}`, 'error');
    }

    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    if (isSendingRef.current && index + 1 < recipients.length) {
      addLog(`⏳ Anti-bot human safety pause: ${randomDelay}s before next profile...`, 'dim');
      setTimeout(() => {
        if (isSendingRef.current) {
          runDispatchLoop(index + 1);
        }
      }, randomDelay * 1000);
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
    link.setAttribute('download', `LinkedIn_Campaign_Report_${new Date().toISOString().slice(0,10)}.csv`);
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
              <span className="badge-enterprise badge-enterprise-white">Playwright Engine</span>
              <span className="badge-enterprise">Rate Limiting</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              LinkedIn Automation Control & Anti-Bot Suite
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Automating connection requests for <strong>{recipients.length}</strong> target profiles safely.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleLaunchLoginBrowser} className="btn-enterprise btn-enterprise-secondary">
              <Globe size={15} /> 1-Click Login Browser
            </button>

            {campaignStatus === 'IDLE' && (
              <button onClick={startCampaign} className="btn-enterprise btn-enterprise-primary">
                <Play size={15} /> Start Automation
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

            <button onClick={exportReportCSV} className="btn-enterprise btn-enterprise-secondary">
              <Download size={14} /> Export Log CSV
            </button>
          </div>
        </div>

        {/* Throttling & Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          
          <div className="glass-enterprise-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#ffffff' }}>
                Human Delay Range: {minDelay}s–{maxDelay}s
              </label>
              <span className="badge-enterprise">Anti-CAPTCHA</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Randomized delay between connection requests to simulate real browsing.
            </span>
          </div>

          <div className="glass-enterprise-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#ffffff' }}>
                Daily Request Cap: {dailyCap} invites/day
              </label>
              <span className="badge-enterprise">Account Protection</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Keeps activity well within LinkedIn's safe threshold (~100–150/week).
            </span>
          </div>

        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
            <span style={{ fontWeight: '600', color: '#ffffff' }}>
              Campaign Progress: {sentCount} / {recipients.length} Requests Sent ({progressPercent}%)
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

      {/* Terminal Console */}
      <div className="glass-enterprise-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
            <Terminal size={16} color="#ffffff" /> Playwright Stream Log
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
            <span style={{ color: 'var(--text-dim)' }}>Click "1-Click Login Browser" to authenticate, then "Start Automation" to begin streaming logs...</span>
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
