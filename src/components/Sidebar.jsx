import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Linkedin, 
  MessageSquare, 
  Layers, 
  Puzzle, 
  Terminal, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeft, 
  Zap, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  activeModule,
  setActiveModule,
  emailCount = 0,
  linkedinCount = 0,
  isCollapsed,
  setIsCollapsed,
  onOpenDiagnostics
}) {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [pluginsOpen, setPluginsOpen] = useState(true);

  const mainNavItems = [
    { id: 'overview', label: 'Overview Hub', icon: LayoutDashboard }
  ];

  const channelItems = [
    { id: 'email', label: 'Email Outreach', icon: Mail, badge: emailCount },
    { id: 'linkedin', label: 'LinkedIn Outreach', icon: Linkedin, badge: linkedinCount },
    { id: 'whatsapp', label: 'WhatsApp Outreach', icon: MessageSquare }
  ];

  const pluginItems = [
    { id: 'plugins', label: 'Plugin Space (Composio)', icon: Puzzle, badge: 'NEW' },
    { id: 'integrations', label: 'Integration Hub', icon: Layers }
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '260px',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: '#080a0f',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* Brand & Collapse Header */}
      <div
        style={{
          padding: isCollapsed ? '20px 14px' : '20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#ffffff', width: '32px', height: '32px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#080a0f" />
            </div>
            <div>
              <h1 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
                Antigravity Outreach
              </h1>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Codex Engine v2.5</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn-enterprise"
          style={{ padding: '6px', borderRadius: '6px', background: 'transparent', color: 'var(--text-muted)' }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation Groups Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isCollapsed ? '16px 8px' : '20px 14px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* 1. Main Hub */}
        <div>
          {!isCollapsed && (
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-dim)', letterSpacing: '0.08em', uppercase: 'true', marginBottom: '8px', paddingLeft: '8px' }}>
              MAIN WORKSPACE
            </div>
          )}
          {mainNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: isCollapsed ? '10px' : '9px 12px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: '6px',
                  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '0.86rem',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive && !isCollapsed ? '3px solid #ffffff' : '3px solid transparent'
                }}
              >
                <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* 2. Outreach Channels Dropdown Group */}
        <div>
          {!isCollapsed && (
            <div
              onClick={() => setChannelsOpen(!channelsOpen)}
              style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                color: 'var(--text-dim)',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                paddingLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                cursor: 'pointer'
              }}
            >
              <span>OUTREACH CHANNELS</span>
              {channelsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </div>
          )}

          {(channelsOpen || isCollapsed) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {channelItems.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isCollapsed ? '10px' : '8px 12px',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      borderRadius: '6px',
                      background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: isActive ? '600' : '400',
                      fontSize: '0.84rem',
                      transition: 'all 0.15s ease',
                      borderLeft: isActive && !isCollapsed ? '3px solid #ffffff' : '3px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className="badge-enterprise"
                        style={{
                          padding: '1px 6px',
                          fontSize: '0.66rem',
                          background: 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Plugins & Integration Dropdown Group */}
        <div>
          {!isCollapsed && (
            <div
              onClick={() => setPluginsOpen(!pluginsOpen)}
              style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                color: 'var(--text-dim)',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                paddingLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                cursor: 'pointer'
              }}
            >
              <span>PLUGINS & INTEGRATIONS</span>
              {pluginsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </div>
          )}

          {(pluginsOpen || isCollapsed) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {pluginItems.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isCollapsed ? '10px' : '8px 12px',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      borderRadius: '6px',
                      background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: isActive ? '600' : '400',
                      fontSize: '0.84rem',
                      transition: 'all 0.15s ease',
                      borderLeft: isActive && !isCollapsed ? '3px solid #ffffff' : '3px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className="badge-enterprise"
                        style={{
                          padding: '1px 6px',
                          fontSize: '0.66rem',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Footer System Status Card */}
      <div style={{ padding: isCollapsed ? '12px 8px' : '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <button
          onClick={onOpenDiagnostics}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: isCollapsed ? '8px' : '8px 12px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-muted)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            fontSize: '0.78rem'
          }}
          title="Open System Audit Logs"
        >
          <Terminal size={15} color="#ffffff" />
          {!isCollapsed && <span>System Audit Logs</span>}
        </button>

        {!isCollapsed && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-dim)', paddingLeft: '4px' }}>
            <ShieldCheck size={13} color="#4ade80" />
            <span>Zero-Persistence RAM Security</span>
          </div>
        )}
      </div>

    </aside>
  );
}
