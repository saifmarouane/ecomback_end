function normalizeMsisdn(msisdn) {
  if (!msisdn) return ''
  return String(msisdn).replace(/[^\d]/g, '')
}

function buildWhatsAppLink(to, body) {
  const normalizedTo = normalizeMsisdn(to)
  if (!normalizedTo) return ''
  const text = encodeURIComponent(String(body || ''))
  return `https://wa.me/${normalizedTo}?text=${text}`
}

async function sendWhatsAppCloudText({ to, body }) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN manquants')
  }

  if (typeof fetch !== 'function') {
    throw new Error('fetch indisponible (Node 18+ requis)')
  }

  const normalizedTo = normalizeMsisdn(to)
  if (!normalizedTo) throw new Error('Numéro WhatsApp invalide')

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: normalizedTo,
      type: 'text',
      text: { body: String(body || '') }
    })
  })

  if (!res.ok) {
    const payload = await res.text().catch(() => '')
    throw new Error(`WhatsApp Cloud API error: HTTP ${res.status} ${payload}`)
  }

  return res.json().catch(() => ({}))
}

async function sendWhatsAppMessage({ to, body }) {
  const mode = (process.env.WHATSAPP_MODE || 'link').toLowerCase()

  if (mode === 'cloud') {
    await sendWhatsAppCloudText({ to, body })
    return { mode, to: normalizeMsisdn(to), sent: true }
  }

  const url = buildWhatsAppLink(to, body)
  return { mode: 'link', to: normalizeMsisdn(to), url, sent: false }
}

module.exports = {
  normalizeMsisdn,
  buildWhatsAppLink,
  sendWhatsAppMessage
}

