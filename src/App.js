import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './config/emailjs';

/* ═══════════════════════════════════════════════
   DESIGN TOKENS — Warm Amber × Deep Teal
═══════════════════════════════════════════════ */
const T = {
  bg:       "#FDFAF4",
  bg2:      "#F7F2E8",
  surface:  "rgba(255,255,255,0.72)",
  border:   "rgba(180,140,60,0.18)",
  borderHi: "rgba(180,140,60,0.45)",
  amber:    "#C98B2E",
  amberLt:  "#F0C060",
  amberPale:"#FFF5DC",
  teal:     "#1A6B5A",
  tealLt:   "#2E9E82",
  tealPale: "#E0F4EE",
  rust:     "#B84C2E",
  slate:    "#2C3A4A",
  text:     "#1C1810",
  muted:    "#7A6A52",
  mutedLt:  "#B0A080",
};

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const NAV = ["About","Skills","Experience","Education","Certifications","Projects","Testimonials","Contact"];

// ── Replace with your Google Drive share link ──
const CV_LINK = "https://drive.google.com/file/d/1-Gxca0HW3q42JEXcrG4KxsIh-wymyiHP/view?usp=drivesdk";

const SOCIAL = [
  { label:"LinkedIn",  icon:"in",  href:"https://www.linkedin.com/in/mohit-soni-ab96b21b1/", color:T.teal  },
  { label:"GitHub",    icon:"gh",  href:"https://github.com/",                                  color:T.slate },
  { label:"Email",     icon:"@",   href:"mailto:mohitsoni11aug2002@gmail.com",                  color:T.amber },
  { label:"Phone",     icon:"☎",   href:"tel:9753484051",                                       color:T.rust  },
];

const SKILLS = [
  { name:"Python & Django", icon:"🐍", pct:90, color:T.teal,   bg:"#E0F4EE", shape:"hex"    },
  { name:"Rasa / NLU",      icon:"🤖", pct:84, color:T.amber,  bg:"#FFF0D0", shape:"diamond"},
  { name:"Kafka & Redis",   icon:"⚡", pct:78, color:T.rust,   bg:"#FDEEE8", shape:"circle" },
  { name:"REST APIs",       icon:"🔌", pct:88, color:T.teal,   bg:"#E0F4EE", shape:"hex"    },
  { name:"MongoDB / Neo4j", icon:"🗄️", pct:82, color:T.amber,  bg:"#FFF0D0", shape:"diamond"},
  { name:"SQL Agents",      icon:"🧠", pct:80, color:"#5B4FCF", bg:"#EEEAFF", shape:"circle" },
  { name:".NET / C#",       icon:"💠", pct:65, color:T.slate,  bg:"#E8ECF2", shape:"hex"    },
  { name:"Linux & Infra",   icon:"🐧", pct:74, color:T.teal,   bg:"#E0F4EE", shape:"diamond"},
];

const EXP = [
  {
    company:"Omfys Technology Pvt Ltd",
    role:"Software Developer",
    period:"April 2025 — Present", tag:"Current", color:T.teal,
    desc:"Building three live product lines simultaneously — HR NOVA (Rasa NLU chatbot), Crest.ai (SQL agents on agentic platform), and AJNA (real-time performance monitoring with Kafka, Redis, MongoDB). Full ownership of API development and Linux services.",
    tech:["Python","Rasa","Kafka","Redis","MongoDB","SQL Agents","Linux","REST APIs"],
  },
  {
    company:"Neno Systems Consulting Services",
    role:"Trainee Software Developer",
    period:"6 Months", tag:"Trainee", color:T.amber,
    desc:"Deployed server project as a .NET developer. Built backend services and implemented UI components using HTML, CSS, and .NET for a production environment used by real clients.",
    tech:[".NET","C#","HTML","CSS","SQL"],
  },
  {
    company:"Signimus Technologies Pvt Ltd",
    role:"Intern",
    period:"3 Months", tag:"Intern", color:T.rust,
    desc:"Contributed to software development and debugging cycles. Hands-on experience in Python, web development, database management and API integration.",
    tech:["Python","Web Dev","Databases","APIs"],
  },
];

// Education: only B.Tech graduation
const EDU = [
  { degree:"B.Tech — Computer Science Engineering", inst:"SVIT, Indore", period:"2019–2023", icon:"🎓", color:T.teal, grade:"Graduated" },
];

// Certifications: OCI certs (link = CV_LINK for now, user will update)
const CERTS = [
  {
    title:"OCI — Data Science Professional",
    inst:"Oracle Cloud",
    period:"2025",
    icon:"☁️",
    color:T.amber,
    grade:"Certified",
    link:"https://drive.google.com/file/d/1mHN2EOZZPiSZquRA0YuPqkh3Ef-k2c5C/view?usp=drive_link",
  },
  {
    title:"OCI — Gen AI Professional",
    inst:"Oracle Cloud",
    period:"2025",
    icon:"🤖",
    color:T.rust,
    grade:"Certified",
    link:"https://drive.google.com/file/d/1AgdcIbG6PKmsgpPmuc_Pd-eUqYeKsIbH/view?usp=drive_link",
  },
    {
    title:"Internship Certificate",
    inst:"Signimus Technologies, Indore",
    period:"2022",
    icon:"📜",
    color:T.teal,
    grade:"Certified",
    link:"https://drive.google.com/file/d/1OMC8Hh0P4ZMTpy507KDmKdyGFDwnO9Up/view?usp=drive_link",
  },
];

const PROJECTS = [
  {
    num:"01", title:"HR NOVA", sub:"HR Digital Assistant", emoji:"🤖",
    accent:T.teal, accentBg:"#E0F4EE",
    desc:"Intelligent HR assistant powered by Rasa NLU. Handles employee queries, automates leave management, integrates with company APIs and processes natural language requests in real time.",
    highlights:["Custom NLU training pipeline","Domain & story configuration","API-connected action server","Multi-turn conversation flows"],
    tech:["Rasa","Python","NLU","REST APIs","Custom Actions"],
  },
  {
    num:"02", title:"Crest.ai", sub:"Agentic SQL Platform", emoji:"⚡",
    accent:T.amber, accentBg:"#FFF0D0",
    desc:"Multi-agent orchestration platform that translates natural language into optimized SQL. Agents coordinate to decompose complex queries and handle multi-step database workflows.",
    highlights:["Natural language → SQL pipeline","Multi-agent coordination","Query optimization layer","Agentic task delegation"],
    tech:["SQL Agents","Python","AI Orchestration","Databases"],
  },
  {
    num:"03", title:"AJNA", sub:"Performance Monitoring", emoji:"📊",
    accent:T.rust, accentBg:"#FDEEE8",
    desc:"Real-time office performance monitoring on event-driven infrastructure. Built Kafka pipelines, Redis caching layers, MongoDB storage and comprehensive analytics APIs.",
    highlights:["Real-time Kafka event pipelines","Redis caching strategy","Analytics REST API","Linux service monitoring"],
    tech:["Kafka","Redis","MongoDB","Linux","REST APIs"],
  },
];

