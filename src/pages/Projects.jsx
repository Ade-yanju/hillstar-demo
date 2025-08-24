// src/pages/Projects.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BRAND, Icon, SOCIALS, useViewport, useScrollY } from "../shared/Shared";

/* ------------------------------------------------------------------ *
 * Projects / Our Work
 *  - Filters, search, sort, grid/list
 *  - Cards -> details modal with gallery + <video>
 *  - Admin: gated by ?admin1 -> PIN modal; can add/edit/delete projects
 *  - Persistence:
 *      • Always localStorage (immediate)
 *      • Optional Cloudinary JSON DB sync (unsigned preset) for cross-user
 * ------------------------------------------------------------------ */

/* ------------------------- Cloudinary + Admin env ------------------------- */
const getEnv = (k) =>
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[k]) ??
  (typeof process !== "undefined" && process.env && process.env[k]);

const CLOUD_NAME =
  getEnv("VITE_CLOUDINARY_CLOUD_NAME") || getEnv("REACT_APP_CLOUDINARY_CLOUD_NAME");

const CLOUD_PRESET =
  getEnv("VITE_CLOUDINARY_UNSIGNED_PRESET") || getEnv("REACT_APP_CLOUDINARY_UNSIGNED_PRESET");

const CLOUD_FOLDER = "hillstar/projects"; // for media uploads
const CLOUD_DB_ID = "hillstar/projects_db"; // raw JSON DB public_id (single source)

const ADMIN_PIN =
  getEnv("VITE_HILLSTAR_ADMIN_PIN") || getEnv("REACT_APP_HILLSTAR_ADMIN_PIN") || "0809130732800";

/* ------------------------------- Storage Keys ----------------------------- */
const LS_DB_KEY = "hillstar.projects.db.v2"; // the full DB (array of projects)
const LS_ADMIN_ON_KEY = "hillstar.projects.adminOn";

/* -------------------------- Cloudinary helpers ---------------------------- */
async function uploadToCloudinary(file, folder = CLOUD_FOLDER) {
  if (!CLOUD_NAME || !CLOUD_PRESET) {
    throw new Error(
      "Cloudinary not configured. Set VITE_/REACT_APP_ CLOUDINARY_CLOUD_NAME and CLOUDINARY_UNSIGNED_PRESET."
    );
  }
  const type = file.type?.startsWith("video/")
    ? "video"
    : file.type === "application/pdf" || /\.pdf$/i.test(file.name)
    ? "raw"
    : "image";

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", CLOUD_PRESET);
  body.append("folder", folder);
  body.append("context", `alt=${file.name}`);
  const res = await fetch(url, { method: "POST", body });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Cloudinary upload failed");
  return json.secure_url;
}

