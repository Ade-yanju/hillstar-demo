// src/pages/Hospitality.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BRAND,
  Icon,
  SOCIALS,
  useViewport,
  useScrollY,
  slugify,
  Section,
  HeroStrip,
  VideoPlayer,
  Spec,
  BookingForm,
  smallCta,
  getEnv,
} from "../shared/Shared";

/* ----------------------- Cloudinary (env + helpers) ----------------------- */
const CLOUD_NAME = getEnv(
  "VITE_CLOUDINARY_CLOUD_NAME",
  "REACT_APP_CLOUDINARY_CLOUD_NAME"
);
const CLOUD_PRESET = getEnv(
  "VITE_CLOUDINARY_UNSIGNED_PRESET",
  "REACT_APP_CLOUDINARY_UNSIGNED_PRESET"
);
const CLD_FOLDER = "hillstar/hospitality";
const MANIFEST_ID = `${CLD_FOLDER}/manifest.json`;

// Admin PIN (same pattern as Projects.jsx)
const ADMIN_PIN =
  getEnv("VITE_HILLSTAR_ADMIN_PIN") ||
  getEnv("REACT_APP_HILLSTAR_ADMIN_PIN") ||
  "0809130732800";
const LS_ADMIN_ON_KEY = "hillstar.hospitality.adminOn";

