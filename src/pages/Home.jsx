import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { Link, useNavigate } from "react-router-dom";

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
        d="M11 2h2v4h-2V2Zm7.778 2.222l1.414 1.414l-2.828 2.828l-1.414-1.414l2.828-2.828ZM2.808 3.636l1.414-1.414l2.828 2.828L5.636 6.464L2.808 3.636ZM12 8a2 2 0 1 1 0 4a2 2 0 0 1 0-4Zm-2 6h4l3 8h-2l-1-3h-2l-1 3H7l3-8Zm2.5 3-.5-1.333L11.5 17h1Z"
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
  Play: ({ size = 22, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20Zm-2.5-6.5v-7l7 3.5l-7 3.5Z"
      />
    </svg>
  ),
  ChevronLeft: ({ size = 22, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
      />
    </svg>
  ),
  ChevronRight: ({ size = 22, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="currentColor"
        d="m8.59 16.59 1.41 1.41 6-6-6-6-1.41 1.41L13.17 12z"
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
  Play: Svg.Play,
  ChevronLeft: Svg.ChevronLeft,
  ChevronRight: Svg.ChevronRight,
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

/* ===================================================================== */

export default function Home() {
  const vw = useViewport();
  const isPhone = vw < 480;
  const scrollY = useScrollY();
  const nav = useNavigate();

  /* ------------------------------ Video modal state ------------------------------ */
  const playlist = useMemo(
    () => [
      { src: "/tours/ikoyi.mp4", label: "Modern House — Ikoyi" },
      { src: "/tours/paragon.mp4", label: "Paragon Walkthrough" },
      { src: "/tours/lekki.mp4", label: "Lekki Residence Tour" },
    ],
    []
  );
  const [videoOpen, setVideoOpen] = useState(false);
  const [vidIdx, setVidIdx] = useState(0);

  const openVideoAt = (i = 0) => {
    setVidIdx(i);
    setVideoOpen(true);
  };

  /* ------------------------------ TopBar ------------------------------- */
  const TopBar = () => (
    <div
      style={{
        background: BRAND.darkGray,
        color: BRAND.white,
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
              style={{ color: BRAND.white }}
            >
              <IC size={18} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  /* ------------------------------ Navbar ------------------------------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const Navbar = () => {
    const isMobile = vw <= 900;
    const bg = scrollY > 8 ? BRAND.black : `rgba(11,11,11,0.85)`;
    const shadow = scrollY > 8 ? "0 6px 20px rgba(0,0,0,.25)" : "none";
    const MenuLink = ({ to, children }) => (
      <Link
        to={to}
        style={{ color: BRAND.white, textDecoration: "none", fontWeight: 600 }}
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

  /* ------------------------------ Hero --------------------------------- */
  const [heroIdx, setHeroIdx] = useState(0);
  const heroSlides = useMemo(
    () => [
      {
        title: "Modern House Make Better Life",
        subtitle:
          "From concept to completion, we deliver high-quality residential and commercial construction tailored to your needs.",
        img: "/assets/about_red.jpg",
      },
      {
        title: "Let Your Home Be Unique & Stylist",
        subtitle:
          "From concept to completion, we deliver high-quality residential and commercial construction tailored to your needs.",
        img: "/assets/villa.png",
      },
      {
        title: "Modern House Make Better Life",
        subtitle:
          "From concept to completion, we deliver high-quality residential and commercial construction tailored to your needs.",
        img: "/assets/hero3.png",
      },
    ],
    []
  );

  useEffect(() => {
    const id = setInterval(
      () => setHeroIdx((i) => (i + 1) % heroSlides.length),
      5000
    );
    return () => clearInterval(id);
  }, [heroSlides.length]);

  const Hero = () => {
    const slide = heroSlides[heroIdx];
    return (
      <div
        style={{
          position: "relative",
          height: "min(80vh, 720px)",
          minHeight: 420,
          background: `url(${slide.img}) center/cover no-repeat`,
          color: "#fff",
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
        <div style={{ position: "relative", maxWidth: 800, padding: "0 16px" }}>
          <h1 style={{ fontSize: "clamp(24px, 6vw, 48px)", fontWeight: 900 }}>
            {slide.title}
          </h1>
          <p style={{ marginTop: 10, fontSize: "clamp(14px, 2.6vw, 18px)" }}>
            {slide.subtitle}
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 20,
              flexWrap: "wrap",
              flexDirection: isPhone ? "column" : "row",
            }}
          >
            <button
              onClick={() => nav("/real-estate")}
              style={{
                padding: "12px 24px",
                background: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
                cursor: "pointer",
                width: isPhone ? "100%" : "auto",
              }}
            >
              Buy Properties
            </button>
            <button
              onClick={() => nav("/real-estate?t=rent")}
              style={{
                padding: "12px 24px",
                background: BRAND.red,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
                cursor: "pointer",
                width: isPhone ? "100%" : "auto",
              }}
            >
              Rent Properties
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ------------------------------ Services ----------------------------- */
  const ServicesGrid = () => (
    <div
      style={{
        padding: "60px 0",
        background: "#fff",
        color: "#111",
        textAlign: "center",
      }}
    >
      <img
        src="/assets/hillstar-logo.png"
        alt="logo"
        style={{ height: 40, marginBottom: 20 }}
      />
      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20 }}>
        Discover Our Sections & Locations
      </h2>
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {[
          { title: "Real Estate", Icon: Icon.Building, to: "/real-estate" },
          { title: "Hospitality", Icon: Icon.Heart, to: "/hospitality" },
          { title: "Renewable Energy", Icon: Icon.Solar, to: "/renewable" },
          { title: "Procurement Services", Icon: Icon.Box, to: "/procurement" },
          { title: "Telecom & Technology", Icon: Icon.Tower, to: "/telecom" },
        ].map((s) => (
          <Link
            key={s.title}
            to={s.to}
            style={{
              background: "#F5F5F5",
              padding: 30,
              borderRadius: 12,
              border: "1px solid #e9e9e9",
              display: "block",
              color: "inherit",
              textDecoration: "none",
              minHeight: 140,
            }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                marginBottom: 10,
              }}
            >
              <s.Icon size={40} style={{ color: BRAND.red }} />
            </div>
            <div style={{ fontWeight: 700 }}>{s.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );

  /* --------------------------- Featured + Video ------------------------ */
  const FeaturedProperties = () => (
    <div
      style={{
        padding: "60px 0",
        background: "#fff",
        color: "#111",
        textAlign: "center",
      }}
    >
      <h3 style={{ color: BRAND.red, fontWeight: 800 }}>OUR PROPERTIES</h3>
      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20 }}>
        Featured Properties
      </h2>
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {[
          "/assets/buy_vi.jpg",
          "/assets/rent_ikoyi.jpg",
          "/assets/rent_lekki.jpg",
          "/assets/buy_lekki.jpg",
        ].map((p, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              borderRadius: 10,
              overflow: "hidden",
              background: "#eee",
            }}
          >
            <img
              src={p}
              alt="property"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                aspectRatio: "4 / 3",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const VideoSection = () => (
    <div
      style={{
        position: "relative",
        background: "url(/hero_bg.jpg) center/cover no-repeat",
        minHeight: "clamp(320px, 40vh, 520px)",
        color: "#fff",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }}
      />
      <div style={{ position: "relative", maxWidth: 800, padding: "0 16px" }}>
        <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900 }}>
          Modern House Video
        </h2>
        <p style={{ fontSize: "clamp(14px, 2.4vw, 16px)" }}>
          Hillstar is uniquely positioned to deliver high-impact solutions
          tailored to the nation’s dynamic infrastructure needs
        </p>
        <button
          aria-label="Play"
          onClick={() => openVideoAt(0)}
          style={{
            margin: "20px auto 0",
            background: BRAND.red,
            border: "none",
            borderRadius: "50%",
            width: 64,
            height: 64,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <Icon.Play />
        </button>
      </div>
    </div>
  );

  /* ------------------------------ Video Modal ------------------------------ */
  const VideoModal = ({ open, onClose, vids, idx, setIdx }) => {
    const prev = useCallback(
      () => setIdx((i) => (i - 1 + vids.length) % vids.length),
      [setIdx, vids.length]
    );
    const next = useCallback(
      () => setIdx((i) => (i + 1) % vids.length),
      [setIdx, vids.length]
    );

    useEffect(() => {
      if (!open) return;
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }, [open, onClose, prev, next]);

    if (!open) return null;

    return (
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.75)",
          zIndex: 3000,
          display: "grid",
          placeItems: "center",
          padding: 12,
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(1000px,96vw)",
            borderRadius: 12,
            background: "#111",
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              background: "#1a1a1a",
              color: "#fff",
              borderBottom: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              {vids[idx]?.label || "Video Tour"}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          {/* Player (responsive 16:9) */}
          <div
            style={{ position: "relative", width: "100%", background: "#000" }}
          >
            <div style={{ paddingTop: "56.25%" }} />
            <StableVideo
              id={"home-modal"}
              src={vids[idx]?.src}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#000",
                display: "block",
              }}
            />

            {/* Prev / Next */}
            <button
              onClick={prev}
              aria-label="Previous video"
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,.5)",
                border: "none",
                color: "#fff",
                borderRadius: 999,
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <Icon.ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next video"
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,.5)",
                border: "none",
                color: "#fff",
                borderRadius: 999,
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <Icon.ChevronRight />
            </button>
          </div>

          {/* Thumbnails / Switcher */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 10,
              background: "#151515",
              overflowX: "auto",
            }}
          >
            {vids.map((v, i) => (
              <button
                key={v.src + i}
                onClick={() => setIdx(i)}
                style={{
                  flex: "0 0 auto",
                  border:
                    i === idx
                      ? `2px solid ${BRAND.red}`
                      : "2px solid rgba(255,255,255,.12)",
                  borderRadius: 8,
                  background: "#000",
                  color: "#fff",
                  padding: 0,
                  cursor: "pointer",
                }}
                title={v.label || `Video ${i + 1}`}
              >
                <div
                  style={{
                    width: 140,
                    height: 78,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    padding: 6,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 6px",
                      background:
                        i === idx ? BRAND.red : "rgba(255,255,255,.12)",
                      borderRadius: 6,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      maxWidth: 132,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {v.label || `Video ${i + 1}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AboutUs = () => (
    <div
      style={{
        padding: "60px 0",
        background: "#fff",
        color: "#111",
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: vw > 900 ? "1fr 1fr" : "1fr",
        gap: 30,
      }}
    >
      <img
        src="/assets/villa.png"
        alt="about"
        style={{ width: "100%", borderRadius: 10, display: "block" }}
      />
      <div>
        <h4 style={{ color: BRAND.red, fontWeight: 800 }}>ABOUT US</h4>
        <h2 style={{ fontSize: "clamp(22px, 3.6vw, 28px)", fontWeight: 900 }}>
          Building Nigeria’s Future, One Landmark at a Time
        </h2>
        <p style={{ fontSize: "clamp(14px, 2.5vw, 16px)" }}>
          Established in 1992, Hillstar Nigeria Limited is a pioneering
          indigenous infrastructure company delivering comprehensive
          construction, engineering, and consultancy solutions to both public
          and private sectors across Nigeria.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <TopBar />
      <Navbar />
      <Hero />
      <ServicesGrid />
      <FeaturedProperties />
      <VideoSection />
      <AboutUs />

      {/* Video modal */}
      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        vids={playlist}
        idx={vidIdx}
        setIdx={setVidIdx}
      />
    </>
  );
}

/* ------------------------ StableVideo (no auto reload) ------------------------
   - The <video> element is reused; we don't force a remount with a key.
   - We only change .src when it actually changes.
   - CurrentTime is persisted per-source and restored, so closing/reopening
     (or switching away and back) resumes seamlessly.
   - Mobile friendly: playsInline + webkit-playsinline. */
function StableVideo({ id, src, style }) {
  const ref = useRef(null);
  const lastSrcRef = useRef("");

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const saveKey = `${id || "vid"}:${src}`;
    const save = () => {
      try {
        sessionStorage.setItem(saveKey, String(v.currentTime || 0));
      } catch {}
    };
    const restore = () => {
      try {
        const s = sessionStorage.getItem(saveKey);
        const t = s ? parseFloat(s) : NaN;
        if (!Number.isNaN(t)) v.currentTime = t;
      } catch {}
    };

    // Update src only if it changed to avoid reloads during re-renders
    if (src && lastSrcRef.current !== src) {
      // Save previous video's time before switching
      if (lastSrcRef.current) {
        try {
          const prevKey = `${id || "vid"}:${lastSrcRef.current}`;
          sessionStorage.setItem(prevKey, String(v.currentTime || 0));
        } catch {}
      }
      v.src = src;
      lastSrcRef.current = src;
    }

    v.addEventListener("loadedmetadata", restore);
    v.addEventListener("timeupdate", save);
    v.addEventListener("pause", save);
    window.addEventListener("pagehide", save);

    return () => {
      v.removeEventListener("loadedmetadata", restore);
      v.removeEventListener("timeupdate", save);
      v.removeEventListener("pause", save);
      window.removeEventListener("pagehide", save);
    };
  }, [id, src]);

  return (
    <video
      ref={ref}
      controls
      playsInline
      // @ts-ignore for old iOS
      webkit-playsinline="true"
      preload="metadata"
      style={style}
    />
  );
}
