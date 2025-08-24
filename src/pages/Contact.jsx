// src/pages/Contact.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

/* ----------------------------- Local theme ----------------------------- */
const BRAND = {
  red: "#e11d2a",
  darkGray: "#141414",
  black: "#0b0b0b",
  gray: "#f5f7fb",
  white: "#ffffff",
};

/* ------------------------------ Local hooks ---------------------------- */
function useViewport() {
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vw;
}

function useScrollY() {
  const [y, setY] = useState(
    typeof window !== "undefined" ? window.pageYOffset : 0
  );
  useEffect(() => {
    const onScroll = () => setY(window.pageYOffset || window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/* ------------------------------ Local icons ---------------------------- */
const Svg = {
  Building: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M4 21h16v-2H4v2Zm2-4h4v-3H6v3Zm6 0h4v-3h-4v3ZM6 12h4V9H6v3Zm6 0h4V5h-4v7ZM5 21V7l7-4l7 4v14H5Z"
      />
    </svg>
  ),
  Heart: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M12 21s-6.716-4.269-9.192-7.045C.78 11.77 1.057 8.4 3.343 6.515C5.63 4.63 8.4 5 10 6.6L12 8.6l2-2c1.6-1.6 4.37-1.97 6.657-.085c2.286 1.885 2.563 5.255.535 7.44C18.716 16.731 12 21 12 21Z"
      />
    </svg>
  ),
  Solar: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M11 2h2v4h-2V2Zm0 16h2v4h-2v-4ZM2 11h4v2H2v-2Zm16 0h4v2h-4v-2ZM5.636 4.222l1.414-1.414l2.828 2.828L8.464 7.05L5.636 4.222Zm8.486 8.485l2.828 2.829l-1.414 1.414l-2.828-2.828l1.414-1.415Zm2.828-8.485l1.414 1.414L15.536 7.05l-1.414-1.414L16.95 4.222ZM8.464 12.707l1.414 1.414l-2.828 2.828l-1.414-1.414l2.828-2.828ZM12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8Z"
      />
    </svg>
  ),
  Box: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="m12 2l9 4.5v11L12 22L3 17.5v-11L12 2Zm0 2.236L5 7l7 3.5L19 7l-7-2.764ZM5 9.618v6.118l6 3V12.62L5 9.618Zm14 0l-6 3.002v6.116l6-3V9.618Z"
      />
    </svg>
  ),
  Tower: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M11 2h2v4h-2V2Zm7.778 2.222l1.414 1.414l-2.828 2.828l-1.414-1.414l2.828-2.828ZM2.808 3.636l1.414-1.414l2.828 2.828L5.636 6.464L2.808 3.636ZM12 8a2 2 0 1 1 0 4a2 2 0 0 1 0-4Zm-2 6h4l3 8h-2l-1-3h-2l-1 3H7l3-8Zm2.5 3l-.5-1.333L11.5 17h1Z"
      />
    </svg>
  ),
  Phone: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M6.62 10.79a15.464 15.464 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.85 22 2 13.15 2 2a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"
      />
    </svg>
  ),
  Location: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
      />
    </svg>
  ),
  Burger: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"
      />
    </svg>
  ),
  X: ({ size = 20, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="m18.3 5.71-1.41-1.42L12 9.17 7.11 4.29 5.7 5.71 10.59 10.6 5.7 15.49l1.41 1.41L12 12l4.89 4.9 1.41-1.41L13.41 10.6l4.89-4.89Z"
      />
    </svg>
  ),
  WhatsApp: ({ size = 18, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" {...p}>
      <path
        fill="currentColor"
        d="M128 26C73.4 26 29 70.3 29 124.9c0 21.8 7.3 42 19.7 58.1L34 230l48.5-14.9c16.5 10.1 35.9 15.9 56.9 15.9c54.6 0 98.9-44.4 98.9-99S182.6 26 128 26Zm0 180.6c-19 0-36.5-6.1-50.7-16.5l-3.6-2.6l-28.9 8.9l9.2-28l-2.9-3.8c-11.2-14.8-17.9-33.2-17.9-53C33.2 76.5 76 33.7 128 33.7s94.8 42.8 94.8 94.8S180 206.6 128 206.6Zm56.2-62.5c-3.1-1.6-18.1-8.9-20.9-9.9c-2.8-1-4.8-1.6-6.9 1.6s-7.9 9.9-9.7 12c-1.8 2.1-3.6 2.3-6.7.8c-3.1-1.6-13.1-4.8-24.9-15.2c-9.2-8.2-15.5-18.4-17.3-21.5c-1.8-3.1-.2-4.8 1.3-6.4c1.4-1.4 3.1-3.6 4.7-5.4c1.6-1.8 2.1-3.1 3.1-5.1c1-2.1.5-3.9-.3-5.4c-.8-1.6-6.9-16.6-9.4-22.8c-2.5-6.2-5.1-5.3-6.9-5.4c-1.8-.1-3.9-.1-6-.1s-5.4.8-8.2 3.9c-2.8 3.1-10.8 10.5-10.8 25.6s11.1 29.7 12.6 31.8c1.6 2.1 21.8 33.2 53 46.5c7.4 3.2 13.1 5.1 17.6 6.5c7.4 2.4 14.1 2.1 19.4 1.3c5.9-.9 18.1-7.4 20.6-14.5c2.6-7.1 2.6-13.2 1.8-14.5c-.9-1.2-3-2-6.1-3.5Z"
      />
    </svg>
  ),
};

const Icon = {
  Building: Svg.Building,
  Heart: Svg.Heart,
  Solar: Svg.Solar,
  Box: Svg.Box,
  Tower: Svg.Tower,
  Phone: Svg.Phone,
  Location: Svg.Location,
  Burger: Svg.Burger,
  X: Svg.X,
  WhatsApp: Svg.WhatsApp,
};

/* --------------------------- Local social list ------------------------- */
const Social = {
  Facebook: ({ size = 18, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.14 8.44 9.93v-7.02H7.9V12.1h2.54V9.86c0-2.5 1.49-3.89 3.77-3.89c1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.93h2.78l-.44 2.88h-2.34V22c4.78-.79 8.44-4.93 8.44-9.93Z"
      />
    </svg>
  ),
  Twitter: ({ size = 18, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M22 5.8c-.7.3-1.4.5-2.1.6c.8-.5 1.3-1.2 1.6-2.1c-.7.4-1.6.8-2.5 1C18.2 4.5 17.1 4 16 4c-2.2 0-4 1.8-4 4c0 .3 0 .7.1 1C8.3 8.8 5.1 7.1 3 4.6C2.6 5.3 2.4 6.1 2.4 7c0 1.4.7 2.7 1.8 3.5c-.6 0-1.2-.2-1.7-.5v.1c0 2 1.4 3.7 3.3 4.1c-.3.1-.7.1-1 .1c-.2 0-.5 0-.7-.1c.5 1.7 2.1 2.9 3.9 2.9c-1.4 1.1-3.1 1.7-5 1.7c-.3 0-.7 0-1-.1c1.8 1.1 3.9 1.8 6.2 1.8c7.4 0 11.5-6.1 11.5-11.5v-.5c.8-.5 1.4-1.2 1.9-2Z"
      />
    </svg>
  ),
  Instagram: ({ size = 18, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11 2a1 1 0 1 1 0 2a1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 15.8A2.8 2.8 0 0 0 12 9.2Z"
      />
    </svg>
  ),
  LinkedIn: ({ size = 18, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5S1.12 1 2.5 1S4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.7v2.2h.1c.7-1.2 2.4-2.5 4.9-2.5c5.2 0 6.2 3.4 6.2 7.8V24h-5v-7.1c0-1.7 0-3.9-2.4-3.9c-2.4 0-2.8 1.9-2.8 3.8V24H8z"
      />
    </svg>
  ),
};

const SOCIALS = [
  { name: "Facebook", href: "#", Icon: Social.Facebook },
  { name: "Twitter", href: "#", Icon: Social.Twitter },
  { name: "Instagram", href: "#", Icon: Social.Instagram },
  { name: "LinkedIn", href: "#", Icon: Social.LinkedIn },
];

/* ===================================================================== */

export default function Contact() {
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const location = useLocation();
  const isWide = vw > 900;

  /* ------------------------------ NAV CHROME ------------------------------ */
  const TopBar = () => (
    <div
      style={{
        background: BRAND.darkGray,
        color: "#fff",
        fontSize: 13,
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
              <span style={{ color: BRAND.red }}>Our Location:</span> 25 Kayode
              Otitoju, Off Admiralty Way, Lekki, Lagos
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>Connect with us</span>
          {SOCIALS.slice(0, 3).map(({ name, href, Icon: IC }) => (
            <a
              key={name}
              href={href}
              aria-label={name}
              style={{ color: "#fff" }}
            >
              <IC size={18} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  function MenuOverlay({ onClose }) {
    useEffect(() => {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }, []);
    const primary = [
      { t: "HOME", to: "/" },
      { t: "ABOUT", to: "/about" },
      { t: "OUR SERVICES", to: "/services" },
      { t: "OUR WORK", to: "/projects" },
      { t: "CONTACT US", to: "/contact" },
    ];
    const sectors = [
      { t: "Real Estate", to: "/real-estate", Icon: Icon.Building },
      { t: "Hospitality", to: "/hospitality", Icon: Icon.Heart },
      { t: "Renewable Energy", to: "/renewable", Icon: Icon.Solar },
      { t: "Procurement", to: "/procurement", Icon: Icon.Box },
      { t: "Telecom & Tech", to: "/telecom", Icon: Icon.Tower },
    ];
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.94)",
          zIndex: 2000,
          color: "#fff",
          overflowY: "auto",
        }}
      >
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ background: "none", border: "none", color: "#fff" }}
          >
            <Svg.X />
          </button>
        </div>
        <div
          style={{
            width: "min(1200px,92vw)",
            margin: "0 auto",
            padding: "40px 0",
            display: "grid",
            gap: 24,
            gridTemplateColumns: isWide ? "1.05fr 1fr" : "1fr",
          }}
        >
          <nav
            style={{
              textAlign: isWide ? "left" : "center",
              display: "grid",
              gap: 18,
            }}
          >
            {primary.map((l) => (
              <Link
                key={l.t}
                to={l.to}
                onClick={onClose}
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                {l.t}
              </Link>
            ))}
          </nav>
          <aside
            style={{
              borderLeft: isWide ? "1px solid rgba(255,255,255,.12)" : "none",
              paddingLeft: isWide ? 20 : 0,
              display: "grid",
              gap: 16,
              textAlign: isWide ? "left" : "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, opacity: 0.85, marginBottom: 8 }}>
                Sectors
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(2,1fr)",
                }}
              >
                {sectors.map((s) => (
                  <Link
                    key={s.t}
                    to={s.to}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      border: "1px solid rgba(255,255,255,.15)",
                      borderRadius: 10,
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    <s.Icon size={20} style={{ color: BRAND.red }} />
                    <span style={{ fontWeight: 700 }}>{s.t}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 800, opacity: 0.85, margin: "8px 0" }}>
                Contact
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <a
                  href="tel:+2349166876907"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  +234 916 687 6907
                </a>
                <a
                  href="mailto:info@hillstar.com.ng"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  info@hillstar.com.ng
                </a>
                <div style={{ opacity: 0.85 }}>
                  25 Kayode Otitoju, Off Admiralty Way, Lekki, Lagos
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: isWide ? "flex-start" : "center",
              }}
            >
              {SOCIALS.slice(0, 4).map(({ name, href, Icon: IC }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
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
              ))}
            </div>
            <Link
              to="/contact"
              onClick={onClose}
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  marginTop: 8,
                  background: BRAND.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontWeight: 900,
                  width: isWide ? "fit-content" : "100%",
                }}
              >
                Get in touch
              </button>
            </Link>
          </aside>
        </div>
      </div>
    );
  }

  const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = vw <= 900;
    const bg = scrollY > 8 ? BRAND.black : `rgba(11,11,11,0.85)`;
    const shadow = scrollY > 8 ? "0 6px 20px rgba(0,0,0,.25)" : "none";
    const MenuLink = ({ to, children }) => (
      <Link
        to={to}
        style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}
      >
        {children}
      </Link>
    );
    return (
      <div
        style={{
          background: bg,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: shadow,
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
            <span style={{ color: BRAND.red, fontWeight: 900, fontSize: 20 }}>
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
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      </div>
    );
  };

  /* --------------------------------- UI HELPERS -------------------------------- */
  const Section = ({ children, style }) => (
    <section style={{ padding: "48px 0", background: "#fff", ...style }}>
      <div style={{ width: "min(1200px,92vw)", margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
  const smallCta = () => ({
    padding: "10px 12px",
    borderRadius: 10,
    background: "#eee",
    border: "1px solid #ddd",
    fontWeight: 800,
    cursor: "pointer",
  });
  const input = {
    padding: "12px 12px",
    border: "1px solid #ddd",
    borderRadius: 10,
    width: "100%",
  };
  const label = { fontWeight: 800, fontSize: 13 };
  const Row = ({ children }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: vw > 900 ? "1fr 1fr" : "1fr",
        gap: 12,
      }}
    >
      {children}
    </div>
  );

  /* --------------------------------- FORM --------------------------------- */
  const qs = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const prefillRef = qs.get("ref") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Enquiry",
    message: "",
    // anti-spam
    honey: "",
    mathA: Math.floor(1 + Math.random() * 4),
    mathB: Math.floor(1 + Math.random() * 4),
    mathAnswer: "",
    // Real Estate
    re_intent: "Buy",
    re_bedrooms: "Any",
    re_budgetMin: "",
    re_budgetMax: "",
    re_locations: {
      Ikoyi: false,
      Lekki: false,
      VI: false,
      Ikate: false,
      Oniru: false,
      Other: "",
    },
    re_preferredDate: "",
    re_preferredTime: "",
    re_propertyRef: prefillRef,
    // Hospitality
    h_checkIn: "",
    h_checkOut: "",
    h_guests: 1,
    h_rooms: 1,
    // RFP
    rfp_org: "",
    rfp_budget: "",
    rfp_deadline: "",
    rfp_files: [],
    // Careers
    cv_files: [],
    consent: true,
  });
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    const req = (k, label = k) => {
      if (!String(form[k] || "").trim()) e[k] = `${label} is required`;
    };
    req("name", "Full name");
    req("email", "Email");
    req("phone", "Phone");

    if (form.honey) e.honey = "Spam detected";
    if (String(Number(form.mathAnswer)) !== String(form.mathA + form.mathB))
      e.mathAnswer = "Wrong answer";

    if (form.category === "Real Estate Viewing") {
      req("re_preferredDate", "Preferred date");
      req("re_preferredTime", "Preferred time");
    }
    if (form.category === "Hospitality Booking") {
      req("h_checkIn", "Check-in date");
      req("h_checkOut", "Check-out date");
    }
    if (form.category === "Procurement / Renewable RFP") {
      req("rfp_org", "Organization");
      req("rfp_budget", "Budget");
    }
    if (!form.consent) e.consent = "Consent required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFiles = (k) => (e) =>
    set(
      k,
      Array.from(e.target.files || []).map((f) => f.name)
    );

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const bodyLines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Category: ${form.category}`,
      "",
    ];

    if (form.category === "Real Estate Viewing") {
      const locs = Object.entries(form.re_locations)
        .filter(([k, v]) => v === true)
        .map(([k]) => k);
      if (form.re_locations.Other)
        locs.push(`Other: ${form.re_locations.Other}`);
      bodyLines.push(
        `Intent: ${form.re_intent}`,
        `Bedrooms: ${form.re_bedrooms}`,
        `Budget: ${form.re_budgetMin || "..."} - ${form.re_budgetMax || "..."}`,
        `Locations: ${locs.join(", ") || "Any"}`,
        `Preferred: ${form.re_preferredDate} ${form.re_preferredTime}`,
        `Property Ref: ${form.re_propertyRef || "-"}`,
        ""
      );
    }
    if (form.category === "Hospitality Booking") {
      bodyLines.push(
        `Check-in: ${form.h_checkIn}`,
        `Check-out: ${form.h_checkOut}`,
        `Guests: ${form.h_guests}`,
        `Rooms: ${form.h_rooms}`,
        ""
      );
    }
    if (form.category === "Procurement / Renewable RFP") {
      bodyLines.push(
        `Organization: ${form.rfp_org}`,
        `Budget: ${form.rfp_budget}`,
        `Deadline: ${form.rfp_deadline || "-"}`,
        `Attachments: ${form.rfp_files.join(", ") || "-"}`,
        ""
      );
    }
    if (form.category === "Careers") {
      bodyLines.push(`CV/Portfolio: ${form.cv_files.join(", ") || "-"}`, "");
    }
    if (form.message) bodyLines.push("Message:", form.message);

    const subject = `[${form.category}] ${form.name}`;
    const body = bodyLines.join("\n");
    const mailto = `mailto:info@hillstar.com.ng?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    const whatsapp = `https://wa.me/2349166876907?text=${encodeURIComponent(
      subject + "\n\n" + body
    )}`;
    setReview({ mailto, whatsapp, subject, body });
  };

  /* --------------------------------- PAGE --------------------------------- */
  return (
    <>
      <TopBar />
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: `url(/assets/hero3.png) center/cover no-repeat`,
          color: "#fff",
          position: "relative",
          height: 300,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.55)",
          }}
        />
        <div style={{ position: "relative", width: "min(900px,92vw)" }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>
            Contact Hillstar
          </h1>
          <p style={{ marginTop: 8, fontSize: 18 }}>
            Let’s discuss your project, schedule a viewing, or book a stay.
          </p>
        </div>
      </div>

      {/* Contact Info + Form */}
      <Section>
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: vw > 1000 ? "1.1fr 1fr" : "1fr",
          }}
        >
          {/* Left: Form */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.honey}
                onChange={(e) => set("honey", e.target.value)}
                style={{
                  position: "absolute",
                  left: "-10000px",
                  top: "-10000px",
                }}
              />

              <Row>
                <div>
                  <div style={label}>Full Name</div>
                  <input
                    style={input}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Jane Doe"
                  />
                  {errors.name && (
                    <div style={{ color: "crimson", fontSize: 12 }}>
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <div style={label}>Email</div>
                  <input
                    style={input}
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div style={{ color: "crimson", fontSize: 12 }}>
                      {errors.email}
                    </div>
                  )}
                </div>
              </Row>

              <Row>
                <div>
                  <div style={label}>Phone</div>
                  <input
                    style={input}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+234..."
                  />
                  {errors.phone && (
                    <div style={{ color: "crimson", fontSize: 12 }}>
                      {errors.phone}
                    </div>
                  )}
                </div>
                <div>
                  <div style={label}>Category</div>
                  <select
                    style={input}
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    <option>General Enquiry</option>
                    <option>Real Estate Viewing</option>
                    <option>Hospitality Booking</option>
                    <option>Procurement / Renewable RFP</option>
                    <option>Careers</option>
                  </select>
                </div>
              </Row>

              {/* Conditional sections */}
              {form.category === "Real Estate Viewing" && (
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 10,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>Viewing Details</div>
                  <Row>
                    <div>
                      <div style={label}>Intent</div>
                      <select
                        style={input}
                        value={form.re_intent}
                        onChange={(e) => set("re_intent", e.target.value)}
                      >
                        <option>Buy</option>
                        <option>Rent</option>
                      </select>
                    </div>
                    <div>
                      <div style={label}>Bedrooms</div>
                      <select
                        style={input}
                        value={form.re_bedrooms}
                        onChange={(e) => set("re_bedrooms", e.target.value)}
                      >
                        {["Any", "1", "2", "3", "4", "5+"].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <div style={label}>Budget Min (₦)</div>
                      <input
                        style={input}
                        value={form.re_budgetMin}
                        onChange={(e) => set("re_budgetMin", e.target.value)}
                        placeholder="e.g. 50,000,000"
                      />
                    </div>
                    <div>
                      <div style={label}>Budget Max (₦)</div>
                      <input
                        style={input}
                        value={form.re_budgetMax}
                        onChange={(e) => set("re_budgetMax", e.target.value)}
                        placeholder="e.g. 200,000,000"
                      />
                    </div>
                  </Row>
                  <div>
                    <div style={label}>Preferred Locations</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["Ikoyi", "Lekki", "VI", "Ikate", "Oniru"].map((loc) => (
                        <label
                          key={loc}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            border: "1px solid #eee",
                            padding: "8px 10px",
                            borderRadius: 8,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={form.re_locations[loc] || false}
                            onChange={(e) =>
                              set("re_locations", {
                                ...form.re_locations,
                                [loc]: e.target.checked,
                              })
                            }
                          />
                          {loc}
                        </label>
                      ))}
                      <input
                        style={{ ...input, width: 220 }}
                        placeholder="Other (type)"
                        value={form.re_locations.Other}
                        onChange={(e) =>
                          set("re_locations", {
                            ...form.re_locations,
                            Other: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Row>
                    <div>
                      <div style={label}>Preferred Date</div>
                      <input
                        style={input}
                        type="date"
                        value={form.re_preferredDate}
                        onChange={(e) =>
                          set("re_preferredDate", e.target.value)
                        }
                      />
                      {errors.re_preferredDate && (
                        <div style={{ color: "crimson", fontSize: 12 }}>
                          {errors.re_preferredDate}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={label}>Preferred Time</div>
                      <input
                        style={input}
                        type="time"
                        value={form.re_preferredTime}
                        onChange={(e) =>
                          set("re_preferredTime", e.target.value)
                        }
                      />
                      {errors.re_preferredTime && (
                        <div style={{ color: "crimson", fontSize: 12 }}>
                          {errors.re_preferredTime}
                        </div>
                      )}
                    </div>
                  </Row>
                  <div>
                    <div style={label}>Property Reference (optional)</div>
                    <input
                      style={input}
                      value={form.re_propertyRef}
                      onChange={(e) => set("re_propertyRef", e.target.value)}
                      placeholder="e.g. 5-Bed Duplex, Ikoyi"
                    />
                  </div>
                </div>
              )}

              {form.category === "Hospitality Booking" && (
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 10,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>Booking Details</div>
                  <Row>
                    <div>
                      <div style={label}>Check-in</div>
                      <input
                        style={input}
                        type="date"
                        value={form.h_checkIn}
                        onChange={(e) => set("h_checkIn", e.target.value)}
                      />
                      {errors.h_checkIn && (
                        <div style={{ color: "crimson", fontSize: 12 }}>
                          {errors.h_checkIn}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={label}>Check-out</div>
                      <input
                        style={input}
                        type="date"
                        value={form.h_checkOut}
                        onChange={(e) => set("h_checkOut", e.target.value)}
                      />
                      {errors.h_checkOut && (
                        <div style={{ color: "crimson", fontSize: 12 }}>
                          {errors.h_checkOut}
                        </div>
                      )}
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <div style={label}>Guests</div>
                      <input
                        style={input}
                        type="number"
                        min={1}
                        value={form.h_guests}
                        onChange={(e) =>
                          set("h_guests", Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <div style={label}>Rooms</div>
                      <input
                        style={input}
                        type="number"
                        min={1}
                        value={form.h_rooms}
                        onChange={(e) => set("h_rooms", Number(e.target.value))}
                      />
                    </div>
                  </Row>
                </div>
              )}

              {form.category === "Procurement / Renewable RFP" && (
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 10,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>RFP Details</div>
                  <Row>
                    <div>
                      <div style={label}>Organization</div>
                      <input
                        style={input}
                        value={form.rfp_org}
                        onChange={(e) => set("rfp_org", e.target.value)}
                        placeholder="Company / Agency"
                      />
                      {errors.rfp_org && (
                        <div style={{ color: "crimson", fontSize: 12 }}>
                          {errors.rfp_org}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={label}>Budget (₦)</div>
                      <input
                        style={input}
                        value={form.rfp_budget}
                        onChange={(e) => set("rfp_budget", e.target.value)}
                        placeholder="E.g. 50,000,000"
                      />
                      {errors.rfp_budget && (
                        <div style={{ color: "crimson", fontSize: 12 }}>
                          {errors.rfp_budget}
                        </div>
                      )}
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <div style={label}>Deadline</div>
                      <input
                        style={input}
                        type="date"
                        value={form.rfp_deadline}
                        onChange={(e) => set("rfp_deadline", e.target.value)}
                      />
                    </div>
                    <div>
                      <div style={label}>Attachments (names only)</div>
                      <input
                        style={input}
                        type="file"
                        multiple
                        onChange={onFiles("rfp_files")}
                      />
                      <div
                        style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}
                      >
                        {form.rfp_files.length
                          ? form.rfp_files.join(", ")
                          : "No files chosen"}
                      </div>
                    </div>
                  </Row>
                </div>
              )}

              {form.category === "Careers" && (
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 10,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>Careers</div>
                  <div>
                    <div style={label}>Upload CV / Portfolio</div>
                    <input
                      style={input}
                      type="file"
                      multiple
                      onChange={onFiles("cv_files")}
                    />
                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                      {form.cv_files.length
                        ? form.cv_files.join(", ")
                        : "No files chosen"}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div style={label}>Message</div>
                <textarea
                  style={{ ...input, minHeight: 120, resize: "vertical" }}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Tell us a bit about your need…"
                />
              </div>

              {/* Privacy + math captcha */}
              <Row>
                <div>
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                    />
                    <span>I consent to be contacted by Hillstar.</span>
                  </label>
                  {errors.consent && (
                    <div style={{ color: "crimson", fontSize: 12 }}>
                      {errors.consent}
                    </div>
                  )}
                </div>
                <div>
                  <div style={label}>
                    Quick check: {form.mathA} + {form.mathB} = ?
                  </div>
                  <input
                    style={input}
                    value={form.mathAnswer}
                    onChange={(e) => set("mathAnswer", e.target.value)}
                  />
                  {errors.mathAnswer && (
                    <div style={{ color: "crimson", fontSize: 12 }}>
                      {errors.mathAnswer}
                    </div>
                  )}
                </div>
              </Row>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  style={{
                    ...smallCta(),
                    background: BRAND.red,
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Review &amp; Send
                </button>
                <a
                  href="tel:+2349166876907"
                  style={{ ...smallCta(), textDecoration: "none" }}
                >
                  <Icon.Phone /> Call us
                </a>
                <a
                  href="https://wa.me/2349166876907"
                  style={{ ...smallCta(), textDecoration: "none" }}
                >
                  <Icon.WhatsApp /> WhatsApp
                </a>
              </div>
              {Object.keys(errors).length > 0 && (
                <div style={{ color: "crimson", fontSize: 12 }}>
                  Please fix the highlighted fields.
                </div>
              )}
            </form>

            {/* Review panel */}
            {review && (
              <div
                style={{
                  marginTop: 16,
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 900, marginBottom: 8 }}>
                  Looks good! Send via:
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                    href={review.mailto}
                    style={{
                      ...smallCta(),
                      textDecoration: "none",
                      background: BRAND.red,
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Email
                  </a>
                  <a
                    href={review.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...smallCta(), textDecoration: "none" }}
                  >
                    WhatsApp
                  </a>
                </div>
                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 800 }}>
                    Preview message
                  </summary>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      background: "#f9f9f9",
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  >
                    {review.body}
                  </pre>
                </details>
              </div>
            )}
          </div>

          {/* Right: Contact cards */}
          <aside>
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 16,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 900, marginBottom: 6 }}>
                  Quick Contacts
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  <a
                    href="tel:+2349166876907"
                    style={{
                      textDecoration: "none",
                      color: "#111",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Icon.Phone />
                    <span>+234 916 687 6907</span>
                  </a>
                  <a
                    href="mailto:info@hillstar.com.ng"
                    style={{
                      textDecoration: "none",
                      color: "#111",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Icon.Location />
                    <span>info@hillstar.com.ng</span>
                  </a>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Icon.Location />
                    <span>25 Kayode Otitoju, Lekki, Lagos</span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Icon.Box />
                    <span>Mon–Fri: 9:00–17:30 • Sat: 10:00–14:00</span>
                  </div>
                </div>
              </div>

              {/* Branches */}
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 16,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Branches</div>
                {[
                  {
                    city: "Lagos (HQ)",
                    addr: "Lekki Phase 1",
                    phone: "+234 916 687 6907",
                  },
                  {
                    city: "Abuja",
                    addr: "Central Business District",
                    phone: "+234 000 000 0000",
                  },
                  {
                    city: "Port Harcourt",
                    addr: "Trans Amadi",
                    phone: "+234 000 000 0001",
                  },
                ].map((b) => (
                  <div
                    key={b.city}
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 10,
                      padding: 10,
                      display: "grid",
                      gap: 4,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{b.city}</div>
                    <div>{b.addr}</div>
                    <a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      style={{
                        color: BRAND.red,
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      {b.phone}
                    </a>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 16,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 900, marginBottom: 8 }}>
                  Follow Us
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {SOCIALS.slice(0, 4).map(({ name, href, Icon: IC }) => (
                    <a
                      key={name}
                      href={href}
                      aria-label={name}
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
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Map + FAQs */}
      <Section style={{ background: BRAND.gray }}>
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: vw > 1000 ? "1.1fr 1fr" : "1fr",
          }}
        >
          <div>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>
              Find us on the map
            </div>
            <iframe
              title="Hillstar HQ Map"
              style={{
                width: "100%",
                height: 320,
                border: 0,
                borderRadius: 12,
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                "25 Kayode Otitoju, Lekki Phase 1, Lagos"
              )}&output=embed`}
            />
          </div>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>FAQs</div>
            {[
              {
                q: "How soon can I schedule a property viewing?",
                a: "Typically within 24–48 hours. Use the Real Estate Viewing category and choose your preferred date/time.",
              },
              {
                q: "Do you manage short-let reservations directly?",
                a: "Yes. Submit the Hospitality Booking form and our team will confirm availability and payment options.",
              },
              {
                q: "What files should I attach for an RFP?",
                a: "A brief scope document, timelines, budget range and any technical drawings or BOQs available.",
              },
            ].map((f, i) => (
              <details
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 800 }}>
                  {f.q}
                </summary>
                <div style={{ marginTop: 8 }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section
        style={{ background: BRAND.black, color: "#fff", textAlign: "center" }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>
          Prefer a quick chat?
        </h2>
        <p style={{ opacity: 0.9, marginTop: 8 }}>
          Tap below to start a WhatsApp conversation with our team.
        </p>
        <a
          href="https://wa.me/2349166876907"
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              marginTop: 10,
              background: BRAND.red,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 900,
            }}
          >
            Message us on WhatsApp
          </button>
        </a>
      </Section>
    </>
  );
}
