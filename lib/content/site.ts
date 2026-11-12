/**
 * SIG-TEL — verified company information.
 * Every field in this file is drawn from SIG-TEL's published company information.
 * Do not add statistics, clients, certifications or claims that are not evidenced.
 */

export const company = {
  legalName: "Sigtel Signal & Telecommunication Pvt Ltd",
  name: "SIG-TEL",
  tagline: "Signalling & Telecommunications",
  founded: 2010,
  disciplines: "Railway signalling · Telecom networks",
  positioning:
    "SIG-TEL was incorporated in 2010 and works in two disciplines with equal depth: railway signalling for Indian Railways, private sidings and freight terminals, and telecom networks for railways, oil & gas pipelines and industry.",
  positioningLong:
    "Sigtel Signal & Telecommunication Pvt Ltd was incorporated in 2010. Our office sits inside the Belapur Railway Station building in Navi Mumbai. We design, install, test and maintain two kinds of critical systems: railway signalling, and telecom networks — IP-MPLS, SDH, OFC, CCTV and radio — for railways, oil & gas pipelines and industry. We stay with what we build through long-term maintenance.",
  address: {
    officeLabel: "Office",
    office:
      "Unit F-202, 2nd Floor, ITC Tower No. 8, Belapur Railway Station Building, Sector 11, CBD Belapur (W), Navi Mumbai 400614",
    regdLabel: "Regd. office",
    regd: "A/5, 19/20, Sector 2, CBD Belapur, Navi Mumbai 400614",
    city: "Navi Mumbai",
    state: "Maharashtra",
    country: "India",
    lat: 19.0206,
    lng: 73.0387,
    maps: "https://maps.google.com/?q=Belapur+Railway+Station+Building+CBD+Belapur+Navi+Mumbai",
  },
  phone: { primary: "+91 93200 01996", primaryHref: "tel:+919320001996", landline: "022 4603 7883", landlineHref: "tel:+912246037883" },
  email: "sigtel2011@gmail.com",
  whatsapp: "https://wa.me/919320001996",
  gstin: "27AAOCS8106Q1ZI",
  hours: "Mon–Sat, 10 am – 7 pm",
  linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Sigtel%20Signal%20%26%20Telecommunication",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sig-tel.com",
} as const;

export const credentials = [
  { value: 2010, label: "Incorporated", detail: "Navi Mumbai, Maharashtra", prefix: "", suffix: "" },
  { value: 20, label: "Works in the register", detail: "Executed and in progress", prefix: "", suffix: "" },
  { value: 5, label: "States covered", detail: "Maharashtra · Goa · Karnataka · MP · UP", prefix: "", suffix: "" },
  { value: 11, label: "Client & partner organisations", detail: "Railways, PSUs, pipelines, industry", prefix: "", suffix: "" },
];

export const clients = [
  "Central Railway",
  "Konkan Railway Corporation",
  "Bharat Petroleum (BPCL)",
  "Indian Oil (IOCL)",
  "Siemens",
  "BSNL",
  "Optilan India",
  "RVNL",
  "MRVC",
  "RailTel",
  "Honeywell Automation India",
];

export const clientGroups = [
  {
    tag: "Zonal railways",
    title: "Indian Railways",
    body: "Signalling, Electronic Interlocking, LC gates, earthing and S&T telecom for working stations and new lines.",
    names: "Central Railway · Konkan Railway",
  },
  {
    tag: "Energy",
    title: "Oil & gas pipelines",
    body: "Pipeline telecom: OFC, IP-MPLS / SDH, CCTV, EPABX, radio and long-term CAMC along the route.",
    names: "BPCL · IOCL",
  },
  {
    tag: "Rail infrastructure PSUs",
    title: "Railway project organisations",
    body: "S&T works for new lines, doubling, suburban corridors and railway telecom networks.",
    names: "RVNL · MRVC · RailTel",
  },
  {
    tag: "Networks",
    title: "Telecom & system integrators",
    body: "Installation, testing and commissioning for operators and integrators: OFC, transmission, CCTV and NMS.",
    names: "BSNL · Siemens · Optilan India · Honeywell",
  },
  {
    tag: "Private sidings",
    title: "Cargo terminals & sidings",
    body: "Complete signalling and telecom for private sidings and cargo terminals, from survey to Railway approval.",
    names: "Survey to commissioning",
  },
];

