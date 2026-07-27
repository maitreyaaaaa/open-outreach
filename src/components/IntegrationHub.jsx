import React, { useState } from 'react';
import { Layers, ExternalLink, ShieldCheck, Key, CheckCircle, Zap, Globe, Cpu, Server, MessageSquare, Mail, Linkedin, Github } from 'lucide-react';
import Button from './ui/Button';

export default function IntegrationHub() {
  const [composioApiKey, setComposioApiKey] = useState(() => {
    try {
      return sessionStorage.getItem('composio_api_key') || '';
    } catch (e) {
      return '';
    }
  });

  const [savedStatus, setSavedStatus] = useState(null);

  const handleSaveComposioKey = (e) => {
    e.preventDefault();
    try {
      sessionStorage.setItem('composio_api_key', composioApiKey.trim());
      setSavedStatus({ success: true, message: 'Composio API Key connected in ephemeral browser memory!' });
    } catch (err) {
      setSavedStatus({ success: false, message: 'Failed to save Composio key.' });
    }
  };

  return (
    <div className="container-enterprise">
      
      {/* Header Banner */}
      <div className="glass-enterprise-panel" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#ffffff', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers color="#080a0f" size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>
                  Integration Hub & Composio Bridge
                </h2>
                <span className="badge-enterprise badge-enterprise-white">1000+ App Connectors</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Connect OpenOutreach to Composio, Activepieces, n8n, Nango, and direct SaaS APIs over secure HTTPS.
              </p>
            </div>
          </div>

          <a
            href="https://composio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-enterprise btn-enterprise-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Launch Composio Platform <ExternalLink size={15} />
          </a>
        </div>

        {/* Info Card */}
        <div className="glass-enterprise-card" style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe size={20} color="#60a5fa" />
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.5' }}>
              <strong>Composio (`composio.dev`)</strong> enables AI agents to connect to 1,000+ SaaS apps including Gmail, LinkedIn, WhatsApp, GitHub, HubSpot, Notion, and Slack with managed OAuth 2.0 and MCP support.
            </span>
          </div>
        </div>
      </div>

      {/* Composio API Key Configuration Card */}
      <div className="glass-enterprise-panel" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Key size={20} color="#ffffff" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
            Composio API Gateway Credentials (`composio.dev`)
          </h3>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Enter your Composio API Key (`ak_...`) from your Composio Dashboard to enable direct agentic tool dispatches over HTTPS.
        </p>

        <form onSubmit={handleSaveComposioKey} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="password"
            className="input-enterprise"
            style={{ flex: 1, minWidth: '280px', fontFamily: 'monospace' }}
            placeholder="Enter Composio API Key (ak_...)"
            value={composioApiKey}
            onChange={e => setComposioApiKey(e.target.value)}
          />
          <button type="submit" className="btn-enterprise btn-enterprise-primary">
            Save Composio Credentials
          </button>
        </form>

        {savedStatus && (
          <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} color="#4ade80" />
            {savedStatus.message}
          </div>
        )}
      </div>

      {/* Grid of Integration Options */}
      <div className="grid-enterprise grid-enterprise-3" style={{ marginBottom: '28px' }}>
        
        {/* Card 1: Composio Managed Gateway */}
        <div className="glass-enterprise-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ background: '#ffffff', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={20} color="#080a0f" />
              </div>
              <span className="badge-enterprise badge-enterprise-white">Managed SaaS</span>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
              Composio AI Gateway
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              Managed authentication and tool-calling layer for Gmail, LinkedIn, WhatsApp MCP server, and 1,000+ SaaS apps.
            </p>

            <ul style={{ fontSize: '0.78rem', color: '#e2e8f0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              <li>Managed OAuth 2.0 & Refresh Tokens</li>
              <li>WhatsApp Managed MCP Gateway</li>
              <li>LangChain & AutoGen SDK Compatibility</li>
            </ul>
          </div>

          <a
            href="https://composio.dev/tools"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-enterprise btn-enterprise-secondary"
            style={{ textDecoration: 'none', justifyContent: 'center', width: '100%' }}
          >
            Explore Composio Tool Catalog <ExternalLink size={14} />
          </a>
        </div>

        {/* Card 2: Activepieces (MIT Open-Source) */}
        <div className="glass-enterprise-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ background: '#ffffff', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Server size={20} color="#080a0f" />
              </div>
              <span className="badge-enterprise" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>MIT Open-Source</span>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
              Activepieces Open-Source
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              Self-hostable open-source automation alternative to Zapier/Make. Deploy on Docker or Railway for zero-cost workflows.
            </p>

            <ul style={{ fontSize: '0.78rem', color: '#e2e8f0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              <li>100% Free & Self-Hostable</li>
              <li>TypeScript Extensible Pieces</li>
              <li>Visual Workflow Automation Builder</li>
            </ul>
          </div>

          <a
            href="https://github.com/activepieces/activepieces"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-enterprise btn-enterprise-secondary"
            style={{ textDecoration: 'none', justifyContent: 'center', width: '100%' }}
          >
            View Activepieces GitHub Repository <ExternalLink size={14} />
          </a>
        </div>

        {/* Card 3: n8n Workflow Orchestration */}
        <div className="glass-enterprise-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ background: '#ffffff', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} color="#080a0f" />
              </div>
              <span className="badge-enterprise">Fair-Code Self-Hosted</span>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
              n8n Workflow Engine
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              Leading open-source workflow orchestration engine featuring native LLM agent nodes and multi-channel webhooks.
            </p>

            <ul style={{ fontSize: '0.78rem', color: '#e2e8f0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              <li>Native AI & LangChain Agent Nodes</li>
              <li>Self-Host via Docker Container</li>
              <li>400+ Pre-built Node Integrations</li>
            </ul>
          </div>

          <a
            href="https://github.com/n8n-io/n8n"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-enterprise btn-enterprise-secondary"
            style={{ textDecoration: 'none', justifyContent: 'center', width: '100%' }}
          >
            View n8n GitHub Repository <ExternalLink size={14} />
          </a>
        </div>

      </div>

      {/* Direct API Channels Overview */}
      <div className="glass-enterprise-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
          Supported Outreach Protocol Gateways
        </h3>

        <div className="grid-enterprise grid-enterprise-3">
          <div className="glass-enterprise-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Mail size={20} color="#ffffff" />
              <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>Gmail Outreach Protocol</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Connect via Gmail API OAuth 2.0 (`gmail.googleapis.com`) or SMTP Transporter (`smtp.gmail.com`).
            </p>
          </div>

          <div className="glass-enterprise-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Linkedin size={20} color="#ffffff" />
              <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>LinkedIn Voyager Protocol</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Connect via Direct HTTPS Voyager REST API or Composio LinkedIn Actions for zero-persistence dispatches.
            </p>
          </div>

          <div className="glass-enterprise-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <MessageSquare size={20} color="#ffffff" />
              <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>WhatsApp Cloud Protocol</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Connect via Official Meta WhatsApp Business Cloud API (`graph.facebook.com`) or Composio WhatsApp Gateway.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
