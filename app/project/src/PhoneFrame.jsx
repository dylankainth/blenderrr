/* Whirl UI Kit — iOS-shaped phone frame.
   Pure shell: status bar, screen viewport, home indicator. */

function PhoneFrame({ children, time = "9:41" }) {
  return (
    <div
      style={{
        width: 390,
        height: 800,
        background: "#111",
        borderRadius: 56,
        padding: 12,
        boxShadow: "10px 10px 0 #111",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FBF6E9",
          borderRadius: 44,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* iOS-style status bar */}
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 30px 0",
            fontFamily:
              'var(--font-body, "Space Grotesk", system-ui, sans-serif)',
            fontSize: 15,
            fontWeight: 600,
            color: "#111",
            flexShrink: 0,
          }}
        >
          <span>{time}</span>
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110,
              height: 30,
              background: "#111",
              borderRadius: 999,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* signal */}
            <svg width="18" height="11" viewBox="0 0 18 11">
              <rect x="0" y="7" width="3" height="4" rx="0.5" fill="#111" />
              <rect x="5" y="5" width="3" height="6" rx="0.5" fill="#111" />
              <rect x="10" y="3" width="3" height="8" rx="0.5" fill="#111" />
              <rect x="15" y="0" width="3" height="11" rx="0.5" fill="#111" />
            </svg>
            {/* battery */}
            <svg width="26" height="12" viewBox="0 0 26 12">
              <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="#111" />
              <rect x="2" y="2" width="18" height="8" rx="1.5" fill="#111" />
              <rect x="23" y="3.5" width="2" height="5" rx="1" fill="#111" />
            </svg>
          </div>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>

        {/* Home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 134,
            height: 5,
            background: "#111",
            borderRadius: 999,
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
}

window.PhoneFrame = PhoneFrame;
