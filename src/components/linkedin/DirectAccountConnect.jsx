import React, { useState } from 'react';
import { Linkedin, CheckCircle2, ShieldCheck, Zap, Key, LogOut, Lock, HelpCircle, Info } from 'lucide-react';
import { connectLinkedInAccountDirectly, disconnectLinkedInAccountDirectly } from '../../services/linkedinDirectService';
import Button from '../ui/Button';

export default function DirectAccountConnect({ connectedProfile, setConnectedProfile }) {
  const [connectMethod, setConnectMethod] = useState('session'); // default to session token for real account
  const [sessionToken, setSessionToken] = useState('');
  const [accountName, setAccountName] = useState('');
  const [showCookieGuide, setShowCookieGuide] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleConnectOAuth = async () => {
    setConnecting(true);
    setStatusMsg(null);
    try {
      const data = await connectLinkedInAccountDirectly({
        sessionToken: null,
        accountName: accountName || 'My LinkedIn Account',
        authType: 'oauth'
      });
      if (data.success) {
        setConnectedProfile(data.profile);
        setStatusMsg({ success: true, message: data.message });
      } else {
        setStatusMsg({ success: false, message: data.message });
      }
    } catch (err) {
      setStatusMsg({ success: false, message: err.message || 'Connection failed.' });
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectSessionToken = async (e) => {
    e.preventDefault();
    if (!sessionToken) return;

    setConnecting(true);
    setStatusMsg(null);
    try {
      const data = await connectLinkedInAccountDirectly({
        sessionToken: sessionToken.trim(),
        accountName: accountName.trim() || 'My LinkedIn Account',
        authType: 'token'
      });
      if (data.success) {
        setConnectedProfile(data.profile);
        setSessionToken(''); // Immediately clear input state for security
        setStatusMsg({ success: true, message: data.message });
      } else {
        setStatusMsg({ success: false, message: data.message });
      }
    } catch (err) {
      setStatusMsg({ success: false, message: err.message || 'Connection failed.' });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectLinkedInAccountDirectly();
    setConnectedProfile(null);
    setSessionToken('');
    setAccountName('');
    setStatusMsg({ success: true, message: 'LinkedIn account disconnected. Ephemeral memory wiped.' });
  };

  return (
    <div className="glass-enterprise-panel" style={{ padding: '28px', marginBottom: '28px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#0a66c2', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Linkedin color="#ffffff" size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
                Direct LinkedIn Account Integration
              </h2>
              <span className="badge-enterprise badge-enterprise-white">Zero Persistence Security</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Connect your real LinkedIn account directly. Credentials live exclusively in ephemeral browser RAM and are never stored on disk.
            </p>
          </div>
        </div>

        {connectedProfile && (
          <Button variant="danger" onClick={handleDisconnect} icon={LogOut}>
            Disconnect & Clear Session
          </Button>
        )}
      </div>

      {/* Connected Account Card View */}
      {connectedProfile ? (
        <div className="glass-enterprise-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {connectedProfile.profilePic ? (
                <img
                  src={connectedProfile.profilePic}
                  alt={connectedProfile.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #ffffff', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ background: '#0a66c2', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ffffff' }}>
                  <Linkedin color="#ffffff" size={26} />
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>{connectedProfile.name}</h3>
                  <span className="badge-enterprise badge-enterprise-white">
                    <CheckCircle2 size={12} color="#080a0f" /> Ephemeral Active Session
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {connectedProfile.headline}
                </p>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Auth Method: {connectedProfile.accountType} | Zero Disk Storage
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-enterprise" style={{ padding: '6px 12px' }}>
                <ShieldCheck size={14} color="#ffffff" /> Ephemeral Memory Safe
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Unconnected State: Choose Method */
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setConnectMethod('session')}
              className="btn-enterprise"
              style={{
                background: connectMethod === 'session' ? '#ffffff' : 'rgba(255,255,255,0.06)',
                color: connectMethod === 'session' ? '#080a0f' : 'var(--text-muted)'
              }}
            >
              <Key size={15} /> Real Account Session Cookie (`li_at`)
            </button>
            <button
              onClick={() => setConnectMethod('oauth')}
              className="btn-enterprise"
              style={{
                background: connectMethod === 'oauth' ? '#ffffff' : 'rgba(255,255,255,0.06)',
                color: connectMethod === 'oauth' ? '#080a0f' : 'var(--text-muted)'
              }}
            >
              <Zap size={15} /> 1-Click OAuth Sign-In
            </button>
          </div>

          {connectMethod === 'session' ? (
            <form onSubmit={handleConnectSessionToken} className="glass-enterprise-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} color="var(--text-muted)" /> Connect via LinkedIn `li_at` Session Cookie
                </label>
                <button
                  type="button"
                  onClick={() => setShowCookieGuide(!showCookieGuide)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <HelpCircle size={14} /> How do I get my `li_at` cookie?
                </button>
              </div>

              {/* Step-by-Step Cookie Guide */}
              {showCookieGuide && (
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '0.8rem', color: '#e0f2fe' }}>
                  <div style={{ fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={14} color="#38bdf8" /> 3 Steps to find your `li_at` cookie:
                  </div>
                  <ol style={{ marginLeft: '18px', lineHeight: '1.6' }}>
                    <td>Log into your real account on <b>linkedin.com</b> in your browser.</td>
                    <td>Press <b>F12</b> (Inspect) → Go to <b>Application</b> tab (or <b>Storage</b> in Firefox) → Expand <b>Cookies</b> → <b>https://www.linkedin.com</b>.</td>
                    <td>Find the row named <b><code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>li_at</code></b> and copy its long Value string.</td>
                  </ol>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Account Label / Name (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-enterprise"
                    placeholder="e.g. My Primary LinkedIn Account"
                    value={accountName}
                    onChange={e => setAccountName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    `li_at` Session Cookie String
                  </label>
                  <input
                    type="password"
                    className="input-enterprise"
                    placeholder="Paste li_at cookie string here..."
                    value={sessionToken}
                    onChange={e => setSessionToken(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" disabled={connecting} style={{ height: '42px' }}>
                  {connecting ? 'Connecting...' : 'Connect Real Account'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="glass-enterprise-card" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                Sign In directly with LinkedIn OAuth 2.0
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '520px', margin: '0 auto 20px' }}>
                Connect your account via official LinkedIn authentication. Tokens are kept strictly in memory for your session.
              </p>
              <Button variant="primary" onClick={handleConnectOAuth} disabled={connecting} icon={Linkedin}>
                {connecting ? 'Authenticating...' : 'Connect LinkedIn Account Now'}
              </Button>
            </div>
          )}

          {statusMsg && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff'
            }}>
              {statusMsg.message}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
