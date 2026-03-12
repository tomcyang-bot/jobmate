import { useState, useRef } from "react";

// ─── CONFIG ──────────────────────────────────────────────
const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? "Good morning" : HOUR < 17 ? "Good afternoon" : "Good evening";
const TODAY_STR = new Date().toLocaleDateString("en-AU", { weekday:"long", day:"numeric", month:"short" });
const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
const uid = () => Date.now() + Math.floor(Math.random() * 1000);

const INDUSTRIES: any = {
  elec:    { name:"Electrician",   icon:"⚡", color:"#facc15",
    jobTypes:["Fault Finding","Switchboard Upgrade","Solar Install","New Installation","Rewire","Safety Inspection","EV Charger","Powerpoint Install"],
    billing:["Hourly","Per Job","Callout + Materials"], rate:95 },
  plumber: { name:"Plumber",       icon:"🔧", color:"#38bdf8",
    jobTypes:["Blocked Drain","Burst Pipe","Hot Water System","Gas Fitting","Bathroom Reno","Leak Detection","New Tapware","Sewer Inspection"],
    billing:["Callout + Materials","Hourly","Per Job"], rate:110 },
  handyman:{ name:"Handyman",      icon:"🔨", color:"#a78bfa",
    jobTypes:["Flat Pack Assembly","Fence Repair","Painting","Gutter Clean","Tiling","General Repairs","TV Wall Mount","Pressure Washing"],
    billing:["Hourly","Per Job","Half Day","Full Day"], rate:65 },
  windows: { name:"Door & Window", icon:"🪟", color:"#34d399",
    jobTypes:["Window Install","Door Install","Security Screen","Bifold Door","Flyscreen Repair","Double Glazing","Roller Shutter","Window Lock"],
    billing:["Per Job","Supply & Install","Labour Only"], rate:90 },
  cleaning:{ name:"Cleaning",      icon:"🧹", color:"#fb7185",
    jobTypes:["Regular Clean","End of Lease","Office Clean","Spring Clean","Carpet Steam","After Builder","Move In/Out","Window Clean"],
    billing:["Per Job","Hourly","Weekly","Fortnightly"], rate:45 },
  other:   { name:"Other Trade",   icon:"🛠️", color:"#94a3b8",
    jobTypes:["Installation","Repair","Maintenance","Inspection","Supply & Install","Labour Only","Project Work","Consultation"],
    billing:["Hourly","Per Job","Day Rate","Supply & Install"], rate:75 },
};

// ─── SEED DATA ───────────────────────────────────────────
const SEED_CUSTOMERS = [
  { id:1, name:"Zhang Wei",      phone:"0412 345 678", address:"12 Rose St, Parramatta",   notes:"Has a dog, side gate open" },
  { id:2, name:"Mike Johnson",   phone:"0423 456 789", address:"55 Oak Ave, Strathfield",  notes:"Key under mat" },
  { id:3, name:"Sarah Williams", phone:"0434 567 890", address:"8 Park Rd, Burwood",       notes:"Prefers morning bookings" },
  { id:4, name:"Wang Fang",      phone:"0445 678 901", address:"3 Elm St, Chatswood",      notes:"Invoice to wangfang@email.com" },
  { id:5, name:"Dave Brown",     phone:"0456 789 012", address:"100 George St, Sydney CBD",notes:"Commercial – need ABN invoice" },
];

const mkJobs = (ind: any) => [
  { id:1, customerId:1, customerName:"Zhang Wei",     address:"12 Rose St, Parramatta",   jobType:ind.jobTypes[1], date:"Today", time:"8:00 AM",  hours:3, rate:ind.rate, labour:ind.rate*3, materials:140, status:"done",     invoiced:true,  paid:true,  billing:ind.billing[0], notes:"Fixed, all good" },
  { id:2, customerId:2, customerName:"Mike Johnson",  address:"55 Oak Ave, Strathfield",  jobType:ind.jobTypes[0], date:"Today", time:"10:30 AM", hours:4, rate:ind.rate, labour:ind.rate*4, materials:85,  status:"in-progress",invoiced:false, paid:false, billing:ind.billing[0], notes:"60A main switch" },
  { id:3, customerId:3, customerName:"Sarah Williams",address:"8 Park Rd, Burwood",       jobType:ind.jobTypes[2], date:"Today", time:"1:00 PM",  hours:5, rate:ind.rate, labour:ind.rate*5, materials:320, status:"upcoming",  invoiced:false, paid:false, billing:ind.billing[1], notes:"Roof access needed" },
  { id:4, customerId:4, customerName:"Wang Fang",     address:"3 Elm St, Chatswood",      jobType:ind.jobTypes[3], date:"Today", time:"3:30 PM",  hours:2, rate:ind.rate, labour:ind.rate*2, materials:0,   status:"upcoming",  invoiced:false, paid:false, billing:ind.billing[0], notes:"Quick inspection" },
];

const mkInvoices = (ind: any) => [
  { id:101, customerId:2, customerName:"Mike Johnson",   jobType:ind.jobTypes[0], amount:ind.rate*4+85,  date:"Today",    due:"14 days", status:"sent",     paid:false },
  { id:102, customerId:3, customerName:"Sarah Williams", jobType:ind.jobTypes[2], amount:ind.rate*5+320, date:"Yesterday",due:"7 days",  status:"overdue",   paid:false },
  { id:103, customerId:5, customerName:"Dave Brown",     jobType:ind.jobTypes[1], amount:ind.rate*6+200, date:"3 days ago",due:"Paid",   status:"paid",      paid:true  },
  { id:104, customerId:4, customerName:"Wang Fang",      jobType:ind.jobTypes[3], amount:ind.rate*2,     date:"5 days ago",due:"Paid",   status:"paid",      paid:true  },
];

// ─── VOICE PARSER ────────────────────────────────────────
const parseVoice = (text: string, ind: any, customers: any[]) => {
  const low = text.toLowerCase();
  const amtMatch = low.match(/\$(\d+)/g);
  const labour    = amtMatch?.[0] ? parseInt(amtMatch[0].replace("$","")) : ind.rate * 2;
  const materials = amtMatch?.[1] ? parseInt(amtMatch[1].replace("$","")) : 0;
  const hoursMatch= low.match(/(\d+)\s*hour/);
  const hours     = hoursMatch ? parseInt(hoursMatch[1]) : 2;
  const customer  = customers.find(c => low.includes(c.name.split(" ")[0].toLowerCase()) || low.includes(c.name.split(" ")[1]?.toLowerCase()||"__"));
  const jobTypeGuess = ind.jobTypes.find((t: string) => low.includes(t.toLowerCase().split(" ")[0])) || ind.jobTypes[0];
  return { customerName: customer?.name || "New Customer", hours, labour, materials, total: labour + materials, jobType: jobTypeGuess, billing: ind.billing[0], notes:"Via voice entry" };
};