// Load DB JSON from Cloudinary (raw)
async function fetchDbFromCloudinary() {
  if (!CLOUD_NAME) return null;
  try {
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${CLOUD_DB_ID}.json`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const db = await res.json();
    if (!Array.isArray(db)) return null;
    return db;
  } catch {
    return null;
  }
}

// Save DB JSON to Cloudinary (best-effort; requires preset allowing raw uploads)
async function saveDbToCloudinary(dbArray) {
  if (!CLOUD_NAME || !CLOUD_PRESET) return false;
  try {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;
    const fileBlob = new Blob([JSON.stringify(dbArray)], { type: "application/json" });
    const body = new FormData();
    body.append("file", fileBlob);
    body.append("upload_preset", CLOUD_PRESET);
    body.append("public_id", CLOUD_DB_ID); // fixed id so URL remains stable
    body.append("overwrite", "true");
    const res = await fetch(url, { method: "POST", body });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || "Cloudinary DB save failed");
    return true;
  } catch {
    return false;
  }
}

/* --------------------------------- Seed ---------------------------------- */
const SEED = [
  {
    id: "ikoyi-duplex",
    title: "Luxury Duplex, Ikoyi",
    sector: "Real Estate",
    status: "completed",
    year: 2024,
    location: "Ikoyi, Lagos",
    cover: "/assets/villa.png",
    gallery: ["/assets/villa.png", "/assets/buy_lekki.jpg", "/assets/rent_ikoyi.jpg"],
    video: "/tours/lekki.mp4",
    brochure: "/brochures/ikoyi.pdf",
    summary: "High-spec 5-bed duplex with smart automation and rooftop sit-out.",
    metrics: [
      { k: "Units", v: "1" },
      { k: "Area", v: "420 m²" },
      { k: "Parking", v: "3" },
    ],
    tags: ["Smart Home", "Rooftop", "Gated Estate"],
  },
  {
    id: "estate-mini-grid",
    title: "5MWp Estate Mini-Grid",
    sector: "Renewable Energy",
    status: "ongoing",
    year: 2025,
    location: "Lekki, Lagos",
    cover: "/assets/solar1.jpg",
    gallery: ["/assets/solar1.jpg", "/assets/solar2.jpg"],
    video: "/tours/civic.mp4",
    summary:
      "Design and EPC for a solar + storage hybrid system powering a gated community.",
    metrics: [
      { k: "PV", v: "5MWp" },
      { k: "Storage", v: "12MWh" },
      { k: "Uptime", v: "99.5%" },
    ],
    tags: ["Hybrid", "Battery Storage"],
  },
  {
    id: "hospitality-suites",
    title: "Premium Short-let Suites",
    sector: "Hospitality",
    status: "completed",
    year: 2023,
    location: "Victoria Island, Lagos",
    cover: "/assets/suite.jpg",
    gallery: ["/assets/suite.jpg"],
    video: "/tours/suite-lekki.mp4",
    summary:
      "Digital-first apartments with concierge services and corporate-grade housekeeping.",
    tags: ["Corporate Stays", "Concierge"],
  },
];

/* ================================ Page ================================ */
export default function Projects() {
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const isWide = vw > 1024;

  /* ------------------------------ Admin Mode ------------------------------ */
  // Modal appears only if URL has ?admin1 (or ?admin=1 to keep state).
  const hasAdminPrompt =
    params.has("admin1") || (params.get("admin") === "1" && !localStorage.getItem(LS_ADMIN_ON_KEY));
  const [adminOn, setAdminOn] = useState(localStorage.getItem(LS_ADMIN_ON_KEY) === "1");
  const [showPin, setShowPin] = useState(hasAdminPrompt);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");

  const completeAdminLogin = () => {
    setAdminOn(true);
    localStorage.setItem(LS_ADMIN_ON_KEY, "1");
    const next = new URLSearchParams(params);
    next.delete("admin1");
    next.set("admin", "1");
    setParams(next, { replace: true });
    setShowPin(false);
    setPin("");
  };
  const cancelAdminPrompt = () => {
    setShowPin(false);
    const next = new URLSearchParams(params);
    next.delete("admin1");
    setParams(next, { replace: true });
  };
  const submitPin = (e) => {
    e.preventDefault();
    if (String(pin).trim() === String(ADMIN_PIN)) {
      completeAdminLogin();
    } else {
      setPinErr("Incorrect PIN");
    }
  };
  const logoutAdmin = () => {
    setAdminOn(false);
    localStorage.removeItem(LS_ADMIN_ON_KEY);
    const next = new URLSearchParams(params);
    next.delete("admin");
    setParams(next, { replace: true });
  };

  /* ------------------------------- DB State ------------------------------- */
  // Initial from localStorage or seed; then try to refresh from Cloudinary once.
  const [db, setDb] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(LS_DB_KEY) || "null");
      if (Array.isArray(cached) && cached.length) return cached;
    } catch {}
    localStorage.setItem(LS_DB_KEY, JSON.stringify(SEED));
    return SEED;
  });

  // Cloud sync on first load (best-effort)
  useEffect(() => {
    let alive = true;
    (async () => {
      const cloud = await fetchDbFromCloudinary();
      if (alive && Array.isArray(cloud) && cloud.length) {
        setDb(cloud);
        try {
          localStorage.setItem(LS_DB_KEY, JSON.stringify(cloud));
        } catch {}
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Save DB locally + try cloud
  async function saveDb(nextArray) {
    setDb(nextArray);
    try {
      localStorage.setItem(LS_DB_KEY, JSON.stringify(nextArray));
    } catch {}
    // best-effort cloud save; ignore failures
    await saveDbToCloudinary(nextArray);
  }

  const addProject = (p) => saveDb([{ ...p, id: `p_${Date.now()}` }, ...db]);
  const updateProject = (id, patch) => saveDb(db.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProject = (id) => saveDb(db.filter((p) => p.id !== id));

  /* ----------------------- FILTERS / SEARCH / SORT ---------------------- */
  const allYears = useMemo(
    () => Array.from(new Set(db.map((p) => p.year))).sort((a, b) => b - a),
    [db]
  );

  const [query, setQuery] = useState(params.get("q") || "");
  const [sector, setSector] = useState(params.get("sector") || "All");
  const [status, setStatus] = useState(params.get("status") || "All");
  const [year, setYear] = useState(params.get("year") || "All");
  const [sort, setSort] = useState(params.get("sort") || "newest");
  const [view, setView] = useState(params.get("view") || "grid");
  const [visible, setVisible] = useState(8);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (sector !== "All") next.set("sector", sector);
    if (status !== "All") next.set("status", status);
    if (year !== "All") next.set("year", year);
    if (sort !== "newest") next.set("sort", sort);
    if (view !== "grid") next.set("view", view);
    if (adminOn) next.set("admin", "1");
    setParams(next, { replace: true });
  }, [query, sector, status, year, sort, view, adminOn, setParams]);

  const filtered = useMemo(() => {
    let out = db.slice();
    if (sector !== "All") out = out.filter((p) => p.sector === sector);
    if (status !== "All") out = out.filter((p) => p.status === status);
    if (year !== "All") out = out.filter((p) => String(p.year) === String(year));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((p) =>
        [p.title, p.summary, p.sector, p.location, ...(p.tags || [])].join(" ").toLowerCase().includes(q)
      );
    }
    if (sort === "newest") out.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sort === "oldest") out.sort((a, b) => (a.year || 0) - (b.year || 0));
    if (sort === "az") out.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  }, [db, sector, status, year, query, sort]);

  const page = filtered.slice(0, visible);

  /* ---------------------- Details modal state + keys ---------------------- */
  const [open, setOpen] = useState(null);
  const onKey = useCallback((e) => {
    if (e.key === "Escape" && !e.repeat) setOpen(null);
  }, []);
  useEffect(() => {
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  /* --------------------------- NAV CHROME --------------------------- */
  const TopBar = () => (
    <div style={{ background: BRAND.darkGray, color: "#fff", fontSize: 13, padding: "6px 0" }}>
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
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon.Phone size={16} />
            <span>
              <span style={{ color: BRAND.red }}>Free Call</span> +234 916 687 6907
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon.Location size={16} />
            <span>
              <span style={{ color: BRAND.red }}>Our Location:</span> 25 Kayode Otitoju, Lekki, Lagos
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>Connect with us</span>
          {SOCIALS.slice(0, 3).map(({ name, href, Icon: IC }) => (
            <a key={name} href={href} aria-label={name} style={{ color: "#fff" }}>
              <IC size={18} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  function MenuOverlay({ onClose }) {
    const items = [
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
    useEffect(() => {
      const p = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = p);
    }, []);
    return (
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
          <button onClick={onClose} aria-label="Close menu" style={{ background: "none", border: "none", color: "#fff" }}>
            <Icon.X />
          </button>
        </div>
        <div
          style={{
            width: "min(1200px,92vw)",
            margin: "0 auto",
            padding: "42px 0",
            display: "grid",
            gap: 24,
            gridTemplateColumns: vw > 900 ? "1.05fr 1fr" : "1fr",
          }}
        >
          <nav style={{ textAlign: vw > 900 ? "left" : "center", display: "grid", gap: 18 }}>
            {items.map((i) => (
              <Link
                key={i.t}
                to={i.to}
                onClick={onClose}
                style={{ color: "#fff", textDecoration: "none", fontSize: 24, fontWeight: 800 }}
              >
                {i.t}
              </Link>
            ))}
          </nav>
          <aside
            style={{
              borderLeft: vw > 900 ? "1px solid rgba(255,255,255,.12)" : "none",
              paddingLeft: vw > 900 ? 20 : 0,
              display: "grid",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, opacity: 0.85, marginBottom: 8 }}>Sectors</div>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2,1fr)" }}>
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
                    <s.Icon size={20} style={{ color: BRAND.red }} /> <span style={{ fontWeight: 700 }}>{s.t}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contact" onClick={onClose} style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: BRAND.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontWeight: 900,
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
      <Link to={to} style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>
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
          <div onClick={() => nav("/")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <img src="/assets/hillstar-logo.png" alt="logo" style={{ height: 40 }} />
            <span style={{ color: BRAND.red, fontWeight: 900, fontSize: 20 }}>Hillstar</span>
          </div>
          <div style={{ display: isMobile ? "none" : "flex", gap: 20, alignItems: "center" }}>
            <MenuLink to="/">HOME</MenuLink>
            <MenuLink to="/about">ABOUT</MenuLink>
            <MenuLink to="/services">OUR SERVICES</MenuLink>
            <MenuLink to="/projects">OUR WORK</MenuLink>
            <MenuLink to="/contact">CONTACT US</MenuLink>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ display: isMobile ? "block" : "none", background: "none", border: "none", color: "#fff" }}
          >
            <Icon.Burger />
          </button>
        </div>
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      </div>
    );
  };

  /* ----------------------------- UI Helpers ----------------------------- */
  const chip = (active) => ({
    padding: "8px 12px",
    borderRadius: 999,
    border: `2px solid ${active ? BRAND.red : "#ddd"}`,
    background: active ? BRAND.red : "#fff",
    color: active ? "#fff" : "#222",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });
  const pill = {
    padding: "6px 10px",
    border: "1px solid #eee",
    borderRadius: 999,
    fontSize: 12,
  };
  const Section = ({ children, style }) => (
    <section style={{ padding: "48px 0", background: "#fff", ...style }}>
      <div style={{ width: "min(1200px,92vw)", margin: "0 auto" }}>{children}</div>
    </section>
  );

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
          height: 320,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)" }} />
        <div style={{ position: "relative", width: "min(900px,92vw)" }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>Our Work</h1>
          <p style={{ marginTop: 8, fontSize: 18 }}>
            A selection of projects across property, power, procurement and telecoms.
          </p>
        </div>

        {/* Subtle admin badge & logout (only when ON) */}
        {adminOn && (
          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.35)",
                background: "rgba(0,0,0,.55)",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              Admin
            </span>
            <button
              onClick={logoutAdmin}
              title="Sign out"
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.35)",
                background: BRAND.red,
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Section>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => setSector("All")} style={chip(sector === "All")}>
              All Sectors
            </button>
            {["Real Estate", "Hospitality", "Renewable Energy", "Procurement Services", "Telecom & Technology"].map(
              (s) => (
                <button key={s} onClick={() => setSector(s)} style={chip(sector === s)}>
                  {s}
                </button>
              )
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {["All", "ongoing", "completed", "soldout"].map((st) => (
              <button key={st} onClick={() => setStatus(st)} style={chip(status === st)}>
                {st === "All" ? "All Status" : st[0].toUpperCase() + st.slice(1)}
              </button>
            ))}
            <select value={year} onChange={(e) => setYear(e.target.value)} style={{ ...pill, padding: "8px 12px" }}>
              <option value="All">All Years</option>
              {allYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...pill, padding: "8px 12px" }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
            </select>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                onClick={() => setView("grid")}
                style={{
                  ...pill,
                  background: view === "grid" ? BRAND.red : "#fff",
                  color: view === "grid" ? "#fff" : "#222",
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                style={{
                  ...pill,
                  background: view === "list" ? BRAND.red : "#fff",
                  color: view === "list" ? "#fff" : "#222",
                }}
              >
                List
              </button>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              style={{
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: 10,
                width: 260,
              }}
            />
          </div>

          {adminOn && <AdminConsole onAdd={addProject} />}
        </div>
      </Section>

      {/* Grid/List */}
      <Section style={{ background: "#f5f5f5" }}>
        {page.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.8 }}>No matching projects.</div>
        ) : view === "grid" ? (
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: isWide ? "repeat(3,1fr)" : vw > 640 ? "repeat(2,1fr)" : "1fr",
            }}
          >
            {page.map((p) => (
              <ProjectCard
                key={p.id}
                p={p}
                onOpen={() => setOpen(p)}
                admin={adminOn}
                onAdmin={updateProject}
                onDelete={deleteProject}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {page.map((p) => (
              <ProjectRow
                key={p.id}
                p={p}
                onOpen={() => setOpen(p)}
                admin={adminOn}
                onAdmin={updateProject}
                onDelete={deleteProject}
              />
            ))}
          </div>
        )}

        {visible < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button
              onClick={() => setVisible((v) => v + 8)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: BRAND.red,
                color: "#fff",
                fontWeight: 900,
              }}
            >
              Load more
            </button>
          </div>
        )}
      </Section>

      {/* Details Modal */}
      {open && (
        <DetailsModal
          p={open}
          onClose={() => setOpen(null)}
          onAdmin={adminOn ? (patch) => updateProject(open.id, patch) : null}
        />
      )}

      {/* CTA */}
      <Section style={{ background: BRAND.black, color: "#fff", textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Have a project in mind?</h2>
        <p style={{ opacity: 0.9, marginTop: 8 }}>We’ll scope it and get back with options.</p>
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
      </Section>

      {/* Admin PIN modal */}
      {showPin && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 4000,
          }}
        >
          <form
            onSubmit={submitPin}
            style={{
              width: "min(420px,92vw)",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              display: "grid",
              gap: 10,
              boxShadow: "0 20px 60px rgba(0,0,0,.4)",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18 }}>Admin Access</div>
            <div style={{ opacity: 0.8, fontSize: 14 }}>Enter the admin PIN to manage projects.</div>
            <input
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinErr("");
              }}
              placeholder="PIN"
              style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}
            />
            {pinErr && <div style={{ color: "#b91c1c", fontWeight: 700 }}>{pinErr}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={cancelAdminPrompt}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fff",
                  fontWeight: 900,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: BRAND.red,
                  color: "#fff",
                  fontWeight: 900,
                }}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

/* ------------------------------- Cards ------------------------------- */
const btnPrimary = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: BRAND.red,
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
  textDecoration: "none",
};
const btnGhost = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  fontWeight: 900,
  cursor: "pointer",
  textDecoration: "none",
};
const btnAdmin = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#f9f9f9",
  fontWeight: 800,
  cursor: "pointer",
};

function badgeStyle(st) {
  const map = { completed: "#0ea5e9", ongoing: "#f59e0b", soldout: "#ef4444" };
  return {
    padding: "4px 8px",
    borderRadius: 999,
    background: map[st] || "#ddd",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
  };
}
function labelStatus(st) {
  if (st === "soldout") return "Sold Out";
  if (st === "ongoing") return "Ongoing";
  return "Completed";
}

function ProjectCard({ p, onOpen, admin, onAdmin, onDelete }) {
  const [editing, setEditing] = useState(false);
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        display: "grid",
      }}
    >
      <div style={{ position: "relative", height: 180, background: `#000 url(${p.cover}) center/cover no-repeat` }}>
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 8 }}>
          <span
            style={{
              padding: "4px 8px",
              borderRadius: 999,
              background: "rgba(0,0,0,.55)",
              color: "#fff",
              fontSize: 12,
            }}
          >
            {p.sector}
          </span>
          <span style={badgeStyle(p.status)}>{labelStatus(p.status)}</span>
        </div>
      </div>
      <div style={{ padding: 12, display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>{p.title}</div>
        <div style={{ opacity: 0.8, fontSize: 13 }}>
          {p.location} • {p.year}
        </div>
        <p style={{ margin: 0 }}>{p.summary}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(p.tags || []).map((t, i) => (
            <span key={i} style={{ padding: "6px 10px", border: "1px solid #eee", borderRadius: 999, fontSize: 12 }}>
              {t}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={onOpen} style={btnPrimary}>
            View Details
          </button>
          {p.brochure && (
            <a href={p.brochure} download style={btnGhost}>
              Download Brochure
            </a>
          )}
          <a
            href={`https://wa.me/2349166876907?text=${encodeURIComponent("Project: " + p.title)}`}
            target="_blank"
            rel="noreferrer"
            style={btnGhost}
          >
            Share
          </a>
        </div>
        {admin && (
          <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setEditing(true)} style={btnAdmin}>
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Delete this project?")) onDelete(p.id);
              }}
              style={{ ...btnAdmin, color: "#b91c1c" }}
            >
              Delete
            </button>
            <button
              onClick={() => onAdmin(p.id, { status: p.status === "soldout" ? "ongoing" : "soldout" })}
              style={btnAdmin}
            >
              {p.status === "soldout" ? "Unset Sold Out" : "Mark Sold Out"}
            </button>
            <button
              onClick={() => onAdmin(p.id, { status: p.status === "completed" ? "ongoing" : "completed" })}
              style={btnAdmin}
            >
              {p.status === "completed" ? "Mark Ongoing" : "Mark Completed"}
            </button>
          </div>
        )}
      </div>
      {editing && <EditModal p={p} onClose={() => setEditing(false)} onSave={(patch) => onAdmin(p.id, patch)} />}
    </div>
  );
}

