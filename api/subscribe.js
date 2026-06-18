module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  console.log('[subscribe] email ontvangen:', email ? 'ja' : 'nee');

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  console.log('[subscribe] API key aanwezig:', !!apiKey);

  if (!apiKey) {
    console.error('[subscribe] MAILERLITE_API_KEY niet gevonden in env');
    return res.status(500).json({ error: 'API key niet geconfigureerd' });
  }

  const groupId = process.env.MAILERLITE_GROUP_ID;
  const body = { email };
  if (groupId) body.groups = [groupId];

  console.log('[subscribe] MailerLite aanroepen voor:', email);

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    console.log('[subscribe] MailerLite status:', response.status, JSON.stringify(data));

    // 200/201 = aangemeld, 409 = al ingeschreven — beide OK
    if (response.ok || response.status === 409) {
      return res.status(200).json({ success: true });
    }

    return res.status(502).json({ error: 'MailerLite meldt een fout', detail: data });

  } catch (err) {
    console.error('[subscribe] Serverfout:', err.message);
    return res.status(500).json({ error: 'Serverfout' });
  }
};
