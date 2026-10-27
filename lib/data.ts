export const company = {
  name: "Alpha Equipments",
  domain: "alphaequipments.in",
  url: "https://www.alphaequipments.in",
  email: "alphaequipments1980@gmail.com",
  phoneDisplay: "+91 99797 90657",
  phoneTel: "+919979790657",
  city: "Vadodara, Gujarat",
  established: "1980",
};

export type FuelMode = {
  id: string;
  label: string;
  short: string;
  kicker: string;
  description: string;
  costPerCycle: number;
  cycleMins: number;
  carbonSavedKg: number;
  timberSavedKg: number;
  efficiency: string;
  heatUp: string;
  emissions: string;
  power: string;
};

export const fuelModes: FuelMode[] = [
  {
    id: "electric",
    label: "Electric Silent Series",
    short: "Electric",
    kicker: "Clean grid-powered 60kW, zero local emissions",
    description:
      "A 60 kW grid-powered duty for urban halls that need a quiet cycle and no combustion at the site.",
    costPerCycle: 486,
    cycleMins: 75,
    carbonSavedKg: 210,
    timberSavedKg: 400,
    efficiency: "90%",
    heatUp: "Steady electrical heat",
    emissions: "Zero local combustion",
    power: "60 kW",
  },
  {
    id: "cng",
    label: "CNG / PNG Gas Fired",
    short: "CNG / PNG",
    kicker: "Rapid heat-up, automated burner sequencing",
    description:
      "Piped natural gas with automated burner sequencing for plants that already sit on a CNG or PNG line.",
    costPerCycle: 640,
    cycleMins: 65,
    carbonSavedKg: 168,
    timberSavedKg: 400,
    efficiency: "88%",
    heatUp: "Rapid burner sequence",
    emissions: "Secondary combustion and scrubber",
    power: "Piped gas burners",
  },
  {
    id: "lpg",
    label: "LPG Dual-Burner",
    short: "LPG",
    kicker: "High-efficiency remote municipal model",
    description:
      "Dual burners for municipal sites off the gas grid. Primary and secondary chambers fire in sequence.",
    costPerCycle: 760,
    cycleMins: 62,
    carbonSavedKg: 154,
    timberSavedKg: 400,
    efficiency: "87%",
    heatUp: "Dual-burner remote duty",
    emissions: "Secondary combustion and scrubber",
    power: "LPG dual burners",
  },
  {
    id: "bio",
    label: "Bio-Green / Wood Pyre Hybrid",
    short: "Bio-Green",
    kicker: "Traditional cultural compliance with modern closed filtration",
    description:
      "A closed hybrid for rites that keep a wood charge, with filtration in place of an open pyre.",
    costPerCycle: 295,
    cycleMins: 90,
    carbonSavedKg: 96,
    timberSavedKg: 280,
    efficiency: "76%",
    heatUp: "Assisted closed hearth",
    emissions: "Closed filtration and wet scrubber",
    power: "Wood charge, assisted",
  },
];

export const OPEN_PYRE_WOOD_KG = 400;
export const KG_PER_TREE = 250;
export const TREES_PER_ACRE = 400;

export function getFuel(id: string) {
  return fuelModes.find((mode) => mode.id === id) ?? fuelModes[0];
}

export function computeRoi(perMonth: number, rupeesPerKg: number, mode: FuelMode) {
  const annualCremations = perMonth * 12;
  const woodKg = annualCremations * mode.timberSavedKg;
  const residualWoodKg = annualCremations * (OPEN_PYRE_WOOD_KG - mode.timberSavedKg);
  const trees = woodKg / KG_PER_TREE;
  const acres = trees / TREES_PER_ACRE;
  const openPyreCost = annualCremations * OPEN_PYRE_WOOD_KG * rupeesPerKg;
  const residualWoodCost = residualWoodKg * rupeesPerKg;
  const energyCost = annualCremations * mode.costPerCycle;
  const closedCost = energyCost + residualWoodCost;
  const savings = openPyreCost - closedCost;

  return {
    annualCremations,
    woodKg,
    trees,
    acres,
    openPyreCost,
    residualWoodCost,
    energyCost,
    closedCost,
    savings,
  };
}

