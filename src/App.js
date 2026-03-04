import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './config/emailjs';

/* ═══════════════════════════════════════════════
   DESIGN TOKENS — CSS Variables (the key fix!)
   T.xxx reads from CSS custom properties so
   dark mode just swaps :root variables once.
═══════════════════════════════════════════════ */
const T = {
  bg:        "var(--bg)",
  bg2:       "var(--bg2)",
  surface:   "var(--surface)",
  border:    "var(--border)",
  borderHi:  "var(--borderHi)",
  amber:     "var(--amber)",
  amberLt:   "var(--amberLt)",
  amberPale: "var(--amberPale)",
  teal:      "var(--teal)",
  tealLt:    "var(--tealLt)",
  tealPale:  "var(--tealPale)",
  rust:      "var(--rust)",
  slate:     "var(--slate)",
  text:      "var(--text)",
  muted:     "var(--muted)",
  mutedLt:   "var(--mutedLt)",
};

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const NAV = ["About","Skills","Experience","Education","Certifications","Projects","Testimonials","Contact"];

const CV_LINK = "https://drive.google.com/file/d/1-Gxca0HW3q42JEXcrG4KxsIh-wymyiHP/view?usp=drivesdk";

const SOCIAL = [
  { label:"LinkedIn", icon:"in", href:"https://www.linkedin.com/in/mohit-soni-ab96b21b1/", color:"var(--teal)",  ch:"#1A6B5A" },
  { label:"GitHub",   icon:"gh", href:"https://github.com/Mohit-Soni08",                                 color:"var(--slate)", ch:"#2C3A4A" },
  { label:"Email",    icon:"@",  href:"mailto:mohitsoni11aug2002@gmail.com",                  color:"var(--amber)", ch:"#C98B2E" },
  { label:"Phone",    icon:"☎",  href:"tel:9753484051",                                       color:"var(--rust)",  ch:"#B84C2E" },
];

const SKILLS = [
  { name:"Python & Django", icon:"🐍", pct:90, color:"var(--teal)",   colorHex:"#1A6B5A", bg:"var(--tealPale)",   bgHex:"#E0F4EE", shape:"hex"     },
  { name:"Rasa / NLU",      icon:"🤖", pct:84, color:"var(--amber)",  colorHex:"#C98B2E", bg:"var(--amberPale)",  bgHex:"#FFF5DC", shape:"diamond" },
  { name:"Kafka & Redis",   icon:"⚡", pct:78, color:"var(--rust)",   colorHex:"#B84C2E", bg:"var(--rustPale)",   bgHex:"#FDEEE8", shape:"circle"  },
  { name:"REST APIs",       icon:"🔌", pct:88, color:"var(--teal)",   colorHex:"#1A6B5A", bg:"var(--tealPale)",   bgHex:"#E0F4EE", shape:"hex"     },
  { name:"MongoDB / Neo4j", icon:"🗄️", pct:82, color:"var(--amber)",  colorHex:"#C98B2E", bg:"var(--amberPale)",  bgHex:"#FFF5DC", shape:"diamond" },
  { name:"SQL Agents",      icon:"🧠", pct:80, color:"var(--purple)", colorHex:"#5B4FCF", bg:"var(--purplePale)", bgHex:"#EEEAFF", shape:"circle"  },
  { name:".NET / C#",       icon:"💠", pct:65, color:"var(--slate)",  colorHex:"#2C3A4A", bg:"var(--slatePale)",  bgHex:"#E8ECF2", shape:"hex"     },
  { name:"Linux & Infra",   icon:"🐧", pct:74, color:"var(--teal)",   colorHex:"#1A6B5A", bg:"var(--tealPale)",   bgHex:"#E0F4EE", shape:"diamond" },
];

const EXP = [
  {
    company:"Omfys Technology Pvt Ltd", role:"Software Developer",
    period:"April 2025 — Present", tag:"Current", color:"var(--teal)", ch:"#1A6B5A",
    desc:"Building three live product lines simultaneously — HR NOVA (Rasa NLU chatbot), Crest.ai (SQL agents on agentic platform), and AJNA (real-time performance monitoring with Kafka, Redis, MongoDB). Full ownership of API development and Linux services.",
    tech:["Python","Rasa","Kafka","Redis","MongoDB","SQL Agents","Linux","REST APIs"],
  },
  {
    company:"Neno Systems Consulting Services", role:"Trainee Software Developer",
    period:"6 Months", tag:"Trainee", color:"var(--amber)", ch:"#C98B2E",
    desc:"Deployed server project as a .NET developer. Built backend services and implemented UI components using HTML, CSS, and .NET for a production environment used by real clients.",
    tech:[".NET","C#","HTML","CSS","SQL"],
  },
  {
    company:"Signimus Technologies Pvt Ltd", role:"Intern",
    period:"3 Months", tag:"Intern", color:"var(--rust)", ch:"#B84C2E",
    desc:"Contributed to software development and debugging cycles. Hands-on experience in Python, web development, database management and API integration.",
    tech:["Python","Web Dev","Databases","APIs"],
  },
];

const EDU = [
  { degree:"B.Tech — Computer Science Engineering", inst:"SVIT, Indore", period:"2019–2023", icon:"🎓", color:"var(--teal)", ch:"#1A6B5A", grade:"Graduated" },
];

const CERTS = [
  { title:"OCI — Data Science Professional", inst:"Oracle Cloud", period:"2025", icon:"☁️", color:"var(--amber)", ch:"#C98B2E", grade:"Certified", link:"https://drive.google.com/file/d/1mHN2EOZZPiSZquRA0YuPqkh3Ef-k2c5C/view?usp=drive_link" },
  { title:"OCI — Gen AI Professional", inst:"Oracle Cloud", period:"2025", icon:"🤖", color:"var(--rust)", ch:"#B84C2E", grade:"Certified", link:"https://drive.google.com/file/d/1AgdcIbG6PKmsgpPmuc_Pd-eUqYeKsIbH/view?usp=drive_link" },
  { title:"Internship Certificate", inst:"Signimus Technologies, Indore", period:"2022", icon:"📜", color:"var(--teal)", ch:"#1A6B5A", grade:"Certified", link:"https://drive.google.com/file/d/1OMC8Hh0P4ZMTpy507KDmKdyGFDwnO9Up/view?usp=drive_link" },
];

const PROJECTS = [
  {
    num:"01", title:"HR NOVA", sub:"HR Digital Assistant", emoji:"🤖",
    accent:"var(--teal)", accentBg:"var(--tealPale)", accentHex:"#1A6B5A",
    desc:"Intelligent HR assistant powered by Rasa NLU. Handles employee queries, automates leave management, integrates with company APIs and processes natural language requests in real time.",
    highlights:["Custom NLU training pipeline","Domain & story configuration","API-connected action server","Multi-turn conversation flows"],
    tech:["Rasa","Python","NLU","REST APIs","Custom Actions"],
  },
  {
    num:"02", title:"Crest.ai", sub:"Agentic SQL Platform", emoji:"⚡",
    accent:"var(--amber)", accentBg:"var(--amberPale)", accentHex:"#C98B2E",
    desc:"Multi-agent orchestration platform that translates natural language into optimized SQL. Agents coordinate to decompose complex queries and handle multi-step database workflows.",
    highlights:["Natural language → SQL pipeline","Multi-agent coordination","Query optimization layer","Agentic task delegation"],
    tech:["SQL Agents","Python","AI Orchestration","Databases"],
  },
  {
    num:"03", title:"AJNA", sub:"Performance Monitoring", emoji:"📊",
    accent:"var(--rust)", accentBg:"var(--rustPale)", accentHex:"#B84C2E",
    desc:"Real-time office performance monitoring on event-driven infrastructure. Built Kafka pipelines, Redis caching layers, MongoDB storage and comprehensive analytics APIs.",
    highlights:["Real-time Kafka event pipelines","Redis caching strategy","Analytics REST API","Linux service monitoring"],
    tech:["Kafka","Redis","MongoDB","Linux","REST APIs"],
  },
];

