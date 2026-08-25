import { useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { certifications } from '../data/profile'
import { isActive, monthLabel, tokenFor, validity } from '../lib/credentials'

/** The tri-colour token line, sliced for the collapsed row or whole for the panel. */
function Token({ token, truncate = false }) {
  const header = truncate ? `${token.headerSegment.slice(0, 14)}…` : token.headerSegment
  const payload = truncate ? `${token.payloadSegment.slice(0, 22)}…` : token.payloadSegment

  // `block min-w-0 max-w-full` is what makes the truncated variant actually
  // truncate: an unbroken base64 string has a huge min-content width, and
  // without it the row sets the grid column's width and gets clipped.
  return (
    <code
      className={`block min-w-0 max-w-full font-mono text-[11px] ${
        truncate ? 'truncate' : 'break-all'
      }`}
    >
      <span className="text-accent-soft">{header}</span>
      <span className="text-border-hi">.</span>
      <span className="text-code-string">{payload}</span>
      <span className="text-border-hi">.</span>
      <span className="text-text-muted/60">{token.signatureSegment}</span>
    </code>
  )
}

function Claim({ name, children }) {
  return (
    <div className="flex gap-3 py-1">
      <span className="w-14 shrink-0 text-text-muted">{name}</span>
      <span className="min-w-0 flex-1 break-words text-text">{children}</span>
    </div>
  )
}

export default function Credentials() {
  // The load-bearing one starts unfolded, so the block opens as a decoded
  // credential rather than a stack of closed drawers.
  const [openId, setOpenId] = useState(certifications[0].id)
  const [now] = useState(() => Date.now())

  return (
    <div className="cellgrid">
      {certifications.map((cert) => {
        const open = openId === cert.id
        const token = tokenFor(cert)
        const active = isActive(cert, now)
        const lifespan = validity(cert, now)
        const panelId = `credential-${cert.id}`

        return (
          <div key={cert.id} className="cell min-w-0">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : cert.id)}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex w-full min-w-0 flex-col gap-3 p-5 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {/* Wraps rather than truncates: a credential's name is the
                      one thing in the row that must survive a narrow screen. */}
                  <p className="text-sm font-medium text-text-heading">{cert.name}</p>
                  <p className="meta mt-1 tracking-[0.12em]">
                    {cert.issuer} · {monthLabel(cert.issued)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`flex items-center gap-1.5 font-mono text-[11px] ${
                      active ? 'text-signal' : 'text-text-muted'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-signal' : 'bg-border-hi'}`}
                    />
                    {active ? 'active' : 'lapsed'}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              <Token token={token} truncate />

              {/* Only credentials that can lapse get a meter — there is nothing
                  to measure on one that never expires. */}
              {lifespan && (
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border">
                    <span
                      className="block h-px bg-accent"
                      style={{ width: `${lifespan.percent}%` }}
                    />
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-text-muted">
                    {lifespan.remaining} to {monthLabel(cert.expires)}
                  </span>
                </div>
              )}
            </button>

            {/* Grid-rows collapse rather than a measured height animation: it
                needs no layout read, and the global reduced-motion rule
                already flattens it. */}
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] ${
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden" inert={!open}>
                <div className="space-y-4 border-t border-border px-5 py-4 font-mono text-xs">
                  <div>
                    <p className="meta mb-2">token</p>
                    <Token token={token} />
                  </div>

                  <div>
                    <p className="meta mb-2">decoded claims</p>
                    <Claim name="iss">{cert.issuer}</Claim>
                    <Claim name="sub">belal-alfutayh</Claim>
                    <Claim name="cred">{cert.credentialId}</Claim>
                    <Claim name="iat">{cert.issued}</Claim>
                    <Claim name="exp">
                      {cert.expires ?? <span className="text-text-muted">null · does not expire</span>}
                    </Claim>
                    <Claim name="scope">[{cert.scope.map((s) => `"${s}"`).join(', ')}]</Claim>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <p className="text-text-muted">
                      signature held by {cert.issuer} — this page can&rsquo;t sign it
                    </p>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      Verify with {cert.issuer} <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
