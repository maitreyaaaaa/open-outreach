/**
 * System Audit & Diagnostics Logger Service
 * Keeps track of important user actions, CSV imports, SMTP connections, and dispatch events.
 */

const LOG_STORAGE_KEY = 'open_outreach_system_audit_logs';
const MAX_LOG_ENTRIES = 500;

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
  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp,
    timeFormatted: new Date().toLocaleTimeString(),
    category, // 'CSV_PARSER', 'EMAIL_DISPATCH', 'LINKEDIN_DISPATCH', 'SMTP_AUTH', 'SYSTEM'
    action,
    details,
    level // 'info', 'success', 'warning', 'error'
  };

  try {
    const current = getSystemAuditLogs();
    const updated = [entry, ...current].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  console.log(`[System Log ${level.toUpperCase()}] ${category} -> ${action}:`, details);
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