const TESTIMONIALS = [
  { name:"Priya Sharma",  role:"Senior Developer, Omfys Technology",  av:"PS", color:"var(--teal)",  ch:"#1A6B5A", text:"Mohit consistently delivers beyond expectations. His ability to absorb Kafka and Rasa while shipping production features is remarkable for his experience level." },
  { name:"Rahul Verma",   role:"Tech Lead, Neno Systems Consulting",   av:"RV", color:"var(--amber)", ch:"#C98B2E", text:"A fast learner with real initiative. He dived into our .NET server project and was contributing meaningful features within the first week. His debugging instincts are sharp." },
  { name:"Anjali Mehra",  role:"Mentor, Signimus Technologies",         av:"AM", color:"var(--rust)",  ch:"#B84C2E", text:"Mohit asks the right questions, isn't afraid to fail fast, and takes full ownership of his work. A genuine pleasure to mentor — we'd hire him again without hesitation." },
  { name:"Vikram Patel",  role:"Project Manager, SVIT Indore",          av:"VP", color:"var(--teal)",  ch:"#1A6B5A", text:"One of the most technically curious students in the batch. His final year project showed engineering depth that genuinely set him apart from his peers." },
  { name:"Neha Joshi",    role:"HR Manager, Omfys Technology",          av:"NJ", color:"var(--amber)", ch:"#C98B2E", text:"The NOVA chatbot Mohit built transformed how our HR team operates. Remarkably accurate, handles edge cases gracefully. He has great product instincts." },
];

/* ═══════════════════════════════════════════════
   GLOBAL CSS — variables + all styles
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

/* ── DAY MODE variables ── */
:root {
  --bg:         #FDFAF4;
  --bg2:        #F7F2E8;
  --surface:    rgba(255,255,255,0.72);
  --border:     rgba(180,140,60,0.18);
  --borderHi:   rgba(180,140,60,0.45);
  --amber:      #C98B2E;
  --amberLt:    #F0C060;
  --amberPale:  #FFF5DC;
  --teal:       #1A6B5A;
  --tealLt:     #2E9E82;
  --tealPale:   #E0F4EE;
  --rust:       #B84C2E;
  --rustPale:   #FDEEE8;
  --slate:      #2C3A4A;
  --slatePale:  #E8ECF2;
  --purple:     #5B4FCF;
  --purplePale: #EEEAFF;
  --text:       #1C1810;
  --muted:      #7A6A52;
  --mutedLt:    #B0A080;
  --glass-bg:   rgba(255,252,244,0.72);
  --glass-border: rgba(180,140,60,0.18);
  --glass-shadow: 0 2px 24px rgba(60,40,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
  --nav-bg:     rgba(253,250,244,0.9);
  --mob-menu-bg:rgba(253,250,244,0.96);
  --card-bg:    rgba(255,255,255,0.6);
  --input-bg:   rgba(255,252,244,0.8);
  --also-bg:    rgba(255,255,255,0.55);
  --dot-outer1: #FDFAF4;
  --dot-outer2: #F7F2E8;
}

/* ── NIGHT MODE variables ── */
body.dark-mode {
  --bg:         #111009;
  --bg2:        #0D0B06;
  --surface:    rgba(30,24,12,0.85);
  --border:     rgba(201,139,46,0.16);
  --borderHi:   rgba(201,139,46,0.38);
  --amber:      #D4962E;
  --amberLt:    #F0C060;
  --amberPale:  rgba(201,139,46,0.12);
  --teal:       #2BB896;
  --tealLt:     #3EC89A;
  --tealPale:   rgba(43,184,150,0.12);
  --rust:       #D4603A;
  --rustPale:   rgba(212,96,58,0.12);
  --slate:      #7A9AB8;
  --slatePale:  rgba(122,154,184,0.12);
  --purple:     #8B7EE8;
  --purplePale: rgba(139,126,232,0.12);
  --text:       #EDE4D4;
  --muted:      #9A8A6E;
  --mutedLt:    #6A5A44;
  --glass-bg:   rgba(28,22,10,0.88);
  --glass-border: rgba(201,139,46,0.16);
  --glass-shadow: 0 2px 32px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.03);
  --nav-bg:     rgba(14,12,6,0.95);
  --mob-menu-bg:rgba(10,8,4,0.97);
  --card-bg:    rgba(28,22,10,0.7);
  --input-bg:   rgba(28,22,10,0.6);
  --also-bg:    rgba(255,255,255,0.03);
  --dot-outer1: #111009;
  --dot-outer2: #0D0B06;
}

*,*::before,*::after { box-sizing:border-box;margin:0;padding:0 }
html { scroll-behavior:smooth;font-size:16px }
body {
  font-family:'Outfit',sans-serif;
  background:var(--bg);
  color:var(--text);
  overflow-x:hidden;
  cursor:none;
  transition:background 0.4s ease, color 0.4s ease;
}
::-webkit-scrollbar { width:3px }
::-webkit-scrollbar-track { background:var(--bg2) }
::-webkit-scrollbar-thumb { background:var(--amber);border-radius:2px }
a { color:inherit;text-decoration:none }
button { font-family:'Outfit',sans-serif;cursor:none }
input,textarea { font-family:'Outfit',sans-serif }
input:focus,textarea:focus { outline:none }
img { max-width:100% }

@keyframes fadeUp   { from{opacity:0;transform:translateY(40px)}  to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn   { from{opacity:0}                             to{opacity:1} }
@keyframes blink    { 0%,100%{opacity:1}50%{opacity:0} }
@keyframes tlGrow   { from{height:0}                              to{height:100%} }
@keyframes spin     { from{transform:rotate(0)}                   to{transform:rotate(360deg)} }
@keyframes orb1     { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(30px,-20px) scale(1.08)} }
@keyframes orb2     { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(-20px,30px) scale(1.05)} }
@keyframes orb3     { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(20px,20px) scale(1.1)} }

/* Reveal animations */
.reveal   { opacity:0;transform:translateY(36px);transition:opacity .75s cubic-bezier(.4,0,.2,1),transform .75s cubic-bezier(.34,1.56,.64,1) }
.reveal.on { opacity:1;transform:translateY(0) }
.reveal-l { opacity:0;transform:translateX(-32px);transition:opacity .7s ease,transform .7s cubic-bezier(.34,1.56,.64,1) }
.reveal-l.on { opacity:1;transform:translateX(0) }
.reveal-r { opacity:0;transform:translateX(32px);transition:opacity .7s ease,transform .7s cubic-bezier(.34,1.56,.64,1) }
.reveal-r.on { opacity:1;transform:translateX(0) }
.reveal-s { opacity:0;transform:scale(0.9);transition:opacity .7s ease,transform .7s cubic-bezier(.34,1.56,.64,1) }
.reveal-s.on { opacity:1;transform:scale(1) }

/* Glass */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
}
.glass-hover { transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease,border-color .3s }
.glass-hover:hover { transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.12)!important;border-color:var(--borderHi)!important }

/* Nav */
.nav-link { position:relative;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);background:none;border:none;padding:6px 0;transition:color .2s;cursor:none;font-family:'Outfit',sans-serif;font-weight:500 }
.nav-link::after { content:'';position:absolute;bottom:0;left:0;width:0;height:1.5px;background:var(--amber);transition:width .3s }
.nav-link:hover,.nav-link.active { color:var(--amber) }
.nav-link:hover::after,.nav-link.active::after { width:100% }

