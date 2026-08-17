import { ImageResponse } from "next/og";

export const alt = "Synctech Limited — Build. Automate. Secure. Scale.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time so there is no static OG asset to keep in sync with
 * the brand. Uses system fonts only — no font fetch, no extra bytes shipped.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 80px",
          background:
            "radial-gradient(900px 500px at 85% -10%, #12306b 0%, transparent 60%), radial-gradient(700px 500px at 5% 110%, #2a1a5e 0%, transparent 60%), #04060e",
          color: "#eef2fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #7ef0ff, #6ea6ff 50%, #a98cff)",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: 6, fontWeight: 600 }}>
            SYNCTECH
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Build. Automate.</span>
            <span
              style={{
                background: "linear-gradient(100deg, #7ef0ff, #6ea6ff 50%, #a98cff)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Secure. Scale.
            </span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 27,
              color: "#97a3bd",
              maxWidth: 900,
              lineHeight: 1.45,
            }}
          >
            Software, AI automation, cloud infrastructure and cybersecurity for
            businesses that need systems to keep working.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            fontSize: 21,
            color: "#6b7793",
            letterSpacing: 1,
          }}
        >
          <span>Web</span>
          <span>·</span>
          <span>Mobile</span>
          <span>·</span>
          <span>AI</span>
          <span>·</span>
          <span>Cloud</span>
          <span>·</span>
          <span>Security</span>
          <span>·</span>
          <span>Maintenance</span>
        </div>
      </div>
    ),
    size,
  );
}
