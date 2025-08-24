// import React, { useEffect, useMemo, useState, useCallback } from "react";

// /*
//   Hillstar Website Clone — Exact Replica+ (Responsive, Hamburger, Sector Pages)
//   ---------------------------------------------------------------------------
//   • Top info bar (call, location, social icons)
//   • Navbar with logo + links (Home, About, Services, Work, Contact)
//   • Hero carousel with 3 slides
//   • Landing sections: Services Icons (clickable -> sector pages), Featured Properties, Video, About, Footer
//   • Sector pages with content + **video-based** virtual tours (no YouTube placeholders):
//       - Real Estate (Buy / Rent tabs, gallery, per‑item <video> tour, **Details modal that persists via hash param**, **Download Brochure**)
//       - Hospitality (Airbnb‑style cards, **Details modal + full booking form** with multiple rooms, each room has dates/guests)
//       - Renewable Energy / Procurement / Telecom (overview, accomplishments, <video> tours)
//   • Sticky "Talk to Us" FAB that opens social sheet (WhatsApp, Instagram, Twitter/X, LinkedIn, Email, Phone)
//   • All styles inline; no external packages.
// */

// export default function HillstarClone() {
//   /* ------------------------------- THEME ------------------------------- */
//   const BRAND = {
//     red: "#E30613",
//     white: "#FFFFFF",
//     black: "#0B0B0B",
//     gray: "#F5F5F5",
//     darkGray: "#333333",
//   };

//   /* -------------------------- VIEWPORT & SCROLL ------------------------ */
//   function useViewport() {
//     const [w, setW] = useState(
//       typeof window !== "undefined" ? window.innerWidth : 1280
//     );
//     useEffect(() => {
//       const on = () => setW(window.innerWidth);
//       window.addEventListener("resize", on);
//       return () => window.removeEventListener("resize", on);
//     }, []);
//     return w;
//   }
//   function useScrollY() {
//     const [y, setY] = useState(0);
//     useEffect(() => {
//       const on = () => setY(window.scrollY || 0);
//       on();
//       window.addEventListener("scroll", on);
//       return () => window.removeEventListener("scroll", on);
//     }, []);
//     return y;
//   }
//   const vw = useViewport();
//   const scrollY = useScrollY();

//   /* --------------------------- HASH ROUTER FIX -------------------------- */
//   // Parse route + query-like params inside the hash. Example: #real-estate?t=rent&d=ikate-duplex
//   function parseHashParts(raw) {
//     const s = String(raw ?? "");
//     const idx = s.indexOf("#");
//     const after = idx >= 0 ? s.slice(idx + 1) : s;
//     const [routePart, queryPartRaw] = after.split("?");
//     const routeSafe =
//       (routePart || "")
//         .trim()
//         .split(/[?#]/)[0]
//         .replace(/[^a-z0-9-]/gi, "") || "home";
//     const params = {};
//     if (queryPartRaw) {
//       const queryPart = queryPartRaw.split("#")[0];
//       queryPart.split("&").forEach((pair) => {
//         if (!pair) return;
//         const [k, v = ""] = pair.split("=");
//         if (!k) return;
//         params[decodeURIComponent(k)] = decodeURIComponent(v);
//       });
//     }
//     return { route: routeSafe, params };
//   }

//   const slugify = (s) =>
//     String(s || "")
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");

//   // Runtime tests (non-blocking) to ensure routing is robust
//   if (typeof window !== "undefined") {
//     const t = (input, expRoute) => {
//       const { route } = parseHashParts(input);
//       console.assert(
//         route === expRoute,
//         `hash route test failed: ${input} -> ${route}, expected ${expRoute}`
//       );
//     };
//     t("", "home");
//     t("#", "home");
//     t("#real-estate", "real-estate");
//     t("#real-estate?foo=1", "real-estate");
//     t("#telecom#123", "telecom");
//     t("###abc", "abc");
//   }

//   /* ------------------------------- ROUTER ------------------------------ */
//   const useHashRoute = () => {
//     const get = () =>
//       parseHashParts(typeof window !== "undefined" ? window.location.hash : "");
//     const [state, setState] = useState(get);
//     useEffect(() => {
//       const onHash = () => setState(get());
//       window.addEventListener("hashchange", onHash);
//       return () => window.removeEventListener("hashchange", onHash);
//     }, []);
//     const goto = (r, params = {}) => {
//       const hasParams = params && Object.keys(params).length > 0;
//       const qs = hasParams ? `?${new URLSearchParams(params).toString()}` : "";
//       const next = `#${r}${qs}`;
//       if (window.location.hash === next) return; // avoid duplicate hashchange
//       window.location.hash = next;
//     };
//     return { route: state.route, params: state.params, goto };
//   };
//   const { route, params, goto } = useHashRoute();

//   /* ------------------------------- HERO -------------------------------- */
//   const [heroIdx, setHeroIdx] = useState(0);
//   const heroSlides = useMemo(
//     () => [
//       {
//         title: "Modern House Make Better Life",
//         subtitle:
//           "From concept to completion, we deliver high-quality residential and commercial construction tailored to your needs.",
//         img: "/assets/about_red.jpg",
//       },
//       {
//         title: "Let Your Home Be Unique & Stylist",
//         subtitle:
//           "From concept to completion, we deliver high-quality residential and commercial construction tailored to your needs.",
//         img: "/assets/villa.png",
//       },
//       {
//         title: "Modern House Make Better Life",
//         subtitle:
//           "From concept to completion, we deliver high-quality residential and commercial construction tailored to your needs.",
//         img: "/assets/hero3.png",
//       },
//     ],
//     []
//   );
//   useEffect(() => {
//     const id = setInterval(
//       () => setHeroIdx((i) => (i + 1) % heroSlides.length),
//       5000
//     );
//     return () => clearInterval(id);
//   }, [heroSlides.length]);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [sheetOpen, setSheetOpen] = useState(false);

