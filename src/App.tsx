import { useState, useRef } from "react";

// ═══ TRANSLATIONS ════════════════════════════════════════
const T: any = {
  en: {
    appName:"SimplyProject",
    appTagline:"The simplest job & invoice app for tradies.",
    whats_trade:"What's your trade?",
    greeting_morning:"Good morning", greeting_afternoon:"Good afternoon", greeting_evening:"Good evening",
    home:"Home", jobs:"Jobs", invoices:"Invoices", quotes:"Quotes", clients:"Clients", settings:"Settings",
    new_job:"New Job", voice_job:"Voice Job", send_invoice:"Invoice",
    money_in:"Money In", money_owed:"Money Owed", jobs_today:"Jobs Today",
    overdue_alert:"Overdue Invoice", view_arrow:"View →",
    todays_jobs:"Today's Jobs", see_all:"See all →", unpaid:"Unpaid Invoices",
    done_status:"Done ✓", inprog_status:"In Progress", upcoming_status:"Upcoming",
    start_btn:"Start →", done_btn:"✓ Done",
    remind_btn:"📱 Remind", paid_btn:"✓ Mark Paid",
    reminded:"Reminder sent to", payment_ok:"💰 Payment recorded!",
    job_done_ok:"✅ Job done!", job_added_ok:"✅ Job added!",
    inv_sent_ok:"✅ Invoice sent!", quote_sent_ok:"✅ Quote sent!", client_added_ok:"✅ Client added!",
    voice_ok:"✅ Job logged & invoice sent to",
    voice_title:"Voice Job 🎙️", voice_sub:"Just talk — job + invoice created instantly",
    listening:"Listening…", listening_sub:"Speak naturally — tap ⏹ to stop",
    processing:"Got it ⚙️", processing_sub:"Building your job & invoice…",
    result_title:"Ready ✅", result_sub:"Check details then confirm",
    confirm_btn:"✅ Confirm & Send Invoice", retry_btn:"← Try Again",
    tap_start:"Tap to start", try_saying:"Try saying",
    cancel:"Cancel", close:"Close",
    cust_lbl:"Customer", type_lbl:"Job Type", billing_lbl:"Billing",
    hours_lbl:"Hours", rate_lbl:"Rate ($/hr)", mat_lbl:"Materials ($)", labour_lbl:"Labour ($)",
    addr_lbl:"Address / Site", time_lbl:"Start Time", notes_lbl:"Notes", phone_lbl:"Phone", name_lbl:"Name",
    create_job_btn:"✅ Create Job", send_inv_btn:"✅ Send Invoice",
    send_quote_btn:"✅ Send Quote", add_client_btn:"✅ Add Client",
    total_gst:"Total inc GST", quote_total:"Quote Total",
    new_job_h:"New Job 🔩", new_inv_h:"New Invoice 🧾", new_quote_h:"New Quote 📋", new_cust_h:"New Client 👥",
    job_steps:"3 steps: Customer → Job → Cost",
    inv_steps:"Send in seconds", quote_steps:"Convert to job in one tap when accepted",
    cust_steps:"Add once, use forever",
    access_ph:"Access notes, preferences…", scope_ph:"Scope of work…",
    opt_ph:"Optional notes…", site_ph:"Job site address", req_ph:"Requirements, access notes…",
    overdue:"overdue", sent:"sent", paid:"paid", pending:"pending",
    labour_row:"Labour", materials_row:"Materials", none_val:"None",
    settings_h:"Settings ⚙️",
    lang_setting:"Language", lang_sub:"App display language",
    color_setting:"Theme Colour", color_sub:"Choose your accent colour",
    trade_setting:"Your Trade", trade_sub:"Switch to a different trade",
    cal_setting:"Calendar View", cal_sub:"Show jobs in iOS calendar style",
    about_setting:"About SimplyProject", version_val:"Version 1.0 · Future One Pty Ltd",
    no_jobs:"No jobs yet · tap + New Job",
    no_quotes_h:"No quotes yet", no_quotes_s:"Send a quote, convert to job in one tap",
    convert_btn:"→ Convert to Job",
    all_clear:"All paid ✓", owes:"Owes",
    list_view:"List", cal_view:"Calendar",
    invoice_btn:"🧾 Invoice", book_btn:"📋 Quote", job_btn:"🔩 Job", call_btn:"📞 Call",
    week_days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    photos:"Photos", add_photo:"+ Add Photo", no_photos:"No photos yet",
    wa_invoice:"WhatsApp Invoice", wa_remind:"WhatsApp Remind",
    send_via:"Send via", whatsapp:"WhatsApp", email:"Email",
    get_started:"Get Started Free →", learn_more:"See how it works ↓",
    hero_title:"Stop chasing invoices.", hero_sub:"Log jobs, send invoices, track quotes — all by voice. Built for Australian tradies.",
    feat1_t:"Voice Entry", feat1_d:"Talk after a job — SimplyProject creates the record and sends the invoice automatically.",
    feat2_t:"Full Workflow", feat2_d:"Jobs → Quotes → Invoices → Paid. The complete tradie workflow in one app.",
    feat3_t:"Calendar View", feat3_d:"See your week at a glance. Colour-coded jobs, tap any day for details.",
    feat4_t:"Bilingual", feat4_d:"English & Chinese. Switch instantly in Settings.",
    feat5_t:"Job Photos", feat5_d:"Photograph the job before and after. Everything in one place.",
    feat6_t:"WhatsApp Invoices", feat6_d:"Send invoices and reminders via WhatsApp in one tap.",
    try_demo:"Try the Demo →",
    built_au:"Built in Australia · For Australian tradies",
  },
  zh: {
    appName:"SimplyProject",
    appTagline:"最简单的工单和发票管理软件。",
    whats_trade:"选择你的行业",
    greeting_morning:"早上好", greeting_afternoon:"下午好", greeting_evening:"晚上好",
    home:"主页", jobs:"工作", invoices:"发票", quotes:"报价", clients:"客户", settings:"设置",
    new_job:"新工作", voice_job:"语音录入", send_invoice:"发票",
    money_in:"今日收入", money_owed:"待收款项", jobs_today:"今日工作",
    overdue_alert:"逾期发票", view_arrow:"查看 →",
    todays_jobs:"今日工作", see_all:"查看全部 →", unpaid:"未付发票",
    done_status:"完成 ✓", inprog_status:"进行中", upcoming_status:"待开始",
    start_btn:"开始 →", done_btn:"✓ 完成",
    remind_btn:"📱 发提醒", paid_btn:"✓ 标记已付",
    reminded:"提醒已发送给", payment_ok:"💰 付款已记录！",
    job_done_ok:"✅ 工作完成！", job_added_ok:"✅ 工作已添加！",
    inv_sent_ok:"✅ 发票已发送！", quote_sent_ok:"✅ 报价已发送！", client_added_ok:"✅ 客户已添加！",
    voice_ok:"✅ 工作已记录，发票已发送给",
    voice_title:"语音录入 🎙️", voice_sub:"说话即可 — AI自动建工作并发发票",
    listening:"正在听…", listening_sub:"自然说话，点 ⏹ 停止",
    processing:"收到了 ⚙️", processing_sub:"正在生成工作和发票…",
    result_title:"准备好了 ✅", result_sub:"确认信息后提交",
    confirm_btn:"✅ 确认并发送发票", retry_btn:"← 重试",
    tap_start:"点击开始", try_saying:"试着说",
    cancel:"取消", close:"关闭",
    cust_lbl:"客户", type_lbl:"工作类型", billing_lbl:"收费方式",
    hours_lbl:"小时", rate_lbl:"时薪 ($/hr)", mat_lbl:"材料费 ($)", labour_lbl:"人工费 ($)",
    addr_lbl:"地址", time_lbl:"开始时间", notes_lbl:"备注", phone_lbl:"电话", name_lbl:"姓名",
    create_job_btn:"✅ 创建工作", send_inv_btn:"✅ 发送发票",
    send_quote_btn:"✅ 发送报价", add_client_btn:"✅ 添加客户",
    total_gst:"含税总额", quote_total:"报价总额",
    new_job_h:"新工作 🔩", new_inv_h:"新发票 🧾", new_quote_h:"新报价 📋", new_cust_h:"新客户 👥",
    job_steps:"3步：客户 → 工作 → 费用",
    inv_steps:"几秒钟发送", quote_steps:"客户接受后一键转为工作",
    cust_steps:"添加一次，永久使用",
    access_ph:"进门方式、注意事项…", scope_ph:"工作范围描述…",
    opt_ph:"选填备注…", site_ph:"工作地址", req_ph:"要求、进门方式…",
    overdue:"逾期", sent:"已发送", paid:"已付款", pending:"待确认",
    labour_row:"人工费", materials_row:"材料费", none_val:"无",
    settings_h:"设置 ⚙️",
    lang_setting:"语言", lang_sub:"应用显示语言",
    color_setting:"主题颜色", color_sub:"选择强调色",
    trade_setting:"行业", trade_sub:"切换到其他行业",
    cal_setting:"日历视图", cal_sub:"以iOS日历方式显示工作",
    about_setting:"关于 SimplyProject", version_val:"版本 1.0 · Future One Pty Ltd",
    no_jobs:"今天还没有工作 · 点击 + 新工作",
    no_quotes_h:"暂无报价", no_quotes_s:"发送报价后可一键转为工作",
    convert_btn:"→ 转为工作",
    all_clear:"全部已付 ✓", owes:"欠款",
    list_view:"列表", cal_view:"日历",
    invoice_btn:"🧾 发票", book_btn:"📋 报价", job_btn:"🔩 工作", call_btn:"📞 电话",
    week_days:["周日","周一","周二","周三","周四","周五","周六"],
    photos:"照片", add_photo:"+ 添加照片", no_photos:"暂无照片",
    wa_invoice:"WhatsApp发票", wa_remind:"WhatsApp提醒",
    send_via:"发送方式", whatsapp:"WhatsApp", email:"邮件",
    get_started:"免费开始体验 →", learn_more:"了解功能 ↓",
    hero_title:"不再追着客户付款。", hero_sub:"语音录入工作，自动发发票，一键跟进。专为澳洲技工设计。",
    feat1_t:"语音录入", feat1_d:"工作结束直接说话，自动生成工单并发送发票。",
    feat2_t:"完整流程", feat2_d:"报价 → 工作 → 发票 → 收款。全部在一个App里。",
    feat3_t:"日历视图", feat3_d:"一眼看清本周工作安排，颜色区分工作状态。",
    feat4_t:"中英双语", feat4_d:"中文/English一键切换，为多元化澳洲技工设计。",
    feat5_t:"工作照片", feat5_d:"拍摄工作前后照片，全部保存在工单里。",
    feat6_t:"WhatsApp发票", feat6_d:"一键通过WhatsApp发送发票和付款提醒。",
    try_demo:"体验Demo →",
    built_au:"澳洲制造 · 专为澳洲技工",
  },
};