export interface CapabilityLayer {
  level: string;
  title: string;
  summary: string;
  what: string[];
  proof: string[];
  where: string;
}

export const signallingLayers: CapabilityLayer[] = [
  {
    level: "L5",
    title: "Testing, commissioning & upkeep",
    summary: "Joint testing, handover, maintenance — the system keeps working after the site is demobilised.",
    what: [
      "Circuit and function testing against approved drawings",
      "Joint commissioning with client engineering staff",
      "AMC / CAMC with fault response and health checks",
      "Card-level repair and live testing of control cards",
    ],
    proof: ["Test reports and commissioning records", "As-built drawings", "Fault logs and maintenance history"],
    where: "Commissioning and maintenance across Mumbai, Pune and Solapur divisions.",
  },
  {
    level: "L4",
    title: "Interlocking: EI & relay",
    summary: "Electronic Interlocking installation, cabling and testing with the EI supplier; relay-interlocking circuit modifications at working stations.",
    what: [
      "Electronic Interlocking (EI) installation and cabling",
      "Testing with the EI supplier and Railway S&T staff",
      "Relay interlocking circuit modifications at working stations",
      "Modifications to suit 25 kV AC traction",
    ],
    proof: ["Approved circuit drawings", "Site and factory test records", "Joint commissioning certificates"],
    where: "Working stations, yards and new lines under Central Railway.",
  },
  {
    level: "L3",
    title: "Signals & trackside works",
    summary: "Signalling for new loop lines, yard remodelling and sidings, from cable route to commissioning.",
    what: [
      "Signals, location boxes and trackside equipment",
      "Block proving by axle counter (BPAC) for doubling",
      "Automatic Block Signalling on running sections",
      "S&T indoor and outdoor works for new lines and yards",
    ],
    proof: ["Axle counter and block test records", "Location-wise installation checks", "Approved signalling plans"],
    where: "TPND–PNVL, Nilje–Taloja, Jaysingpur and Rukadi.",
  },
  {
    level: "L2",
    title: "Level crossings",
    summary: "Mechanical to electrical lifting barriers, with interlocking of LC gates to station and approach signals.",
    what: [
      "Conversion of mechanical to electrical lifting barriers",
      "Interlocking of LC gates with station and approach signals",
      "Indoor wiring and outdoor work for gate interlocking",
      "Gate protection and warning system checks",
    ],
    proof: ["Gate interlocking test records", "Barrier commissioning checks", "Approved gate circuitry"],
    where: "19 gates on Konkan Railway (Karwar Division); Kashti–Shrigonda on Solapur Division.",
  },
  {
    level: "L1",
    title: "Earthing, surge protection & cabling",
    summary: "Lightning and power faults cause many signalling failures. Good earthing and SPD stop them at the source.",
    what: [
      "Section-wide earthing improvement for S&T equipment",
      "Surge protection devices at equipment rooms and locations",
      "Fire-rated polyolefin cable channels",
      "Signalling cable laying and protection",
    ],
    proof: ["Earth-resistance readings for every pit", "SPD installation records", "Cable channel fire-rating documents"],
    where: "Daund–Manmad section; cable channels in Pune Division.",
  },
];

