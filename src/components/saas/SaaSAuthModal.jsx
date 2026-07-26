import React, { useState } from 'react';
import { User, ShieldCheck, Check, Lock, X } from 'lucide-react';
import Button from '../ui/Button';

export default function SaaSAuthModal({ isOpen, onClose, currentUser, setCurrentUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    const name = email.split('@')[0];
    const updatedUser = {
      id: `user_${Date.now()}`,
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      plan: 'Pro Enterprise Plan',
      dailyEmailQuota: 500,
      dailyLinkedinQuota: 100,
      authenticatedAt: new Date().toLocaleTimeString()
    };

    setCurrentUser(updatedUser);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(8, 10, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-enterprise-panel" style={{ width: '440px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#ffffff', width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User color="#080a0f" size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>
                {isLogin ? 'SaaS Sign In' : 'Create Workspace Account'}
              </h3>
              <span className="badge-enterprise">Multi-Tenant Isolation</span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Work Email</label>
            <input
              type="email"
              className="input-enterprise"
              placeholder="sarah@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Password</label>
            <input
              type="password"
              className="input-enterprise"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', padding: '10px' }}>
            {isLogin ? 'Sign In to Workspace' : 'Create Workspace'}
          </Button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}
