// src/pages/RealEstate.jsx
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
  smallCta,
  tabBtn,
  getEnv,
} from "../shared/Shared";

/* -------------------- Cloudinary env (Vite/CRA-safe) -------------------- */
const CLOUD_NAME = getEnv(
  "VITE_CLOUDINARY_CLOUD_NAME",
  "REACT_APP_CLOUDINARY_CLOUD_NAME"
);
const CLOUD_PRESET = getEnv(
  "VITE_CLOUDINARY_UNSIGNED_PRESET",
  "REACT_APP_CLOUDINARY_UNSIGNED_PRESET"
);
const CLD_FOLDER = "hillstar/real-estate";
const MANIFEST_ID = `${CLD_FOLDER}/manifest.json`;

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

/* ---------------------------- Admin (Projects-style) ---------------------------- */
const ADMIN_PIN =
  getEnv("VITE_HILLSTAR_ADMIN_PIN") ||
  getEnv("REACT_APP_HILLSTAR_ADMIN_PIN") ||
  "0809130732800";
const LS_ADMIN_ON_KEY = "hillstar.realestate.adminOn";

export default function RealEstate() {
  const ns = "realestate";
  const vw = useViewport();
  const scrollY = useScrollY();
  const nav = useNavigate();
  const [search, setSearch] = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);

  // Trigger PIN modal with ?admin1 or when ?admin=1 but LS not set
  const hasAdminPrompt =
    search.has("admin1") ||
    (search.get("admin") === "1" && !localStorage.getItem(LS_ADMIN_ON_KEY));

  const [adminOn, setAdminOn] = useState(
    () => localStorage.getItem(LS_ADMIN_ON_KEY) === "1"
  );
  const [showPin, setShowPin] = useState(hasAdminPrompt);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");

  const completeAdminLogin = () => {
    setAdminOn(true);
    try {
      localStorage.setItem(LS_ADMIN_ON_KEY, "1");
    } catch {}
    const next = new URLSearchParams(search);
    next.delete("admin1");
    next.set("admin", "1");
    setSearch(next, { replace: true });
    setShowPin(false);
    setPin("");
  };
  const cancelAdminPrompt = () => {
    setShowPin(false);
    const next = new URLSearchParams(search);
    next.delete("admin1");
    setSearch(next, { replace: true });
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
    const next = new URLSearchParams(search);
    next.delete("admin");
    setSearch(next, { replace: true });
  };

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

  /* ---------------------------- Data + Tabs ---------------------------- */
  const tab = search.get("t") === "rent" ? "rent" : "buy";
  const setTab = (t) =>
    setSearch((p) => {
      p.set("t", t);
      p.delete("d");
      return p;
    });

  const baseListings = useMemo(
    () => ({
      buy: [
        {
          title: "5-Bed Duplex, Ikoyi",
          price: "₦350m",
          img: "/assets/villa.png",
          tourSrc: "/tours/ikoyi.mp4",
          brochure: "/brochures/ikoyi.pdf",
          specs: {
            beds: 5,
            baths: 5,
            parking: 3,
            area: "420 m²",
            address: "Ikate, Lekki, Lagos",
          },
          features: [
            "All-ensuite rooms",
            "Fitted kitchen",
            "BQ",
            "24/7 power",
            "Secure estate",
          ],
          description:
            "A contemporary 5-bed duplex in a gated Ikate community with premium finishes and proximity to major attractions.",
        },
        {
          title: "3-Bed Terrace, Lekki",
          price: "₦180m",
          img: "/assets/rent_lekki.jpg",
          tourSrc: "/tours/lekki.mp4",
          brochure: "/brochures/lekki.pdf",
          specs: {
            beds: 3,
            baths: 3,
            parking: 2,
            area: "260 m²",
            address: "Lekki Phase 1, Lagos",
          },
          features: [
            "Smart home",
            "Walk-in closet",
            "Rooftop sit-out",
            "Secure estate",
          ],
          description:
            "Tasteful 3-bed terrace with smart controls and ample parking in the heart of Lekki.",
        },
      ],
      rent: [
        {
          title: "2-Bed Apartment, Lekki",
          price: "₦7m/yr",
          img: "/assets/buy_lekki.jpg",
          tourSrc: "/tours/lekki-2bed.mp4",
          brochure: "/brochures/lekki.pdf",
          specs: {
            beds: 2,
            baths: 2,
            parking: 1,
            area: "120 m²",
            address: "Lekki Phase 1, Lagos",
          },
          features: ["Furnished", "CCTV", "Swimming pool access"],
          description:
            "Bright 2-bed apartment with modern furnishing and facilities.",
        },
        {
          title: "Studio, Oniru",
          price: "₦3.5m/yr",
          img: "/assets/hero3.png",
          tourSrc: "/tours/oniru-studio.mp4",
          brochure: "/brochures/paragon.pdf",
          specs: {
            beds: 1,
            baths: 1,
            parking: 1,
            area: "55 m²",
            address: "Oniru, VI Annex, Lagos",
          },
          features: ["Close to Landmark", "Gym access", "24/7 security"],
          description:
            "Compact studio in a prime Oniru location—ideal for professionals.",
        },
      ],
    }),
    []
  );

  const [manifest, setManifest] = useState({ buy: [], rent: [] });
  const [manifestErr, setManifestErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchManifest();
      if (!mounted) return;
      if (data && (Array.isArray(data.buy) || Array.isArray(data.rent))) {
        setManifest({
          buy: Array.isArray(data.buy) ? data.buy : [],
          rent: Array.isArray(data.rent) ? data.rent : [],
        });
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const listings = useMemo(
    () => ({
      buy: [...manifest.buy, ...baseListings.buy],
      rent: [...manifest.rent, ...baseListings.rent],
    }),
    [manifest, baseListings]
  );

  const allListings = [...listings.buy, ...listings.rent];
  const selected = search.get("d")
    ? allListings.find((l) => slugify(l.title) === search.get("d"))
    : null;

  const openDetails = (l) =>
    setSearch((p) => {
      p.set("t", tab);
      p.set("d", slugify(l.title));
      return p;
    });
  const closeDetails = () =>
    setSearch((p) => {
      p.set("t", tab);
      p.delete("d");
      return p;
    });

  // Dedicated Video Tour modal state (Airbnb-style)
  const [tourOf, setTourOf] = useState(null);

  return (
    <>
      <TopBar />
      <Navbar />

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

      <HeroStrip title="Real Estate" />
      <Section
        title="Find Your Home"
        subtitle="Open a listing to see full details or watch the video tour."
        extraRight={
          adminOn ? (
            <span style={{ fontSize: 12, fontWeight: 800, color: BRAND.red }}>
              Admin mode (Cloudinary enabled)
            </span>
          ) : null
        }
      >
        {adminOn && (
          <RealEstateAdmin
            onAdded={async (payload) => {
              const next = {
                buy:
                  payload.kind === "buy"
                    ? [payload, ...manifest.buy]
                    : manifest.buy,
                rent:
                  payload.kind === "rent"
                    ? [payload, ...manifest.rent]
                    : manifest.rent,
              };
              setManifest(next);
              try {
                await publishManifest(next);
              } catch (e) {
                setManifestErr(e?.message || "Failed to publish");
              }
            }}
          />
        )}
        {manifestErr && (
          <div style={{ marginTop: 8, color: "#b91c1c", fontWeight: 700 }}>
            {manifestErr}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setTab("buy")} style={tabBtn(tab === "buy")}>
            Buy Properties
          </button>
          <button onClick={() => setTab("rent")} style={tabBtn(tab === "rent")}>
            Rent Properties
          </button>
        </div>

        {loading ? (
          <div style={{ opacity: 0.8, marginTop: 8 }}>Loading listings…</div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: vw > 1000 ? "repeat(2,1fr)" : "1fr",
              marginTop: 16,
            }}
          >
            {listings[tab].map((l, i) => (
              <div
                key={`${slugify(l.title)}-${i}`}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    background: `#000 url(${l.img}) center/cover no-repeat`,
                    height: 220,
                  }}
                />
                <div style={{ padding: 14, display: "grid", gap: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{l.title}</div>
                  <div style={{ color: BRAND.red, fontWeight: 800 }}>
                    {l.price}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button style={smallCta()} onClick={() => openDetails(l)}>
                      Details
                    </button>
                    <a
                      href={`mailto:info@hillstar.com.ng?subject=Enquiry: ${encodeURIComponent(
                        l.title
                      )}`}
                      style={{ ...smallCta(), textDecoration: "none" }}
                    >
                      Enquire
                    </a>
                    {l.brochure && (
                      <a
                        href={l.brochure}
                        download
                        style={{ ...smallCta(), textDecoration: "none" }}
                      >
                        Download Brochure
                      </a>
                    )}
                    {l.tourSrc ? (
                      <button
                        style={smallCta()}
                        onClick={() => setTourOf(l)}
                        title="Watch video tour"
                      >
                        Watch Tour
                      </button>
                    ) : null}
                  </div>
                  {/* No inline VideoPlayer on cards (Airbnb-style) */}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {selected && (
        <DetailsModal listing={selected} onClose={closeDetails} vw={vw} />
      )}

      {/* Dedicated Video Tour Modal */}
      {tourOf && <TourModal listing={tourOf} onClose={() => setTourOf(null)} />}

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
              Enter the admin PIN to manage real estate listings.
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

/* A tiny wrapper to keep videos perfectly responsive (16:9) */
function ResponsiveVideo({ src, label }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        background: "#000",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Fill the aspect-ratio box */}
      <div style={{ position: "absolute", inset: 0 }}>
        <VideoPlayer src={src} label={label} />
      </div>
    </div>
  );
}

/* ----------------------------- Details Modal --------------------------- */
function DetailsModal({ listing, onClose, vw }) {
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
    >
      <div
        style={{
          width: "min(900px, 96vw)",
          maxHeight: "94vh",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.4)",
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
          <div style={{ fontWeight: 900 }}>{listing.title}</div>
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
            overflow: "auto",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: vw > 900 ? "1.3fr 1fr" : "1fr",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  background: `#000 url(${listing.img}) center/cover no-repeat`,
                  borderRadius: 10,
                  height: 260,
                }}
              />
              <div style={{ marginTop: 12 }}>
                {listing.tourSrc && (
                  <ResponsiveVideo src={listing.tourSrc} label="Virtual Tour" />
                )}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ color: BRAND.red, fontWeight: 900, fontSize: 18 }}>
                {listing.price}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <Spec label="Bedrooms" value={listing.specs?.beds} />
                <Spec label="Bathrooms" value={listing.specs?.baths} />
                <Spec label="Parking" value={listing.specs?.parking} />
                <Spec label="Area" value={listing.specs?.area} />
                <Spec label="Address" value={listing.specs?.address} wide />
              </div>
              {listing.features?.length > 0 && (
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>
                    Features
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {listing.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {listing.description && (
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>
                    Description
                  </div>
                  <p style={{ margin: 0 }}>{listing.description}</p>
                </div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {listing.brochure && (
                  <a
                    href={listing.brochure}
                    download
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: "#eee",
                      border: "none",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Download Brochure
                  </a>
                )}
                <a
                  href={`mailto:info@hillstar.com.ng?subject=Enquiry: ${encodeURIComponent(
                    listing.title
                  )}`}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: BRAND.red,
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Enquire via Email
                </a>
                <a
                  href="tel:+2349166876907"
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#eee",
                    border: "none",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Video Tour Modal ------------------------------ */
function TourModal({ listing, onClose }) {
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

  if (!listing?.tourSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        display: "grid",
        placeItems: "center",
        zIndex: 3200,
      }}
    >
      <div
        style={{
          width: "min(900px, 96vw)",
          maxHeight: "94vh",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ fontWeight: 900 }}>{listing.title} — Tour</div>
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
        <div style={{ padding: 12, overflow: "auto" }}>
          <ResponsiveVideo src={listing.tourSrc} label="Video Tour" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Admin UI ------------------------------ */
function RealEstateAdmin({ onAdded }) {
  const [open, setOpen] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState({ img: false, tour: false, pdf: false });
  const [state, setState] = useState({
    kind: "buy",
    title: "",
    price: "",
    img: "",
    tourSrc: "",
    brochure: "",
    specs: { beds: "", baths: "", parking: "", area: "", address: "" },
    features: "",
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
    if (!state.img) return setErr("Cover image is required");
    const payload = {
      kind: state.kind,
      title: state.title.trim(),
      price: state.price.trim(),
      img: state.img,
      tourSrc: state.tourSrc || "",
      brochure: state.brochure || "",
      specs: {
        beds: state.specs.beds || "",
        baths: state.specs.baths || "",
        parking: state.specs.parking || "",
        area: state.specs.area || "",
        address: state.specs.address || "",
      },
      features: (state.features || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: (state.description || "").trim(),
    };
    onAdded?.(payload);
    setState({
      kind: "buy",
      title: "",
      price: "",
      img: "",
      tourSrc: "",
      brochure: "",
      specs: { beds: "", baths: "", parking: "", area: "", address: "" },
      features: "",
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
        <strong>Admin — Add Listing</strong>
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

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <div style={label}>Kind</div>
              <select
                style={input}
                value={state.kind}
                onChange={(e) => set("kind", e.target.value)}
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div>
              <div style={label}>Price</div>
              <input
                style={input}
                value={state.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="₦…"
              />
            </div>
          </div>

          <div>
            <div style={label}>Title</div>
            <input
              style={input}
              value={state.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. 4-Bed Terrace, Ikoyi"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <div style={label}>Cover Image</div>
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
          </div>

          <div>
            <div style={label}>Brochure (PDF)</div>
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
                value={state.brochure}
                onChange={(e) => set("brochure", e.target.value)}
                placeholder="https://res.cloudinary.com/.../brochure.pdf"
              />
              <label style={uploadBtn(busy.pdf)}>
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => up("pdf", e.target.files)}
                />
                {busy.pdf ? "Uploading…" : "Upload"}
              </label>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 10,
            }}
          >
            <div>
              <div style={label}>Beds</div>
              <input
                style={input}
                value={state.specs.beds}
                onChange={(e) => setSpec("beds", e.target.value)}
              />
            </div>
            <div>
              <div style={label}>Baths</div>
              <input
                style={input}
                value={state.specs.baths}
                onChange={(e) => setSpec("baths", e.target.value)}
              />
            </div>
            <div>
              <div style={label}>Parking</div>
              <input
                style={input}
                value={state.specs.parking}
                onChange={(e) => setSpec("parking", e.target.value)}
              />
            </div>
            <div>
              <div style={label}>Area</div>
              <input
                style={input}
                value={state.specs.area}
                onChange={(e) => setSpec("area", e.target.value)}
                placeholder="e.g. 260 m²"
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
            <div style={label}>Features (comma separated)</div>
            <input
              style={input}
              value={state.features}
              onChange={(e) => set("features", e.target.value)}
              placeholder="Smart home, Rooftop, CCTV"
            />
          </div>

          <div>
            <div style={label}>Description</div>
            <textarea
              style={{ ...input, minHeight: 100 }}
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the listing…"
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
              Save Listing (Publish)
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
