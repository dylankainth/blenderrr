/* Whirl UI Kit — screens. Each screen is a self-contained component using the
   primitives from Components.jsx. */

const { useState: useState_s, useEffect: useEffect_s, useRef: useRef_s } = React;

/* ============================================================================
   EMPTY / CONNECT SCREEN
   Shown when no blender is paired. Has the dominant "LOOK FOR BLENDERS" CTA.
   ========================================================================== */
function EmptyScreen({ onScan, onOpenSettings }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <TopBar
        title="blender"
        right={
          <IconButton ariaLabel="settings" onClick={onOpenSettings}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
            </svg>
          </IconButton>
        }
      />

      <div
        style={{
          flex: 1,
          padding: "32px 24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Eyebrow>Step 1</Eyebrow>
        <div
          style={{
            fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
          }}
        >
          No blender yet. Wave your phone at one.
        </div>

        {/* Illustration */}
        <div
          style={{
            margin: "10px auto 0",
            position: "relative",
            width: 220,
            height: 200,
          }}
        >
          {/* sad bluetooth */}
          <svg width="220" height="200" viewBox="0 0 240 200">
            <path
              d="M120 30 L150 60 L100 100 L150 140 L120 170 L120 30 Z"
              fill="none"
              stroke="#111"
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M100 60 L150 100 L100 140"
              fill="none"
              stroke="#111"
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line x1="50" y1="40" x2="190" y2="170" stroke="#E63946" strokeWidth="8" strokeLinecap="round" />
            <text x="180" y="46" fontFamily="Bricolage Grotesque, system-ui" fontSize="18" fontWeight="700" fill="#A9A498">zzz</text>
          </svg>
        </div>

        <div style={{ flex: 1 }} />

        <Button variant="primary" full onClick={onScan}>
          Look for blenders
        </Button>
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#6E6B62",
            fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
          }}
        >
          make sure your blender is on and saying hello over BLE
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   DEVICE PICKER SHEET
   ========================================================================== */
function DevicePickerSheet({ open, onClose, onPick }) {
  const [scanning, setScanning] = useState_s(true);
  const [devices, setDevices] = useState_s([]);

  useEffect_s(() => {
    if (!open) return;
    setScanning(true);
    setDevices([]);
    const t1 = setTimeout(() => {
      setDevices([
        { name: "Smoothie-3000", mac: "AC:24:9F:E1:0B:3C", rssi: -58 },
      ]);
    }, 900);
    const t2 = setTimeout(() => {
      setDevices((d) => [
        ...d,
        { name: "MysteryBlender", mac: "F2:0A:55:91:33:7D", rssi: -74 },
      ]);
      setScanning(false);
    }, 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(17,17,17,0.55)",
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FBF6E9",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          border: "2px solid #111",
          borderBottom: "none",
          boxShadow: "0 -6px 0 #111",
          padding: "20px 22px 28px",
          maxHeight: "75%",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 56,
            height: 5,
            borderRadius: 999,
            background: "#111",
            opacity: 0.25,
            alignSelf: "center",
            marginTop: -8,
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div
            style={{
              fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Nearby blenders
          </div>
          {scanning ? <Pill color="smoothie" dot>scanning…</Pill> : <Pill color="pulp" dot>{devices.length} found</Pill>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {devices.map((d, i) => (
            <Card key={d.mac} hoverLift onClick={() => onPick(d)} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <Glyph size={36} spin={i === 0} />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
                        fontWeight: 800,
                        fontSize: 18,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {d.name}
                    </div>
                    <Mono size={11} color="#6E6B62">{d.mac} · {d.rssi} dBm</Mono>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#2D5BFF",
                  }}
                >
                  pair →
                </div>
              </div>
            </Card>
          ))}
          {scanning && devices.length === 0 && (
            <div style={{ padding: "30px 0", textAlign: "center", color: "#6E6B62", fontSize: 14 }}>
              listening for hellos…
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />
        <Button variant="secondary" full onClick={onClose}>
          cancel
        </Button>
      </div>
    </div>
  );
}

/* ============================================================================
   HOME / ARMED SCREEN
   ========================================================================== */
function HomeScreen({ device, armed, onArmChange, onStartSpin, onOpenSettings, onDisconnect }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      <TopBar
        title="blender"
        right={
          <IconButton ariaLabel="settings" onClick={onOpenSettings}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
            </svg>
          </IconButton>
        }
      />

      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
        {/* Connected device card */}
        <Card tone="canvas" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <Glyph size={34} />
              <div style={{ minWidth: 0 }}>
                <Eyebrow>connected to</Eyebrow>
                <div
                  style={{
                    fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
                    fontWeight: 800,
                    fontSize: 22,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    marginTop: 2,
                  }}
                >
                  {device?.name || "Smoothie-3000"}
                </div>
              </div>
            </div>
            <Pill color="pulp" dot>online</Pill>
          </div>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Mono size={11} color="#6E6B62">{device?.mac || "AC:24:9F:E1:0B:3C"}</Mono>
            <button
              onClick={onDisconnect}
              style={{
                background: "transparent",
                border: "none",
                color: "#E63946",
                fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              disconnect
            </button>
          </div>
        </Card>

        {/* Arm switch — the safety system */}
        <Card tone={armed ? "squash" : "canvas"} style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div style={{ minWidth: 0 }}>
              <Eyebrow color={armed ? "#111" : undefined}>{armed ? "system armed" : "system off"}</Eyebrow>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
                  fontWeight: 800,
                  fontSize: 26,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  marginTop: 4,
                }}
              >
                {armed ? "Armed. Spin to blend." : "System is chill."}
              </div>
            </div>
            <Switch on={armed} onChange={onArmChange} label="arm system" />
          </div>
        </Card>

        <div style={{ flex: 1 }} />

        {/* Hero spin CTA */}
        <Button
          variant={armed ? "primary" : "secondary"}
          big
          full
          disabled={!armed}
          onClick={onStartSpin}
          style={{ padding: "26px 24px", fontSize: 30 }}
        >
          <Glyph size={34} spin={armed} color={armed ? "#FBF6E9" : "#A9A498"} />
          {armed ? "HOLD AND SPIN" : "arm to begin"}
        </Button>

        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#6E6B62",
            fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
          }}
        >
          motor only runs while your phone is spinning.
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   LIVE SPIN SCREEN — full-bleed, focused.
   ========================================================================== */
function LiveSpinScreen({ onStop }) {
  const [rpm, setRpm] = useState_s(118);
  const targetRef = useRef_s(140);

  useEffect_s(() => {
    // Animate the RPM to feel like real spinning. Floor at 0, target wanders.
    let raf;
    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      // wander target every ~700ms
      targetRef.current += (Math.random() - 0.5) * 8;
      targetRef.current = Math.max(80, Math.min(180, targetRef.current));
      setRpm((r) => r + (targetRef.current - r) * Math.min(1, dt * 4));
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        background: "#FF6A1A",
        display: "flex",
        flexDirection: "column",
        padding: "20px 22px",
        position: "relative",
      }}
    >
      {/* top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Pill color="squash" dot>live</Pill>
        <button
          onClick={onStop}
          style={{
            background: "#111",
            color: "#FBF6E9",
            border: "2px solid #111",
            borderRadius: 10,
            padding: "6px 12px",
            fontFamily: 'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ✕ end
        </button>
      </div>

      {/* Big number */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 4 }}>
        <Eyebrow color="#111">phone spin</Eyebrow>
        <div
          style={{
            fontFamily: 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)',
            fontSize: 120,
            fontWeight: 700,
            color: "#111",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(rpm)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
            fontSize: 20,
            fontWeight: 700,
            color: "#111",
          }}
        >
          rpm
        </div>

        {/* Spin ring */}
        <div style={{ marginTop: 8, position: "relative", width: 180, height: 180 }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ animation: "whirl-spin 1.2s linear infinite" }}>
            <circle
              cx="90"
              cy="90"
              r="74"
              fill="none"
              stroke="#111"
              strokeWidth="5"
              strokeDasharray="3 14"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph size={64} color="#FBF6E9" />
          </div>
        </div>

        <div style={{ marginTop: 12, textAlign: "center", maxWidth: "100%" }}>
          <span style={{
            display: "inline-block",
            transform: "rotate(3deg)",
            background: "#FBF6E9",
            color: "#E63946",
            border: "3px solid #E63946",
            borderRadius: 8,
            padding: "8px 14px",
            fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "-0.01em",
            boxShadow: "4px 4px 0 #E63946",
            whiteSpace: "nowrap",
          }}>DO NOT LET GO</span>
        </div>
      </div>

      {/* Stop button */}
      <Button variant="danger" big full onClick={onStop}>
        STOP THE BLENDER
      </Button>
    </div>
  );
}

/* ============================================================================
   SETTINGS SHEET
   ========================================================================== */
function SettingsSheet({ open, onClose, device, onDisconnect }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(17,17,17,0.55)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FBF6E9",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          border: "2px solid #111",
          borderBottom: "none",
          padding: "20px 22px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 56,
            height: 5,
            borderRadius: 999,
            background: "#111",
            opacity: 0.25,
            alignSelf: "center",
            marginTop: -8,
          }}
        />
        <div
          style={{
            fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Settings
        </div>

        <Card tone="canvas" style={{ padding: 14 }}>
          <Eyebrow>paired device</Eyebrow>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bricolage Grotesque", system-ui, sans-serif)',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {device?.name || "—"}
              </div>
              <Mono size={11} color="#6E6B62">{device?.mac || "no device paired"}</Mono>
            </div>
            {device && (
              <Button variant="dark" onClick={onDisconnect}>
                forget
              </Button>
            )}
          </div>
        </Card>

        <Card tone="canvas" style={{ padding: 14 }}>
          <Eyebrow>calibration</Eyebrow>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <div style={{ maxWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Re-zero gyro</div>
              <div style={{ fontSize: 12, color: "#6E6B62" }}>
                hold phone still on a table, then tap.
              </div>
            </div>
            <Button variant="secondary">calibrate</Button>
          </div>
        </Card>

        <Card tone="canvas" style={{ padding: 14 }}>
          <Eyebrow>about blender</Eyebrow>
          <div style={{ fontSize: 13, color: "#3A3A36", marginTop: 6 }}>
            v0.1 · made at a hackathon · probably fine.
            <br />
            <a href="#" style={{ color: "#2D5BFF" }}>github →</a>
          </div>
        </Card>

        <Button variant="secondary" full onClick={onClose}>
          done
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { EmptyScreen, DevicePickerSheet, HomeScreen, LiveSpinScreen, SettingsSheet });
