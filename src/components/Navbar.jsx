import React from 'react';
import { LayoutDashboard, Mail, Linkedin, MessageSquare, Layers, ShieldCheck, Terminal } from 'lucide-react';

export default function Navbar({ activeModule, setActiveModule, emailCount, linkedinCount, isSmtpConnected, smtpUser, onOpenDiagnostics }) {
  const modules = [
    { id: 'overview', label: 'Overview Hub', icon: LayoutDashboard },
    { id: 'email', label: 'Email Outreach', icon: Mail, badge: emailCount },
    { id: 'linkedin', label: 'LinkedIn Outreach', icon: Linkedin, badge: linkedinCount },
    { id: 'whatsapp', label: 'WhatsApp Outreach', icon: MessageSquare },
    { id: 'integrations', label: 'Integration Hub', icon: Layers }
  ];

  return (
    <div style={{ padding: '20px 32px 0', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
      <header className="glass-enterprise-panel" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#ffffff', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(255, 255, 255, 0.15)' }}>
            <LayoutDashboard color="#080a0f" size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em' }}>
                Enterprise Outreach SaaS
              </h1>
              <span className="badge-enterprise badge-enterprise-white">Composio Bridge Active</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Multi-Channel Outreach Engine (Gmail, LinkedIn, WhatsApp & Composio)
            </p>
          </div>
        </div>

        {/* Unified Mode Switcher Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(8, 10, 15, 0.6)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className="btn-enterprise"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#080a0f' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500'
                }}
              >
                <Icon size={14} color={isActive ? '#080a0f' : 'var(--text-muted)'} />
                <span>{mod.label}</span>
                {mod.badge !== undefined && (
                  <span
                    className="badge-enterprise"
                    style={{
                      background: isActive ? '#080a0f' : 'rgba(255,255,255,0.08)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      padding: '1px 6px',
                      fontSize: '0.68rem',
                      marginLeft: '4px'
                    }}
                  >
                    {mod.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenDiagnostics}
            className="btn-enterprise btn-enterprise-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Terminal size={14} /> System Audit Logs
          </button>
          
          <span className="badge-enterprise badge-enterprise-white" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <ShieldCheck size={14} color="#080a0f" /> Zero-Persistence Security
          </span>
        </div>

      </header>
    </div>
  );
}
