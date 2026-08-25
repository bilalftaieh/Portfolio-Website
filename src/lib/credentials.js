// Credentials rendered as the tokens they effectively are: the issuer asserts
// a claim about you, and anyone can decode the claim but only the issuer can
// vouch for it. The two readable segments below are genuine base64url of the
// JSON shown when a row unfolds — decode them by hand and you get exactly what
// the panel says. The third segment is deliberately NOT a computed hash: this
// page holds no signing key and shouldn't pretend to. Verification is the
// outbound link to the issuer, which is the only thing that can settle it.

const SIGNATURE_PLACEHOLDER = '•'.repeat(28)

const base64url = (value) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2026-08' → 'Aug 2026'. Month precision, because that's what issuers publish. */
export function monthLabel(value) {
  if (!value) return null
  const [year, month] = value.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

/** First day of the month, UTC — comparisons only need month resolution. */
function monthStart(value) {
  return value ? Date.parse(`${value}-01T00:00:00Z`) : null
}

export function claims(cert) {
  return {
    iss: cert.issuer,
    sub: 'belal-alfutayh',
    cred: cert.credentialId,
    iat: cert.issued,
    exp: cert.expires,
    scope: cert.scope,
  }
}

export function tokenFor(cert) {
  const header = { alg: 'RS256', typ: 'JWT', kid: cert.kid }
  return {
    header,
    payload: claims(cert),
    headerSegment: base64url(JSON.stringify(header)),
    payloadSegment: base64url(JSON.stringify(claims(cert))),
    signatureSegment: SIGNATURE_PLACEHOLDER,
  }
}

/** A credential with no expiry never lapses; one with an expiry is checked. */
export function isActive(cert, now = Date.now()) {
  const exp = monthStart(cert.expires)
  return exp === null || exp > now
}

/**
 * How far through its validity window an expiring credential is. Returns null
 * for credentials that don't expire, so the meter renders only where there is
 * genuinely something to measure.
 */
export function validity(cert, now = Date.now()) {
  const start = monthStart(cert.issued)
  const end = monthStart(cert.expires)
  if (start === null || end === null || end <= start) return null

  const elapsed = Math.min(Math.max(now - start, 0), end - start)
  const months = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24 * 30.44)))
  const years = Math.floor(months / 12)
  const rest = months % 12

  return {
    percent: (elapsed / (end - start)) * 100,
    remaining: [years ? `${years}y` : null, rest || !years ? `${rest}m` : null]
      .filter(Boolean)
      .join(' '),
  }
}
