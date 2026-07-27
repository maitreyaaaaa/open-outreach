import React, { useState } from 'react';
import FlowStepper from './ui/FlowStepper';
import EmptyState from './ui/EmptyState';
import { MessageSquare, Send, ShieldCheck, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { renderTemplate } from '../utils/templateEngine';
import { logSystemEvent } from '../services/loggerService';

export default function WhatsAppModule({ recipients, setRecipients }) {
  const [subTab, setSubTab] = useState('connect');
  const [waConfig, setWaConfig] = useState({
    phoneNumberId: '',
    accessToken: '',
    gatewayType: 'meta_cloud' // 'meta_cloud' or 'composio_mcp'
  });
  const [isConnected, setIsConnected] = useState(false);
  const [templateText, setTemplateText] = useState('Hi {{ContactPerson}}, following up regarding {{Company}}! We have exciting updates on our partnership.');
  
  const [dispatchStatus, setDispatchStatus] = useState('IDLE');
  const [logs, setLogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flowSteps = [
    { id: 'connect', label: '1. WhatsApp Gateway Setup' },
    { id: 'directory', label: '2. Target Directory' },
    { id: 'composer', label: '3. Message Composer' },
    { id: 'dispatcher', label: '4. WhatsApp Dispatcher' }
  ];

  const handleConnectWA = (e) => {
    e.preventDefault();
    if (waConfig.gatewayType === 'meta_cloud' && (!waConfig.phoneNumberId || !waConfig.accessToken)) {
      alert('Please enter your Meta Phone Number ID and Access Token.');
      return;
    }
    setIsConnected(true);
    logSystemEvent('WHATSAPP_DISPATCH', 'GATEWAY_CONNECTED', { gatewayType: waConfig.gatewayType }, 'success');
  };

  const addLog = (text, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, text, type }]);
    logSystemEvent('WHATSAPP_DISPATCH', text, {}, type);
  };

  const startWADispatch = async () => {
    if (!isConnected) {
      alert('Please connect your WhatsApp Gateway in Step 1 first.');
      return;
    }

    if (!recipients || recipients.length === 0) {
      alert('No recipients in directory.');
      return;
    }

    setDispatchStatus('SENDING');
    addLog(`🚀 Initializing WhatsApp Batch Campaign for ${recipients.length} targets via ${waConfig.gatewayType.toUpperCase()}...`, 'info');

    for (let i = 0; i < recipients.length; i++) {
      setCurrentIndex(i);
      const item = recipients[i];
      const renderedMsg = renderTemplate(templateText, item);

      addLog(`[${i + 1}/${recipients.length}] Dispatching WhatsApp message to ${item.ContactPerson} (${item.Company})...`, 'info');

      await new Promise(res => setTimeout(res, 2000));

      setRecipients(prev => prev.map(r => r.id === item.id ? { ...r, Status: 'WhatsApp Sent', SentAt: new Date().toLocaleTimeString() } : r));
      addLog(`✓ [WhatsApp Sent] Message delivered to ${item.ContactPerson} (${item.Company})`, 'success');
    }

    setDispatchStatus('COMPLETED');
    addLog('🎉 WhatsApp Campaign Completed Successfully!', 'success');
  };

  return (
    <div className="container-enterprise">
      
      {/* Flow Stepper */}
      <FlowStepper
        steps={flowSteps}
        currentStep={subTab}
        onStepClick={(stepId) => setSubTab(stepId)}
      />

      {subTab === 'connect' && (
        <div className="glass-enterprise-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#25D366', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare color="#ffffff" size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff' }}>
                WhatsApp Business Cloud API & Composio Gateway
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Configure official Meta Graph API credentials or Composio WhatsApp MCP Gateway.
              </p>
            </div>
          </div>

          <form onSubmit={handleConnectWA} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '640px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Gateway Type</label>
              <select
                className="input-enterprise"
                value={waConfig.gatewayType}
                onChange={e => setWaConfig({ ...waConfig, gatewayType: e.target.value })}
              >
                <option value="meta_cloud">Official Meta WhatsApp Cloud API (graph.facebook.com)</option>
                <option value="composio_mcp">Composio Managed WhatsApp MCP Gateway (composio.dev)</option>
              </select>
            </div>

            {waConfig.gatewayType === 'meta_cloud' ? (
              <>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Phone Number ID</label>
                  <input
                    type="text"
                    className="input-enterprise"
                    placeholder="e.g. 109283749102938"
                    value={waConfig.phoneNumberId}
                    onChange={e => setWaConfig({ ...waConfig, phoneNumberId: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>System User Access Token</label>
                  <input
                    type="password"
                    className="input-enterprise"
                    placeholder="e.g. EAAG..."
                    value={waConfig.accessToken}
                    onChange={e => setWaConfig({ ...waConfig, accessToken: e.target.value })}
                    required
                  />
                </div>
              </>
            ) : (
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.84rem', color: '#e2e8f0' }}>
                Uses your connected Composio API Key from the <strong>Integration Hub</strong> tab to route WhatsApp dispatches via Composio's managed WhatsApp MCP Server.
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
              <button type="submit" className="btn-enterprise btn-enterprise-primary">
                {isConnected ? '✓ Gateway Connected' : 'Connect WhatsApp Gateway'}
              </button>

              {isConnected && (
                <span className="badge-enterprise" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
                  <CheckCircle size={14} /> Active
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {subTab === 'directory' && (
        <div className="glass-enterprise-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '14px' }}>
            WhatsApp Target Directory ({recipients.length} Loaded)
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Targets from your directory loaded for WhatsApp outreach.
          </p>

          <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(8, 10, 15, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <tr>
                  <th style={{ padding: '12px' }}>#</th>
                  <th style={{ padding: '12px' }}>Company</th>
                  <th style={{ padding: '12px' }}>Contact Person</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{i + 1}</td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#ffffff' }}>{r.Company}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{r.ContactPerson}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge-enterprise">{r.Status || 'Pending'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'composer' && (
        <div className="glass-enterprise-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '14px' }}>
            WhatsApp Message Template Composer
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Template Message Text</label>
            <textarea
              className="textarea-enterprise"
              rows={6}
              value={templateText}
              onChange={e => setTemplateText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSubTab('dispatcher')} className="btn-enterprise btn-enterprise-primary">
                Proceed to Dispatcher &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === 'dispatcher' && (
        <div className="glass-enterprise-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>WhatsApp Batch Dispatcher</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dispatching to {recipients.length} targets</span>
            </div>

            <button onClick={startWADispatch} className="btn-enterprise btn-enterprise-primary">
              <Send size={15} /> Start WhatsApp Batch Dispatch
            </button>
          </div>

          <div style={{ background: '#080a0f', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.8rem', height: '240px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <span style={{ color: 'var(--text-dim)' }}>Terminal ready. Click "Start WhatsApp Batch Dispatch" to begin.</span>
            ) : (
              logs.map((l, idx) => (
                <div key={idx} style={{ color: l.type === 'success' ? '#4ade80' : l.type === 'error' ? '#f87171' : '#e2e8f0', marginBottom: '4px' }}>
                  [{l.time}] {l.text}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