export const telecomLayers: CapabilityLayer[] = [
  {
    level: "L5",
    title: "NMS, maintenance & CAMC",
    summary: "Network monitoring and long-term comprehensive maintenance, so the route keeps talking years after handover.",
    what: [
      "Network monitoring systems (NMS) and health checks",
      "Comprehensive AMC / CAMC along pipeline and rail routes",
      "Card-level repair of FTU and controller cards with live testing",
      "Fault response and maintenance planning",
    ],
    proof: ["NMS alarms and fault logs", "Maintenance visit records", "Card-level repair and test records"],
    where: "Bina–Panki (BPCL); Tundla–Gwalior and Kanpur–Lucknow (IOCL).",
  },
  {
    level: "L4",
    title: "CCTV, access control & PA",
    summary: "IP CCTV for tunnels, depots, stations and plants, with recording, access control and public address.",
    what: [
      "IP CCTV for tunnels, depots, stations and plants",
      "NVR recording and access control",
      "Public address and audio-conferencing systems",
      "CCTV surveillance for railway tunnels and signal depots",
    ],
    proof: ["Camera and recording checks", "Coverage and storage verification", "Integrated system tests"],
    where: "Railway tunnels and signal depots in Pune Division.",
  },
  {
    level: "L3",
    title: "Voice, radio & EPABX",
    summary: "Telephone exchanges and radio for operational control along a route or plant.",
    what: [
      "EPABX installation, configuration and integration",
      "VHF radio and audio-conferencing",
      "Telecom shelters, RTU and SCADA interfacing",
      "Pipeline station telecom",
    ],
    proof: ["Exchange and radio commissioning records", "End-to-end call and channel tests", "As-built network diagrams"],
    where: "Pipeline and railway telecom networks in MP, UP and Maharashtra.",
  },
  {
    level: "L2",
    title: "Transmission: IP-MPLS & SDH",
    summary: "Network design, router and SDH node installation, ring protection and SDH-to-IP-MPLS migration.",
    what: [
      "IP-MPLS network design and router configuration",
      "SDH node installation and ring protection",
      "Migration from SDH to IP-MPLS",
      "Network monitoring and performance baselining",
    ],
    proof: ["Link and ring test reports", "Configuration and routing records", "Migration cut-over plans"],
    where: "BPCL Bina–Panki pipeline; IOCL pipeline telecom networks.",
  },
  {
    level: "L1",
    title: "OFC & cable plant",
    summary: "HDPE ducts, fibre laying and blowing, splicing and OTDR-tested handover.",
    what: [
      "HDPE duct laying and route preparation",
      "Fibre laying and blowing",
      "Splicing and termination",
      "OTDR testing and acceptance documentation",
    ],
    proof: ["OTDR traces for every link", "Splice loss records", "Route and as-built drawings"],
    where: "Railway and pipeline routes across Maharashtra, MP and UP.",
  },
];

export const processStages = [
  {
    step: "01",
    title: "Understand requirements",
    kicker: "Requirement",
    body: "Site survey, cable route and constraint study. We read the tender, the drawings and the working conditions before pricing a single item.",
    output: "Site survey · Tender review · BOQ basis",
  },
  {
    step: "02",
    title: "Engineering & planning",
    kicker: "Engineering",
    body: "Circuit or network design, drawings, bill of quantities and an execution programme that fits the railway's traffic blocks.",
    output: "Drawings · BOQ · Programme",
  },
  {
    step: "03",
    title: "Procurement & coordination",
    kicker: "Supply",
    body: "Approved material, vendor coordination and inspection — with the EI supplier, the telecom OEM or the pipeline operator.",
    output: "Approved make · Inspection · Delivery plan",
  },
  {
    step: "04",
    title: "Installation & execution",
    kicker: "Execution",
    body: "Our own site crews install cabling, equipment and outdoor gear, with daily attendance and work records for every site.",
    output: "Daily progress · Safety · Site records",
  },
  {
    step: "05",
    title: "Testing & commissioning",
    kicker: "Commissioning",
    body: "Circuit, link and system tests, then joint commissioning with the client's engineers — EI, axle counters, OTDR, CCTV and NMS.",
    output: "Test reports · OTDR traces · Joint commissioning",
  },
  {
    step: "06",
    title: "Delivery & support",
    kicker: "Upkeep",
    body: "As-built documentation, handover and long-term AMC / CAMC with fault response and card-level repair.",
    output: "As-builts · Handover · AMC / CAMC",
  },
];

export const whySigtel = [
  {
    title: "Signalling and telecom under one roof",
    body: "One contractor for the signal, the gate, the fibre and the network, so nothing falls between two vendors.",
  },
  {
    title: "Our own site crews",
    body: "Site in-charges and technicians on our rolls, with daily attendance and work records for every site.",
  },
  {
    title: "Proof at handover",
    body: "Test reports, OTDR traces, as-built drawings and joint commissioning records for every job.",
  },
  {
    title: "We stay after commissioning",
    body: "AMC and CAMC with fault logs and card-level repair, so the system keeps working years later.",
  },
];