const TESTIMONIALS = [
  { name:"Priya Sharma",  role:"Senior Developer, Omfys Technology",    av:"PS", color:T.teal,
    text:"Mohit consistently delivers beyond expectations. His ability to absorb Kafka and Rasa while shipping production features is remarkable for his experience level." },
  { name:"Rahul Verma",   role:"Tech Lead, Neno Systems Consulting",     av:"RV", color:T.amber,
    text:"A fast learner with real initiative. He dived into our .NET server project and was contributing meaningful features within the first week. His debugging instincts are sharp." },
  { name:"Anjali Mehra",  role:"Mentor, Signimus Technologies",          av:"AM", color:T.rust,
    text:"Mohit asks the right questions, isn't afraid to fail fast, and takes full ownership of his work. A genuine pleasure to mentor — we'd hire him again without hesitation." },
  { name:"Vikram Patel",  role:"Project Manager, SVIT Indore",           av:"VP", color:T.teal,
    text:"One of the most technically curious students in the batch. His final year project showed engineering depth that genuinely set him apart from his peers." },
  { name:"Neha Joshi",    role:"HR Manager, Omfys Technology",           av:"NJ", color:T.amber,
    text:"The NOVA chatbot Mohit built transformed how our HR team operates. Remarkably accurate, handles edge cases gracefully. He has great product instincts." },
];

/* ═══════════════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'Outfit',sans-serif;background:${T.bg};color:${T.text};overflow-x:hidden;cursor:none}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:${T.bg2}}
::-webkit-scrollbar-thumb{background:${T.amber};border-radius:2px}
a{color:inherit;text-decoration:none}
button{font-family:'Outfit',sans-serif;cursor:none}
input,textarea{font-family:'Outfit',sans-serif}
input:focus,textarea:focus{outline:none}
img{max-width:100%}

@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideLeft{from{opacity:0;transform:translateX(-32px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes tlGrow{from{height:0}to{height:100%}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes hexPulse{0%,100%{box-shadow:0 0 0 0 rgba(26,107,90,0.15)}50%{box-shadow:0 0 0 12px rgba(26,107,90,0)}}
@keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.08)}}
@keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,30px) scale(1.05)}}
@keyframes orb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,20px) scale(1.1)}}

.reveal{opacity:0;transform:translateY(36px);transition:opacity .75s cubic-bezier(.4,0,.2,1),transform .75s cubic-bezier(.34,1.56,.64,1)}
.reveal.on{opacity:1;transform:translateY(0)}
.reveal-l{opacity:0;transform:translateX(-32px);transition:opacity .7s ease,transform .7s cubic-bezier(.34,1.56,.64,1)}
.reveal-l.on{opacity:1;transform:translateX(0)}
.reveal-r{opacity:0;transform:translateX(32px);transition:opacity .7s ease,transform .7s cubic-bezier(.34,1.56,.64,1)}
.reveal-r.on{opacity:1;transform:translateX(0)}
.reveal-s{opacity:0;transform:scale(0.9);transition:opacity .7s ease,transform .7s cubic-bezier(.34,1.56,.64,1)}
.reveal-s.on{opacity:1;transform:scale(1)}

/* Glass surface */
.glass{
  background:rgba(255,252,244,0.72);
  backdrop-filter:blur(20px) saturate(160%);
  -webkit-backdrop-filter:blur(20px) saturate(160%);
  border:1px solid rgba(180,140,60,0.18);
  box-shadow:0 2px 24px rgba(60,40,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
}
.glass-hover{transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease,border-color .3s}
.glass-hover:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(60,40,0,0.12),inset 0 1px 0 rgba(255,255,255,0.95)!important;border-color:rgba(180,140,60,0.38)!important}

/* Nav */
.nav-link{position:relative;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${T.muted};background:none;border:none;padding:6px 0;transition:color .2s;cursor:none;font-family:'Outfit',sans-serif;font-weight:500}
.nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1.5px;background:${T.amber};transition:width .3s}
.nav-link:hover{color:${T.amber}}
.nav-link:hover::after{width:100%}
.nav-link.active{color:${T.amber}}
.nav-link.active::after{width:100%}

/* Buttons */
.btn-amber{
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 28px;border-radius:100px;border:none;
  background:${T.amber};color:#fff;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;letter-spacing:.04em;
  box-shadow:0 6px 24px rgba(201,139,46,0.38);
  transition:all .35s cubic-bezier(.34,1.56,.64,1);cursor:none;
}
.btn-amber:hover{background:#B07020;transform:translateY(-2px) scale(1.03);box-shadow:0 12px 36px rgba(201,139,46,0.48)}
.btn-outline{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 26px;border-radius:100px;border:1.5px solid ${T.border};
  background:rgba(255,255,255,0.6);color:${T.teal};
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;letter-spacing:.04em;
  backdrop-filter:blur(8px);transition:all .3s;cursor:none;
}
.btn-outline:hover{border-color:${T.teal};background:${T.tealPale};transform:translateY(-2px)}
.btn-teal{
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 28px;border-radius:100px;border:none;
  background:${T.teal};color:#fff;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;letter-spacing:.04em;
  box-shadow:0 6px 24px rgba(26,107,90,0.38);
  transition:all .35s cubic-bezier(.34,1.56,.64,1);cursor:none;
}
.btn-teal:hover{background:#134D40;transform:translateY(-2px) scale(1.03);box-shadow:0 12px 36px rgba(26,107,90,0.48)}

/* Section label */
.sec-label{display:inline-flex;align-items:center;gap:10px;margin-bottom:16px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${T.amber};font-weight:500}
.sec-label::before{content:'';width:28px;height:1.5px;background:${T.amber};flex-shrink:0}
.sec-h2{font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,62px);font-weight:900;color:${T.text};line-height:1.04;letter-spacing:-1px;margin-bottom:56px}

/* Chip / tag */
.chip{padding:4px 12px;border-radius:100px;font-size:11px;font-weight:500;font-family:'JetBrains Mono',monospace;border:1px solid ${T.border};color:${T.muted};background:rgba(255,255,255,0.5)}

/* Form */
.form-field{width:100%;padding:14px 18px;border-radius:14px;background:rgba(255,252,244,0.8);border:1.5px solid ${T.border};font-family:'Outfit',sans-serif;font-size:14px;color:${T.text};transition:border-color .3s,box-shadow .3s;resize:vertical}
.form-field:focus{border-color:${T.amber};box-shadow:0 0 0 4px rgba(201,139,46,0.1)}
.form-field::placeholder{color:${T.mutedLt}}

/* Timeline */
.tl-line{background:linear-gradient(180deg,${T.amber},${T.teal});border-radius:2px;transition:height 2s cubic-bezier(.4,0,.2,1)}
.tl-dot{width:14px;height:14px;border-radius:50%;flex-shrink:0;z-index:2;position:relative;box-shadow:0 0 0 4px ${T.bg},0 0 0 6px currentColor}
.tl-card-wrap{transition:opacity .7s ease,transform .7s cubic-bezier(.34,1.56,.64,1)}

/* Skill hexagon shapes */
.skill-hex{clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)}
.skill-diamond{clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)}

/* Carousel */
.carousel-btn{width:42px;height:42px;border-radius:50%;border:1.5px solid ${T.border};background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;cursor:none;transition:all .3s;flex-shrink:0;backdrop-filter:blur(8px)}
.carousel-btn:hover:not(:disabled){border-color:${T.amber};background:${T.amberPale};transform:scale(1.08)}
.carousel-btn:disabled{opacity:.35;cursor:not-allowed}