async function cldUpload(file, folder = CLD_FOLDER) {
  if (!CLOUD_NAME || !CLOUD_PRESET)
    throw new Error("Cloudinary not configured");
  const isVideo = file.type?.startsWith("video/");
  const isPDF =
    file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");
  const type = isVideo ? "video" : isPDF ? "raw" : "image";
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", CLOUD_PRESET);
  body.append("folder", folder);
  body.append("context", `alt=${file.name || "upload"}`);
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

export default function Hospitality() {
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();

  /* ------------------------------ Navbar UI ------------------------------ */
  const [menuOpen, setMenuOpen] = useState(false);

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
              Otitoju, Off Admiralty Way, Lekki, Lagos, Nigeria
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

  /* ---------------------------- Admin (Projects-style) ---------------------------- */
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

  /* ------------------------------ Rooms / manifest ------------------------------ */
  const baseRooms = useMemo(
    () => [
      {
        title: "Premium Suite, Lekki",
        price: "₦120k / night",
        img: "/assets/villa.png",
        tourSrc: "/tours/suite-lekki.mp4",
        specs: {
          bed: "King",
          guests: 2,
          size: "45 m²",
          address: "Lekki Phase 1, Lagos",
        },
        amenities: [
          "Wi-Fi",
          "Smart TV",
          "Kitchenette",
          "Workspace",
          "24/7 Power",
        ],
        description:
          "A serene premium suite with tasteful interiors and modern conveniences.",
      },
      {
        title: "Studio Ikoyi",
        price: "₦75k / night",
        img: "/assets/rent_ikoyi.jpg",
        tourSrc: "/tours/ikoyi-studio.mp4",
        specs: {
          bed: "Queen",
          guests: 2,
          size: "28 m²",
          address: "Ikoyi, Lagos",
        },
        amenities: ["Wi-Fi", "Gym Access", "Air Conditioning", "CCTV"],
        description:
          "Bright studio apartment in central Ikoyi, ideal for short stays.",
      },
    ],
    []
  );

  const [manifest, setManifest] = useState({ rooms: [] });
  const [loadingManifest, setLoadingManifest] = useState(true);
  const [manifestError, setManifestError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchManifest();
      if (!mounted) return;
      if (data && Array.isArray(data.rooms)) setManifest({ rooms: data.rooms });
      setLoadingManifest(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const rooms = useMemo(
    () => [...manifest.rooms, ...baseRooms],
    [manifest.rooms, baseRooms]
  );

  // Details modal routing param
  const selected = params.get("h")
    ? rooms.find((r) => slugify(r.title) === params.get("h"))
    : null;

  const openRoom = (r) => {
    const next = new URLSearchParams(params);
    next.set("h", slugify(r.title));
    setParams(next);
  };
  const closeRoom = () => {
    const next = new URLSearchParams(params);
    next.delete("h");
    setParams(next);
  };

  // Video tour modal (separate, Airbnb-style: link to watch)
  const [tourOf, setTourOf] = useState(null);

  return (
    <>
      <TopBar />
      <Navbar />

      <HeroStrip
        title="Hospitality"
        subtitle="Browse and book — Airbnb-style."
      />

      {/* Subtle admin badge & logout (only when ON) */}
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

      <Section
        title="Stay With Us"
        subtitle="Open a room to see full details, book, or watch the tour."
        extraRight={
          adminOn ? (
            <span style={{ fontSize: 12, fontWeight: 800, color: BRAND.red }}>
              Admin mode (Cloudinary enabled)
            </span>
          ) : null
        }
      >
        {adminOn && (
          <HospitalityAdmin
            onAdded={async (room) => {
              const next = { rooms: [room, ...manifest.rooms] };
              setManifest(next);
              try {
                await publishManifest(next);
              } catch (e) {
                setManifestError(e?.message || "Failed to publish");
              }
            }}
          />
        )}
        {manifestError && (
          <div style={{ marginTop: 8, color: "#b91c1c", fontWeight: 700 }}>
            {manifestError}
          </div>
        )}

        {loadingManifest ? (
          <div style={{ opacity: 0.8, marginTop: 8 }}>Loading rooms…</div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: vw > 1000 ? "repeat(2,1fr)" : "1fr",
            }}
          >
            {rooms.map((r, i) => (
              <div
                key={`${slugify(r.title)}-${i}`}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    background: `#000 url(${r.img}) center/cover no-repeat`,
                    height: 220,
                  }}
                />
                <div style={{ padding: 14, display: "grid", gap: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{r.title}</div>
                  <div style={{ color: BRAND.red, fontWeight: 800 }}>
                    {r.price}
                  </div>

                  {/* Airbnb-style actions: Details / Enquire / Watch Tour */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button style={smallCta()} onClick={() => openRoom(r)}>
                      Details
                    </button>
                    <a
                      href={`mailto:info@hillstar.com.ng?subject=Booking Enquiry: ${encodeURIComponent(
                        r.title
                      )}`}
                      style={{ ...smallCta(), textDecoration: "none" }}
                    >
                      Enquire
                    </a>
                    {r.tourSrc ? (
                      <button
                        style={smallCta()}
                        onClick={() => setTourOf(r)}
                        title="Watch video tour"
                      >
                        Watch Tour
                      </button>
                    ) : null}
                  </div>

                  {/* Quick facts */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 6,
                    }}
                  >
                    <Spec label="Bed" value={r.specs?.bed} />
                    <Spec label="Guests" value={r.specs?.guests} />
                    <Spec label="Size" value={r.specs?.size} />
                    <Spec label="Address" value={r.specs?.address} wide />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Details Modal (still includes BookingForm + optional video inside) */}
      {selected && (
        <RoomDetailsModal room={selected} onClose={closeRoom} vw={vw} />
      )}

      {/* Dedicated Video Tour Modal (compact) */}
      {tourOf && <TourModal room={tourOf} onClose={() => setTourOf(null)} />}

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
              Enter the admin PIN to manage rooms.
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

/* ---------------------------- Modals & Admin ---------------------------- */

function RoomDetailsModal({ room, onClose, vw }) {
  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );
  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onKey]);

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
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 92vw)",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.4)",
          maxHeight: "90vh",
          display: "grid",
          gridTemplateRows: "auto 1fr",
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
          <div style={{ fontWeight: 900 }}>{room.title}</div>
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
            overflow: "auto",
          }}
        >
          <div>
            <div
              style={{
                background: `#000 url(${room.img}) center/cover no-repeat`,
                borderRadius: 10,
                height: 260,
              }}
            />
            {/* Optional inline tour still available in details */}
            {room.tourSrc && (
              <div style={{ marginTop: 12 }}>
                <VideoPlayer src={room.tourSrc} label="Room Tour" />
              </div>
            )}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ color: BRAND.red, fontWeight: 900, fontSize: 18 }}>
              {room.price}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <Spec label="Bed" value={room.specs?.bed} />
              <Spec label="Guests" value={room.specs?.guests} />
              <Spec label="Size" value={room.specs?.size} />
              <Spec label="Address" value={room.specs?.address} wide />
            </div>
            {room.amenities?.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  Amenities
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {room.amenities.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {room.description && (
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  Description
                </div>
                <p style={{ margin: 0 }}>{room.description}</p>
              </div>
            )}
            <div>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>
                Book this room
              </div>
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TourModal({ room, onClose }) {
  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onKey]);

  if (!room?.tourSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        display: "grid",
        placeItems: "center",
        zIndex: 3200,
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 92vw)", // narrower than before
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
          maxHeight: "85vh",
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ fontWeight: 900, marginRight: 8 }}>
            {room.title} — Tour
          </div>
          <button
            onClick={onClose}
            aria-label="Close tour"
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
            padding: 10,
            display: "grid",
            alignItems: "center",
            justifyItems: "center",
            overflow: "auto",
          }}
        >
          <video
            controls
            playsInline
            preload="metadata"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "70vh",
              objectFit: "contain",
              background: "#000",
              borderRadius: 10,
            }}
          >
            <source src={room.tourSrc} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}

