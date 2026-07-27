/**
 * Gmail OAuth 2.0 Service for Browser Web SaaS
 * Uses Google Identity Services to acquire access tokens for direct HTTPS email dispatches.
 */

const GOOGLE_CLIENT_ID_KEY = 'open_outreach_google_client_id';

export function getStoredGoogleClientId() {
  try {
    return localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function saveGoogleClientId(clientId) {
  try {
    localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim());
  } catch (e) {}
}

export async function sendGmailDirectViaOAuth(accessToken, emailData) {
  const { to, subject, html, text, fromName } = emailData;

  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    '',
    html || text
  ].join('\r\n');

  // Base64Url encode raw RFC 2822 email message
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodedMessage
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gmail OAuth dispatch failed (HTTP ${response.status})`);
  }

  return await response.json();
}
