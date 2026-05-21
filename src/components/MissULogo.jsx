/**
 * MissU brand logo — SVG recreation of the couple-in-heart icon + wordmark.
 * Colors: rose #e8637a (left person) · teal #1da0bc (right person)
 */

export function MissUIcon({ size = 56, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── Left person (rose) ── */}
      {/* Head */}
      <circle cx="29" cy="21" r="12" stroke="#e8637a" strokeWidth="2.6" />
      {/* Outer left body → around left → meets bottom heart point */}
      <path
        d="M17 30 C4 43 3 67 18 82 C28 93 42 97 50 93"
        stroke="#e8637a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Inner body edge → curves back up */}
      <path
        d="M41 30 C47 40 46 56 43 69 C41 78 44 86 50 93"
        stroke="#e8637a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Right person (teal) ── */}
      {/* Head */}
      <circle cx="71" cy="21" r="12" stroke="#1da0bc" strokeWidth="2.6" />
      {/* Outer right body */}
      <path
        d="M83 30 C96 43 97 67 82 82 C72 93 58 97 50 93"
        stroke="#1da0bc" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Inner body edge */}
      <path
        d="M59 30 C53 40 54 56 57 69 C59 78 56 86 50 93"
        stroke="#1da0bc" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Smile arc at bottom center ── */}
      <path
        d="M33 87 C37 99 63 99 67 87"
        stroke="#e8637a" strokeWidth="2.6" strokeLinecap="round"
      />
    </svg>
  );
}

/** Full logo: icon + "MissU" wordmark + tagline */
export function MissULogo({ iconSize = 56, textSize = '2.25rem', showTagline = true, dark = false }) {
  const sub = dark ? '#1da0bc' : 'rgba(255,255,255,0.55)';
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <MissUIcon size={iconSize} />
      <div style={{ lineHeight: 1, marginTop: 4 }}>
        <span style={{
          fontFamily: "'Nunito', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: textSize,
          color: dark ? '#215970' : 'white',
          letterSpacing: '-0.5px',
        }}>
          Miss
        </span>
        <span style={{
          fontFamily: "'Nunito', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: textSize,
          color: '#e8637a',
          letterSpacing: '-0.5px',
        }}>
          U
        </span>
      </div>
      {showTagline && (
        <p style={{
          fontFamily: "'Nunito', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          color: sub,
          marginTop: 2,
        }}>
          CONNECT &amp; CHERISH
        </p>
      )}
    </div>
  );
}

/** Horizontal compact logo for navbar */
export function MissUNavLogo({ dark = false }) {
  const textColor = dark ? '#215970' : 'white';
  return (
    <div className="flex items-center gap-2 select-none">
      <MissUIcon size={30} />
      <div style={{ lineHeight: 1 }}>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: '1.25rem', color: textColor }}>Miss</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#e8637a' }}>U</span>
      </div>
    </div>
  );
}
