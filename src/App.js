import React, { useEffect, useState } from "react";

/* ----------------------------- Theme & Layout ---------------------------- */
const BRAND = {
  red: "#E30613",
  white: "#FFFFFF",
  black: "#0B0B0B",
  grey: "#F2F2F2",
};
const layout = {
  page: {
    background: BRAND.black,
    color: BRAND.white,
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  container: { width: "min(1200px,92vw)", margin: "0 auto" },
};
const buttonStyle = (active, variant = "solid") => ({
  padding: "14px 20px",
  borderRadius: 10,
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 15,
  border: variant === "outline" ? `2px solid ${BRAND.red}` : "none",
  background: active
    ? BRAND.red
    : variant === "outline"
    ? BRAND.black
    : BRAND.grey,
  color: active ? BRAND.white : variant === "outline" ? BRAND.red : BRAND.black,
  transition: "all .2s",
  boxShadow: active
    ? "0 10px 30px rgba(227,6,19,.35)"
    : "0 6px 20px rgba(0,0,0,.12)",
});
const utils = {
  p: { fontSize: 16, lineHeight: 1.7, color: "#C9C9C9" },
  h1: { fontSize: "clamp(32px,5vw,64px)", lineHeight: 1.1, margin: 0 },
  h2: { fontSize: "clamp(24px,4vw,40px)", margin: 0 },
  h3: { fontSize: 20, margin: 0 },
  card: {
    background: "#111",
    border: "1px solid #1f1f1f",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 20px 70px rgba(0,0,0,.4)",
  },
  tag: {
    padding: "6px 10px",
    borderRadius: 12,
    fontSize: 12,
    border: "1px solid #2a2a2a",
    color: "#c9c9c9",
  },
};

/* --------------------------------- Data --------------------------------- */
const currency = (n) => `₦${Number(n || 0).toLocaleString()}`;
const properties = {
  buy: [
    {
      id: "paragon",
      title: "Luxury Apartments, Lekki",
      price: 185000000,
      brochure: "/brochures/paragon.pdf",
      city: "Lekki",
      bedrooms: 3,
      img: "/assets/buy_lekki.jpg",
    },
    {
      id: "civic",
      title: "5-Bed Detached Duplex, VI",
      price: 420000000,
      brochure: "/brochures/civic.pdf",
      city: "Victoria Island",
      bedrooms: 5,
      img: "/assets/buy_vi.jpg",
    },
  ],
  rent: [
    {
      id: "ikoyi",
      title: "2-Bed Serviced Apartment, Ikoyi",
      price: 8500000,
      brochure: "/brochures/ikoyi.pdf",
      city: "Ikoyi",
      bedrooms: 2,
      img: "/assets/rent_ikoyi.jpg",
      rent: true,
    },
    {
      id: "lekki",
      title: "Furnished Studio, Lekki Phase 1",
      price: 3200000,
      brochure: "/brochures/lekki.pdf",
      city: "Lekki",
      bedrooms: 1,
      img: "/assets/rent_lekki.jpg",
      rent: true,
    },
  ],
};
const services = [
  "General Contracting",
  "Civil Infrastructure",
  "Real Estate Development",
  "Procurement & Fit‑Out",
];

/* ------------------------------ Tiny tests ------------------------------- */
function filterProperties(list, f) {
  return list.filter((p) => {
    if (f.city && !p.city.toLowerCase().includes(String(f.city).toLowerCase()))
      return false;
    if (f.bedrooms && Number(p.bedrooms) < Number(f.bedrooms)) return false; // ≥
    if (f.minPrice && Number(p.price) < Number(f.minPrice)) return false;
    if (f.maxPrice && Number(p.price) > Number(f.maxPrice)) return false;
    return true;
  });
}

/* --------------------------- Shared: section style --------------------------- */
const sectionPad = { padding: "80px 0", scrollMarginTop: 96 };

/* -------------------------------- Topbar -------------------------------- */
const Topbar = () => (
  <div style={{ background: "#171717", borderBottom: "1px solid #222" }}>
    <div
      style={{
        ...layout.container,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        padding: "8px 0",
        fontSize: 12,
        color: "#bbb",
      }}
    >
      <div>
        Free Call{" "}
        <a
          href="tel:+2349166876907"
          style={{
            color: BRAND.white,
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          +234 916 687 6907
        </a>
      </div>
      <div style={{ textAlign: "center" }}>
        Our Location:{" "}
        <span style={{ color: BRAND.white }}>
          25 Kayode Otitoju, Lekki, Lagos
        </span>
      </div>
      <div
        style={{
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        {/* Inline SVG icons so no external libs needed */}
        <a href="#" aria-label="Instagram" style={{ color: BRAND.white }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 7a5 5 0 100 10 5 5 0 000-10m0-5c2.7 0 3.04 0 4.1.06 1.06.06 1.78.22 2.42.47a4.9 4.9 0 012.06 1.34 4.9 4.9 0 011.34 2.06c.25.64.41 1.36.47 2.42.06 1.06.06 1.4.06 4.1s0 3.04-.06 4.1c-.06 1.06-.22 1.78-.47 2.42a4.9 4.9 0 01-1.34 2.06 4.9 4.9 0 01-2.06 1.34c-.64.25-1.36.41-2.42.47-1.06.06-1.4.06-4.1.06s-3.04 0-4.1-.06c-1.06-.06-1.78-.22-2.42-.47a4.9 4.9 0 01-2.06-1.34 4.9 4.9 0 01-1.34-2.06c-.25-.64-.41-1.36-.47-2.42C2 15.04 2 14.7 2 12s0-3.04.06-4.1c.06-1.06.22-1.78.47-2.42A4.9 4.9 0 013.87 3.4 4.9 4.9 0 015.93 2.06c.64-.25 1.36-.41 2.42-.47C9.41 1.53 9.74 1.5 12 1.5z" />
          </svg>
        </a>
        <a href="#" aria-label="Twitter" style={{ color: BRAND.white }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M23 4.5a9.4 9.4 0 01-2.7.74A4.72 4.72 0 0022.4 3a9.42 9.42 0 01-3 1.14A4.7 4.7 0 0016.1 3a4.7 4.7 0 00-4.7 4.7c0 .37.04.72.12 1.06A13.34 13.34 0 013 3.9a4.7 4.7 0 001.45 6.27 4.67 4.67 0 01-2.13-.59v.06a4.7 4.7 0 003.77 4.6c-.5.13-1.03.2-1.57.2-.39 0-.77-.04-1.13-.11a4.7 4.7 0 004.39 3.27A9.44 9.44 0 012 20.5a13.3 13.3 0 007.2 2.1c8.64 0 13.36-7.16 13.36-13.36 0-.2 0-.41-.02-.61A9.53 9.53 0 0023 4.5z" />
          </svg>
        </a>
        <a href="#" aria-label="LinkedIn" style={{ color: BRAND.white }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.85-2.1 3.8-2.1 4.07 0 4.82 2.68 4.82 6.17V24h-4v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.76 1.87-2.76 3.8V24h-4V8.5z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
);

/* --------------------------------- Nav ---------------------------------- */
const Nav = () => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(15,15,15,.75)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid #222",
    }}
  >
    <div
      style={{
        ...layout.container,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Use onError fallback so logo always shows */}
        <img
          src="/assets/hillstar-logo.svg"
          alt="Hillstar"
          style={{ height: 36 }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/logo_red.svg"; // fallback name
          }}
        />
      </div>
      <nav
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        {[
          ["home", "Home"],
          ["about", "About"],
          ["services", "Our Services"],
          ["work", "Our Work"],
          ["contact", "Contact Us"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            style={{ color: "#ddd", textDecoration: "none", fontWeight: 700 }}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  </header>
);

/* -------------------------------- Hero ---------------------------------- */
const Hero = ({ mode, setMode }) => {
  // Only the background layer moves; the section itself is static.
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.2);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const videoSrc = mode === "buy" ? "/hero_buy.mp4" : "/hero_rent.mp4";
  return (
    <section
      id="home"
      style={{
        ...sectionPad,
        padding: "100px 0 60px",
        textAlign: "center",
        position: "relative",
        background: "linear-gradient(180deg,#0B0B0B,#111)",
        isolation: "isolate", // ensure bg layer doesn't overlap next section
      }}
    >
      {/* Parallax background inside the hero's stacking context */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${offset}px)`,
          transition: "transform .2s",
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(227,6,19,.15), transparent)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ ...utils.h1, color: BRAND.white }}>
          Building Your Vision, Crafting with Precision
        </h1>
        <p style={{ ...utils.p, marginTop: 10 }}>
          From concept to completion, we deliver high‑quality residential and
          commercial construction tailored to your needs.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            margin: "16px 0 22px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={buttonStyle(mode === "buy")}
            onClick={() => setMode("buy")}
          >
            Buy Properties
          </button>
          <button
            style={buttonStyle(mode === "rent")}
            onClick={() => setMode("rent")}
          >
            Rent Properties
          </button>
        </div>

        <div
          style={{
            width: "min(1400px,96%)",
            margin: "0 auto",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,.55)",
            border: `4px solid ${BRAND.red}`,
            position: "relative",
            aspectRatio: "16 / 9",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src={videoSrc.replace(".mp4", ".webm")} type="video/webm" />
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------- About ---------------------------------- */
const About = () => (
  <section
    id="about"
    style={{ ...sectionPad, background: BRAND.white, color: "#222" }}
  >
    <div
      style={{
        ...layout.container,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 30,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1/1",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          }}
        >
          <img
            src="/assets/about_red.jpg"
            alt="Hillstar architecture"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%) contrast(1.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#E30613AA",
              mixBlendMode: "multiply",
            }}
          />
        </div>
      </div>
      <div>
        <img
          src="/assets/hillstar-logo.svg"
          alt="Hillstar"
          style={{ height: 36 }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/logo_red.svg";
          }}
        />
        <div
          style={{
            marginTop: 16,
            color: BRAND.red,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          ABOUT US
        </div>
        <h2 style={{ fontSize: "clamp(28px,4vw,52px)", margin: "8px 0 12px" }}>
          Building Nigeria’s Future, One Landmark at a Time
        </h2>
        <p style={{ color: "#555", lineHeight: 1.8 }}>
          Established in 1992, Hillstar Nigeria Limited is a pioneering
          indigenous infrastructure company delivering comprehensive
          construction, engineering, and development solutions. From government
          to private enterprise, clients trust us to bring bold ideas to life
          with technical precision and enduring value.
        </p>
      </div>
    </div>
  </section>
);

/* ------------------------------ Services -------------------------------- */
const Services = () => (
  <section id="services" style={{ ...sectionPad, background: "#0E0E0E" }}>
    <div style={layout.container}>
      <h2 style={utils.h2}>Our Services</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        {services.map((s, i) => (
          <div key={s} style={{ ...utils.card }}>
            <div
              style={{
                ...utils.tag,
                borderColor: BRAND.red,
                color: BRAND.red,
                background: "transparent",
                width: "fit-content",
              }}
            >
              0{i + 1}
            </div>
            <h3 style={{ ...utils.h3, marginTop: 8 }}>{s}</h3>
            <p style={{ ...utils.p, marginTop: 8 }}>
              Value engineering, schedule certainty, verified quality. Ask about
              case studies and KPIs.
            </p>
            <a
              href="#work"
              style={{
                color: BRAND.red,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              See our work →
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------- Property Cards ---------------------------- */
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        zIndex: 2000,
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1000px,95vw)",
          background: "#101010",
          border: `2px solid ${BRAND.red}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            borderBottom: "1px solid #222",
          }}
        >
          <strong>{title}</strong>
          <button onClick={onClose} style={buttonStyle(true)}>
            Close
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
};

const PropertyCard = ({ p }) => {
  const [openTour, setOpenTour] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    alert(`Reservation submitted for ${p.title}
${JSON.stringify(payload, null, 2)}`);
  };
  return (
    <div style={{ ...utils.card, background: "#151515" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/3",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #1f1f1f",
        }}
      >
        <img
          src={p.img || "/assets/placeholder.jpg"}
          alt={p.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            ...utils.tag,
            background: "rgba(0,0,0,.55)",
            color: BRAND.white,
            border: "none",
          }}
        >
          {currency(p.price)}
          {p.rent ? " / yr" : ""}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            ...utils.tag,
            background: BRAND.red,
            color: BRAND.white,
            border: "none",
          }}
        >
          {p.city} · {p.bedrooms} BR
        </div>
      </div>
      <h3 style={{ ...utils.h3, marginTop: 8 }}>{p.title}</h3>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
        <a
          href={p.brochure}
          download
          style={{ ...buttonStyle(true), textDecoration: "none" }}
        >
          Download brochure
        </a>
        <button
          onClick={() => setOpenForm(true)}
          style={{ ...buttonStyle(false, "outline") }}
        >
          Reserve unit
        </button>
        <button
          onClick={() => setOpenTour(true)}
          style={{
            ...buttonStyle(true),
            background: BRAND.black,
            color: BRAND.white,
            border: `2px solid ${BRAND.red}`,
          }}
        >
          Virtual tour
        </button>
      </div>
      <Modal
        open={openTour}
        onClose={() => setOpenTour(false)}
        title={`${p.title} — Virtual tour`}
      >
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <video
            controls
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              background: "#000",
            }}
          >
            <source src={`/tours/${p.id}.webm`} type="video/webm" />
            <source src={`/tours/${p.id}.mp4`} type="video/mp4" />
          </video>
        </div>
      </Modal>
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={`Reserve a unit — ${p.title}`}
      >
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input
            name="name"
            required
            placeholder="Full name"
            style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${BRAND.red}`,
              background: "#222",
              color: BRAND.white,
            }}
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${BRAND.red}`,
              background: "#222",
              color: BRAND.white,
            }}
          />
          <input
            name="phone"
            placeholder="Phone"
            style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${BRAND.red}`,
              background: "#222",
              color: BRAND.white,
            }}
          />
          <textarea
            name="notes"
            placeholder="Notes"
            style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${BRAND.red}`,
              background: "#222",
              color: BRAND.white,
              minHeight: 100,
            }}
          />
          <button type="submit" style={buttonStyle(true)}>
            Submit reservation
          </button>
        </form>
      </Modal>
    </div>
  );
};

