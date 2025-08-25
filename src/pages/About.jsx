// src/pages/About.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BRAND,
  Icon,
  SOCIALS,
  useViewport,
  useScrollY,
} from "../shared/Shared";

export default function About() {
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isWide = vw > 900;

  /* ------------------------------ DATA ------------------------------ */
  const TRUSTEES = [
    {
      name: "Chief A. O. Balogun",
      title: "Chairman, Board of Trustees",
      img: "/assets/team/trustee1.jpg",
      bio: "Over 30 years leading multi-sector infrastructure programs across West Africa, with a focus on governance and risk oversight.",
      linkedin: "#",
    },
    {
      name: "Engr. M. S. Okoro",
      title: "Trustee",
      img: "/assets/team/trustee2.jpg",
      bio: "COREN-certified civil engineer and project sponsor for several landmark highways, bridges and mixed-use estates.",
      linkedin: "#",
    },
    {
      name: "Mrs. T. A. Adeyemi",
      title: "Trustee",
      img: "/assets/team/trustee3.jpg",
      bio: "Seasoned finance executive, ex-bank director. Stewardship over audit, compliance and ethical procurement.",
      linkedin: "#",
    },
    {
      name: "Dr. K. Danjuma",
      title: "Trustee",
      img: "/assets/team/trustee4.jpg",
      bio: "Public-private partnership (PPP) advisor; specializes in concession structuring and stakeholder engagement.",
      linkedin: "#",
    },
  ];

  const MANAGEMENT = [
    {
      name: "Engr. Chinedu Ibeh",
      title: "Managing Director / CEO",
      img: "/assets/team/mgmt1.jpg",
      bio: "Drives company vision and growth. Led delivery of >1GW solar EPC pipeline and 2M+ m² of residential/commercial builds.",
      linkedin: "#",
    },
    {
      name: "Mrs. Farida Sule",
      title: "Director, Real Estate",
      img: "/assets/team/mgmt2.jpg",
      bio: "Heads development, sales and asset management. Champion for sustainable designs and smart-home integrations.",
      linkedin: "#",
    },
    {
      name: "Mr. Adewale Ogun",
      title: "GM, Hospitality & Short-Lets",
      img: "/assets/team/mgmt3.jpg",
      bio: "Oversees hospitality assets, reservations technology and guest experience across Lagos and Abuja.",
      linkedin: "#",
    },
    {
      name: "Engr. Ibrahim Musa",
      title: "Director, Renewable Energy",
      img: "/assets/team/mgmt4.jpg",
      bio: "Solar PV and storage systems expert; EPC & O&M leadership with uptime-driven SLAs and monitoring dashboards.",
      linkedin: "#",
    },
    {
      name: "Mrs. Kemi Aina",
      title: "Head, Procurement Services",
      img: "/assets/team/mgmt5.jpg",
      bio: "Global sourcing, QA/QC and logistics specialist; ensures transparent, standards-compliant supply chains.",
      linkedin: "#",
    },
    {
      name: "Mr. Oladimeji Arowolo",
      title: "CFO",
      img: "/assets/team/mgmt6.jpg",
      bio: "Corporate finance, treasury and investor relations. Builds efficient capital structures and robust controls.",
      linkedin: "#",
    },
  ];

  /* ----------------------------- LAYOUT ----------------------------- */
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
              <span style={{ color: BRAND.red }}>Our Location:</span> Lekki,
              Lagos, Nigeria
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

  /* ------------- Enhanced mobile menu overlay (rich content) --------- */
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
            <Icon.X />
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
          {/* Primary */}
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
                  letterSpacing: 0.3,
                }}
              >
                {l.t}
              </Link>
            ))}
          </nav>

          {/* Sectors + contact + socials + CTA */}
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
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
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
                  25 Kayode Otitoju, Off Admiralty Way, Lekki, Lagos, Nigeria
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: isWide ? "flex-start" : "center",
                flexWrap: "wrap",
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
              loading="lazy"
              decoding="async"
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

  /* --------------------------- HELPERS --------------------------- */
  const Section = ({ children, style }) => (
    <section style={{ padding: "48px 0", background: "#fff", ...style }}>
      <div style={{ width: "min(1200px,92vw)", margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );

  const smallCta = () => ({
    padding: "8px 12px",
    borderRadius: 8,
    background: "#eee",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  });

  const Pill = ({ k, v }) => (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
        textAlign: "center",
        display: "grid",
        gap: 4,
      }}
    >
      <div
        style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, color: BRAND.red }}
      >
        {v}
      </div>
      <div style={{ fontWeight: 700 }}>{k}</div>
    </div>
  );

  const PersonCard = ({ p, onOpen }) => (
    <article
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
        display: "grid",
        gap: 10,
        background: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 3",
          borderRadius: 10,
          background: `#f3f3f3 url(${p.img}) center/cover no-repeat`,
        }}
        aria-label={`${p.name} portrait`}
        role="img"
      />
      <div style={{ fontWeight: 900 }}>{p.name}</div>
      <div style={{ opacity: 0.8 }}>{p.title}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => onOpen(p)} style={smallCta()}>
          View Bio
        </button>
        {p.linkedin && (
          <a
            href={p.linkedin}
            target="_blank"
            rel="noreferrer"
            style={{ ...smallCta(), textDecoration: "none" }}
          >
            LinkedIn
          </a>
        )}
      </div>
    </article>
  );

  function PersonModal({ person, onClose }) {
    useEffect(() => {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
    }, [onClose]);

    if (!person) return null;
    return (
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.65)",
          display: "grid",
          placeItems: "center",
          zIndex: 3000,
          padding: 12,
        }}
      >
        <div
          style={{
            width: "min(900px,96vw)",
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 14,
              borderBottom: "1px solid #eee",
            }}
          >
            <div style={{ fontWeight: 900 }}>{person.name}</div>
            <button
              onClick={onClose}
              style={{ ...smallCta(), background: "#f5f5f5" }}
            >
              Close
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gap: 16,
              padding: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              alignItems: "start",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: BRAND.red }}>
                {person.title}
              </div>
              <p style={{ marginTop: 8 }}>{person.bio}</p>
              {person.linkedin && (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...smallCta(), textDecoration: "none" }}
                >
                  View LinkedIn
                </a>
              )}
            </div>
            <div
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: 12,
                background: `#f3f3f3 url(${person.img}) center/cover no-repeat`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------- PAGE ------------------------------- */
  const [openPerson, setOpenPerson] = useState(null);

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
          height: "min(70vh, 520px)",
          minHeight: 320,
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
          <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, margin: 0 }}>
            About Hillstar Nigeria Limited
          </h1>
          <p style={{ marginTop: 10, fontSize: "clamp(14px, 2.6vw, 18px)" }}>
            Building Nigeria’s future through resilient infrastructure,
            sustainable energy and people-first places.
          </p>
        </div>
      </div>

      {/* Company overview */}
      <Section>
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 900, marginBottom: 8 }}>
              Who We Are
            </h2>
            <p>
              Established in 1992, Hillstar is a pioneering indigenous
              infrastructure company delivering construction, engineering,
              energy and hospitality solutions for public and private clients
              across Nigeria. Our three-decade track record is anchored on
              integrity, safety, innovation and measurable outcomes.
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <div>
                <strong>Vision:</strong> To be Nigeria’s most trusted builder of
                sustainable communities.
              </div>
              <div>
                <strong>Mission:</strong> Deliver world-class projects that
                improve lives and unlock value.
              </div>
              <div>
                <strong>Values:</strong> Integrity • Excellence • Safety •
                Sustainability • Partnership
              </div>
            </div>
          </div>
          <div
            style={{
              borderRadius: 12,
              minHeight: 260,
              aspectRatio: "4 / 3",
              background: "url(/assets/villa.png) center/cover no-repeat",
            }}
            role="img"
            aria-label="Hillstar project collage"
          />
        </div>

        {/* quick stats */}
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <Pill k="Years of Operations" v="30+" />
          <Pill k="Projects Delivered" v="500+" />
          <Pill k="Cities Served" v="40+" />
          <Pill k="Client Satisfaction" v="98%" />
        </div>
      </Section>

      {/* Board of Trustees */}
      <Section style={{ background: BRAND.gray }}>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 900, marginBottom: 6 }}>
          Board of Trustees
        </h2>
        <p style={{ opacity: 0.85, marginBottom: 16 }}>
          The Board provides strategic direction, governance and oversight
          across all operating units.
        </p>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {TRUSTEES.map((p) => (
            <PersonCard key={p.name} p={p} onOpen={setOpenPerson} />
          ))}
        </div>
      </Section>

      {/* Executive Management */}
      <Section>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 900, marginBottom: 6 }}>
          Executive Management
        </h2>
        <p style={{ opacity: 0.85, marginBottom: 16 }}>
          Our leadership team turns strategy into on-time, on-budget execution
          with strong HSE culture.
        </p>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {MANAGEMENT.map((p) => (
            <PersonCard key={p.name} p={p} onOpen={setOpenPerson} />
          ))}
        </div>
      </Section>

      {/* Governance & ESG */}
      <Section style={{ background: BRAND.gray }}>
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          <div>
            <h3 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 900, marginBottom: 8 }}>
              Corporate Governance
            </h3>
            <ul style={{ lineHeight: 1.9, margin: 0, paddingLeft: 18 }}>
              <li>
                Independent Board committees for Audit & Risk, Projects, and
                Remuneration.
              </li>
              <li>
                ISO-aligned quality systems; strict vendor due-diligence and
                anti-corruption policy.
              </li>
              <li>
                Transparent reporting, whistle-blowing channels and annual HSE
                reviews.
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 900, marginBottom: 8 }}>
              CSR & Sustainability
            </h3>
            <ul style={{ lineHeight: 1.9, margin: 0, paddingLeft: 18 }}>
              <li>
                Local content development and apprenticeships for artisans and
                engineers.
              </li>
              <li>
                Energy efficiency, solar adoption and waste-minimization on all
                sites.
              </li>
              <li>
                Community health, education and resilience programs in host
                communities.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Partners / Certifications */}
      <Section>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 900, marginBottom: 6 }}>
          Certifications & Partners
        </h2>
        <p style={{ opacity: 0.85 }}>
          We collaborate with top OEMs and comply with global standards.
        </p>
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}
        >
          {[
            "oem1.png",
            "oem2.png",
            "oem3.png",
            "oem4.png",
            "oem5.png",
            "oem6.png",
          ].map((l, i) => (
            <div
              key={i}
              style={{
                height: 70,
                border: "1px solid #eee",
                borderRadius: 10,
                background: `#fff url(/assets/partners/${l}) center/contain no-repeat`,
              }}
            />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section
        style={{ background: BRAND.black, color: "#fff", textAlign: "center" }}
      >
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 900, margin: 0 }}>
          Work With Us
        </h2>
        <p style={{ opacity: 0.9, marginTop: 8 }}>
          From concept to commissioning, we deliver with excellence. Let’s build
          together.
        </p>
        <Link to="/contact" style={{ textDecoration: "none" }}>
          <button
            style={{
              marginTop: 12,
              background: BRAND.red,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 900,
              width: "min(360px, 100%)",
            }}
          >
            Talk to our team
          </button>
        </Link>
      </Section>

      {/* Person modal */}
      {openPerson && (
        <PersonModal person={openPerson} onClose={() => setOpenPerson(null)} />
      )}
    </>
  );
}
