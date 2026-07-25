import config from '../config';

// Traduction de texte via un agent Mistral (API Conversations), ou via un proxy
// serveur si `mistralProxyUrl` est renseigné (clé gardée côté serveur).

function isProxyUrl(url) {
  return typeof url === 'string' && /^(https?:\/\/)/i.test(url);
}

export function translationConfigured() {
  return !!(isProxyUrl(config.mistralProxyUrl) || config.mistralApiKey);
}

export async function translateText(text, targetLang) {
  const clean = (text || '').trim();
  if (!clean) return '';

  // 1) Proxy serveur : { text, targetLang } → { translation }
  if (isProxyUrl(config.mistralProxyUrl)) {
    const data = await postJson(config.mistralProxyUrl, { text: clean, targetLang });
    const out = (data.translation || data.text || '').trim();
    if (!out) throw new Error('Réponse de traduction vide.');
    return out;
  }

  // 2) Appel direct à l'agent Mistral
  if (!config.mistralApiKey) {
    throw new Error('Traduction non configurée (clé Mistral ou proxy manquant).');
  }
  const prompt =
    `Traduis intégralement le texte suivant en ${targetLang}. ` +
    `Conserve le sens, le ton et les paragraphes. ` +
    `Réponds UNIQUEMENT avec la traduction, sans introduction ni commentaire.\n\n"""\n${clean}\n"""`;
  const data = await postJson(
    'https://api.mistral.ai/v1/conversations',
    {
      agent_id: config.mistralAgentId || 'ag_019f94d427db73c3adfdbbb6126ee1d9',
      agent_version: 0,
      inputs: [{ role: 'user', content: prompt }],
    },
    { Authorization: `Bearer ${config.mistralApiKey}` }
  );
  return extractMistral(data);
}

function extractMistral(data) {
  if (data.error) {
    throw new Error(typeof data.error === 'string' ? data.error : data.error.message || 'Erreur Mistral');
  }
  const outs = data.outputs || data.messages || [];
  for (let i = outs.length - 1; i >= 0; i--) {
    const o = outs[i];
    if (!o) continue;
    if (o.type === 'message.output' || o.role === 'assistant') {
      let c = o.content;
      if (Array.isArray(c)) c = c.map((p) => (typeof p === 'string' ? p : p.text || p.content || '')).join('');
      if (c && String(c).trim()) return String(c).trim();
    }
  }
  throw new Error('Réponse de traduction vide.');
}

async function postJson(url, body, extraHeaders) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(extraHeaders || {}) },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data.error && (data.error.message || data.error)) || 'HTTP ' + res.status);
    return data;
  } finally {
    clearTimeout(t);
  }
}
