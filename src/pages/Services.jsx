// src/pages/Services.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ----------------------------- Local theme ----------------------------- */
const BRAND = {
  red: "#e11d2a",
  darkGray: "#141414",
  black: "#0b0b0b",
  gray: "#f5f7fb",
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
};

const SOCIALS = [
  { name: "Facebook", href: "#", Icon: Social.Facebook },
  { name: "Twitter", href: "#", Icon: Social.Twitter },
  { name: "Instagram", href: "#", Icon: Social.Instagram },
];

/* Icon aliases used in the chrome */
const I = {
  Phone: Svg.Phone,
  Location: Svg.Location,
  Burger: Svg.Burger,
  X: Svg.X,
};

/* ===================================================================== */

export default function Services() {
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const isWide = vw > 1000;

  /* --------------------------- NAV CHROME --------------------------- */
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
            <I.Phone size={16} />
            <span>
              <span style={{ color: BRAND.red }}>Free Call</span> +234 916 687
              6907
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <I.Location size={16} />
            <span>
              <span style={{ color: BRAND.red }}>Our Location:</span> 25 Kayode
              Otitoju, Lekki, Lagos
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
              {IC ? (
                <IC size={18} />
              ) : (
                <span style={{ fontWeight: 900 }}>•</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

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
            <I.Burger />
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
                <I.X />
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
                    fontSize: 24,
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
    );
  };

  /* ------------------------------ DATA ------------------------------ */
  const services = useMemo(
    () => [
      {
        slug: "real-estate",
        title: "Real Estate",
        Icon: Svg.Building,
        blurb:
          "Buy, sell, develop and manage with confidence — residential, commercial and mixed-use.",
        bullets: [
          "Acquisition & Sales Brokerage",
          "Property Development & PM",
          "Facility & Asset Management",
          "Land Banking & Title Regularization",
        ],
        kpis: [
          { k: "Projects", v: "120+" },
          { k: "Cities", v: "8" },
          { k: "On-time Delivery", v: "98%" },
        ],
        video: "/tours/lekki.mp4",
        brochure: "/brochures/real-estate-profile.pdf",
        to: "/real-estate",
      },
      {
        slug: "hospitality",
        title: "Hospitality",
        Icon: Svg.Heart,
        blurb:
          "Short-let apartments and premium suites with seamless digital bookings.",
        bullets: [
          "Airbnb-style Short-lets",
          "Corporate Stays",
          "Housekeeping & Concierge",
          "Revenue Management",
        ],
        kpis: [
          { k: "Occupancy", v: "85%" },
          { k: "Units", v: "60+" },
          { k: "Avg. Rating", v: "4.8/5" },
        ],
        video: "/tours/suite-lekki.mp4",
        brochure: "/brochures/hospitality-profile.pdf",
        to: "/hospitality",
      },
      {
        slug: "renewable",
        title: "Renewable Energy",
        Icon: Svg.Solar,
        blurb:
          "Solar PV, storage and hybrid power systems for homes, estates and enterprises.",
        bullets: [
          "EPC (Design → Commission)",
          "Battery Storage & Hybrids",
          "O&M with SLAs",
          "Remote Monitoring",
        ],
        kpis: [
          { k: "Installed", v: "6.5MWp+" },
          { k: "Uptime", v: "99.5%" },
          { k: "Sites", v: "250+" },
        ],
        video: "/tours/civic.mp4",
        brochure: "/brochures/renewable-profile.pdf",
        to: "/renewable",
      },
      {
        slug: "procurement",
        title: "Procurement Services",
        Icon: Svg.Box,
        blurb:
          "Sourcing, QA/QC and logistics for technical equipment and building materials.",
        bullets: [
          "Local & Intl Sourcing",
          "Compliance & QA/QC",
          "Warehousing & Last-mile",
          "Cost Optimization",
        ],
        kpis: [
          { k: "Suppliers", v: "300+" },
          { k: "Avg. Lead-time", v: "12d" },
          { k: "Savings", v: "14%" },
        ],
        video: "/tours/paragon.mp4",
        brochure: "/brochures/procurement-profile.pdf",
        to: "/procurement",
      },
      {
        slug: "telecom",
        title: "Telecom & Technology",
        Icon: Svg.Tower,
        blurb:
          "Fiber, microwave backhaul and campus networks — design, build and manage.",
        bullets: [
          "FTTx / ODN Deployments",
          "Small Cells & DAS",
          "Campus Networks",
          "NOC & Field Ops",
        ],
        kpis: [
          { k: "Fiber Laid", v: "1,200km+" },
          { k: "Sites", v: "500+" },
          { k: "MTTR", v: "<4h" },
        ],
        video: "/tours/lekki.mp4",
        brochure: "/brochures/telecom-profile.pdf",
        to: "/telecom",
      },
    ],
    []
  );

  /* ------------------------- SPY (no remounts) ------------------------ */
  const sectionRefs = useRef({});
  const [activeSlug, setActiveSlug] = useState(services[0].slug);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const slug = e.target.getAttribute("data-slug");
            if (slug && slug !== activeSlug) setActiveSlug(slug);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [services, activeSlug]);

  /* ------------------------------ HELPERS ------------------------------ */
  const SectionWrap = ({ children, style }) => (
    <section style={{ padding: "48px 0", background: "#fff", ...style }}>
      <div style={{ width: "min(1200px,92vw)", margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );

  const chip = (active) => ({
    padding: "10px 14px",
    borderRadius: 999,
    border: `2px solid ${active ? BRAND.red : "#ddd"}`,
    background: active ? BRAND.red : "#fff",
    color: active ? "#fff" : "#222",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  const tag = {
    padding: "6px 10px",
    border: "1px solid #eee",
    borderRadius: 999,
    fontSize: 12,
  };

  /* -------------------------------- UI -------------------------------- */
  return (
    <>
      <TopBar />
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: `url(/assets/about_red.jpg) center/cover no-repeat`,
          color: "#fff",
          position: "relative",
          height: 340,
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
            Our Services
          </h1>
          <p style={{ marginTop: 8, fontSize: 18 }}>
            From property to power — we plan, build and operate mission-critical
            assets.
          </p>
        </div>
      </div>

      {/* Navigator chips */}
      <SectionWrap>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {services.map((s) => (
            <button
              key={s.slug}
              onClick={() =>
                sectionRefs.current[s.slug]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              style={chip(activeSlug === s.slug)}
            >
              <s.Icon size={18} style={{ marginRight: 6 }} /> {s.title}
            </button>
          ))}
        </div>
      </SectionWrap>

      {/* Sections */}
      {services.map((s, idx) => (
        <SectionWrap
          key={s.slug}
          style={{ background: idx % 2 ? BRAND.gray : "#fff" }}
        >
          <div
            ref={(el) => (sectionRefs.current[s.slug] = el)}
            data-slug={s.slug}
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: isWide ? "1.1fr 1fr" : "1fr",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <s.Icon size={26} style={{ color: BRAND.red }} />
                <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>
                  {s.title}
                </h2>
              </div>
              <p style={{ marginTop: 8 }}>{s.blurb}</p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  margin: "12px 0",
                }}
              >
                {s.bullets.map((b, i) => (
                  <span key={i} style={tag}>
                    {b}
                  </span>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {s.kpis.map((k) => (
                  <div
                    key={k.k}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 12,
                      padding: "12px 12px",
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{k.k}</div>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>{k.v}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 14,
                }}
              >
                <Link to={s.to} style={{ textDecoration: "none" }}>
                  <button
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
                    Explore {s.title}
                  </button>
                </Link>
                <Link to="/contact" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "#fff",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Request a proposal
                  </button>
                </Link>
                {s.brochure && (
                  <a
                    href={s.brochure}
                    download
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid #ddd",
                        background: "#fff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Download profile
                    </button>
                  </a>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, margin: "6px 0" }}>
                {s.title} — Video Tour
              </div>
              <div
                style={{
                  position: "relative",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#0e0e0e",
                }}
              >
                <SmartVideo id={s.slug} src={s.video} />
              </div>
            </div>
          </div>
        </SectionWrap>
      ))}

      {/* CTA */}
      <SectionWrap
        style={{ background: BRAND.black, color: "#fff", textAlign: "center" }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>
          Ready to talk?
        </h2>
        <p style={{ opacity: 0.9, marginTop: 8 }}>
          Book a call and we’ll tailor a solution for you.
        </p>
        <Link to="/contact" style={{ textDecoration: "none" }}>
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
            Contact our team
          </button>
        </Link>
      </SectionWrap>
    </>
  );
}

/* ------------------------ SmartVideo (no reload) ------------------------ */
const SmartVideo = React.memo(function SmartVideoInner({ id, src }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // assign once to avoid reload on re-renders
    if (!v.src) v.src = src;

    // restore last position
    const saved = sessionStorage.getItem("vidpos:" + id);
    if (saved) {
      const t = parseFloat(saved);
      if (!Number.isNaN(t)) v.currentTime = t;
    }

    const onTime = () => {
      try {
        sessionStorage.setItem("vidpos:" + id, String(v.currentTime));
      } catch {}
    };
    v.addEventListener("timeupdate", onTime);

    // pause when out of view
    const io = new IntersectionObserver(
      ([e]) => {
        if (!v) return;
        if (!e.isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0.01 }
    );
    io.observe(v);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      io.disconnect();
    };
  }, [id, src]);

  return (
    <video
      ref={ref}
      controls
      preload="metadata"
      style={{
        width: "100%",
        height: 300,
        objectFit: "cover",
        display: "block",
      }}
    >
      Your browser does not support HTML5 video.
    </video>
  );
});
