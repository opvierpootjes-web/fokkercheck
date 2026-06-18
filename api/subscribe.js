export default async function handler(req, res) {
  // Alleen POST toegestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body ?? {};

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key niet geconfigureerd' });
  }

  // Optioneel: voeg toe aan een specifieke groep via MAILERLITE_GROUP_ID (Vercel env var)
  const groupId = process.env.MAILERLITE_GROUP_ID;

  try {
    // MailerLite nieuwe API (connect.mailerlite.com)
    // Gebruik je het Classic account? Vervang de URL dan door:
    // https://api.mailerlite.com/api/v2/subscribers  (met header X-MailerLite-ApiKey)
    const body = { email };
    if (groupId) body.groups = [groupId];

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    // 200 = aangemeld, 409 = al ingeschreven — beide zijn OK voor ons
    if (response.ok || response.status === 409) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json().catch(() => ({}));
    console.error('MailerLite fout:', response.status, data);
    return res.status(502).json({ error: 'MailerLite meldt een fout' });

  } catch (err) {
    console.error('Serverfout bij aanmelden:', err);
    return res.status(500).json({ error: 'Serverfout' });
  }
}