/* Buttons */
.btn-amber { display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:100px;border:none;background:var(--amber);color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;letter-spacing:.04em;box-shadow:0 6px 24px rgba(201,139,46,0.38);transition:all .35s cubic-bezier(.34,1.56,.64,1);cursor:none }
.btn-amber:hover { filter:brightness(0.88);transform:translateY(-2px) scale(1.03);box-shadow:0 12px 36px rgba(201,139,46,0.48) }
.btn-outline { display:inline-flex;align-items:center;gap:8px;padding:12px 26px;border-radius:100px;border:1.5px solid var(--border);background:var(--card-bg);color:var(--teal);font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;letter-spacing:.04em;backdrop-filter:blur(8px);transition:all .3s;cursor:none }
.btn-outline:hover { border-color:var(--teal);background:var(--tealPale);transform:translateY(-2px) }
.btn-teal { display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:100px;border:none;background:var(--teal);color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;letter-spacing:.04em;box-shadow:0 6px 24px rgba(26,107,90,0.38);transition:all .35s cubic-bezier(.34,1.56,.64,1);cursor:none }
.btn-teal:hover { filter:brightness(0.85);transform:translateY(-2px) scale(1.03);box-shadow:0 12px 36px rgba(26,107,90,0.48) }

/* Section */
.sec-label { display:inline-flex;align-items:center;gap:10px;margin-bottom:16px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--amber);font-weight:500 }
.sec-label::before { content:'';width:28px;height:1.5px;background:var(--amber);flex-shrink:0 }
.sec-h2 { font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,62px);font-weight:900;color:var(--text);line-height:1.04;letter-spacing:-1px;margin-bottom:56px;transition:color 0.4s }

/* Chip */
.chip { padding:4px 12px;border-radius:100px;font-size:11px;font-weight:500;font-family:'JetBrains Mono',monospace;border:1px solid var(--border);color:var(--muted);background:var(--card-bg);transition:background 0.4s,border-color 0.4s,color 0.4s }

/* Form */
.form-field { width:100%;padding:14px 18px;border-radius:14px;background:var(--input-bg);border:1.5px solid var(--border);font-family:'Outfit',sans-serif;font-size:14px;color:var(--text);transition:border-color .3s,box-shadow .3s,background 0.4s,color 0.4s;resize:vertical }
.form-field:focus { border-color:var(--amber);box-shadow:0 0 0 4px rgba(201,139,46,0.1) }
.form-field::placeholder { color:var(--mutedLt) }

/* Timeline */
.tl-line { background:linear-gradient(180deg,var(--amber),var(--teal));border-radius:2px;transition:height 2s cubic-bezier(.4,0,.2,1) }
.tl-track { background:var(--border);transition:background 0.4s }

/* Carousel */
.carousel-btn { width:42px;height:42px;border-radius:50%;border:1.5px solid var(--border);background:var(--card-bg);display:flex;align-items:center;justify-content:center;cursor:none;transition:all .3s;flex-shrink:0;backdrop-filter:blur(8px);color:var(--muted) }
.carousel-btn:hover:not(:disabled) { border-color:var(--amber);background:var(--amberPale);transform:scale(1.08) }
.carousel-btn:disabled { opacity:.35 }