/* Mobile menu */
.mob-menu{position:fixed;inset:0;z-index:490;background:rgba(253,250,244,0.96);backdrop-filter:blur(24px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;transform:translateX(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);overflow-y:auto;padding:80px 20px}
.mob-menu.open{transform:translateX(0)}

/* ─── RESPONSIVE ─── */
@media(max-width:768px){
  body{cursor:auto}
  button,a{cursor:auto}
  .nav-desktop{display:none!important}
  .nav-mob-btn{display:flex!important}
  .hide-md{display:none!important}

  /* Hero */
  .hero-section{padding:72px 20px 48px!important}
  .hero-h1{font-size:clamp(52px,13vw,82px)!important}
  .hero-cta{flex-direction:column!important}
  .hero-cta .btn-amber,
  .hero-cta .btn-teal,
  .hero-cta .btn-outline{width:100%!important;justify-content:center!important}
  .stat-row{gap:20px!important;flex-wrap:wrap!important}
  .stat-row > div{min-width:calc(50% - 12px)}

  /* About */
  .about-grid{grid-template-columns:1fr!important}
  .sec-pad{padding:80px 20px!important}
  .sec-pad-l{padding:80px 0 80px 20px!important}

  /* Skills */
  .skills-top-row{flex-direction:column!important;align-items:flex-start!important;gap:16px!important}

  /* Experience: switch to left timeline */
  .exp-desktop{display:none!important}
  .exp-mobile{display:block!important}

  /* Projects */
  .proj-grid{grid-template-columns:1fr!important}

  /* Certifications */
  .cert-tl-wrap{padding-left:40px!important}
  .cert-tl-dot{left:-37px!important}

  /* Education */
  .edu-tl-wrap{padding-left:40px!important}
  .edu-tl-dot{left:-37px!important}

  /* Testimonials */
  .test-top-row{flex-direction:column!important;align-items:flex-start!important;gap:16px!important}

  /* Contact */
  .contact-grid{grid-template-columns:1fr!important}
  .contact-name-row{grid-template-columns:1fr!important}

  /* Footer */
  .footer-top-grid{grid-template-columns:1fr!important;gap:32px!important}
  .footer-bottom{flex-direction:column!important;gap:8px!important;text-align:center!important}
  .footer-pad{padding:40px 20px 32px!important}
  .footer-bot-pad{padding:16px 20px!important}
}

@media(max-width:480px){
  .sec-h2{font-size:clamp(32px,8vw,48px)!important;margin-bottom:36px!important}
}

@media(min-width:769px) and (max-width:1100px){
  .proj-grid{grid-template-columns:repeat(2,1fr)!important}
  .about-grid{grid-template-columns:1fr!important}
  .contact-grid{grid-template-columns:1fr!important}
}
`;

/* ═══════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════ */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.querySelectorAll(".reveal,.reveal-l,.reveal-r,.reveal-s").forEach((node, i) => {
          setTimeout(() => node.classList.add("on"), i * 90);
        });
        obs.unobserve(el);
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function useSingleReveal(cls = "reveal", delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => el.classList.add("on"), delay);
        obs.unobserve(el);
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ═══════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════ */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const move = e => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", move);
    const loop = () => {
      dot.current && (dot.current.style.transform = `translate(${mx - 5}px,${my - 5}px)`);
      rx += (mx - rx - 18) * 0.11;
      ry += (my - ry - 18) * 0.11;
      ring.current && (ring.current.style.transform = `translate(${rx}px,${ry}px)`);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dot} style={{ position:"fixed",top:0,left:0,width:10,height:10,borderRadius:"50%",background:T.amber,pointerEvents:"none",zIndex:9999,willChange:"transform" }} />
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:36,height:36,borderRadius:"50%",border:`1.5px solid ${T.amber}88`,pointerEvents:"none",zIndex:9998,willChange:"transform" }} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setOpen(false); };
  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:500,height:64,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(16px,4vw,40px)",background:scrolled?"rgba(253,250,244,0.9)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${T.border}`:"1px solid transparent",transition:"all .4s",boxShadow:scrolled?"0 2px 20px rgba(60,40,0,0.05)":"none" }}>
        {/* Logo */}
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:T.amber,letterSpacing:"-0.5px",flexShrink:0 }}>MS.</div>
        {/* Desktop links */}
        <div className="nav-desktop" style={{ display:"flex",gap:clamp(8,1.5,20) }}>
          {NAV.map(n => (
            <button key={n} className={`nav-link${active===n.toLowerCase()?" active":""}`} style={{fontSize:11}} onClick={() => go(n.toLowerCase())}>{n}</button>
          ))}
        </div>
        {/* Download CV */}
        <a href={CV_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline hide-md" style={{ fontSize:12,padding:"8px 18px",gap:6 }}>
          <span>↓</span> Download CV
        </a>
        {/* Mobile hamburger */}
        <button className="nav-mob-btn" onClick={() => setOpen(o => !o)} style={{ display:"none",flexDirection:"column",gap:5,background:"none",border:"none",cursor:"pointer",padding:8,zIndex:510 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display:"block",width:24,height:2,background:T.text,borderRadius:2,transition:"all .3s",transform:open?(i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"scaleX(0)"):"none",opacity:open&&i===1?0:1 }} />
          ))}
        </button>
      </nav>
      {/* Mobile menu */}
      <div className={`mob-menu${open?" open":""}`}>
        {NAV.map((n,i) => (
          <button key={n} onClick={() => go(n.toLowerCase())} style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:T.text,background:"none",border:"none",cursor:"pointer",opacity:0,animation:open?`fadeIn .4s ${i*0.07}s ease forwards`:"none" }}>{n}</button>
        ))}
        <a href={CV_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ marginTop:8 }}>↓ Download CV</a>
      </div>
    </>
  );
}

// small helper used in JSX
function clamp(min, preferred, max) {
  return `clamp(${min}px,${preferred}vw,${max}px)`;
}