export type Milestone = {
  id: string;
  badge: string;
  tone: "heat" | "sacred" | "dual";
  title: string;
  subtitle: string;
  chips: string[];
  readout: string;
  readoutLabel: string;
};

export const milestones: Milestone[] = [
  {
    id: "thermal",
    badge: "01 / Thermal Engineering",
    tone: "heat",
    title: "Precision Heat Containment at 1400°C.",
    subtitle: "High-alumina IS-8 refractory construction engineered for continuous duty.",
    chips: [],
    readout: "1,400°C",
    readoutLabel: "Design temperature",
  },
  {
    id: "ecology",
    badge: "02 / Ecological Responsibility",
    tone: "sacred",
    title: "100% Smokeless. Odorless. Compliant.",
    subtitle:
      "Volatile gases finish in a secondary chamber, then a wet venturi scrubber, before the stack.",
    chips: ["Secondary Gas Combustion", "Wet Venturi Scrubber", "CPCB Emission Compliant"],
    readout: "PM < 50",
    readoutLabel: "mg/Nm³ design target",
  },
  {
    id: "automation",
    badge: "03 / Automation & Dignity",
    tone: "dual",
    title: "Silent Hydraulic Trolley & Smart PLC Touchscreen.",
    subtitle: "A hermetic door, a quiet trolley, and a touchscreen cycle the operator can read at a glance.",
    chips: [
      "Dual-Fuel: Electric / Gas (CNG/PNG/LPG)",
      "Cycle Time: 60-90 Mins",
      "90% Energy Efficiency",
    ],
    readout: "60–90 min",
    readoutLabel: "Cycle window",
  },
  {
    id: "rfq",
    badge: "04 / Project Dock",
    tone: "heat",
    title: "Commission a turnkey crematorium.",
    subtitle: "Municipal corporations, smart-city EPCs, and crematorium trusts.",
    chips: [],
    readout: "RFQ",
    readoutLabel: "Turnkey desk",
  },
];

export const heroChapters = [
  { id: "thermal", index: "01", label: "Thermal", at: 0 },
  { id: "ecology", index: "02", label: "Ecology", at: 0.4 },
  { id: "automation", index: "03", label: "Automation", at: 0.72 },
  { id: "rfq", index: "04", label: "RFQ", at: 0.93 },
];

export function milestoneFromProgress(progress: number) {
  if (progress < 0.25) return 0;
  if (progress < 0.6) return 1;
  if (progress < 0.85) return 2;
  return 3;
}

export type Hotspot = {
  id: string;
  index: string;
  title: string;
  pin: string;
  x: number;
  y: number;
  tone: "heat" | "sacred";
  summary: string;
  points: string[];
  image: string;
  imageAlt: string;
};

