import React, { useState, useEffect } from 'react';
import { Linkedin, CheckCircle2, ShieldCheck, Zap, Key, LogOut, Lock, HelpCircle, Info, ExternalLink } from 'lucide-react';
import { connectLinkedInAccountDirectly, disconnectLinkedInAccountDirectly } from '../../services/linkedinDirectService';
import Button from '../ui/Button';

export default function DirectAccountConnect({ connectedProfile, setConnectedProfile }) {
  const [connectMethod, setConnectMethod] = useState('oauth'); // default to oauth
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
    const oauthState = urlParams.get('state');

    if (oauthCode) {
      setConnecting(true);
      // Clean query parameters from URL for clean navigation
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
    const clientId = oauthClientId.trim() || '78xxxxxx78'; // Default or custom OAuth Client ID

    // If client ID is custom, redirect to LinkedIn's official OAuth authorization endpoint
    if (oauthClientId.trim()) {
      const oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=open_outreach_auth&scope=openid%20profile%20w_member_social%20email`;
      window.location.href = oauthUrl;
      return;
    }

    // Direct 1-Click OAuth flow authorization
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
              Connect your LinkedIn account via 1-Click OAuth 2.0 or Session Cookie. Credentials live exclusively in ephemeral RAM.
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
            <div className="glass-enterprise-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="#0a66c2" /> 1-Click LinkedIn OAuth 2.0 Authentication
                </h3>
                <button
                  type="button"
                  onClick={() => setShowOAuthGuide(!showOAuthGuide)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <HelpCircle size={14} /> How OAuth 2.0 works
                </button>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Authorize directly with official LinkedIn OAuth 2.0. No plain passwords are ever shared or saved to disk.
              </p>

              {/* OAuth Info Guide */}
              {showOAuthGuide && (
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '14px', marginBottom: '18px', fontSize: '0.8rem', color: '#e0f2fe' }}>
                  <div style={{ fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={14} color="#38bdf8" /> Official LinkedIn OAuth 2.0 Security:
                  </div>
                  <ul style={{ marginLeft: '18px', lineHeight: '1.6' }}>
                    <td>OAuth 2.0 opens LinkedIn's secure sign-in page directly.</td>
                    <td>You authorize OpenOutreach to access member profile data without revealing your master password.</td>
                    <td>To use your custom Developer App, paste your <b>Client ID</b> below before clicking connect.</td>
                  </ul>
                </div>
              )}

              <form onSubmit={handleConnectOAuth} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    LinkedIn App Client ID (Optional for custom Developer Apps)
                  </label>
                  <input
                    type="text"
                    className="input-enterprise"
                    placeholder="Enter custom Client ID (e.g. 78xxxxxx)"
                    value={oauthClientId}
                    onChange={e => setOauthClientId(e.target.value)}
                  />
                </div>

                <Button type="submit" variant="primary" disabled={connecting} icon={Linkedin} style={{ height: '42px' }}>
                  {connecting ? 'Authorizing with LinkedIn...' : 'Connect LinkedIn Account Now'}
                </Button>
              </form>
            </div>
          ) : (
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
