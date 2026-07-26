import React, { useEffect } from 'react';
import { Mail, Linkedin, Users, ShieldCheck } from 'lucide-react';
import { animateCardStagger } from '../utils/animationEngine';

export default function OverviewHub({ emailRecipients, linkedinRecipients, onNavigate }) {
  useEffect(() => {
    animateCardStagger('.glass-enterprise-card, .glass-enterprise-panel');
  }, []);

  const emailSent = emailRecipients.filter(r => r.Status === 'Sent').length;
  const emailPending = emailRecipients.filter(r => r.Status === 'Pending').length;

  const linkedinSent = linkedinRecipients.filter(r => r.Status === 'Sent').length;
  const linkedinPending = linkedinRecipients.filter(r => r.Status === 'Pending').length;

  const totalAudience = emailRecipients.length + linkedinRecipients.length;

  return (
    <div className="container-enterprise">
      
      {/* Top Banner Hero Card */}
      <div className="glass-enterprise-panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">Unified Analytics</span>
              <span className="badge-enterprise">Dual Channel Platform</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Enterprise Outreach Overview
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '600px', lineHeight: '1.6' }}>
              Manage multi-channel outreach campaigns across <strong>Email Companies</strong> and <strong>LinkedIn Profiles</strong> from a single glass dashboard.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('email')} className="btn-enterprise btn-enterprise-primary">
              <Mail size={16} /> Manage Email Campaign &rarr;
            </button>
            <button onClick={() => onNavigate('linkedin')} className="btn-enterprise btn-enterprise-secondary">
              <Linkedin size={16} /> Manage LinkedIn Automation &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Spacious 4-Card Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-enterprise-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Total Audience</span>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '8px', borderRadius: '6px' }}>
              <Users size={18} color="#ffffff" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>{totalAudience}</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {emailRecipients.length} Email + {linkedinRecipients.length} LinkedIn Targets
          </p>
        </div>

        <div className="glass-enterprise-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Email Dispatch Status</span>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '8px', borderRadius: '6px' }}>
              <Mail size={18} color="#ffffff" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>{emailSent} / {emailRecipients.length}</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {emailPending} Pending in Queue
          </p>
        </div>

        <div className="glass-enterprise-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>LinkedIn Connect Status</span>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '8px', borderRadius: '6px' }}>
              <Linkedin size={18} color="#ffffff" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>{linkedinSent} / {linkedinRecipients.length}</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {linkedinPending} Pending Invites
          </p>
        </div>

        <div className="glass-enterprise-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Data Health Score</span>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '8px', borderRadius: '6px' }}>
              <ShieldCheck size={18} color="#ffffff" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>100%</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Syntax Verified & Anti-Bot Protected
          </p>
        </div>

      </div>

      {/* Dual Channel Quick Launch Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
        
        {/* Email Engine Summary Card */}
        <div className="glass-enterprise-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#ffffff', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail color="#080a0f" size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>Company Email Engine</h3>
            </div>
            <span className="badge-enterprise badge-enterprise-white">Nodemailer SMTP</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
            Personalized 1-on-1 company email outreach. Features zero-password-persistence SMTP security, deliverability keyword audit, 1-by-1 email preview carousel, and anti-spam throttling.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Queue: <strong>{emailPending}</strong> Pending | <strong>{emailSent}</strong> Sent
            </span>
            <button onClick={() => onNavigate('email')} className="btn-enterprise btn-enterprise-primary">
              Open Email Module &rarr;
            </button>
          </div>
        </div>

        {/* LinkedIn Engine Summary Card */}
        <div className="glass-enterprise-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#ffffff', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Linkedin color="#080a0f" size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>LinkedIn Connect Engine</h3>
            </div>
            <span className="badge-enterprise">Playwright Automation</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
            Automated connection requests with personalized notes under LinkedIn's strict 300-character limit. Features Playwright browser automation, 30s–90s human delay throttling, and 1-click session login.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Queue: <strong>{linkedinPending}</strong> Pending | <strong>{linkedinSent}</strong> Sent
            </span>
            <button onClick={() => onNavigate('linkedin')} className="btn-enterprise btn-enterprise-primary">
              Open LinkedIn Module &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
