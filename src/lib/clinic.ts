import {
  Activity,
  ClipboardList,
  Hand,
  HeartPulse,
  PersonStanding,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/**
 * Central clinic configuration — edit everything about the practice here.
 *
 * VERIFIED (Estonian Business Register, Ravida OÜ, registry code 14551614):
 * the clinic is a registered medical-specialist practice at Ropka tee 6,
 * Tartu, working in rehabilitation / pain reduction / mobility restoration.
 *
 * Everything marked PLACEHOLDER is unverified and must be replaced with
 * real details before the site goes live.
 */

export const CLINIC = {
  name: "RaVida Clinic",
  legalName: "Ravida OÜ",
  registryCode: "14551614",
  tagline: "Rehabilitation & mobility care in Tartu",
  address: {
    street: "Ropka tee 6", // verified via business register
    postalCode: "50104",
    city: "Tartu",
    country: "Estonia",
  },
  // PLACEHOLDER — replace with the verified clinic phone number.
  phoneDisplay: "+372 000 0000",
  phoneHref: "tel:+37200000000",
  // PLACEHOLDER — replace with the verified clinic email address.
  email: "reception@ravida.example",
  // PLACEHOLDER — replace with verified opening hours.
  hours: [
    { days: "Monday – Friday", time: "09:00 – 17:00" },
    { days: "Saturday", time: "10:00 – 14:00" },
    { days: "Sunday", time: "Closed" },
  ],
  hoursNote:
    "Opening hours are currently being updated — please call reception to confirm before your visit.",
  // Map position for Ropka tee 6, Tartu (OpenStreetMap geocode of the address).
  map: {
    embedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=26.7120%2C58.3445%2C26.7520%2C58.3645&layer=mapnik&marker=58.3545045%2C26.7320004",
    linkUrl:
      "https://www.openstreetmap.org/?mlat=58.3545045&mlon=26.7320004#map=17/58.3545045/26.7320004",
  },
};

export interface Service {
  slug: string;
  name: string;
  /** PLACEHOLDER durations — confirm the real appointment lengths. */
  duration: string;
  icon: LucideIcon;
  blurb: string;
  detail: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    duration: "45–60 min",
    icon: Activity,
    blurb: "Movement-based therapy to support recovery from pain, injury, and reduced mobility.",
    detail:
      "Individual physiotherapy sessions built around how you actually move. After an initial assessment, your therapist agrees a plan with you and adjusts it as you progress.",
    bullets: [
      "Initial movement assessment",
      "Individually tailored exercise plans",
      "Progress reviewed at every visit",
    ],
  },
  {
    slug: "rehabilitation-programmes",
    name: "Rehabilitation programmes",
    duration: "Multi-session",
    icon: ClipboardList,
    blurb: "Structured, individual programmes focused on sustainable mobility restoration.",
    detail:
      "A planned course of sessions with clear goals, for people recovering from injury, overuse, or longer-term mobility problems. Programmes combine in-clinic treatment with guidance for daily life.",
    bullets: [
      "Clear goals agreed at the start",
      "Combined in-clinic and home exercises",
      "Regular check-ins on progress",
    ],
  },
  {
    slug: "therapeutic-massage",
    name: "Therapeutic massage",
    duration: "30–60 min",
    icon: Hand,
    blurb: "Targeted soft-tissue treatment to relieve tension and support recovery.",
    detail:
      "Therapeutic massage focused on areas of tension and overload, often used alongside physiotherapy. Your therapist will discuss what is appropriate for you before treatment begins.",
    bullets: [
      "Focused on your problem areas",
      "Works alongside physiotherapy plans",
      "Pressure adapted to your comfort",
    ],
  },
  {
    slug: "pain-consultation",
    name: "Pain consultation",
    duration: "45 min",
    icon: Stethoscope,
    blurb: "A structured assessment of persistent pain and guidance on appropriate next steps.",
    detail:
      "For ongoing or recurring pain, a consultation helps clarify what may be contributing to it and which treatment route is most suitable — whether at our clinic or with another specialist.",
    bullets: [
      "Structured history and assessment",
      "Plain-language explanation of findings",
      "Referral guidance where needed",
    ],
  },
  {
    slug: "post-surgical-recovery",
    name: "Post-surgical recovery",
    duration: "45–60 min",
    icon: HeartPulse,
    blurb: "Guided rehabilitation after orthopaedic surgery, in cooperation with your physician.",
    detail:
      "Rehabilitation that follows your surgeon's protocol and your stage of healing. We help you rebuild strength, range of motion, and confidence step by step.",
    bullets: [
      "Aligned with your surgeon's protocol",
      "Stage-appropriate exercise progression",
      "Focus on safe, steady recovery",
    ],
  },
  {
    slug: "mobility-assessment",
    name: "Mobility & movement assessment",
    duration: "60 min",
    icon: PersonStanding,
    blurb: "A structured review of how you move, forming the basis of your personal plan.",
    detail:
      "A one-off assessment for anyone who wants to understand their movement better — before starting a programme, returning to sport, or simply staying active with confidence.",
    bullets: [
      "Whole-body movement review",
      "Written summary of findings",
      "Practical recommendations",
    ],
  },
];

