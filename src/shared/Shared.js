// src/shared/Shared.js
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Brand / Theme                                                       */
/* ------------------------------------------------------------------ */
export const BRAND = {
  red: "#e11d48",
  black: "#0b0b0b",
  darkGray: "#1f2937",
  gray: "#f5f5f5",
};

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const Base = ({
  children,
  size = 18,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke={stroke}
    fill={fill}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const Icon = {
  Phone: (p) => (
    <Base {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.62-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.31 1.76.57 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.09a2 2 0 0 1 2.11-.45c.84.26 1.71.45 2.6.57A2 2 0 0 1 22 16.92z" />
    </Base>
  ),
  Location: (p) => (
    <Base {...p}>
      <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Base>
  ),
  Mail: (p) => (
    <Base {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Base>
  ),
  Burger: (p) => (
    <Base {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </Base>
  ),
  X: (p) => (
    <Base {...p}>
      <path d="M18 6L6 18M6 6l12 12" />
    </Base>
  ),
  Play: (p) => (
    <svg
      width={p.size || 18}
      height={p.size || 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Instagram: (p) => (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </Base>
  ),
  Twitter: (p) => (
    <Base {...p}>
      <path d="M23 4.5c-.8.35-1.6.56-2.5.66.9-.54 1.5-1.34 1.8-2.36-.9.53-1.9.9-3 .1-1-.7-2.2-.9-3.4-.6-1.2.3-2.1 1.2-2.6 2.3-.3.7-.3 1.5-.2 2.2-3.6-.2-6.9-1.9-9-4.7-1 1.7-.5 3.9 1.1 5-.7 0-1.4-.2-2-.5 0 2.1 1.5 3.9 3.6 4.3-.6.1-1.2.2-1.8.1.5 1.7 2.1 3 4 3.1-1.6 1.2-3.5 1.9-5.5 1.9H2C4 19 6.4 19.7 9 19.4c5.7-.6 10-5.2 10-10v-.4c.9-.7 1.6-1.5 2-2.5Z" />
    </Base>
  ),
  LinkedIn: (p) => (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="6" y="9" width="3" height="9" />
      <circle cx="7.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M15 9a4 4 0 0 1 4 4v5h-3v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4h-3V9h3v1.2A4.1 4.1 0 0 1 15 9Z" />
    </Base>
  ),
  WhatsApp: (p) => (
    <Base {...p}>
      <path d="M20.5 11.5a8.5 8.5 0 1 1-3.2-6.7l.2.2" />
      <path d="m4 20 1.4-3.8" />
      <path d="M8.5 7.5c-.4 1.6.7 3.9 2.7 5.6 2 1.7 4.3 2.4 5.7 1.9 1.3-.5 1.5-1.8.9-2.3-.5-.4-1.6-.7-2.5-1.1-.8-.4-1 .3-1.4.8-.4.4-1.1.4-1.9-.2-.8-.6-1.6-1.6-1.6-2.1 0-.6.6-.8 1-.9.5-.2.9-.7.5-1.8-.4-1-.8-1.6-1.4-1.7-.7-.1-1.5.1-2 .8Z" />
    </Base>
  ),

  /* Sector pictos used by pages */
  Building: (p) => (
    <Base {...p} strokeWidth={0} fill="currentColor">
      <path d="M4 21h16v-2H4v2Zm2-4h4v-3H6v3Zm6 0h4v-3h-4v3ZM6 12h4V9H6v3Zm6 0h4V5h-4v7ZM5 21V7l7-4l7 4v14H5Z" />
    </Base>
  ),
  Heart: (p) => (
    <Base {...p} strokeWidth={0} fill="currentColor">
      <path d="M12 21s-6.716-4.269-9.192-7.045C.78 11.77 1.057 8.4 3.343 6.515C5.63 4.63 8.4 5 10 6.6L12 8.6l2-2c1.6-1.6 4.37-1.97 6.657-.085c2.286 1.885 2.563 5.255.535 7.44C18.716 16.731 12 21 12 21Z" />
    </Base>
  ),
  Solar: (p) => (
    <Base {...p} strokeWidth={0} fill="currentColor">
      <path d="M11 2h2v4h-2V2Zm0 16h2v4h-2v-4ZM2 11h4v2H2v-2Zm16 0h4v2h-4v-2ZM5.636 4.222l1.414-1.414l2.828 2.828L8.464 7.05L5.636 4.222Zm8.486 8.485l2.828 2.829l-1.414 1.414l-2.828-2.828l1.414-1.415Zm2.828-8.485l1.414 1.414L15.536 7.05l-1.414-1.414L16.95 4.222ZM8.464 12.707l1.414 1.414l-2.828 2.828l-1.414-1.414l2.828-2.828ZM12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8Z" />
    </Base>
  ),
  Box: (p) => (
    <Base {...p} strokeWidth={0} fill="currentColor">
      <path d="m12 2l9 4.5v11L12 22L3 17.5v-11L12 2Zm0 2.236L5 7l7 3.5L19 7l-7-2.764ZM5 9.618v6.118l6 3V12.62L5 9.618Zm14 0l-6 3.002v6.116l6-3V9.618Z" />
    </Base>
  ),
  Tower: (p) => (
    <Base {...p} strokeWidth={0} fill="currentColor">
      <path d="M11 2h2v4h-2V2Zm7.778 2.222l1.414 1.414-2.828 2.828-1.414-1.414 2.828-2.828ZM2.808 3.636 4.222 2.222 7.05 5.05 5.636 6.464 2.808 3.636ZM12 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-2 6h4l3 8h-2l-1-3h-2l-1 3H7l3-8Zm2.5 3-.5-1.333L11.5 17h1Z" />
    </Base>
  ),
};

/* ------------------------------------------------------------------ */
/* Social links                                                        */
/* ------------------------------------------------------------------ */
export const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com", Icon: Icon.Instagram },
  { name: "Twitter", href: "https://twitter.com", Icon: Icon.Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", Icon: Icon.LinkedIn },
  {
    name: "WhatsApp",
    href: "https://wa.me/2349166876907",
    Icon: Icon.WhatsApp,
  },
];

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */
export const slugify = (t = "") =>
  t
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

export const getEnv = (viteKey, craKey) => {
  const vite =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env[viteKey]
      : undefined;
  if (vite !== undefined) return vite;
  const cra =
    typeof process !== "undefined" && process.env
      ? process.env[craKey]
      : undefined;
  return cra;
};

/* ---------------------------- Admin (PIN-gated) ---------------------------- */
const ADMIN_PIN =
  getEnv("VITE_HILLSTAR_ADMIN_PIN", "REACT_APP_HILLSTAR_ADMIN_PIN") ||
  "0809130732800";

const okKey = (ns) => `hillstar.admin.ok.${ns || "global"}`;

export const adminIsAuthorized = (ns = "global") =>
  typeof localStorage !== "undefined" &&
  localStorage.getItem(okKey(ns)) === "1";

export const adminLogin = (ns = "global") => {
  if (!ADMIN_PIN) {
    alert(
      "Admin PIN is not configured. Set VITE_HILLSTAR_ADMIN_PIN (Vite) or REACT_APP_HILLSTAR_ADMIN_PIN (CRA)."
    );
    return false;
  }
  const pin = window.prompt("Enter admin PIN:");
  if (!pin) return false;
  const ok = pin === ADMIN_PIN;
  if (ok) localStorage.setItem(okKey(ns), "1");
  if (!ok) alert("Incorrect PIN.");
  return ok;
};

export const adminLogout = (ns = "global") => {
  localStorage.removeItem(okKey(ns));
};

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */
export const useViewport = () => {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onR = () => setW(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return w;
};

export const useScrollY = () => {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onS = () => setY(window.scrollY || window.pageYOffset || 0);
    onS();
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return y;
};

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                    */
/* ------------------------------------------------------------------ */
export const smallCta = () => ({
  padding: "8px 12px",
  borderRadius: 8,
  background: "#eee",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
});

export const tabBtn = (active) => ({
  padding: "10px 14px",
  borderRadius: 999,
  border: active ? "2px solid " + BRAND.red : "1px solid #ddd",
  background: active ? "rgba(225,29,72,.08)" : "#fff",
  fontWeight: 900,
  cursor: "pointer",
});

/* ------------------------------------------------------------------ */
/* Header (TopBar + Navbar)                                            */
/* ------------------------------------------------------------------ */
export function Header() {
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = vw <= 900;

  // Prevent body scroll when mobile menu is open (improves mobile UX)
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const MenuLink = ({ to, children }) => (
    <Link
      to={to}
      style={{
        color: "#fff",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: "clamp(12px, 1.4vw, 14px)",
      }}
    >
      {children}
    </Link>
  );

  return (
    <>
      {/* Top strip */}
      <div
        style={{
          background: BRAND.darkGray,
          color: "#fff",
          fontSize: "clamp(12px, 1.6vw, 13px)",
          padding: "6px 0",
        }}
      >
        <div
          style={{
            width: "min(1200px,92vw)",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Phone size={16} />
              <span>
                <span style={{ color: BRAND.red }}>Free Call</span> +234 916 687
                6907
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Location size={16} />
              <span>
                <span style={{ color: BRAND.red }}>Our Location:</span> 25
                Kayode Otitoju, Off Admiralty Way, Lekki, Lagos, Nigeria
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>Connect with us</span>
            {SOCIALS.slice(0, 4).map(({ name, href, Icon: IC }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                style={{ color: "#fff" }}
              >
                <IC size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div
        style={{
          background: scrollY > 8 ? BRAND.black : "rgba(11,11,11,0.85)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: scrollY > 8 ? "0 6px 20px rgba(0,0,0,.25)" : "none",
          backdropFilter: "saturate(180%) blur(8px)",
        }}
      >
        <div
          style={{
            width: "min(1200px,92vw)",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 70,
          }}
        >
          <div
            onClick={() => nav("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <img
              src="/assets/hillstar-logo.png"
              alt="logo"
              style={{ height: 40 }}
            />
            <span
              style={{
                color: BRAND.red,
                fontWeight: 900,
                fontSize: "clamp(18px, 2vw, 20px)",
              }}
            >
              Hillstar
            </span>
          </div>

          <div
            style={{
              display: isMobile ? "none" : "flex",
              gap: 20,
              alignItems: "center",
            }}
          >
            <MenuLink to="/">HOME</MenuLink>
            <MenuLink to="/about">ABOUT</MenuLink>
            <MenuLink to="/services">OUR SERVICES</MenuLink>
            <MenuLink to="/projects">OUR WORK</MenuLink>
            <MenuLink to="/contact">CONTACT US</MenuLink>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              display: isMobile ? "block" : "none",
              background: "none",
              border: "none",
              color: "#fff",
            }}
          >
            <Icon.Burger />
          </button>
        </div>

        {menuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.94)",
              color: "#fff",
              zIndex: 2000,
              overflowY: "auto",
            }}
          >
            <div style={{ position: "absolute", top: 12, right: 12 }}>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{ background: "none", border: "none", color: "#fff" }}
              >
                <Icon.X />
              </button>
            </div>
            <div
              style={{
                width: "min(1200px,92vw)",
                margin: "0 auto",
                padding: "42px 0",
                textAlign: "center",
                display: "grid",
                gap: 18,
              }}
            >
              {[
                { t: "HOME", to: "/" },
                { t: "ABOUT", to: "/about" },
                { t: "OUR SERVICES", to: "/services" },
                { t: "OUR WORK", to: "/projects" },
                { t: "CONTACT US", to: "/contact" },
              ].map((i) => (
                <Link
                  key={i.t}
                  to={i.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "clamp(20px, 3.2vw, 24px)",
                    fontWeight: 800,
                  }}
                >
                  {i.t}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Footer (multi-column like screenshot)                               */
/* ------------------------------------------------------------------ */
export function Footer({ year = new Date().getFullYear() }) {
  const vw = useViewport();
  const isDesktop = vw >= 900;

  const gridCols = isDesktop ? "repeat(12, minmax(0, 1fr))" : "1fr";
  const col = (span) => (isDesktop ? `span ${span}` : "auto");

  return (
    <footer style={{ background: "#f6f6f6", color: "#111" }}>
      <div
        style={{
          width: "min(1200px,92vw)",
          margin: "0 auto",
          padding: isDesktop ? "36px 0 22px" : "28px 0 18px",
          display: "grid",
          gap: isDesktop ? 24 : 18,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: gridCols,
          }}
        >
          {/* Brand + blurb */}
          <div style={{ gridColumn: col(4) }}>
            <img
              src="/assets/hillstar-logo.png"
              alt="Hillstar Logo"
              style={{ height: 24 }}
            />
            <p
              style={{
                marginTop: 12,
                maxWidth: 360,
                fontSize: "clamp(14px,1.6vw,15px)",
              }}
            >
              With deep <b>Knowledge</b>, <b>Integrity</b> and <b>Passion</b>{" "}
              for Service, we turn property goals to lasting realities.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {[Icon.Instagram, Icon.Twitter, Icon.LinkedIn, Icon.WhatsApp].map(
                (IC, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="social"
                    style={{
                      background: BRAND.red,
                      color: "#fff",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <IC size={18} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Offers */}
          <div style={{ gridColumn: col(2) }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Offers</div>
            <div style={{ display: "grid", gap: 8 }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Home
              </Link>
              <Link
                to="/about"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                About
              </Link>
            </div>
          </div>

          {/* Company */}
          <div style={{ gridColumn: col(3) }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Company</div>
            <div style={{ display: "grid", gap: 8 }}>
              <Link
                to="/services"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Our Services
              </Link>
              <Link
                to="/projects"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Our Work
              </Link>
            </div>
          </div>

          {/* Quick Links + Contact */}
          <div style={{ gridColumn: col(3) }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Quick Links</div>
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              <Link
                to="/contact"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Contact Us
              </Link>
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                Terms &amp; Conditions
              </a>
            </div>

            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              Have a Question?
            </div>
            <div
              style={{
                display: "grid",
                gap: 4,
                fontSize: "clamp(13px,1.6vw,14px)",
                lineHeight: 1.5,
              }}
            >
              <div>25 Kayode Otitoju, OFF Admiralty Way,</div>
              <div>Lekki, Lagos, Nigeria</div>
              <div>Tel: +234 916 687 6907</div>
              <div>info@hillstar.com.ng</div>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "clamp(12px, 1.4vw, 13px)",
            opacity: 0.85,
            marginTop: 8,
          }}
        >
          Copyright © {year} All rights reserved | Hillstar Nig Ltd
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Floating CTA (Fab)                                                  */
/* ------------------------------------------------------------------ */
export function Fab({
  phone = "+2349166876907",
  email = "info@hillstar.com.ng",
  instagram = "https://instagram.com",
  twitter = "https://twitter.com",
  linkedin = "https://linkedin.com",
  whatsapp = "https://wa.me/2349166876907",
  label = "Talk to us",
}) {
  const [open, setOpen] = useState(false);
  const item = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#fff",
    textDecoration: "none",
    padding: "8px 8px",
    borderRadius: 10,
  };
  const badge = {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    background: "#2a2a2a",
    borderRadius: 8,
  };

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 5000 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 64,
            background: "#111",
            color: "#fff",
            borderRadius: 14,
            padding: 10,
            boxShadow: "0 10px 24px rgba(0,0,0,.35)",
            width: 220,
            maxWidth: "92vw",
          }}
        >
          <a href={instagram} target="_blank" rel="noreferrer" style={item}>
            <span style={badge}>
              <Icon.Instagram size={18} />
            </span>
            <span>Instagram</span>
          </a>
          <a href={twitter} target="_blank" rel="noreferrer" style={item}>
            <span style={badge}>
              <Icon.Twitter size={18} />
            </span>
            <span>Twitter</span>
          </a>
          <a href={linkedin} target="_blank" rel="noreferrer" style={item}>
            <span style={badge}>
              <Icon.LinkedIn size={18} />
            </span>
            <span>LinkedIn</span>
          </a>
          <a href={whatsapp} target="_blank" rel="noreferrer" style={item}>
            <span style={badge}>
              <Icon.WhatsApp size={18} />
            </span>
            <span>WhatsApp</span>
          </a>
          <a href={`mailto:${email}`} style={item}>
            <span style={badge}>
              <Icon.Mail size={18} />
            </span>
            <span>Email</span>
          </a>
          <a href={`tel:${phone}`} style={item}>
            <span style={badge}>
              <Icon.Phone size={18} />
            </span>
            <span>Call</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 18px",
          border: "none",
          borderRadius: 999,
          background: BRAND.red,
          color: "#fff",
          fontWeight: 900,
          boxShadow: "0 10px 24px rgba(0,0,0,.35)",
          cursor: "pointer",
          fontSize: "clamp(13px,1.8vw,14px)",
        }}
      >
        <Icon.Phone size={18} />
        {label}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout helpers used by pages (restored)                             */
/* ------------------------------------------------------------------ */
export function HeroStrip({ title, subtitle }) {
  const vw = useViewport();
  const titleSize = vw > 900 ? 38 : vw > 600 ? 30 : 24;

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,.75), rgba(0,0,0,.65)), url(/assets/hero3.png) center/cover no-repeat",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "min(1200px,92vw)",
          margin: "0 auto",
          padding: vw > 600 ? "56px 0" : "38px 0",
        }}
      >
        <div style={{ fontSize: titleSize, fontWeight: 900 }}>{title}</div>
        {subtitle ? (
          <div style={{ opacity: 0.9, marginTop: 6 }}>{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}

export function Section({ title, subtitle, children, extraRight }) {
  const vw = useViewport();
  return (
    <section style={{ background: "#fafafa" }}>
      <div
        style={{
          width: "min(1200px,92vw)",
          margin: "0 auto",
          padding: vw > 600 ? "26px 0" : "18px 0",
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: vw > 600 ? 26 : 22,
                fontWeight: 900,
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div style={{ opacity: 0.8, marginTop: 4 }}>{subtitle}</div>
            ) : null}
          </div>
          {extraRight || null}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------- Stable, Responsive Video -------------------------------
   - Reuses the same <video> element (no remount flicker)
   - Only assigns .src when it *actually* changes
   - Persists playhead per source in sessionStorage
   - Pauses when scrolled out of view (saves power) */
export function VideoPlayer({ src, label, ratio = 16 / 9, poster, persistId }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);
  const lastSrcRef = useRef("");

  const padPct = `${Math.round((100 / ratio) * 1000) / 1000}%`;
  const keyFor = (s) => `vidpos:${persistId || s || "video"}`;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const assignSrcIfNeeded = () => {
      if (src && lastSrcRef.current !== src) {
        // Save previous video's position before switching
        if (lastSrcRef.current) {
          try {
            sessionStorage.setItem(
              keyFor(lastSrcRef.current),
              String(v.currentTime || 0)
            );
          } catch {}
        }
        v.src = src;
        lastSrcRef.current = src;
      }
    };

    const restore = () => {
      try {
        const s = sessionStorage.getItem(keyFor(lastSrcRef.current));
        const t = s ? parseFloat(s) : NaN;
        if (!Number.isNaN(t)) v.currentTime = t;
      } catch {}
    };
    const save = () => {
      try {
        sessionStorage.setItem(
          keyFor(lastSrcRef.current),
          String(v.currentTime || 0)
        );
      } catch {}
    };

    assignSrcIfNeeded();

    v.addEventListener("loadedmetadata", restore);
    v.addEventListener("timeupdate", save);
    v.addEventListener("pause", save);
    const onVis = () => document.hidden && save();
    const onHide = () => save();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);

    // Pause when out of view
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => {
          if (!v) return;
          if (!e.isIntersecting && !v.paused) v.pause();
        },
        { threshold: 0.01 }
      );
      io.observe(v);
    }

    return () => {
      v.removeEventListener("loadedmetadata", restore);
      v.removeEventListener("timeupdate", save);
      v.removeEventListener("pause", save);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
      if (io) io.disconnect();
    };
  }, [src, persistId]);

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          fontWeight: 800,
          borderBottom: "1px solid #eee",
          fontSize: "clamp(14px,1.8vw,15px)",
        }}
      >
        {label || "Video"}
      </div>

      {/* Wrapper uses aspectRatio + paddingTop fallback */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: `${ratio}`,
          paddingTop: padPct,
          background: "#000",
        }}
      >
        <video
          ref={ref}
          // src intentionally NOT set here; we assign it imperatively to avoid reloads
          controls
          playsInline
          // @ts-ignore for older iOS Safari
          webkit-playsinline="true"
          preload="metadata"
          poster={poster}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            background: "#000",
          }}
          aria-label={label || "Video"}
        />

        {!playing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
              color: "#fff",
            }}
          >
            <Icon.Play size={40} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Spec({ label, value, wide }) {
  return (
    <div
      style={{ display: "grid", gap: 3, gridColumn: wide ? "1 / -1" : "auto" }}
    >
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{ fontWeight: 800 }}>{value || "—"}</div>
    </div>
  );
}

export function BookingForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    from: "",
    to: "",
    notes: "",
  });
  const on = (k) => (e) => setState((s) => ({ ...s, [k]: e.target.value }));
  const input = {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 10,
    width: "100%",
  };
  function submit(e) {
    e.preventDefault();
    const body = [
      `Name: ${state.name}`,
      `Email: ${state.email}`,
      `From: ${state.from}`,
      `To: ${state.to}`,
      `Notes: ${state.notes}`,
    ].join("%0A");
    window.location.href = `mailto:info@hillstar.com.ng?subject=Booking enquiry&body=${body}`;
  }
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <input
          style={input}
          placeholder="Your name"
          value={state.name}
          onChange={on("name")}
        />
        <input
          style={input}
          placeholder="Your email"
          value={state.email}
          onChange={on("email")}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <input
          style={input}
          type="date"
          value={state.from}
          onChange={on("from")}
        />
        <input style={input} type="date" value={state.to} onChange={on("to")} />
      </div>
      <textarea
        style={{ ...input, minHeight: 80 }}
        placeholder="Notes"
        value={state.notes}
        onChange={on("notes")}
      />
      <button
        type="submit"
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "none",
          background: BRAND.red,
          color: "#fff",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        Send Enquiry
      </button>
    </form>
  );
}