/* ═══════════════════════════════════════════════
   BG ORBS
═══════════════════════════════════════════════ */
function BgOrbs() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
      {[
        { w:600,h:600,t:"-150px",l:"-150px",bg:`radial-gradient(circle,rgba(201,139,46,0.12),transparent 70%)`,anim:"orb1 14s ease-in-out infinite" },
        { w:500,h:500,t:"30%",r:"-120px",bg:`radial-gradient(circle,rgba(26,107,90,0.1),transparent 70%)`,anim:"orb2 17s ease-in-out infinite" },
        { w:400,h:400,b:"-80px",l:"35%",bg:`radial-gradient(circle,rgba(184,76,46,0.07),transparent 70%)`,anim:"orb3 20s ease-in-out infinite" },
      ].map((o,i) => (
        <div key={i} style={{ position:"absolute",width:o.w,height:o.h,borderRadius:"50%",background:o.bg,top:o.t,left:o.l,right:o.r,bottom:o.b,animation:o.anim }} />
      ))}
      {/* Grain */}
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.03 }} aria-hidden>
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
function Hero() {
  const wordsRef = useRef([]);
  const subRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const els = [
      { el: badgeRef.current, d: 0 },
      ...wordsRef.current.map((el, i) => ({ el, d: 100 + i * 100 })),
      { el: subRef.current, d: 400 },
      { el: descRef.current, d: 500 },
      { el: ctaRef.current, d: 600 },
      { el: statsRef.current, d: 700 },
    ];
    els.forEach(({ el, d }) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      setTimeout(() => {
        el.style.transition = "opacity .8s ease, transform .8s cubic-bezier(.34,1.56,.64,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 300 + d);
    });
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const WORDS = ["Mohit", "Soni"];

  return (
    <section id="hero" className="hero-section" style={{ minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 56px 60px",position:"relative",zIndex:1,overflow:"hidden" }}>
      {/* Decorative ruled lines */}
      <div style={{ position:"absolute",top:0,right:0,width:"42%",height:"100%",borderLeft:`1px solid ${T.border}`,pointerEvents:"none",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"80px 0" }}>
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ width:"100%",height:"1px",background:`linear-gradient(90deg,${T.border},transparent)` }} />
        ))}
      </div>

      <div style={{ maxWidth:900,position:"relative",zIndex:2 }}>
        {/* Badge */}
        <div ref={badgeRef} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:100,background:T.tealPale,border:`1px solid ${T.teal}44`,marginBottom:36 }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 8px #10b981",flexShrink:0 }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:T.teal,fontWeight:500 }}>Open to opportunities</span>
        </div>

        {/* Title */}
        <h1 className="hero-h1" style={{ fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(64px,10vw,128px)",lineHeight:.88,letterSpacing:"-3px",marginBottom:32 }}>
          {WORDS.map((w,i) => (
            <span key={i} ref={el => wordsRef.current[i] = el} style={{ display:"block",color: i===0 ? T.text : T.amber }}>
              {w}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <div ref={subRef} style={{ display:"flex",alignItems:"center",gap:16,marginBottom:24,flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontStyle:"italic",color:T.muted,fontWeight:400 }}>Software Developer</span>
          <span style={{ width:1,height:20,background:T.border,flexShrink:0 }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.mutedLt,letterSpacing:".04em" }}>Python · AI Agents · APIs · Infra · Django · ODA </span>
        </div>

        {/* Desc */}
        <p ref={descRef} style={{ fontSize:15,color:T.muted,lineHeight:1.85,maxWidth:520,marginBottom:48,fontWeight:400 }}>
          Building intelligent systems at the intersection of AI and backend engineering. Currently shipping production features at{" "}
          <span style={{ color:T.teal,fontWeight:600 }}>Omfys Technology</span> — from conversational AI to real-time performance platforms.
          <span style={{ animation:"blink 1s step-end infinite",color:T.amber }}>_</span>
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="hero-cta" style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:64 }}>
          <button className="btn-amber" onClick={() => go("projects")}>View Projects →</button>
          <a href={CV_LINK} target="_blank" rel="noopener noreferrer" className="btn-teal">↓ Download CV</a>
          <button className="btn-outline" onClick={() => go("contact")}>Get in Touch</button>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="stat-row" style={{ display:"flex",gap:40,flexWrap:"wrap" }}>
          {[["3+","Companies"],["3+","Live Projects"],["5+","Certifications"],["2+","Years Exp"]].map(([n,l]) => (
            <div key={l} style={{ borderLeft:`2px solid ${T.amber}`,paddingLeft:16 }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:T.text,lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.muted,letterSpacing:".12em",textTransform:"uppercase",marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:T.mutedLt }}>scroll</div>
        <div style={{ width:1,height:44,background:`linear-gradient(${T.amber},transparent)` }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════ */
function About() {
  const ref = useReveal(0.1);
  const INFO = [["Name","Mohit Soni"],["Location","Indore, Pune"],["Phone","+91 9753484051"],["Email","mohitsoni11aug2002@gmail.com"],["Degree","B.Tech CSE, SVIT"],["Experience","2+ Years"],["Focus","Python · AI · APIs"],["Status","Open to Work ✓"]];
  return (
    <section id="about" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1 }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">01 / About Me</div>
        <h2 className="reveal sec-h2">The person<br/>behind the code.</h2>
        <div className="about-grid" style={{ display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:60,alignItems:"start" }}>
          {/* Text */}
          <div>
            {[
              "I'm a software developer from Indore, India who thrives at the intersection of AI and practical backend engineering. My work spans conversational AI, agentic automation platforms, and real-time data systems.",
              "I graduated with a B.Tech in CSE from SVIT Indore in 2023 and have grown from a .NET trainee into owning multi-product engineering responsibilities — currently building three simultaneous product lines at Omfys Technology.",
              "I hold OCI certifications in both Data Science and Gen AI and am energized by products where intelligent systems meet real operational problems."
            ].map((t,i) => (
              <p key={i} className="reveal" style={{ fontSize:14,color:T.muted,lineHeight:1.9,marginBottom:18,transitionDelay:`${i*.1}s` }}>{t}</p>
            ))}
            <div className="reveal" style={{ display:"flex",gap:12,marginTop:32,flexWrap:"wrap",transitionDelay:".3s" }}>
              <a href="https://www.linkedin.com/in/mohit-soni-ab96b21b1/" target="_blank" rel="noreferrer" className="btn-teal">LinkedIn ↗</a>
              <a href="mailto:mohitsoni11aug2002@gmail.com" className="btn-outline">Email Me</a>
            </div>
          </div>
          {/* Info card */}
          <div className="reveal glass glass-hover" style={{ borderRadius:20,overflow:"hidden",transitionDelay:".15s" }}>
            {INFO.map(([k,v],i) => (
              <div key={k} style={{ display:"grid",gridTemplateColumns:"1fr 1.5fr",padding:"13px 22px",borderBottom:i<INFO.length-1?`1px solid ${T.border}`:"none",gap:12,alignItems:"center" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".1em",textTransform:"uppercase" }}>{k}</span>
                <span style={{ fontSize:13,color:k==="Status"?T.teal:T.text,fontWeight:k==="Status"?600:400,wordBreak:"break-word" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SKILLS — Unique geometric card design (ORIGINAL)
═══════════════════════════════════════════════ */
function SkillCard({ skill, idx }) {
  const ref = useSingleReveal("reveal", idx * 80);
  const [hovered, setHovered] = useState(false);
  const [filled, setFilled] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setFilled(true), idx * 80 + 400);
    }, { threshold: 0.3 });
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, [idx]);

  const isHex    = skill.shape === "hex";
  const isDiamond= skill.shape === "diamond";
  // const isCircle = skill.shape === "circle";

  const shapeStyle = isHex
    ? { clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }
    : isDiamond
    ? { clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)", borderRadius:0 }
    : { borderRadius:"50%" };

  const circumference = 2 * Math.PI * 38;

  return (
    <div ref={el => { ref.current = el; cardRef.current = el; }}
      className="reveal glass glass-hover"
      style={{ borderRadius:20,padding:"28px 20px",textAlign:"center",position:"relative",overflow:"hidden",cursor:"default",transitionDelay:`${idx*0.07}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent corner */}
      <div style={{ position:"absolute",top:0,right:0,width:60,height:60,background:`linear-gradient(225deg,${skill.bg},transparent)`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:0,right:0,width:0,height:0,borderStyle:"solid",borderWidth:"0 40px 40px 0",borderColor:`transparent ${skill.color}18 transparent transparent`,pointerEvents:"none" }} />

      {/* Circular / Radial progress SVG */}
      <div style={{ position:"relative",width:88,height:88,margin:"0 auto 18px" }}>
        <svg width="88" height="88" style={{ position:"absolute",top:0,left:0,transform:"rotate(-90deg)" }}>
          <circle cx="44" cy="44" r="38" fill="none" stroke={`${skill.color}15`} strokeWidth="5" />
          <circle cx="44" cy="44" r="38" fill="none" stroke={skill.color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={filled ? circumference * (1 - skill.pct/100) : circumference}
            style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>
        {/* Geometric icon shape inside */}
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:52,height:52,...shapeStyle,background:hovered?skill.color:skill.bg,transition:"background .4s,transform .4s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>
          {skill.icon}
        </div>
      </div>

      {/* Name */}
      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text,marginBottom:6,letterSpacing:"-0.3px" }}>{skill.name}</div>

      {/* Percent label */}
      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:skill.color,fontWeight:500,marginBottom:12 }}>{filled?skill.pct:0}%</div>

      {/* Mini bar */}
      <div style={{ height:3,background:`${skill.color}18`,borderRadius:3,overflow:"hidden" }}>
        <div style={{ height:"100%",background:skill.color,borderRadius:3,width:filled?`${skill.pct}%`:"0%",transition:"width 1.4s cubic-bezier(.4,0,.2,1)",transitionDelay:`${idx*.07}s` }} />
      </div>
    </div>
  );
}

function Skills() {
  const ref = useReveal(0.1);
  const [idx, setIdx] = useState(0);
  const autoRef = useRef(null);
  const [VISIBLE, setVISIBLE] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVISIBLE(w < 480 ? 1 : w < 768 ? 2 : w < 1024 ? 3 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const MAX = Math.max(0, SKILLS.length - VISIBLE);

  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setIdx(i => i >= MAX ? 0 : i+1), 3600);
  }, [MAX]);

  useEffect(() => { resetAuto(); return () => clearInterval(autoRef.current); }, [resetAuto]);

  return (
    <section id="skills" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg2 }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">02 / Skills</div>
        <div className="skills-top-row" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,marginBottom:0 }}>
          <h2 className="reveal sec-h2" style={{ marginBottom:0 }}>Tools of<br/>the trade.</h2>
          <div className="reveal" style={{ display:"flex",gap:10,alignItems:"center" }}>
            <button className="carousel-btn" disabled={idx===0} onClick={() => { setIdx(i=>Math.max(0,i-1)); resetAuto(); }}>‹</button>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.muted,minWidth:48,textAlign:"center" }}>{idx+1}/{MAX+1}</span>
            <button className="carousel-btn" disabled={idx>=MAX} onClick={() => { setIdx(i=>Math.min(MAX,i+1)); resetAuto(); }}>›</button>
          </div>
        </div>

        <div style={{ marginTop:48,overflow:"hidden" }}>
          <div style={{ display:"grid",gridTemplateColumns:`repeat(${SKILLS.length},calc(${100/VISIBLE}% - 14px))`,gap:18,transform:`translateX(calc(-${idx * (100/VISIBLE)}%))`,transition:"transform .6s cubic-bezier(.4,0,.2,1)" }}>
            {SKILLS.map((s,i) => <SkillCard key={s.name} skill={s} idx={i} />)}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:32 }}>
          {Array.from({length:MAX+1}).map((_,i) => (
            <button key={i} onClick={() => { setIdx(i); resetAuto(); }} style={{ width:i===idx?24:8,height:8,borderRadius:4,border:"none",cursor:"pointer",background:i===idx?T.amber:`${T.amber}30`,transition:"all .35s" }} />
          ))}
        </div>

        {/* Also worked with */}
        <div className="reveal" style={{ marginTop:56,padding:"24px 32px",borderRadius:16,background:"rgba(255,255,255,0.55)",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".15em",textTransform:"uppercase",flexShrink:0 }}>Also worked with</span>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
            {["Docker","Git","GitHub","Postman","Jupyter","FastAPI","Swagger","Bash","VS Code","Neo4j"].map(t => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EXPERIENCE — center timeline (desktop)
                left timeline (mobile via React state)
═══════════════════════════════════════════════ */
function ExpCard({ item, side, delay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setOn(true), delay); obs.unobserve(ref.current); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="glass" style={{ borderRadius:20,padding:"28px 30px",opacity:on?1:0,transform:on?"translateX(0)":`translateX(${side==="right"?30:-30}px)`,transition:`opacity .7s ${delay}ms ease,transform .7s ${delay}ms cubic-bezier(.34,1.56,.64,1)` }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:T.text,marginBottom:4,letterSpacing:"-0.3px" }}>{item.company}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:item.color,letterSpacing:".04em" }}>{item.role}</div>
        </div>
        <div style={{ textAlign:"right",flexShrink:0 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt }}>{item.period}</div>
          <span style={{ display:"inline-block",marginTop:5,padding:"3px 12px",borderRadius:100,fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:item.color,background:`${item.color}12`,border:`1px solid ${item.color}30`,letterSpacing:".1em" }}>{item.tag}</span>
        </div>
      </div>
      <p style={{ fontSize:13,color:T.muted,lineHeight:1.8,marginBottom:16 }}>{item.desc}</p>
      <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
        {item.tech.map(t => <span key={t} className="chip">{t}</span>)}
      </div>
    </div>
  );
}

function Experience() {
  const lineRef = useRef(null);
  const mobileLineRef = useRef(null);
  const headRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const hObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        headRef.current?.querySelectorAll(".reveal").forEach((el, i) => {
          setTimeout(() => el.classList.add("on"), i * 100);
        });
        hObs.disconnect();
      }
    }, { threshold: 0.2 });
    if (headRef.current) hObs.observe(headRef.current);

    // animate whichever line is active
    const activeLineRef = isMobile ? mobileLineRef : lineRef;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && activeLineRef.current) {
        activeLineRef.current.style.height = "100%";
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    if (activeLineRef.current?.parentElement) obs.observe(activeLineRef.current.parentElement);
    return () => { obs.disconnect(); hObs.disconnect(); };
  }, [isMobile]);

  return (
    <section id="experience" className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1 }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        <div ref={headRef}>
          <div className="reveal sec-label">03 / Experience</div>
          <h2 className="reveal sec-h2">Where I've<br/>built things.</h2>
        </div>

        {/* ── DESKTOP center timeline ── */}
        <div className="exp-desktop" style={{ position:"relative" }}>
          <div style={{ position:"absolute",left:"50%",transform:"translateX(-50%)",top:0,bottom:0,width:2,background:`${T.border}` }}>
            <div ref={lineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {EXP.map((exp,i) => (
            <div key={exp.company} style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:0,marginBottom:48 }}>
              {i%2===0 ? <>
                <div style={{ paddingRight:44 }}><ExpCard item={exp} side="left" delay={i*120} /></div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",zIndex:2,padding:"28px 0" }}>
                  <div className="tl-dot" style={{ color:exp.color,background:exp.color,width:14,height:14,borderRadius:"50%",boxShadow:`0 0 0 4px ${T.bg},0 0 0 6px ${exp.color}` }} />
                </div>
                <div />
              </> : <>
                <div />
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",zIndex:2,padding:"28px 0" }}>
                  <div className="tl-dot" style={{ color:exp.color,background:exp.color,width:14,height:14,borderRadius:"50%",boxShadow:`0 0 0 4px ${T.bg},0 0 0 6px ${exp.color}` }} />
                </div>
                <div style={{ paddingLeft:44 }}><ExpCard item={exp} side="right" delay={i*120} /></div>
              </>}
            </div>
          ))}
        </div>

        {/* ── MOBILE left-side timeline ── */}
        <div className="exp-mobile" style={{ display:"none",position:"relative",paddingLeft:44 }}>
          <div style={{ position:"absolute",left:6,top:0,bottom:0,width:2,background:`${T.border}` }}>
            <div ref={mobileLineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {EXP.map((exp,i) => (
            <div key={exp.company} style={{ position:"relative",marginBottom:28 }}>
              <div style={{ position:"absolute",left:-40,top:28,width:14,height:14,borderRadius:"50%",background:exp.color,boxShadow:`0 0 0 4px ${T.bg},0 0 0 6px ${exp.color}`,zIndex:2,flexShrink:0 }} />
              <ExpCard item={exp} side="right" delay={i*100} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EDUCATION — Left timeline (only B.Tech)
═══════════════════════════════════════════════ */
function EdCard({ ed, delay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setOn(true), delay); obs.unobserve(ref.current); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="glass glass-hover" style={{ borderRadius:18,padding:"22px 26px",opacity:on?1:0,transform:on?"translateX(0)":"translateX(-24px)",transition:`opacity .65s ${delay}ms ease,transform .65s ${delay}ms cubic-bezier(.34,1.56,.64,1)`,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:0,width:3,height:"100%",background:ed.color,borderRadius:"3px 0 0 3px" }} />
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10 }}>
        <div>
          <div style={{ fontSize:22,marginBottom:8 }}>{ed.icon}</div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:4 }}>{ed.degree}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.muted }}>{ed.inst}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,marginBottom:6 }}>{ed.period}</div>
          <span style={{ padding:"3px 12px",borderRadius:100,fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:ed.color,background:`${ed.color}12`,border:`1px solid ${ed.color}30` }}>{ed.grade}</span>
        </div>
      </div>
    </div>
  );
}

function Education() {
  const lineRef = useRef(null);
  const headRef = useRef(null);
  useEffect(() => {
    const hObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        headRef.current?.querySelectorAll(".reveal").forEach((el, i) => {
          setTimeout(() => el.classList.add("on"), i * 100);
        });
        hObs.disconnect();
      }
    }, { threshold: 0.2 });
    if (headRef.current) hObs.observe(headRef.current);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && lineRef.current) { lineRef.current.style.height = "100%"; obs.disconnect(); }
    }, { threshold: 0.05 });
    if (lineRef.current?.parentElement) obs.observe(lineRef.current.parentElement);
    return () => { obs.disconnect(); hObs.disconnect(); };
  }, []);
  return (
    <section id="education" className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg2 }}>
      <div style={{ maxWidth:860,margin:"0 auto" }}>
        <div ref={headRef}>
          <div className="reveal sec-label">04 / Education</div>
          <h2 className="reveal sec-h2">Knowledge<br/>unlocked.</h2>
        </div>
        <div className="edu-tl-wrap" style={{ position:"relative",paddingLeft:56 }}>
          <div style={{ position:"absolute",left:18,top:0,bottom:0,width:2,background:`${T.border}` }}>
            <div ref={lineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {EDU.map((ed,i) => (
            <div key={ed.degree} style={{ position:"relative",marginBottom:24 }}>
              <div className="edu-tl-dot" style={{ position:"absolute",left:-47,top:26,width:14,height:14,borderRadius:"50%",background:ed.color,boxShadow:`0 0 0 4px ${T.bg2},0 0 0 6px ${ed.color}`,zIndex:2 }} />
              <EdCard ed={ed} delay={i*100} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CERTIFICATIONS — New section, same style as Education
═══════════════════════════════════════════════ */
function CertCard({ cert, delay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setOn(true), delay); obs.unobserve(ref.current); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="glass glass-hover" style={{ borderRadius:18,padding:"22px 26px",opacity:on?1:0,transform:on?"translateX(0)":"translateX(-24px)",transition:`opacity .65s ${delay}ms ease,transform .65s ${delay}ms cubic-bezier(.34,1.56,.64,1)`,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:0,width:3,height:"100%",background:cert.color,borderRadius:"3px 0 0 3px" }} />
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10 }}>
        <div>
          <div style={{ fontSize:22,marginBottom:8 }}>{cert.icon}</div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:4 }}>{cert.title}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.muted }}>{cert.inst}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,marginBottom:6 }}>{cert.period}</div>
          <span style={{ padding:"3px 12px",borderRadius:100,fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:cert.color,background:`${cert.color}12`,border:`1px solid ${cert.color}30` }}>{cert.grade}</span>
        </div>
      </div>
      {/* View Certificate link */}
      <div style={{ marginTop:16,paddingTop:14,borderTop:`1px solid ${T.border}` }}>
        <a href={cert.link} target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-flex",alignItems:"center",gap:8,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cert.color,fontWeight:500,letterSpacing:".06em",transition:"gap .25s" }}
          onMouseOver={e => e.currentTarget.style.gap = "14px"}
          onMouseOut={e => e.currentTarget.style.gap = "8px"}
        >
          View Certificate ↗
        </a>
      </div>
    </div>
  );
}

function Certifications() {
  const lineRef = useRef(null);
  const headRef = useRef(null);
  useEffect(() => {
    const hObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        headRef.current?.querySelectorAll(".reveal").forEach((el, i) => {
          setTimeout(() => el.classList.add("on"), i * 100);
        });
        hObs.disconnect();
      }
    }, { threshold: 0.2 });
    if (headRef.current) hObs.observe(headRef.current);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && lineRef.current) { lineRef.current.style.height = "100%"; obs.disconnect(); }
    }, { threshold: 0.05 });
    if (lineRef.current?.parentElement) obs.observe(lineRef.current.parentElement);
    return () => { obs.disconnect(); hObs.disconnect(); };
  }, []);
  return (
    <section id="certifications" className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1 }}>
      <div style={{ maxWidth:860,margin:"0 auto" }}>
        <div ref={headRef}>
          <div className="reveal sec-label">05 / Certifications</div>
          <h2 className="reveal sec-h2">Credentials<br/>earned.</h2>
        </div>
        <div className="cert-tl-wrap" style={{ position:"relative",paddingLeft:56 }}>
          <div style={{ position:"absolute",left:18,top:0,bottom:0,width:2,background:`${T.border}` }}>
            <div ref={lineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {CERTS.map((cert,i) => (
            <div key={cert.title} style={{ position:"relative",marginBottom:24 }}>
              <div className="cert-tl-dot" style={{ position:"absolute",left:-47,top:26,width:14,height:14,borderRadius:"50%",background:cert.color,boxShadow:`0 0 0 4px ${T.bg},0 0 0 6px ${cert.color}`,zIndex:2 }} />
              <CertCard cert={cert} delay={i*120} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════ */
function Projects() {
  const ref = useReveal(0.1);
  return (
    <section id="projects" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg2 }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">06 / Projects</div>
        <h2 className="reveal sec-h2">Things I've<br/>shipped.</h2>
        <div className="proj-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
          {PROJECTS.map((p,i) => (
            <div key={p.title} className="reveal glass glass-hover" style={{ borderRadius:22,padding:32,position:"relative",overflow:"hidden",transitionDelay:`${i*.1}s` }}>
              <div style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,${p.accentBg},rgba(255,252,244,0))`,pointerEvents:"none" }} />
              <div style={{ position:"absolute",top:14,right:16,fontFamily:"'Playfair Display',serif",fontSize:72,fontWeight:900,color:`${p.accent}0a`,lineHeight:1 }}>{p.num}</div>
              <div style={{ position:"relative",zIndex:1 }}>
                <div style={{ width:52,height:52,borderRadius:14,background:p.accentBg,border:`1px solid ${p.accent}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:20 }}>{p.emoji}</div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:4,letterSpacing:"-0.5px" }}>{p.title}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:p.accent,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16 }}>{p.sub}</div>
                <p style={{ fontSize:13,color:T.muted,lineHeight:1.8,marginBottom:20 }}>{p.desc}</p>
                <div style={{ marginBottom:20 }}>
                  {p.highlights.map(h => (
                    <div key={h} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                      <div style={{ width:5,height:5,borderRadius:"50%",background:p.accent,flexShrink:0 }} />
                      <span style={{ fontSize:12,color:T.muted }}>{h}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {p.tech.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TESTIMONIALS — Carousel
═══════════════════════════════════════════════ */
function Testimonials() {
  const ref = useReveal(0.1);
  const [idx, setIdx] = useState(0);
  const autoRef = useRef(null);
  const [cardW, setCardW] = useState(400);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCardW(w <= 480 ? w - 48 : 400);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const GAP = 20;

  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setIdx(i => (i+1) % TESTIMONIALS.length), 4500);
  }, []);
  useEffect(() => { resetAuto(); return () => clearInterval(autoRef.current); }, [resetAuto]);

  const go = dir => { setIdx(i => (i+dir+TESTIMONIALS.length) % TESTIMONIALS.length); resetAuto(); };

  return (
    <section id="testimonials" ref={ref} className="sec-pad-l" style={{ padding:"120px 0 120px 56px",position:"relative",zIndex:1,background:T.bg2,overflow:"hidden" }}>
      <div style={{ maxWidth:1200,marginBottom:52 }}>
        <div className="reveal sec-label">07 / Testimonials</div>
        <div className="test-top-row" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,paddingRight:56 }}>
          <h2 className="reveal sec-h2" style={{ marginBottom:0 }}>What people<br/>say.</h2>
          <div className="reveal" style={{ display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.muted }}>{idx+1} / {TESTIMONIALS.length}</span>
            <button className="carousel-btn" onClick={() => go(-1)}>‹</button>
            <button className="carousel-btn" onClick={() => go(1)}>›</button>
          </div>
        </div>
      </div>

      {/* Sliding track */}
      <div style={{ overflow:"visible" }}>
        <div style={{ display:"flex",gap:GAP,transform:`translateX(-${idx*(cardW+GAP)}px)`,transition:"transform .65s cubic-bezier(.4,0,.2,1)",willChange:"transform" }}>
          {TESTIMONIALS.map((t,i) => (
            <div key={t.name} style={{ width:cardW,flexShrink:0 }}>
              <div className="glass glass-hover" style={{ borderRadius:22,padding:32,height:"100%",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-16,left:14,fontSize:88,opacity:.05,fontFamily:"Georgia,serif",color:t.color,lineHeight:1,fontWeight:700 }}>"</div>
                <div style={{ position:"relative",zIndex:1 }}>
                  <div style={{ fontSize:40,color:t.color,opacity:.3,fontFamily:"Georgia,serif",lineHeight:1,marginBottom:14 }}>"</div>
                  <p style={{ fontFamily:"'Playfair Display',serif",fontSize:15,color:T.text,lineHeight:1.85,marginBottom:28,fontStyle:"italic",fontWeight:400,opacity:.85 }}>{t.text}</p>
                  <div style={{ display:"flex",alignItems:"center",gap:14,paddingTop:20,borderTop:`1px solid ${T.border}` }}>
                    <div style={{ width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#fff",flexShrink:0,boxShadow:`0 4px 16px ${t.color}44` }}>{t.av}</div>
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text }}>{t.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display:"flex",gap:8,marginTop:28 }}>
        {TESTIMONIALS.map((_,i) => (
          <button key={i} onClick={() => { setIdx(i); resetAuto(); }} style={{ width:i===idx?28:8,height:8,borderRadius:4,border:"none",cursor:"pointer",background:i===idx?T.amber:`${T.amber}28`,transition:"all .35s" }} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT — Updated with EmailJS
═══════════════════════════════════════════════ */
function Contact() {
  const ref = useReveal(0.1);
  const formRef = useRef(null);
  const [form, setForm] = useState({ 
    senderName: "",      // Changed to match {{senderName}}
    senderEmail: "",     // Changed to match {{senderEmail}}
    senderSubject: ""    // Changed to match {{senderSubject}}
    // message field removed as your template doesn't have {{senderMessage}}
  });
  const [status, setStatus] = useState({ type: "", message: "" }); // 'success', 'error', 'sending'
  const [isSending, setIsSending] = useState(false);

  const LINKS = [
    { icon:"✉", l:"Email",    v:"mohitsoni11aug2002@gmail.com",     href:"mailto:mohitsoni11aug2002@gmail.com", c:T.teal  },
    { icon:"📞", l:"Phone",   v:"+91 9753484051",                   href:"tel:9753484051",                      c:T.amber },
    { icon:"💼", l:"LinkedIn",v:"mohit-soni-ab96b21b1",              href:"https://www.linkedin.com/in/mohit-soni-ab96b21b1/", c:T.rust },
    { icon:"📍", l:"Location",v:"Pune, Maharashtra, India",     href:null,                                  c:T.teal  },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear status when user starts typing
    if (status.message) setStatus({ type: "", message: "" });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: "sending", message: "Sending message..." });

    try {
      const result = await emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        formRef.current,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      if (result.text === "OK") {
        setStatus({ 
          type: "success", 
          message: "Message sent successfully! I'll get back to you soon." 
        });
        setForm({ senderName: "", senderEmail: "", senderSubject: "" });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setStatus({ type: "", message: "" });
        }, 5000);
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus({ 
        type: "error", 
        message: "Failed to send message. Please try again or email me directly at mohitsoni11aug2002@gmail.com" 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1 }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">08 / Contact</div>
        <h2 className="reveal sec-h2">Let's build<br/>something great.</h2>
        
        {/* Status Message */}
        {status.message && (
          <div className="reveal" style={{
            marginBottom: 24,
            padding: "16px 24px",
            borderRadius: 12,
            background: status.type === "success" ? T.tealPale : 
                       status.type === "error" ? "#FDEEE8" : 
                       "rgba(201,139,46,0.1)",
            border: `1px solid ${
              status.type === "success" ? T.teal : 
              status.type === "error" ? T.rust : 
              T.amber
            }40`,
            color: status.type === "success" ? T.teal : 
                   status.type === "error" ? T.rust : 
                   T.amber,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          }}>
            <span style={{ fontSize: 18 }}>
              {status.type === "success" ? "✓" : 
               status.type === "error" ? "⚠" : 
               "⟳"}
            </span>
            {status.message}
          </div>
        )}

        <div className="contact-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:60 }}>
          {/* Left */}
          <div>
            <p className="reveal" style={{ fontSize:14,color:T.muted,lineHeight:1.9,marginBottom:40 }}>Open to full-time roles, freelance and interesting collaborations. If you're working on something exciting in AI, backend or platform engineering — I'd love to hear about it.</p>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {LINKS.map((lk,i) => {
                const inner = (
                  <>
                    <div style={{ width:42,height:42,borderRadius:12,background:`${lk.c}12`,border:`1px solid ${lk.c}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0 }}>{lk.icon}</div>
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.mutedLt,letterSpacing:".12em",textTransform:"uppercase",marginBottom:2 }}>{lk.l}</div>
                      <div style={{ fontSize:13,color:T.text,wordBreak:"break-all" }}>{lk.v}</div>
                    </div>
                  </>
                );
                const shared = { display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:14,background:"rgba(255,255,255,0.6)",border:`1px solid ${T.border}`,backdropFilter:"blur(8px)",transition:"transform .3s,border-color .3s" };
                return lk.href ? (
                  <a key={lk.l} href={lk.href} target="_blank" rel="noreferrer" className="reveal" style={{ ...shared,textDecoration:"none",transitionDelay:`${i*.08}s` }}
                    onMouseOver={e=>{e.currentTarget.style.transform="translateX(5px)";e.currentTarget.style.borderColor=lk.c+"44";}}
                    onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=T.border;}}
                  >{inner}</a>
                ) : (
                  <div key={lk.l} className="reveal" style={{ ...shared,transitionDelay:`${i*.08}s` }}>{inner}</div>
                );
              })}
            </div>
          </div>
          {/* Form */}
<div className="reveal glass" style={{ borderRadius:24, padding:40, transitionDelay:".15s" }}>
  {status.type === "success" ? (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <div style={{ fontSize:56, marginBottom:20 }}>🎉</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:T.teal, marginBottom:12 }}>Message Sent!</div>
      <p style={{ fontSize:14, color:T.muted }}>I'll get back to you soon. Looking forward to connecting!</p>
    </div>
  ) : (
    <form ref={formRef} onSubmit={sendEmail} style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div className="contact-name-row" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div>
          <label style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.mutedLt, letterSpacing:".12em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Your Name</label>
          <input 
            type="text" 
            name="senderName"
            placeholder="John Doe" 
            required 
            className="form-field" 
            style={{ height: 48 }} // Fixed height for consistency
            value={form.senderName} 
            onChange={handleChange}
            disabled={isSending}
          />
        </div>
        <div>
          <label style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.mutedLt, letterSpacing:".12em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Email Address</label>
          <input 
            type="email" 
            name="senderEmail"
            placeholder="john@example.com" 
            required 
            className="form-field" 
            style={{ height: 48 }} // Fixed height for consistency
            value={form.senderEmail} 
            onChange={handleChange}
            disabled={isSending}
          />
        </div>
      </div>
      
      <div>
  <label style={{ 
    fontFamily:"'JetBrains Mono',monospace",
    fontSize:10,
    color:T.mutedLt,
    letterSpacing:".12em",
    textTransform:"uppercase",
    display:"block",
    marginBottom:10 
  }}>
    Subject
  </label>
  <input 
    type="text" 
    name="senderSubject"
    placeholder="What's this about?" 
    required 
    className="form-field" 
    style={{ 
      height: 100,  // Increased from default to 56px for taller input
      fontSize: 15 // Slightly larger font for better proportion
    }}
    value={form.senderSubject} 
    onChange={handleChange}
    disabled={isSending}
  />
</div>
      
      <button 
        type="submit" 
        className="btn-amber" 
        style={{ 
          alignSelf:"flex-start",
          marginTop: 12, // Increased from 4 to 12 for better spacing
          marginBottom: 8,
          opacity: isSending ? 0.7 : 1,
          cursor: isSending ? "not-allowed" : "pointer",
          height: 48,
          minWidth: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        disabled={isSending}
      >
        {isSending ? (
          <>
            <span style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 8 }}>⟳</span>
            Sending...
          </>
        ) : (
          "Send Message →"
        )}
      </button>
    </form>
  )}
