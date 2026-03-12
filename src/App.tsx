import { useState, useRef } from "react";

// ─── SEED DATA ───────────────────────────────────────────
const TODAY = new Date().toLocaleDateString("en-AU", { weekday:"long", day:"numeric", month:"short" });
const dd = (n: number) => { const x=new Date(); x.setDate(x.getDate()+n); return x.toISOString().split("T")[0]; };

const INIT_JOBS = [
  { id:1, client:"Chen Family",    address:"12 Rose St, Parramatta",  time:"8:00 AM",  price:180, status:"done",    recurring:"fortnightly", paid:true,  notes:"2BR unit, bring extra cloths" },
  { id:2, client:"Mike Johnson",   address:"55 Oak Ave, Strathfield", time:"10:30 AM", price:220, status:"on-way",  recurring:"weekly",      paid:false, notes:"Has a dog, side gate open" },
  { id:3, client:"Sarah Williams", address:"8 Park Rd, Burwood",      time:"1:00 PM",  price:160, status:"upcoming",recurring:"monthly",     paid:false, notes:"Key under mat" },
  { id:4, client:"Wang Family",    address:"3 Elm St, Chatswood",     time:"3:30 PM",  price:200, status:"upcoming",recurring:"fortnightly",paid:false, notes:"4BR house, 3hrs" },
];

const INIT_CLIENTS = [
  { id:1, name:"Chen Family",    phone:"0412 345 678", address:"12 Rose St, Parramatta",  price:180, recurring:"fortnightly", balance:0,   lastJob:dd(-1) },
  { id:2, name:"Mike Johnson",   phone:"0423 456 789", address:"55 Oak Ave, Strathfield", price:220, recurring:"weekly",      balance:220, lastJob:dd(0)  },
  { id:3, name:"Sarah Williams", phone:"0434 567 890", address:"8 Park Rd, Burwood",      price:160, recurring:"monthly",     balance:320, lastJob:dd(-14)},
  { id:4, name:"Wang Family",    phone:"0445 678 901", address:"3 Elm St, Chatswood",     price:200, recurring:"fortnightly",balance:400, lastJob:dd(-3) },
  { id:5, name:"Li Household",   phone:"0456 789 012", address:"21 Hunter St, Epping",   price:150, recurring:"weekly",      balance:150, lastJob:dd(-7) },
  { id:6, name:"Brown Office",   phone:"0467 890 123", address:"100 George St, CBD",      price:350, recurring:"monthly",     balance:0,   lastJob:dd(-2) },
];

const STAFF = [
  { id:1, name:"Mei Lin",   role:"Cleaner",   hours:38, rate:25, paid:false },
  { id:2, name:"John Tran", role:"Cleaner",   hours:32, rate:25, paid:false },
  { id:3, name:"Anna Wu",   role:"Supervisor",hours:40, rate:32, paid:true  },
];

const AI_RESPONSES = [
  { trigger:["chen","zhang","wang","li"],     client:"Chen Family",    price:180, notes:"Standard clean" },
  { trigger:["mike","johnson","strathfield"], client:"Mike Johnson",   price:220, notes:"Weekly clean + windows" },
  { trigger:["sarah","williams","burwood"],   client:"Sarah Williams", price:160, notes:"Regular monthly" },
];

const parseVoice = (text: string) => {
  const lower = text.toLowerCase();
  const priceMatch = lower.match(/\$?(\d+)/);
  const price = priceMatch ? parseInt(priceMatch[1]) : 180;
  const match = AI_RESPONSES.find(r => r.trigger.some(t => lower.includes(t)));
  const client = match?.client || "New Client";
  const hours = lower.match(/(\d+)\s*hour/)?.[1] || "2";
  return { client, price, hours: parseInt(hours), notes: match?.notes || "As discussed" };
};

