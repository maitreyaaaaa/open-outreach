import React, { useState } from 'react';
import { Lock, Unlock, Key, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { encryptVaultPayload, decryptVaultPayload, loadEncryptedTenantVault, saveEncryptedTenantVault } from '../../services/cryptoVaultService';
import { getActiveTenantId } from '../../services/tenantSecurityService';

export default function SecurityVaultModal({ isOpen, onClose, onVaultUnlocked, onVaultLocked, isUnlocked }) {
  const [passphrase, setPassphrase] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const tenantId = getActiveTenantId();

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passphrase) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const container = loadEncryptedTenantVault(tenantId);
      if (!container) {
        // Initialize new Vault for this tenant with provided passphrase
        const initialSecrets = {
          composioApiKey: '',
          smtpPass: '',
          linkedinCookie: '',
          gmailToken: ''
        };
        const newContainer = await encryptVaultPayload(initialSecrets, passphrase);
        saveEncryptedTenantVault(tenantId, newContainer);
        onVaultUnlocked(initialSecrets, passphrase);
        onClose();
        return;
      }

      // Decrypt existing vault payload
      const decrypted = await decryptVaultPayload(container, passphrase);
      if (decrypted) {
        onVaultUnlocked(decrypted, passphrase);
        onClose();
      } else {
        setErrorMsg('Invalid Master Passphrase.');
      }
    } catch (err) {
      setErrorMsg('Decryption failed. Check your Master Passphrase.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLock = () => {
    onVaultLocked();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 10, 15, 0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
      <div className="glass-enterprise-panel" style={{ width: '480px', maxWidth: '95vw', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#ffffff', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isUnlocked ? <Unlock color="#080a0f" size={22} /> : <Lock color="#080a0f" size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>
                {isUnlocked ? 'AES-GCM-256 Vault Unlocked' : 'Unlock AES-GCM-256 Vault'}
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Tenant: <strong>{tenantId}</strong></span>
            </div>
          </div>

          <button onClick={onClose} className="btn-enterprise btn-enterprise-secondary" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {isUnlocked ? (
          <div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
              Your AES-256 encrypted vault is active. All Composio API keys, Gmail OAuth tokens, and LinkedIn credentials are decrypted in RAM.
            </p>
            <button onClick={handleLock} className="btn-enterprise btn-enterprise-danger" style={{ width: '100%', justifyContent: 'center' }}>
              <Lock size={15} /> Lock Vault & Clear RAM Secrets
            </button>
          </div>
        ) : (
          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Enter your <strong>Master Vault Passphrase</strong> to derive the 256-bit AES-GCM decryption key and unlock your tenant credentials.
            </p>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Master Passphrase</label>
              <input
                type="password"
                className="input-enterprise"
                placeholder="Enter passphrase..."
                value={passphrase}
                onChange={e => setPassphrase(e.target.value)}
                required
                autoFocus
              />
            </div>

            {errorMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button type="submit" className="btn-enterprise btn-enterprise-primary" disabled={isProcessing} style={{ padding: '10px', justifyContent: 'center' }}>
              {isProcessing ? 'Deriving PBKDF2 Key...' : 'Unlock Encrypted Vault'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
