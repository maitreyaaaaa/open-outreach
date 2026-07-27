/**
 * Inbox Reply Detection & Sequence Auto-Pause Service
 * Checks Gmail / Inbox messages to detect prospect replies and pause follow-up sequences.
 */

import { logSystemEvent } from './loggerService';
import { saveSentHistoryRecord } from '../utils/csvParser';

export async function checkInboxForReplies(accessToken, recipients, setRecipients) {
  if (!accessToken) {
    return { success: false, message: 'Google OAuth token required for inbox reply detection.' };
  }

  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to query Gmail inbox (HTTP ${response.status})`);
    }

    const data = await response.json();
    const messages = data.messages || [];

    let replyCount = 0;
    const updatedRecipients = [...recipients];

    for (const msg of messages.slice(0, 20)) {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (detailRes.ok) {
        const detail = await detailRes.json();
        const headers = detail.payload?.headers || [];
        const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';

        for (let i = 0; i < updatedRecipients.length; i++) {
          const rec = updatedRecipients[i];
          if (rec.Email && fromHeader.toLowerCase().includes(rec.Email.toLowerCase())) {
            updatedRecipients[i] = {
              ...rec,
              Status: 'Replied',
              Error: null
            };
            saveSentHistoryRecord(rec.Email, 'Replied');
            replyCount++;
            logSystemEvent('REPLY_DETECTION', 'PROSPECT_REPLIED', { email: rec.Email, company: rec.Company }, 'success');
          }
        }
      }
    }

    setRecipients(updatedRecipients);
    return { success: true, replyCount, totalChecked: messages.length };

  } catch (err) {
    logSystemEvent('REPLY_DETECTION', 'DETECTION_ERROR', { error: err.message }, 'error');
    return { success: false, message: err.message };
  }
}
