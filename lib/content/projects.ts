import type { Project } from "@/lib/types";

/**
 * Works register — titles, clients, divisions and locations are as published by SIG-TEL.
 * Case-study narrative describes the scope of the published work; it does not add
 * unverified quantities, values or client statements.
 */
export const projects: Project[] = [
  {
    id: "p01",
    slug: "lc-gate-interlocking-signalling-material",
    title: "Interlocking of level crossing gates: signalling material, indoor wiring and outdoor work",
    shortTitle: "Level crossing gate interlocking",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Mumbai Division",
    location: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lng: 72.877,
    summary:
      "Gate interlocking with station and approach signals, delivered as a complete indoor-and-outdoor signalling package: material, wiring, outdoor work and joint testing.",
    overview:
      "Level crossing gates on a running section only become safe when they are locked into the signalling system. This work covered the interlocking of LC gates — supplying the signalling material, carrying out indoor wiring and completing the outdoor work needed to bring each gate under the control of station and approach signals. The package was executed at a working station where the existing signalling could not be taken out of service for long.",
    scope: [
      "Supply of signalling material for gate interlocking",
      "Indoor wiring and relay room modifications",
      "Outdoor work at the LC gate and signal locations",
      "Integration of gate controls with station and approach signals",
      "Testing and joint commissioning with Railway S&T staff",
    ],
    challenges: [
      {
        title: "Working around live traffic",
        body: "The station stayed in service throughout. Disconnections and circuit changes were sequenced into planned blocks and restored before each traffic window closed.",
      },
      {
        title: "Keeping the gate usable during changeover",
        body: "The gate had to remain operational for road traffic while its controls moved from the existing arrangement to the interlocked one.",
      },
    ],
    approach: [
      {
        title: "Drawings first",
        body: "Indoor and outdoor circuits were approved before any wiring was touched, so the changeover sequence was agreed with the Railway's S&T staff in advance.",
      },
      {
        title: "Wiring in stages",
        body: "Indoor wiring was prepared and buzz-tested in stages, then connected during blocks — reducing the live disconnection window on each occasion.",
      },
      {
        title: "Proof at handover",
        body: "Gate and signal functions were tested jointly, with test records handed over alongside the as-built drawings.",
      },
    ],
    equipment: ["Gate interlocking circuits", "Signalling relays and indoor wiring", "Approach and station signals", "Signalling cable", "Location boxes"],
    results: [
      "Gate brought under the interlocking of station and approach signals",
      "Indoor and outdoor work completed with joint testing",
      "Test records and as-built drawings handed over",
    ],
    images: ["/images/installation-works.jpg", "/images/signalling-daylight.jpg", "/images/station-daylight.jpg"],
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: "p02",
    slug: "replacement-signalling-gears-mumbai",
    title: "Replacement of signalling gears with supply of material and outdoor work",
    shortTitle: "Signalling gear replacement",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Mumbai Division",
    location: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lng: 72.877,
    summary:
      "Ageing trackside signalling gears replaced on a busy suburban section, with material supply and all outdoor work handled by SIG-TEL crews.",
    overview:
      "Trackside signalling equipment wears with traffic and weather. This work replaced signalling gears on the Mumbai Division with new material and the associated outdoor work — locating, fixing, wiring and testing each item so that the section's signalling performance was restored without disturbing the operating timetable.",
    scope: [
      "Survey of existing gears and replacement plan",
      "Supply of signalling material and gears",
      "Removal and replacement of trackside equipment",
      "Outdoor cabling and terminations",
      "Testing with Railway S&T staff",
    ],
    challenges: [
      {
        title: "Dense suburban traffic",
        body: "Replacement windows were short and frequent rather than long and rare. Each location was planned as a self-contained task that could be closed inside its own block.",
      },
      {
        title: "Exposed trackside conditions",
        body: "Coastal humidity and monsoon exposure demanded careful sealing and termination work on every replaced item.",
      },
    ],
    approach: [
      {
        title: "Location-wise packages",
        body: "Work was broken down location by location, with material staged ahead of each block so crews were not waiting on site.",
      },
      {
        title: "Same-shift proving",
        body: "Each replaced gear was wired, checked and proved in the same shift, so the section never carried a half-finished location into traffic.",
      },
    ],
    equipment: ["Trackside signalling gears", "Signalling cable and terminations", "Location boxes", "Earthing and bonding"],
    results: [
      "Signalling gears replaced across the section",
      "Outdoor work completed within railway blocks",
      "Functional checks completed with the division's S&T staff",
    ],
    images: ["/images/signalling-daylight.jpg", "/images/hero-daylight.jpg", "/images/station-daylight.jpg"],
    published: true,
    order: 2,
  },
  {
    id: "p03",
    slug: "bpac-doubling-axle-counter",
    title: "Block Proving by Axle Counter (BPAC) for doubling: supply, installation & commissioning",
    shortTitle: "BPAC for doubling",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Mumbai Division",
    location: "Mumbai",
    state: "Maharashtra",
    lat: 19.05,
    lng: 72.9,
    summary:
      "Block proving by axle counter installed and commissioned as part of a doubling scheme — the safety layer that confirms a block is clear before the next train is admitted.",
    overview:
      "When a single line is doubled, the block section needs a reliable means of proving that it is clear. Block Proving by Axle Counter does that by counting axles in and out of the section. SIG-TEL supplied, installed and commissioned the BPAC equipment, including trackside axle counter heads, evaluation units, cabling and the interface to the block instruments.",
    scope: [
      "Supply of axle counter and block proving equipment",
      "Installation of trackside axle counter heads",
      "Evaluation unit installation and cabling",
      "Interface with block instruments and panel",
      "Testing and joint commissioning",
    ],
    challenges: [
      {
        title: "Count integrity at the block joint",
        body: "Axle counter performance depends on precise head positioning and clean cable routes. Alignment and termination were checked before any evaluation equipment was energised.",
      },
      {
        title: "Commissioning without disrupting the section",
        body: "The BPAC was proven while the section continued to run, using planned blocks for head installation and testing.",
      },
    ],
    approach: [
      {
        title: "Equipment-first checks",
        body: "Heads and cable routes were installed and individually checked first, so evaluation and integration faults could be isolated quickly.",
      },
      {
        title: "Count tests before handover",
        body: "Counting was verified against test train movements, then the block interface was proved jointly with Railway staff.",
      },
    ],
    equipment: ["Axle counter heads and evaluation units", "Block proving equipment", "Signalling cable and joints", "Earthing and surge protection"],
    results: [
      "BPAC installed and proven for the doubling scheme",
      "Block interface commissioned with the division",
      "Count and function tests recorded at handover",
    ],
    images: ["/images/signalling-daylight.jpg", "/images/hero-daylight.jpg", "/images/hero-daylight.jpg"],
    published: true,
    order: 3,
  },
  {
    id: "p04",
    slug: "intermediate-block-signalling-nilje-taloja",
    title: "S&T indoor & outdoor equipment for Intermediate Block Signalling, Nilje–Taloja section",
    shortTitle: "Intermediate Block Signalling, Nilje–Taloja",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Mumbai Division",
    location: "Nilje–Taloja, Raigad",
    state: "Maharashtra",
    lat: 19.06,
    lng: 73.11,
    summary:
      "Complete indoor and outdoor S&T equipment for an Intermediate Block Signalling section, increasing line capacity between two block stations.",
    overview:
      "Intermediate Block Signalling splits a long block section so more trains can follow each other safely. SIG-TEL delivered the S&T indoor and outdoor equipment for the Nilje–Taloja section: location equipment, cabling, signal apparatus and the indoor interfaces needed to make the intermediate block work as designed.",
    scope: [
      "Indoor S&T equipment installation and wiring",
      "Outdoor location boxes, signals and cabling",
      "Cable route preparation and termination",
      "Interfacing with existing block instruments",
      "Testing and commissioning support",
    ],
    challenges: [
      {
        title: "Interfacing with an existing interlocking",
        body: "The new intermediate block had to work with signalling already in service, so every interface was identified and proven before connection.",
      },
      {
        title: "Cable routes in an operational area",
        body: "Routes crossed built-up operational ground, requiring careful excavation, ducting and protection works.",
      },
    ],
    approach: [
      {
        title: "Interface matrix",
        body: "Every existing circuit the new block touched was listed, checked and signed off as a discrete interface.",
      },
      {
        title: "Outdoor before indoor",
        body: "Outdoor apparatus and cabling were completed and meggered first, so indoor testing could proceed against known-good field equipment.",
      },
    ],
    equipment: ["Signals and route indicators", "Location boxes", "Signalling cable and terminations", "Intermediate block apparatus"],
    results: [
      "Indoor and outdoor S&T equipment delivered for the section",
      "Intermediate block proven with the division's S&T staff",
      "Section handed over with test documentation",
    ],
    images: ["/images/station-daylight.jpg", "/images/hero-daylight.jpg", "/images/signalling-daylight.jpg"],
    published: true,
    order: 4,
  },
  {
    id: "p05",
    slug: "automatic-block-signalling-tpnd-pnvl",
    title: "Automatic Block Signalling, TPND–PNVL section",
    shortTitle: "Automatic Block Signalling",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Mumbai Division",
    location: "TPND–PNVL (Panvel)",
    state: "Maharashtra",
    lat: 18.99,
    lng: 73.12,
    summary:
      "Automatic block signalling installed on the TPND–PNVL section, replacing manual block working with track-circuit-controlled automatic block sections.",
    overview:
      "Automatic Block Signalling allows successive trains to follow each other at controlled intervals, with the block instrument replaced by track-circuit logic and automatic signals. SIG-TEL executed the S&T works on the TPND–PNVL section — trackside apparatus, cabling, automatic signalling equipment and the testing needed to bring the section into automatic working.",
    scope: [
      "Installation of automatic block signalling apparatus",
      "Track circuit and axle counter installation",
      "Automatic signal erection and wiring",
      "Cable laying, termination and protection",
      "Testing and commissioning of automatic block working",
    ],
    challenges: [
      {
        title: "Proving every block section",
        body: "Automatic working demands that each block section and its overlaps be proven individually before the section is declared automatic.",
      },
      {
        title: "Monsoon-condition reliability",
        body: "Cable joints, terminations and earth connections were executed to withstand heavy coastal rainfall.",
      },
    ],
    approach: [
      {
        title: "Section-by-section proving",
        body: "Each automatic block section was tested as a discrete unit, with records maintained section-wise.",
      },
      {
        title: "Joint testing discipline",
        body: "Testing was carried out with the Railway's S&T staff present, so acceptance happened as the work progressed rather than at the end.",
      },
    ],
    equipment: ["Automatic signals", "Track circuits and axle counters", "Block signalling apparatus", "Signalling cable and location boxes"],
    results: [
      "Automatic block signalling commissioned on the section",
      "Section-wise test records maintained",
      "Handover completed with as-built documentation",
    ],
    images: ["/images/hero-daylight.jpg", "/images/hero-daylight.jpg", "/images/station-daylight.jpg"],
    published: true,
    order: 5,
  },
  {
    id: "p06",
    slug: "signalling-25kv-ac-traction-mbpt-yard",
    title: "Signalling & interlocking modified to suit 25 kV AC traction, MBPT railway yard",
    shortTitle: "25 kV AC traction modifications, MBPT yard",
    division: "signalling",
    status: "completed",
    client: "Mumbai Port (MBPT)",
    location: "Mumbai Port yard",
    state: "Maharashtra",
    lat: 18.96,
    lng: 72.85,
    summary:
      "Existing signalling and interlocking modified for 25 kV AC electrification — including immunisation of circuits and protection of trackside apparatus.",
    overview:
      "Electrifying a yard to 25 kV AC changes the electrical environment for every trackside circuit. This work modified the signalling and interlocking at the Mumbai Port railway yard so that existing apparatus could operate safely under AC traction, covering circuit immunisation, apparatus protection and the associated testing.",
    scope: [
      "Modification of existing interlocking circuits for 25 kV AC",
      "Immunisation of signalling circuits and apparatus",
      "Trackside apparatus earthing and bonding",
      "Cable route protection against traction current",
      "Testing and commissioning of modified circuits",
    ],
    challenges: [
      {
        title: "Working inside an existing yard layout",
        body: "The yard's interlocking had to be modified without losing the operating layout that port traffic depended on.",
      },
      {
        title: "Traction current interference",
        body: "Immunisation required a clear understanding of return-current paths and every circuit that crossed them.",
      },
    ],
    approach: [
      {
        title: "Circuit audit",
        body: "Existing circuits were audited against the AC traction arrangements so that modifications were targeted rather than wholesale.",
      },
      {
        title: "Modify, test, restore",
        body: "Each circuit group was modified, tested and restored in sequence, keeping the yard operable throughout.",
      },
    ],
    equipment: ["Immunised signalling circuits", "Interlocking relays and wiring", "Earthing and bonding", "Signalling cable protection"],
    results: [
      "Signalling and interlocking modified for 25 kV AC traction",
      "Existing yard operations maintained through the changeover",
      "Modified circuits tested and handed over",
    ],
    images: ["/images/hero-daylight.jpg", "/images/signalling-daylight.jpg", "/images/signalling-daylight.jpg"],
    published: true,
    order: 6,
  },
  {
    id: "p07",
    slug: "permanent-neutral-section-mumbai-suburban",
    title: "Permanent neutral section on Mumbai suburban Main line, Harbour line & Trans-Harbour line",
    shortTitle: "Permanent neutral sections",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Mumbai Division",
    location: "Mumbai suburban",
    state: "Maharashtra",
    lat: 19.04,
    lng: 72.88,
    summary:
      "Permanent neutral section works coordinated with signalling interfaces across three suburban corridors, executed inside Mumbai's tightest traffic blocks.",
    overview:
      "Permanent neutral sections separate traction feeds on an electrified network. Installing them on the Main, Harbour and Trans-Harbour lines meant coordinating with signalling, traction power and traffic planning across three of the busiest corridors in the country. SIG-TEL's scope covered the associated works and the signalling-side interfaces.",
    scope: [
      "Coordination with traction power and signalling interfaces",
      "Associated signalling circuit works and checks",
      "Site works within planned traffic blocks",
      "Testing and restoration before each traffic window",
    ],
    challenges: [
      {
        title: "Three corridors at once",
        body: "Each corridor has different traffic characteristics and different block availability; the programme had to respect all three.",
      },
      {
        title: "Minutes, not hours",
        body: "Suburban blocks are measured in minutes. All material and manpower were staged before the block began.",
      },
    ],
    approach: [
      {
        title: "Block-by-block planning",
        body: "Each block was planned as a closed task list with a defined restoration checklist.",
      },
      {
        title: "Signalling interface ownership",
        body: "Because the signalling side was ours, traction and signalling interfaces were resolved inside one team.",
      },
    ],
    equipment: ["Signalling interface circuits", "Trackside earthing and bonding", "Cable protection works"],
    results: [
      "Works completed across Main, Harbour and Trans-Harbour lines",
      "Signalling interfaces checked before each restoration",
      "Corridor operations maintained",
    ],
    images: ["/images/station-daylight.jpg", "/images/hero-daylight.jpg", "/images/control-room.jpg"],
    published: true,
    order: 7,
  },
  {
    id: "p08",
    slug: "lc-gate-07-kashti-shrigonda",
    title: "Interlocking of LC gate no. 07, Kashti–Shrigonda section",
    shortTitle: "LC gate no. 07 interlocking",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Solapur Division",
    location: "Kashti–Shrigonda, Km 286/3–4",
    state: "Maharashtra",
    lat: 18.62,
    lng: 74.7,
    summary:
      "A single level crossing gate interlocked with station and approach signals on the Kashti–Shrigonda section of Solapur Division.",
    overview:
      "Gate no. 07 on the Kashti–Shrigonda section was brought under signalling interlocking, so the gate's position became part of the station's route logic. The work covered gate apparatus, cabling, indoor circuit work and joint testing with the division.",
    scope: [
      "Gate apparatus installation and wiring",
      "Cable laying from gate to location",
      "Indoor circuit modifications",
      "Interlocking with station and approach signals",
      "Joint testing and commissioning",
    ],
    challenges: [
      {
        title: "Remote location logistics",
        body: "Material and crews had to be staged at a rural site with limited access, ahead of available blocks.",
      },
      {
        title: "Road and rail users",
        body: "The gate serves local road traffic; the changeover had to keep the crossing usable while circuits were modified.",
      },
    ],
    approach: [
      {
        title: "Pre-assembly",
        body: "Gate apparatus and cable lengths were prepared and tested before mobilisation to site.",
      },
      {
        title: "Single-window testing",
        body: "Gate, signal and panel functions were proven together rather than in separate visits.",
      },
    ],
    equipment: ["LC gate apparatus", "Signalling cable", "Relay interlocking modifications", "Location boxes"],
    results: [
      "Gate no. 07 interlocked with station and approach signals",
      "Joint testing completed with Solapur Division",
      "Gate handed over in working condition",
    ],
    images: ["/images/installation-works.jpg", "/images/signalling-daylight.jpg", "/images/engineering-survey.jpg"],
    published: true,
    order: 8,
  },
  {
    id: "p09",
    slug: "cctv-railway-tunnels-pune",
    title: "CCTV surveillance for railway tunnels",
    shortTitle: "CCTV for railway tunnels",
    division: "telecom",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Pune Division",
    location: "Pune Division tunnels",
    state: "Maharashtra",
    lat: 18.52,
    lng: 73.86,
    summary:
      "IP CCTV coverage inside railway tunnels, with fibre backhaul, recording and monitoring for the division's operations team.",
    overview:
      "Tunnels are among the hardest places on a railway to see into. This work delivered CCTV surveillance inside tunnels on Pune Division, combining IP cameras, fibre backhaul, recording and the monitoring arrangement needed by operations staff — all installed in an environment with restricted access and no room for error.",
    scope: [
      "IP camera installation in tunnel sections",
      "Fibre and cable backhaul with protection",
      "NVR recording and monitoring configuration",
      "Power supply and earthing for tunnel equipment",
      "System testing and handover",
    ],
    challenges: [
      {
        title: "Access and possession",
        body: "Tunnel work requires possessions; all installation was planned around limited access windows.",
      },
      {
        title: "Dust, moisture and vibration",
        body: "Equipment mounting, sealing and cable routing were selected for a wet, dusty and vibrating environment.",
      },
    ],
    approach: [
      {
        title: "Coverage design before cameras",
        body: "Camera positions were planned against the tunnel geometry so that each unit covered the intended zone.",
      },
      {
        title: "Backhaul first",
        body: "Fibre and power were completed and tested before cameras were mounted, avoiding repeat visits.",
      },
    ],
    equipment: ["IP CCTV cameras", "NVR and monitoring", "Fibre backhaul", "Earthing and surge protection"],
    results: [
      "Tunnel surveillance operational for the division",
      "Recording and monitoring configured and tested",
      "System handed over with documentation",
    ],
    images: ["/images/cctv-daylight.jpg", "/images/radio-mast.jpg", "/images/telecom-fibre.jpg"],
    published: true,
    order: 9,
  },
  {
    id: "p10",
    slug: "circuit-modifications-miraj",
    title: "Circuit modifications to remove operational constraints, Miraj",
    shortTitle: "Operational circuit modifications, Miraj",
    division: "signalling",
    status: "ongoing",
    client: "Central Railway",
    clientDivision: "Pune Division",
    location: "Miraj",
    state: "Maharashtra",
    lat: 16.83,
    lng: 74.65,
    summary:
      "Interlocking circuit modifications at Miraj to remove operating constraints, executed without disturbing the station's working layout.",
    overview:
      "Operational constraints inside an interlocking often come from circuit logic that no longer matches how the station is worked. This work modifies the circuits at Miraj to remove those constraints, with each change drawn, approved and tested before it is placed in service.",
    scope: [
      "Study of existing circuits and constraints",
      "Modification drawings and approval",
      "Relay room circuit changes",
      "Testing of modified routes and functions",
    ],
    challenges: [
      {
        title: "Live interlocking",
        body: "Every change touches circuits in service. Modifications are grouped to keep disconnection time inside available blocks.",
      },
    ],
    approach: [
      {
        title: "Constraint mapping",
        body: "Each operational constraint is traced to the specific circuit condition causing it before any change is proposed.",
      },
      {
        title: "Approved change control",
        body: "Drawings are approved, changes are recorded, and modified functions are jointly tested.",
      },
    ],
    equipment: ["Relay interlocking circuits", "Signalling relays", "Indoor wiring", "Test instruments"],
    results: [
      "Circuit modifications in progress under an approved change process",
      "Station working maintained through each stage",
    ],
    images: ["/images/signalling-daylight.jpg", "/images/signalling-daylight.jpg", "/images/station-daylight.jpg"],
    published: true,
    order: 10,
  },
  {
    id: "p11",
    slug: "cctv-signal-depots-lonand-miraj",
    title: "CCTV at signal depots, Lonand & Miraj",
    shortTitle: "CCTV at signal depots",
    division: "telecom",
    status: "ongoing",
    client: "Central Railway",
    clientDivision: "Pune Division",
    location: "Lonand & Miraj",
    state: "Maharashtra",
    lat: 18.03,
    lng: 74.2,
    summary:
      "Surveillance coverage at two signal depots, giving the division visibility of equipment storage and workshop activity.",
    overview:
      "Signal depots hold critical spares and equipment. CCTV coverage at Lonand and Miraj provides the division with visibility over depot activity and stored assets, using IP cameras, local recording and network access.",
    scope: [
      "Camera positioning and installation at both depots",
      "Cabling and network connectivity",
      "NVR recording and access setup",
      "Testing and handover",
    ],
    challenges: [
      {
        title: "Two sites, one standard",
        body: "Both depots were configured to the same standard so the division monitors them consistently.",
      },
    ],
    approach: [
      {
        title: "Coverage survey",
        body: "Each depot's entry, storage and workshop areas were surveyed before camera positions were fixed.",
      },
      {
        title: "Integrated testing",
        body: "Recording, remote viewing and retention were tested together at handover.",
      },
    ],
    equipment: ["IP CCTV cameras", "NVR recording", "Network cabling", "Earthing and surge protection"],
    results: [
      "Depot surveillance installed at Lonand and Miraj",
      "Recording and monitoring tested at handover",
    ],
    images: ["/images/cctv-daylight.jpg", "/images/telecom-fibre.jpg", "/images/radio-mast.jpg"],
    published: true,
    order: 11,
  },
  {
    id: "p12",
    slug: "circuit-modifications-pune",
    title: "Circuit modifications to remove operational constraints, Pune",
    shortTitle: "Operational circuit modifications, Pune",
    division: "signalling",
    status: "ongoing",
    client: "Central Railway",
    clientDivision: "Pune Division",
    location: "Pune",
    state: "Maharashtra",
    lat: 18.52,
    lng: 73.86,
    summary:
      "Interlocking circuit modifications at Pune, targeted at the specific logic conditions that constrain how the station can be worked.",
    overview:
      "Pune is a busy junction where small circuit constraints have an outsized effect on punctuality. This work identifies those constraints, modifies the interlocking circuits responsible and proves the modified functions with the division's S&T staff.",
    scope: [
      "Circuit study and constraint identification",
      "Modification drawings and approvals",
      "Relay room wiring changes during blocks",
      "Joint functional testing",
    ],
    challenges: [
      {
        title: "High traffic density",
        body: "Disconnection windows are scarce, so each circuit change is scoped to fit a single block.",
      },
    ],
    approach: [
      {
        title: "Pre-wire, then connect",
        body: "Modification wiring is prepared and buzzed before the block, leaving only connection and testing for the live window.",
      },
      {
        title: "Documented change",
        body: "Every change is recorded on approved drawings and reflected in as-builts.",
      },
    ],
    equipment: ["Relay interlocking modifications", "Indoor cabling", "Signalling relays", "Testing instruments"],
    results: [
      "Modification programme in progress at Pune",
      "Approved drawings maintained for every change",
    ],
    images: ["/images/signalling-daylight.jpg", "/images/signalling-daylight.jpg", "/images/hero-daylight.jpg"],
    published: true,
    order: 12,
  },
  {
    id: "p13",
    slug: "camc-sdh-cctv-epabx-bina-panki",
    title: "CAMC of SDH, CCTV, access control & EPABX, Bina–Panki pipeline",
    shortTitle: "Pipeline telecom CAMC (BPCL)",
    division: "telecom",
    status: "ongoing",
    client: "BPCL",
    location: "Bina – Panki (Kanpur)",
    state: "Madhya Pradesh / Uttar Pradesh",
    lat: 24.18,
    lng: 78.2,
    summary:
      "Comprehensive maintenance of the pipeline's telecom backbone — SDH transmission, CCTV, access control and EPABX — along a route that crosses two states.",
    overview:
      "Pipeline telecom is the operator's eyes and voice along the route. This comprehensive annual maintenance contract covers SDH transmission, CCTV, access control and EPABX across the Bina–Panki pipeline, with scheduled health checks and fault response at stations spread over hundreds of kilometres.",
    scope: [
      "SDH transmission maintenance and fault response",
      "CCTV and access control upkeep",
      "EPABX maintenance and configuration",
      "Scheduled health checks across stations",
      "Spare and card management",
    ],
    challenges: [
      {
        title: "Geography",
        body: "Stations are distributed across Madhya Pradesh and Uttar Pradesh, so fault response is planned by region rather than from a single base.",
      },
      {
        title: "Continuity of service",
        body: "Pipeline operations depend on voice and data staying up; maintenance is scheduled to avoid interrupting either.",
      },
    ],
    approach: [
      {
        title: "Preventive schedule",
        body: "Health checks are planned station by station through the year, with records for every visit.",
      },
      {
        title: "Fault closure discipline",
        body: "Each fault is logged, attended and closed with a record, so recurring failures become visible in the trend.",
      },
    ],
    equipment: ["SDH transmission equipment", "IP CCTV and NVR", "Access control systems", "EPABX"],
    results: [
      "CAMC running across the Bina–Panki pipeline",
      "Station-wise maintenance records maintained",
      "Fault response process in operation",
    ],
    images: ["/images/radio-mast.jpg", "/images/cctv-daylight.jpg", "/images/telecom-fibre.jpg"],
    featured: true,
    published: true,
    order: 13,
  },
  {
    id: "p14",
    slug: "loop-lines-jaysingpur-rukadi",
    title: "S&T works for additional B-class loop lines at Jaysingpur & Rukadi",
    shortTitle: "B-class loop lines",
    division: "signalling",
    status: "ongoing",
    client: "Central Railway",
    clientDivision: "Pune Division",
    location: "Jaysingpur & Rukadi",
    state: "Maharashtra",
    lat: 16.79,
    lng: 74.57,
    summary:
      "Signalling and telecom works for additional B-class loop lines at two stations, from point and signal apparatus to indoor interfaces.",
    overview:
      "Additional loop lines lengthen the station's capacity to hold and cross trains. The S&T scope at Jaysingpur and Rukadi covers the trackside apparatus — points, signals, track circuits — along with the indoor interlocking work needed to bring the new lines into the station's route logic.",
    scope: [
      "Point machines and rodding for new loop lines",
      "Signals, route indicators and trackside apparatus",
      "Track circuits and axle counters",
      "Indoor interlocking modifications",
      "Testing and commissioning",
    ],
    challenges: [
      {
        title: "Working station",
        body: "Both stations remain in service; new lines are brought into the interlocking in stages.",
      },
      {
        title: "Civil-signalling interface",
        body: "Track and point geometry must be confirmed before signalling apparatus is aligned and connected.",
      },
    ],
    approach: [
      {
        title: "Geometry first",
        body: "Point and track positions are verified with the civil agency before rodding and connections are made.",
      },
      {
        title: "Staged integration",
        body: "New routes are integrated and tested one at a time, keeping existing routes available.",
      },
    ],
    equipment: ["Point machines and rodding", "Signals and route indicators", "Track circuits / axle counters", "Indoor interlocking wiring"],
    results: [
      "S&T works in progress at Jaysingpur and Rukadi",
      "New loop routes being integrated with existing station logic",
    ],
    images: ["/images/hero-daylight.jpg", "/images/hero-daylight.jpg", "/images/signalling-daylight.jpg"],
    published: true,
    order: 14,
  },
  {
    id: "p15",
    slug: "camc-iocl-pipeline-telecom",
    title: "CAMC of pipeline telecom network: EPABX, CCTV, audio-conferencing & NMS, IOCL Tundla–Gwalior & Kanpur–Lucknow pipelines",
    shortTitle: "IOCL pipeline telecom CAMC",
    division: "telecom",
    status: "ongoing",
    client: "IOCL",
    clientDivision: "with Honeywell Automation",
    location: "Tundla–Gwalior · Kanpur–Lucknow",
    state: "Uttar Pradesh",
    lat: 27.21,
    lng: 78.24,
    summary:
      "Comprehensive maintenance across two pipeline telecom networks: EPABX, CCTV, audio-conferencing and network monitoring, delivered with Honeywell Automation.",
    overview:
      "Two IOCL pipeline networks — Tundla–Gwalior and Kanpur–Lucknow — rely on a telecom layer that spans exchanges, surveillance, conferencing and monitoring. SIG-TEL delivers the comprehensive maintenance contract for these systems in partnership with Honeywell Automation India, covering both preventive schedules and fault response.",
    scope: [
      "EPABX maintenance and configuration",
      "CCTV system upkeep",
      "Audio-conferencing system support",
      "NMS monitoring and alarm response",
      "Fault logging and closure across both networks",
    ],
    challenges: [
      {
        title: "Two networks, one contract",
        body: "The two pipeline networks are geographically separate and must be maintained to a single service standard.",
      },
      {
        title: "Multi-vendor environment",
        body: "Working alongside an automation partner requires clean interfaces and agreed escalation paths.",
      },
    ],
    approach: [
      {
        title: "Combined maintenance calendar",
        body: "Preventive visits are scheduled across both networks so coverage is even through the year.",
      },
      {
        title: "Documented response",
        body: "Faults are logged with response and closure records for review with the operator.",
      },
    ],
    equipment: ["EPABX systems", "IP CCTV", "Audio-conferencing units", "NMS platform"],
    results: [
      "CAMC in operation across both IOCL pipeline networks",
      "Multi-vendor coordination with Honeywell Automation India",
      "Fault logs and maintenance records maintained",
    ],
    images: ["/images/telecom-fibre.jpg", "/images/radio-mast.jpg", "/images/cctv-daylight.jpg"],
    featured: true,
    published: true,
    order: 15,
  },
  {
    id: "p16",
    slug: "earthing-surge-protection-dd-mmr",
    title: "Earthing & surge protection for S&T equipment, DD–MMR section",
    shortTitle: "Earthing & surge protection, DD–MMR",
    division: "signalling",
    status: "ongoing",
    client: "Central Railway",
    clientDivision: "Pune Division",
    location: "Daund–Manmad (DD–MMR)",
    state: "Maharashtra",
    lat: 18.47,
    lng: 74.58,
    summary:
      "Section-wide earthing improvement and surge protection for signalling and telecom equipment along the Daund–Manmad section.",
    overview:
      "Lightning and power faults account for a large share of signalling failures. This work improves earthing across the Daund–Manmad section and installs surge protection devices at equipment rooms and locations, then measures the result — earth resistance readings for every pit and SPD installation records.",
    scope: [
      "Earth pit improvement and bonding along the section",
      "Surge protection devices at equipment rooms and locations",
      "Earth resistance measurement and recording",
      "Earthing of signalling and telecom apparatus",
    ],
    challenges: [
      {
        title: "Long section, many locations",
        body: "The section spans a large distance with locations of differing soil conditions; earthing design is adapted per site.",
      },
      {
        title: "Measuring what was built",
        body: "Every pit is measured and recorded, because earthing only counts if it can be proven.",
      },
    ],
    approach: [
      {
        title: "Survey and prioritise",
        body: "Locations with the highest failure exposure are addressed first, based on resistance readings and fault history.",
      },
      {
        title: "Prove every pit",
        body: "Earth resistance is measured and logged at each pit, with SPD installations recorded equipment by equipment.",
      },
    ],
    equipment: ["Earth pits and bonding conductors", "Surge protection devices", "Earthing materials", "Earth testers"],
    results: [
      "Section-wide earthing improvement under way",
      "Earth resistance readings recorded pit by pit",
      "SPD installation records maintained",
    ],
    images: ["/images/engineering-survey.jpg", "/images/signalling-daylight.jpg", "/images/signalling-daylight.jpg"],
    published: true,
    order: 16,
  },
  {
    id: "p17",
    slug: "card-level-repair-ftu-controller-cards",
    title: "Card-level repair of FTU & controller cards with live testing",
    shortTitle: "Card-level repair, FTU & controllers",
    division: "telecom",
    status: "ongoing",
    client: "Honeywell Automation",
    clientDivision: "BPCL Bina",
    location: "Bina",
    state: "Madhya Pradesh",
    lat: 24.18,
    lng: 78.2,
    summary:
      "Component-level repair of FTU and controller cards, proven on live systems before return to service.",
    overview:
      "Pipeline RTUs and controllers fail at card level, and replacing whole units is slow and expensive. This work repairs FTU and controller cards at component level and proves each repaired card on live systems before it goes back into service.",
    scope: [
      "Fault diagnosis to card and component level",
      "Component replacement and repair",
      "Live testing of repaired cards",
      "Record keeping for repaired units",
    ],
    challenges: [
      {
        title: "No room for a bad repair",
        body: "A repaired card must behave exactly like a new one; live testing is the only acceptable proof.",
      },
    ],
    approach: [
      {
        title: "Diagnose, repair, prove",
        body: "Each card is diagnosed, repaired and then tested on live equipment before it is accepted.",
      },
      {
        title: "Repair records",
        body: "Every repaired unit is logged so failure patterns across the network become visible.",
      },
    ],
    equipment: ["FTU cards", "Controller cards", "Test instruments", "Live test rigs"],
    results: [
      "Card-level repair service in operation at BPCL Bina",
      "Repaired cards proven by live testing",
      "Repair records maintained",
    ],
    images: ["/images/telecom-fibre.jpg", "/images/radio-mast.jpg", "/images/cctv-daylight.jpg"],
    published: true,
    order: 17,
  },
  {
    id: "p18",
    slug: "mechanical-to-electrical-lifting-barriers-konkan",
    title: "Mechanical to electrical lifting barriers at 19 LC gates",
    shortTitle: "19 LC gates, Konkan Railway",
    division: "signalling",
    status: "completed",
    client: "Konkan Railway",
    clientDivision: "Karwar Division",
    location: "Karwar Division (Uttara Kannada)",
    state: "Karnataka",
    lat: 14.81,
    lng: 74.13,
    summary:
      "Nineteen manually worked level crossing gates converted to electrical lifting barriers across the Karwar Division of Konkan Railway.",
    overview:
      "Manual lifting barriers are slow for road users and heavy on staff. Across nineteen level crossings in Konkan Railway's Karwar Division, SIG-TEL converted mechanical barriers to electrical lifting barriers — including the drives, controls, cabling and commissioning checks at each gate, on a section exposed to heavy monsoon rainfall.",
    scope: [
      "Conversion of 19 mechanical barriers to electrical operation",
      "Supply and installation of barrier drives and controls",
      "Cabling and power arrangements at each gate",
      "Gate protection checks and commissioning",
    ],
    challenges: [
      {
        title: "Nineteen sites, one monsoon",
        body: "The gates are spread across the division and work had to be sequenced around the Konkan monsoon.",
      },
      {
        title: "Road-user continuity",
        body: "Each crossing serves local traffic; conversions had to keep the gate usable while it was being converted.",
      },
    ],
    approach: [
      {
        title: "Standardised conversion kit",
        body: "A repeatable conversion arrangement was used so each site could be completed and proven to the same standard.",
      },
      {
        title: "Gate-by-gate handover",
        body: "Each gate was commissioned and handed over individually, with its own checks recorded.",
      },
    ],
    equipment: ["Electrical lifting barriers", "Barrier drives and controls", "Cabling and power supply", "Gate protection equipment"],
    results: [
      "19 gates converted to electrical lifting barriers",
      "Each gate commissioned and handed over individually",
      "Division-wide standard applied across sites",
    ],
    images: ["/images/installation-works.jpg", "/images/hero-daylight.jpg", "/images/engineering-survey.jpg"],
    published: true,
    order: 18,
  },
  {
    id: "p19",
    slug: "fire-rated-polyolefin-cable-channels",
    title: "Fire-rated polyolefin cable channels for signalling cables",
    shortTitle: "Fire-rated cable channels",
    division: "signalling",
    status: "completed",
    client: "Central Railway",
    clientDivision: "Pune Division",
    location: "Pune Division",
    state: "Maharashtra",
    lat: 18.52,
    lng: 73.86,
    summary:
      "Fire-rated polyolefin cable channels protecting signalling cable runs at stations and along the section.",
    overview:
      "A cable fire in a relay room or along a route can take out signalling for days. This work installed fire-rated polyolefin cable channels to protect signalling cable runs, with the fire-rating documentation handed over as part of the package.",
    scope: [
      "Cable route survey and channel sizing",
      "Installation of fire-rated polyolefin channels",
      "Cable laying, dressing and support",
      "Fire-rating documentation and handover",
    ],
    challenges: [
      {
        title: "Routing through built-up station areas",
        body: "Channel routes pass through relay rooms, platforms and cable troughs, each with its own constraints.",
      },
      {
        title: "Protecting working cables",
        body: "Live cables were re-dressed into new channels without interrupting service.",
      },
    ],
    approach: [
      {
        title: "Route by route",
        body: "Each route was surveyed and sized before installation, so channel and cable capacity matched.",
      },
      {
        title: "Documented rating",
        body: "Fire-rating documents for the installed channels were compiled for handover.",
      },
    ],
    equipment: ["Fire-rated polyolefin cable channels", "Cable supports and fixings", "Signalling cable", "Fire-rating documentation"],
    results: [
      "Fire-rated channels installed on Pune Division cable routes",
      "Cables re-dressed and protected",
      "Fire-rating documentation handed over",
    ],
    images: ["/images/signalling-daylight.jpg", "/images/signalling-daylight.jpg", "/images/cctv-daylight.jpg"],
    published: true,
    order: 19,
  },
];

export const projectStats = {
  total: projects.length,
  signalling: projects.filter((p) => p.division === "signalling").length,
  telecom: projects.filter((p) => p.division === "telecom").length,
  completed: projects.filter((p) => p.status === "completed").length,
  ongoing: projects.filter((p) => p.status === "ongoing").length,
};