/* --------------------------- Listings + Filters -------------------------- */
const FilterBar = ({ filters, setFilters }) => (
  <div
    style={{
      position: "sticky",
      top: 0,
      background: "#111",
      padding: 12,
      borderBottom: `2px solid ${BRAND.red}`,
      zIndex: 1000,
    }}
  >
    <div
      style={{
        ...layout.container,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <input
        placeholder="City"
        value={filters.city}
        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
        style={{
          padding: 10,
          borderRadius: 8,
          border: `1px solid ${BRAND.red}`,
          background: "#222",
          color: BRAND.white,
        }}
      />
      <input
        placeholder="Bedrooms (≥)"
        type="number"
        min={0}
        value={filters.bedrooms}
        onChange={(e) =>
          setFilters((f) => ({ ...f, bedrooms: e.target.value }))
        }
        style={{
          padding: 10,
          borderRadius: 8,
          border: `1px solid ${BRAND.red}`,
          background: "#222",
          color: BRAND.white,
          width: 160,
        }}
      />
      <input
        placeholder="Min Price (₦)"
        type="number"
        min={0}
        value={filters.minPrice}
        onChange={(e) =>
          setFilters((f) => ({ ...f, minPrice: e.target.value }))
        }
        style={{
          padding: 10,
          borderRadius: 8,
          border: `1px solid ${BRAND.red}`,
          background: "#222",
          color: BRAND.white,
          width: 180,
        }}
      />
      <input
        placeholder="Max Price (₦)"
        type="number"
        min={0}
        value={filters.maxPrice}
        onChange={(e) =>
          setFilters((f) => ({ ...f, maxPrice: e.target.value }))
        }
        style={{
          padding: 10,
          borderRadius: 8,
          border: `1px solid ${BRAND.red}`,
          background: "#222",
          color: BRAND.white,
          width: 180,
        }}
      />
      <button
        onClick={() =>
          setFilters({ city: "", bedrooms: "", minPrice: "", maxPrice: "" })
        }
        style={buttonStyle(true)}
      >
        Clear
      </button>
    </div>
  </div>
);

const Listings = ({ mode }) => {
  const [filters, setFilters] = useState({
    city: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
  });
  const list = filterProperties(properties[mode], filters);
  return (
    <section id="work" style={{ background: "#0F0F0F", ...sectionPad }}>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div style={layout.container}>
        <h2 style={{ ...utils.h2, margin: "26px 0" }}>
          {mode === "buy" ? "Properties for Sale" : "Properties for Rent"}
        </h2>
        <div
          style={{
            display: "grid",
            gap: 22,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
          }}
        >
          {list.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------- Contact -------------------------------- */
const Contact = () => (
  <section id="contact" style={{ ...sectionPad, background: "#111" }}>
    <div style={layout.container}>
      <h2 style={utils.h2}>Contact Us</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Thanks, we will reach out!");
        }}
        style={{ display: "grid", gap: 14, maxWidth: 600, marginTop: 16 }}
      >
        <input
          placeholder="Full Name"
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: `1px solid ${BRAND.red}`,
            background: "#222",
            color: BRAND.white,
          }}
        />
        <input
          type="email"
          placeholder="Email"
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: `1px solid ${BRAND.red}`,
            background: "#222",
            color: BRAND.white,
          }}
        />
        <textarea
          placeholder="Message"
          style={{
            padding: 12,
            borderRadius: 8,
            border: `1px solid ${BRAND.red}`,
            background: "#222",
            color: BRAND.white,
            minHeight: 120,
          }}
        />
        <button type="submit" style={buttonStyle(true)}>
          Submit
        </button>
      </form>
    </div>
  </section>
);

