import React from "react";
import { Mail, Phone, MapPin, Compass } from "lucide-react";

export default function Footer() {
  const destinations = [
    { name: "Argentina", image: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=150&q=80" },
    { name: "Perú", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=150&q=80" },
    { name: "Bolivia", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80" },
    { name: "Brasil", image: "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&w=150&q=80" },
    { name: "Colombia", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=150&q=80" },
    { name: "Ecuador", image: "https://images.unsplash.com/photo-1529260830199-44552e02213b?auto=format&fit=crop&w=150&q=80" }
  ];

  return (
    <footer
      style={{
        background: "var(--bg-surface-glass)",
        backdropFilter: "blur(1.1px)",
        WebkitBackdropFilter: "blur(1.1px)",
        borderTop: "1px solid var(--border-glass)",
        boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.05)",
        color: "var(--text-main)",
        padding: "60px 0 30px 0",
        fontSize: "0.85rem",
      }}
    >
      <div className="container">
        {/* Footer Top Grid - 3 Columns (Left: Brand/Awards, Center: Dest Grid, Right: Contact) */}
        <div className="footer-columns-grid">
          
          {/* COLUMN 1: BRAND LOGO & DESCRIPTION & AWARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={28} style={{ color: "var(--accent)" }} />
              <span
                style={{
                  fontFamily: "var(--font-title)",
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  letterSpacing: "-0.5px",
                color: "var(--text-heading)",
              }}
            >
              Busca<span style={{ color: "var(--primary)" }}>Tours</span>
            </span>
          </div>
          <p style={{ lineHeight: "1.7", color: "var(--text-muted)" }}>
            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
          </p>
          {/* Award Badges (from screenshot) */}
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <div style={{ border: "1px solid var(--border-glass)", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px", background: "var(--bg-surface-glass)" }}>
              <span style={{ fontSize: "1.2rem" }}>🏆</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-heading)", textTransform: "uppercase" }}>Travel Award</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--secondary)" }}>Winner 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: TOP DESTINATIONS (6 THUMBNAILS GRID - AS SEEN IN DEMO) */}
          <div>
            <h3
              style={{
              fontFamily: "var(--font-title)",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text-heading)",
              textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "24px",
              }}
            >
              TOP DESTINATIONS
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
              }}
            >
              {destinations.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => alert(`Destino: ${d.name}`)}
                  style={{
                    position: "relative",
                    height: "75px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  className="hover-zoom-img"
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.45)" }} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      left: "6px",
                      color: "#fff",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: CONTACT INFO */}
          <div>
            <h3
              style={{
              fontFamily: "var(--font-title)",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text-heading)",
              textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "24px",
              }}
            >
              CONTACT INFO
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <MapPin size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                <span>Address : 12 Main Street Pt. London</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Phone size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span>Phone : +44 3656 4567</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span>contacto@buscatours.com</span>
              </li>
            </ul>

            {/* Social icons at bottom */}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <a href="#" className="social-footer-btn">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="social-footer-btn">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="social-footer-btn">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Copyright */}
        <div
          style={{
            borderTop: "1px solid var(--border-glass)",
            paddingTop: "24px",
            marginTop: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
          className="footer-bottom-bar"
        >
          <p>© Copyright 2026. All Rights Reserved.</p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Terms & Conditions</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-columns-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }
        @media (max-width: 991px) {
          .footer-columns-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .social-footer-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-glass);
          color: var(--text-main);
          display: flex;
          alignItems: center;
          justifyContent: center;
          transition: all 0.2s;
        }
        .social-footer-btn:hover {
          background-color: var(--accent);
          border-color: var(--accent);
          color: #ffffff;
          transform: translateY(-2px);
        }
        .footer-bottom-link {
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .footer-bottom-link:hover {
          color: var(--accent);
        }
        @media (max-width: 576px) {
          .footer-bottom-bar {
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
