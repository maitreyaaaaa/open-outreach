export async function connectLinkedInAccountDirectly({ sessionToken, authType = 'oauth', userId = 'user_default' }) {
  const response = await fetch('/api/linkedin/connect-direct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionToken, authType, userId })
  });
  return await response.json();
}

export async function disconnectLinkedInAccountDirectly(userId = 'user_default') {
  const response = await fetch('/api/linkedin/disconnect-direct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return await response.json();
}

export async function sendDirectConnectionInvitation({ profileUrl, noteText, recipientName, userId = 'user_default' }) {
  const response = await fetch('/api/linkedin/send-direct-connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileUrl, noteText, recipientName, userId })
  });
  return await response.json();
}