export const hotspots: Hotspot[] = [
  {
    id: "primary",
    index: "01",
    title: "Primary Chamber",
    pin: "Alumina refractory",
    x: 33,
    y: 50,
    tone: "heat",
    summary:
      "Alumina refractory fire bricks hold the main chamber. The lining is specified for 1400°C thermal shock and continuous municipal duty.",
    points: [
      "High-alumina IS-8 refractory construction",
      "Withstands 1400°C thermal shock",
      "Closed shell keeps the duty heat in the chamber",
    ],
    image: "/images/furnace-cutaway.png",
    imageAlt: "Cutaway of the primary refractory chamber with yellow heat inside alumina firebrick",
  },
  {
    id: "secondary",
    index: "02",
    title: "Secondary Re-Combustion Chamber",
    pin: "Gas re-combustion",
    x: 57,
    y: 40,
    tone: "sacred",
    summary:
      "Unburnt hydrocarbons are given a second chamber so the gas path can finish burning. The plant is built toward clean white exhaust, without visible smoke or odor.",
    points: [
      "Destroys unburnt hydrocarbons",
      "Residence path after the primary chamber",
      "Clean white exhaust as the design target",
    ],
    image: "/images/furnace-cutaway.png",
    imageAlt: "Cutaway showing the secondary combustion zone and purple gas-path ducting",
  },
  {
    id: "plc",
    index: "03",
    title: "PLC Control Automation",
    pin: "PLC touchscreen",
    x: 46,
    y: 80,
    tone: "heat",
    summary:
      "The touchscreen profiles chamber temperature, keeps an emergency stop in reach, and modulates the oxygen sensor so each cycle stays repeatable.",
    points: [
      "Touchscreen temperature profiling",
      "Emergency stop on the operator panel",
      "Oxygen sensor modulation",
      "Hydraulic trolley and hermetic door interlock",
    ],
    image: "/images/machine-exterior.png",
    imageAlt: "Matte black Alpha Equipments furnace with the PLC touchscreen and hydraulic loading door",
  },
  {
    id: "scrubber",
    index: "04",
    title: "Wet Scrubber & ID Fan",
    pin: "Wet scrubber",
    x: 74,
    y: 26,
    tone: "sacred",
    summary:
      "A stainless steel wet scrubber and mist eliminator take particulate out of the stream before the induced-draft fan and stack. Design target: PM below 50 mg/Nm³.",
    points: [
      "Stainless steel, corrosion-resistant shell",
      "Mist eliminator on the wet path",
      "Induced-draft fan and stack connection",
      "Particulate design target PM < 50 mg/Nm³",
    ],
    image: "/images/wet-scrubber.png",
    imageAlt: "Stainless steel wet scrubber train with purple-lit piping, control panel, and exhaust stack",
  },
];

export const turnkeyScopes = [
  {
    id: "civil",
    title: "Civil & Shed Design",
    copy: "Foundation, bay, and operator circulation so the hydraulic door and trolley sit on axis inside the hall.",
  },
  {
    id: "stack",
    title: "Exhaust Chimney Fabrication",
    copy: "30 m MS fabricated stack, flanges, and a draft path matched to the induced-draft fan.",
  },
  {
    id: "ash",
    title: "Ash Handling & Pulverizer",
    copy: "A closed ash route and pulverizer machine so remains are collected without a second open handling step.",
  },
  {
    id: "apcs",
    title: "Air Pollution Control Systems",
    copy: "Wet scrubber, mist eliminator, ducting, and ID fan supplied as one APCS package for the emission path.",
  },
];

export const trustBadges = [
  "Municipal Corporations",
  "Crematorium Trusts",
  "NGOs",
  "Smart City EPCs",
  "Institutional Boards",
];

export const inquiryRoles = [
  "Municipal Commissioner",
  "Smart City EPC Contractor",
  "Crematorium Trust",
  "NGO / Institutional Board",
  "Other",
];

export const navItems = [
  { href: "#engineering", label: "Engineering" },
  { href: "#configurator", label: "Configurator" },
  { href: "#chambers", label: "Chambers" },
  { href: "#savings", label: "Savings" },
  { href: "#projects", label: "Projects" },
];

export const marqueeFacts = [
  "1400°C refractory",
  "IS-8 high alumina",
  "Secondary gas combustion",
  "Wet venturi scrubber",
  "CPCB emission compliant",
  "60–90 min cycle",
  "90% energy efficiency",
  "Electric / CNG / PNG / LPG",
  "Bio-green hybrid",
  "30 m MS stack",
  "Hydraulic trolley",
  "PLC touchscreen",
];

export type InquiryDraft = {
  role: string;
  organization: string;
  city: string;
  name: string;
  phone: string;
  email: string;
  load: string;
  fuelId: string;
  notes: string;
  origin: string;
};

export const emptyDraft: InquiryDraft = {
  role: "Municipal Commissioner",
  organization: "",
  city: "",
  name: "",
  phone: "",
  email: "",
  load: "",
  fuelId: "electric",
  notes: "",
  origin: "Turnkey desk",
};
