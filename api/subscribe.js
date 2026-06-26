export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body || {};
  console.log('[subscribe] email ontvangen:', email ? 'ja' : 'nee');

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres' });
  }

  const apiKey     = process.env.AC_API_KEY;
  const accountUrl = process.env.AC_ACCOUNT_URL; // https://opvierpootjes.activehosted.com
  const listId     = process.env.AC_LIST_ID;      // 10
  const tagName    = process.env.AC_TAG;           // [LEAD]-ebook-aanvraag-fokkercheckgids

  console.log('[subscribe] AC API key aanwezig:', !!apiKey);

  if (!apiKey || !accountUrl) {
    console.error('[subscribe] AC configuratie ontbreekt in env');
    return res.status(500).json({ error: 'API configuratie ontbreekt' });
  }

  const base    = `${accountUrl}/api/3`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'Api-Token':    apiKey,
  };

  try {
    // Stap 1: contact aanmaken of bijwerken via sync
    const syncRes  = await fetch(`${base}/contact/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ contact: { email, firstName: name || '' } }),
    });
    const syncData = await syncRes.json().catch(() => ({}));
    console.log('[subscribe] AC sync status:', syncRes.status, JSON.stringify(syncData));

    const contactId = syncData.contact?.id;
    if (!contactId) {
      console.error('[subscribe] Geen contact ID ontvangen van AC');
      return res.status(502).json({ error: 'Kon contact niet aanmaken in ActiveCampaign' });
    }

    // Stap 2: toevoegen aan lijst
    if (listId) {
      const listRes = await fetch(`${base}/contactLists`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ contactList: { list: listId, contact: contactId, status: 1 } }),
      });
      console.log('[subscribe] AC lijst status:', listRes.status);
    }

    // Stap 3: tag toevoegen (zoek bestaande tag op naam)
    if (tagName) {
      const tagSearchRes  = await fetch(`${base}/tags?search=${encodeURIComponent(tagName)}`, { headers });
      const tagSearchData = await tagSearchRes.json().catch(() => ({}));
      const tagId         = tagSearchData.tags?.[0]?.id;

      if (tagId) {
        const tagRes = await fetch(`${base}/contactTags`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
        });
        console.log('[subscribe] AC tag status:', tagRes.status);
      } else {
        console.warn('[subscribe] Tag niet gevonden in AC:', tagName);
      }
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('[subscribe] Serverfout:', err.message);
    return res.status(500).json({ error: 'Serverfout' });
  }
}