export default function JobMate() {
  const [screen, setScreen]     = useState("today");
  const [jobs, setJobs]         = useState(INIT_JOBS);
  const [clients, setClients]   = useState(INIT_CLIENTS);
  const [staff, setStaff]       = useState(STAFF);
  const [voiceModal, setVoice]  = useState(false);
  const [voiceState, setVState] = useState("idle");
  const [voiceText, setVText]   = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [notif, setNotif]       = useState<string|null>(null);
  const [jobModal, setJobModal] = useState(false);
  const [newJobForm, setNewJob] = useState({ client:"", address:"", time:"", price:"", notes:"" });
  const [payModal, setPayModal] = useState<any>(null);
  const [lang, setLang]         = useState("en");
  const timerRef = useRef<any>(null);

  const showNotif = (msg: string) => { setNotif(msg); setTimeout(() => setNotif(null), 3000); };

  const owesTotal = clients.reduce((s,c) => s + c.balance, 0);
  const owesList  = clients.filter(c => c.balance > 0);
  const todayEarned = jobs.filter(j => j.status==="done").reduce((s,j) => s+j.price, 0);
  const doneJobs  = jobs.filter(j=>j.status==="done").length;
  const staffOwed = staff.filter(s=>!s.paid).reduce((s,e)=>s+(e.hours*e.rate),0);

  const startVoice = () => {
    setVState("listening"); setVText(""); setAiResult(null);
    const phrases = [
      "Just finished at Chen's place, 2 hours, charge $180, send invoice",
      "Done Mike Johnson Strathfield, windows extra, $220 total",
      "New client Sarah at Burwood, $160 monthly clean",
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setVText(phrase.slice(0, i * 8));
      if (i * 8 >= phrase.length) {
        clearInterval(timerRef.current);
        setVText(phrase);
        setTimeout(() => {
          setVState("processing");
          setTimeout(() => { setAiResult(parseVoice(phrase)); setVState("done"); }, 1500);
        }, 500);
      }
    }, 80);
  };

  const stopVoice = () => {
    clearInterval(timerRef.current);
    if (voiceState === "listening") {
      setVState("processing");
      setTimeout(() => { setAiResult(parseVoice(voiceText || "done")); setVState("done"); }, 1200);
    }
  };

  const confirmVoiceJob = () => {
    if (!aiResult) return;
    setJobs(p => [...p, { id:Date.now(), client:aiResult.client, address:"From voice", time:"Now", price:aiResult.price, status:"done", recurring:"one-off", paid:false, notes:aiResult.notes }]);
    setClients(p => p.map(c => c.name===aiResult.client ? {...c, balance:c.balance+aiResult.price} : c));
    setVoice(false); setVState("idle"); setAiResult(null);
    showNotif(`✅ Invoice sent to ${aiResult.client}!`);
  };

  const markJobDone = (id: number) => { setJobs(p => p.map(j => j.id===id ? {...j,status:"done"} : j)); showNotif("✅ Job marked done!"); };
  const markPaid = (name: string) => { setClients(p => p.map(c => c.name===name ? {...c,balance:0} : c)); showNotif("💰 Payment recorded!"); setPayModal(null); };
  const payStaff = (id: number) => { setStaff(p => p.map(s => s.id===id ? {...s,paid:true} : s)); showNotif("✅ Payment processed!"); };
  const addNewJob = () => {
    if (!newJobForm.client || !newJobForm.price) return;
    setJobs(p => [...p, { id:Date.now(), ...newJobForm, price:Number(newJobForm.price), status:"upcoming", paid:false, recurring:"one-off" }]);
    setJobModal(false); setNewJob({ client:"", address:"", time:"", price:"", notes:"" }); showNotif("✅ Job added!");
  };

  const statusC: any = { done:"#22c55e", "on-way":"#f59e0b", upcoming:"#94a3b8" };

  // ─── STYLES ──────────────────────────────────────────
  const S: any = {
    root: { maxWidth:430, margin:"0 auto", minHeight:"100vh", background:"#0a0a0a", color:"#f0ede8", fontFamily:"'DM Sans','Helvetica Neue',sans-serif", position:"relative", overflowX:"hidden" },
    hdr: { padding:"22px 20px 0", background:"linear-gradient(180deg,#141414 0%,#0a0a0a 100%)" },
    hdrRow: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 },
    greeting: { fontSize:12, color:"#555", letterSpacing:1, textTransform:"uppercase", fontWeight:700 },
    date: { fontSize:11, color:"#333", marginTop:2 },
    langBtn: { fontSize:11, color:"#555", background:"#161616", border:"1px solid #222", borderRadius:20, padding:"4px 12px", cursor:"pointer" },
    logoRow: { display:"flex", alignItems:"center", gap:8, marginBottom:16, marginTop:6 },
    logo: { fontSize:22, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 },
    logoDot: { width:8, height:8, borderRadius:"50%", background:"#ff5c00" },

    voiceWrap: { margin:"0 20px 16px", background:"linear-gradient(135deg,#ff5c00,#ff8500)", borderRadius:20, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, cursor:"pointer", boxShadow:"0 8px 32px #ff5c0033", border:"1px solid #ff850066", position:"relative", overflow:"hidden" },
    voiceGlow: { position:"absolute", inset:0, background:"radial-gradient(circle at 25% 50%,#fff2,transparent 60%)", pointerEvents:"none" },
    voiceIcon: { fontSize:26, flexShrink:0 },
    voiceMain: { fontSize:15, fontWeight:800, color:"#fff", letterSpacing:-0.3 },
    voiceSub: { fontSize:11, color:"#ffd4b8", marginTop:2 },

    stats: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 20px", marginBottom:20 },
    stat: (c: string) => ({ background:"#141414", borderRadius:16, padding:"14px 16px", borderBottom:`3px solid ${c}` }),
    statVal: (c: string) => ({ fontSize:26, fontWeight:900, color:c, lineHeight:1, letterSpacing:-1 }),
    statLbl: { fontSize:11, color:"#444", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginTop:4 },
    statSub: { fontSize:11, color:"#333", marginTop:3 },

    section: { padding:"0 20px", marginBottom:24 },
    secHdr: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 },
    secTitle: { fontSize:12, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1 },
    secAction: { fontSize:12, color:"#ff5c00", fontWeight:700, cursor:"pointer" },

    jobCard: (status: string) => ({ background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10, borderLeft:`4px solid ${statusC[status]||"#222"}` }),
    jobTime: { fontSize:11, color:"#444", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 },
    jobClient: { fontSize:17, fontWeight:800, color:"#f0ede8", margin:"3px 0", letterSpacing:-0.3 },
    jobAddr: { fontSize:12, color:"#444", marginBottom:8 },
    jobRow: { display:"flex", justifyContent:"space-between", alignItems:"center" },
    jobPrice: { fontSize:22, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 },
    jobStatus: (s: string) => ({ fontSize:11, fontWeight:700, color:statusC[s], background:statusC[s]+"22", borderRadius:20, padding:"3px 10px", border:`1px solid ${statusC[s]}44` }),
    doneBtn: { padding:"8px 16px", background:"#ff5c00", border:"none", borderRadius:10, color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer" },
    recurTag: { fontSize:10, color:"#333", background:"#1a1a1a", borderRadius:6, padding:"2px 7px", fontWeight:600 },

    owesCard: { background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" },
    owesName: { fontSize:15, fontWeight:700, color:"#f0ede8", marginBottom:3 },
    owesPhone: { fontSize:12, color:"#444" },
    owesAmt: { fontSize:22, fontWeight:900, color:"#f87171", letterSpacing:-0.5 },
    sendBtn: { marginTop:6, padding:"6px 12px", background:"#1a1a1a", border:"1px solid #222", borderRadius:8, color:"#f87171", fontWeight:700, fontSize:11, cursor:"pointer" },
    paidBtn: { marginTop:6, padding:"8px 14px", background:"#22c55e", border:"none", borderRadius:10, color:"#0a0a0a", fontWeight:800, fontSize:12, cursor:"pointer" },

    nav: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#0f0f0f", borderTop:"1px solid #1a1a1a", display:"grid", gridTemplateColumns:"repeat(4,1fr)", padding:"8px 0 20px", zIndex:100 },
    navItem: (a: boolean) => ({ display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"6px 0", opacity:a?1:0.35 }),
    navIcon: { fontSize:22 },
    navLbl: (a: boolean) => ({ fontSize:10, fontWeight:700, color:a?"#ff5c00":"#444", letterSpacing:0.3 }),

    overlay: { position:"fixed", inset:0, background:"#000d", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:999 },
    sheet: { background:"#141414", borderRadius:"24px 24px 0 0", padding:"24px 24px 44px", width:"100%", maxWidth:430, border:"1px solid #222" },
    sheetHandle: { width:40, height:4, background:"#2a2a2a", borderRadius:2, margin:"0 auto 20px" },
    sheetTitle: { fontSize:20, fontWeight:900, color:"#f0ede8", marginBottom:4, letterSpacing:-0.5 },
    sheetSub: { fontSize:13, color:"#444", marginBottom:20 },

    micBtn: (state: string) => ({ width:100, height:100, borderRadius:"50%", border:"none", background:state==="listening"?"#ef4444":"#ff5c00", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, cursor:"pointer", margin:"0 auto 20px", boxShadow:state==="listening"?"0 0 0 14px #ef444422,0 0 0 28px #ef444411":"0 0 0 10px #ff5c0033", transition:"all 0.3s" }),
    voiceDisplay: { background:"#0a0a0a", borderRadius:14, padding:"14px 16px", marginBottom:16, minHeight:60, fontSize:14, color:"#94a3b8", lineHeight:1.6, border:"1px solid #1e1e1e" },
    aiCard: { background:"#0a0a0a", borderRadius:14, padding:"16px", marginBottom:16, border:"1px solid #ff5c0033" },
    aiRow: { display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #1a1a1a" },
    aiKey: { fontSize:12, color:"#444", fontWeight:600 },
    aiVal: { fontSize:13, color:"#f0ede8", fontWeight:700 },

    formField: { marginBottom:14 },
    formLabel: { fontSize:11, color:"#444", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:6 },
    formInp: { width:"100%", padding:"12px 14px", background:"#0a0a0a", border:"1px solid #222", borderRadius:12, color:"#f0ede8", fontSize:15, outline:"none", boxSizing:"border-box" as any },

    bigBtn: (c?: string) => ({ width:"100%", padding:"16px", background:c||"#ff5c00", border:c==="transparent"?"1px solid #222":"none", borderRadius:14, color:c==="transparent"?"#444":"#fff", fontSize:16, fontWeight:800, cursor:"pointer", letterSpacing:-0.3, marginBottom:10 }),
    notif: { position:"fixed" as any, top:20, left:"50%", transform:"translateX(-50%)", background:"#22c55e", color:"#fff", padding:"12px 20px", borderRadius:14, fontWeight:700, fontSize:14, zIndex:9999, whiteSpace:"nowrap" as any, boxShadow:"0 8px 24px #0008" },
  };

  const navItems = [
    { id:"today",   icon:"🏠", label:"Today"   },
    { id:"money",   icon:"💰", label:"Money"   },
    { id:"clients", icon:"👥", label:"Clients" },
    { id:"staff",   icon:"👷", label:"Staff"   },
  ];

  // ─── TODAY ───────────────────────────────────────────
  const renderToday = () => (
    <>
      <div style={S.hdr}>
        <div style={S.hdrRow}>
          <div>
            <div style={S.greeting}>G'day Boss 👋</div>
            <div style={S.date}>{TODAY}</div>
          </div>
          <button style={S.langBtn} onClick={() => setLang(l => l==="en"?"zh":"en")}>
            {lang==="en" ? "中文" : "English"}
          </button>
        </div>
        <div style={S.logoRow}>
          <div style={S.logoDot}/>
          <div style={S.logo}>JobMate</div>
        </div>
      </div>

      <div style={S.voiceWrap} onClick={() => { setVoice(true); setVState("idle"); }}>
        <div style={S.voiceGlow}/>
        <div style={S.voiceIcon}>🎙️</div>
        <div style={{ flex:1 }}>
          <div style={S.voiceMain}>{lang==="en" ? "Tap to Log a Job" : "点击录入工作"}</div>
          <div style={S.voiceSub}>{lang==="en" ? '"Just cleaned Mike\'s, $220, send invoice"' : '"刚打扫了Mike家，$220，发发票"'}</div>
        </div>
        <div style={{ fontSize:18, color:"#fff8" }}>→</div>
      </div>

      <div style={S.stats}>
        <div style={S.stat("#22c55e")}>
          <div style={S.statVal("#22c55e")}>${todayEarned}</div>
          <div style={S.statLbl}>Earned Today</div>
          <div style={S.statSub}>{doneJobs}/{jobs.length} jobs done</div>
        </div>
        <div style={{ ...S.stat("#f87171"), cursor:"pointer" }} onClick={() => setScreen("money")}>
          <div style={S.statVal("#f87171")}>${owesTotal}</div>
          <div style={S.statLbl}>Owed to Me</div>
          <div style={S.statSub}>{owesList.length} clients →</div>
        </div>
      </div>

      <div style={S.section}>
        <div style={S.secHdr}>
          <div style={S.secTitle}>Today's Jobs</div>
          <div style={S.secAction} onClick={() => setJobModal(true)}>+ Add Job</div>
        </div>
        {jobs.map(job => (
          <div key={job.id} style={S.jobCard(job.status)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={S.jobTime}>{job.time}</div>
              <span style={S.recurTag}>{job.recurring}</span>
            </div>
            <div style={S.jobClient}>{job.client}</div>
            <div style={S.jobAddr}>📍 {job.address}</div>
            {job.notes && <div style={{ fontSize:12, color:"#444", marginBottom:8, fontStyle:"italic" }}>💬 {job.notes}</div>}
            <div style={S.jobRow}>
              <div style={S.jobPrice}>${job.price}<span style={{ fontSize:12, color:"#444", fontWeight:400 }}> inc GST</span></div>
              {job.status==="done"
                ? <span style={S.jobStatus("done")}>Done ✓</span>
                : <button style={S.doneBtn} onClick={() => markJobDone(job.id)}>{job.status==="on-way" ? "✓ Done" : "Start →"}</button>
              }
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  // ─── MONEY ───────────────────────────────────────────
  const renderMoney = () => (
    <>
      <div style={S.hdr}>
        <div style={S.hdrRow}>
          <div style={S.logoRow}><div style={S.logoDot}/><div style={S.logo}>JobMate</div></div>
        </div>
        <div style={{ fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5, marginBottom:4 }}>Who Owes Me 💰</div>
        <div style={{ display:"flex", gap:8, paddingBottom:16 }}>
          <div style={{ flex:1, background:"#141414", borderRadius:14, padding:"12px 14px", borderBottom:"3px solid #f87171" }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#f87171", letterSpacing:-1 }}>${owesTotal}</div>
            <div style={{ fontSize:11, color:"#444", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginTop:3 }}>Total Owed</div>
          </div>
          <div style={{ flex:1, background:"#141414", borderRadius:14, padding:"12px 14px", borderBottom:"3px solid #22c55e" }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#22c55e", letterSpacing:-1 }}>{owesList.length}</div>
            <div style={{ fontSize:11, color:"#444", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginTop:3 }}>Clients</div>
          </div>
        </div>
      </div>
      <div style={{ padding:"16px 20px" }}>
        {owesList.length===0 ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
            <div style={{ fontWeight:700, fontSize:16, color:"#444" }}>Everyone's paid up!</div>
          </div>
        ) : owesList.map(c => (
          <div key={c.id} style={S.owesCard}>
            <div>
              <div style={S.owesName}>{c.name}</div>
              <div style={S.owesPhone}>{c.phone}</div>
              <button style={S.sendBtn} onClick={() => showNotif(`📱 Reminder sent to ${c.name}`)}>Send Reminder</button>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={S.owesAmt}>${c.balance}</div>
              <button style={S.paidBtn} onClick={() => setPayModal(c)}>✓ Paid</button>
            </div>
          </div>
        ))}
        <div style={{ marginTop:20 }}>
          <div style={{ fontSize:11, color:"#2a2a2a", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>All Clear ✓</div>
          {clients.filter(c => c.balance===0).map(c => (
            <div key={c.id} style={{ ...S.owesCard, opacity:0.4 }}>
              <div><div style={{ ...S.owesName, color:"#444" }}>{c.name}</div><div style={S.owesPhone}>{c.recurring} · ${c.price}</div></div>
              <div style={{ fontSize:16, color:"#22c55e", fontWeight:800 }}>✓</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  // ─── CLIENTS ─────────────────────────────────────────
  const renderClients = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.logoDot}/><div style={S.logo}>JobMate</div></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 }}>My Clients 👥</div>
          <div style={S.secAction}>+ New Client</div>
        </div>
      </div>
      <div style={{ padding:"16px 20px" }}>
        {clients.map(c => (
          <div key={c.id} style={{ background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:"#f0ede8", marginBottom:2 }}>{c.name}</div>
                <div style={{ fontSize:12, color:"#444" }}>{c.phone}</div>
                <div style={{ fontSize:12, color:"#444", marginTop:2 }}>📍 {c.address}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginLeft:10 }}>
                <div style={{ fontSize:18, fontWeight:900, color:"#f0ede8" }}>${c.price}</div>
                <span style={{ fontSize:10, color:"#444", background:"#1a1a1a", borderRadius:6, padding:"2px 7px" }}>{c.recurring}</span>
                {c.balance > 0 && <div style={{ fontSize:12, color:"#f87171", fontWeight:700, marginTop:4 }}>Owes ${c.balance}</div>}
              </div>
            </div>
            <div style={{ display:"flex", gap:6, marginTop:12 }}>
              {[["📞 Call","#94a3b8"],["🧾 Invoice","#ff5c00"],["📋 Book","#38bdf8"]].map(([lbl,col]) => (
                <button key={lbl as string} style={{ flex:1, padding:"8px", background:"#1a1a1a", border:"1px solid #222", borderRadius:10, color:col as string, fontSize:11, fontWeight:700, cursor:"pointer" }}
                  onClick={() => showNotif(`${lbl} — ${c.name}`)}>{lbl}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  // ─── STAFF ───────────────────────────────────────────
  const renderStaff = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.logoDot}/><div style={S.logo}>JobMate</div></div>
        <div style={{ fontSize:20, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5, marginBottom:4 }}>Pay My Staff 👷</div>
        <div style={{ fontSize:12, color:"#444", marginBottom:14 }}>STP submitted to ATO automatically</div>
        {staffOwed > 0 && (
          <div style={{ background:"#141414", borderRadius:14, padding:"12px 16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:11, color:"#444", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>To Pay This Week</div>
              <div style={{ fontSize:26, fontWeight:900, color:"#f87171", letterSpacing:-1, marginTop:4 }}>${staffOwed.toLocaleString()}</div>
            </div>
            <button style={{ padding:"12px 20px", background:"#ff5c00", border:"none", borderRadius:12, color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer" }}
              onClick={() => { setStaff(p => p.map(s => ({...s,paid:true}))); showNotif("✅ All staff paid! STP submitted."); }}>
              Pay All
            </button>
          </div>
        )}
      </div>
      <div style={{ padding:"0 20px" }}>
        {staff.map(s => {
          const gross = s.hours * s.rate;
          const tax = Math.round(gross * 0.19);
          const net = gross - tax;
          return (
            <div key={s.id} style={{ background:"#141414", borderRadius:16, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#f0ede8" }}>{s.name}</div>
                  <div style={{ fontSize:12, color:"#444", marginTop:2 }}>{s.role} · {s.hours}hrs @ ${s.rate}/hr</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:s.paid?"#22c55e":"#f0ede8", letterSpacing:-0.5 }}>${net}</div>
                  <div style={{ fontSize:10, color:"#444" }}>net · tax ${tax}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ flex:1, height:4, background:"#1a1a1a", borderRadius:2 }}>
                  <div style={{ width:`${(s.hours/40)*100}%`, height:"100%", background:s.paid?"#22c55e":"#ff5c00", borderRadius:2 }}/>
                </div>
                <button style={{ padding:"8px 16px", borderRadius:10, fontWeight:800, fontSize:12, cursor:s.paid?"default":"pointer", border:"none", background:s.paid?"#1a2a1a":"#22c55e", color:s.paid?"#22c55e":"#0a0a0a" }}
                  onClick={() => !s.paid && payStaff(s.id)}>{s.paid ? "✓ Paid" : "Pay Now"}</button>
              </div>
              {s.paid && <div style={{ fontSize:11, color:"#22c55e", marginTop:8, fontWeight:600 }}>✅ ATO STP submitted automatically</div>}
            </div>
          );
        })}
        <div style={{ background:"#141414", border:"1px solid #1e1e1e", borderRadius:14, padding:"12px 14px", marginTop:8 }}>
          <div style={{ fontSize:12, color:"#555", lineHeight:1.8 }}>
            💡 <strong style={{ color:"#f0ede8" }}>Single Touch Payroll</strong> — Every time you pay staff, JobMate reports to the ATO instantly. No extra steps needed.
          </div>
        </div>
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 10px #ef444420,0 0 0 20px #ef444410} 50%{box-shadow:0 0 0 18px #ef444410,0 0 0 36px transparent} }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input { font-family: inherit; }
        button { font-family: inherit; }
      `}</style>

      {screen==="today"   && renderToday()}
      {screen==="money"   && renderMoney()}
      {screen==="clients" && renderClients()}
      {screen==="staff"   && renderStaff()}

      {/* NAV */}
      <div style={S.nav}>
        {navItems.map(n => (
          <div key={n.id} style={S.navItem(screen===n.id)} onClick={() => setScreen(n.id)}>
            <div style={S.navIcon}>{n.icon}</div>
            <div style={S.navLbl(screen===n.id)}>{n.label}</div>
          </div>
        ))}
      </div>

      {/* VOICE MODAL */}
      {voiceModal && (
        <div style={S.overlay} onClick={(e:any) => e.target===e.currentTarget && setVoice(false)}>
          <div style={S.sheet}>
            <div style={S.sheetHandle}/>
            {voiceState==="idle" && <>
              <div style={S.sheetTitle}>Log a Job 🎙️</div>
              <div style={S.sheetSub}>Just talk. AI does the rest.</div>
              <div style={{ background:"#0a0a0a", borderRadius:14, padding:"14px", marginBottom:20, border:"1px solid #1e1e1e" }}>
                <div style={{ fontSize:12, color:"#444", marginBottom:8, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>Try saying</div>
                {['"Just cleaned Chen\'s, $180, send invoice"','"Done Mike Strathfield, windows extra, $220"','"New client Sarah Burwood, $160 monthly"'].map((e,i) => (
                  <div key={i} style={{ fontSize:13, color:"#666", padding:"7px 0", borderBottom:"1px solid #141414", lineHeight:1.5 }}>{e}</div>
                ))}
              </div>
              <button style={S.micBtn("idle")} onClick={startVoice}>🎙️</button>
              <div style={{ textAlign:"center", color:"#444", fontSize:13, marginBottom:20 }}>Tap mic to start</div>
              <button style={S.bigBtn("transparent")} onClick={() => setVoice(false)}>Cancel</button>
            </>}

            {voiceState==="listening" && <>
              <div style={S.sheetTitle}>Listening... 🔴</div>
              <div style={S.sheetSub}>Speak naturally, tap to stop</div>
              <button style={{ ...S.micBtn("listening"), animation:"pulse 1.5s infinite" }} onClick={stopVoice}>⏹</button>
              <div style={S.voiceDisplay}>{voiceText || <span style={{ color:"#2a2a2a" }}>Waiting...</span>}</div>
              <button style={S.bigBtn("transparent")} onClick={() => { clearInterval(timerRef.current); setVState("idle"); }}>Cancel</button>
            </>}

            {voiceState==="processing" && <>
              <div style={S.sheetTitle}>Got it... ⚡</div>
              <div style={S.sheetSub}>AI is building your invoice</div>
              <div style={{ textAlign:"center", padding:"36px 0", fontSize:44 }}>⚙️</div>
              <div style={S.voiceDisplay}>{voiceText}</div>
            </>}

            {voiceState==="done" && aiResult && <>
              <div style={S.sheetTitle}>Ready to send ✅</div>
              <div style={S.sheetSub}>Check the details, then confirm</div>
              <div style={S.aiCard}>
                {[["Client",aiResult.client],["Hours",`${aiResult.hours} hours`],["Amount",`$${aiResult.price} (inc. GST)`],["Notes",aiResult.notes],["Invoice","Sent automatically ✉️"]].map(([k,v]) => (
                  <div key={k} style={S.aiRow}><span style={S.aiKey}>{k}</span><span style={S.aiVal}>{v}</span></div>
                ))}
              </div>
              <button style={S.bigBtn()} onClick={confirmVoiceJob}>✅ Confirm & Send Invoice</button>
              <button style={S.bigBtn("transparent")} onClick={() => setVState("idle")}>← Try Again</button>
            </>}
          </div>
        </div>
      )}

      {/* ADD JOB MODAL */}
      {jobModal && (
        <div style={S.overlay} onClick={(e:any) => e.target===e.currentTarget && setJobModal(false)}>
          <div style={S.sheet}>
            <div style={S.sheetHandle}/>
            <div style={S.sheetTitle}>New Job 📋</div>
            <div style={S.sheetSub}>Fill in the basics</div>
            {([["CLIENT","client","Chen Family","text"],["ADDRESS","address","12 Rose St, Parramatta","text"],["TIME","time","9:00 AM","text"],["PRICE ($)","price","180","number"],["NOTES","notes","Key under mat…","text"]] as [string,string,string,string][]).map(([label,key,ph,type]) => (
              <div key={key} style={S.formField}>
                <label style={S.formLabel}>{label}</label>
                <input style={S.formInp} type={type} placeholder={ph}
                  value={(newJobForm as any)[key]} onChange={(e:any) => setNewJob((p:any) => ({...p,[key]:e.target.value}))}/>
              </div>
            ))}
            <button style={S.bigBtn()} onClick={addNewJob}>✅ Add Job</button>
            <button style={S.bigBtn("transparent")} onClick={() => setJobModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* MARK PAID MODAL */}
      {payModal && (
        <div style={S.overlay} onClick={(e:any) => e.target===e.currentTarget && setPayModal(null)}>
          <div style={S.sheet}>
            <div style={S.sheetHandle}/>
            <div style={S.sheetTitle}>Mark as Paid 💰</div>
            <div style={S.sheetSub}>{payModal.name} · ${payModal.balance}</div>
            <div style={{ background:"#0a0a0a", borderRadius:14, padding:"14px", marginBottom:16, border:"1px solid #1e1e1e" }}>
              {[["Client",payModal.name],["Amount",`$${payModal.balance}`],["Phone",payModal.phone]].map(([k,v]) => (
                <div key={k} style={S.aiRow}><span style={S.aiKey}>{k}</span><span style={S.aiVal}>{v}</span></div>
              ))}
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={S.formLabel}>How did they pay?</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {["Bank Transfer","Cash","PayID","Card"].map(m => (
                  <button key={m} style={{ padding:"12px", background:"#1a1a1a", border:"1px solid #222", borderRadius:10, color:"#94a3b8", fontWeight:700, fontSize:13, cursor:"pointer" }}>{m}</button>
                ))}
              </div>
            </div>
            <button style={S.bigBtn("#22c55e")} onClick={() => markPaid(payModal.name)}>✅ Mark as Paid</button>
            <button style={S.bigBtn("transparent")} onClick={() => setPayModal(null)}>Cancel</button>
          </div>
        </div>
      )}

      {notif && <div style={S.notif}>{notif}</div>}
    </div>
  );
}
