/* Whirl — top-level prototype.
 *
 * Owns app state (paired device, armed flag, current view) plus the live RPM
 * stream. Reuses the kit screens unchanged for Empty/Picker/Home/Settings;
 * replaces LiveSpinScreen with a version that supports real DeviceMotion
 * (with a faux random-walk fallback for desktop demos) and a couple of
 * readout/background variants exposed via Tweaks. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "liveBg": "squash",
  "readout": "number",
  "motion": "faux",
  "showSticker": true
}/*EDITMODE-END*/;

const BG_CHOICES = {
  squash:   { fill: "#FF6A1A", glyph: "#FBF6E9", ink: "#111", subtle: "rgba(17,17,17,0.55)" },
  smoothie: { fill: "#2D5BFF", glyph: "#FBF6E9", ink: "#111", subtle: "rgba(255,255,255,0.65)" },
  pulp:     { fill: "#1FB85A", glyph: "#FBF6E9", ink: "#111", subtle: "rgba(17,17,17,0.55)" },
  canvas:   { fill: "#FBF6E9", glyph: "#FF6A1A", ink: "#111", subtle: "rgba(17,17,17,0.55)" },
};

/* ── Faux spin: drifts toward "fast" while live, wanders ±50 around 150. ── */
function useFauxRpm(active) {
  const [rpm, setRpm] = React.useState(0);
  const targetRef = React.useRef(0);
  React.useEffect(() => {
    if (!active) { setRpm(0); targetRef.current = 0; return; }
    // Start where the eye can see it climb.
    let cur = 40;
    targetRef.current = 160;
    let raf;
    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      targetRef.current += (Math.random() - 0.5) * 30;
      targetRef.current = Math.max(70, Math.min(220, targetRef.current));
      cur += (targetRef.current - cur) * Math.min(1, dt * 2.4);
      setRpm(cur);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return rpm;
}

/* ── Real spin: DeviceMotionEvent.rotationRate (deg/s) → RPM. ── */
function useRealRpm(active, granted) {
  const [rpm, setRpm] = React.useState(0);
  const [status, setStatus] = React.useState("idle"); // idle | live | unsupported

  React.useEffect(() => {
    if (!active || !granted) { setRpm(0); setStatus("idle"); return; }
    if (typeof DeviceMotionEvent === "undefined") { setStatus("unsupported"); return; }
    let cancelled = false;
    let smooth = 0;
    function onMotion(e) {
      const r = e.rotationRate;
      if (!r) return;
      const omega = Math.hypot(r.alpha || 0, r.beta || 0, r.gamma || 0); // deg/s
      const inst = omega / 360 * 60; // rpm
      smooth = smooth * 0.82 + inst * 0.18;
      if (!cancelled) setRpm(smooth);
    }
    window.addEventListener("devicemotion", onMotion);
    setStatus("live");
    return () => {
      cancelled = true;
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [active, granted]);

  return { rpm, status };
}

/* ── Live spin screen — full bleed, big number, optional dial. ── */
function LiveSpin({ bg, readout, useReal, motionGranted, requestMotion, showSticker, onStop }) {
  const faux = useFauxRpm(!useReal);
  const { rpm: realRpm, status } = useRealRpm(useReal, motionGranted);
  const rpm = useReal && motionGranted ? realRpm : faux;
  const needsPerm = useReal && !motionGranted
    && typeof DeviceMotionEvent !== "undefined"
    && typeof DeviceMotionEvent.requestPermission === "function";

  // Map RPM (0–250) → ring progress (0–1) for the dial readout.
  const pct = Math.max(0, Math.min(1, rpm / 250));
  const fast = rpm > 160;

  return (
    <div style={{
      flex: 1, background: bg.fill, color: bg.ink,
      display: "flex", flexDirection: "column",
      padding: "18px 22px 20px", position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: bg.fill === "#FBF6E9" ? "#FFD9C2" : "rgba(255,255,255,0.92)",
          border: "2px solid #111", borderRadius: 999, padding: "4px 12px",
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: "#111",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 999,
            background: useReal && status === "live" ? "#1FB85A" : "#FF6A1A",
            border: "1.5px solid #111",
            animation: "pulse 1s ease-in-out infinite",
          }} />
          {useReal ? (status === "live" ? "live · gyro" : status === "unsupported" ? "no gyro" : "tap to start") : "live · sim"}
        </span>
        <button onClick={onStop} style={{
          background: "#111", color: "#FBF6E9", border: "2px solid #111",
          borderRadius: 10, padding: "6px 12px", cursor: "pointer",
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
        }}>✕ end</button>
      </div>

      {/* Center stage */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", gap: 6,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.18em", color: bg.subtle,
        }}>phone spin</div>

        {readout === "dial" ? (
          <Dial size={240} pct={pct} rpm={rpm} ink={bg.ink} glyph={bg.glyph} bgFill={bg.fill} />
        ) : readout === "both" ? (
          <React.Fragment>
            <BigNumber rpm={rpm} ink={bg.ink} />
            <Dial size={160} pct={pct} ink={bg.ink} glyph={bg.glyph} bgFill={bg.fill} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <BigNumber rpm={rpm} ink={bg.ink} />
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
              color: bg.ink, letterSpacing: "-0.02em", marginTop: -4,
            }}>rpm</div>
            <RingMark spin={rpm > 5} ink={bg.ink} glyph={bg.glyph} />
          </React.Fragment>
        )}

        {showSticker && (
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              transform: `rotate(${fast ? -4 : 3}deg)`,
              background: "#FBF6E9", color: "#E63946",
              border: "3px solid #E63946", borderRadius: 8,
              padding: "8px 14px",
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
              letterSpacing: "-0.01em", boxShadow: "4px 4px 0 #E63946",
              whiteSpace: "nowrap",
            }}>
              {fast ? "DO NOT LET GO" : "spin harder"}
            </span>
          </div>
        )}
      </div>

      {needsPerm ? (
        <Button variant="dark" big full onClick={requestMotion}>
          ✋ enable motion
        </Button>
      ) : (
        <Button variant="danger" big full onClick={onStop}>
          STOP THE BLENDER
        </Button>
      )}
    </div>
  );
}

