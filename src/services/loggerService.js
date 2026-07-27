/**
 * System Audit & Diagnostics Logger Service with OWASP Redaction Hardening
 * Keeps track of important user actions, CSV imports, and dispatch events with automatic secret redaction.
 */

const LOG_STORAGE_KEY = 'open_outreach_system_audit_logs';
const MAX_LOG_ENTRIES = 500;

function sanitizeDetails(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = Array.isArray(obj) ? [] : {};
  for (const [key, val] of Object.entries(obj)) {
    const kLower = key.toLowerCase();
    if (kLower.includes('pass') || kLower.includes('token') || kLower.includes('key') || kLower.includes('secret') || kLower.includes('auth') || kLower.includes('cookie')) {
      sanitized[key] = '[REDACTED_SECRET]';
    } else if (typeof val === 'string') {
      let cleanVal = val;
      cleanVal = cleanVal.replace(/ak_[a-zA-Z0-9_-]{16,}/g, 'ak_[REDACTED_COMPOSIO_KEY]');
      cleanVal = cleanVal.replace(/EAAG[a-zA-Z0-9_-]{20,}/g, 'EAAG[REDACTED_META_TOKEN]');
      cleanVal = cleanVal.replace(/ya29\.[a-zA-Z0-9_-]{20,}/g, 'ya29.[REDACTED_GOOGLE_TOKEN]');
      sanitized[key] = cleanVal;
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizeDetails(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

export function getSystemAuditLogs() {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function logSystemEvent(category, action, details = {}, level = 'info') {
  const timestamp = new Date().toISOString();
  const safeDetails = sanitizeDetails(details);

  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp,
    timeFormatted: new Date().toLocaleTimeString(),
    category, // 'CSV_PARSER', 'EMAIL_DISPATCH', 'LINKEDIN_DISPATCH', 'SMTP_AUTH', 'SYSTEM', 'SECURITY_VAULT'
    action,
    details: safeDetails,
    level // 'info', 'success', 'warning', 'error'
  };

  try {
    const current = getSystemAuditLogs();
    const updated = [entry, ...current].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  console.log(`[System Log ${level.toUpperCase()}] ${category} -> ${action}:`, safeDetails);
  return entry;
}

export function clearSystemAuditLogs() {
  try {
    localStorage.removeItem(LOG_STORAGE_KEY);
  } catch (e) {}
}

export function exportAuditLogsCSV() {
  const logs = getSystemAuditLogs();
  if (logs.length === 0) return '';

  const headers = ['Timestamp', 'Level', 'Category', 'Action', 'Details'];
  const rows = logs.map(l => [
    l.timestamp,
    l.level.toUpperCase(),
    l.category,
    l.action,
    JSON.stringify(l.details)
  ]);

  return [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
}