</div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER — Rich with social links
═══════════════════════════════════════════════ */
function SocialIcon({ s }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={s.href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
        border:`1.5px solid ${hov ? s.color : T.border}`,
        background: hov ? `${s.color}10` : "rgba(255,255,255,0.5)",
        color: hov ? s.color : T.muted,
        fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700,
        backdropFilter:"blur(8px)",
        transition:"all .28s cubic-bezier(.34,1.56,.64,1)",
        transform: hov ? "translateY(-3px) scale(1.08)" : "none",
        boxShadow: hov ? `0 8px 20px ${s.color}25` : "none",
        textDecoration:"none", cursor:"pointer",
      }}
      title={s.label}
    >{s.icon}</a>
  );
}

function Footer() {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const year = new Date().getFullYear();
  return (
    <footer style={{ position:"relative",zIndex:1,background:T.bg2,borderTop:`1px solid ${T.border}` }}>
      {/* Top band */}
      <div className="footer-pad" style={{ background:`linear-gradient(135deg,${T.teal}0a,${T.amber}0a)`,borderBottom:`1px solid ${T.border}`,padding:"56px 56px 48px" }}>
        <div className="footer-top-grid" style={{ maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:48,flexWrap:"wrap" }}>

          {/* Brand column */}
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:42,fontWeight:900,color:T.amber,letterSpacing:"-2px",lineHeight:1,marginBottom:16 }}>MS.</div>
            <p style={{ fontSize:14,color:T.muted,lineHeight:1.8,maxWidth:280,marginBottom:28 }}>
              Software Developer from Pune, India. Building intelligent systems with Python, AI, and real-time infrastructure.
            </p>
            {/* Social icons */}
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              {SOCIAL.map(s => <SocialIcon key={s.label} s={s} />)}
              <a href={CV_LINK} target="_blank" rel="noopener noreferrer"
                style={{
                  height:44, padding:"0 18px", borderRadius:12, display:"flex", alignItems:"center", gap:6,
                  border:`1.5px solid ${T.amber}55`, background:T.amberPale, color:T.amber,
                  fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:500, letterSpacing:".08em",
                  textDecoration:"none", cursor:"pointer", transition:"all .28s", whiteSpace:"nowrap",
                }}
                onMouseOver={e=>{e.currentTarget.style.background=T.amber;e.currentTarget.style.color="#fff";e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseOut={e=>{e.currentTarget.style.background=T.amberPale;e.currentTarget.style.color=T.amber;e.currentTarget.style.transform="";}}
              >↓ CV</a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".18em",textTransform:"uppercase",marginBottom:20 }}>Navigate</div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {NAV.map(n => (
                <button key={n} onClick={() => go(n.toLowerCase())} style={{ background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif",fontSize:14,color:T.muted,padding:0,transition:"color .2s,transform .2s",display:"flex",alignItems:"center",gap:8 }}
                  onMouseOver={e=>{e.currentTarget.style.color=T.amber;e.currentTarget.style.transform="translateX(4px)";}}
                  onMouseOut={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.transform="";}}
                >
                  <span style={{ width:16,height:1,background:"currentColor",flexShrink:0,display:"inline-block" }} />
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Contact / CTA */}
          <div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".18em",textTransform:"uppercase",marginBottom:20 }}>Get In Touch</div>
            <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:28 }}>
              {[
                { icon:"✉", label:"mohitsoni11aug2002@gmail.com", href:"mailto:mohitsoni11aug2002@gmail.com" },
                { icon:"📞", label:"+91 9753484051",               href:"tel:9753484051"                    },
                { icon:"📍", label:"Indore , Pune",            href:null                                  },
              ].map(c => c.href ? (
                <a key={c.label} href={c.href} style={{ display:"flex",alignItems:"center",gap:10,color:T.muted,textDecoration:"none",fontSize:13,transition:"color .2s",cursor:"pointer",wordBreak:"break-all" }}
                  onMouseOver={e=>e.currentTarget.style.color=T.amber}
                  onMouseOut={e=>e.currentTarget.style.color=T.muted}
                ><span style={{ fontSize:15,flexShrink:0 }}>{c.icon}</span>{c.label}</a>
              ) : (
                <div key={c.label} style={{ display:"flex",alignItems:"center",gap:10,color:T.muted,fontSize:13 }}><span style={{ fontSize:15 }}>{c.icon}</span>{c.label}</div>
              ))}
            </div>
            <button className="btn-amber" onClick={() => go("contact")} style={{ fontSize:12,padding:"11px 24px" }}>
              Let's Talk →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bot-pad" style={{ padding:"20px 56px" }}>
        <div className="footer-bottom" style={{ maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt }}>
            © {year} Mohit Soni. All rights reserved.
          </span>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:T.teal,boxShadow:`0 0 6px ${T.teal}` }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt }}>
              Open to work · Indore, India
            </span>
          </div>
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt }}>
            Built with React
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    // Inject global CSS
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    // Active section tracker
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    const timer = setTimeout(() => {
      document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
    }, 300);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <div style={{ minHeight:"100vh",background:T.bg,position:"relative" }}>
      <BgOrbs />
      <Cursor />
      <Navbar active={active} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Certifications />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}