/* -------------------------------- Terms --------------------------------- */
const Terms = () => (
  <section id="terms" style={{ ...sectionPad, background: "#0E0E0E" }}>
    <div style={layout.container}>
      <h2 style={utils.h2}>Terms & Conditions</h2>
      <p style={{ ...utils.p, marginTop: 10 }}>
        Illustrative website for demo purposes. All images/prices are
        placeholders unless stated otherwise.
      </p>
    </div>
  </section>
);

/* -------------------------------- Footer -------------------------------- */
const Footer = () => (
  <footer
    style={{
      background: BRAND.white,
      color: "#111",
      padding: "50px 0 20px",
      borderTop: "1px solid #e5e5e5",
    }}
  >
    <div
      style={{
        ...layout.container,
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr",
        gap: 24,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/assets/hillstar-logo.svg"
            alt="Hillstar"
            style={{ height: 32 }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/logo_red.svg";
            }}
          />
        </div>
        <p style={{ color: "#444", marginTop: 12 }}>
          With deep market Knowledge, Integrity and Passion for Service, we turn
          property goals to lasting realities.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {[
            [
              "twitter",
              "M23 4.5a9.4 9.4 0 01-2.7.74A4.72 4.72 0 0022.4 3a9.42 9.42 0 01-3 1.14A4.7 4.7 0 0016.1 3a4.7 4.7 0 00-4.7 4.7c0 .37.04.72.12 1.06A13.34 13.34 0 013 3.9a4.7 4.7 0 001.45 6.27 4.67 4.67 0 01-2.13-.59v.06a4.7 4.7 0 003.77 4.6c-.5.13-1.03.2-1.57.2-.39 0-.77-.04-1.13-.11a4.7 4.7 0 004.39 3.27A9.44 9.44 0 012 20.5a13.3 13.3 0 007.2 2.1c8.64 0 13.36-7.16 13.36-13.36 0-.2 0-.41-.02-.61A9.53 9.53 0 0023 4.5z",
            ],
            [
              "linkedin",
              "M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.85-2.1 3.8-2.1 4.07 0 4.82 2.68 4.82 6.17V24h-4v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.76 1.87-2.76 3.8V24h-4V8.5z",
            ],
            [
              "instagram",
              "M12 7a5 5 0 100 10 5 5 0 000-10m0-5c2.7 0 3.04 0 4.1.06 1.06.06 1.78.22 2.42.47a4.9 4.9 0 012.06 1.34 4.9 4.9 0 011.34 2.06c.25.64.41 1.36.47 2.42.06 1.06.06 1.4.06 4.1s0 3.04-.06 4.1c-.06 1.06-.22 1.78-.47 2.42a4.9 4.9 0 01-1.34 2.06 4.9 4.9 0 01-2.06 1.34c-.64.25-1.36.41-2.42.47-1.06.06-1.4.06-4.1.06s-3.04 0-4.1-.06c-1.06-.06-1.78-.22-2.42-.47a4.9 4.9 0 01-2.06-1.34 4.9 4.9 0 01-1.34-2.06c-.25-.64-.41-1.36-.47-2.42C2 15.04 2 14.7 2 12s0-3.04.06-4.1c.06-1.06.22-1.78.47-2.42A4.9 4.9 0 013.87 3.4 4.9 4.9 0 015.93 2.06c.64-.25 1.36-.41 2.42-.47C9.41 1.53 9.74 1.5 12 1.5z",
            ],
          ].map(([k, d]) => (
            <a
              key={k}
              href="#"
              aria-label={k}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: BRAND.red,
                display: "grid",
                placeItems: "center",
                color: BRAND.white,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d={d} />
              </svg>
            </a>
          ))}
        </div>
      </div>
      <div>
        <strong>Offers</strong>
        <nav style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <a href="#home" style={{ color: "#111" }}>
            Home
          </a>
          <a href="#about" style={{ color: "#111" }}>
            About
          </a>
        </nav>
      </div>
      <div>
        <strong>Company</strong>
        <nav style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <a href="#services" style={{ color: "#111" }}>
            Our Services
          </a>
          <a href="#work" style={{ color: "#111" }}>
            Our Work
          </a>
        </nav>
      </div>
      <div>
        <strong>Quick Links</strong>
        <nav style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <a href="#contact" style={{ color: "#111" }}>
            Contact Us
          </a>
          <a href="#terms" style={{ color: "#111" }}>
            Terms & Conditions
          </a>
        </nav>
        <div style={{ marginTop: 14 }}>
          <strong>Have a Questions?</strong>
          <div style={{ marginTop: 8, color: "#444" }}>
            25 Kayode Otitoju, Off Admiralty Way, Lekki, Lagos, Nigeria
          </div>
          <div style={{ marginTop: 6 }}>
            <a href="tel:+2349166876907" style={{ color: BRAND.red }}>
              Tel: +234 916 687 6907
            </a>
          </div>
          <div style={{ marginTop: 6 }}>
            <a href="mailto:info@hillstar.com.ng" style={{ color: BRAND.red }}>
              info@hillstar.com.ng
            </a>
          </div>
        </div>
      </div>
    </div>
    <div style={{ textAlign: "center", marginTop: 30, color: "#666" }}>
      Copyright © {new Date().getFullYear()} All rights reserved | Hillstar Nig
      Ltd
    </div>
  </footer>
);

/* ------------------------------ Floating CTA ----------------------------- */
const FloatingCTA = () => (
  <a
    href="https://wa.me/2349166876907"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Talk to us on WhatsApp"
    style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      background: BRAND.red,
      color: BRAND.white,
      borderRadius: "50%",
      width: 64,
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3000,
      boxShadow: "0 8px 24px rgba(0,0,0,.5)",
    }}
  >
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.11 17.77c-.27-.13-1.57-.77-1.82-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.85 1.03-.16.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.56-1.48-1.82-.16-.27-.02-.42.11-.55.11-.11.27-.29.4-.44.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.6-1.45-.83-1.98-.22-.53-.44-.46-.6-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.24.27-.96.94-.96 2.29 0 1.35.99 2.66 1.13 2.84.13.18 1.95 2.98 4.73 4.18.66.29 1.17.46 1.57.59.66.21 1.26.18 1.73.11.53-.08 1.57-.64 1.79-1.26.22-.62.22-1.15.15-1.26-.07-.11-.24-.18-.5-.3zM16.02 4a11.98 11.98 0 00-10.3 18.04L4 28l6.11-1.6A11.97 11.97 0 1016.02 4zm0 21.78c-1.86 0-3.6-.5-5.12-1.45l-.37-.22-3.63.95.97-3.54-.24-.37A9.77 9.77 0 1125.79 16a9.77 9.77 0 01-9.77 9.78z" />
    </svg>
  </a>
);

/* ---------------------------------- App --------------------------------- */
export default function App() {
  const [mode, setMode] = useState("rent");
  return (
    <main style={layout.page}>
      {/* helper: anchor offset for sticky nav on all sections via scrollMarginTop in sectionPad */}
      <Topbar />
      <Nav />
      <Hero mode={mode} setMode={setMode} />
      <About />
      <Services />
      <Listings mode={mode} />
      <Contact />
      <Terms />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