const VOICE_SAMPLES: any = {
  elec:    ['"Fixed fault at Zhang Wei, labour $190, materials $85, send invoice"','"Done switchboard upgrade at Mike, 4 hours, parts $320, invoice him"','"Solar install at Wang Fang, $1800 labour plus panels $2800"'],
  plumber: ['"Unblocked drain at Zhang Wei, 2 hours, $220, send invoice"','"Hot water system at Sarah, parts $1200 plus 4 hours labour"','"Fixed burst pipe at Mike, materials $140, labour $330"'],
  handyman:['"Flat pack at Zhang Wei, 3 hours, $195, send invoice"','"Fence repair at Sarah, 5 hours plus $80 timber, total $405"','"Painted Dave Brown office, full day $520"'],
  windows: ['"Installed 4 windows at Zhang Wei, supply and install $2400"','"Security screen at Mike, labour only $270, send invoice"','"Bifold door at Wang Fang, $1800 per job"'],
  cleaning:['"Cleaned Zhang Wei place, 3 hours, $180, send invoice"','"End of lease at Mike, $450 flat rate, invoice him"','"Office clean at Dave Brown, weekly $350"'],
  other:   ['"Finished job at Zhang Wei, 4 hours, $300, send invoice"','"Installation at Sarah, supply and install $850"','"Repair at Mike, 2 hours plus $120 materials"'],
};

