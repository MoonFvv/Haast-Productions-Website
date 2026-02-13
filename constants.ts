
import { Instagram, Linkedin, Music, ArrowUpRight, Play, Film, Monitor, Zap, Camera, Aperture, Disc, Cpu } from 'lucide-react';

export const ASSETS = {
  LOGO_TEXT: "HAAST",
};

export const NAV_LINKS = [
  { name: 'Work', href: '#work' },
  { name: 'Gear', href: '/gear' },
  { name: 'Team', href: '/team' },
  { name: 'Auditie', href: '/audition' },
];

export const GEAR_CATEGORIES = [
  {
    category: "Camera Systems",
    icon: Camera,
    items: [
      { name: "RED Scarlet-W 5K", description: "Dragon sensor, 5K RAW recording up to 60fps." },
      { name: "BlackMagic Pocket 4k 2x", description: "Dual Native ISO, 4K DCI, MFT Mount system." },
      { name: "BlackMagic Micro 4K", description: "Compact form factor with global shutter for rigging." },
    ]
  },
  {
    category: "Optics",
    icon: Aperture,
    items: [
      { name: "Sigma Art 18-35mm F1.8", description: "Fast zoom, consistent aperture, sharp corner-to-corner." },
      { name: "Laowa 7.5mm F2", description: "Zero distortion, ultra-wide rectilinear lens." },
      { name: "Vivitar 28mm F2.5", description: "Vintage character, manual focus, smooth bokeh." },
      { name: "Helios 44m4 F2", description: "Swirly bokeh character, classic Soviet glass." },
      { name: "Helios 44m2 F2", description: "Iconic flare, soft contrast, artistic look." }
    ]
  },
  {
    category: "Support & Movement",
    icon: Disc,
    items: [
      { name: "DJI Inspire 3 (8K)", description: "Cinema-grade aerial platform with X9-8K Air Gimbal." },
      { name: "DJI Mavic 3 Cine", description: "Apple ProRes 422 HQ recording in a compact foldable drone." },
      { name: "DJI RS 4 Pro Stabilizer", description: "Heavy payload gimbal with automated axis locks & LiDAR." },
      { name: "VariZoom Black Hawk", description: "Professional Steadicam system for heavy cinema rigs." },
      { name: "Cinelifter with BMPCC 4k", description: "Heavy lift FPV drone for dynamic high-speed chases." },
      { name: "CineWhoop DJI o4 Unit", description: "Indoor safe, stabilized HD transmission system." },
      { name: "DJI Mavic 4 Pro", description: "Omni-sensing, 4K/120fps, long range capability." },
    ]
  },
  {
    category: "Post-Production",
    icon: Cpu,
    items: [
      { name: "DaVinci Resolve Advanced", description: "Precise color grading control surface & software." },
      { name: "Adobe Premiere Pro", description: "Industry standard NLE workflow for offline editing." },
      { name: "Adobe After Effects", description: "Advanced composition, motion graphics, and VFX." },
    ]
  }
];

export const TEAM = [
  {
    id: 1,
    name: "Mels de Veer",
    role: "Director",
    image: "",
  },
  {
    id: 2,
    name: "Loek de Clonie Mclennan",
    role: "Writer",
    image: "/loek.jpeg",
  },
  {
    id: 3,
    name: "Alec Jungerius",
    role: "DOP",
    image: "/alec.webp",
  },
  {
    id: 4,
    name: "Floris Vroegh",
    role: "Lead Editor",
    image: "/floris.webp",
  },
  {
    id: 5,
    name: "Anlaw Zondag",
    role: "Sound Designer",
    image: "",
  },
  {
    id: 7,
    name: "Robin Senhorst",
    image: "/robin.webp",
  },
  {
    id: 8,
    name: "Seppe Zwaan",
    image: "",
  }
];

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Kerst Commercial",
    image: "/kerstcommercial.webp",
    description: "Een Kerst commercial",
    tags: ["Kerst", "Cinematic"],
    year: "2023",
    category: "Commercial"
  },
  {
    id: 2,
    title: "The Lost Soldier",
    image: "/kerstcommercial.webp",
    description: "An avant-garde exploration of texture and light for Paris Fashion Week.",
    tags: ["Short Movie", "Experimental"],
    year: "2024",
    category: "Short Film"
  }
];