/* Big tabular number readout. */
function BigNumber({ rpm, ink }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 132, fontWeight: 700,
      color: ink, lineHeight: 0.9, letterSpacing: "-0.05em",
      fontVariantNumeric: "tabular-nums",
    }}>
      {Math.round(rpm)}
    </div>
  );
}

/* Spinning dashed ring with the brand glyph in the middle. */
function RingMark({ spin, ink, glyph }) {
  return (
    <div style={{ marginTop: 10, position: "relative", width: 170, height: 170 }}>
      <svg width="170" height="170" viewBox="0 0 180 180" style={{
        animation: spin ? "whirl-spin 1.2s linear infinite" : undefined,
      }}>
        <circle cx="90" cy="90" r="74" fill="none" stroke={ink}
                strokeWidth="5" strokeDasharray="3 14" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center" }}>
        <Glyph size={60} color={glyph} />
      </div>
    </div>
  );
}

/* Big dial — arc + numeric center. */
function Dial({ size, pct, rpm, ink, glyph, bgFill }) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const cx = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, marginTop: 6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* track */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={ink}
                strokeOpacity="0.25" strokeWidth="14" strokeLinecap="round" />
        {/* progress */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={ink}
                strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${dash} ${c}`}
                transform={`rotate(-90 ${cx} ${cx})`}
                style={{ transition: "stroke-dasharray 120ms linear" }} />
        {/* tick marks every 10% */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + Math.cos(angle) * (r - 18);
          const y1 = cx + Math.sin(angle) * (r - 18);
          const x2 = cx + Math.cos(angle) * (r - 24);
          const y2 = cx + Math.sin(angle) * (r - 24);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                       stroke={ink} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />;
        })}
      </svg>
      {rpm != null && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 64, fontWeight: 700,
            color: ink, lineHeight: 0.9, letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}>{Math.round(rpm)}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800,
            color: ink, letterSpacing: "-0.02em", marginTop: 2,
          }}>rpm</div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── App ── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [view, setView] = React.useState("empty");
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [device, setDevice] = React.useState(null);
  const [armed, setArmed] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [motionGranted, setMotionGranted] = React.useState(false);

  function showToast(msg, ms = 1800) {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }
  function handlePick(d) {
    setDevice(d); setPickerOpen(false); setView("home");
    showToast(`Hooked up to "${d.name}". Nice.`);
  }
  function handleDisconnect() {
    setDevice(null); setArmed(false); setSettingsOpen(false); setView("empty");
    showToast("Lost the blender. Sad.");
  }
  function handleArm(next) {
    setArmed(next);
    showToast(next ? "Armed. Spin to blend." : "System is chill.");
  }
  async function requestMotion() {
    if (typeof DeviceMotionEvent !== "undefined"
        && typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res === "granted") { setMotionGranted(true); return true; }
        showToast("Motion access denied. Faking it.");
        return false;
      } catch (e) {
        showToast("Motion access blocked. Faking it.");
        return false;
      }
    }
    setMotionGranted(true);
    return true;
  }

  const bg = BG_CHOICES[t.liveBg] || BG_CHOICES.squash;

  let screen;
  if (view === "spin") {
    screen = (
      <LiveSpin
        bg={bg}
        readout={t.readout}
        useReal={t.motion === "real"}
        motionGranted={motionGranted}
        requestMotion={requestMotion}
        showSticker={t.showSticker}
        onStop={() => { setView("home"); setArmed(false); }}
      />
    );
  } else if (view === "home") {
    screen = (
      <HomeScreen
        device={device} armed={armed}
        onArmChange={handleArm}
        onStartSpin={() => setView("spin")}
        onOpenSettings={() => setSettingsOpen(true)}
        onDisconnect={handleDisconnect}
      />
    );
  } else {
    screen = (
      <EmptyScreen
        onScan={() => setPickerOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
    );
  }

  return (
    <React.Fragment>
      <PhoneFrame>
        {screen}
        <DevicePickerSheet
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onPick={handlePick}
        />
        <SettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          device={device}
          onDisconnect={handleDisconnect}
        />
        {toast && (
          <div style={{
            position: "absolute", left: 16, right: 16, bottom: 28,
            background: "#111", color: "#FBF6E9",
            border: "2px solid #111", borderRadius: 14, padding: "12px 16px",
            boxShadow: "4px 4px 0 #FF6A1A",
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
            zIndex: 20, textAlign: "center",
            animation: "toast-in 240ms cubic-bezier(.34,1.56,.64,1)",
          }}>{toast}</div>
        )}
      </PhoneFrame>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Live spin screen">
          <TweakRadio label="Background" value={t.liveBg}
            options={["squash", "smoothie", "pulp", "canvas"]}
            onChange={(v) => setTweak("liveBg", v)} />
          <TweakRadio label="Readout" value={t.readout}
            options={["number", "dial", "both"]}
            onChange={(v) => setTweak("readout", v)} />
          <TweakToggle label="Show warning sticker" value={t.showSticker}
            onChange={(v) => setTweak("showSticker", v)} />
        </TweakSection>
        <TweakSection label="Motion source">
          <TweakRadio label="Source" value={t.motion}
            options={["faux", "real"]}
            onChange={(v) => setTweak("motion", v)} />
          <div style={{ fontSize: 10.5, lineHeight: 1.4, color: "rgba(41,38,27,.55)" }}>
            "real" uses your phone's gyro (DeviceMotion). On iOS you'll be
            asked to grant access the first time you start a spin.
          </div>
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

window.App = App;