// ═══ THEMES ══════════════════════════════════════════════
const THEMES: any = {
  orange:{ label:"Orange", zh:"橙色", hex:"#ff6b35" },
  amber: { label:"Amber",  zh:"琥珀", hex:"#f59e0b" },
  yellow:{ label:"Yellow", zh:"黄色", hex:"#facc15" },
  green: { label:"Green",  zh:"绿色", hex:"#22c55e" },
  teal:  { label:"Teal",   zh:"青绿", hex:"#2dd4bf" },
  blue:  { label:"Blue",   zh:"蓝色", hex:"#38bdf8" },
  violet:{ label:"Violet", zh:"紫色", hex:"#a78bfa" },
  pink:  { label:"Pink",   zh:"粉色", hex:"#fb7185" },
  white: { label:"White",  zh:"白色", hex:"#e2e8f0" },
};

// ═══ INDUSTRIES ══════════════════════════════════════════
const IND: any = {
  elec:    { en:"Electrician",   zh:"电工",     icon:"⚡", color:"#facc15",
    types:["Fault Finding","Switchboard Upgrade","Solar Install","New Installation","Rewire","Safety Inspection","EV Charger","Powerpoint Install"],
    typesZh:["故障排查","配电箱升级","太阳能安装","新线路","重新布线","安全检查","充电桩","插座安装"],
    billing:["Hourly","Per Job","Callout + Materials"], billingZh:["按小时","按工程","上门+材料"], rate:95 },
  plumber: { en:"Plumber",       zh:"水管工",   icon:"🔧", color:"#38bdf8",
    types:["Blocked Drain","Burst Pipe","Hot Water System","Gas Fitting","Bathroom Reno","Leak Detection","New Tapware","Sewer Inspection"],
    typesZh:["疏通排水","爆管维修","热水器","燃气管道","浴室装修","漏水检测","新水龙头","下水道"],
    billing:["Callout + Materials","Hourly","Per Job"], billingZh:["上门+材料","按小时","按工程"], rate:110 },
  handyman:{ en:"Handyman",      zh:"杂工",     icon:"🔨", color:"#a78bfa",
    types:["Flat Pack Assembly","Fence Repair","Painting","Gutter Clean","Tiling","General Repairs","TV Wall Mount","Pressure Washing"],
    typesZh:["组装家具","围栏维修","刷漆","清理水槽","贴瓷砖","综合维修","挂电视","高压水枪"],
    billing:["Hourly","Per Job","Half Day","Full Day"], billingZh:["按小时","按工程","半天","全天"], rate:65 },
  windows: { en:"Door & Window",  zh:"门窗安装", icon:"🪟", color:"#34d399",
    types:["Window Install","Door Install","Security Screen","Bifold Door","Flyscreen Repair","Double Glazing","Roller Shutter","Window Lock"],
    typesZh:["窗户安装","门安装","防盗纱窗","折叠门","纱窗维修","双层玻璃","卷帘门","窗锁"],
    billing:["Per Job","Supply & Install","Labour Only"], billingZh:["按工程","供货+安装","仅人工"], rate:90 },
  cleaning:{ en:"Cleaning",       zh:"清洁",     icon:"🧹", color:"#fb7185",
    types:["Regular Clean","End of Lease","Office Clean","Spring Clean","Carpet Steam","After Builder","Move In/Out","Window Clean"],
    typesZh:["日常清洁","退租清洁","办公室清洁","大扫除","地毯蒸洗","工后清洁","搬家清洁","玻璃清洁"],
    billing:["Per Job","Hourly","Weekly","Fortnightly"], billingZh:["按次","按小时","每周","每两周"], rate:45 },
  other:   { en:"Other Trade",    zh:"其他行业", icon:"🛠️", color:"#94a3b8",
    types:["Installation","Repair","Maintenance","Inspection","Supply & Install","Labour Only","Project Work","Consultation"],
    typesZh:["安装","维修","保养","检查","供货+安装","仅人工","项目工程","咨询"],
    billing:["Hourly","Per Job","Day Rate","Supply & Install"], billingZh:["按小时","按工程","按天","供货+安装"], rate:75 },
};

const SEED_CUSTOMERS = [
  { id:1, name:"Zhang Wei",      phone:"0412 345 678", address:"12 Rose St, Parramatta",    notes:"Side gate open" },
  { id:2, name:"Mike Johnson",   phone:"0423 456 789", address:"55 Oak Ave, Strathfield",   notes:"Key under mat" },
  { id:3, name:"Sarah Williams", phone:"0434 567 890", address:"8 Park Rd, Burwood",        notes:"Morning preferred" },
  { id:4, name:"Wang Fang",      phone:"0445 678 901", address:"3 Elm St, Chatswood",       notes:"Invoice to email" },
  { id:5, name:"Dave Brown",     phone:"0456 789 012", address:"100 George St, Sydney CBD", notes:"ABN invoice needed" },
];

const mkJobs = (ind: any) => {
  const d = (n: number) => { const x = new Date(); x.setDate(x.getDate()+n); return x; };
  return [
    { id:1, customerName:"Zhang Wei",     phone:"0412 345 678", address:"12 Rose St, Parramatta",  jobType:ind.types[1], date:d(0), time:"8:00 AM",  hours:3, rate:ind.rate, labour:ind.rate*3, materials:140, status:"done",        invoiced:true,  paid:true,  billing:ind.billing[0], notes:"All good",    photos:[] },
    { id:2, customerName:"Mike Johnson",  phone:"0423 456 789", address:"55 Oak Ave, Strathfield", jobType:ind.types[0], date:d(0), time:"10:30 AM", hours:4, rate:ind.rate, labour:ind.rate*4, materials:85,  status:"in-progress", invoiced:false, paid:false, billing:ind.billing[0], notes:"60A switch",  photos:[] },
    { id:3, customerName:"Sarah Williams",phone:"0434 567 890", address:"8 Park Rd, Burwood",      jobType:ind.types[2], date:d(0), time:"1:00 PM",  hours:5, rate:ind.rate, labour:ind.rate*5, materials:320, status:"upcoming",    invoiced:false, paid:false, billing:ind.billing[1], notes:"Roof access", photos:[] },
    { id:4, customerName:"Wang Fang",     phone:"0445 678 901", address:"3 Elm St, Chatswood",     jobType:ind.types[3], date:d(1), time:"9:00 AM",  hours:2, rate:ind.rate, labour:ind.rate*2, materials:0,   status:"upcoming",    invoiced:false, paid:false, billing:ind.billing[0], notes:"",            photos:[] },
    { id:5, customerName:"Dave Brown",    phone:"0456 789 012", address:"100 George St, Sydney",   jobType:ind.types[0], date:d(2), time:"7:30 AM",  hours:6, rate:ind.rate, labour:ind.rate*6, materials:200, status:"upcoming",    invoiced:false, paid:false, billing:ind.billing[0], notes:"Commercial",  photos:[] },
  ];
};
const mkInvoices = (ind: any) => [
  { id:101, customerName:"Mike Johnson",   phone:"0423 456 789", jobType:ind.types[0], amount:ind.rate*4+85,  date:"Today",     due:"14 days", status:"sent",    paid:false },
  { id:102, customerName:"Sarah Williams", phone:"0434 567 890", jobType:ind.types[2], amount:ind.rate*5+320, date:"Yesterday", due:"7 days",  status:"overdue", paid:false },
  { id:103, customerName:"Dave Brown",     phone:"0456 789 012", jobType:ind.types[1], amount:ind.rate*6+200, date:"3 days ago",due:"Paid",    status:"paid",    paid:true  },
  { id:104, customerName:"Wang Fang",      phone:"0445 678 901", jobType:ind.types[3], amount:ind.rate*2,     date:"5 days ago",due:"Paid",    status:"paid",    paid:true  },
];

const uid  = () => Date.now() + Math.floor(Math.random()*999);
const fmt  = (n: number) => `$${Math.round(n).toLocaleString()}`;

const VOICE_SAMPLES: any = {
  elec:    ['"Fixed fault at Zhang Wei, labour $190, materials $85, send invoice"','"Switchboard upgrade Mike, 4 hours, parts $320, invoice him"','"Solar install Wang Fang, $1800 labour, panels $2800"'],
  plumber: ['"Unblocked drain Zhang Wei, 2 hours, $220, send invoice"','"Hot water system Sarah, parts $1200, 4 hours labour"','"Burst pipe Mike, materials $140, labour $330, invoice"'],
  handyman:['"Flat pack at Zhang Wei, 3 hours, $195, send invoice"','"Fence repair Sarah, 5 hours plus $80 timber, $405"','"Painted Dave Brown office, full day $520, invoice"'],
  windows: ['"4 windows Zhang Wei, supply and install $2400, invoice"','"Security screen Mike, labour only $270, send invoice"','"Bifold door Wang Fang, $1800, invoice"'],
  cleaning:['"Cleaned Zhang Wei, 3 hours, $180, send invoice"','"End of lease Mike, $450 flat rate, invoice"','"Office clean Dave Brown, $350, invoice"'],
  other:   ['"Job at Zhang Wei, 4 hours, $300, send invoice"','"Installation Sarah, supply and install $850, invoice"','"Repair Mike, 2 hours plus $120 materials, invoice"'],
};

const parseVoice = (text: string, ind: any, custs: any[]) => {
  const low = text.toLowerCase();
  const amounts = [...low.matchAll(/\$(\d+)/g)].map(m=>parseInt(m[1]));
  const labour = amounts[0]||ind.rate*2, materials = amounts[1]||0;
  const total = amounts[amounts.length-1]||labour+materials;
  const hm = low.match(/(\d+)\s*hour/); const hours = hm?parseInt(hm[1]):2;
  const cust = custs.find(c=>low.includes(c.name.split(" ")[0].toLowerCase())||(c.name.split(" ")[1]&&low.includes(c.name.split(" ")[1].toLowerCase())));
  const jtype = ind.types.find((t:string)=>low.includes(t.split(" ")[0].toLowerCase()))||ind.types[0];
  return { customerName:cust?.name||"New Customer", phone:cust?.phone||"", hours, labour, materials, total, jobType:jtype, billing:ind.billing[0], notes:"Via voice entry" };
};

// WhatsApp helper
const waLink = (phone: string, msg: string) => {
  const clean = phone.replace(/\s/g,"").replace(/^0/,"61");
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
};
const waInvoiceMsg = (inv: any, lang: string) => lang==="zh"
  ? `您好 ${inv.customerName}，这是您的发票：${inv.jobType}，金额 ${fmt(inv.amount)}（含GST）。请尽快付款，谢谢！`
  : `Hi ${inv.customerName}, here's your invoice for ${inv.jobType} — ${fmt(inv.amount)} inc. GST. Please pay at your earliest convenience. Thanks!`;
