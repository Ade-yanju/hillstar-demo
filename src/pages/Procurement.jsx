// src/pages/Procurement.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BRAND,
  Icon,
  SOCIALS,
  useViewport,
  useScrollY,
  HeroStrip,
  Section,
  VideoPlayer,
  getEnv,
} from "../shared/Shared";

/* ---------------------------- Cloudinary helpers --------------------------- */
const CLOUD_NAME = getEnv(
  "VITE_CLOUDINARY_CLOUD_NAME",
  "REACT_APP_CLOUDINARY_CLOUD_NAME"
);
const CLOUD_PRESET = getEnv(
  "VITE_CLOUDINARY_UNSIGNED_PRESET",
  "REACT_APP_CLOUDINARY_UNSIGNED_PRESET"
);
const CLD_FOLDER = "hillstar/procurement";
const MANIFEST_ID = `${CLD_FOLDER}/manifest.json`;

async function cldUpload(file, folder = CLD_FOLDER) {
  if (!CLOUD_NAME || !CLOUD_PRESET)
    throw new Error("Cloudinary not configured");
  const isVideo = file.type?.startsWith("video/");
  const type = isVideo ? "video" : "raw";
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", CLOUD_PRESET);
  body.append("folder", folder);
  const res = await fetch(url, { method: "POST", body });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
  return json.secure_url;
}
async function publishManifest(data) {
  if (!CLOUD_NAME || !CLOUD_PRESET)
    throw new Error("Cloudinary not configured");
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;
  const fd = new FormData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  fd.append("file", blob, "manifest.json");
  fd.append("upload_preset", CLOUD_PRESET);
  fd.append("public_id", MANIFEST_ID);
  fd.append("overwrite", "true");
  const res = await fetch(url, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.error?.message || "Manifest publish failed");
  return json.secure_url;
}
async function fetchManifest() {
  if (!CLOUD_NAME) return null;
  const url = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${MANIFEST_ID}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ------------------------------- Admin (PIN) ------------------------------ */
const ADMIN_PIN =
  getEnv("VITE_HILLSTAR_ADMIN_PIN") ||
  getEnv("REACT_APP_HILLSTAR_ADMIN_PIN") ||
  "0809130732800";
const LS_ADMIN_ON_KEY = "hillstar.procurement.adminOn";

export default function Procurement() {
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [params, setParams] = useSearchParams();

  // URL-driven admin login like Projects.jsx
  const hasAdminPrompt =
    params.has("admin1") ||
    (params.get("admin") === "1" && !localStorage.getItem(LS_ADMIN_ON_KEY));

  const [adminOn, setAdminOn] = useState(
    localStorage.getItem(LS_ADMIN_ON_KEY) === "1"
  );
  const [showPin, setShowPin] = useState(hasAdminPrompt);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");

  const completeAdminLogin = () => {
    setAdminOn(true);
    try {
      localStorage.setItem(LS_ADMIN_ON_KEY, "1");
    } catch {}
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
    try {
      localStorage.removeItem(LS_ADMIN_ON_KEY);
    } catch {}
    const next = new URLSearchParams(params);
    next.delete("admin");
    setParams(next, { replace: true });
  };

  /* ---------------------------------- UI ---------------------------------- */
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
        {menuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.9)",
              zIndex: 2000,
              color: "#fff",
              display: "grid",
              placeItems: "center",
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
            <div style={{ textAlign: "center", display: "grid", gap: 20 }}>
              {[
                { t: "HOME", to: "/" },
                { t: "ABOUT", to: "/about" },
                { t: "OUR SERVICES", to: "/services" },
                { t: "OUR WORK", to: "/projects" },
                { t: "CONTACT US", to: "/contact" },
              ].map((l) => (
                <Link
                  key={l.t}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {l.t}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* --------------------------- Content & Manifest --------------------------- */
  const baseVideos = useMemo(
    () => [
      { src: "/tours/civic.mp4", label: "Procurement Tour #1" },
      { src: "/tours/paragon.mp4", label: "Procurement Tour #2" },
      { src: "/tours/lekki.mp4", label: "Procurement Tour #3" },
    ],
    []
  );

  const [manifest, setManifest] = useState({ videos: [] });
  const [loadingManifest, setLoadingManifest] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchManifest();
      if (!mounted) return;
      if (data && Array.isArray(data.videos))
        setManifest({ videos: data.videos });
      setLoadingManifest(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const videos = useMemo(
    () => [...manifest.videos, ...baseVideos],
    [manifest.videos, baseVideos]
  );

  return (
    <>
      <TopBar />
      <Navbar />

      {/* Admin badge & logout (only when ON) */}
      {adminOn && (
        <div
          style={{
            position: "relative",
            width: "min(1200px,92vw)",
            margin: "8px auto -8px",
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,.15)",
              background: "rgba(0,0,0,.05)",
              color: "#111",
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
              border: "1px solid rgba(0,0,0,.15)",
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

      <HeroStrip title="Procurement Services" />
      <Section
        title="What Procurement Means at Hillstar"
        subtitle="Highlights of our work with embedded tour videos."
        extraRight={
          adminOn ? (
            <span style={{ fontSize: 12, fontWeight: 800, color: BRAND.red }}>
              Admin mode (Cloudinary enabled)
            </span>
          ) : null
        }
      >
        {adminOn && (
          <VideoAdmin
            onAdded={async (item) => {
              const next = { videos: [item, ...manifest.videos] };
              setManifest(next);
              try {
                await publishManifest(next);
              } catch (e) {
                setErr(e?.message || "Failed to publish");
              }
            }}
          />
        )}
        {err && (
          <div style={{ marginTop: 8, color: "#b91c1c", fontWeight: 700 }}>
            {err}
          </div>
        )}

        <ul style={{ lineHeight: 1.9 }}>
          {[
            "Local & international sourcing",
            "QA/QC & compliance",
            "Logistics & warehousing",
          ].map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        {loadingManifest ? (
          <div style={{ opacity: 0.8, marginTop: 8 }}>Loading…</div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: vw > 900 ? "repeat(3,1fr)" : "1fr",
              marginTop: 16,
            }}
          >
            {videos.map((v, i) => (
              <VideoPlayer
                key={`${v.src}-${i}`}
                src={v.src}
                label={v.label || `Procurement Tour #${i + 1}`}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Admin PIN modal (Projects.jsx style) */}
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
            <div style={{ opacity: 0.8, fontSize: 14 }}>
              Enter the admin PIN to manage procurement videos.
            </div>
            <input
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinErr("");
              }}
              placeholder="PIN"
              style={{
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            />
            {pinErr && (
              <div style={{ color: "#b91c1c", fontWeight: 700 }}>{pinErr}</div>
            )}
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
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

/* ------------------------------ Admin Panel ------------------------------ */
function VideoAdmin({ onAdded }) {
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [state, setState] = useState({ label: "", src: "" });

  const input = {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 10,
    width: "100%",
  };
  const labelS = { fontWeight: 800, fontSize: 13 };

  async function up(files) {
    if (!files?.length) return;
    setErr("");
    setBusy(true);
    try {
      const url = await cldUpload(files[0]);
      setState((s) => ({ ...s, src: url }));
    } catch (e) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  function submit(e) {
    e.preventDefault();
    setErr("");
    if (!state.src) return setErr("Video is required");
    onAdded?.({ src: state.src, label: state.label || undefined });
    setState({ label: "", src: "" });
  }

  return (
    <div
      style={{
        border: "1px dashed #ccc",
        borderRadius: 12,
        padding: 12,
        background: "#fff",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <strong>Admin — Add Video</strong>
        <button
          onClick={() => setOpen((s) => !s)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#f9f9f9",
            fontWeight: 800,
          }}
        >
          {open ? "Hide" : "Add New"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={submit}
          style={{ display: "grid", gap: 10, marginTop: 10 }}
        >
          {err && (
            <div style={{ color: "#b91c1c", fontWeight: 700 }}>{err}</div>
          )}
          <div>
            <div style={labelS}>Label (optional)</div>
            <input
              style={input}
              value={state.label}
              onChange={(e) =>
                setState((s) => ({ ...s, label: e.target.value }))
              }
              placeholder="e.g. HQ Fit-out Sourcing"
            />
          </div>
          <div>
            <div style={labelS}>Video URL</div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                style={{ ...input, flex: 1 }}
                value={state.src}
                onChange={(e) =>
                  setState((s) => ({ ...s, src: e.target.value }))
                }
                placeholder="https://res.cloudinary.com/.../tour.mp4"
              />
              <label
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: busy ? "#f3f4f6" : "#fff",
                  fontWeight: 800,
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => up(e.target.files)}
                />
                {busy ? "Uploading…" : "Upload"}
              </label>
            </div>
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
              Save Video (Publish)
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