/**
 * Provider preferences are role-based only — no staff names are listed
 * until the clinic confirms what should be published.
 */
export const PROVIDERS = [
  { id: "first-available", label: "First available specialist" },
  { id: "physiotherapist", label: "Physiotherapist" },
  { id: "massage-therapist", label: "Massage therapist" },
  { id: "rehabilitation-physician", label: "Rehabilitation physician" },
] as const;

/** PLACEHOLDER availability — align with real opening hours once confirmed. */
const WEEKDAY_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];
const SATURDAY_SLOTS = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];

/** Available time slots for a date; past times are removed for today, Sundays closed. */
export function slotsForDate(date: Date): string[] {
  const day = date.getDay();
  if (day === 0) return [];
  const slots = day === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return slots.filter((slot) => slot > current);
  }
  return slots;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "How do I book an appointment?",
    answer:
      "Use the online booking form on this website — it takes under a minute and no account is needed. Choose your service, a preferred time, and leave your contact details. Our reception will then contact you to confirm the exact appointment time.",
  },
  {
    question: "Do I need a referral from a doctor?",
    answer:
      "In most cases you can book directly without a referral. If a referral is required for a specific service or for insurance purposes, our reception will let you know when confirming your booking.",
  },
  {
    question: "What happens at my first visit?",
    answer:
      "Your first visit usually starts with a conversation about your history and goals, followed by an assessment. Together with your specialist you agree on a plan before any treatment begins. Wear comfortable clothing you can move in.",
  },
  {
    question: "How do I cancel or reschedule?",
    answer:
      "Please contact reception by phone or email as early as possible — ideally at least 24 hours before your appointment — and we will find a new time that suits you.",
  },
  {
    question: "What should I bring to my appointment?",
    answer:
      "Bring any referral letters, imaging results, or medical documents related to your concern, along with comfortable clothing. If you are unsure, just bring yourself — we will guide you through the rest.",
  },
  {
    question: "Which insurance or payment options do you accept?",
    answer:
      "Please contact reception for current payment methods and insurance arrangements, as these can change. We will always confirm any costs with you before treatment.",
  },
  {
    question: "Is parking available at the clinic?",
    answer:
      "The clinic is located at Ropka tee 6 in Tartu. Please contact reception for up-to-date information about parking and public transport connections.",
  },
  {
    question: "Is my information kept confidential?",
    answer:
      "Yes. Your personal and health information is handled confidentially and used only to organise and provide your care, in line with applicable data-protection requirements.",
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "Individual treatment plans",
    text: "Every plan is agreed with you after a personal assessment — no one-size-fits-all protocols.",
  },
  {
    title: "Calm, unhurried appointments",
    text: "Appointments are scheduled with enough time to listen, assess, and treat without rushing.",
  },
  {
    title: "Focus on lasting mobility",
    text: "We work toward sustainable mobility and pain reduction you can maintain in daily life.",
  },
  {
    title: "Easy online booking",
    text: "Request an appointment online in under a minute — our reception confirms the details with you.",
  },
];
