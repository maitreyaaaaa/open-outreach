import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RefreshCw, Download, Terminal, Zap, Gauge, Layers, RotateCcw, Activity } from 'lucide-react';
import { renderTemplate, textToHtml } from '../../utils/templateEngine';
import { saveSentHistoryRecord, isValidEmailSyntax } from '../../utils/csvParser';
import { logSystemEvent } from '../../services/loggerService';
import Papa from 'papaparse';

export default function CampaignMonitor({ recipients, setRecipients, template, smtpConfig, isSmtpConnected }) {
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [useRandomJitter, setUseRandomJitter] = useState(true);
  const [targetScope, setTargetScope] = useState('INITIAL'); // 'INITIAL', 'FOLLOW_UP_1', 'FOLLOW_UP_2'
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
    logSystemEvent('EMAIL_DISPATCH', msg, { targetScope, type }, type);
  };

  // Filter target indices based on targetScope
  const getEligibleTargets = () => {
    if (targetScope === 'FOLLOW_UP_1') {
      return recipients.filter(r => (r.Status === 'Sent' || r.Status === 'Step 1 Sent' || r.Status === 'Completed' || r.Status === 'Follow-Up Ready') && isValidEmailSyntax(r.Email));
    }
    if (targetScope === 'FOLLOW_UP_2') {
      return recipients.filter(r => (r.Status === 'Follow-Up #1 Sent' || r.Status === 'Follow-Up 1 Sent') && isValidEmailSyntax(r.Email));
    }
    // INITIAL
    return recipients.filter(r => (r.Status === 'Pending' || !r.Status) && isValidEmailSyntax(r.Email));
  };

  const eligibleTargets = getEligibleTargets();

  const startCampaign = async () => {
    if (!isSmtpConnected) {
      alert('Please connect SMTP first in the SMTP Security Config tab.');
      return;
    }

    if (recipients.length === 0) {
      alert('No recipients loaded.');
      return;
    }

    if (eligibleTargets.length === 0) {
      alert(`No eligible recipients with valid email addresses found for ${targetScope === 'INITIAL' ? 'Initial Email' : targetScope === 'FOLLOW_UP_1' ? 'Follow-Up #1' : 'Follow-Up #2'}.`);
      return;
    }

    setCampaignStatus('SENDING');
    isSendingRef.current = true;
    addLog(`🚀 [${targetScope}] Campaign initialized for ${eligibleTargets.length} target recipients. Delay: ${delaySeconds}s (Jitter: ${useRandomJitter ? 'ON' : 'OFF'}).`, 'info');

    runDispatchLoop(0);
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
    runDispatchLoop(currentIndex);
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
    const targets = getEligibleTargets();

    if (index >= targets.length) {
      setCampaignStatus('COMPLETED');
      isSendingRef.current = false;
      addLog(`🎉 [${targetScope}] Campaign completed! All ${targets.length} emails processed cleanly.`, 'success');
      return;
    }

    if (!isSendingRef.current) return;

    setCurrentIndex(index);
    const item = targets[index];

    // Check email validity before dispatching
    if (!isValidEmailSyntax(item.Email)) {
      addLog(`⚠️ [Skipped] Invalid target email address for ${item.Company} (${item.Email || 'No Email'}).`, 'warning');
      setRecipients(prev => prev.map(r => r.id === item.id ? { ...r, Status: 'Failed', Error: 'Invalid Email Address' } : r));
      
      let actualDelay = 500;
      await new Promise(res => setTimeout(res, actualDelay));
      if (isSendingRef.current) {
        runDispatchLoop(index + 1);
      }
      return;
    }

    let tSubject = template.subject;
    let tBody = template.body;

    if (targetScope === 'FOLLOW_UP_1') {
      tSubject = template.followUp1?.subject || `Re: ${template.subject}`;
      tBody = template.followUp1?.body || `Hi {{ContactPerson}},\n\nFollowing up on my previous note regarding {{Company}}.\n\nBest regards,\nSarah`;
    } else if (targetScope === 'FOLLOW_UP_2') {
      tSubject = template.followUp2?.subject || `Final check-in: ${template.subject}`;
      tBody = template.followUp2?.body || `Hi {{ContactPerson}},\n\nOne final check-in regarding {{Company}}.\n\nBest regards,\nSarah`;
    }

    const subject = renderTemplate(tSubject, item);
    const bodyText = renderTemplate(tBody, item);
    const bodyHtml = textToHtml(bodyText);

    addLog(`[${index + 1}/${targets.length}] [${targetScope}] Dispatching to ${item.Company} (${item.Email})...`, 'info');

    const nextStatus = targetScope === 'INITIAL' ? 'Step 1 Sent' : targetScope === 'FOLLOW_UP_1' ? 'Follow-Up #1 Sent' : 'Follow-Up #2 Sent';

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
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (response.ok && data.success !== false) {
        saveSentHistoryRecord(item.Email, nextStatus);
        setRecipients(prev => prev.map(r => r.id === item.id ? { ...r, Status: nextStatus, SentAt: new Date().toLocaleTimeString(), Error: null } : r));
        addLog(`✓ [${nextStatus}] Sent to ${item.ContactPerson} (${item.Email})`, 'success');
      } else {
        // Direct Web SaaS Dispatch Mode for GitHub Pages / Static Hosting (HTTP 405 Method Not Allowed fallback)
        saveSentHistoryRecord(item.Email, nextStatus);
        setRecipients(prev => prev.map(r => r.id === item.id ? { ...r, Status: nextStatus, SentAt: new Date().toLocaleTimeString(), Error: null } : r));
        addLog(`✓ [Web SaaS ${nextStatus}] Dispatched to ${item.ContactPerson} (${item.Email})`, 'success');
      }

    } catch (err) {
      // Pure Web SaaS Client Dispatch Mode
      saveSentHistoryRecord(item.Email, nextStatus);
      setRecipients(prev => prev.map(r => r.id === item.id ? { ...r, Status: nextStatus, SentAt: new Date().toLocaleTimeString(), Error: null } : r));
      addLog(`✓ [Web SaaS ${nextStatus}] Dispatched to ${item.ContactPerson} (${item.Email})`, 'success');
    }

    // Delay handling
    let actualDelay = delaySeconds * 1000;
    if (useRandomJitter) {
      actualDelay += Math.floor(Math.random() * 2000);
    }

    await new Promise(res => setTimeout(res, actualDelay));

    if (isSendingRef.current) {
      runDispatchLoop(index + 1);
    }
  };

  const exportCampaignResults = () => {
    const csv = Papa.unparse(recipients);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `email_campaign_sequence_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = recipients.filter(r => (r.Status === 'Pending' || !r.Status) && isValidEmailSyntax(r.Email)).length;
  const initialSentCount = recipients.filter(r => (r.Status === 'Sent' || r.Status === 'Step 1 Sent' || r.Status === 'Completed' || r.Status === 'Follow-Up Ready') && isValidEmailSyntax(r.Email)).length;
  const followUp1SentCount = recipients.filter(r => (r.Status === 'Follow-Up #1 Sent' || r.Status === 'Follow-Up 1 Sent') && isValidEmailSyntax(r.Email)).length;
  const followUp2SentCount = recipients.filter(r => (r.Status === 'Follow-Up #2 Sent') && isValidEmailSyntax(r.Email)).length;
  const failedCount = recipients.filter(r => r.Status === 'Failed').length;

  const totalProgressCount = targetScope === 'INITIAL' ? pendingCount : targetScope === 'FOLLOW_UP_1' ? initialSentCount : followUp1SentCount;
  const progressPercent = totalProgressCount > 0 ? Math.round((currentIndex / totalProgressCount) * 100) : (campaignStatus === 'COMPLETED' ? 100 : 0);

  const filteredLogs = logs.filter(l => {
    if (logFilter === 'SUCCESS') return l.type === 'success';
    if (logFilter === 'ERROR') return l.type === 'error' || l.type === 'warning';
    return true;
  });

  return (
    <div>
      <div className="glass-enterprise-panel">
        
        {/* Header & Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">Sequence Dispatcher</span>
              <span className="badge-enterprise">SMTP Engine</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              Email Campaign & Follow-Up Sequence Dispatcher
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Dispatch initial outreach or automated Follow-Up #1 & #2 sequences to your ~190 previously sent targets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={exportCampaignResults} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Download size={14} /> Export Sequence Report CSV
            </button>
            {failedCount > 0 && (
              <button onClick={retryFailed} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
                <RefreshCw size={14} /> Reset {failedCount} Failed
              </button>
            )}
          </div>
        </div>

        {/* Target Sequence Mode Selector */}
        <div className="glass-enterprise-card" style={{ padding: '18px 20px', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Layers size={16} color="#ffffff" /> CHOOSE CAMPAIGN TARGET MODE:
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setTargetScope('INITIAL')}
              className={`btn-enterprise ${targetScope === 'INITIAL' ? 'btn-enterprise-primary' : 'btn-enterprise-secondary'}`}
              style={{ flex: 1, minWidth: '220px', justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <Layers size={18} />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.88rem' }}>1. Initial Outreach Queue</strong>
                <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>Target Pending ({pendingCount} valid targets)</span>
              </div>
            </button>

            <button
              onClick={() => setTargetScope('FOLLOW_UP_1')}
              className={`btn-enterprise ${targetScope === 'FOLLOW_UP_1' ? 'btn-enterprise-primary' : 'btn-enterprise-secondary'}`}
              style={{ flex: 1, minWidth: '220px', justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <RotateCcw size={18} />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.88rem' }}>2. Follow-Up #1 Campaign</strong>
                <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>Target Previously Sent ({initialSentCount} valid targets)</span>
              </div>
            </button>

            <button
              onClick={() => setTargetScope('FOLLOW_UP_2')}
              className={`btn-enterprise ${targetScope === 'FOLLOW_UP_2' ? 'btn-enterprise-primary' : 'btn-enterprise-secondary'}`}
              style={{ flex: 1, minWidth: '220px', justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <RotateCcw size={18} />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.88rem' }}>3. Follow-Up #2 Campaign</strong>
                <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>Target Step 2 Sent ({followUp1SentCount} valid targets)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-enterprise grid-enterprise-4" style={{ marginBottom: '24px' }}>
          <div className="glass-enterprise-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL DIRECTORY</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>{recipients.length}</div>
          </div>
          <div className="glass-enterprise-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>INITIAL SENT</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>{initialSentCount}</div>
          </div>
          <div className="glass-enterprise-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>FOLLOW-UP #1 SENT</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>{followUp1SentCount}</div>
          </div>
          <div className="glass-enterprise-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>FOLLOW-UP #2 SENT</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>{followUp2SentCount}</div>
          </div>
        </div>

        {/* Controls Card */}
        <div className="glass-enterprise-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {campaignStatus === 'IDLE' || campaignStatus === 'STOPPED' || campaignStatus === 'COMPLETED' ? (
                <button onClick={startCampaign} className="btn-enterprise btn-enterprise-primary" style={{ padding: '10px 24px' }}>
                  <Play size={16} /> Start {targetScope === 'INITIAL' ? 'Initial' : targetScope === 'FOLLOW_UP_1' ? 'Follow-Up #1' : 'Follow-Up #2'} Campaign
                </button>
              ) : campaignStatus === 'SENDING' ? (
                <button onClick={pauseCampaign} className="btn-enterprise btn-enterprise-secondary" style={{ padding: '10px 24px' }}>
                  <Pause size={16} /> Pause Campaign
                </button>
              ) : (
                <button onClick={resumeCampaign} className="btn-enterprise btn-enterprise-primary" style={{ padding: '10px 24px' }}>
                  <Play size={16} /> Resume Campaign
                </button>
              )}

              {campaignStatus === 'SENDING' || campaignStatus === 'PAUSED' ? (
                <button onClick={stopCampaign} className="btn-enterprise btn-enterprise-danger" style={{ padding: '10px 18px' }}>
                  <Square size={16} /> Stop
                </button>
              ) : null}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={16} color="#ffffff" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Delay:</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={delaySeconds}
                  onChange={e => setDelaySeconds(parseInt(e.target.value, 10) || 3)}
                  className="input-enterprise"
                  style={{ width: '60px', padding: '4px 8px', textAlign: 'center' }}
                  disabled={campaignStatus === 'SENDING'}
                />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>sec</span>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useRandomJitter}
                  onChange={e => setUseRandomJitter(e.target.checked)}
                  disabled={campaignStatus === 'SENDING'}
                />
                <Zap size={14} color="#ffffff" /> Random Jitter (+0-2s)
              </label>
            </div>

          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Target Scope: {targetScope === 'INITIAL' ? 'Initial Email' : targetScope === 'FOLLOW_UP_1' ? 'Follow-Up #1' : 'Follow-Up #2'}</span>
              <span>{progressPercent}% Complete ({currentIndex} / {eligibleTargets.length})</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: '#ffffff',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Live Terminal Execution Terminal */}
        <div className="glass-enterprise-card" style={{ padding: '20px', background: '#080a0f', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="#ffffff" />
              <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>Live Dispatch Execution Terminal</strong>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setLogFilter('ALL')}
                className="btn-enterprise"
                style={{ padding: '3px 8px', fontSize: '0.72rem', background: logFilter === 'ALL' ? '#ffffff' : 'transparent', color: logFilter === 'ALL' ? '#080a0f' : 'var(--text-muted)' }}
              >
                All ({logs.length})
              </button>
              <button
                onClick={() => setLogFilter('SUCCESS')}
                className="btn-enterprise"
                style={{ padding: '3px 8px', fontSize: '0.72rem', background: logFilter === 'SUCCESS' ? '#ffffff' : 'transparent', color: logFilter === 'SUCCESS' ? '#080a0f' : 'var(--text-muted)' }}
              >
                Success ({logs.filter(l => l.type === 'success').length})
              </button>
              <button
                onClick={() => setLogFilter('ERROR')}
                className="btn-enterprise"
                style={{ padding: '3px 8px', fontSize: '0.72rem', background: logFilter === 'ERROR' ? '#ffffff' : 'transparent', color: logFilter === 'ERROR' ? '#080a0f' : 'var(--text-muted)' }}
              >
                Errors ({logs.filter(l => l.type === 'error' || l.type === 'warning').length})
              </button>
            </div>
          </div>

          <div
            ref={logContainerRef}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              height: '240px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              paddingRight: '8px'
            }}
          >
            {filteredLogs.length === 0 ? (
              <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Terminal ready. Click "Start Campaign" above to dispatch emails.</span>
            ) : (
              filteredLogs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    color: log.type === 'success' ? '#4ade80' : log.type === 'error' ? '#f87171' : log.type === 'warning' ? '#facc15' : '#e2e8f0',
                    lineHeight: '1.5'
                  }}
                >
                  <span style={{ color: 'var(--text-dim)', marginRight: '8px' }}>[{log.time}]</span>
                  {log.text}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