//   /* ------------------------------ ICONS -------------------------------- */
//   const Icon = {
//     X: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M4 4l16 16M20 4L4 20"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//         />
//       </svg>
//     ),
//     Burger: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M3 6h18M3 12h18M3 18h18"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//         />
//       </svg>
//     ),
//     Phone: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.67-1.2a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//     Location: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M12 21s8-6.58 8-12A8 8 0 1 0 4 9c0 5.42 8 12 8 12z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//     Instagram: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <rect
//           x="2"
//           y="2"
//           width="20"
//           height="20"
//           rx="5"
//           ry="5"
//           stroke="currentColor"
//           strokeWidth="2"
//           fill="none"
//         />
//         <circle
//           cx="12"
//           cy="12"
//           r="3.5"
//           stroke="currentColor"
//           strokeWidth="2"
//           fill="none"
//         />
//         <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
//       </svg>
//     ),
//     Twitter: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M22 5.8c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2.1-.7.4-1.6.8-2.4 1a3.8 3.8 0 0 0-6.6 3.5 10.7 10.7 0 0 1-7.8-4 3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5 0 1.8 1.3 3.4 3.1 3.8-.5.1-1 .2-1.5.1.4 1.5 1.9 2.7 3.6 2.8A7.7 7.7 0 0 1 2 18.1a10.9 10.9 0 0 0 5.8 1.7c7 0 10.9-5.9 10.9-11v-.5c.8-.6 1.5-1.3 2.1-2.1z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//     LinkedIn: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M6 8H3v13h3V8zM4.5 3A1.5 1.5 0 1 0 4.5 6 1.5 1.5 0 1 0 4.5 3zM21 21h-3v-6.5c0-2.2-2.6-2-2.6 0V21h-3V8h3v1.7C15.8 8.5 21 8.3 21 13.2V21z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//     WhatsApp: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M20 12a8 8 0 0 1-11.9 6.9L4 21l2.1-4.1A8 8 0 1 1 20 12z"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         />
//         <path
//           d="M8.5 9.5c.3-1 1.6-1.1 1.9-.1.1.4.3.8.5 1.1.2.3.1.8-.2 1.1-.2.2-.4.5-.2.7.6.8 1.4 1.5 2.2 2 .3.2.6 0 .9-.2.4-.2 1-.1 1.3.2.4.4.8.9.7 1.5-.2.8-1.3 1-2 .8-2.6-.8-5.1-3.1-6.2-5.6-.5-1 .2-2.3 1.1-2.6z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//     Building: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M3 21h18M6 21V3h12v18M9 8h3M9 12h3M9 16h3M14 8h3M14 12h3M14 16h3"
//           stroke="currentColor"
//           strokeWidth="2"
//         />
//       </svg>
//     ),
//     Heart: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M12 21s-7-4.5-9-8.5C1.5 9.5 3.5 6 7 6c1.9 0 3 1 5 3 2-2 3.1-3 5-3 3.5 0 5.5 3.5 4 6.5C19 16.5 12 21 12 21z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//     Solar: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M3 14h18M5 10h14M7 6h10M9 18h6"
//           stroke="currentColor"
//           strokeWidth="2"
//         />
//         <rect
//           x="8"
//           y="8"
//           width="8"
//           height="8"
//           stroke="currentColor"
//           strokeWidth="2"
//           fill="none"
//         />
//       </svg>
//     ),
//     Box: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <path
//           d="M3 7l9-4 9 4-9 4-9-4zm0 4l9 4 9-4M3 7v10l9 4 9-4V7"
//           stroke="currentColor"
//           strokeWidth="2"
//           fill="none"
//         />
//       </svg>
//     ),
//     Tower: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <circle cx="12" cy="20" r="1" fill="currentColor" />
//         <path
//           d="M12 20V4m-5 5a5 5 0 0 1 10 0m-7 0a2 2 0 1 1 4 0"
//           stroke="currentColor"
//           strokeWidth="2"
//           fill="none"
//         />
//       </svg>
//     ),
//     Play: (p) => (
//       <svg {...svgProps(p)} viewBox="0 0 24 24">
//         <circle
//           cx="12"
//           cy="12"
//           r="11"
//           stroke="currentColor"
//           strokeWidth="2"
//           fill="none"
//         />
//         <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
//       </svg>
//     ),
//   };
//   function svgProps(p) {
//     const size = p?.size || 24;
//     return {
//       width: size,
//       height: size,
//       style: { display: "block", ...(p?.style || {}) },
//     };
//   }

//   const SOCIALS = [
//     {
//       name: "Instagram",
//       href: "https://instagram.com/hillstar",
//       Icon: Icon.Instagram,
//     },
//     {
//       name: "Twitter",
//       href: "https://twitter.com/hillstar",
//       Icon: Icon.Twitter,
//     },
//     {
//       name: "LinkedIn",
//       href: "https://linkedin.com/company/hillstar",
//       Icon: Icon.LinkedIn,
//     },
//     {
//       name: "WhatsApp",
//       href: "https://wa.me/2349166876907",
//       Icon: Icon.WhatsApp,
//     },
//     {
//       name: "Email",
//       href: "mailto:info@hillstar.com.ng",
//       Icon: Icon.Location,
//       label: "Email",
//     },
//     {
//       name: "Call",
//       href: "tel:+2349166876907",
//       Icon: Icon.Phone,
//       label: "Call",
//     },
//   ];