function ProjectRow({ p, onOpen, admin, onAdmin, onDelete }) {
  const [editing, setEditing] = useState(false);
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
      }}
    >
      <div style={{ background: `#000 url(${p.cover}) center/cover no-repeat` }} />
      <div style={{ padding: 12, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 900, fontSize: 18 }}>{p.title}</span>
          <span style={{ padding: "4px 8px", border: "1px solid #eee", borderRadius: 999, fontSize: 12 }}>
            {p.sector}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={badgeStyle(p.status)}>{labelStatus(p.status)}</span>
        </div>
        <div style={{ opacity: 0.8, fontSize: 13 }}>
          {p.location} • {p.year}
        </div>
        <p style={{ margin: 0 }}>{p.summary}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(p.metrics || []).map((m, i) => (
            <div key={i} style={{ border: "1px solid #eee", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{m.k}</div>
              <div style={{ fontWeight: 800 }}>{m.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={onOpen} style={btnPrimary}>
            View Details
          </button>
          {p.brochure && (
            <a href={p.brochure} download style={btnGhost}>
              Download Brochure
            </a>
          )}
        </div>
        {admin && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setEditing(true)} style={btnAdmin}>
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Delete this project?")) onDelete(p.id);
              }}
              style={{ ...btnAdmin, color: "#b91c1c" }}
            >
              Delete
            </button>
            <button
              onClick={() => onAdmin(p.id, { status: p.status === "soldout" ? "ongoing" : "soldout" })}
              style={btnAdmin}
            >
              {p.status === "soldout" ? "Unset Sold Out" : "Mark Sold Out"}
            </button>
            <button
              onClick={() => onAdmin(p.id, { status: p.status === "completed" ? "ongoing" : "completed" })}
              style={btnAdmin}
            >
              {p.status === "completed" ? "Mark Ongoing" : "Mark Completed"}
            </button>
          </div>
        )}
      </div>
      {editing && <EditModal p={p} onClose={() => setEditing(false)} onSave={(patch) => onAdmin(p.id, patch)} />}
    </div>
  );
}

