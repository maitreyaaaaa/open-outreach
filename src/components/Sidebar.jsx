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
  Lock, 
  Unlock, 
  User, 
  Plus,
  Sparkles
} from 'lucide-react';
import { getTenantList, getActiveTenantId, setActiveTenantId, createNewTenant } from '../services/tenantSecurityService';

export default function Sidebar({
  activeModule,
  setActiveModule,
  emailCount = 0,
  linkedinCount = 0,
  isCollapsed,
  setIsCollapsed,
  onOpenDiagnostics,
  onOpenVaultModal,
  isVaultUnlocked,
  activeTenantId,
  setActiveTenantIdState
}) {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [pluginsOpen, setPluginsOpen] = useState(true);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  const tenantList = getTenantList();
  const currentTenant = tenantList.find(t => t.id === activeTenantId) || tenantList[0];

  const handleSelectTenant = (tenantId) => {
    setActiveTenantId(tenantId);
    setActiveTenantIdState(tenantId);
    setShowTenantDropdown(false);
  };

  const handleCreateTenant = () => {
    const name = window.prompt('Enter new Tenant / Organization Workspace name:');
    if (name) {
      const created = createNewTenant(name);
      if (created) {
        handleSelectTenant(created.id);
      }
    }
  };

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
          padding: isCollapsed ? '20px 14px' : '18px 16px',
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
                Antigravity SaaS
              </h1>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>AES-256 Multi-Tenant</span>
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

      {/* Tenant Switcher Widget */}
      {!isCollapsed && (
        <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative' }}>
          <button
            onClick={() => setShowTenantDropdown(!showTenantDropdown)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <User size={14} color="#60a5fa" />
              <span style={{ fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentTenant.name}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showTenantDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: '14px', right: '14px', background: '#080a0f', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '6px', padding: '6px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.8)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-dim)', padding: '4px 8px' }}>
                ACTIVE TENANT VAULT
              </div>
              {tenantList.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTenant(t.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px',
                    fontSize: '0.78rem',
                    background: t.id === activeTenantId ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: t.id === activeTenantId ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between'
                  }}
                >
                  <span>{t.name}</span>
                  <span style={{ fontSize: '0.66rem', opacity: 0.6 }}>{t.role}</span>
                </button>
              ))}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '4px', paddingTop: '4px' }}>
                <button
                  onClick={handleCreateTenant}
                  style={{ width: '100%', textAlign: 'left', padding: '6px 8px', fontSize: '0.76rem', background: 'transparent', color: '#60a5fa', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={13} /> Create New Tenant Vault
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Groups Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isCollapsed ? '16px 8px' : '16px 14px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. Main Hub */}
        <div>
          {!isCollapsed && (
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '8px' }}>
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
                justifyContent: 'space-between',
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
      <div style={{ padding: isCollapsed ? '12px 8px' : '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Master Vault Button */}
        <button
          onClick={onOpenVaultModal}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: isCollapsed ? '8px' : '8px 12px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            borderRadius: '6px',
            background: isVaultUnlocked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isVaultUnlocked ? '#4ade80' : '#f87171',
            border: isVaultUnlocked ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: '600'
          }}
          title={isVaultUnlocked ? 'Vault Unlocked' : 'Vault Locked'}
        >
          {isVaultUnlocked ? <Unlock size={15} color="#4ade80" /> : <Lock size={15} color="#f87171" />}
          {!isCollapsed && <span>{isVaultUnlocked ? 'AES-256 Vault Unlocked' : 'Unlock AES-256 Vault'}</span>}
        </button>

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

      </div>

    </aside>
  );
}
