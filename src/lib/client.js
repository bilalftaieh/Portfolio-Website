// What the browser will tell us about whoever is reading, without asking them
// for anything. Extracted from the hero's status bar so the fallbacks live in
// one place and anything else that wants to name the reader's region reads the
// same two functions.

/** The reader's region, derived from their IANA timezone. */
export function clientRegion() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return zone ? zone.toLowerCase().replace(/[/_]/g, '-') : null
  } catch {
    return null
  }
}

/** The reader's UTC offset, as a gateway would log it. */
export function clientOffset() {
  const minutes = -new Date().getTimezoneOffset()
  const sign = minutes < 0 ? '-' : '+'
  const abs = Math.abs(minutes)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const rest = abs % 60
  return `utc${sign}${hours}${rest ? `:${String(rest).padStart(2, '0')}` : ''}`
}