function HospitalityAdmin({ onAdded }) {
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState({ img: false, tour: false, pdf: false });
  const [err, setErr] = useState("");
  const [state, setState] = useState({
    title: "",
    price: "",
    img: "",
    tourSrc: "",
    brochure: "",
    specs: { bed: "", guests: "", size: "", address: "" },
    amenities: "",
    description: "",
  });

  const input = {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 10,
    width: "100%",
  };
  const label = { fontWeight: 800, fontSize: 13 };
  const set = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const setSpec = (k, v) =>
    setState((s) => ({ ...s, specs: { ...s.specs, [k]: v } }));

  async function up(which, files) {
    if (!files?.length) return;
    setErr("");
    setBusy((b) => ({ ...b, [which]: true }));
    try {
      const url = await cldUpload(files[0]);
      if (which === "img") set("img", url);
      if (which === "tour") set("tourSrc", url);
      if (which === "pdf") set("brochure", url);
    } catch (e) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy((b) => ({ ...b, [which]: false }));
    }
  }

  function submit(e) {
    e.preventDefault();
    setErr("");
    if (!state.title.trim()) return setErr("Title is required");
    if (!state.price.trim()) return setErr("Price is required");
    if (!state.img) return setErr("Image is required");
    const room = {
      title: state.title.trim(),
      price: state.price.trim(),
      img: state.img,
      tourSrc: state.tourSrc || "",
      brochure: state.brochure || "",
      specs: {
        bed: state.specs.bed || "",
        guests: Number(state.specs.guests) || state.specs.guests || "",
        size: state.specs.size || "",
        address: state.specs.address || "",
      },
      amenities: (state.amenities || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: (state.description || "").trim(),
    };
    onAdded?.(room);
    setState({
      title: "",
      price: "",
      img: "",
      tourSrc: "",
      brochure: "",
      specs: { bed: "", guests: "", size: "", address: "" },
      amenities: "",
      description: "",
    });
  }

  const uploadBtn = (b) => ({
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: b ? "#f3f4f6" : "#fff",
    fontWeight: 800,
    cursor: b ? "not-allowed" : "pointer",
  });

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
        <strong>Admin — Add Room</strong>
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
            <div style={label}>Title</div>
            <input
              style={input}
              value={state.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Deluxe Studio, Ikoyi"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <div style={label}>Price</div>
              <input
                style={input}
                value={state.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="₦…"
              />
            </div>
            <div>
              <div style={label}>Image</div>
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
                  value={state.img}
                  onChange={(e) => set("img", e.target.value)}
                  placeholder="https://res.cloudinary.com/.../image.jpg"
                />
                <label style={uploadBtn(busy.img)}>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => up("img", e.target.files)}
                  />
                  {busy.img ? "Uploading…" : "Upload"}
                </label>
              </div>
            </div>
          </div>

          <div>
            <div style={label}>Virtual Tour (video)</div>
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
                value={state.tourSrc}
                onChange={(e) => set("tourSrc", e.target.value)}
                placeholder="https://res.cloudinary.com/.../tour.mp4"
              />
              <label style={uploadBtn(busy.tour)}>
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => up("tour", e.target.files)}
                />
                {busy.tour ? "Uploading…" : "Upload"}
              </label>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            <div>
              <div style={label}>Bed</div>
              <input
                style={input}
                value={state.specs.bed}
                onChange={(e) => setSpec("bed", e.target.value)}
              />
            </div>
            <div>
              <div style={label}>Guests</div>
              <input
                style={input}
                value={state.specs.guests}
                onChange={(e) => setSpec("guests", e.target.value)}
              />
            </div>
            <div>
              <div style={label}>Size</div>
              <input
                style={input}
                value={state.specs.size}
                onChange={(e) => setSpec("size", e.target.value)}
                placeholder="e.g. 28 m²"
              />
            </div>
            <div>
              <div style={label}>Address</div>
              <input
                style={input}
                value={state.specs.address}
                onChange={(e) => setSpec("address", e.target.value)}
              />
            </div>
          </div>

          <div>
            <div style={label}>Amenities (comma separated)</div>
            <input
              style={input}
              value={state.amenities}
              onChange={(e) => set("amenities", e.target.value)}
              placeholder="Wi-Fi, Gym, AC"
            />
          </div>
          <div>
            <div style={label}>Description</div>
            <textarea
              style={{ ...input, minHeight: 100 }}
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the room…"
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
              Save Room (Publish)
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