/* ---------------------------- Details Modal ---------------------------- */
function DetailsModal({ p, onClose, onAdmin }) {
  const vw = useViewport();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);
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
      }}
    >
      <div
        style={{
          width: "min(1000px,92vw)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{p.title}</div>
            <span style={{ padding: "4px 8px", border: "1px solid #eee", borderRadius: 999, fontSize: 12 }}>
              {p.sector}
            </span>
            <span style={badgeStyle(p.status)}>{labelStatus(p.status)}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              background: "none",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: vw > 900 ? "1.3fr 1fr" : "1fr",
            gap: 16,
            padding: 16,
          }}
        >
          <div>
            <Gallery images={p.gallery} cover={p.cover} />
            {p.video && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700, margin: "6px 0" }}>{p.title} — Tour</div>
                <video
                  controls
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: 260,
                    border: "1px solid #eee",
                    borderRadius: 10,
                    background: "#0e0e0e",
                  }}
                >
                  <source src={p.video} type="video/mp4" />
                </video>
              </div>
            )}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ color: BRAND.red, fontWeight: 900 }}>
              {p.location} • {p.year}
            </div>
            <p style={{ margin: 0 }}>{p.summary}</p>
            {(p.metrics || []).length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
                {p.metrics.map((m, i) => (
                  <div key={i} style={{ border: "1px solid #eee", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{m.k}</div>
                    <div style={{ fontWeight: 800 }}>{m.v}</div>
                  </div>
                ))}
              </div>
            )}
            {p.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.tags.map((t, i) => (
                  <span
                    key={i}
                    style={{ padding: "6px 10px", border: "1px solid #eee", borderRadius: 999, fontSize: 12 }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {p.brochure && (
                <a href={p.brochure} download style={btnGhost}>
                  Download Brochure
                </a>
              )}
              <a
                href={`mailto:info@hillstar.com.ng?subject=${encodeURIComponent("Project: " + p.title)}`}
                style={btnPrimary}
              >
                Enquire
              </a>
              <a
                href={`https://wa.me/2349166876907?text=${encodeURIComponent("Project: " + p.title)}`}
                target="_blank"
                rel="noreferrer"
                style={btnGhost}
              >
                WhatsApp
              </a>
            </div>
            {onAdmin && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => onAdmin({ status: p.status === "soldout" ? "ongoing" : "soldout" })}
                  style={btnAdmin}
                >
                  {p.status === "soldout" ? "Unset Sold Out" : "Mark Sold Out"}
                </button>
                <button
                  onClick={() => onAdmin({ status: p.status === "completed" ? "ongoing" : "completed" })}
                  style={btnAdmin}
                >
                  {p.status === "completed" ? "Mark Ongoing" : "Mark Completed"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Gallery({ images = [], cover }) {
  const [idx, setIdx] = useState(0);
  const imgs = images && images.length ? images : cover ? [cover] : [];
  return (
    <div>
      <div
        style={{
          background: imgs[idx] ? `#000 url(${imgs[idx]}) center/cover no-repeat` : "#f3f4f6",
          height: 260,
          borderRadius: 10,
          border: "1px solid #eee",
        }}
      />
      {imgs.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, overflowX: "auto", paddingBottom: 4 }}>
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: 80,
                height: 60,
                background: `#000 url(${src}) center/cover no-repeat`,
                borderRadius: 8,
                border: i === idx ? `2px solid ${BRAND.red}` : "1px solid #ddd",
                flex: "0 0 auto",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Admin Panel ----------------------------- */
function AdminConsole({ onAdd }) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [state, setState] = useState({
    title: "",
    sector: "Real Estate",
    status: "ongoing",
    year: new Date().getFullYear(),
    location: "",
    cover: "",
    gallery: [],
    video: "",
    brochure: "",
    summary: "",
    tags: "",
  });
  const [busy, setBusy] = useState({ cover: false, gallery: false, video: false, brochure: false });
  const [error, setError] = useState("");

  const input = { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, width: "100%" };
  const label = { fontWeight: 800, fontSize: 13 };
  const set = (k, v) => setState((s) => ({ ...s, [k]: v }));

  async function handleUpload(which, files) {
    if (!files?.length) return;
    setError("");
    setBusy((b) => ({ ...b, [which]: true }));
    try {
      if (which === "gallery") {
        const urls = [];
        for (const f of files) urls.push(await uploadToCloudinary(f));
        setState((s) => ({ ...s, gallery: [...s.gallery, ...urls] }));
        setState((s) => (s.cover ? s : { ...s, cover: urls[0] || s.cover }));
      } else {
        const u = await uploadToCloudinary(files[0]);
        set(which, u);
        if (which === "cover" && !state.gallery.length) set("gallery", [u]);
      }
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setBusy((b) => ({ ...b, [which]: false }));
    }
  }

  const removeFromGallery = (idx) =>
    setState((s) => ({ ...s, gallery: s.gallery.filter((_, i) => i !== idx) }));

  const submit = (e) => {
    e.preventDefault();
    const p = {
      ...state,
      year: Number(state.year) || new Date().getFullYear(),
      metrics: [],
      tags: state.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onAdd(p);
    setState({
      title: "",
      sector: "Real Estate",
      status: "ongoing",
      year: new Date().getFullYear(),
      location: "",
      cover: "",
      gallery: [],
      video: "",
      brochure: "",
      summary: "",
      tags: "",
    });
  };

  const uploadBtn = (busy) => ({
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: busy ? "#f3f4f6" : "#fff",
    fontWeight: 900,
    cursor: busy ? "not-allowed" : "pointer",
  });

  return (
    <div style={{ border: "1px dashed #ccc", borderRadius: 12, padding: 12, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <strong>Admin Console</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="https://cloudinary.com" target="_blank" rel="noreferrer" style={{ fontSize: 12, opacity: 0.7, textDecoration: "none" }}>
            Powered by Cloudinary
          </a>
          <button
            onClick={() => setPanelOpen((s) => !s)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#f9f9f9" }}
          >
            {panelOpen ? "Hide" : "Add Project"}
          </button>
        </div>
      </div>

      {panelOpen && (
        <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {error && <div style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</div>}

          <div>
            <div style={label}>Title</div>
            <input style={input} value={state.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={label}>Sector</div>
              <select style={input} value={state.sector} onChange={(e) => set("sector", e.target.value)}>
                {["Real Estate", "Hospitality", "Renewable Energy", "Procurement Services", "Telecom & Technology"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </div>
            <div>
              <div style={label}>Status</div>
              <select style={input} value={state.status} onChange={(e) => set("status", e.target.value)}>
                {["ongoing", "completed", "soldout"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={label}>Year</div>
              <input type="number" style={input} value={state.year} onChange={(e) => set("year", e.target.value)} />
            </div>
            <div>
              <div style={label}>Location</div>
              <input style={input} value={state.location} onChange={(e) => set("location", e.target.value)} />
            </div>
          </div>

          {/* Cover */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Cover Image</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input
                style={{ ...input, flex: 1 }}
                placeholder="https://res.cloudinary.com/.../cover.jpg"
                value={state.cover}
                onChange={(e) => set("cover", e.target.value)}
              />
              <label style={uploadBtn(busy.cover)}>
                <input type="file" accept="image/*" hidden onChange={(e) => handleUpload("cover", e.target.files)} />
                {busy.cover ? "Uploading…" : "Upload"}
              </label>
            </div>
            {state.cover && (
              <div
                style={{
                  width: 140,
                  height: 90,
                  borderRadius: 8,
                  border: "1px solid #eee",
                  background: `#000 url(${state.cover}) center/cover no-repeat`,
                }}
              />
            )}
          </div>

          {/* Gallery */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Gallery</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <label style={uploadBtn(busy.gallery)}>
                <input type="file" accept="image/*" multiple hidden onChange={(e) => handleUpload("gallery", e.target.files)} />
                {busy.gallery ? "Uploading…" : "Upload Images"}
              </label>
            </div>
            {state.gallery.length > 0 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {state.gallery.map((g, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 90,
                        height: 66,
                        borderRadius: 8,
                        border: "1px solid #eee",
                        background: `#000 url(${g}) center/cover no-repeat`,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFromGallery(i)}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        border: "none",
                        background: BRAND.red,
                        color: "#fff",
                        borderRadius: 999,
                        width: 22,
                        height: 22,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Video (.mp4)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input
                style={{ ...input, flex: 1 }}
                placeholder="https://res.cloudinary.com/.../tour.mp4"
                value={state.video}
                onChange={(e) => set("video", e.target.value)}
              />
              <label style={uploadBtn(busy.video)}>
                <input type="file" accept="video/*" hidden onChange={(e) => handleUpload("video", e.target.files)} />
                {busy.video ? "Uploading…" : "Upload"}
              </label>
            </div>
          </div>

          {/* Brochure */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Brochure (.pdf)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input
                style={{ ...input, flex: 1 }}
                placeholder="https://res.cloudinary.com/.../brochure.pdf"
                value={state.brochure}
                onChange={(e) => set("brochure", e.target.value)}
              />
              <label style={uploadBtn(busy.brochure)}>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  hidden
                  onChange={(e) => handleUpload("brochure", e.target.files)}
                />
                {busy.brochure ? "Uploading…" : "Upload"}
              </label>
            </div>
          </div>

          <div>
            <div style={label}>Summary</div>
            <textarea style={{ ...input, minHeight: 100 }} value={state.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>

          <div>
            <div style={label}>Tags (comma separated)</div>
            <input
              style={input}
              value={state.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Smart Home, Rooftop"
            />
          </div>

          <div>
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: BRAND.red,
                color: "#fff",
                fontWeight: 900,
              }}
            >
              Save Project
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ------------------------------ Edit Modal ------------------------------ */
function EditModal({ p, onClose, onSave }) {
  const [state, setState] = useState({
    title: p.title || "",
    sector: p.sector || "Real Estate",
    status: p.status || "ongoing",
    year: p.year || new Date().getFullYear(),
    location: p.location || "",
    cover: p.cover || "",
    gallery: p.gallery ? [...p.gallery] : [],
    video: p.video || "",
    brochure: p.brochure || "",
    summary: p.summary || "",
    tags: (p.tags || []).join(", "),
  });
  const [busy, setBusy] = useState({ cover: false, gallery: false, video: false, brochure: false });
  const [error, setError] = useState("");

  const input = { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, width: "100%" };
  const label = { fontWeight: 800, fontSize: 13 };
  const set = (k, v) => setState((s) => ({ ...s, [k]: v }));

  async function handleUpload(which, files) {
    if (!files?.length) return;
    setError("");
    setBusy((b) => ({ ...b, [which]: true }));
    try {
      if (which === "gallery") {
        const urls = [];
        for (const f of files) urls.push(await uploadToCloudinary(f));
        setState((s) => ({ ...s, gallery: [...s.gallery, ...urls] }));
        setState((s) => (s.cover ? s : { ...s, cover: urls[0] || s.cover }));
      } else {
        const u = await uploadToCloudinary(files[0]);
        set(which, u);
        if (which === "cover" && !state.gallery.length) set("gallery", [u]);
      }
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setBusy((b) => ({ ...b, [which]: false }));
    }
  }
  const removeFromGallery = (idx) =>
    setState((s) => ({ ...s, gallery: s.gallery.filter((_, i) => i !== idx) }));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...state,
      year: Number(state.year) || new Date().getFullYear(),
      tags: state.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    onClose();
  };

  const uploadBtn = (busy) => ({
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: busy ? "#f3f4f6" : "#fff",
    fontWeight: 900,
    cursor: busy ? "not-allowed" : "pointer",
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

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
        zIndex: 3500,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "min(900px,92vw)",
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          display: "grid",
          gap: 10,
          boxShadow: "0 20px 60px rgba(0,0,0,.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Edit Project</div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: "1px solid #ddd", background: "#fff", borderRadius: 8, padding: "6px 10px" }}
          >
            Close
          </button>
        </div>

        {error && <div style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</div>}

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <div style={label}>Title</div>
            <input style={input} value={state.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={label}>Sector</div>
              <select style={input} value={state.sector} onChange={(e) => set("sector", e.target.value)}>
                {["Real Estate", "Hospitality", "Renewable Energy", "Procurement Services", "Telecom & Technology"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </div>
            <div>
              <div style={label}>Status</div>
              <select style={input} value={state.status} onChange={(e) => set("status", e.target.value)}>
                {["ongoing", "completed", "soldout"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={label}>Year</div>
              <input type="number" style={input} value={state.year} onChange={(e) => set("year", e.target.value)} />
            </div>
            <div>
              <div style={label}>Location</div>
              <input style={input} value={state.location} onChange={(e) => set("location", e.target.value)} />
            </div>
          </div>

          {/* Cover */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Cover Image</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input style={{ ...input, flex: 1 }} value={state.cover} onChange={(e) => set("cover", e.target.value)} />
              <label style={uploadBtn(busy.cover)}>
                <input type="file" accept="image/*" hidden onChange={(e) => handleUpload("cover", e.target.files)} />
                {busy.cover ? "Uploading…" : "Upload"}
              </label>
            </div>
            {state.cover && (
              <div
                style={{
                  width: 140,
                  height: 90,
                  borderRadius: 8,
                  border: "1px solid #eee",
                  background: `#000 url(${state.cover}) center/cover no-repeat`,
                }}
              />
            )}
          </div>

          {/* Gallery */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Gallery</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <label style={uploadBtn(busy.gallery)}>
                <input type="file" accept="image/*" multiple hidden onChange={(e) => handleUpload("gallery", e.target.files)} />
                {busy.gallery ? "Uploading…" : "Upload Images"}
              </label>
            </div>
            {state.gallery.length > 0 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {state.gallery.map((g, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 90,
                        height: 66,
                        borderRadius: 8,
                        border: "1px solid #eee",
                        background: `#000 url(${g}) center/cover no-repeat`,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFromGallery(i)}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        border: "none",
                        background: BRAND.red,
                        color: "#fff",
                        borderRadius: 999,
                        width: 22,
                        height: 22,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Video (.mp4)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input style={{ ...input, flex: 1 }} value={state.video} onChange={(e) => set("video", e.target.value)} />
              <label style={uploadBtn(busy.video)}>
                <input type="file" accept="video/*" hidden onChange={(e) => handleUpload("video", e.target.files)} />
                {busy.video ? "Uploading…" : "Upload"}
              </label>
            </div>
          </div>

          {/* Brochure */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={label}>Brochure (.pdf)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input style={{ ...input, flex: 1 }} value={state.brochure} onChange={(e) => set("brochure", e.target.value)} />
              <label style={uploadBtn(busy.brochure)}>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  hidden
                  onChange={(e) => handleUpload("brochure", e.target.files)}
                />
                {busy.brochure ? "Uploading…" : "Upload"}
              </label>
            </div>
          </div>

          <div>
            <div style={label}>Summary</div>
            <textarea style={{ ...input, minHeight: 100 }} value={state.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>

          <div>
            <div style={label}>Tags (comma separated)</div>
            <input style={input} value={state.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Smart Home, Rooftop" />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontWeight: 900 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: BRAND.red, color: "#fff", fontWeight: 900 }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