//   /* ------------------------------- LAYOUT ------------------------------- */
//   const TopBar = () => (
//     <div
//       style={{
//         background: BRAND.darkGray,
//         color: BRAND.white,
//         fontSize: 13,
//         padding: "6px 0",
//       }}
//     >
//       <div
//         style={{
//           width: "min(1200px,92vw)",
//           margin: "0 auto",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 12,
//           flexWrap: "wrap",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             gap: 18,
//             alignItems: "center",
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <Icon.Phone size={16} />
//             <span>
//               <span style={{ color: BRAND.red }}>Free Call</span> +234 916 687
//               6907
//             </span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <Icon.Location size={16} />
//             <span>
//               <span style={{ color: BRAND.red }}>Our Location:</span> 25 Kayode
//               Otitoju, Off Admiralty Way, Lekki, Lagos, Nigeria
//             </span>
//           </div>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <span>Connect with us</span>
//           {SOCIALS.slice(0, 3).map(({ name, href, Icon: IC }) => (
//             <a
//               key={name}
//               href={href}
//               aria-label={name}
//               style={{ color: BRAND.white }}
//             >
//               <IC size={18} />
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const Navbar = () => {
//     const isMobile = vw <= 900;
//     const bg = scrollY > 8 ? BRAND.black : `rgba(11,11,11,0.85)`;
//     const shadow = scrollY > 8 ? "0 6px 20px rgba(0,0,0,.25)" : "none";
//     return (
//       <div
//         style={{
//           background: bg,
//           position: "sticky",
//           top: 0,
//           zIndex: 1000,
//           boxShadow: shadow,
//           backdropFilter: "saturate(180%) blur(8px)",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1200px,92vw)",
//             margin: "0 auto",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             height: 70,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               cursor: "pointer",
//             }}
//             onClick={() => goto("home")}
//           >
//             <img
//               src="/assets/hillstar-logo.png"
//               alt="logo"
//               style={{ height: 40 }}
//             />
//             <span style={{ color: BRAND.red, fontWeight: 900, fontSize: 20 }}>
//               Hillstar
//             </span>
//           </div>
//           <div
//             style={{
//               display: isMobile ? "none" : "flex",
//               gap: 20,
//               color: BRAND.white,
//               alignItems: "center",
//             }}
//           >
//             {[
//               { t: "HOME", r: "home" },
//               { t: "ABOUT", r: "about" },
//               { t: "OUR SERVICES", r: "services" },
//               { t: "OUR WORK", r: "projects" },
//               { t: "CONTACT US", r: "contact" },
//             ].map((l) => (
//               <div
//                 key={l.t}
//                 style={{
//                   cursor: "pointer",
//                   opacity: route === l.r ? 1 : 0.9,
//                   fontWeight: route === l.r ? 900 : 600,
//                 }}
//                 onClick={() => goto(l.r)}
//               >
//                 {l.t}
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => setMenuOpen(true)}
//             aria-label="Open menu"
//             style={{
//               display: isMobile ? "block" : "none",
//               background: "none",
//               border: "none",
//               color: BRAND.white,
//             }}
//           >
//             <Icon.Burger />
//           </button>
//         </div>
//         {menuOpen && (
//           <div
//             role="dialog"
//             aria-modal="true"
//             style={{
//               position: "fixed",
//               inset: 0,
//               background: "rgba(0,0,0,.9)",
//               zIndex: 2000,
//               color: BRAND.white,
//               display: "grid",
//               placeItems: "center",
//             }}
//           >
//             <div style={{ position: "absolute", top: 12, right: 12 }}>
//               <button
//                 onClick={() => setMenuOpen(false)}
//                 aria-label="Close menu"
//                 style={{
//                   background: "none",
//                   border: "none",
//                   color: BRAND.white,
//                 }}
//               >
//                 <Icon.X />
//               </button>
//             </div>
//             <div style={{ textAlign: "center", display: "grid", gap: 20 }}>
//               {[
//                 { t: "HOME", r: "home" },
//                 { t: "ABOUT", r: "about" },
//                 { t: "OUR SERVICES", r: "services" },
//                 { t: "OUR WORK", r: "projects" },
//                 { t: "CONTACT US", r: "contact" },
//               ].map((l) => (
//                 <div
//                   key={l.t}
//                   style={{ fontSize: 24, fontWeight: 700 }}
//                   onClick={() => {
//                     goto(l.r);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   {l.t}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ------------------------------ LANDING ------------------------------- */
//   const Hero = () => {
//     const slide = heroSlides[heroIdx];
//     return (
//       <div
//         style={{
//           position: "relative",
//           height: "80vh",
//           background: `url(${slide.img}) center/cover no-repeat`,
//           color: BRAND.white,
//           display: "grid",
//           placeItems: "center",
//           textAlign: "center",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             background: "rgba(0,0,0,.55)",
//           }}
//         />
//         <div style={{ position: "relative", maxWidth: 800 }}>
//           <h1 style={{ fontSize: 48, fontWeight: 900 }}>{slide.title}</h1>
//           <p style={{ marginTop: 10, fontSize: 18 }}>{slide.subtitle}</p>
//           <div
//             style={{
//               display: "flex",
//               gap: 12,
//               justifyContent: "center",
//               marginTop: 20,
//             }}
//           >
//             <button
//               onClick={() => goto("real-estate")}
//               style={{
//                 padding: "12px 24px",
//                 background: BRAND.white,
//                 border: "none",
//                 borderRadius: 6,
//                 fontWeight: 700,
//                 cursor: "pointer",
//               }}
//             >
//               Buy Properties
//             </button>
//             <button
//               onClick={() => goto("real-estate", { t: "rent" })}
//               style={{
//                 padding: "12px 24px",
//                 background: BRAND.red,
//                 color: BRAND.white,
//                 border: "none",
//                 borderRadius: 6,
//                 fontWeight: 700,
//                 cursor: "pointer",
//               }}
//             >
//               Rent Properties
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const Services = () => (
//     <div
//       style={{
//         padding: "60px 0",
//         background: BRAND.white,
//         color: BRAND.black,
//         textAlign: "center",
//       }}
//     >
//       <img
//         src="/assets/hillstar-logo.png"
//         alt="logo"
//         style={{ height: 40, marginBottom: 20 }}
//       />
//       <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20 }}>
//         Discover Our Sections & Locations
//       </h2>
//       <div
//         style={{
//           display: "grid",
//           gap: 20,
//           gridTemplateColumns:
//             vw > 1100
//               ? "repeat(5,1fr)"
//               : vw > 640
//               ? "repeat(3,1fr)"
//               : "repeat(2,1fr)",
//           maxWidth: 1100,
//           margin: "0 auto",
//         }}
//       >
//         {[
//           { title: "Real Estate", Icon: Icon.Building, r: "real-estate" },
//           { title: "Hospitality", Icon: Icon.Heart, r: "hospitality" },
//           { title: "Renewable Energy", Icon: Icon.Solar, r: "renewable" },
//           { title: "Procurement Services", Icon: Icon.Box, r: "procurement" },
//           { title: "Telecom & Technology", Icon: Icon.Tower, r: "telecom" },
//         ].map((s) => (
//           <div
//             key={s.title}
//             onClick={() => goto(s.r)}
//             style={{
//               background: BRAND.gray,
//               padding: 30,
//               borderRadius: 12,
//               cursor: "pointer",
//               border: "1px solid #e9e9e9",
//             }}
//           >
//             <div
//               style={{
//                 display: "grid",
//                 placeItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <s.Icon size={40} style={{ color: BRAND.red }} />
//             </div>
//             <div style={{ fontWeight: 700 }}>{s.title}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const FeaturedProperties = () => (
//     <div
//       style={{
//         padding: "60px 0",
//         background: BRAND.white,
//         color: BRAND.black,
//         textAlign: "center",
//       }}
//     >
//       <h3 style={{ color: BRAND.red, fontWeight: 800 }}>OUR PROPERTIES</h3>
//       <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20 }}>
//         Featured Properties
//       </h2>
//       <div
//         style={{
//           display: "grid",
//           gap: 20,
//           gridTemplateColumns:
//             vw > 1100
//               ? "repeat(4,1fr)"
//               : vw > 640
//               ? "repeat(3,1fr)"
//               : "repeat(2,1fr)",
//           maxWidth: 1200,
//           margin: "0 auto",
//         }}
//       >
//         {[
//           "/assets/buy_vi.jpg",
//           "/assets/rent_ikoyi.jpg",
//           "/assets/rent_lekki.jpg",
//           "/assets/buy_lekki.jpg",
//         ].map((p, i) => (
//           <img
//             key={i}
//             src={p}
//             alt="property"
//             style={{ width: "100%", borderRadius: 10 }}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   const VideoSection = () => (
//     <div
//       style={{
//         position: "relative",
//         background: "url(/hero_bg.jpg) center/cover no-repeat",
//         height: 420,
//         color: BRAND.white,
//         display: "grid",
//         placeItems: "center",
//       }}
//     >
//       <div
//         style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }}
//       />
//       <div style={{ position: "relative", textAlign: "center" }}>
//         <h2 style={{ fontSize: 28, fontWeight: 900 }}>Modern House Video</h2>
//         <p>
//           Hillstar is uniquely positioned to deliver high-impact solutions
//           tailored to the nation’s dynamic infrastructure needs
//         </p>
//         <button
//           aria-label="Play"
//           style={{
//             marginTop: 20,
//             background: BRAND.red,
//             border: "none",
//             borderRadius: "50%",
//             width: 64,
//             height: 64,
//             color: BRAND.white,
//             display: "grid",
//             placeItems: "center",
//           }}
//         >
//           <Icon.Play />
//         </button>
//       </div>
//     </div>
//   );

//   const AboutUs = () => (
//     <div
//       style={{
//         padding: "60px 0",
//         background: BRAND.white,
//         color: BRAND.black,
//         maxWidth: 1200,
//         margin: "0 auto",
//         display: "grid",
//         gridTemplateColumns: vw > 900 ? "1fr 1fr" : "1fr",
//         gap: 30,
//       }}
//     >
//       <img
//         src="/assets/villa.png"
//         alt="about"
//         style={{ width: "100%", borderRadius: 10 }}
//       />
//       <div>
//         <h4 style={{ color: BRAND.red, fontWeight: 800 }}>ABOUT US</h4>
//         <h2 style={{ fontSize: 28, fontWeight: 900 }}>
//           Building Nigeria’s Future, One Landmark at a Time
//         </h2>
//         <p>
//           Established in 1992, Hillstar Nigeria Limited is a pioneering
//           indigenous infrastructure company delivering comprehensive
//           construction, engineering, and consultancy solutions to both public
//           and private sectors across Nigeria. With over three decades of proven
//           expertise, we are recognized for our unwavering commitment to
//           excellence, innovation, and integrity.
//         </p>
//       </div>
//     </div>
//   );

//   const Footer = () => (
//     <div
//       style={{ background: BRAND.gray, padding: "40px 0", color: BRAND.black }}
//     >
//       <div
//         style={{
//           maxWidth: 1200,
//           margin: "0 auto",
//           display: "grid",
//           gridTemplateColumns: vw > 900 ? "repeat(4,1fr)" : "1fr",
//           gap: 30,
//         }}
//       >
//         <div>
//           <img
//             src="/assets/hillstar-logo.png"
//             alt="logo"
//             style={{ height: 40 }}
//           />
//           <p style={{ marginTop: 10 }}>
//             With deep market Knowledge, Integrity and Passion for Service, we
//             turn property goals to lasting realities.
//           </p>
//           <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
//             {SOCIALS.slice(0, 4).map(({ name, href, Icon: IC }) => (
//               <a
//                 key={name}
//                 href={href}
//                 aria-label={name}
//                 style={{
//                   background: BRAND.red,
//                   color: BRAND.white,
//                   borderRadius: "50%",
//                   width: 32,
//                   height: 32,
//                   display: "grid",
//                   placeItems: "center",
//                 }}
//               >
//                 <IC size={18} />
//               </a>
//             ))}
//           </div>
//         </div>
//         <div>
//           <h4>Offers</h4>
//           <div style={{ cursor: "pointer" }} onClick={() => goto("home")}>
//             Home
//           </div>
//           <div style={{ cursor: "pointer" }} onClick={() => goto("about")}>
//             About
//           </div>
//         </div>
//         <div>
//           <h4>Company</h4>
//           <div style={{ cursor: "pointer" }} onClick={() => goto("services")}>
//             Our Services
//           </div>
//           <div style={{ cursor: "pointer" }} onClick={() => goto("projects")}>
//             Our Work
//           </div>
//         </div>
//         <div>
//           <h4>Quick Links</h4>
//           <div style={{ cursor: "pointer" }} onClick={() => goto("contact")}>
//             Contact Us
//           </div>
//           <div>Terms & Conditions</div>
//           <h4 style={{ marginTop: 20 }}>Have a Questions?</h4>
//           <div>25 Kayode Otitoju, Off Admiralty Way, Lekki, Lagos, Nigeria</div>
//           <div>Tel: +234 916 687 6907</div>
//           <div>info@hillstar.com.ng</div>
//         </div>
//       </div>
//       <div style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
//         Copyright © {new Date().getFullYear()} All rights reserved | Hillstar
//         Nig Ltd
//       </div>
//     </div>
//   );

//   /* ----------------------------- SECTOR PAGES --------------------------- */
//   const Section = ({ title, subtitle, children }) => (
//     <section
//       style={{ padding: "48px 0", background: BRAND.white, color: "#111" }}
//     >
//       <div style={{ width: "min(1200px,92vw)", margin: "0 auto" }}>
//         <h2 style={{ fontSize: 32, fontWeight: 900 }}>{title}</h2>
//         {subtitle && <p style={{ opacity: 0.8, marginTop: 6 }}>{subtitle}</p>}
//         <div style={{ marginTop: 18 }}>{children}</div>
//       </div>
//     </section>
//   );

//   const RealEstate = () => {
//     const initialTab = params.t === "rent" ? "rent" : "buy";
//     const [tab, setTab] = useState(initialTab);
//     useEffect(() => {
//       if (params.t === "rent" || params.t === "buy") setTab(params.t);
//     }, [params.t]);

//     // Attach your real video files and brochures below
//     const listings = {
//       buy: [
//         {
//           title: "5‑Bed Duplex, Ikoyi",
//           price: "₦350m",
//           img: "/assets/villa.png",
//           tourSrc: "/tours/ikoyi.mp4",
//           brochure: "/brochures/ikoyi.pdf",
//           specs: {
//             beds: 5,
//             baths: 5,
//             parking: 3,
//             area: "420 m²",
//             address: "Ikate, Lekki, Lagos",
//           },
//           features: [
//             "All‑ensuite rooms",
//             "Fitted kitchen",
//             "BQ",
//             "24/7 power",
//             "Secure estate",
//           ],
//           description:
//             "A contemporary 5‑bed duplex in a gated Ikate community with premium finishes and proximity to major attractions.",
//         },
//         {
//           title: "3‑Bed Terrace, Lekki",
//           price: "₦180m",
//           img: "/assets/rent_lekki.jpg",
//           tourSrc: "/tours/lekki.mp4",
//           brochure: "/brochures/lekki.pdf",
//           specs: {
//             beds: 3,
//             baths: 3,
//             parking: 2,
//             area: "260 m²",
//             address: "Lekki Phase 1, Lagos",
//           },
//           features: [
//             "Smart home",
//             "Walk‑in closet",
//             "Rooftop sit‑out",
//             "Secure estate",
//           ],
//           description:
//             "Tasteful 3‑bed terrace with smart controls and ample parking in the heart of Lekki.",
//         },
//       ],
//       rent: [
//         {
//           title: "2‑Bed Apartment, Lekki",
//           price: "₦7m/yr",
//           img: "/assets/buy_lekki.jpg",
//           tourSrc: "/tours/lekki-2bed.mp4",
//           brochure: "/brochures/lekki.pdf",
//           specs: {
//             beds: 2,
//             baths: 2,
//             parking: 1,
//             area: "120 m²",
//             address: "Lekki Phase 1, Lagos",
//           },
//           features: ["Furnished", "CCTV", "Swimming pool access"],
//           description:
//             "Bright 2‑bed apartment with modern furnishing and facilities.",
//         },
//         {
//           title: "Studio, Oniru",
//           price: "₦3.5m/yr",
//           img: "/assets/hero3.png",
//           tourSrc: "/tours/oniru-studio.mp4",
//           brochure: "/brochures/paragon.pdf",
//           specs: {
//             beds: 1,
//             baths: 1,
//             parking: 1,
//             area: "55 m²",
//             address: "Oniru, VI Annex, Lagos",
//           },
//           features: ["Close to Landmark", "Gym access", "24/7 security"],
//           description:
//             "Compact studio in a prime Oniru location—ideal for professionals.",
//         },
//       ],
//     };

//     const allListings = [...listings.buy, ...listings.rent];
//     const selectedFromHash = params.d
//       ? allListings.find((l) => slugify(l.title) === params.d)
//       : null;

//     const openDetails = (l) => {
//       const nextParams = { t: tab, d: slugify(l.title) };
//       goto("real-estate", nextParams); // persists in hash -> modal won't "disappear"
//     };
//     const closeDetails = () => goto("real-estate", { t: tab });

//     return (
//       <>
//         <HeroStrip title="Real Estate" />
//         <Section
//           title="Find Your Home"
//           subtitle="Explore homes to buy or rent. Each listing includes an on-page virtual tour video."
//         >
//           <div style={{ display: "flex", gap: 10 }}>
//             <button
//               onClick={() => {
//                 setTab("buy");
//                 goto("real-estate", { t: "buy" });
//               }}
//               style={tabBtn(tab === "buy")}
//             >
//               Buy Properties
//             </button>
//             <button
//               onClick={() => {
//                 setTab("rent");
//                 goto("real-estate", { t: "rent" });
//               }}
//               style={tabBtn(tab === "rent")}
//             >
//               Rent Properties
//             </button>
//           </div>
//           <div
//             style={{
//               display: "grid",
//               gap: 16,
//               gridTemplateColumns: vw > 1000 ? "repeat(2,1fr)" : "1fr",
//               marginTop: 16,
//             }}
//           >
//             {listings[tab].map((l, i) => (
//               <div
//                 key={i}
//                 style={{
//                   border: "1px solid #eee",
//                   borderRadius: 12,
//                   overflow: "hidden",
//                   background: "#fff",
//                 }}
//               >
//                 <div
//                   style={{
//                     background: `#000 url(${l.img}) center/cover no-repeat`,
//                     height: 220,
//                   }}
//                 />
//                 <div style={{ padding: 14, display: "grid", gap: 8 }}>
//                   <div style={{ fontWeight: 900, fontSize: 18 }}>{l.title}</div>
//                   <div style={{ color: BRAND.red, fontWeight: 800 }}>
//                     {l.price}
//                   </div>
//                   <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                     <button style={smallCta()} onClick={() => openDetails(l)}>
//                       Details
//                     </button>
//                     <a
//                       href={`mailto:info@hillstar.com.ng?subject=Enquiry: ${encodeURIComponent(
//                         l.title
//                       )}`}
//                       style={{
//                         ...smallCta(),
//                         display: "inline-grid",
//                         placeItems: "center",
//                         textDecoration: "none",
//                       }}
//                     >
//                       Enquire
//                     </a>
//                     <a
//                       href={l.brochure}
//                       download
//                       style={{
//                         ...smallCta(),
//                         display: "inline-grid",
//                         placeItems: "center",
//                         textDecoration: "none",
//                       }}
//                     >
//                       Download Brochure
//                     </a>
//                   </div>
//                   <VideoPlayer
//                     src={l.tourSrc}
//                     label={`${l.title} — Virtual Tour`}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Section>

//         {selectedFromHash && (
//           <DetailsModal listing={selectedFromHash} onClose={closeDetails} />
//         )}
//       </>
//     );
//   };

//   function DetailsModal({ listing, onClose }) {
//     const onKey = useCallback(
//       (e) => {
//         if (e.key === "Escape") onClose();
//       },
//       [onClose]
//     );
//     useEffect(() => {
//       document.body.style.overflow = "hidden";
//       window.addEventListener("keydown", onKey);
//       return () => {
//         window.removeEventListener("keydown", onKey);
//         document.body.style.overflow = "";
//       };
//     }, [onKey]);

//     return (
//       <div
//         role="dialog"
//         aria-modal="true"
//         style={{
//           position: "fixed",
//           inset: 0,
//           background: "rgba(0,0,0,.65)",
//           display: "grid",
//           placeItems: "center",
//           zIndex: 3000,
//         }}
//       >
//         <div
//           style={{
//             width: "min(900px, 92vw)",
//             background: "#fff",
//             borderRadius: 12,
//             overflow: "hidden",
//             boxShadow: "0 20px 60px rgba(0,0,0,.4)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: 14,
//               borderBottom: "1px solid #eee",
//             }}
//           >
//             <div style={{ fontWeight: 900 }}>{listing.title}</div>
//             <button
//               onClick={onClose}
//               aria-label="Close details"
//               style={{
//                 background: "none",
//                 border: "1px solid #ddd",
//                 borderRadius: 8,
//                 padding: "6px 10px",
//                 cursor: "pointer",
//               }}
//             >
//               Close
//             </button>
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: vw > 900 ? "1.3fr 1fr" : "1fr",
//               gap: 16,
//               padding: 16,
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   background: `#000 url(${listing.img}) center/cover no-repeat`,
//                   borderRadius: 10,
//                   height: 260,
//                 }}
//               />
//               <div style={{ marginTop: 12 }}>
//                 <VideoPlayer src={listing.tourSrc} label={`Virtual Tour`} />
//               </div>
//             </div>
//             <div style={{ display: "grid", gap: 10 }}>
//               <div style={{ color: BRAND.red, fontWeight: 900, fontSize: 18 }}>
//                 {listing.price}
//               </div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 8,
//                 }}
//               >
//                 <Spec label="Bedrooms" value={listing.specs?.beds} />
//                 <Spec label="Bathrooms" value={listing.specs?.baths} />
//                 <Spec label="Parking" value={listing.specs?.parking} />
//                 <Spec label="Area" value={listing.specs?.area} />
//                 <Spec label="Address" value={listing.specs?.address} wide />
//               </div>
//               {listing.features?.length > 0 && (
//                 <div>
//                   <div style={{ fontWeight: 800, marginBottom: 6 }}>
//                     Features
//                   </div>
//                   <ul style={{ margin: 0, paddingLeft: 18 }}>
//                     {listing.features.map((f, i) => (
//                       <li key={i}>{f}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {listing.description && (
//                 <div>
//                   <div style={{ fontWeight: 800, marginBottom: 6 }}>
//                     Description
//                   </div>
//                   <p style={{ margin: 0 }}>{listing.description}</p>
//                 </div>
//               )}
//               <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                 <a
//                   href={listing.brochure}
//                   download
//                   style={{ ...smallCta(), textDecoration: "none" }}
//                 >
//                   Download Brochure
//                 </a>
//                 <a
//                   href={`mailto:info@hillstar.com.ng?subject=Enquiry: ${encodeURIComponent(
//                     listing.title
//                   )}`}
//                   style={{
//                     ...smallCta(),
//                     background: BRAND.red,
//                     color: "#fff",
//                     textDecoration: "none",
//                   }}
//                 >
//                   Enquire via Email
//                 </a>
//                 <a
//                   href={`tel:+2349166876907`}
//                   style={{ ...smallCta(), textDecoration: "none" }}
//                 >
//                   Call
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   function Spec({ label, value, wide }) {
//     return (
//       <div
//         style={{
//           border: "1px solid #eee",
//           borderRadius: 8,
//           padding: "8px 10px",
//           gridColumn: wide ? "span 2" : "auto",
//         }}
//       >
//         <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
//         <div style={{ fontWeight: 800 }}>{value ?? "-"}</div>
//       </div>
//     );
//   }

//   const Hospitality = () => {
//     const rooms = [
//       {
//         title: "Premium Suite, Lekki",
//         price: "₦120k / night",
//         img: "/assets/villa.png",
//         tourSrc: "/tours/suite-lekki.mp4",
//         specs: {
//           bed: "King",
//           guests: 2,
//           size: "45 m²",
//           address: "Lekki Phase 1, Lagos",
//         },
//         amenities: [
//           "Wi‑Fi",
//           "Smart TV",
//           "Kitchenette",
//           "Workspace",
//           "24/7 Power",
//         ],
//         description:
//           "A serene premium suite with tasteful interiors and modern conveniences.",
//       },
//       {
//         title: "Studio Ikoyi",
//         price: "₦75k / night",
//         img: "/assets/rent_ikoyi.jpg",
//         tourSrc: "/tours/ikoyi-studio.mp4",
//         specs: {
//           bed: "Queen",
//           guests: 2,
//           size: "28 m²",
//           address: "Ikoyi, Lagos",
//         },
//         amenities: ["Wi‑Fi", "Gym Access", "Air Conditioning", "CCTV"],
//         description:
//           "Bright studio apartment in central Ikoyi, ideal for short stays.",
//       },
//     ];

//     const selectedFromHash = params.h
//       ? rooms.find((r) => slugify(r.title) === params.h)
//       : null;

//     const openRoom = (r) => goto("hospitality", { h: slugify(r.title) });
//     const closeRoom = () => goto("hospitality");

//     return (
//       <>
//         <HeroStrip
//           title="Hospitality"
//           subtitle="Browse and book — Airbnb‑style."
//         />
//         <Section
//           title="Stay With Us"
//           subtitle="Fill in your details, add multiple rooms, then submit. (Connect API later)"
//         >
//           <div
//             style={{
//               display: "grid",
//               gap: 16,
//               gridTemplateColumns: vw > 1000 ? "repeat(2,1fr)" : "1fr",
//             }}
//           >
//             {rooms.map((r, i) => (
//               <div
//                 key={i}
//                 style={{
//                   border: "1px solid #eee",
//                   borderRadius: 12,
//                   overflow: "hidden",
//                   background: "#fff",
//                 }}
//               >
//                 <div
//                   style={{
//                     background: `#000 url(${r.img}) center/cover no-repeat`,
//                     height: 220,
//                   }}
//                 />
//                 <div style={{ padding: 14, display: "grid", gap: 8 }}>
//                   <div style={{ fontWeight: 900, fontSize: 18 }}>{r.title}</div>
//                   <div style={{ color: BRAND.red, fontWeight: 800 }}>
//                     {r.price}
//                   </div>
//                   <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                     <button style={smallCta()} onClick={() => openRoom(r)}>
//                       Details
//                     </button>
//                     <a
//                       href={`mailto:info@hillstar.com.ng?subject=Booking Enquiry: ${encodeURIComponent(
//                         r.title
//                       )}`}
//                       style={{ ...smallCta(), textDecoration: "none" }}
//                     >
//                       Enquire
//                     </a>
//                   </div>
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 1fr",
//                       gap: 6,
//                     }}
//                   >
//                     <Spec label="Bed" value={r.specs?.bed} />
//                     <Spec label="Guests" value={r.specs?.guests} />
//                     <Spec label="Size" value={r.specs?.size} />
//                     <Spec label="Address" value={r.specs?.address} wide />
//                   </div>
//                   <BookingForm />
//                   <VideoPlayer src={r.tourSrc} label={`${r.title} — Tour`} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Section>

//         {selectedFromHash && (
//           <RoomDetailsModal room={selectedFromHash} onClose={closeRoom} />
//         )}
//       </>
//     );
//   };

//   function RoomDetailsModal({ room, onClose }) {
//     const onKey = useCallback(
//       (e) => {
//         if (e.key === "Escape") onClose();
//       },
//       [onClose]
//     );
//     useEffect(() => {
//       document.body.style.overflow = "hidden";
//       window.addEventListener("keydown", onKey);
//       return () => {
//         window.removeEventListener("keydown", onKey);
//         document.body.style.overflow = "";
//       };
//     }, [onKey]);

//     return (
//       <div
//         role="dialog"
//         aria-modal="true"
//         style={{
//           position: "fixed",
//           inset: 0,
//           background: "rgba(0,0,0,.65)",
//           display: "grid",
//           placeItems: "center",
//           zIndex: 3000,
//         }}
//       >
//         <div
//           style={{
//             width: "min(900px, 92vw)",
//             background: "#fff",
//             borderRadius: 12,
//             overflow: "hidden",
//             boxShadow: "0 20px 60px rgba(0,0,0,.4)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: 14,
//               borderBottom: "1px solid #eee",
//             }}
//           >
//             <div style={{ fontWeight: 900 }}>{room.title}</div>
//             <button
//               onClick={onClose}
//               aria-label="Close details"
//               style={{
//                 background: "none",
//                 border: "1px solid #ddd",
//                 borderRadius: 8,
//                 padding: "6px 10px",
//                 cursor: "pointer",
//               }}
//             >
//               Close
//             </button>
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: vw > 900 ? "1.3fr 1fr" : "1fr",
//               gap: 16,
//               padding: 16,
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   background: `#000 url(${room.img}) center/cover no-repeat`,
//                   borderRadius: 10,
//                   height: 260,
//                 }}
//               />
//               <div style={{ marginTop: 12 }}>
//                 <VideoPlayer src={room.tourSrc} label={`Room Tour`} />
//               </div>
//             </div>
//             <div style={{ display: "grid", gap: 10 }}>
//               <div style={{ color: BRAND.red, fontWeight: 900, fontSize: 18 }}>
//                 {room.price}
//               </div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 8,
//                 }}
//               >
//                 <Spec label="Bed" value={room.specs?.bed} />
//                 <Spec label="Guests" value={room.specs?.guests} />
//                 <Spec label="Size" value={room.specs?.size} />
//                 <Spec label="Address" value={room.specs?.address} wide />
//               </div>
//               {room.amenities?.length > 0 && (
//                 <div>
//                   <div style={{ fontWeight: 800, marginBottom: 6 }}>
//                     Amenities
//                   </div>
//                   <ul style={{ margin: 0, paddingLeft: 18 }}>
//                     {room.amenities.map((f, i) => (
//                       <li key={i}>{f}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {room.description && (
//                 <div>
//                   <div style={{ fontWeight: 800, marginBottom: 6 }}>
//                     Description
//                   </div>
//                   <p style={{ margin: 0 }}>{room.description}</p>
//                 </div>
//               )}
//               <div>
//                 <div style={{ fontWeight: 800, marginBottom: 6 }}>
//                   Book this room
//                 </div>
//                 <BookingForm />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const GenericSector = ({ title, bullets }) => (
//     <>
//       <HeroStrip title={title} />
//       <Section
//         title={`What ${title} Means at Hillstar`}
//         subtitle="Highlights of our work with embedded tour videos."
//       >
//         <ul style={{ lineHeight: 1.9 }}>
//           {bullets.map((b, i) => (
//             <li key={i}>{b}</li>
//           ))}
//         </ul>
//         <div
//           style={{
//             display: "grid",
//             gap: 12,
//             gridTemplateColumns: vw > 900 ? "repeat(3,1fr)" : "1fr",
//             marginTop: 16,
//           }}
//         >
//           {["civic.mp4", "paragon.mp4", "lekki.mp4"].map((file, i) => (
//             <VideoPlayer
//               key={i}
//               src={`/tours/${file}`}
//               label={`${title} Tour #${i + 1}`}
//             />
//           ))}
//         </div>
//       </Section>
//     </>
//   );

//   function HeroStrip({ title, subtitle }) {
//     return (
//       <div
//         style={{
//           background: BRAND.black,
//           color: "#fff",
//           padding: "40px 0",
//           borderBottom: "1px solid #111",
//           textAlign: "center",
//         }}
//       >
//         <div style={{ width: "min(1200px,92vw)", margin: "0 auto" }}>
//           <h1 style={{ fontSize: 34, fontWeight: 900 }}>{title}</h1>
//           {subtitle && <p style={{ opacity: 0.85 }}>{subtitle}</p>}
//         </div>
//       </div>
//     );
//   }

//   /* ----------------------------- HELPERS ------------------------------- */
//   const tourFrame = {
//     width: "100%",
//     height: 260,
//     border: "1px solid #eee",
//     borderRadius: 10,
//     background: "#0e0e0e",
//   };
//   const tabBtn = (active) => ({
//     padding: "10px 14px",
//     borderRadius: 8,
//     border: `2px solid ${active ? BRAND.red : "#ddd"}`,
//     background: active ? BRAND.red : "#fff",
//     color: active ? "#fff" : "#222",
//     fontWeight: 800,
//     cursor: "pointer",
//   });
//   const smallCta = () => ({
//     padding: "8px 12px",
//     borderRadius: 6,
//     background: "#eee",
//     border: "none",
//     fontWeight: 700,
//     cursor: "pointer",
//   });

//   function VideoPlayer({ src, label }) {
//     return (
//       <div>
//         <div style={{ fontWeight: 700, margin: "6px 0" }}>{label}</div>
//         <video controls style={tourFrame} preload="metadata">
//           <source src={src} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     );
//   }

//   /* ------------------------ HOSPITALITY BOOKING FORM ------------------- */
//   function BookingForm() {
//     const [customer, setCustomer] = useState({
//       name: "",
//       email: "",
//       phone: "",
//     });
//     const [rooms, setRooms] = useState([
//       { checkIn: "", checkOut: "", guests: 1 },
//     ]);

//     const addRoom = () =>
//       setRooms((rs) => [...rs, { checkIn: "", checkOut: "", guests: 1 }]);
//     const removeRoom = (i) =>
//       setRooms((rs) => (rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs));
//     const updateRoom = (i, field, value) =>
//       setRooms((rs) =>
//         rs.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
//       );

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       const payload = { customer, rooms };
//       alert(`Booking submitted!\n\n${JSON.stringify(payload, null, 2)}`);
//     };

//     return (
//       <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
//         <input
//           required
//           placeholder="Full Name"
//           value={customer.name}
//           onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
//           style={inputStyle}
//         />
//         <input
//           required
//           type="email"
//           placeholder="Email"
//           value={customer.email}
//           onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
//           style={inputStyle}
//         />
//         <input
//           required
//           placeholder="Phone"
//           value={customer.phone}
//           onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
//           style={inputStyle}
//         />

//         {rooms.map((room, i) => (
//           <div
//             key={i}
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: 8,
//               padding: 10,
//               display: "grid",
//               gap: 6,
//             }}
//           >
//             <div style={{ fontWeight: 800 }}>Room {i + 1}</div>
//             <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//               <input
//                 required
//                 type="date"
//                 value={room.checkIn}
//                 onChange={(e) => updateRoom(i, "checkIn", e.target.value)}
//                 style={inputStyle}
//               />
//               <input
//                 required
//                 type="date"
//                 value={room.checkOut}
//                 onChange={(e) => updateRoom(i, "checkOut", e.target.value)}
//                 style={inputStyle}
//               />
//               <input
//                 required
//                 type="number"
//                 min={1}
//                 value={room.guests}
//                 onChange={(e) =>
//                   updateRoom(i, "guests", Number(e.target.value))
//                 }
//                 style={{ ...inputStyle, width: 120 }}
//                 placeholder="# Guests"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeRoom(i)}
//                 style={{ ...smallCta(), background: "#f2f2f2" }}
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}
//         <button type="button" onClick={addRoom} style={smallCta()}>
//           + Add Another Room
//         </button>
//         <button
//           type="submit"
//           style={{ ...smallCta(), background: BRAND.red, color: "#fff" }}
//         >
//           Submit Booking
//         </button>
//       </form>
//     );
//   }
//   const inputStyle = {
//     padding: "10px 12px",
//     border: "1px solid #ddd",
//     borderRadius: 8,
//   };

//   /* ---------------------------- TALK TO US FAB -------------------------- */
//   const Fab = () => (
//     <>
//       <button
//         aria-label="Talk to us"
//         onClick={() => setSheetOpen((s) => !s)}
//         style={{
//           position: "fixed",
//           right: 16,
//           bottom: 16,
//           background: BRAND.red,
//           color: "#fff",
//           border: "none",
//           borderRadius: 30,
//           padding: "12px 18px",
//           fontWeight: 900,
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//           boxShadow: "0 10px 30px rgba(0,0,0,.35)",
//           zIndex: 1200,
//         }}
//       >
//         <Icon.Phone />
//         <span>Talk to us</span>
//       </button>
//       {sheetOpen && (
//         <div
//           style={{
//             position: "fixed",
//             right: 16,
//             bottom: 70,
//             background: "#111",
//             color: "#fff",
//             padding: 12,
//             borderRadius: 12,
//             border: "1px solid rgba(255,255,255,.1)",
//             display: "grid",
//             gap: 10,
//             zIndex: 1200,
//           }}
//         >
//           {SOCIALS.map(({ name, href, Icon: IC }) => (
//             <a
//               key={name}
//               href={href}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 color: "#fff",
//                 textDecoration: "none",
//               }}
//             >
//               <div
//                 style={{
//                   width: 32,
//                   height: 32,
//                   borderRadius: 8,
//                   background: "rgba(255,255,255,.1)",
//                   display: "grid",
//                   placeItems: "center",
//                 }}
//               >
//                 <IC />
//               </div>
//               <span>{name}</span>
//             </a>
//           ))}
//         </div>
//       )}
//     </>
//   );

//   /* ------------------------------- RENDER ------------------------------ */
//   const Home = () => (
//     <>
//       <Hero />
//       <Services />
//       <FeaturedProperties />
//       <VideoSection />
//       <AboutUs />
//     </>
//   );

//   return (
//     <div
//       style={{
//         fontFamily:
//           "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
//       }}
//     >
//       <TopBar />
//       <Navbar />

//       {route === "home" && <Home />}
//       {route === "about" && <AboutUs />}
//       {route === "services" && <Services />}
//       {route === "projects" && <FeaturedProperties />}
//       {route === "contact" && <AboutUs />}

//       {route === "real-estate" && <RealEstate />}
//       {route === "hospitality" && <Hospitality />}
//       {route === "renewable" && (
//         <GenericSector
//           title="Renewable Energy"
//           bullets={[
//             "Solar PV design & EPC",
//             "Battery storage & hybrid systems",
//             "Monitoring dashboards with uptime SLAs",
//           ]}
//         />
//       )}
//       {route === "procurement" && (
//         <GenericSector
//           title="Procurement Services"
//           bullets={[
//             "Local & international sourcing",
//             "QA/QC & compliance",
//             "Logistics & warehousing",
//           ]}
//         />
//       )}
//       {route === "telecom" && (
//         <GenericSector
//           title="Telecom & Technology"
//           bullets={[
//             "FTTx / ODN deployments",
//             "Microwave backhaul / small cells",
//             "Campus networks & DAS",
//           ]}
//         />
//       )}

//       <Footer />
//       <Fab />
//     </div>
//   );
// }

// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";

import RealEstate from "./pages/RealEstate";
import Hospitality from "./pages/Hospitality";
import Renewable from "./pages/Renewable";
import Procurement from "./pages/Procurement";
import Telecom from "./pages/Telecom";

import { Fab, Footer } from "./shared/Shared";

export default function App() {
  return (
    <>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />
        {/* Optional alias so /home still works */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/real-estate" element={<RealEstate />} />
        <Route path="/hospitality" element={<Hospitality />} />
        <Route path="/renewable" element={<Renewable />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/telecom" element={<Telecom />} />

        <Route
          path="*"
          element={<div style={{ padding: 24 }}>Not found</div>}
        />
      </Routes>

      <Fab />
      <Footer />
    </>
  );
}