const waRemindMsg = (inv: any, lang: string) => lang==="zh"
  ? `您好 ${inv.customerName}，提醒一下您有一笔逾期发票：${inv.jobType} ${fmt(inv.amount)}。请问何时方便付款？谢谢！`
  : `Hi ${inv.customerName}, just a friendly reminder about your outstanding invoice for ${inv.jobType} — ${fmt(inv.amount)}. Could you please arrange payment? Thanks!`;

// ═══ APP ═════════════════════════════════════════════════
export default function App() {
  const [appScreen,  setAppScreen]  = useState<"landing"|"trade"|"app">("landing");
  const [lang,       setLang]       = useState<"en"|"zh">("en");
  const [themeKey,   setThemeKey]   = useState("orange");
  const [calView,    setCalView]    = useState(false);
  const [indKey,     setIndKey]     = useState<string|null>(null);
  const [screen,     setScreen]     = useState("home");
  const [customers,  setCustomers]  = useState(SEED_CUSTOMERS);
  const [jobs,       setJobs]       = useState<any[]>([]);
  const [invoices,   setInvoices]   = useState<any[]>([]);
  const [quotes,     setQuotes]     = useState<any[]>([]);
  const [calDate,    setCalDate]    = useState(new Date());
  const [selDay,     setSelDay]     = useState<number|null>(null);
  const [notif,      setNotif]      = useState<string|null>(null);
  const [vModal,     setVModal]     = useState(false);
  const [vState,     setVState]     = useState("idle");
  const [vText,      setVText]      = useState("");
  const [vResult,    setVResult]    = useState<any>(null);
  const [newJobM,    setNewJobM]    = useState(false);
  const [newInvM,    setNewInvM]    = useState(false);
  const [newQuoteM,  setNewQuoteM]  = useState(false);
  const [newCustM,   setNewCustM]   = useState(false);
  const [jobDetail,  setJobDetail]  = useState<any>(null);
  const [sendModal,  setSendModal]  = useState<any>(null); // {inv}
  const [jF, setJF] = useState<any>({ customerName:"", address:"", jobType:"", billing:"", time:"", hours:"", rate:"", materials:"", notes:"" });
  const [iF, setIF] = useState<any>({ customerName:"", jobType:"", labour:"", materials:"", notes:"" });
  const [qF, setQF] = useState<any>({ customerName:"", jobType:"", labour:"", materials:"", notes:"" });
  const [cF, setCF] = useState<any>({ name:"", phone:"", address:"", notes:"" });
  const timer = useRef<any>(null);
  const photoRef = useRef<any>(null);

  const t   = T[lang];
  const ac  = THEMES[themeKey].hex;
  const ind = indKey ? IND[indKey] : null;
  const indName    = (i:any) => lang==="zh"?i.zh:i.en;
  const indTypes   = (i:any) => lang==="zh"?i.typesZh:i.types;
  const indBilling = (i:any) => lang==="zh"?i.billingZh:i.billing;
  const toast = (m:string) => { setNotif(m); setTimeout(()=>setNotif(null),3000); };

  const pickIndustry = (k:string) => {
    setIndKey(k);
    setJobs(mkJobs(IND[k]));
    setInvoices(mkInvoices(IND[k]));
    setQuotes([]);
    setJF((f:any)=>({...f, billing:IND[k].billing[0], rate:String(IND[k].rate)}));
    setScreen("home"); setAppScreen("app");
  };

  const todayStr    = new Date().toDateString();
  const todayJobs   = jobs.filter(j=>new Date(j.date).toDateString()===todayStr);
  const doneJobs    = todayJobs.filter(j=>j.status==="done");
  const todayRev    = doneJobs.reduce((s,j)=>s+j.labour+j.materials,0);
  const unpaidInvs  = invoices.filter(i=>!i.paid);
  const outstanding = unpaidInvs.reduce((s,i)=>s+i.amount,0);
  const overdueInvs = invoices.filter(i=>i.status==="overdue");

  // voice
  const startVoice = () => {
    setVState("listening"); setVText(""); setVResult(null);
    const raw = (VOICE_SAMPLES[indKey!]||VOICE_SAMPLES.other)[Math.floor(Math.random()*3)].replace(/"/g,"");
    let i=0;
    timer.current = setInterval(()=>{
      i++; setVText(raw.slice(0,i*6));
      if(i*6>=raw.length){ clearInterval(timer.current); setVText(raw); setTimeout(()=>{ setVState("processing"); setTimeout(()=>{ setVResult(parseVoice(raw,ind,customers)); setVState("done"); },1400); },300); }
    },70);
  };
  const stopVoice = () => { clearInterval(timer.current); if(vState==="listening"){setVState("processing"); setTimeout(()=>{ setVResult(parseVoice(vText,ind,customers)); setVState("done"); },1200);} };
  const confirmVoice = () => {
    if(!vResult) return;
    setJobs((p:any)=>[...p,{id:uid(),customerName:vResult.customerName,phone:vResult.phone,address:"Voice logged",jobType:vResult.jobType,date:new Date(),time:"Now",hours:vResult.hours,rate:ind.rate,labour:vResult.labour,materials:vResult.materials,status:"done",invoiced:true,paid:false,billing:vResult.billing,notes:vResult.notes,photos:[]}]);
    setInvoices((p:any)=>[...p,{id:uid(),customerName:vResult.customerName,phone:vResult.phone||"",jobType:vResult.jobType,amount:vResult.total,date:"Today",due:"14 days",status:"sent",paid:false}]);
    setVModal(false); setVState("idle"); setVResult(null);
    toast(`${t.voice_ok} ${vResult.customerName}`);
  };

  const addJob = () => {
    if(!jF.customerName||!jF.jobType) return;
    const labour=Number(jF.hours||1)*Number(jF.rate||ind.rate);
    const cust = customers.find((c:any)=>c.name===jF.customerName);
    setJobs((p:any)=>[...p,{id:uid(),...jF,phone:cust?.phone||"",labour,materials:Number(jF.materials||0),status:"upcoming",invoiced:false,paid:false,date:new Date(),photos:[]}]);
    setNewJobM(false); setJF({customerName:"",address:"",jobType:"",billing:ind.billing[0],time:"",hours:"",rate:String(ind.rate),materials:"",notes:""});
    toast(t.job_added_ok);
  };
  const addInvoice = () => {
    if(!iF.customerName) return;
    const cust=customers.find((c:any)=>c.name===iF.customerName);
    setInvoices((p:any)=>[...p,{id:uid(),...iF,phone:cust?.phone||"",amount:Number(iF.labour||0)+Number(iF.materials||0),date:"Today",due:"14 days",status:"sent",paid:false}]);
    setNewInvM(false); setIF({customerName:"",jobType:"",labour:"",materials:"",notes:""});
    toast(t.inv_sent_ok);
  };
  const addQuote = () => {
    if(!qF.customerName) return;
    setQuotes((p:any)=>[...p,{id:uid(),...qF,amount:Number(qF.labour||0)+Number(qF.materials||0),date:"Today",status:"pending"}]);
    setNewQuoteM(false); setQF({customerName:"",jobType:"",labour:"",materials:"",notes:""});
    toast(t.quote_sent_ok);
  };
  const addCustomer = () => {
    if(!cF.name) return;
    setCustomers((p:any)=>[...p,{id:uid(),...cF}]);
    setNewCustM(false); setCF({name:"",phone:"",address:"",notes:""});
    toast(t.client_added_ok);
  };
  const markJobDone = (id:number) => { setJobs((p:any)=>p.map((j:any)=>j.id===id?{...j,status:"done"}:j)); toast(t.job_done_ok); setJobDetail(null); };
  const markInvPaid = (id:number) => { setInvoices((p:any)=>p.map((i:any)=>i.id===id?{...i,paid:true,status:"paid"}:i)); toast(t.payment_ok); };
  const quoteToJob  = (q:any) => { setJobs((p:any)=>[...p,{id:uid(),customerName:q.customerName,phone:"",address:"TBC",jobType:q.jobType,date:new Date(),time:"TBC",hours:0,rate:ind.rate,labour:Number(q.labour||0),materials:Number(q.materials||0),status:"upcoming",invoiced:false,paid:false,billing:ind.billing[0],notes:q.notes,photos:[]}]); setQuotes((p:any)=>p.map((x:any)=>x.id===q.id?{...x,status:"converted"}:x)); toast(t.job_added_ok); };

  // photo upload
  const handlePhoto = (e:any, jobId:number) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev:any) => {
      setJobs((p:any)=>p.map((j:any)=>j.id===jobId?{...j,photos:[...(j.photos||[]),ev.target.result]}:j));
      setJobDetail((prev:any)=>prev?{...prev,photos:[...(prev.photos||[]),ev.target.result]}:prev);
      toast("📸 Photo added!");
    };
    reader.readAsDataURL(file);
  };

  // calendar
  const calDaysInMonth = (d:Date) => new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
  const calFirstDay    = (d:Date) => new Date(d.getFullYear(),d.getMonth(),1).getDay();
  const jobsOnDay      = (day:number) => jobs.filter(j=>{ const jd=new Date(j.date); return jd.getFullYear()===calDate.getFullYear()&&jd.getMonth()===calDate.getMonth()&&jd.getDate()===day; });

  const SC:any = { done:"#22c55e","in-progress":ac, upcoming:"#64748b" };
  const IC:any = { sent:"#94a3b8", overdue:"#f87171", paid:"#22c55e", pending:"#f59e0b", converted:"#64748b" };
  const HOUR = new Date().getHours();
  const greeting = HOUR<12?t.greeting_morning:HOUR<17?t.greeting_afternoon:t.greeting_evening;
  const custNames = customers.map((c:any)=>c.name);

  // ── STYLES ──────────────────────────────────────────────
  const S:any = {
    root:    { maxWidth:430, margin:"0 auto", minHeight:"100vh", background:"#090909", color:"#f0ede8", fontFamily:"'DM Sans','Helvetica Neue',sans-serif", position:"relative", overflowX:"hidden" },
    hdr:     { padding:"24px 20px 0", background:"linear-gradient(180deg,#111 0%,#090909 100%)" },
    logoRow: { display:"flex", alignItems:"center", gap:8 },
    logo:    { fontSize:24, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 },
    dot:     { width:8, height:8, borderRadius:"50%", background:ac },
    tag:     { fontSize:12, color:ac, background:ac+"22", borderRadius:20, padding:"3px 10px", fontWeight:700, border:`1px solid ${ac}44` },
    swBtn:   { fontSize:13, color:"#555", background:"#161616", border:"1px solid #1e1e1e", borderRadius:20, padding:"4px 10px", cursor:"pointer" },
    actRow:  { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:"14px 20px" },
    actBtn:  (hi:boolean)=>({ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"14px 8px", background:hi?ac:"#141414", border:hi?"none":"1px solid #1e1e1e", borderRadius:16, cursor:"pointer" }),
    actLbl:  (hi:boolean)=>({ fontSize:19, fontWeight:800, color:hi?"#0a0a0a":"#666" }),
    statRow: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, padding:"0 20px 18px" },
    stat:    (c:string)=>({ background:"#141414", borderRadius:14, padding:"11px", borderBottom:`2px solid ${c}`, cursor:"pointer" }),
    statV:   (c:string)=>({ fontSize:28, fontWeight:900, color:c, letterSpacing:-0.5, lineHeight:1 }),
    statL:   { fontSize:12, color:"#333", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginTop:4 },
    sec:     { padding:"0 20px", marginBottom:22 },
    secHdr:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
    secT:    { fontSize:13, fontWeight:800, color:"#2a2a2a", textTransform:"uppercase", letterSpacing:1 },
    secA:    { fontSize:17, color:ac, fontWeight:700, cursor:"pointer" },
    jCard:   (s:string)=>({ background:"#141414", borderRadius:16, padding:"13px 15px", marginBottom:9, borderLeft:`3px solid ${SC[s]||"#222"}`, cursor:"pointer" }),
    jTop:    { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:2 },
    jTime:   { fontSize:14, color:"#444", fontWeight:700 },
    jStat:   (s:string)=>({ fontSize:13, fontWeight:700, color:SC[s], background:SC[s]+"20", borderRadius:20, padding:"2px 8px" }),
    jName:   { fontSize:24, fontWeight:800, color:"#f0ede8", letterSpacing:-0.3 },
    jType:   { fontSize:19, color:ac, marginTop:2 },
    jAddr:   { fontSize:17, color:"#2a2a2a", marginTop:2 },
    jBot:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:9 },
    jPrice:  { fontSize:28, fontWeight:900, color:"#f0ede8", letterSpacing:-0.5 },
    jSub:    { fontSize:15, color:"#2a2a2a" },
    dBtn:    { padding:"8px 15px", background:ac, border:"none", borderRadius:10, color:"#0a0a0a", fontWeight:800, fontSize:17, cursor:"pointer" },
    iCard:   (s:string)=>({ background:"#141414", borderRadius:16, padding:"13px 15px", marginBottom:9, borderLeft:`3px solid ${IC[s]||"#222"}` }),
    iName:   { fontSize:24, fontWeight:800, color:"#f0ede8" },
    iType:   { fontSize:19, color:"#444", marginTop:2 },
    iStat:   (s:string)=>({ fontSize:15, fontWeight:700, color:IC[s], background:IC[s]+"20", borderRadius:20, padding:"2px 8px" }),
    iAmt:    (s:string)=>({ fontSize:28, fontWeight:900, color:s==="overdue"?"#f87171":s==="paid"?"#22c55e":"#f0ede8", letterSpacing:-0.5 }),
    iBtns:   { display:"flex", gap:7, marginTop:9 },
    iBtn:    (c:string)=>({ flex:1, padding:"9px", background:"#1a1a1a", border:`1px solid ${c}30`, borderRadius:10, color:c, fontSize:17, fontWeight:700, cursor:"pointer" }),
    cCard:   { background:"#141414", borderRadius:16, padding:"13px 15px", marginBottom:9 },
    cBtns:   { display:"flex", gap:6, marginTop:11 },
    cBtn:    (c:string)=>({ flex:1, padding:"7px", background:"#1a1a1a", border:"1px solid #1a1a1a", borderRadius:10, color:c, fontSize:17, fontWeight:700, cursor:"pointer" }),
    nav:     { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#0e0e0e", borderTop:"1px solid #181818", display:"grid", gridTemplateColumns:"repeat(6,1fr)", padding:"7px 0 22px", zIndex:100 },
    nItem:   (a:boolean)=>({ display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", padding:"4px 0", opacity:a?1:0.28 }),
    nLbl:    (a:boolean)=>({ fontSize:11, fontWeight:700, color:a?ac:"#333" }),
    overlay: { position:"fixed", inset:0, background:"#000c", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:999 },
    sheet:   { background:"#141414", borderRadius:"24px 24px 0 0", padding:"22px 20px 44px", width:"100%", maxWidth:430, border:"1px solid #1e1e1e", maxHeight:"92vh", overflowY:"auto" as any },
    handle:  { width:40, height:4, background:"#252525", borderRadius:2, margin:"0 auto 18px" },
    sTitle:  { fontSize:28, fontWeight:900, color:"#f0ede8", marginBottom:3, letterSpacing:-0.5 },
    sSub:    { fontSize:16, color:"#444", marginBottom:18 },
    micBtn:  (s:string)=>({ width:88, height:88, borderRadius:"50%", border:"none", background:s==="listening"?"#ef4444":ac, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, cursor:"pointer", margin:"0 auto 18px", boxShadow:s==="listening"?"0 0 0 14px #ef444420,0 0 0 28px #ef444410":`0 0 0 10px ${ac}25`, transition:"all 0.3s" }),
    vDisp:   { background:"#0a0a0a", borderRadius:12, padding:"13px", marginBottom:14, minHeight:54, fontSize:19, color:"#94a3b8", lineHeight:1.6, border:"1px solid #1a1a1a" },
    aiCard:  { background:"#0a0a0a", borderRadius:12, padding:"13px", marginBottom:14, border:`1px solid ${ac}28` },
    aiRow:   { display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #141414" },
    aiK:     { fontSize:22, color:"#444", fontWeight:600 },
    aiV:     { fontSize:22, color:"#f0ede8", fontWeight:700 },
    fField:  { marginBottom:11 },
    fLbl:    { fontSize:13, color:"#444", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:5 },
    fInp:    { width:"100%", padding:"12px 14px", background:"#0a0a0a", border:"1px solid #1e1e1e", borderRadius:11, color:"#f0ede8", fontSize:22, outline:"none", boxSizing:"border-box" as any },
    fSel:    { width:"100%", padding:"12px 14px", background:"#0a0a0a", border:"1px solid #1e1e1e", borderRadius:11, color:"#f0ede8", fontSize:22, outline:"none", boxSizing:"border-box" as any },
    fRow:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 },
    fTotal:  { background:`${ac}10`, border:`1px solid ${ac}25`, borderRadius:11, padding:"11px 13px", marginBottom:11, display:"flex", justifyContent:"space-between", alignItems:"center" },
    bigBtn:  (c?:string)=>({ width:"100%", padding:"15px", background:c||ac, border:c==="transparent"?"1px solid #1e1e1e":"none", borderRadius:13, color:c==="transparent"?"#444":"#0a0a0a", fontSize:24, fontWeight:800, cursor:"pointer", letterSpacing:-0.3, marginBottom:8 }),
    toast:   { position:"fixed" as any, top:20, left:"50%", transform:"translateX(-50%)", background:"#22c55e", color:"#fff", padding:"10px 20px", borderRadius:13, fontWeight:700, fontSize:19, zIndex:9999, whiteSpace:"nowrap" as any, boxShadow:"0 8px 24px #0008" },
  };

  const NAV = [
    { id:"home",     icon:"🏠", lbl:t.home },
    { id:"jobs",     icon:"🔩", lbl:t.jobs },
    { id:"invoices", icon:"🧾", lbl:t.invoices },
    { id:"quotes",   icon:"📋", lbl:t.quotes },
    { id:"clients",  icon:"👥", lbl:t.clients },
    { id:"settings", icon:"⚙️", lbl:t.settings },
  ];

  const inp = (val:string, set:(v:string)=>void, ph:string, type="text") => <input style={S.fInp} type={type} placeholder={ph} value={val} onChange={(e:any)=>set(e.target.value)}/>;
  const sel = (val:string, set:(v:string)=>void, opts:string[]) => <select style={S.fSel} value={val} onChange={(e:any)=>set(e.target.value)}><option value="">Select…</option>{opts.map((o:string)=><option key={o}>{o}</option>)}</select>;

  // ═══ LANDING PAGE ════════════════════════════════════════
  if (appScreen === "landing") return (
    <div style={{...S.root, background:"#080808"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700;800;900&display=swap');*{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}button,input,select{font-family:inherit;}`}</style>

      {/* NAV */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, padding:"16px 20px", background:"#08080899", backdropFilter:"blur(20px)", borderBottom:"1px solid #ffffff08", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#f0ede8" }}>
          <div style={{ width:9, height:9, borderRadius:"50%", background:ac }}/>
          SimplyProject
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setLang(lang==="en"?"zh":"en")} style={{ padding:"7px 14px", background:"#141414", border:"1px solid #1e1e1e", borderRadius:20, color:"#555", fontWeight:700, fontSize:17, cursor:"pointer" }}>{lang==="en"?"中文":"EN"}</button>
          <button onClick={()=>setAppScreen("trade")} style={{ padding:"7px 16px", background:ac, border:"none", borderRadius:20, color:"#0a0a0a", fontWeight:800, fontSize:17, cursor:"pointer" }}>{t.get_started}</button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding:"110px 24px 60px", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:ac+"22", border:`1px solid ${ac}30`, borderRadius:50, padding:"5px 14px", fontSize:17, color:ac, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:28 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:ac }}/>
          {lang==="zh"?"澳洲技工专属":"Built for Australian Tradies"}
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(38px,10vw,72px)", fontWeight:800, lineHeight:1.0, letterSpacing:-2, marginBottom:20, color:"#f0ede8" }}>
          {lang==="zh" ? <><span style={{color:ac}}>不再</span>追着客户付款。</> : <>Stop chasing<br/><span style={{color:ac}}>invoices.</span></>}
        </h1>
        <p style={{ fontSize:22, color:"#666", lineHeight:1.7, marginBottom:36, maxWidth:360, margin:"0 auto 36px" }}>{t.hero_sub}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={()=>setAppScreen("trade")} style={{ padding:"15px 28px", background:ac, border:"none", borderRadius:50, color:"#0a0a0a", fontWeight:800, fontSize:22, cursor:"pointer" }}>{t.try_demo}</button>
          <button onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"15px 24px", background:"transparent", border:"1px solid #1e1e1e", borderRadius:50, color:"#555", fontWeight:700, fontSize:22, cursor:"pointer" }}>{t.learn_more}</button>
        </div>
        {/* trades */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:40 }}>
          {Object.values(IND).map((i:any)=>(
            <div key={i.en} style={{ display:"flex", alignItems:"center", gap:6, background:"#141414", border:"1px solid #1e1e1e", borderRadius:50, padding:"7px 14px", fontSize:17, color:"#555", fontWeight:600 }}>
              {i.icon} {lang==="zh"?i.zh:i.en}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ padding:"60px 20px" }}>
        <div style={{ fontSize:17, color:ac, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:14, textAlign:"center" }}>
          {lang==="zh"?"核心功能":"Why SimplyProject"}
        </div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, letterSpacing:-1, textAlign:"center", marginBottom:32, lineHeight:1.2 }}>
          {lang==="zh"?<>一切你需要的<br/><span style={{color:ac}}>没有多余的</span></>:<>Everything you need.<br/><span style={{color:ac}}>Nothing you don't.</span></>}
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            ["🎙️",t.feat1_t,t.feat1_d],
            ["🧾",t.feat2_t,t.feat2_d],
            ["📅",t.feat3_t,t.feat3_d],
            ["🌐",t.feat4_t,t.feat4_d],
            ["📸",t.feat5_t,t.feat5_d],
            ["💬",t.feat6_t,t.feat6_d],
          ].map(([icon,title,desc])=>(
            <div key={title as string} style={{ background:"#141414", border:"1px solid #1e1e1e", borderRadius:16, padding:"18px 16px" }}>
              <div style={{ fontSize:32, marginBottom:10 }}>{icon}</div>
              <div style={{ fontSize:19, fontWeight:800, color:"#f0ede8", marginBottom:6, lineHeight:1.3 }}>{title}</div>
              <div style={{ fontSize:17, color:"#444", lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding:"40px 20px 60px" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:35, fontWeight:800, letterSpacing:-1, textAlign:"center", marginBottom:24 }}>
          {lang==="zh"?"简单定价":"Simple pricing."}
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[["Free","$0","forever",["Basic jobs","10 clients","Voice entry"]],["Pro","$19","/month",["Unlimited","All features","Calendar"]],["Team","$29","/month",["Pro + 5 accounts","Team visibility"]],["Payroll","$39","/month",["Team + STP","Staff pay"]]].map(([plan,price,period,features]:any)=>(
            <div key={plan} style={{ background:plan==="Pro"?ac:"#141414", border:`1px solid ${plan==="Pro"?ac:"#1e1e1e"}`, borderRadius:16, padding:"18px 16px" }}>
              <div style={{ fontSize:15, fontWeight:700, color:plan==="Pro"?"#0007":"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{plan}</div>
              <div style={{ fontSize:35, fontWeight:900, color:plan==="Pro"?"#0a0a0a":"#f0ede8", letterSpacing:-1 }}>{price}</div>
              <div style={{ fontSize:17, color:plan==="Pro"?"#0007":"#333", marginBottom:14 }}>{period}</div>
              {features.map((f:string)=><div key={f} style={{ fontSize:17, color:plan==="Pro"?"#0a0a0a":"#555", marginBottom:4 }}>✓ {f}</div>)}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"40px 24px 80px", textAlign:"center", background:"#0f0f0f" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, letterSpacing:-1, marginBottom:16 }}>
          {lang==="zh"?<>准备好了？<br/><span style={{color:ac}}>免费开始</span></>:<>Ready to get<br/><span style={{color:ac}}>paid faster?</span></>}
        </h2>
        <p style={{ color:"#444", fontSize:22, marginBottom:28 }}>{lang==="zh"?"免费体验，无需注册":"Free to try. No sign-up required."}</p>
        <button onClick={()=>setAppScreen("trade")} style={{ padding:"16px 36px", background:ac, border:"none", borderRadius:50, color:"#0a0a0a", fontWeight:800, fontSize:22, cursor:"pointer", marginBottom:12 }}>🎙️ {t.try_demo}</button>
        <div style={{ fontSize:17, color:"#333" }}>{t.built_au}</div>
      </div>

      {/* FOOTER */}
      <div style={{ padding:"20px 24px 40px", borderTop:"1px solid #1a1a1a", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#f0ede8" }}><div style={{ width:7, height:7, borderRadius:"50%", background:ac }}/>SimplyProject</div>
        <div style={{ fontSize:17, color:"#333" }}>© 2026 Future One Pty Ltd · <a href="https://futureone.au" style={{color:"#444",textDecoration:"none"}}>futureone.au</a></div>
      </div>
    </div>
  );

  // ═══ TRADE SELECT ════════════════════════════════════════
  if (appScreen === "trade") return (
    <div style={S.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');*{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}button,input,select{font-family:inherit;}select option{background:#141414;}`}</style>
      <div style={{ padding:"50px 22px 48px" }}>
        <button onClick={()=>setAppScreen("landing")} style={{ fontSize:19, color:"#444", background:"transparent", border:"none", cursor:"pointer", marginBottom:24, padding:0 }}>← Back</button>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <div style={{ width:9,height:9,borderRadius:"50%",background:ac }}/>
          <div style={{ fontSize:28,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5 }}>SimplyProject</div>
        </div>
        <div style={{ fontSize:22,color:"#333",marginBottom:28 }}>{t.whats_trade}</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11 }}>
          {Object.entries(IND).map(([k,i]:any)=>(
            <div key={k} onClick={()=>pickIndustry(k)} style={{ background:"#141414",borderRadius:17,padding:"19px 15px",cursor:"pointer",border:`1px solid ${i.color||ac}28`,textAlign:"center" }}>
              <div style={{ fontSize:38,marginBottom:7 }}>{i.icon}</div>
              <div style={{ fontSize:22,fontWeight:800,color:"#f0ede8",marginBottom:3 }}>{lang==="zh"?i.zh:i.en}</div>
              <div style={{ fontSize:15,color:i.color||ac,fontWeight:600 }}>{lang==="zh"?i.billingZh[0]:i.billing[0]}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",justifyContent:"center",gap:10,marginTop:24 }}>
          {[["en","🇦🇺 English"],["zh","🇨🇳 中文"]].map(([k,lbl])=>(
            <button key={k} onClick={()=>setLang(k as any)} style={{ padding:"6px 16px", background:lang===k?ac:"#141414", border:"1px solid #1e1e1e", borderRadius:20, color:lang===k?"#0a0a0a":"#555", fontWeight:700, fontSize:17, cursor:"pointer" }}>{lbl}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══ MAIN APP ════════════════════════════════════════════
  const renderHome = () => (
    <>
      <div style={S.hdr}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
          <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>SimplyProject</div></div>
          <div style={{ display:"flex",gap:6 }}>
            <span style={S.tag}>{ind.icon} {indName(ind)}</span>
            <button style={S.swBtn} onClick={()=>setAppScreen("trade")}>{lang==="zh"?"切换":"Switch"}</button>
          </div>
        </div>
        <div style={{ paddingBottom:16 }}>
          <div style={{ fontSize:29,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5 }}>{greeting} 👋</div>
          <div style={{ fontSize:17,color:"#2a2a2a",marginTop:2 }}>{new Date().toLocaleDateString(lang==="zh"?"zh-CN":"en-AU",{weekday:"long",day:"numeric",month:"long"})}</div>
        </div>
      </div>
      <div style={S.actRow}>
        <button style={S.actBtn(false)} onClick={()=>setNewJobM(true)}><div style={{fontSize:28}}>➕</div><div style={S.actLbl(false)}>{t.new_job}</div></button>
        <button style={S.actBtn(true)}  onClick={()=>{setVModal(true);setVState("idle");}}><div style={{fontSize:28}}>🎙️</div><div style={S.actLbl(true)}>{t.voice_job}</div></button>
        <button style={S.actBtn(false)} onClick={()=>setNewInvM(true)}><div style={{fontSize:28}}>🧾</div><div style={S.actLbl(false)}>{t.send_invoice}</div></button>
      </div>
      <div style={S.statRow}>
        <div style={S.stat("#22c55e")} onClick={()=>setScreen("jobs")}><div style={S.statV("#22c55e")}>{fmt(todayRev)}</div><div style={S.statL}>{t.money_in}</div></div>
        <div style={S.stat("#f87171")} onClick={()=>setScreen("invoices")}><div style={S.statV("#f87171")}>{fmt(outstanding)}</div><div style={S.statL}>{t.money_owed}</div></div>
        <div style={S.stat(ac)} onClick={()=>setScreen("jobs")}><div style={S.statV(ac)}>{todayJobs.length}</div><div style={S.statL}>{t.jobs_today}</div></div>
      </div>
      {overdueInvs.length>0&&(
        <div style={{ margin:"0 20px 18px",background:"#f8717115",border:"1px solid #f8717130",borderRadius:13,padding:"11px 15px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div style={{ fontSize:19,fontWeight:800,color:"#f87171" }}>⚠️ {overdueInvs.length} {t.overdue_alert}{overdueInvs.length>1?"s":""}</div>
            <div style={{ fontSize:17,color:"#555",marginTop:2 }}>{overdueInvs.map((i:any)=>i.customerName).join(", ")}</div>
          </div>
          <button style={{ padding:"7px 13px",background:"#f87171",border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:17,cursor:"pointer" }} onClick={()=>setScreen("invoices")}>{t.view_arrow}</button>
        </div>
      )}
      <div style={S.sec}>
        <div style={S.secHdr}><div style={S.secT}>{t.todays_jobs}</div><div style={S.secA} onClick={()=>setScreen("jobs")}>{t.see_all}</div></div>
        {todayJobs.length===0&&<div style={{ textAlign:"center",padding:"22px 0",color:"#2a2a2a",fontSize:19 }}>{t.no_jobs}</div>}
        {todayJobs.slice(0,3).map((j:any)=>(
          <div key={j.id} style={S.jCard(j.status)} onClick={()=>setJobDetail(j)}>
            <div style={S.jTop}><div style={S.jTime}>{j.time}</div><span style={S.jStat(j.status)}>{j.status==="done"?t.done_status:j.status==="in-progress"?t.inprog_status:t.upcoming_status}</span></div>
            <div style={S.jName}>{j.customerName}</div>
            <div style={S.jType}>{j.jobType}</div>
            <div style={S.jBot}>
              <div><div style={S.jPrice}>{fmt(j.labour+j.materials)}</div><div style={S.jSub}>{j.billing}</div></div>
              {j.status!=="done"&&<button style={S.dBtn} onClick={(e:any)=>{e.stopPropagation();markJobDone(j.id);}}>{j.status==="in-progress"?t.done_btn:t.start_btn}</button>}
            </div>
          </div>
        ))}
      </div>
      {unpaidInvs.length>0&&(
        <div style={S.sec}>
          <div style={S.secHdr}><div style={S.secT}>{t.unpaid}</div><div style={S.secA} onClick={()=>setScreen("invoices")}>{t.see_all}</div></div>
          {unpaidInvs.slice(0,2).map((inv:any)=>(
            <div key={inv.id} style={S.iCard(inv.status)}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}><div><div style={S.iName}>{inv.customerName}</div><div style={S.iType}>{inv.jobType}</div></div><span style={S.iStat(inv.status)}>{(t as any)[inv.status]||inv.status}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:9 }}>
                <div style={S.iAmt(inv.status)}>{fmt(inv.amount)}</div>
                <div style={{ display:"flex",gap:7 }}>
                  <button style={S.iBtn("#25D366")} onClick={()=>window.open(waLink(inv.phone||"0400000000",waRemindMsg(inv,lang)),"_blank")}>💬 {t.wa_remind}</button>
                  <button style={S.iBtn("#22c55e")} onClick={()=>markInvPaid(inv.id)}>{t.paid_btn}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height:90 }}/>
    </>
  );

  const renderJobs = () => {
    const daysInMonth=calDaysInMonth(calDate), firstDay=calFirstDay(calDate);
    const todayDate=new Date(); const isToday=(day:number)=>calDate.getFullYear()===todayDate.getFullYear()&&calDate.getMonth()===todayDate.getMonth()&&day===todayDate.getDate();
    const filteredJobs=selDay?jobs.filter(j=>{const jd=new Date(j.date);return jd.getFullYear()===calDate.getFullYear()&&jd.getMonth()===calDate.getMonth()&&jd.getDate()===selDay;}):jobs;
    const jCardEl=(j:any)=>(
      <div key={j.id} style={S.jCard(j.status)} onClick={()=>setJobDetail(j)}>
        <div style={S.jTop}><div style={S.jTime}>{j.time} · {new Date(j.date).toLocaleDateString(lang==="zh"?"zh-CN":"en-AU",{weekday:"short",day:"numeric",month:"short"})}</div><span style={S.jStat(j.status)}>{j.status==="done"?t.done_status:j.status==="in-progress"?t.inprog_status:t.upcoming_status}</span></div>
        <div style={S.jName}>{j.customerName}</div>
        <div style={S.jType}>{j.jobType}</div>
        <div style={S.jAddr}>📍 {j.address}{(j.photos||[]).length>0?` · 📸 ${j.photos.length}`:""}</div>
        <div style={S.jBot}>
          <div><div style={S.jPrice}>{fmt(j.labour+j.materials)}</div><div style={S.jSub}>{j.billing}</div></div>
          {j.status!=="done"&&<button style={S.dBtn} onClick={(e:any)=>{e.stopPropagation();markJobDone(j.id);}}>{j.status==="in-progress"?t.done_btn:t.start_btn}</button>}
        </div>
      </div>
    );
    return (
      <>
        <div style={S.hdr}>
          <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>SimplyProject</div></div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14 }}>
            <div style={{ fontSize:28,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5 }}>{t.jobs} 🔩</div>
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <div style={{ display:"flex",background:"#141414",borderRadius:10,overflow:"hidden",border:"1px solid #1e1e1e" }}>
                <button onClick={()=>setCalView(false)} style={{ padding:"6px 12px",background:!calView?ac:"transparent",border:"none",color:!calView?"#0a0a0a":"#555",fontWeight:700,fontSize:17,cursor:"pointer" }}>{t.list_view}</button>
                <button onClick={()=>setCalView(true)}  style={{ padding:"6px 12px",background:calView ?ac:"transparent",border:"none",color:calView ?"#0a0a0a":"#555",fontWeight:700,fontSize:17,cursor:"pointer" }}>{t.cal_view}</button>
              </div>
              <button style={{ padding:"7px 14px",background:ac,border:"none",borderRadius:11,color:"#0a0a0a",fontWeight:800,fontSize:17,cursor:"pointer" }} onClick={()=>setNewJobM(true)}>+ {t.new_job}</button>
            </div>
          </div>
        </div>
        {calView?(
          <div style={{ padding:"0 20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingTop:8 }}>
              <button onClick={()=>setCalDate(d=>{const x=new Date(d);x.setMonth(x.getMonth()-1);return x;})} style={{ width:32,height:32,borderRadius:"50%",background:"#141414",border:"1px solid #1e1e1e",color:"#f0ede8",fontSize:22,cursor:"pointer" }}>‹</button>
              <div style={{ fontWeight:800,fontSize:22,color:"#f0ede8" }}>{calDate.toLocaleDateString(lang==="zh"?"zh-CN":"en-AU",{month:"long",year:"numeric"})}</div>
              <button onClick={()=>setCalDate(d=>{const x=new Date(d);x.setMonth(x.getMonth()+1);return x;})} style={{ width:32,height:32,borderRadius:"50%",background:"#141414",border:"1px solid #1e1e1e",color:"#f0ede8",fontSize:22,cursor:"pointer" }}>›</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6 }}>
              {t.week_days.map((d:string)=><div key={d} style={{ textAlign:"center",fontSize:13,fontWeight:700,color:"#333",padding:"4px 0" }}>{d}</div>)}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3 }}>
              {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:daysInMonth}).map((_,i)=>{
                const day=i+1,dayJobs=jobsOnDay(day),isSel=selDay===day,isTod=isToday(day);
                return <div key={day} onClick={()=>setSelDay(isSel?null:day)} style={{ borderRadius:10,padding:"6px 4px",background:isSel?ac:isTod?"#1e1e1e":"#141414",border:isTod?`1px solid ${ac}50`:"1px solid transparent",cursor:"pointer",minHeight:52 }}>
                  <div style={{ textAlign:"center",fontSize:19,fontWeight:isTod||isSel?900:500,color:isSel?"#0a0a0a":isTod?ac:"#666",marginBottom:3 }}>{day}</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center" }}>
                    {dayJobs.slice(0,3).map((j:any,idx:number)=><div key={idx} style={{ width:6,height:6,borderRadius:"50%",background:SC[j.status]||ac }}/>)}
                    {dayJobs.length>3&&<div style={{ fontSize:13,color:ac,fontWeight:700 }}>+{dayJobs.length-3}</div>}
                  </div>
                </div>;
              })}
            </div>
            {selDay&&<div style={{ marginTop:18 }}>
              <div style={{ fontSize:15,color:"#333",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10 }}>{selDay} {calDate.toLocaleDateString(lang==="zh"?"zh-CN":"en-AU",{month:"long"})}</div>
              {filteredJobs.length===0&&<div style={{ textAlign:"center",padding:"20px 0",color:"#2a2a2a",fontSize:19 }}>{t.no_jobs}</div>}
              {filteredJobs.map(jCardEl)}
            </div>}
          </div>
        ):(
          <div style={{ padding:"14px 20px" }}>
            {["in-progress","upcoming","done"].map(status=>{
              const filtered=jobs.filter((j:any)=>j.status===status); if(!filtered.length) return null;
              const lbl:any={"in-progress":t.inprog_status,upcoming:t.upcoming_status,done:t.done_status};
              return <div key={status}><div style={{ fontSize:15,color:SC[status],fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8,marginTop:4 }}>{lbl[status]}</div>{filtered.map(jCardEl)}</div>;
            })}
            {jobs.length===0&&<div style={{ textAlign:"center",padding:"40px 0",color:"#2a2a2a" }}>{t.no_jobs}</div>}
          </div>
        )}
        <div style={{ height:90 }}/>
      </>
    );
  };

  const renderInvoices = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>SimplyProject</div></div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ fontSize:28,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5 }}>{t.invoices} 🧾</div>
          <button style={{ padding:"7px 14px",background:ac,border:"none",borderRadius:11,color:"#0a0a0a",fontWeight:800,fontSize:17,cursor:"pointer" }} onClick={()=>setNewInvM(true)}>+ {t.send_invoice}</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,padding:"12px 0" }}>
          {[["#f87171",fmt(outstanding),t.money_owed],["#f59e0b",fmt(overdueInvs.reduce((s:any,i:any)=>s+i.amount,0)),t.overdue_alert],["#22c55e",fmt(invoices.filter(i=>i.paid).reduce((s:any,i:any)=>s+i.amount,0)),t.money_in]].map(([c,v,l])=>(
            <div key={l} style={{ background:"#141414",borderRadius:11,padding:"9px 11px",borderBottom:`2px solid ${c}` }}>
              <div style={{ fontSize:22,fontWeight:900,color:c,letterSpacing:-0.5 }}>{v}</div>
              <div style={{ fontSize:13,color:"#2a2a2a",fontWeight:700,textTransform:"uppercase",marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"14px 20px" }}>
        {["overdue","sent","paid"].map(status=>{
          const filtered=invoices.filter((i:any)=>i.status===status); if(!filtered.length) return null;
          return <div key={status}>
            <div style={{ fontSize:15,color:IC[status],fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8,marginTop:4 }}>{(t as any)[status]||status}</div>
            {filtered.map((inv:any)=>(
              <div key={inv.id} style={S.iCard(inv.status)}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}><div><div style={S.iName}>{inv.customerName}</div><div style={S.iType}>{inv.jobType}</div></div><span style={S.iStat(inv.status)}>{(t as any)[inv.status]||inv.status}</span></div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:9 }}>
                  <div><div style={S.iAmt(inv.status)}>{fmt(inv.amount)}</div><div style={{ fontSize:13,color:"#2a2a2a" }}>{lang==="zh"?"截止：":"Due: "}{inv.due}</div></div>
                </div>
                {!inv.paid&&(
                  <div style={S.iBtns}>
                    <button style={S.iBtn("#25D366")} onClick={()=>window.open(waLink(inv.phone||"0400000000",waRemindMsg(inv,lang)),"_blank")}>💬 {t.wa_remind}</button>
                    <button style={S.iBtn("#25D366")} onClick={()=>window.open(waLink(inv.phone||"0400000000",waInvoiceMsg(inv,lang)),"_blank")}>📄 {t.wa_invoice}</button>
                    <button style={S.iBtn("#22c55e")} onClick={()=>markInvPaid(inv.id)}>{t.paid_btn}</button>
                  </div>
                )}
              </div>
            ))}
          </div>;
        })}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  const renderQuotes = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>SimplyProject</div></div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:16 }}>
          <div style={{ fontSize:28,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5 }}>{t.quotes} 📋</div>
          <button style={{ padding:"7px 14px",background:ac,border:"none",borderRadius:11,color:"#0a0a0a",fontWeight:800,fontSize:17,cursor:"pointer" }} onClick={()=>setNewQuoteM(true)}>+</button>
        </div>
      </div>
      <div style={{ padding:"14px 20px" }}>
        {quotes.length===0?<div style={{ textAlign:"center",padding:"48px 0" }}><div style={{ fontSize:38,marginBottom:11 }}>📋</div><div style={{ fontSize:22,fontWeight:700,color:"#2a2a2a",marginBottom:7 }}>{t.no_quotes_h}</div><div style={{ fontSize:19,color:"#1e1e1e" }}>{t.no_quotes_s}</div></div>
        :quotes.map((q:any)=>(
          <div key={q.id} style={{ background:"#141414",borderRadius:16,padding:"13px 15px",marginBottom:9,borderLeft:`3px solid ${IC[q.status]||"#f59e0b"}` }}>
            <div style={{ display:"flex",justifyContent:"space-between" }}><div><div style={S.iName}>{q.customerName}</div><div style={S.iType}>{q.jobType}</div></div><span style={S.iStat(q.status||"pending")}>{(t as any)[q.status]||q.status}</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:9 }}>
              <div style={S.iAmt("sent")}>{fmt(q.amount)}</div>
              {q.status==="pending"&&<button style={{ padding:"8px 13px",background:ac,border:"none",borderRadius:10,color:"#0a0a0a",fontWeight:800,fontSize:17,cursor:"pointer" }} onClick={()=>quoteToJob(q)}>{t.convert_btn}</button>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  const renderClients = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>SimplyProject</div></div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:16 }}>
          <div style={{ fontSize:28,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5 }}>{t.clients} 👥</div>
          <button style={{ padding:"7px 14px",background:ac,border:"none",borderRadius:11,color:"#0a0a0a",fontWeight:800,fontSize:17,cursor:"pointer" }} onClick={()=>setNewCustM(true)}>+</button>
        </div>
      </div>
      <div style={{ padding:"14px 20px" }}>
        {customers.map((c:any)=>{
          const bal=invoices.filter(i=>!i.paid&&i.customerName===c.name).reduce((s:any,i:any)=>s+i.amount,0);
          return <div key={c.id} style={S.cCard}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:24,fontWeight:800,color:"#f0ede8" }}>{c.name}</div>
                <div style={{ fontSize:22,color:"#444",marginTop:2 }}>{c.phone}</div>
                <div style={{ fontSize:17,color:"#2a2a2a",marginTop:2 }}>📍 {c.address}</div>
                {c.notes&&<div style={{ fontSize:17,color:"#2a2a2a",marginTop:3,fontStyle:"italic" }}>💬 {c.notes}</div>}
              </div>
              {bal>0?<div style={{ fontSize:19,color:"#f87171",fontWeight:800 }}>{t.owes} {fmt(bal)}</div>:<div style={{ fontSize:17,color:"#22c55e",fontWeight:700 }}>{t.all_clear}</div>}
            </div>
            <div style={S.cBtns}>
              <button style={S.cBtn("#25D366")} onClick={()=>window.open(`https://wa.me/${c.phone.replace(/\s/g,"").replace(/^0/,"61")}`,"_blank")}>💬 WA</button>
              <button style={S.cBtn("#94a3b8")} onClick={()=>window.open(`tel:${c.phone}`)}>📞</button>
              <button style={S.cBtn(ac)} onClick={()=>{setNewInvM(true);setIF((p:any)=>({...p,customerName:c.name}));}}>🧾</button>
              <button style={S.cBtn("#38bdf8")} onClick={()=>{setNewQuoteM(true);setQF((p:any)=>({...p,customerName:c.name}));}}>📋</button>
              <button style={S.cBtn("#22c55e")} onClick={()=>{setNewJobM(true);setJF((p:any)=>({...p,customerName:c.name}));}}>🔩</button>
            </div>
          </div>;
        })}
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  const renderSettings = () => (
    <>
      <div style={S.hdr}>
        <div style={S.logoRow}><div style={S.dot}/><div style={S.logo}>SimplyProject</div></div>
        <div style={{ fontSize:28,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5,paddingBottom:16 }}>{t.settings_h}</div>
      </div>
      <div style={{ padding:"14px 20px" }}>
        <div style={{ background:"#141414",borderRadius:16,padding:"16px",marginBottom:12 }}>
          <div style={{ fontSize:22,fontWeight:800,color:"#f0ede8",marginBottom:2 }}>{t.lang_setting}</div>
          <div style={{ fontSize:17,color:"#444",marginBottom:14 }}>{t.lang_sub}</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
            {[["en","🇦🇺 English"],["zh","🇨🇳 中文"]].map(([k,lbl])=>(
              <button key={k} onClick={()=>setLang(k as any)} style={{ padding:"12px",background:lang===k?ac:"#1a1a1a",border:lang===k?"none":"1px solid #222",borderRadius:11,color:lang===k?"#0a0a0a":"#666",fontWeight:800,fontSize:22,cursor:"pointer" }}>{lbl}</button>
            ))}
          </div>
        </div>
        <div style={{ background:"#141414",borderRadius:16,padding:"16px",marginBottom:12 }}>
          <div style={{ fontSize:22,fontWeight:800,color:"#f0ede8",marginBottom:2 }}>{t.color_setting}</div>
          <div style={{ fontSize:17,color:"#444",marginBottom:14 }}>{t.color_sub}</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9 }}>
            {Object.entries(THEMES).map(([k,th]:any)=>(
              <button key={k} onClick={()=>setThemeKey(k)} style={{ padding:"11px 8px",background:"#1a1a1a",border:themeKey===k?`2px solid ${th.hex}`:"1px solid #222",borderRadius:11,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:th.hex,boxShadow:themeKey===k?`0 0 0 3px ${th.hex}40`:"none" }}/>
                <div style={{ fontSize:17,fontWeight:700,color:themeKey===k?th.hex:"#555" }}>{lang==="zh"?th.zh:th.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ background:"#141414",borderRadius:16,padding:"16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div><div style={{ fontSize:22,fontWeight:800,color:"#f0ede8",marginBottom:2 }}>{t.cal_setting}</div><div style={{ fontSize:22,color:"#444" }}>{t.cal_sub}</div></div>
          <div onClick={()=>setCalView(v=>!v)} style={{ width:48,height:28,borderRadius:14,background:calView?ac:"#2a2a2a",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0 }}>
            <div style={{ position:"absolute",top:3,left:calView?22:3,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left 0.2s" }}/>
          </div>
        </div>
        <div style={{ background:"#141414",borderRadius:16,padding:"16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer" }} onClick={()=>setAppScreen("trade")}>
          <div><div style={{ fontSize:22,fontWeight:800,color:"#f0ede8",marginBottom:2 }}>{t.trade_setting}</div><div style={{ fontSize:17,color:"#444" }}>{indName(ind)} {ind.icon}</div></div>
          <div style={{ fontSize:24,color:"#333" }}>›</div>
        </div>
        <div style={{ background:"#141414",borderRadius:16,padding:"16px",marginBottom:12 }}>
          <div style={{ fontSize:22,fontWeight:800,color:"#f0ede8",marginBottom:6 }}>{t.about_setting}</div>
          <div style={{ fontSize:14,color:"#333" }}>{t.version_val}</div>
          <div style={{ fontSize:13,color:"#222",marginTop:2 }}>simplyproject.com.au</div>
          <button onClick={()=>setAppScreen("landing")} style={{ marginTop:14,width:"100%",padding:"11px",background:"#1a1a1a",border:"1px solid #1e1e1e",borderRadius:11,color:"#555",fontSize:19,fontWeight:700,cursor:"pointer" }}>← View Landing Page</button>
        </div>
      </div>
      <div style={{ height:90 }}/>
    </>
  );

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        @keyframes pulse{0%,100%{box-shadow:0 0 0 10px #ef444420,0 0 0 20px #ef444410}50%{box-shadow:0 0 0 18px #ef444410,0 0 0 36px transparent}}
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
        button,input,select{font-family:inherit;}
        select option{background:#141414;}
      `}</style>

      {screen==="home"     && renderHome()}
      {screen==="jobs"     && renderJobs()}
      {screen==="invoices" && renderInvoices()}
      {screen==="quotes"   && renderQuotes()}
      {screen==="clients"  && renderClients()}
      {screen==="settings" && renderSettings()}

      <div style={S.nav}>
        {NAV.map(n=>(
          <div key={n.id} style={S.nItem(screen===n.id)} onClick={()=>setScreen(n.id)}>
            <div style={{ fontSize:28 }}>{n.icon}</div>
            <div style={S.nLbl(screen===n.id)}>{n.lbl}</div>
          </div>
        ))}
      </div>

      {/* VOICE */}
      {vModal&&(
        <div style={S.overlay} onClick={(e:any)=>e.target===e.currentTarget&&setVModal(false)}>
          <div style={S.sheet}>
            <div style={S.handle}/>
            {vState==="idle"&&<>
              <div style={S.sTitle}>{t.voice_title}</div>
              <div style={S.sSub}>{t.voice_sub}</div>
              <div style={{ background:"#0a0a0a",borderRadius:11,padding:"11px",marginBottom:18,border:"1px solid #1a1a1a" }}>
                <div style={{ fontSize:15,color:"#2a2a2a",fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:7 }}>{t.try_saying}</div>
                {(VOICE_SAMPLES[indKey!]||VOICE_SAMPLES.other).map((s:string,i:number)=><div key={i} style={{ fontSize:17,color:"#444",padding:"6px 0",borderBottom:"1px solid #141414",lineHeight:1.5 }}>{s}</div>)}
              </div>
              <button style={S.micBtn("idle")} onClick={startVoice}>🎙️</button>
              <div style={{ textAlign:"center",color:"#2a2a2a",fontSize:17,marginBottom:18 }}>{t.tap_start}</div>
              <button style={S.bigBtn("transparent")} onClick={()=>setVModal(false)}>{t.cancel}</button>
            </>}
            {vState==="listening"&&<>
              <div style={S.sTitle}>{t.listening}</div>
              <div style={S.sSub}>{t.listening_sub}</div>
              <button style={{...S.micBtn("listening"),animation:"pulse 1.5s infinite"}} onClick={stopVoice}>⏹</button>
              <div style={S.vDisp}>{vText||<span style={{color:"#1a1a1a"}}>…</span>}</div>
              <button style={S.bigBtn("transparent")} onClick={()=>{clearInterval(timer.current);setVState("idle");}}>{t.cancel}</button>
            </>}
            {vState==="processing"&&<>
              <div style={S.sTitle}>{t.processing}</div>
              <div style={S.sSub}>{t.processing_sub}</div>
              <div style={{textAlign:"center",fontSize:44,padding:"28px 0"}}>⚙️</div>
              <div style={S.vDisp}>{vText}</div>
            </>}
            {vState==="done"&&vResult&&<>
              <div style={S.sTitle}>{t.result_title}</div>
              <div style={S.sSub}>{t.result_sub}</div>
              <div style={S.aiCard}>
                {[[t.cust_lbl,vResult.customerName],[t.type_lbl,vResult.jobType],[t.labour_row,fmt(vResult.labour)],[t.materials_row,vResult.materials>0?fmt(vResult.materials):t.none_val],["Total",fmt(vResult.total)+" inc. GST"],["Invoice","Auto-sent ✉️"]].map(([k,v])=>(
                  <div key={k} style={S.aiRow}><span style={S.aiK}>{k}</span><span style={S.aiV}>{v}</span></div>
                ))}
              </div>
              <button style={S.bigBtn()} onClick={confirmVoice}>{t.confirm_btn}</button>
              <button style={S.bigBtn("transparent")} onClick={()=>setVState("idle")}>{t.retry_btn}</button>
            </>}
          </div>
        </div>
      )}

      {/* NEW JOB */}
      {newJobM&&(
        <div style={S.overlay} onClick={(e:any)=>e.target===e.currentTarget&&setNewJobM(false)}>
          <div style={S.sheet}>
            <div style={S.handle}/>
            <div style={S.sTitle}>{t.new_job_h}</div><div style={S.sSub}>{t.job_steps}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.cust_lbl}</label>{sel(jF.customerName,v=>setJF((p:any)=>({...p,customerName:v})),custNames)}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.type_lbl}</label>{sel(jF.jobType,v=>setJF((p:any)=>({...p,jobType:v})),indTypes(ind))}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.billing_lbl}</label>{sel(jF.billing,v=>setJF((p:any)=>({...p,billing:v})),indBilling(ind))}</div>
            <div style={S.fRow}>
              <div style={S.fField}><label style={S.fLbl}>{t.hours_lbl}</label>{inp(jF.hours,v=>setJF((p:any)=>({...p,hours:v})),"4","number")}</div>
              <div style={S.fField}><label style={S.fLbl}>{t.rate_lbl}</label>{inp(jF.rate,v=>setJF((p:any)=>({...p,rate:v})),String(ind.rate),"number")}</div>
            </div>
            <div style={S.fField}><label style={S.fLbl}>{t.mat_lbl}</label>{inp(jF.materials,v=>setJF((p:any)=>({...p,materials:v})),"0","number")}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.addr_lbl}</label>{inp(jF.address,v=>setJF((p:any)=>({...p,address:v})),t.site_ph)}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.time_lbl}</label>{inp(jF.time,v=>setJF((p:any)=>({...p,time:v})),"8:00 AM")}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.notes_lbl}</label>{inp(jF.notes,v=>setJF((p:any)=>({...p,notes:v})),t.req_ph)}</div>
            {jF.hours&&jF.rate&&<div style={S.fTotal}><span style={{fontSize:19,color:"#444"}}>{t.total_gst}</span><span style={{fontSize:22,fontWeight:900,color:ac}}>{fmt((Number(jF.hours)*Number(jF.rate)+Number(jF.materials||0))*1.1)}</span></div>}
            <button style={S.bigBtn()} onClick={addJob}>{t.create_job_btn}</button>
            <button style={S.bigBtn("transparent")} onClick={()=>setNewJobM(false)}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* NEW INVOICE */}
      {newInvM&&(
        <div style={S.overlay} onClick={(e:any)=>e.target===e.currentTarget&&setNewInvM(false)}>
          <div style={S.sheet}>
            <div style={S.handle}/>
            <div style={S.sTitle}>{t.new_inv_h}</div><div style={S.sSub}>{t.inv_steps}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.cust_lbl}</label>{sel(iF.customerName,v=>setIF((p:any)=>({...p,customerName:v})),custNames)}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.type_lbl}</label>{sel(iF.jobType,v=>setIF((p:any)=>({...p,jobType:v})),indTypes(ind))}</div>
            <div style={S.fRow}>
              <div style={S.fField}><label style={S.fLbl}>{t.labour_lbl}</label>{inp(iF.labour,v=>setIF((p:any)=>({...p,labour:v})),"0","number")}</div>
              <div style={S.fField}><label style={S.fLbl}>{t.mat_lbl}</label>{inp(iF.materials,v=>setIF((p:any)=>({...p,materials:v})),"0","number")}</div>
            </div>
            <div style={S.fField}><label style={S.fLbl}>{t.notes_lbl}</label>{inp(iF.notes,v=>setIF((p:any)=>({...p,notes:v})),t.opt_ph)}</div>
            {(iF.labour||iF.materials)&&<div style={S.fTotal}><span style={{fontSize:19,color:"#444"}}>{t.total_gst}</span><span style={{fontSize:22,fontWeight:900,color:ac}}>{fmt((Number(iF.labour||0)+Number(iF.materials||0))*1.1)}</span></div>}
            <button style={S.bigBtn()} onClick={addInvoice}>{t.send_inv_btn}</button>
            <button style={S.bigBtn("transparent")} onClick={()=>setNewInvM(false)}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* NEW QUOTE */}
      {newQuoteM&&(
        <div style={S.overlay} onClick={(e:any)=>e.target===e.currentTarget&&setNewQuoteM(false)}>
          <div style={S.sheet}>
            <div style={S.handle}/>
            <div style={S.sTitle}>{t.new_quote_h}</div><div style={S.sSub}>{t.quote_steps}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.cust_lbl}</label>{sel(qF.customerName,v=>setQF((p:any)=>({...p,customerName:v})),custNames)}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.type_lbl}</label>{sel(qF.jobType,v=>setQF((p:any)=>({...p,jobType:v})),indTypes(ind))}</div>
            <div style={S.fRow}>
              <div style={S.fField}><label style={S.fLbl}>{t.labour_lbl}</label>{inp(qF.labour,v=>setQF((p:any)=>({...p,labour:v})),"0","number")}</div>
              <div style={S.fField}><label style={S.fLbl}>{t.mat_lbl}</label>{inp(qF.materials,v=>setQF((p:any)=>({...p,materials:v})),"0","number")}</div>
            </div>
            <div style={S.fField}><label style={S.fLbl}>{t.notes_lbl}</label>{inp(qF.notes,v=>setQF((p:any)=>({...p,notes:v})),t.scope_ph)}</div>
            {(qF.labour||qF.materials)&&<div style={S.fTotal}><span style={{fontSize:19,color:"#444"}}>{t.quote_total}</span><span style={{fontSize:22,fontWeight:900,color:ac}}>{fmt(Number(qF.labour||0)+Number(qF.materials||0))}</span></div>}
            <button style={S.bigBtn()} onClick={addQuote}>{t.send_quote_btn}</button>
            <button style={S.bigBtn("transparent")} onClick={()=>setNewQuoteM(false)}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* NEW CUSTOMER */}
      {newCustM&&(
        <div style={S.overlay} onClick={(e:any)=>e.target===e.currentTarget&&setNewCustM(false)}>
          <div style={S.sheet}>
            <div style={S.handle}/>
            <div style={S.sTitle}>{t.new_cust_h}</div><div style={S.sSub}>{t.cust_steps}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.name_lbl}</label>{inp(cF.name,v=>setCF((p:any)=>({...p,name:v})),"Full name")}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.phone_lbl}</label>{inp(cF.phone,v=>setCF((p:any)=>({...p,phone:v})),"04XX XXX XXX","tel")}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.addr_lbl}</label>{inp(cF.address,v=>setCF((p:any)=>({...p,address:v})),"Street address")}</div>
            <div style={S.fField}><label style={S.fLbl}>{t.notes_lbl}</label>{inp(cF.notes,v=>setCF((p:any)=>({...p,notes:v})),t.access_ph)}</div>
            <button style={S.bigBtn()} onClick={addCustomer}>{t.add_client_btn}</button>
            <button style={S.bigBtn("transparent")} onClick={()=>setNewCustM(false)}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* JOB DETAIL */}
      {jobDetail&&(
        <div style={S.overlay} onClick={(e:any)=>e.target===e.currentTarget&&setJobDetail(null)}>
          <div style={S.sheet}>
            <div style={S.handle}/>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div><div style={S.sTitle}>{jobDetail.customerName}</div><div style={{fontSize:19,color:ac,fontWeight:700}}>{jobDetail.jobType}</div></div>
              <span style={S.jStat(jobDetail.status)}>{jobDetail.status==="done"?t.done_status:jobDetail.status==="in-progress"?t.inprog_status:t.upcoming_status}</span>
            </div>
            <div style={S.aiCard}>
              {[["📍",jobDetail.address],["🕐",jobDetail.time],["💳",jobDetail.billing],["⏱",`${jobDetail.hours}hr`],[t.labour_row,fmt(jobDetail.labour)],[t.materials_row,jobDetail.materials>0?fmt(jobDetail.materials):t.none_val],["Total",fmt(jobDetail.labour+jobDetail.materials)]].map(([k,v])=>(
                <div key={k} style={S.aiRow}><span style={S.aiK}>{k}</span><span style={S.aiV}>{v}</span></div>
              ))}
              {jobDetail.notes&&<div style={{padding:"7px 0 2px",fontSize:17,color:"#2a2a2a",fontStyle:"italic"}}>💬 {jobDetail.notes}</div>}
            </div>

            {/* PHOTOS */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <div style={{ fontSize:17,fontWeight:700,color:"#333",textTransform:"uppercase",letterSpacing:1 }}>📸 {t.photos}</div>
                <label style={{ fontSize:17,color:ac,fontWeight:700,cursor:"pointer" }}>
                  {t.add_photo}
                  <input ref={photoRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={(e)=>handlePhoto(e,jobDetail.id)}/>
                </label>
              </div>
              {(jobDetail.photos||[]).length===0
                ?<div style={{ fontSize:17,color:"#2a2a2a",textAlign:"center",padding:"16px 0" }}>{t.no_photos}</div>
                :<div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {(jobDetail.photos||[]).map((ph:string,i:number)=>(
                    <img key={i} src={ph} style={{ width:80,height:80,borderRadius:10,objectFit:"cover",border:"1px solid #1e1e1e" }} alt="job photo"/>
                  ))}
                </div>
              }
            </div>

            <div style={S.fRow}>
              {jobDetail.status!=="done"&&<button style={S.bigBtn()} onClick={()=>markJobDone(jobDetail.id)}>{t.done_btn}</button>}
              <button style={S.bigBtn("#25D366")} onClick={()=>{const inv={customerName:jobDetail.customerName,phone:jobDetail.phone||"0400000000",jobType:jobDetail.jobType,amount:jobDetail.labour+jobDetail.materials};window.open(waLink(inv.phone,waInvoiceMsg(inv,lang)),"_blank");}}>💬 {t.wa_invoice}</button>
            </div>
            <button style={S.bigBtn("#38bdf8")} onClick={()=>{setNewInvM(true);setIF((p:any)=>({...p,customerName:jobDetail.customerName,jobType:jobDetail.jobType,labour:String(jobDetail.labour),materials:String(jobDetail.materials)}));setJobDetail(null);}}>🧾 {t.send_invoice}</button>
            <button style={S.bigBtn("transparent")} onClick={()=>setJobDetail(null)}>{t.close}</button>
          </div>
        </div>
      )}

      {notif&&<div style={S.toast}>{notif}</div>}
    </div>
  );
}
