import React, { useState } from 'react';
import { LayoutDashboard, Mail, Linkedin, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SaaSAuthModal from './saas/SaaSAuthModal';

export default function Navbar({ activeModule, setActiveModule, emailCount, linkedinCount, isSmtpConnected, smtpUser }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Sarah Chen',
    email: 'sarah@apextech.io',
    plan: 'Enterprise Pro'
  });

  const modules = [
    { id: 'overview', label: 'Overview Hub', icon: LayoutDashboard },
    { id: 'email', label: 'Email Outreach', icon: Mail, badge: emailCount },
    { id: 'linkedin', label: 'LinkedIn Outreach', icon: Linkedin, badge: linkedinCount }
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
              <span className="badge-enterprise badge-enterprise-white">Direct REST SaaS</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Multi-Tenant Dual-Channel Engine (Email & Direct LinkedIn REST)
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
                  padding: '7px 16px',
                  fontSize: '0.84rem',
                  borderRadius: '6px',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#080a0f' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500'
                }}
              >
                <Icon size={15} color={isActive ? '#080a0f' : 'var(--text-muted)'} />
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

        {/* Account & SaaS Workspace */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowAuthModal(true)}
            className="btn-enterprise btn-enterprise-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <User size={14} /> {currentUser ? currentUser.name : 'Sign In'}
          </button>
        </div>

      </header>

      {/* SaaS Auth Modal */}
      <SaaSAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
}