// ─── MAIN APP ────────────────────────────────────────────
export default function JobMate() {
  const [indKey,     setIndKey]    = useState<string|null>(null);
  const [screen,     setScreen]    = useState("home");
  const [customers,  setCustomers] = useState(SEED_CUSTOMERS);
  const [jobs,       setJobs]      = useState<any[]>([]);
  const [invoices,   setInvoices]  = useState<any[]>([]);
  const [quotes,     setQuotes]    = useState<any[]>([]);
  const [notif,      setNotif]     = useState<string|null>(null);
  // modals
  const [vModal,    setVModal]    = useState(false);
  const [vState,    setVState]    = useState("idle");
  const [vText,     setVText]     = useState("");
  const [vResult,   setVResult]   = useState<any>(null);
  const [newJobM,   setNewJobM]   = useState(false);
  const [newInvM,   setNewInvM]   = useState(false);
  const [newQuoteM, setNewQuoteM] = useState(false);
  const [newCustM,  setNewCustM]  = useState(false);
  const [jobDetail, setJobDetail] = useState<any>(null);
  // forms
  const [jForm, setJForm] = useState<any>({customerName:"",address:"",jobType:"",billing:"",time:"",hours:"",rate:"",materials:"",notes:""});
  const [iForm, setIForm] = useState<any>({customerName:"",jobType:"",labour:"",materials:"",notes:""});
  const [qForm, setQForm] = useState<any>({customerName:"",jobType:"",labour:"",materials:"",notes:""});
  const [cForm, setCForm] = useState<any>({name:"",phone:"",address:"",notes:""});
  const timer = useRef<any>(null);

  const ind = indKey ? INDUSTRIES[indKey] : null;
  const ac  = ind?.color || "#ff5c00";

  const toast = (m: string) => { setNotif(m); setTimeout(() => setNotif(null), 3000); };

  const pickIndustry = (k: string) => {
    setIndKey(k);
    setJobs(mkJobs(INDUSTRIES[k]));
    setInvoices(mkInvoices(INDUSTRIES[k]));
    setQuotes([]);
    setJForm((f: any) => ({ ...f, billing: INDUSTRIES[k].billing[0], rate: String(INDUSTRIES[k].rate) }));
    setIForm((f: any) => ({ ...f }));
    setScreen("home");
  };

  // ─── COMPUTED ──────────────────────────────────────
  const todayJobs     = jobs;
  const doneJobs      = jobs.filter(j => j.status === "done");
  const todayRevenue  = doneJobs.reduce((s, j) => s + j.labour + j.materials, 0);
  const unpaidInvs    = invoices.filter(i => !i.paid);
  const outstanding   = unpaidInvs.reduce((s, i) => s + i.amount, 0);
  const overdueInvs   = invoices.filter(i => i.status === "overdue");

  // ─── VOICE ─────────────────────────────────────────
  const startVoice = () => {
    setVState("listening"); setVText(""); setVResult(null);
    const samples = VOICE_SAMPLES[indKey!] || VOICE_SAMPLES.other;
    const raw = samples[Math.floor(Math.random() * samples.length)].replace(/"/g, "");
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setVText(raw.slice(0, i * 6));
      if (i * 6 >= raw.length) {
        clearInterval(timer.current);
        setVText(raw);
        setTimeout(() => { setVState("processing"); setTimeout(() => { setVResult(parseVoice(raw, ind, customers)); setVState("done"); }, 1400); }, 300);
      }
    }, 70);
  };

  const stopVoice = () => {
    clearInterval(timer.current);
    if (vState === "listening") { setVState("processing"); setTimeout(() => { setVResult(parseVoice(vText, ind, customers)); setVState("done"); }, 1200); }
  };

  const confirmVoice = () => {
    if (!vResult) return;
    const newJob = { id: uid(), customerId: 0, customerName: vResult.customerName, address: "From voice", jobType: vResult.jobType, date: "Today", time: "Now", hours: vResult.hours, rate: ind.rate, labour: vResult.labour, materials: vResult.materials, status: "done", invoiced: true, paid: false, billing: vResult.billing, notes: vResult.notes };
    setJobs((p: any) => [...p, newJob]);
    const newInv = { id: uid(), customerId: 0, customerName: vResult.customerName, jobType: vResult.jobType, amount: vResult.total, date: "Today", due: "14 days", status: "sent", paid: false };
    setInvoices((p: any) => [...p, newInv]);
    setVModal(false); setVState("idle"); setVResult(null);
    toast(`✅ Job logged & invoice sent to ${vResult.customerName}`);
  };

  const addJob = () => {
    if (!jForm.customerName || !jForm.jobType) return;
    const labour = Number(jForm.hours || 1) * Number(jForm.rate || ind.rate);
    setJobs((p: any) => [...p, { id: uid(), ...jForm, labour, materials: Number(jForm.materials || 0), status: "upcoming", invoiced: false, paid: false, date: "Today" }]);
    setNewJobM(false); setJForm({ customerName:"", address:"", jobType:"", billing: ind.billing[0], time:"", hours:"", rate: String(ind.rate), materials:"", notes:"" });
    toast("✅ Job added!");
  };

  const addInvoice = () => {
    if (!iForm.customerName) return;
    const amount = Number(iForm.labour || 0) + Number(iForm.materials || 0);
    setInvoices((p: any) => [...p, { id: uid(), ...iForm, amount, date: "Today", due: "14 days", status: "sent", paid: false }]);
    setNewInvM(false); setIForm({ customerName:"", jobType:"", labour:"", materials:"", notes:"" });
    toast("✅ Invoice sent!");
  };

  const addQuote = () => {
    if (!qForm.customerName) return;
    const amount = Number(qForm.labour || 0) + Number(qForm.materials || 0);
    setQuotes((p: any) => [...p, { id: uid(), ...qForm, amount, date: "Today", status: "pending" }]);
    setNewQuoteM(false); setQForm({ customerName:"", jobType:"", labour:"", materials:"", notes:"" });
    toast("✅ Quote sent!");
  };

  const addCustomer = () => {
    if (!cForm.name) return;
    setCustomers((p: any) => [...p, { id: uid(), ...cForm }]);
    setNewCustM(false); setCForm({ name:"", phone:"", address:"", notes:"" });
    toast("✅ Customer added!");
  };

  const markJobDone    = (id: number) => { setJobs((p: any) => p.map((j: any) => j.id === id ? { ...j, status: "done" } : j)); toast("✅ Job done!"); setJobDetail(null); };
  const markInvPaid    = (id: number) => { setInvoices((p: any) => p.map((i: any) => i.id === id ? { ...i, paid: true, status: "paid" } : i)); toast("💰 Payment recorded!"); };
  const quoteToJob     = (q: any)     => { setJobs((p: any) => [...p, { id: uid(), customerName: q.customerName, address:"TBC", jobType: q.jobType, date:"Today", time:"TBC", hours:0, rate: ind.rate, labour: q.labour||0, materials: q.materials||0, status:"upcoming", invoiced:false, paid:false, billing: ind.billing[0], notes: q.notes }]); setQuotes((p:any)=>p.map((x:any)=>x.id===q.id?{...x,status:"converted"}:x)); toast("✅ Quote converted to job!"); };
  const sendReminder   = (inv: any)   => { toast(`📱 Reminder sent to ${inv.customerName}`); };

  // ─── STATUS COLORS ─────────────────────────────────
  const SC: any = { done:"#22c55e","in-progress":ac, upcoming:"#64748b" };
  const IC: any = { sent:"#94a3b8", overdue:"#f87171", paid:"#22c55e", pending:"#f59e0b" };

  // ─── STYLES ────────────────────────────────────────
  const S: any = {
    root:    { maxWidth:430, margin:"0 auto", minHeight:"100vh", background:"#090909", color:"#f0ede8", fontFamily:"'DM Sans','Helvetica Neue',sans-serif", position:"relative", overflowX:"hidden" },
    hdr:     { padding:"28px 20px 0", background:"linear-gradient(180deg,#111 0%,#090909 100%)" },
    logoRow: { display:"flex", alignItems:"center", gap:8, marginBottom:4 },
    logo:    { fontSize:19, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 },
    dot:     { width:8, height:8, borderRadius:"50%", background:ac },
    tag:     { fontSize:11, color:ac, background:ac+"22", borderRadius:20, padding:"3px 10px", fontWeight:700, border:`1px solid ${ac}44` },
    swBtn:   { fontSize:11, color:"#555", background:"#161616", border:"1px solid #1e1e1e", borderRadius:20, padding:"4px 10px", cursor:"pointer" },

    // big 3 action buttons
    actionRow: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:"16px 20px" },
    actBtn:  (primary?: boolean) => ({ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"16px 8px", background: primary ? ac : "#141414", border: primary ? "none" : "1px solid #1e1e1e", borderRadius:16, cursor:"pointer", flex:1 }),
    actIcon: { fontSize:22 },
    actLbl:  (primary?: boolean) => ({ fontSize:12, fontWeight:800, color: primary ? "#0a0a0a" : "#94a3b8", letterSpacing:-0.2 }),

    // stats row
    statsRow:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, padding:"0 20px 20px" },
    stat:    (c: string) => ({ background:"#141414", borderRadius:14, padding:"12px 12px", borderBottom:`2px solid ${c}`, cursor:"pointer" }),
    statV:   (c: string) => ({ fontSize:18, fontWeight:900, color:c, letterSpacing:-0.5, lineHeight:1 }),
    statL:   { fontSize:10, color:"#444", fontWeight:700, textTransform:"uppercase", letterSpacing:0.6, marginTop:4 },

    sec:     { padding:"0 20px", marginBottom:24 },
    secHdr:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 },
    secT:    { fontSize:11, fontWeight:800, color:"#333", textTransform:"uppercase", letterSpacing:1 },
    secA:    { fontSize:12, color:ac, fontWeight:700, cursor:"pointer" },

    // job card
    jCard:   (s: string) => ({ background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10, borderLeft:`3px solid ${SC[s]||"#222"}`, cursor:"pointer" }),
    jTop:    { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:2 },
    jTime:   { fontSize:11, color:"#444", fontWeight:700, letterSpacing:0.5 },
    jStatus: (s: string) => ({ fontSize:10, fontWeight:700, color:SC[s], background:SC[s]+"20", borderRadius:20, padding:"2px 9px" }),
    jName:   { fontSize:16, fontWeight:800, color:"#f0ede8", letterSpacing:-0.3 },
    jType:   { fontSize:11, color:ac, marginTop:2 },
    jAddr:   { fontSize:11, color:"#333", marginTop:3 },
    jBottom: { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 },
    jPrice:  { fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 },
    jSub:    { fontSize:10, color:"#333" },
    doneBtn: { padding:"8px 16px", background:ac, border:"none", borderRadius:10, color:"#0a0a0a", fontWeight:800, fontSize:12, cursor:"pointer" },

    // invoice card
    iCard:   (s: string) => ({ background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10, borderLeft:`3px solid ${IC[s]||"#222"}` }),
    iTop:    { display:"flex", justifyContent:"space-between", alignItems:"flex-start" },
    iStatus: (s: string) => ({ fontSize:10, fontWeight:700, color:IC[s], background:IC[s]+"20", borderRadius:20, padding:"2px 9px" }),
    iName:   { fontSize:15, fontWeight:800, color:"#f0ede8" },
    iType:   { fontSize:11, color:"#444", marginTop:2 },
    iRow:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 },
    iAmt:    (s: string) => ({ fontSize:20, fontWeight:900, color: s==="overdue" ? "#f87171" : s==="paid" ? "#22c55e" : "#f0ede8", letterSpacing:-0.5 }),
    iDate:   { fontSize:11, color:"#333" },
    iBtns:   { display:"flex", gap:8, marginTop:10 },
    iBtn:    (c: string) => ({ flex:1, padding:"9px", background:"#1a1a1a", border:`1px solid ${c}33`, borderRadius:10, color:c, fontSize:12, fontWeight:700, cursor:"pointer" }),

    // customer card
    cCard:   { background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10 },
    cName:   { fontSize:15, fontWeight:800, color:"#f0ede8" },
    cSub:    { fontSize:12, color:"#444", marginTop:2 },
    cBtns:   { display:"flex", gap:6, marginTop:12 },
    cBtn:    (c: string) => ({ flex:1, padding:"8px", background:"#1a1a1a", border:"1px solid #1e1e1e", borderRadius:10, color:c, fontSize:11, fontWeight:700, cursor:"pointer" }),

    // bottom nav
    nav:     { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#0f0f0f", borderTop:"1px solid #1a1a1a", display:"grid", gridTemplateColumns:"repeat(5,1fr)", padding:"8px 0 22px", zIndex:100 },
    nItem:   (a: boolean) => ({ display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", padding:"5px 0", opacity: a ? 1 : 0.3 }),
    nIcon:   { fontSize:20 },
    nLbl:    (a: boolean) => ({ fontSize:9, fontWeight:700, color: a ? ac : "#444", letterSpacing:0.2 }),

    // overlay / sheet
    overlay: { position:"fixed", inset:0, background:"#000c", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:999 },
    sheet:   { background:"#141414", borderRadius:"24px 24px 0 0", padding:"24px 20px 44px", width:"100%", maxWidth:430, border:"1px solid #1e1e1e", maxHeight:"92vh", overflowY:"auto" as any },
    handle:  { width:40, height:4, background:"#252525", borderRadius:2, margin:"0 auto 20px" },
    sTitle:  { fontSize:20, fontWeight:900, color:"#f0ede8", marginBottom:4, letterSpacing:-0.5 },
    sSub:    { fontSize:13, color:"#444", marginBottom:20 },

    // voice
    micBtn:  (s: string) => ({ width:90, height:90, borderRadius:"50%", border:"none", background: s==="listening" ? "#ef4444" : ac, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, cursor:"pointer", margin:"0 auto 20px", boxShadow: s==="listening" ? "0 0 0 14px #ef444420,0 0 0 28px #ef444410" : `0 0 0 10px ${ac}28`, transition:"all 0.3s" }),
    vDisp:   { background:"#0a0a0a", borderRadius:12, padding:"14px", marginBottom:16, minHeight:56, fontSize:13, color:"#94a3b8", lineHeight:1.6, border:"1px solid #1a1a1a" },
    aiCard:  { background:"#0a0a0a", borderRadius:12, padding:"14px", marginBottom:16, border:`1px solid ${ac}30` },
    aiRow:   { display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #141414" },
    aiK:     { fontSize:12, color:"#444", fontWeight:600 },
    aiV:     { fontSize:12, color:"#f0ede8", fontWeight:700 },

    // form
    fField:  { marginBottom:12 },
    fLabel:  { fontSize:10, color:"#444", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:5 },
    fInp:    { width:"100%", padding:"12px 14px", background:"#0a0a0a", border:"1px solid #1e1e1e", borderRadius:12, color:"#f0ede8", fontSize:15, outline:"none", boxSizing:"border-box" as any },
    fSel:    { width:"100%", padding:"12px 14px", background:"#0a0a0a", border:"1px solid #1e1e1e", borderRadius:12, color:"#f0ede8", fontSize:14, outline:"none", boxSizing:"border-box" as any },
    fRow:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
    fTotal:  { background:`${ac}10`, border:`1px solid ${ac}28`, borderRadius:12, padding:"12px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" },

    bigBtn:  (c?: string) => ({ width:"100%", padding:"15px", background: c || ac, border: c==="transparent" ? "1px solid #1e1e1e" : "none", borderRadius:14, color: c==="transparent" ? "#555" : "#0a0a0a", fontSize:15, fontWeight:800, cursor:"pointer", letterSpacing:-0.3, marginBottom:8 }),
    toast:   { position:"fixed" as any, top:20, left:"50%", transform:"translateX(-50%)", background:"#22c55e", color:"#fff", padding:"11px 20px", borderRadius:14, fontWeight:700, fontSize:13, zIndex:9999, whiteSpace:"nowrap" as any, boxShadow:"0 8px 24px #0008" },
  };

  const NAV = [
    { id:"home",      icon:"🏠", label:"Home"     },
    { id:"jobs",      icon:"🔩", label:"Jobs"     },
    { id:"invoices",  icon:"🧾", label:"Invoices" },
    { id:"quotes",    icon:"📋", label:"Quotes"   },
    { id:"customers", icon:"👥", label:"Clients"  },
  ];

  // ─── INDUSTRY SELECT ─────────────────────────────
  if (!indKey) return (
    <div style={S.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');*{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}button,input,select{font-family:inherit;}`}</style>
      <div style={{ padding:"60px 24px 48px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:"#ff5c00" }}/>
          <div style={{ fontSize:24, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 }}>JobMate</div>
        </div>
        <div style={{ fontSize:15, color:"#444", marginBottom:8 }}>The simplest job & invoice app for tradies.</div>
        <div style={{ fontSize:13, color:"#333", marginBottom:36 }}>What's your trade?</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {Object.entries(INDUSTRIES).map(([k, i]: any) => (
            <div key={k} onClick={() => pickIndustry(k)} style={{ background:"#141414", borderRadius:18, padding:"20px 16px", cursor:"pointer", border:`1px solid ${i.color}30`, textAlign:"center", transition:"all 0.2s" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{i.icon}</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#f0ede8", marginBottom:3 }}>{i.name}</div>
              <div style={{ fontSize:10, color:i.color, fontWeight:600 }}>{i.billing[0]}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", color:"#222", fontSize:11, marginTop:24 }}>More trades coming soon</div>
      </div>
    </div>
  );

  // ─── HOME ─────────────────────────────────────────
  const renderHome = () => (
    <>
      <div style={S.hdr}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>JobMate</div></div>
          <div style={{ display:"flex", gap:6 }}>
            <span style={S.tag}>{ind.icon} {ind.name}</span>
            <button style={S.swBtn} onClick={() => setIndKey(null)}>Switch</button>
          </div>
        </div>
        <div style={{ paddingBottom:20 }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 }}>{GREETING} 👋</div>
          <div style={{ fontSize:12, color:"#333", marginTop:3 }}>{TODAY_STR}</div>
        </div>
      </div>

      {/* 3 action buttons */}
      <div style={S.actionRow}>
        <button style={S.actBtn(false)} onClick={() => setNewJobM(true)}>
          <div style={S.actIcon}>➕</div>
          <div style={S.actLbl(false)}>New Job</div>
        </button>
        <button style={{ ...S.actBtn(true), background:ac }} onClick={() => { setVModal(true); setVState("idle"); }}>
          <div style={S.actIcon}>🎙️</div>
          <div style={S.actLbl(true)}>Voice Job</div>
        </button>
        <button style={S.actBtn(false)} onClick={() => setNewInvM(true)}>
          <div style={S.actIcon}>🧾</div>
          <div style={S.actLbl(false)}>Invoice</div>
        </button>
      </div>

      {/* 3 stats */}
      <div style={S.statsRow}>
        <div style={S.stat("#22c55e")} onClick={() => setScreen("jobs")}>
          <div style={S.statV("#22c55e")}>{fmt(todayRevenue)}</div>
          <div style={S.statL}>Money In</div>
        </div>
        <div style={S.stat("#f87171")} onClick={() => setScreen("invoices")}>
          <div style={S.statV("#f87171")}>{fmt(outstanding)}</div>
          <div style={S.statL}>Money Owed</div>
        </div>
        <div style={S.stat(ac)} onClick={() => setScreen("jobs")}>
          <div style={S.statV(ac)}>{todayJobs.length}</div>
          <div style={S.statL}>Jobs Today</div>
        </div>
      </div>

      {/* overdue alert */}
      {overdueInvs.length > 0 && (
        <div style={{ margin:"0 20px 20px", background:"#f8717115", border:"1px solid #f8717133", borderRadius:14, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"#f87171" }}>⚠️ {overdueInvs.length} Overdue Invoice{overdueInvs.length > 1 ? "s" : ""}</div>
            <div style={{ fontSize:11, color:"#555", marginTop:2 }}>{overdueInvs.map((i:any)=>i.customerName).join(", ")}</div>
          </div>
          <button style={{ padding:"8px 14px", background:"#f87171", border:"none", borderRadius:10, color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer" }} onClick={() => setScreen("invoices")}>View →</button>
        </div>
      )}

      {/* today's jobs preview */}
      <div style={S.sec}>
        <div style={S.secHdr}>
          <div style={S.secT}>Today's Jobs</div>
          <div style={S.secA} onClick={() => setScreen("jobs")}>See all →</div>
        </div>
        {todayJobs.slice(0, 3).map((j: any) => (
          <div key={j.id} style={S.jCard(j.status)} onClick={() => setJobDetail(j)}>
            <div style={S.jTop}>
              <div style={S.jTime}>{j.time}</div>
              <span style={S.jStatus(j.status)}>{j.status === "in-progress" ? "In Progress" : j.status === "done" ? "Done ✓" : "Upcoming"}</span>
            </div>
            <div style={S.jName}>{j.customerName}</div>
            <div style={S.jType}>{j.jobType}</div>
            <div style={S.jBottom}>
              <div>
                <div style={S.jPrice}>{fmt(j.labour + j.materials)}</div>
                <div style={S.jSub}>Labour {fmt(j.labour)} {j.materials > 0 ? `+ Materials ${fmt(j.materials)}` : ""}</div>
              </div>
              {j.status !== "done" && <button style={S.doneBtn} onClick={(e) => { e.stopPropagation(); markJobDone(j.id); }}>{j.status === "in-progress" ? "✓ Done" : "Start →"}</button>}
            </div>
          </div>
        ))}
        {todayJobs.length === 0 && <div style={{ textAlign:"center", padding:"24px 0", color:"#333", fontSize:13 }}>No jobs yet today · tap + New Job</div>}
      </div>

      {/* unpaid invoices preview */}
      {unpaidInvs.length > 0 && (
        <div style={S.sec}>
          <div style={S.secHdr}>
            <div style={S.secT}>Unpaid Invoices</div>
            <div style={S.secA} onClick={() => setScreen("invoices")}>See all →</div>
          </div>
          {unpaidInvs.slice(0, 2).map((inv: any) => (
            <div key={inv.id} style={S.iCard(inv.status)}>
              <div style={S.iTop}>
                <div>
                  <div style={S.iName}>{inv.customerName}</div>
                  <div style={S.iType}>{inv.jobType}</div>
                </div>
                <span style={S.iStatus(inv.status)}>{inv.status}</span>
              </div>
              <div style={S.iRow}>
                <div style={S.iAmt(inv.status)}>{fmt(inv.amount)}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <button style={S.iBtn("#94a3b8")} onClick={() => sendReminder(inv)}>Remind</button>
                  <button style={S.iBtn("#22c55e")} onClick={() => markInvPaid(inv.id)}>✓ Paid</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height:90 }}/>
    </>
  );

  // ─── JOBS ─────────────────────────────────────────
  const renderJobs = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>JobMate</div></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:16 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 }}>Jobs 🔩</div>
          <button style={{ padding:"8px 16px", background:ac, border:"none", borderRadius:12, color:"#0a0a0a", fontWeight:800, fontSize:13, cursor:"pointer" }} onClick={() => setNewJobM(true)}>+ New Job</button>
        </div>
      </div>
      <div style={{ padding:"16px 20px" }}>
        {["in-progress","upcoming","done"].map(status => {
          const filtered = jobs.filter((j: any) => j.status === status);
          if (filtered.length === 0) return null;
          const labels: any = {"in-progress":"In Progress","upcoming":"Upcoming","done":"Completed"};
          return (
            <div key={status}>
              <div style={{ fontSize:10, color:"#333", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8, marginTop:4 }}>{labels[status]}</div>
              {filtered.map((j: any) => (
                <div key={j.id} style={S.jCard(j.status)} onClick={() => setJobDetail(j)}>
                  <div style={S.jTop}>
                    <div style={S.jTime}>{j.time} · {j.date}</div>
                    <span style={S.jStatus(j.status)}>{labels[j.status]}</span>
                  </div>
                  <div style={S.jName}>{j.customerName}</div>
                  <div style={S.jType}>{j.jobType}</div>
                  <div style={S.jAddr}>📍 {j.address}</div>
                  <div style={S.jBottom}>
                    <div>
                      <div style={S.jPrice}>{fmt(j.labour + j.materials)}</div>
                      <div style={S.jSub}>{j.billing} · {j.hours}hr{j.hours !== 1 ? "s" : ""}{j.materials > 0 ? ` + materials ${fmt(j.materials)}` : ""}</div>
                    </div>
                    {j.status !== "done" && <button style={S.doneBtn} onClick={(e) => { e.stopPropagation(); markJobDone(j.id); }}>{j.status === "in-progress" ? "✓ Done" : "Start"}</button>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        {jobs.length === 0 && <div style={{ textAlign:"center", padding:"40px 0", color:"#333" }}>No jobs yet</div>}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  // ─── INVOICES ─────────────────────────────────────
  const renderInvoices = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>JobMate</div></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 }}>Invoices 🧾</div>
          <button style={{ padding:"8px 16px", background:ac, border:"none", borderRadius:12, color:"#0a0a0a", fontWeight:800, fontSize:13, cursor:"pointer" }} onClick={() => setNewInvM(true)}>+ Invoice</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, padding:"14px 0" }}>
          {[["#f87171",fmt(outstanding),"Money Owed"],["#f59e0b",fmt(overdueInvs.reduce((s:any,i:any)=>s+i.amount,0)),"Overdue"],["#22c55e",fmt(invoices.filter(i=>i.paid).reduce((s:any,i:any)=>s+i.amount,0)),"Paid"]].map(([c,v,l])=>(
            <div key={l} style={{ background:"#141414", borderRadius:12, padding:"10px 12px", borderBottom:`2px solid ${c}` }}>
              <div style={{ fontSize:16, fontWeight:900, color:c, letterSpacing:-0.5 }}>{v}</div>
              <div style={{ fontSize:10, color:"#333", fontWeight:700, textTransform:"uppercase", marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"16px 20px" }}>
        {["overdue","sent","paid"].map(status => {
          const filtered = invoices.filter((i: any) => i.status === status);
          if (filtered.length === 0) return null;
          const labels: any = { overdue:"⚠️ Overdue", sent:"Sent", paid:"✓ Paid" };
          return (
            <div key={status}>
              <div style={{ fontSize:10, color:IC[status], fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8, marginTop:4 }}>{labels[status]}</div>
              {filtered.map((inv: any) => (
                <div key={inv.id} style={S.iCard(inv.status)}>
                  <div style={S.iTop}>
                    <div><div style={S.iName}>{inv.customerName}</div><div style={S.iType}>{inv.jobType}</div></div>
                    <span style={S.iStatus(inv.status)}>{inv.status}</span>
                  </div>
                  <div style={S.iRow}>
                    <div>
                      <div style={S.iAmt(inv.status)}>{fmt(inv.amount)}</div>
                      <div style={S.iDate}>Due: {inv.due}</div>
                    </div>
                  </div>
                  {!inv.paid && (
                    <div style={S.iBtns}>
                      <button style={S.iBtn("#94a3b8")} onClick={() => sendReminder(inv)}>📱 Remind</button>
                      <button style={S.iBtn("#22c55e")} onClick={() => markInvPaid(inv.id)}>✓ Mark Paid</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  // ─── QUOTES ───────────────────────────────────────
  const renderQuotes = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>JobMate</div></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:16 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 }}>Quotes 📋</div>
          <button style={{ padding:"8px 16px", background:ac, border:"none", borderRadius:12, color:"#0a0a0a", fontWeight:800, fontSize:13, cursor:"pointer" }} onClick={() => setNewQuoteM(true)}>+ Quote</button>
        </div>
      </div>
      <div style={{ padding:"16px 20px" }}>
        {quotes.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#333", marginBottom:8 }}>No quotes yet</div>
            <div style={{ fontSize:13, color:"#2a2a2a" }}>Send a quote and convert it to a job in one tap</div>
          </div>
        ) : quotes.map((q: any) => (
          <div key={q.id} style={{ background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10, borderLeft:`3px solid ${IC[q.status]||"#f59e0b"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <div style={S.iName}>{q.customerName}</div>
                <div style={S.iType}>{q.jobType}</div>
              </div>
              <span style={S.iStatus(q.status || "pending")}>{q.status}</span>
            </div>
            <div style={S.iRow}>
              <div style={S.iAmt("sent")}>{fmt(q.amount)}</div>
              {q.status === "pending" && (
                <button style={{ padding:"8px 14px", background:ac, border:"none", borderRadius:10, color:"#0a0a0a", fontWeight:800, fontSize:12, cursor:"pointer" }} onClick={() => quoteToJob(q)}>→ Convert to Job</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  // ─── CUSTOMERS ────────────────────────────────────
  const renderCustomers = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>JobMate</div></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:16 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 }}>Clients 👥</div>
          <button style={{ padding:"8px 16px", background:ac, border:"none", borderRadius:12, color:"#0a0a0a", fontWeight:800, fontSize:13, cursor:"pointer" }} onClick={() => setNewCustM(true)}>+ Client</button>
        </div>
      </div>
      <div style={{ padding:"16px 20px" }}>
        {customers.map((c: any) => (
          <div key={c.id} style={S.cCard}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={S.cName}>{c.name}</div>
                <div style={S.cSub}>{c.phone}</div>
                <div style={{ ...S.cSub, marginTop:2 }}>📍 {c.address}</div>
                {c.notes && <div style={{ fontSize:11, color:"#333", marginTop:4, fontStyle:"italic" }}>💬 {c.notes}</div>}
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                {(() => { const bal = invoices.filter(i => !i.paid && i.customerName === c.name).reduce((s:any,i:any)=>s+i.amount,0); return bal > 0 ? <div style={{ fontSize:13, color:"#f87171", fontWeight:800 }}>Owes {fmt(bal)}</div> : <div style={{ fontSize:12, color:"#22c55e", fontWeight:700 }}>All paid ✓</div>; })()}
              </div>
            </div>
            <div style={S.cBtns}>
              {[["📞 Call","#94a3b8"],["🧾 Invoice",ac],["📋 Quote","#38bdf8"],["🔩 Job","#22c55e"]].map(([l, col]) => (
                <button key={l as string} style={S.cBtn(col as string)} onClick={() => toast(`${l} — ${c.name}`)}>{l}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  // ─── FORM HELPERS ─────────────────────────────────
  const inp = (val: string, set: (v: string) => void, ph: string, type = "text") => (
    <input style={S.fInp} type={type} placeholder={ph} value={val} onChange={(e: any) => set(e.target.value)} />
  );
  const sel = (val: string, set: (v: string) => void, opts: string[]) => (
    <select style={S.fSel} value={val} onChange={(e: any) => set(e.target.value)}>
      <option value="">Select…</option>
      {opts.map((o: string) => <option key={o}>{o}</option>)}
    </select>
  );
  const customerNames = customers.map(c => c.name);

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        @keyframes pulse{0%,100%{box-shadow:0 0 0 10px #ef444420,0 0 0 20px #ef444410}50%{box-shadow:0 0 0 18px #ef444410,0 0 0 36px transparent}}
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
        button,input,select{font-family:inherit;}
        select option{background:#141414;}
      `}</style>

      {screen === "home"      && renderHome()}
      {screen === "jobs"      && renderJobs()}
      {screen === "invoices"  && renderInvoices()}
      {screen === "quotes"    && renderQuotes()}
      {screen === "customers" && renderCustomers()}

      {/* BOTTOM NAV */}
      <div style={S.nav}>
        {NAV.map(n => (
          <div key={n.id} style={S.nItem(screen === n.id)} onClick={() => setScreen(n.id)}>
            <div style={S.nIcon}>{n.icon}</div>
            <div style={S.nLbl(screen === n.id)}>{n.label}</div>
          </div>
        ))}
      </div>

      {/* ── VOICE MODAL ── */}
      {vModal && (
        <div style={S.overlay} onClick={(e: any) => e.target === e.currentTarget && setVModal(false)}>
          <div style={S.sheet}>
            <div style={S.handle} />
            {vState === "idle" && <>
              <div style={S.sTitle}>Voice Job 🎙️</div>
              <div style={S.sSub}>Just talk — job + invoice created instantly</div>
              <div style={{ background:"#0a0a0a", borderRadius:12, padding:"12px", marginBottom:20, border:"1px solid #1a1a1a" }}>
                <div style={{ fontSize:10, color:"#333", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Try saying</div>
                {(VOICE_SAMPLES[indKey!]||VOICE_SAMPLES.other).map((s: string, i: number) => (
                  <div key={i} style={{ fontSize:12, color:"#555", padding:"6px 0", borderBottom:"1px solid #141414", lineHeight:1.5 }}>{s}</div>
                ))}
              </div>
              <button style={S.micBtn("idle")} onClick={startVoice}>🎙️</button>
              <div style={{ textAlign:"center", color:"#333", fontSize:12, marginBottom:20 }}>Tap to start</div>
              <button style={S.bigBtn("transparent")} onClick={() => setVModal(false)}>Cancel</button>
            </>}
            {vState === "listening" && <>
              <div style={S.sTitle}>Listening… 🔴</div>
              <div style={S.sSub}>Speak naturally — tap ⏹ to stop</div>
              <button style={{ ...S.micBtn("listening"), animation:"pulse 1.5s infinite" }} onClick={stopVoice}>⏹</button>
              <div style={S.vDisp}>{vText || <span style={{ color:"#222" }}>Waiting…</span>}</div>
              <button style={S.bigBtn("transparent")} onClick={() => { clearInterval(timer.current); setVState("idle"); }}>Cancel</button>
            </>}
            {vState === "processing" && <>
              <div style={S.sTitle}>Got it ⚙️</div>
              <div style={S.sSub}>Building your job & invoice…</div>
              <div style={{ textAlign:"center", fontSize:48, padding:"32px 0" }}>⚙️</div>
              <div style={S.vDisp}>{vText}</div>
            </>}
            {vState === "done" && vResult && <>
              <div style={S.sTitle}>Ready ✅</div>
              <div style={S.sSub}>Check details then confirm</div>
              <div style={S.aiCard}>
                {[["Customer",vResult.customerName],["Job",vResult.jobType],["Labour",fmt(vResult.labour)],["Materials",vResult.materials > 0 ? fmt(vResult.materials) : "None"],["Total",fmt(vResult.total)+" inc. GST"],["Invoice","Auto-sent ✉️"]].map(([k, v]) => (
                  <div key={k} style={S.aiRow}><span style={S.aiK}>{k}</span><span style={S.aiV}>{v}</span></div>
                ))}
              </div>
              <button style={S.bigBtn()} onClick={confirmVoice}>✅ Confirm & Send Invoice</button>
              <button style={S.bigBtn("transparent")} onClick={() => setVState("idle")}>← Try Again</button>
            </>}
          </div>
        </div>
      )}

      {/* ── NEW JOB MODAL ── */}
      {newJobM && (
        <div style={S.overlay} onClick={(e: any) => e.target === e.currentTarget && setNewJobM(false)}>
          <div style={S.sheet}>
            <div style={S.handle} />
            <div style={S.sTitle}>New Job 🔩</div>
            <div style={S.sSub}>3 steps: Customer → Job → Cost</div>
            <div style={S.fField}><label style={S.fLabel}>Customer</label>{sel(jForm.customerName, v => setJForm((p:any) => ({ ...p, customerName:v })), customerNames)}</div>
            <div style={S.fField}><label style={S.fLabel}>Job Type</label>{sel(jForm.jobType, v => setJForm((p:any) => ({ ...p, jobType:v })), ind.jobTypes)}</div>
            <div style={S.fField}><label style={S.fLabel}>Billing</label>{sel(jForm.billing, v => setJForm((p:any) => ({ ...p, billing:v })), ind.billing)}</div>
            <div style={S.fRow}>
              <div style={S.fField}><label style={S.fLabel}>Hours</label>{inp(jForm.hours, v => setJForm((p:any) => ({ ...p, hours:v })), "4", "number")}</div>
              <div style={S.fField}><label style={S.fLabel}>Rate ($/hr)</label>{inp(jForm.rate, v => setJForm((p:any) => ({ ...p, rate:v })), String(ind.rate), "number")}</div>
            </div>
            <div style={S.fField}><label style={S.fLabel}>Materials ($)</label>{inp(jForm.materials, v => setJForm((p:any) => ({ ...p, materials:v })), "0", "number")}</div>
            <div style={S.fField}><label style={S.fLabel}>Address</label>{inp(jForm.address, v => setJForm((p:any) => ({ ...p, address:v })), "Job site address")}</div>
            <div style={S.fField}><label style={S.fLabel}>Time</label>{inp(jForm.time, v => setJForm((p:any) => ({ ...p, time:v })), "8:00 AM")}</div>
            <div style={S.fField}><label style={S.fLabel}>Notes</label>{inp(jForm.notes, v => setJForm((p:any) => ({ ...p, notes:v })), "Requirements, access notes…")}</div>
            {jForm.hours && jForm.rate && (
              <div style={S.fTotal}>
                <span style={{ fontSize:13, color:"#444" }}>Total inc GST</span>
                <span style={{ fontSize:16, fontWeight:900, color:ac }}>{fmt((Number(jForm.hours) * Number(jForm.rate) + Number(jForm.materials || 0)) * 1.1)}</span>
              </div>
            )}
            <button style={S.bigBtn()} onClick={addJob}>✅ Create Job</button>
            <button style={S.bigBtn("transparent")} onClick={() => setNewJobM(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── NEW INVOICE MODAL ── */}
      {newInvM && (
        <div style={S.overlay} onClick={(e: any) => e.target === e.currentTarget && setNewInvM(false)}>
          <div style={S.sheet}>
            <div style={S.handle} />
            <div style={S.sTitle}>New Invoice 🧾</div>
            <div style={S.sSub}>Send in seconds</div>
            <div style={S.fField}><label style={S.fLabel}>Customer</label>{sel(iForm.customerName, v => setIForm((p:any) => ({ ...p, customerName:v })), customerNames)}</div>
            <div style={S.fField}><label style={S.fLabel}>Job Type</label>{sel(iForm.jobType, v => setIForm((p:any) => ({ ...p, jobType:v })), ind.jobTypes)}</div>
            <div style={S.fRow}>
              <div style={S.fField}><label style={S.fLabel}>Labour ($)</label>{inp(iForm.labour, v => setIForm((p:any) => ({ ...p, labour:v })), "0", "number")}</div>
              <div style={S.fField}><label style={S.fLabel}>Materials ($)</label>{inp(iForm.materials, v => setIForm((p:any) => ({ ...p, materials:v })), "0", "number")}</div>
            </div>
            <div style={S.fField}><label style={S.fLabel}>Notes</label>{inp(iForm.notes, v => setIForm((p:any) => ({ ...p, notes:v })), "Optional notes…")}</div>
            {(iForm.labour || iForm.materials) && (
              <div style={S.fTotal}>
                <span style={{ fontSize:13, color:"#444" }}>Total inc GST</span>
                <span style={{ fontSize:16, fontWeight:900, color:ac }}>{fmt((Number(iForm.labour || 0) + Number(iForm.materials || 0)) * 1.1)}</span>
              </div>
            )}
            <button style={S.bigBtn()} onClick={addInvoice}>✅ Send Invoice</button>
            <button style={S.bigBtn("transparent")} onClick={() => setNewInvM(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── NEW QUOTE MODAL ── */}
      {newQuoteM && (
        <div style={S.overlay} onClick={(e: any) => e.target === e.currentTarget && setNewQuoteM(false)}>
          <div style={S.sheet}>
            <div style={S.handle} />
            <div style={S.sTitle}>New Quote 📋</div>
            <div style={S.sSub}>Convert to job in one tap when accepted</div>
            <div style={S.fField}><label style={S.fLabel}>Customer</label>{sel(qForm.customerName, v => setQForm((p:any) => ({ ...p, customerName:v })), customerNames)}</div>
            <div style={S.fField}><label style={S.fLabel}>Job Type</label>{sel(qForm.jobType, v => setQForm((p:any) => ({ ...p, jobType:v })), ind.jobTypes)}</div>
            <div style={S.fRow}>
              <div style={S.fField}><label style={S.fLabel}>Labour ($)</label>{inp(qForm.labour, v => setQForm((p:any) => ({ ...p, labour:v })), "0", "number")}</div>
              <div style={S.fField}><label style={S.fLabel}>Materials ($)</label>{inp(qForm.materials, v => setQForm((p:any) => ({ ...p, materials:v })), "0", "number")}</div>
            </div>
            <div style={S.fField}><label style={S.fLabel}>Notes</label>{inp(qForm.notes, v => setQForm((p:any) => ({ ...p, notes:v })), "Scope of work…")}</div>
            {(qForm.labour || qForm.materials) && (
              <div style={S.fTotal}>
                <span style={{ fontSize:13, color:"#444" }}>Quote Total</span>
                <span style={{ fontSize:16, fontWeight:900, color:ac }}>{fmt(Number(qForm.labour || 0) + Number(qForm.materials || 0))}</span>
              </div>
            )}
            <button style={S.bigBtn()} onClick={addQuote}>✅ Send Quote</button>
            <button style={S.bigBtn("transparent")} onClick={() => setNewQuoteM(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── NEW CUSTOMER MODAL ── */}
      {newCustM && (
        <div style={S.overlay} onClick={(e: any) => e.target === e.currentTarget && setNewCustM(false)}>
          <div style={S.sheet}>
            <div style={S.handle} />
            <div style={S.sTitle}>New Client 👥</div>
            <div style={S.sSub}>Add once, use forever</div>
            <div style={S.fField}><label style={S.fLabel}>Name</label>{inp(cForm.name, v => setCForm((p:any) => ({ ...p, name:v })), "Full name")}</div>
            <div style={S.fField}><label style={S.fLabel}>Phone</label>{inp(cForm.phone, v => setCForm((p:any) => ({ ...p, phone:v })), "04XX XXX XXX", "tel")}</div>
            <div style={S.fField}><label style={S.fLabel}>Address</label>{inp(cForm.address, v => setCForm((p:any) => ({ ...p, address:v })), "Street address")}</div>
            <div style={S.fField}><label style={S.fLabel}>Notes</label>{inp(cForm.notes, v => setCForm((p:any) => ({ ...p, notes:v })), "Access notes, preferences…")}</div>
            <button style={S.bigBtn()} onClick={addCustomer}>✅ Add Client</button>
            <button style={S.bigBtn("transparent")} onClick={() => setNewCustM(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── JOB DETAIL MODAL ── */}
      {jobDetail && (
        <div style={S.overlay} onClick={(e: any) => e.target === e.currentTarget && setJobDetail(null)}>
          <div style={S.sheet}>
            <div style={S.handle} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <div>
                <div style={S.sTitle}>{jobDetail.customerName}</div>
                <div style={{ fontSize:13, color:ac, fontWeight:700 }}>{jobDetail.jobType}</div>
              </div>
              <span style={S.jStatus(jobDetail.status)}>{jobDetail.status}</span>
            </div>
            <div style={S.aiCard}>
              {[["Address",jobDetail.address],["Time",`${jobDetail.time} · ${jobDetail.date}`],["Billing",jobDetail.billing],["Hours",`${jobDetail.hours} hr`],["Labour",fmt(jobDetail.labour)],["Materials",jobDetail.materials > 0 ? fmt(jobDetail.materials) : "None"],["Total",fmt(jobDetail.labour + jobDetail.materials)]].map(([k, v]) => (
                <div key={k} style={S.aiRow}><span style={S.aiK}>{k}</span><span style={S.aiV}>{v}</span></div>
              ))}
              {jobDetail.notes && <div style={{ padding:"8px 0 2px", fontSize:12, color:"#444", fontStyle:"italic" }}>💬 {jobDetail.notes}</div>}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {jobDetail.status !== "done" && <button style={S.bigBtn()} onClick={() => markJobDone(jobDetail.id)}>✓ Mark Done</button>}
              <button style={S.bigBtn("#38bdf8")} onClick={() => { setNewInvM(true); setIForm((p:any) => ({ ...p, customerName: jobDetail.customerName, jobType: jobDetail.jobType, labour: String(jobDetail.labour), materials: String(jobDetail.materials) })); setJobDetail(null); }}>🧾 Invoice</button>
            </div>
            <button style={S.bigBtn("transparent")} onClick={() => setJobDetail(null)}>Close</button>
          </div>
        </div>
      )}

      {notif && <div style={S.toast}>{notif}</div>}
    </div>
  );
}