/* Mobile menu */
.mob-menu { position:fixed;inset:0;z-index:490;background:var(--mob-menu-bg);backdrop-filter:blur(24px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;transform:translateX(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);overflow-y:auto;padding:80px 20px }
.mob-menu.open { transform:translateX(0) }

/* Theme toggle */
.theme-toggle-btn { width:38px;height:38px;border-radius:50%;border:1.5px solid var(--border);background:var(--card-bg);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.35s cubic-bezier(.34,1.56,.64,1);font-size:17px;backdrop-filter:blur(8px);flex-shrink:0 }
.theme-toggle-btn:hover { border-color:var(--amber);background:var(--amberPale);transform:scale(1.12) rotate(18deg);box-shadow:0 4px 18px rgba(201,139,46,0.35) }

/* ─── RESPONSIVE ─── */
@media(max-width:768px){
  body{cursor:auto}
  button,a{cursor:auto}
  .nav-desktop{display:none!important}
  .nav-mob-btn{display:flex!important}
  .hide-md{display:none!important}
  .hero-section{padding:72px 20px 48px!important}
  .hero-h1{font-size:clamp(52px,13vw,82px)!important}
  .hero-cta{flex-direction:column!important}
  .hero-cta .btn-amber,.hero-cta .btn-teal,.hero-cta .btn-outline{width:100%!important;justify-content:center!important}
  .stat-row{gap:20px!important;flex-wrap:wrap!important}
  .stat-row > div{min-width:calc(50% - 12px)}
  .about-grid{grid-template-columns:1fr!important}
  .sec-pad{padding:80px 20px!important}
  .sec-pad-l{padding:80px 0 80px 20px!important}
  .skills-top-row{flex-direction:column!important;align-items:flex-start!important;gap:16px!important}
  .exp-desktop{display:none!important}
  .exp-mobile{display:block!important}
  .proj-grid{grid-template-columns:1fr!important}
  .cert-tl-wrap{padding-left:40px!important}
  .cert-tl-dot{left:-37px!important}
  .edu-tl-wrap{padding-left:40px!important}
  .edu-tl-dot{left:-37px!important}
  .test-top-row{flex-direction:column!important;align-items:flex-start!important;gap:16px!important}
  .contact-grid{grid-template-columns:1fr!important}
  .contact-name-row{grid-template-columns:1fr!important}
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

function useSingleReveal(delay = 0) {
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
      dot.current && (dot.current.style.transform = `translate(${mx-5}px,${my-5}px)`);
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
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:36,height:36,borderRadius:"50%",border:`1.5px solid var(--amber)`,opacity:0.6,pointerEvents:"none",zIndex:9998,willChange:"transform" }} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
function Navbar({ active, darkMode, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setOpen(false); };
  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:500,height:64,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(16px,4vw,40px)",background:scrolled?"var(--nav-bg)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid var(--border)`:"1px solid transparent",transition:"all .4s" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:T.amber,letterSpacing:"-0.5px",flexShrink:0 }}>MS.</div>
        <div className="nav-desktop" style={{ display:"flex",gap:"clamp(8px,1.5vw,20px)" }}>
          {NAV.map(n => (
            <button key={n} className={`nav-link${active===n.toLowerCase()?" active":""}`} onClick={() => go(n.toLowerCase())}>{n}</button>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
          <button className="theme-toggle-btn" onClick={toggleDark} title={darkMode?"Day Mode":"Night Mode"}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <a href={CV_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline hide-md" style={{ fontSize:12,padding:"8px 18px",gap:6 }}>
            <span>↓</span> Download CV
          </a>
        </div>
        <button className="nav-mob-btn" onClick={() => setOpen(o=>!o)} style={{ display:"none",flexDirection:"column",gap:5,background:"none",border:"none",cursor:"pointer",padding:8,zIndex:510 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display:"block",width:24,height:2,background:T.text,borderRadius:2,transition:"all .3s",transform:open?(i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"scaleX(0)"):"none",opacity:open&&i===1?0:1 }} />
          ))}
        </button>
      </nav>
      <div className={`mob-menu${open?" open":""}`}>
        <button className="theme-toggle-btn" onClick={toggleDark} style={{ fontSize:22,width:52,height:52 }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        {NAV.map((n,i) => (
          <button key={n} onClick={() => go(n.toLowerCase())} style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:T.text,background:"none",border:"none",cursor:"pointer",opacity:0,animation:open?`fadeIn .4s ${i*0.07}s ease forwards`:"none" }}>{n}</button>
        ))}
        <a href={CV_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ marginTop:8 }}>↓ Download CV</a>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   BG ORBS
═══════════════════════════════════════════════ */
function BgOrbs() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
      {[
        { w:600,h:600,t:"-150px",l:"-150px",bg:"radial-gradient(circle,rgba(201,139,46,0.12),transparent 70%)",anim:"orb1 14s ease-in-out infinite" },
        { w:500,h:500,t:"30%",r:"-120px",   bg:"radial-gradient(circle,rgba(26,107,90,0.1),transparent 70%)",  anim:"orb2 17s ease-in-out infinite" },
        { w:400,h:400,b:"-80px",l:"35%",    bg:"radial-gradient(circle,rgba(184,76,46,0.07),transparent 70%)", anim:"orb3 20s ease-in-out infinite" },
      ].map((o,i) => (
        <div key={i} className="bg-orb" style={{ position:"absolute",width:o.w,height:o.h,borderRadius:"50%",background:o.bg,top:o.t,left:o.l,right:o.r,bottom:o.b,animation:o.anim,transition:"opacity 0.4s" }} />
      ))}
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
  const subRef   = useRef(null);
  const descRef  = useRef(null);
  const ctaRef   = useRef(null);
  const statsRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const els = [
      { el:badgeRef.current, d:0 },
      ...wordsRef.current.map((el,i) => ({ el, d:100+i*100 })),
      { el:subRef.current,   d:400 },
      { el:descRef.current,  d:500 },
      { el:ctaRef.current,   d:600 },
      { el:statsRef.current, d:700 },
    ];
    els.forEach(({ el, d }) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      setTimeout(() => {
        el.style.transition = "opacity .8s ease,transform .8s cubic-bezier(.34,1.56,.64,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 300+d);
    });
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <section id="hero" className="hero-section" style={{ minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 56px 60px",position:"relative",zIndex:1,overflow:"hidden" }}>
      {/* Decorative lines */}
      <div style={{ position:"absolute",top:0,right:0,width:"42%",height:"100%",borderLeft:`1px solid var(--border)`,pointerEvents:"none",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"80px 0" }}>
        {[...Array(6)].map((_,i) => <div key={i} style={{ width:"100%",height:"1px",background:`linear-gradient(90deg,var(--border),transparent)` }} />)}
      </div>

      <div style={{ maxWidth:900,position:"relative",zIndex:2 }}>
        {/* Badge */}
        <div ref={badgeRef} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:100,background:T.tealPale,border:`1px solid var(--teal)`,borderColor:"rgba(43,184,150,0.3)",marginBottom:36,transition:"background 0.4s,border-color 0.4s" }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 8px #10b981",flexShrink:0 }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:T.teal,fontWeight:500 }}>Open to opportunities</span>
        </div>

        {/* Title */}
        <h1 className="hero-h1" style={{ fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(64px,10vw,128px)",lineHeight:.88,letterSpacing:"-3px",marginBottom:32 }}>
          {["Mohit","Soni"].map((w,i) => (
            <span key={i} ref={el => wordsRef.current[i]=el} style={{ display:"block",color:i===0?T.text:T.amber,transition:"color 0.4s" }}>{w}</span>
          ))}
        </h1>

        {/* Subtitle */}
        <div ref={subRef} style={{ display:"flex",alignItems:"center",gap:16,marginBottom:24,flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontStyle:"italic",color:T.muted,fontWeight:400,transition:"color 0.4s" }}>Software Developer</span>
          <span style={{ width:1,height:20,background:T.border,flexShrink:0 }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.mutedLt,letterSpacing:".04em",transition:"color 0.4s" }}>Python · AI Agents · APIs · Infra · Django · ODA</span>
        </div>

        {/* Description */}
        <p ref={descRef} style={{ fontSize:15,color:T.muted,lineHeight:1.85,maxWidth:520,marginBottom:48,fontWeight:400,transition:"color 0.4s" }}>
          Building intelligent systems at the intersection of AI and backend engineering. Currently shipping production features at{" "}
          <span style={{ color:T.teal,fontWeight:600,transition:"color 0.4s" }}>Omfys Technology</span> — from conversational AI to real-time performance platforms.
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
            <div key={l} style={{ borderLeft:`2px solid var(--amber)`,paddingLeft:16 }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:T.text,lineHeight:1,transition:"color 0.4s" }}>{n}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.muted,letterSpacing:".12em",textTransform:"uppercase",marginTop:4,transition:"color 0.4s" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:T.mutedLt }}>scroll</div>
        <div style={{ width:1,height:44,background:`linear-gradient(var(--amber),transparent)` }} />
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
    <section id="about" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg,transition:"background 0.4s" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">01 / About Me</div>
        <h2 className="reveal sec-h2">The person<br/>behind the code.</h2>
        <div className="about-grid" style={{ display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:60,alignItems:"start" }}>
          <div>
            {[
              "I'm a software developer from Indore, India who thrives at the intersection of AI and practical backend engineering. My work spans conversational AI, agentic automation platforms, and real-time data systems.",
              "I graduated with a B.Tech in CSE from SVIT Indore in 2023 and have grown from a .NET trainee into owning multi-product engineering responsibilities — currently building three simultaneous product lines at Omfys Technology.",
              "I hold OCI certifications in both Data Science and Gen AI and am energized by products where intelligent systems meet real operational problems."
            ].map((t,i) => (
              <p key={i} className="reveal" style={{ fontSize:14,color:T.muted,lineHeight:1.9,marginBottom:18,transitionDelay:`${i*.1}s`,transition:"color 0.4s" }}>{t}</p>
            ))}
            <div className="reveal" style={{ display:"flex",gap:12,marginTop:32,flexWrap:"wrap",transitionDelay:".3s" }}>
              <a href="https://www.linkedin.com/in/mohit-soni-ab96b21b1/" target="_blank" rel="noreferrer" className="btn-teal">LinkedIn ↗</a>
              <a href="mailto:mohitsoni11aug2002@gmail.com" className="btn-outline">Email Me</a>
            </div>
          </div>
          <div className="reveal glass glass-hover" style={{ borderRadius:20,overflow:"hidden",transitionDelay:".15s" }}>
            {INFO.map(([k,v],i) => (
              <div key={k} style={{ display:"grid",gridTemplateColumns:"1fr 1.5fr",padding:"13px 22px",borderBottom:i<INFO.length-1?`1px solid var(--border)`:"none",gap:12,alignItems:"center",transition:"border-color 0.4s" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".1em",textTransform:"uppercase",transition:"color 0.4s" }}>{k}</span>
                <span style={{ fontSize:13,color:k==="Status"?T.teal:T.text,fontWeight:k==="Status"?600:400,wordBreak:"break-word",transition:"color 0.4s" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SKILL CARD
═══════════════════════════════════════════════ */
function SkillCard({ skill, idx }) {
  const ref = useSingleReveal(idx * 80);
  const [hovered, setHovered] = useState(false);
  const [filled,  setFilled]  = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setFilled(true), idx*80+400);
    }, { threshold:0.3 });
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, [idx]);

  const isHex     = skill.shape === "hex";
  const isDiamond = skill.shape === "diamond";
  const shapeStyle = isHex
    ? { clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }
    : isDiamond
    ? { clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",borderRadius:0 }
    : { borderRadius:"50%" };

  const circumference = 2 * Math.PI * 38;

  return (
    <div ref={el => { ref.current=el; cardRef.current=el; }}
      className="reveal glass glass-hover"
      style={{ borderRadius:20,padding:"28px 20px",textAlign:"center",position:"relative",overflow:"hidden",cursor:"default",transitionDelay:`${idx*0.07}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner accent */}
      <div style={{ position:"absolute",top:0,right:0,width:60,height:60,background:`linear-gradient(225deg,${skill.bgHex}55,transparent)`,pointerEvents:"none",transition:"background 0.4s" }} />
      {/* SVG ring */}
      <div style={{ position:"relative",width:88,height:88,margin:"0 auto 18px",color:skill.colorHex }}>
        <svg width="88" height="88" style={{ position:"absolute",top:0,left:0,transform:"rotate(-90deg)" }}>
          <circle cx="44" cy="44" r="38" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.18" />
          <circle cx="44" cy="44" r="38" fill="none" stroke="currentColor" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={filled ? circumference*(1-skill.pct/100) : circumference}
            style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>
        {/* Icon shape */}
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:`translate(-50%,-50%) scale(${hovered?1.08:1})`,width:52,height:52,...shapeStyle,background:hovered?skill.colorHex:skill.bgHex,transition:"background 0.4s,transform 0.4s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>
          {skill.icon}
        </div>
      </div>
      {/* Name */}
      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text,marginBottom:6,letterSpacing:"-0.3px",transition:"color 0.4s" }}>{skill.name}</div>
      {/* Percent */}
      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:skill.color,fontWeight:500,marginBottom:12,transition:"color 0.4s" }}>{filled?skill.pct:0}%</div>
      {/* Mini bar */}
      <div style={{ height:3,background:`var(--border)`,borderRadius:3,overflow:"hidden" }}>
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
      setVISIBLE(w<480?1:w<768?2:w<1024?3:4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const MAX = Math.max(0, SKILLS.length - VISIBLE);
  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setIdx(i => i>=MAX?0:i+1), 3600);
  }, [MAX]);
  useEffect(() => { resetAuto(); return () => clearInterval(autoRef.current); }, [resetAuto]);

  return (
    <section id="skills" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg2,transition:"background 0.4s" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">02 / Skills</div>
        <div className="skills-top-row" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20 }}>
          <h2 className="reveal sec-h2" style={{ marginBottom:0 }}>Tools of<br/>the trade.</h2>
          <div className="reveal" style={{ display:"flex",gap:10,alignItems:"center" }}>
            <button className="carousel-btn" disabled={idx===0} onClick={() => { setIdx(i=>Math.max(0,i-1)); resetAuto(); }}>‹</button>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.muted,minWidth:48,textAlign:"center" }}>{idx+1}/{MAX+1}</span>
            <button className="carousel-btn" disabled={idx>=MAX} onClick={() => { setIdx(i=>Math.min(MAX,i+1)); resetAuto(); }}>›</button>
          </div>
        </div>
        <div style={{ marginTop:48,overflow:"hidden" }}>
          <div style={{ display:"grid",gridTemplateColumns:`repeat(${SKILLS.length},calc(${100/VISIBLE}% - 14px))`,gap:18,transform:`translateX(calc(-${idx*(100/VISIBLE)}%))`,transition:"transform .6s cubic-bezier(.4,0,.2,1)" }}>
            {SKILLS.map((s,i) => <SkillCard key={s.name} skill={s} idx={i} />)}
          </div>
        </div>
        <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:32 }}>
          {Array.from({length:MAX+1}).map((_,i) => (
            <button key={i} onClick={() => { setIdx(i); resetAuto(); }} style={{ width:i===idx?24:8,height:8,borderRadius:4,border:"none",cursor:"pointer",background:i===idx?"var(--amber)":"var(--border)",transition:"all .35s" }} />
          ))}
        </div>
        <div className="reveal" style={{ marginTop:56,padding:"24px 32px",borderRadius:16,background:T.surface,border:`1px solid var(--border)`,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",transition:"background 0.4s,border-color 0.4s" }}>
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
   EXPERIENCE
═══════════════════════════════════════════════ */
function ExpCard({ item, side, delay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setOn(true), delay); obs.unobserve(ref.current); }
    }, { threshold:0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="glass" style={{ borderRadius:20,padding:"28px 30px",opacity:on?1:0,transform:on?"translateX(0)":`translateX(${side==="right"?30:-30}px)`,transition:`opacity .7s ${delay}ms ease,transform .7s ${delay}ms cubic-bezier(.34,1.56,.64,1)` }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:T.text,marginBottom:4,letterSpacing:"-0.3px",transition:"color 0.4s" }}>{item.company}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:item.color,letterSpacing:".04em",transition:"color 0.4s" }}>{item.role}</div>
        </div>
        <div style={{ textAlign:"right",flexShrink:0 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,transition:"color 0.4s" }}>{item.period}</div>
          <span style={{ display:"inline-block",marginTop:5,padding:"3px 12px",borderRadius:100,fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:item.color,background:`${item.ch}20`,border:`1px solid ${item.ch}50`,letterSpacing:".1em" }}>{item.tag}</span>
        </div>
      </div>
      <p style={{ fontSize:13,color:T.muted,lineHeight:1.8,marginBottom:16,transition:"color 0.4s" }}>{item.desc}</p>
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
        headRef.current?.querySelectorAll(".reveal").forEach((el,i) => setTimeout(() => el.classList.add("on"), i*100));
        hObs.disconnect();
      }
    }, { threshold:0.2 });
    if (headRef.current) hObs.observe(headRef.current);
    const activeRef = isMobile ? mobileLineRef : lineRef;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && activeRef.current) { activeRef.current.style.height="100%"; obs.disconnect(); }
    }, { threshold:0.05 });
    if (activeRef.current?.parentElement) obs.observe(activeRef.current.parentElement);
    return () => { obs.disconnect(); hObs.disconnect(); };
  }, [isMobile]);

  return (
    <section id="experience" className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg,transition:"background 0.4s" }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        <div ref={headRef}>
          <div className="reveal sec-label">03 / Experience</div>
          <h2 className="reveal sec-h2">Where I've<br/>built things.</h2>
        </div>
        {/* Desktop */}
        <div className="exp-desktop" style={{ position:"relative" }}>
          <div className="tl-track" style={{ position:"absolute",left:"50%",transform:"translateX(-50%)",top:0,bottom:0,width:2 }}>
            <div ref={lineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {EXP.map((exp,i) => (
            <div key={exp.company} style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:0,marginBottom:48 }}>
              {i%2===0 ? <>
                <div style={{ paddingRight:44 }}><ExpCard item={exp} side="left" delay={i*120} /></div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",zIndex:2,padding:"28px 0" }}>
                  <div style={{ width:14,height:14,borderRadius:"50%",background:exp.color,boxShadow:`0 0 0 4px var(--dot-outer1),0 0 0 6px ${exp.color}`,transition:"box-shadow 0.4s" }} />
                </div>
                <div />
              </> : <>
                <div />
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",zIndex:2,padding:"28px 0" }}>
                  <div style={{ width:14,height:14,borderRadius:"50%",background:exp.color,boxShadow:`0 0 0 4px var(--dot-outer1),0 0 0 6px ${exp.color}`,transition:"box-shadow 0.4s" }} />
                </div>
                <div style={{ paddingLeft:44 }}><ExpCard item={exp} side="right" delay={i*120} /></div>
              </>}
            </div>
          ))}
        </div>
        {/* Mobile */}
        <div className="exp-mobile" style={{ display:"none",position:"relative",paddingLeft:44 }}>
          <div className="tl-track" style={{ position:"absolute",left:6,top:0,bottom:0,width:2 }}>
            <div ref={mobileLineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {EXP.map((exp,i) => (
            <div key={exp.company} style={{ position:"relative",marginBottom:28 }}>
              <div style={{ position:"absolute",left:-40,top:28,width:14,height:14,borderRadius:"50%",background:exp.color,boxShadow:`0 0 0 4px var(--dot-outer1),0 0 0 6px ${exp.color}`,zIndex:2,transition:"box-shadow 0.4s" }} />
              <ExpCard item={exp} side="right" delay={i*100} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EDUCATION
═══════════════════════════════════════════════ */
function EdCard({ ed, delay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setOn(true), delay); obs.unobserve(ref.current); }
    }, { threshold:0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="glass glass-hover" style={{ borderRadius:18,padding:"22px 26px",opacity:on?1:0,transform:on?"translateX(0)":"translateX(-24px)",transition:`opacity .65s ${delay}ms ease,transform .65s ${delay}ms cubic-bezier(.34,1.56,.64,1)`,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:0,width:3,height:"100%",background:ed.color,borderRadius:"3px 0 0 3px" }} />
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10 }}>
        <div>
          <div style={{ fontSize:22,marginBottom:8 }}>{ed.icon}</div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:4,transition:"color 0.4s" }}>{ed.degree}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.muted,transition:"color 0.4s" }}>{ed.inst}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,marginBottom:6,transition:"color 0.4s" }}>{ed.period}</div>
          <span style={{ padding:"3px 12px",borderRadius:100,fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:ed.color,background:`${ed.ch}20`,border:`1px solid ${ed.ch}50` }}>{ed.grade}</span>
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
      if (e.isIntersecting) { headRef.current?.querySelectorAll(".reveal").forEach((el,i) => setTimeout(() => el.classList.add("on"),i*100)); hObs.disconnect(); }
    }, { threshold:0.2 });
    if (headRef.current) hObs.observe(headRef.current);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && lineRef.current) { lineRef.current.style.height="100%"; obs.disconnect(); }
    }, { threshold:0.05 });
    if (lineRef.current?.parentElement) obs.observe(lineRef.current.parentElement);
    return () => { obs.disconnect(); hObs.disconnect(); };
  }, []);
  return (
    <section id="education" className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg2,transition:"background 0.4s" }}>
      <div style={{ maxWidth:860,margin:"0 auto" }}>
        <div ref={headRef}>
          <div className="reveal sec-label">04 / Education</div>
          <h2 className="reveal sec-h2">Knowledge<br/>unlocked.</h2>
        </div>
        <div className="edu-tl-wrap" style={{ position:"relative",paddingLeft:56 }}>
          <div className="tl-track" style={{ position:"absolute",left:18,top:0,bottom:0,width:2 }}>
            <div ref={lineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {EDU.map((ed,i) => (
            <div key={ed.degree} style={{ position:"relative",marginBottom:24 }}>
              <div className="edu-tl-dot" style={{ position:"absolute",left:-47,top:26,width:14,height:14,borderRadius:"50%",background:ed.color,boxShadow:`0 0 0 4px var(--dot-outer2),0 0 0 6px ${ed.color}`,zIndex:2,transition:"box-shadow 0.4s" }} />
              <EdCard ed={ed} delay={i*100} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CERTIFICATIONS
═══════════════════════════════════════════════ */
function CertCard({ cert, delay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setOn(true), delay); obs.unobserve(ref.current); }
    }, { threshold:0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="glass glass-hover" style={{ borderRadius:18,padding:"22px 26px",opacity:on?1:0,transform:on?"translateX(0)":"translateX(-24px)",transition:`opacity .65s ${delay}ms ease,transform .65s ${delay}ms cubic-bezier(.34,1.56,.64,1)`,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:0,width:3,height:"100%",background:cert.color,borderRadius:"3px 0 0 3px" }} />
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10 }}>
        <div>
          <div style={{ fontSize:22,marginBottom:8 }}>{cert.icon}</div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:4,transition:"color 0.4s" }}>{cert.title}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.muted,transition:"color 0.4s" }}>{cert.inst}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,marginBottom:6,transition:"color 0.4s" }}>{cert.period}</div>
          <span style={{ padding:"3px 12px",borderRadius:100,fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:cert.color,background:`${cert.ch}20`,border:`1px solid ${cert.ch}50` }}>{cert.grade}</span>
        </div>
      </div>
      <div style={{ marginTop:16,paddingTop:14,borderTop:`1px solid var(--border)`,transition:"border-color 0.4s" }}>
        <a href={cert.link} target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-flex",alignItems:"center",gap:8,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cert.color,fontWeight:500,letterSpacing:".06em",transition:"gap .25s" }}
          onMouseOver={e=>e.currentTarget.style.gap="14px"}
          onMouseOut={e=>e.currentTarget.style.gap="8px"}
        >View Certificate ↗</a>
      </div>
    </div>
  );
}

