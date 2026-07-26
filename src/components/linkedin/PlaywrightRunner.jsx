import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RefreshCw, Download, Terminal, Zap, Gauge, CheckCircle2, AlertCircle } from 'lucide-react';
import { renderTemplate } from '../../utils/templateEngine';
import { sendDirectConnectionInvitation } from '../../services/linkedinDirectService';
import Papa from 'papaparse';
import Button from '../ui/Button';

export default function PlaywrightRunner({ recipients, setRecipients, template, connectedProfile }) {
  const [minDelay, setMinDelay] = useState(3); // 3s min delay for direct REST API
  const [maxDelay, setMaxDelay] = useState(8);  // 8s max delay for direct REST API
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

  const startCampaign = async () => {
    if (!connectedProfile) {
      alert('Please connect your LinkedIn account directly in the section above first.');
      return;
    }

    if (recipients.length === 0) {
      alert('No profile recipients loaded.');
      return;
    }

    setCampaignStatus('SENDING');
    isSendingRef.current = true;
    addLog(`🚀 Direct REST API Campaign started for ${recipients.length} targets (Connected as ${connectedProfile.name}).`, 'info');

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

    addLog(`[${index + 1}/${recipients.length}] Direct REST API sending invitation to ${item.Name} (${item.LinkedInUrl})...`, 'info');

    const noteText = renderTemplate(template.body, item);

    try {
      const data = await sendDirectConnectionInvitation({
        profileUrl: item.LinkedInUrl,
        noteText,
        recipientName: item.Name
      });

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
      addLog(`⏳ Human delay throttle: ${randomDelay}s before next request...`, 'dim');
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
    link.setAttribute('download', `LinkedIn_Direct_Report_${new Date().toISOString().slice(0,10)}.csv`);
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
              <span className="badge-enterprise badge-enterprise-white">Direct REST Engine</span>
              <span className="badge-enterprise">Zero Playwright Overhead</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              Direct LinkedIn Connection Dispatcher
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Automating connection requests directly over secure HTTPS REST endpoints.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {campaignStatus === 'IDLE' && (
              <Button onClick={startCampaign} variant="primary" icon={Play}>
                Start Direct Automation
              </Button>
            )}

            {campaignStatus === 'SENDING' && (
              <>
                <Button onClick={pauseCampaign} variant="secondary" icon={Pause}>
                  Pause
                </Button>
                <Button onClick={stopCampaign} variant="danger" icon={Square}>
                  Stop
                </Button>
              </>
            )}

            {campaignStatus === 'PAUSED' && (
              <>
                <Button onClick={resumeCampaign} variant="primary" icon={Play}>
                  Resume Campaign
                </Button>
                <Button onClick={stopCampaign} variant="danger" icon={Square}>
                  Stop
                </Button>
              </>
            )}

            {(campaignStatus === 'COMPLETED' || campaignStatus === 'STOPPED') && (
              <Button onClick={startCampaign} variant="primary" icon={RefreshCw}>
                Restart Campaign
              </Button>
            )}

            <Button onClick={exportReportCSV} variant="secondary" icon={Download}>
              Export Log CSV
            </Button>
          </div>
        </div>

        {/* Safety Settings Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div className="glass-enterprise-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#ffffff' }}>
                REST Delay Range: {minDelay}s–{maxDelay}s
              </label>
              <span className="badge-enterprise">Instant REST</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Direct API response without browser rendering delays.
            </span>
          </div>

          <div className="glass-enterprise-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#ffffff' }}>
                Daily Request Cap: {dailyCap} invites/day
              </label>
              <span className="badge-enterprise">Account Safe</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Keeps invitations well within LinkedIn's limits (~100–150/week).
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

      {/* Terminal Log Console */}
      <div className="glass-enterprise-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
            <Terminal size={16} color="#ffffff" /> Direct REST Execution Log
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
            <span style={{ color: 'var(--text-dim)' }}>Connect account above, then click "Start Direct Automation" to dispatch over direct REST API...</span>
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
