/* Whirl UI Kit — primitive components.
   All components export to window so other <script type="text/babel"> files can use them. */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Brand glyph 🌀 (SVG, no emoji dependency) ---------- */
function Glyph({ size = 24, spin = false, color = "#FF6A1A", strokeWidth }) {
  const sw = strokeWidth ?? Math.max(2, Math.round(size / 12));
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        border: `${sw}px solid #111`,
        position: "relative",
        animation: spin ? "whirl-spin 0.9s linear infinite" : undefined,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: sw + 2,
          borderRadius: "50%",
          border: `${sw}px solid #111`,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
        }}
      />
    </span>
  );
}

/* ---------- Button ---------- */
function Button({ children, variant = "primary", onClick, disabled, big = false, full = false, style }) {
  const [pressed, setPressed] = useState(false);
  const palettes = {
    primary:   { bg: "#FF6A1A", fg: "#111111" },
    danger:    { bg: "#E63946", fg: "#FBF6E9" },
    secondary: { bg: "#FBF6E9", fg: "#111111" },
    dark:      { bg: "#111111", fg: "#FBF6E9" },
    smoothie:  { bg: "#2D5BFF", fg: "#FBF6E9" },
  };
  const p = palettes[variant] || palettes.primary;
  const base = {
    fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
    fontWeight: 700,
    fontSize: big ? 24 : 14,
    letterSpacing: big ? "-0.02em" : "0.05em",
    textTransform: big ? "none" : "uppercase",
    background: p.bg,
    color: p.fg,
    border: "2px solid #111",
    borderRadius: big ? 18 : 14,
    padding: big ? "20px 28px" : "14px 22px",
    boxShadow: disabled ? "none" : (pressed ? "2px 2px 0 #111" : "6px 6px 0 #111"),
    transform: pressed ? "translate(4px, 4px)" : "translate(0,0)",
    transition: "transform 120ms cubic-bezier(.34,1.56,.64,1), box-shadow 120ms",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : undefined,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: big
      ? 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)'
      : 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
    ...style,
  };
  return (
    <button
      style={base}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* ---------- Switch ---------- */
function Switch({ on, onChange, label }) {
  return (
    <button
      onClick={() => onChange?.(!on)}
      aria-pressed={on}
      style={{
        appearance: "none",
        background: on ? "#FF6A1A" : "#FBF6E9",
        border: "2px solid #111",
        borderRadius: 999,
        width: 76,
        height: 42,
        position: "relative",
        boxShadow: "4px 4px 0 #111",
        cursor: "pointer",
        transition: "background 200ms cubic-bezier(.34,1.56,.64,1)",
        padding: 0,
      }}
      aria-label={label}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 36 : 3,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#111",
          transition: "left 220ms cubic-bezier(.34,1.56,.64,1)",
        }}
      />
    </button>
  );
}

/* ---------- Pill ---------- */
function Pill({ children, color = "neutral", dot = false }) {
  const tints = {
    neutral:  { bg: "#FBF6E9", dot: "#111111" },
    pulp:     { bg: "#CFEFD8", dot: "#1FB85A" },
    squash:   { bg: "#FFD9C2", dot: "#FF6A1A" },
    smoothie: { bg: "#DBE3FF", dot: "#2D5BFF" },
    chili:    { bg: "#FAD5D8", dot: "#E63946" },
  };
  const t = tints[color] || tints.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: t.bg,
        border: "2px solid #111",
        borderRadius: 999,
        padding: "4px 12px",
        fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
        fontWeight: 700,
        fontSize: 12,
        color: "#111",
      }}
    >
      {dot && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: t.dot,
            border: "1.5px solid #111",
          }}
        />
      )}
      {children}
    </span>
  );
}

/* ---------- Card ---------- */
function Card({ children, tone = "canvas", style, onClick, hoverLift = false }) {
  const tones = {
    canvas: "#FBF6E9",
    squash: "#FFD9C2",
    smoothie: "#DBE3FF",
    pulp: "#CFEFD8",
    chili: "#FAD5D8",
    ink: "#111111",
  };
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        background: tones[tone] || tones.canvas,
        color: tone === "ink" ? "#FBF6E9" : "#111",
        border: "2px solid #111",
        borderRadius: 14,
        boxShadow: hover && hoverLift ? "8px 8px 0 #111" : "6px 6px 0 #111",
        transform: hover && hoverLift ? "translate(-2px,-2px)" : "translate(0,0)",
        transition: "transform 180ms cubic-bezier(.34,1.56,.64,1), box-shadow 180ms",
        padding: 18,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Eyebrow label ---------- */
function Eyebrow({ children, color }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: color || "#6E6B62",
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Mono readout ---------- */
function Mono({ children, size = 14, color, weight = 500 }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)',
        fontSize: size,
        fontWeight: weight,
        color: color || "#111",
      }}
    >
      {children}
    </span>
  );
}

/* ---------- TopBar ---------- */
function TopBar({ left, right, title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        borderBottom: "2px solid #111",
        background: "#FBF6E9",
      }}
    >
      <div style={{ width: 80, display: "flex" }}>{left}</div>
      <div
        style={{
          fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </div>
      <div style={{ width: 80, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

/* ---------- Icon button (square chunky) ---------- */
function IconButton({ children, onClick, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        appearance: "none",
        width: 40,
        height: 40,
        background: "#FBF6E9",
        border: "2px solid #111",
        borderRadius: 10,
        boxShadow: "3px 3px 0 #111",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Sticker (rotated label) ---------- */
function Sticker({ children, tone = "squash", rotate = -6 }) {
  const tones = {
    squash: { bg: "#FF6A1A", fg: "#111", ink: "#111" },
    pulp:   { bg: "#1FB85A", fg: "#111", ink: "#111" },
    chili:  { bg: "#FBF6E9", fg: "#E63946", ink: "#E63946" },
    smoothie:{ bg: "#2D5BFF", fg: "#FBF6E9", ink: "#111" },
  };
  const t = tones[tone] || tones.squash;
  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${rotate}deg)`,
        background: t.bg,
        color: t.fg,
        border: `3px solid ${t.ink}`,
        borderRadius: 8,
        padding: "8px 16px",
        fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: "-0.01em",
        boxShadow: `4px 4px 0 ${t.ink}`,
      }}
    >
      {children}
    </div>
  );
}

Object.assign(window, { Glyph, Button, Switch, Pill, Card, Eyebrow, Mono, TopBar, IconButton, Sticker });