function Certifications() {
  const lineRef = useRef(null);
  const headRef = useRef(null);
  useEffect(() => {
    const hObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { headRef.current?.querySelectorAll(".reveal").forEach((el,i) => setTimeout(() => el.classList.add("on"),i*100)); hObs.disconnect(); }
    }, { threshold:0.2 });
    if (headRef.current) hObs.observe(headRef.current);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && lineRef.current) { lineRef.current.style.height="100%"; obs.disconnect(); }
    }, { threshold:0.05 });
    if (lineRef.current?.parentElement) obs.observe(lineRef.current.parentElement);
    return () => { obs.disconnect(); hObs.disconnect(); };
  }, []);
  return (
    <section id="certifications" className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg,transition:"background 0.4s" }}>
      <div style={{ maxWidth:860,margin:"0 auto" }}>
        <div ref={headRef}>
          <div className="reveal sec-label">05 / Certifications</div>
          <h2 className="reveal sec-h2">Credentials<br/>earned.</h2>
        </div>
        <div className="cert-tl-wrap" style={{ position:"relative",paddingLeft:56 }}>
          <div className="tl-track" style={{ position:"absolute",left:18,top:0,bottom:0,width:2 }}>
            <div ref={lineRef} className="tl-line" style={{ height:0,position:"absolute",top:0,left:0,right:0 }} />
          </div>
          {CERTS.map((cert,i) => (
            <div key={cert.title} style={{ position:"relative",marginBottom:24 }}>
              <div className="cert-tl-dot" style={{ position:"absolute",left:-47,top:26,width:14,height:14,borderRadius:"50%",background:cert.color,boxShadow:`0 0 0 4px var(--dot-outer1),0 0 0 6px ${cert.color}`,zIndex:2,transition:"box-shadow 0.4s" }} />
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
    <section id="projects" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg2,transition:"background 0.4s" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">06 / Projects</div>
        <h2 className="reveal sec-h2">Things I've<br/>shipped.</h2>
        <div className="proj-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
          {PROJECTS.map((p,i) => (
            <div key={p.title} className="reveal glass glass-hover" style={{ borderRadius:22,padding:32,position:"relative",overflow:"hidden",transitionDelay:`${i*.1}s` }}>
              <div style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,${p.accentBg},transparent)`,pointerEvents:"none",opacity:0.6,transition:"opacity 0.4s" }} />
              <div style={{ position:"absolute",top:14,right:16,fontFamily:"'Playfair Display',serif",fontSize:72,fontWeight:900,color:p.accent,lineHeight:1,opacity:0.06 }}>{p.num}</div>
              <div style={{ position:"relative",zIndex:1 }}>
                <div style={{ width:52,height:52,borderRadius:14,background:p.accentBg,border:`1px solid`,borderColor:`${p.accentHex}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:20,transition:"background 0.4s" }}>{p.emoji}</div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:4,letterSpacing:"-0.5px",transition:"color 0.4s" }}>{p.title}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:p.accent,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16,transition:"color 0.4s" }}>{p.sub}</div>
                <p style={{ fontSize:13,color:T.muted,lineHeight:1.8,marginBottom:20,transition:"color 0.4s" }}>{p.desc}</p>
                <div style={{ marginBottom:20 }}>
                  {p.highlights.map(h => (
                    <div key={h} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                      <div style={{ width:5,height:5,borderRadius:"50%",background:p.accent,flexShrink:0 }} />
                      <span style={{ fontSize:12,color:T.muted,transition:"color 0.4s" }}>{h}</span>
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
   TESTIMONIALS
═══════════════════════════════════════════════ */
function Testimonials() {
  const ref = useReveal(0.1);
  const [idx, setIdx] = useState(0);
  const autoRef = useRef(null);
  const [cardW, setCardW] = useState(400);

  useEffect(() => {
    const update = () => setCardW(window.innerWidth<=480?window.innerWidth-48:400);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const GAP = 20;
  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setIdx(i=>(i+1)%TESTIMONIALS.length), 4500);
  }, []);
  useEffect(() => { resetAuto(); return () => clearInterval(autoRef.current); }, [resetAuto]);
  const go = dir => { setIdx(i=>(i+dir+TESTIMONIALS.length)%TESTIMONIALS.length); resetAuto(); };

  return (
    <section id="testimonials" ref={ref} className="sec-pad-l" style={{ padding:"120px 0 120px 56px",position:"relative",zIndex:1,background:T.bg2,overflow:"hidden",transition:"background 0.4s" }}>
      <div style={{ maxWidth:1200,marginBottom:52 }}>
        <div className="reveal sec-label">07 / Testimonials</div>
        <div className="test-top-row" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,paddingRight:56 }}>
          <h2 className="reveal sec-h2" style={{ marginBottom:0 }}>What people<br/>say.</h2>
          <div className="reveal" style={{ display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.muted,transition:"color 0.4s" }}>{idx+1} / {TESTIMONIALS.length}</span>
            <button className="carousel-btn" onClick={() => go(-1)}>‹</button>
            <button className="carousel-btn" onClick={() => go(1)}>›</button>
          </div>
        </div>
      </div>
      <div style={{ overflow:"visible" }}>
        <div style={{ display:"flex",gap:GAP,transform:`translateX(-${idx*(cardW+GAP)}px)`,transition:"transform .65s cubic-bezier(.4,0,.2,1)",willChange:"transform" }}>
          {TESTIMONIALS.map((t,i) => (
            <div key={t.name} style={{ width:cardW,flexShrink:0 }}>
              <div className="glass glass-hover" style={{ borderRadius:22,padding:32,height:"100%",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-16,left:14,fontSize:88,opacity:.06,fontFamily:"Georgia,serif",color:t.color,lineHeight:1,fontWeight:700 }}>"</div>
                <div style={{ position:"relative",zIndex:1 }}>
                  <div style={{ fontSize:40,color:t.color,opacity:.4,fontFamily:"Georgia,serif",lineHeight:1,marginBottom:14,transition:"color 0.4s" }}>"</div>
                  <p style={{ fontFamily:"'Playfair Display',serif",fontSize:15,color:T.text,lineHeight:1.85,marginBottom:28,fontStyle:"italic",fontWeight:400,transition:"color 0.4s" }}>{t.text}</p>
                  <div style={{ display:"flex",alignItems:"center",gap:14,paddingTop:20,borderTop:`1px solid var(--border)`,transition:"border-color 0.4s" }}>
                    <div style={{ width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${t.ch},${t.ch}cc)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#fff",flexShrink:0,boxShadow:`0 4px 16px ${t.ch}70` }}>{t.av}</div>
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text,transition:"color 0.4s" }}>{t.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,transition:"color 0.4s" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex",gap:8,marginTop:28 }}>
        {TESTIMONIALS.map((_,i) => (
          <button key={i} onClick={() => { setIdx(i); resetAuto(); }} style={{ width:i===idx?28:8,height:8,borderRadius:4,border:"none",cursor:"pointer",background:i===idx?"var(--amber)":"var(--border)",transition:"all .35s" }} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════ */
function Contact() {
  const ref = useReveal(0.1);
  const formRef = useRef(null);
  const [form, setForm] = useState({ senderName:"", senderEmail:"", senderSubject:"" });
  const [status, setStatus] = useState({ type:"", message:"" });
  const [isSending, setIsSending] = useState(false);

  const LINKS = [
    { icon:"✉", l:"Email",    v:"mohitsoni11aug2002@gmail.com", href:"mailto:mohitsoni11aug2002@gmail.com", c:"var(--teal)",  cHex:"#1A6B5A" },
    { icon:"📞", l:"Phone",   v:"+91 9753484051",               href:"tel:9753484051",                      c:"var(--amber)", cHex:"#C98B2E" },
    { icon:"💼", l:"LinkedIn",v:"mohit-soni-ab96b21b1",          href:"https://www.linkedin.com/in/mohit-soni-ab96b21b1/", c:"var(--rust)", cHex:"#B84C2E" },
    { icon:"📍", l:"Location",v:"Pune, Maharashtra, India",      href:null,                                  c:"var(--teal)",  cHex:"#1A6B5A" },
  ];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]:e.target.value });
    if (status.message) setStatus({ type:"", message:"" });
  };

  const sendEmail = async e => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type:"sending", message:"Sending message..." });
    try {
      const result = await emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, formRef.current, EMAILJS_CONFIG.PUBLIC_KEY);
      if (result.text === "OK") {
        setStatus({ type:"success", message:"Message sent successfully! I'll get back to you soon." });
        setForm({ senderName:"", senderEmail:"", senderSubject:"" });
        setTimeout(() => setStatus({ type:"", message:"" }), 5000);
      }
    } catch (error) {
      setStatus({ type:"error", message:"Failed to send message. Please try again or email me directly at mohitsoni11aug2002@gmail.com" });
    } finally {
      setIsSending(false);
    }
  };

  const statusColors = {
    success: { bg:"var(--tealPale)",  border:"var(--teal)",  color:"var(--teal)"  },
    error:   { bg:"var(--rustPale)",  border:"var(--rust)",  color:"var(--rust)"  },
    sending: { bg:"var(--amberPale)", border:"var(--amber)", color:"var(--amber)" },
  };
  const sc = statusColors[status.type] || {};

  return (
    <section id="contact" ref={ref} className="sec-pad" style={{ padding:"120px 56px",position:"relative",zIndex:1,background:T.bg,transition:"background 0.4s" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div className="reveal sec-label">08 / Contact</div>
        <h2 className="reveal sec-h2">Let's build<br/>something great.</h2>
        {status.message && (
          <div style={{ marginBottom:24,padding:"16px 24px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.border}`,color:sc.color,display:"flex",alignItems:"center",gap:12,fontFamily:"'JetBrains Mono',monospace",fontSize:13,transition:"all 0.4s" }}>
            <span style={{ fontSize:18 }}>{status.type==="success"?"✓":status.type==="error"?"⚠":"⟳"}</span>
            {status.message}
          </div>
        )}
        <div className="contact-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:60 }}>
          <div>
            <p className="reveal" style={{ fontSize:14,color:T.muted,lineHeight:1.9,marginBottom:40,transition:"color 0.4s" }}>Open to full-time roles, freelance and interesting collaborations. If you're working on something exciting in AI, backend or platform engineering — I'd love to hear about it.</p>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {LINKS.map((lk,i) => {
                const inner = (
                  <>
                    <div style={{ width:42,height:42,borderRadius:12,background:`${lk.cHex}18`,border:`1px solid ${lk.cHex}38`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0 }}>{lk.icon}</div>
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.mutedLt,letterSpacing:".12em",textTransform:"uppercase",marginBottom:2,transition:"color 0.4s" }}>{lk.l}</div>
                      <div style={{ fontSize:13,color:T.text,wordBreak:"break-all",transition:"color 0.4s" }}>{lk.v}</div>
                    </div>
                  </>
                );
                const shared = { display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:14,background:T.surface,border:`1px solid var(--border)`,backdropFilter:"blur(8px)",transition:"transform .3s,border-color .3s,background 0.4s" };
                return lk.href ? (
                  <a key={lk.l} href={lk.href} target="_blank" rel="noreferrer" className="reveal" style={{ ...shared,textDecoration:"none",transitionDelay:`${i*.08}s` }}
                    onMouseOver={e=>{e.currentTarget.style.transform="translateX(5px)";e.currentTarget.style.borderColor=lk.c;}}
                    onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor="var(--border)";}}
                  >{inner}</a>
                ) : (
                  <div key={lk.l} className="reveal" style={{ ...shared,transitionDelay:`${i*.08}s` }}>{inner}</div>
                );
              })}
            </div>
          </div>
          <div className="reveal glass" style={{ borderRadius:24,padding:40,transitionDelay:".15s" }}>
            {status.type==="success" ? (
              <div style={{ textAlign:"center",padding:"60px 0" }}>
                <div style={{ fontSize:56,marginBottom:20 }}>🎉</div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:T.teal,marginBottom:12,transition:"color 0.4s" }}>Message Sent!</div>
                <p style={{ fontSize:14,color:T.muted,transition:"color 0.4s" }}>I'll get back to you soon. Looking forward to connecting!</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={sendEmail} style={{ display:"flex",flexDirection:"column",gap:24 }}>
                <div className="contact-name-row" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
                  {[["senderName","Your Name","Name","text"],["senderEmail","Email Address","Email","email"]].map(([name,label,ph,type]) => (
                    <div key={name}>
                      <label style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".12em",textTransform:"uppercase",display:"block",marginBottom:8,transition:"color 0.4s" }}>{label}</label>
                      <input type={type} name={name} placeholder={ph} required className="form-field" style={{ height:48 }} value={form[name]} onChange={handleChange} disabled={isSending} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".12em",textTransform:"uppercase",display:"block",marginBottom:10,transition:"color 0.4s" }}>Subject</label>
                  <input type="text" name="senderSubject" placeholder="What's this about?" required className="form-field" style={{ height:100,fontSize:15 }} value={form.senderSubject} onChange={handleChange} disabled={isSending} />
                </div>
                <button type="submit" className="btn-amber" style={{ alignSelf:"flex-start",marginTop:12,marginBottom:8,opacity:isSending?0.7:1,height:48,minWidth:160,display:"flex",alignItems:"center",justifyContent:"center" }} disabled={isSending}>
                  {isSending ? <><span style={{ animation:"spin 1s linear infinite",display:"inline-block",marginRight:8 }}>⟳</span>Sending...</> : "Send Message →"}
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
   FOOTER
═══════════════════════════════════════════════ */
function SocialIcon({ s }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={s.href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${hov?s.color:"var(--border)"}`,background:hov?`${s.ch}20`:T.surface,color:hov?s.color:T.muted,fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,backdropFilter:"blur(8px)",transition:"all .28s cubic-bezier(.34,1.56,.64,1)",transform:hov?"translateY(-3px) scale(1.08)":"none",boxShadow:hov?`0 8px 20px ${s.ch}40`:"none",textDecoration:"none",cursor:"pointer" }}
      title={s.label}
    >{s.icon}</a>
  );
}

function Footer() {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const year = new Date().getFullYear();
  return (
    <footer style={{ position:"relative",zIndex:1,background:T.bg2,borderTop:`1px solid var(--border)`,transition:"background 0.4s,border-color 0.4s" }}>
      <div className="footer-pad" style={{ borderBottom:`1px solid var(--border)`,padding:"56px 56px 48px",transition:"border-color 0.4s" }}>
        <div className="footer-top-grid" style={{ maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:48 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:42,fontWeight:900,color:T.amber,letterSpacing:"-2px",lineHeight:1,marginBottom:16,transition:"color 0.4s" }}>MS.</div>
            <p style={{ fontSize:14,color:T.muted,lineHeight:1.8,maxWidth:280,marginBottom:28,transition:"color 0.4s" }}>
              Software Developer from Pune, India. Building intelligent systems with Python, AI, and real-time infrastructure.
            </p>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              {SOCIAL.map(s => <SocialIcon key={s.label} s={s} />)}
              <a href={CV_LINK} target="_blank" rel="noopener noreferrer"
                style={{ height:44,padding:"0 18px",borderRadius:12,display:"flex",alignItems:"center",gap:6,border:`1.5px solid var(--amber)`,borderColor:"rgba(201,139,46,0.35)",background:T.amberPale,color:T.amber,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:500,letterSpacing:".08em",textDecoration:"none",cursor:"pointer",transition:"all .28s",whiteSpace:"nowrap" }}
                onMouseOver={e=>{e.currentTarget.style.background="var(--amber)";e.currentTarget.style.color="#fff";e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseOut={e=>{e.currentTarget.style.background="var(--amberPale)";e.currentTarget.style.color="var(--amber)";e.currentTarget.style.transform="";}}
              >↓ CV</a>
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".18em",textTransform:"uppercase",marginBottom:20,transition:"color 0.4s" }}>Navigate</div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {NAV.map(n => (
                <button key={n} onClick={() => go(n.toLowerCase())} style={{ background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif",fontSize:14,color:T.muted,padding:0,transition:"color .2s,transform .2s",display:"flex",alignItems:"center",gap:8 }}
                  onMouseOver={e=>{e.currentTarget.style.color="var(--amber)";e.currentTarget.style.transform="translateX(4px)";}}
                  onMouseOut={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.transform="";}}
                >
                  <span style={{ width:16,height:1,background:"currentColor",flexShrink:0,display:"inline-block" }} />{n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.mutedLt,letterSpacing:".18em",textTransform:"uppercase",marginBottom:20,transition:"color 0.4s" }}>Get In Touch</div>
            <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:28 }}>
              {[
                { icon:"✉", label:"mohitsoni11aug2002@gmail.com", href:"mailto:mohitsoni11aug2002@gmail.com" },
                { icon:"📞", label:"+91 9753484051",               href:"tel:9753484051" },
                { icon:"📍", label:"Indore, Pune",                 href:null },
              ].map(c => c.href ? (
                <a key={c.label} href={c.href} style={{ display:"flex",alignItems:"center",gap:10,color:T.muted,textDecoration:"none",fontSize:13,transition:"color .2s",cursor:"pointer",wordBreak:"break-all" }}
                  onMouseOver={e=>e.currentTarget.style.color="var(--amber)"}
                  onMouseOut={e=>e.currentTarget.style.color="var(--muted)"}
                ><span style={{ fontSize:15,flexShrink:0 }}>{c.icon}</span>{c.label}</a>
              ) : (
                <div key={c.label} style={{ display:"flex",alignItems:"center",gap:10,color:T.muted,fontSize:13,transition:"color 0.4s" }}><span style={{ fontSize:15 }}>{c.icon}</span>{c.label}</div>
              ))}
            </div>
            <button className="btn-amber" onClick={() => go("contact")} style={{ fontSize:12,padding:"11px 24px" }}>Let's Talk →</button>
          </div>
        </div>
      </div>
      <div className="footer-bot-pad" style={{ padding:"20px 56px" }}>
        <div className="footer-bottom" style={{ maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,transition:"color 0.4s" }}>© {year} Mohit Soni. All rights reserved.</span>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"var(--teal)",boxShadow:"0 0 6px var(--teal)",transition:"background 0.4s,box-shadow 0.4s" }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,transition:"color 0.4s" }}>Open to work · Indore, India</span>
          </div>
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.mutedLt,transition:"color 0.4s" }}>Built with React</span>
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold:0.4 });
    const timer = setTimeout(() => {
      document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
    }, 300);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, []);

  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      return next;
    });
  }, []);

  return (
    <div style={{ minHeight:"100vh",background:T.bg,position:"relative",transition:"background 0.4s" }}>
      <BgOrbs />
      <Cursor />
      <Navbar active={active} darkMode={darkMode} toggleDark={toggleDark} />
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