export const infrastructure = [
  {
    tag: "Signalling",
    title: "Interlocking & control",
    body: "Electronic and relay interlocking installation, cabling, circuit modification and joint testing with the EI supplier.",
    items: ["Electronic Interlocking", "Relay interlocking", "Panel and control desk interfaces", "25 kV AC traction modifications"],
  },
  {
    tag: "Signalling",
    title: "Trackside equipment",
    body: "Signals, location boxes, point machines, axle counters and track circuits — installed, wired and proven.",
    items: ["Signals and route indicators", "Point machines and rodding", "Axle counters & BPAC", "Track circuits", "Location boxes and cabling"],
  },
  {
    tag: "Signalling",
    title: "Protection & earthing",
    body: "Section-wide earthing, surge protection and fire-rated cable protection for S&T assets.",
    items: ["Earth pits and bonding", "Surge protection devices", "Fire-rated polyolefin channels", "Cable routes and protection"],
  },
  {
    tag: "Telecom",
    title: "Transmission & networking",
    body: "OFC plant and IP-MPLS / SDH transmission, designed, installed and tested link by link.",
    items: ["HDPE duct and fibre blowing", "Splicing and OTDR testing", "SDH nodes and ring protection", "IP-MPLS routers", "NMS integration"],
  },
  {
    tag: "Telecom",
    title: "Surveillance & voice",
    body: "CCTV, access control, public address, EPABX and radio for operational visibility and control.",
    items: ["IP CCTV and NVR", "Access control", "Public address", "EPABX and audio-conferencing", "VHF radio"],
  },
  {
    tag: "Delivery",
    title: "Testing & maintenance",
    body: "The proof and the upkeep: test documentation at handover and comprehensive maintenance afterwards.",
    items: ["Joint commissioning", "OTDR and link acceptance", "Card-level repair", "AMC / CAMC", "Fault response"],
  },
];

export const faqs = [
  {
    q: "Which railways and organisations does SIG-TEL work with?",
    a: "Central Railway (Mumbai, Pune and Solapur divisions), Konkan Railway, and railway organisations including RVNL, MRVC and RailTel. On the telecom side we work with BPCL, IOCL, BSNL, Siemens, Optilan India and Honeywell Automation India.",
  },
  {
    q: "Do you take on both signalling and telecom scope in one contract?",
    a: "Yes. Working in both disciplines is the reason the company exists. Signalling and telecom crews sit under one engineering team, so interfaces between the signal, the gate, the fibre and the network are handled by one accountable contractor.",
  },
  {
    q: "Can you work inside running railway stations and traffic blocks?",
    a: "Most of our works register is exactly that: relay-interlocking modifications, LC gate interlocking and S&T works at working stations. Execution is planned around available traffic blocks, with the Railway's S&T staff in the loop.",
  },
  {
    q: "Do you maintain systems after commissioning?",
    a: "Yes. AMC and CAMC are part of our scope on both sides — signalling upkeep and pipeline/railway telecom networks, including card-level repair and network monitoring.",
  },
  {
    q: "How do we start a conversation about a tender or a network?",
    a: "Send the tender reference, drawings or route details through the contact form or WhatsApp. We usually respond the same working day with the questions we need answered to quote.",
  },
];

export const states = [
  { name: "Maharashtra", sites: "Navi Mumbai · Mumbai · Pune · Daund · Kashti–Shrigonda · Lonand · Miraj · Jaysingpur · Rukadi", count: 12 },
  { name: "Goa", sites: "Konkan route works", count: 1 },
  { name: "Karnataka", sites: "Karwar Division · Uttara Kannada", count: 1 },
  { name: "Madhya Pradesh", sites: "Bina · Gwalior", count: 2 },
  { name: "Uttar Pradesh", sites: "Panki–Kanpur · Lucknow · Agra · Tundla", count: 2 },
];
