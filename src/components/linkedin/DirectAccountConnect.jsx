import React, { useState, useEffect } from 'react';
import { Linkedin, CheckCircle2, ShieldCheck, Zap, Key, LogOut, Lock, HelpCircle, Info, ExternalLink } from 'lucide-react';
import { connectLinkedInAccountDirectly, disconnectLinkedInAccountDirectly } from '../../services/linkedinDirectService';
import Button from '../ui/Button';

export default function DirectAccountConnect({ connectedProfile, setConnectedProfile }) {
  const [connectMethod, setConnectMethod] = useState('oauth');
  const [sessionToken, setSessionToken] = useState('');
  const [accountName, setAccountName] = useState('');
  const [oauthClientId, setOauthClientId] = useState('');
  const [showCookieGuide, setShowCookieGuide] = useState(false);
  const [showOAuthGuide, setShowOAuthGuide] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Check URL parameters for LinkedIn OAuth 2.0 authorization code callback (?code=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthCode = urlParams.get('code');

    if (oauthCode) {
      setConnecting(true);
      window.history.replaceState({}, document.title, window.location.pathname);

      connectLinkedInAccountDirectly({
        sessionToken: oauthCode,
        accountName: 'LinkedIn OAuth User',
        authType: 'oauth'
      }).then(data => {
        if (data.success) {
          setConnectedProfile(data.profile);
          setStatusMsg({ success: true, message: 'LinkedIn OAuth 2.0 Authentication Successful! Session token generated.' });
        }
      }).finally(() => {
        setConnecting(false);
      });
    }
  }, [setConnectedProfile]);

  const handleConnectOAuth = async (e) => {
    if (e) e.preventDefault();
    setConnecting(true);
    setStatusMsg(null);

    const redirectUri = window.location.origin + window.location.pathname;
    const clientId = oauthClientId.trim() || '78xxxxxx78';

    if (oauthClientId.trim()) {
      const oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=open_outreach_auth&scope=openid%20profile%20w_member_social%20email`;
      window.location.href = oauthUrl;
      return;
    }

    try {
      const data = await connectLinkedInAccountDirectly({
        sessionToken: null,
        accountName: accountName.trim() || 'LinkedIn OAuth User',
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
        setSessionToken('');
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
      
      {/* Header Bar with Live Server Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#0a66c2', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Linkedin color="#ffffff" size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
                Direct LinkedIn Account Integration
              </h2>
              <span className="badge-enterprise badge-enterprise-white">Zero Persistence Security</span>
              
              <span 
                className="badge-enterprise"
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                Direct Web SaaS HTTPS REST Engine Active
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Connect your LinkedIn account via 1-Click OAuth 2.0 or Session Cookie (`li_at`). Dispatches requests directly over HTTPS just like Gmail.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {connectedProfile && (
            <Button variant="danger" onClick={handleDisconnect} icon={LogOut}>
              Disconnect & Clear Session
            </Button>
          )}
        </div>
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
        /* Unconnected State */
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
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
            <button
              onClick={() => setConnectMethod('session')}
              className="btn-enterprise"
              style={{
                background: connectMethod === 'session' ? '#ffffff' : 'rgba(255,255,255,0.06)',
                color: connectMethod === 'session' ? '#080a0f' : 'var(--text-muted)'
              }}
            >
              <Key size={15} /> Session Cookie (`li_at`)
            </button>
          </div>

          {connectMethod === 'oauth' ? (
            <form onSubmit={handleConnectOAuth} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Account Label (Optional)
                </label>
                <input
                  type="text"
                  className="input-enterprise"
                  placeholder="e.g. My Personal LinkedIn Account"
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Button variant="primary" type="submit" loading={connecting} icon={Zap}>
                  Connect via LinkedIn OAuth 2.0
                </Button>
                <button
                  type="button"
                  onClick={() => setShowOAuthGuide(!showOAuthGuide)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <HelpCircle size={14} /> How OAuth works
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConnectSessionToken} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  LinkedIn Session Token (`li_at` cookie value)
                </label>
                <input
                  type="password"
                  className="input-enterprise"
                  placeholder="Paste your li_at session cookie here..."
                  value={sessionToken}
                  onChange={e => setSessionToken(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Button variant="primary" type="submit" loading={connecting} icon={Key}>
                  Save Ephemeral Token
                </Button>
                <button
                  type="button"
                  onClick={() => setShowCookieGuide(!showCookieGuide)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <HelpCircle size={14} /> How to find your `li_at` cookie
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {statusMsg && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            background: statusMsg.success ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: statusMsg.success ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: statusMsg.success ? '#4ade80' : '#f87171'
          }}
        >
          {statusMsg.message}
        </div>
      )}

    </div>
  );
}
