import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, isBrowser } from "./firebase";

/* ============================================================
   Types — match the same Firestore shape used by booking.html
   ============================================================ */
export interface BkCategory {
  id: string;
  label: string;
}
export interface BkService {
  id: string;
  name: string;
  category: string;
  durations: number[]; // 0 means "No time"
  durationPrices?: Record<string, string>;
  price?: string;
  description?: string;
  active?: boolean;
}
export interface BkHours {
  open: string;
  close: string;
  slotMinutes: number;
  closed: boolean;
}
export interface BkPhoto {
  id: string;
  url: string;
  caption?: string;
}
export interface BkBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  durationMinutes: number;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  notes?: string;
}
export interface BkSettings {
  clinicName?: string;
  tagline?: string;
  logoUrl?: string;
  heroBackgroundUrl?: string;
  homeSecondaryImageUrl?: string;
  aboutImageUrl?: string;
  phone?: string;
  email?: string;
  addressLine?: string;
  whatsappNumber?: string;
  whatsappApiKey?: string;
}

const WEEKDAY_KEYS = ["0", "1", "2", "3", "4", "5", "6"];
export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function fmtDuration(d: number): string {
  return d === 0 ? "No time" : `${d} min`;
}
export function fmtDurationWithPrice(svc: BkService, d: number): string {
  const perPrice = svc.durationPrices?.[String(d)];
  const price = perPrice || svc.price;
  return price ? `${fmtDuration(d)} (${price})` : fmtDuration(d);
}
export function todayStr(): string {
  return new Date().toLocaleDateString("en-CA");
}
export function to12h(t: string): string {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr ?? 0);
  const m = Number(mStr ?? 0);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}
export function fmtDateHuman(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}
function timeToMinutes(t: string): number {
  const [h, m] = t.split(":");
  return Number(h ?? 0) * 60 + Number(m ?? 0);
}
function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* ============================================================
   Realtime hooks (public + admin both use these)
   ============================================================ */
export function useCategories(): BkCategory[] {
  const [items, setItems] = useState<BkCategory[]>([]);
  useEffect(() => {
    if (!isBrowser) return;
    return onSnapshot(collection(db, "bkCategories"), (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, label: (d.data()["label"] as string) || d.id }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setItems(list);
    });
  }, []);
  return items;
}

export function useAllServices(): BkService[] {
  const [items, setItems] = useState<BkService[]>([]);
  useEffect(() => {
    if (!isBrowser) return;
    return onSnapshot(collection(db, "bkServices"), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BkService, "id">) })));
    });
  }, []);
  return items;
}

export function usePhotos(): BkPhoto[] {
  const [items, setItems] = useState<BkPhoto[]>([]);
  useEffect(() => {
    if (!isBrowser) return;
    return onSnapshot(collection(db, "bkPhotos"), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BkPhoto, "id">) })));
    });
  }, []);
  return items;
}

export function useSettings(): BkSettings {
  const [settings, setSettings] = useState<BkSettings>({});
  useEffect(() => {
    if (!isBrowser) return;
    return onSnapshot(doc(db, "bkSettings", "main"), (snap) => {
      setSettings(snap.exists() ? (snap.data() as BkSettings) : {});
    });
  }, []);
  return settings;
}

export function useAllHours(): Record<string, BkHours> {
  const [hours, setHours] = useState<Record<string, BkHours>>({});
  useEffect(() => {
    if (!isBrowser) return;
    return onSnapshot(collection(db, "bkHours"), (snap) => {
      const map: Record<string, BkHours> = {};
      snap.docs.forEach((d) => {
        map[d.id] = d.data() as BkHours;
      });
      setHours(map);
    });
  }, []);
  return hours;
}

export function useBlockedDates(): string[] {
  const [dates, setDates] = useState<string[]>([]);
  useEffect(() => {
    if (!isBrowser) return;
    return onSnapshot(collection(db, "bkBlockedDates"), (snap) => {
      setDates(snap.docs.map((d) => d.id).sort());
    });
  }, []);
  return dates;
}

export function useBookingsForDate(dateStr: string): BkBooking[] {
  const [rows, setRows] = useState<BkBooking[]>([]);
  useEffect(() => {
    if (!isBrowser || !dateStr) return;
    const q = query(collection(db, "bkBookings"), where("date", "==", dateStr));
    return onSnapshot(q, (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<BkBooking, "id">) }))
        .sort((a, b) => a.time.localeCompare(b.time));
      setRows(list);
    });
  }, [dateStr]);
  return rows;
}

/* ============================================================
   Availability calculation — category-isolated, same rule as
   booking.html: a booking in one category never blocks another.
   ============================================================ */
export async function computeAvailableSlots(
  dateStr: string,
  durationMinutes: number,
  categoryKey: string,
): Promise<{ closed: true; reason: string } | { closed: false; slots: string[] }> {
  const dow = new Date(dateStr + "T00:00:00").getDay();
  const [hoursSnap, blockedSnap] = await Promise.all([
    getDoc(doc(db, "bkHours", String(dow))),
    getDoc(doc(db, "bkBlockedDates", dateStr)),
  ]);
  if (blockedSnap.exists()) return { closed: true, reason: "The clinic is closed on this date." };
  if (!hoursSnap.exists() || (hoursSnap.data() as BkHours).closed) {
    return { closed: true, reason: "The clinic is closed this day of the week." };
  }
  const { open, close, slotMinutes } = hoursSnap.data() as BkHours;
  const step = slotMinutes || 30;
  const openM = timeToMinutes(open);
  const closeM = timeToMinutes(close);
  let slots: string[] = [];
  for (let t = openM; t + (durationMinutes || step) <= closeM; t += step) {
    slots.push(minutesToTime(t));
  }
  if (dateStr === todayStr()) {
    const now = new Date();
    const nowM = now.getHours() * 60 + now.getMinutes();
    slots = slots.filter((s) => timeToMinutes(s) > nowM + 15);
  }
  const bookedQ = query(
    collection(db, "bkBookings"),
    where("date", "==", dateStr),
    where("category", "==", categoryKey),
  );
  const bookedSnap = await getDocs(bookedQ);
  const bookedTimes = new Set(bookedSnap.docs.map((d) => (d.data() as BkBooking).time));
  slots = slots.filter((s) => !bookedTimes.has(s));
  return { closed: false, slots };
}

export interface NewBookingInput {
  serviceId: string;
  serviceName: string;
  category: string;
  durationMinutes: number;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  notes: string;
}

/** Re-checks the slot is still free, creates the booking, then (best-effort) fires a WhatsApp alert. */
export async function createBooking(
  input: NewBookingInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const clashQ = query(
    collection(db, "bkBookings"),
    where("date", "==", input.date),
    where("category", "==", input.category),
    where("time", "==", input.time),
  );
  const clash = await getDocs(clashQ);
  if (!clash.empty) {
    return { ok: false, error: "Sorry, that time was just taken. Please pick another." };
  }
  await addDoc(collection(db, "bkBookings"), { ...input, createdAt: serverTimestamp() });
  void notifyWhatsApp(input);
  return { ok: true };
}

async function notifyWhatsApp(input: NewBookingInput) {
  try {
    const snap = await getDoc(doc(db, "bkSettings", "main"));
    const settings = snap.exists() ? (snap.data() as BkSettings) : {};
    if (!settings.whatsappNumber || !settings.whatsappApiKey) return;
    const text = `New booking: ${input.patientName} — ${input.serviceName} — ${fmtDateHuman(input.date)} at ${to12h(
      input.time,
    )} — ${input.patientPhone}`;
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      settings.whatsappNumber,
    )}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(settings.whatsappApiKey)}`;
    await fetch(url, { mode: "no-cors" });
  } catch {
    // Notification is best-effort — never block a booking on this failing.
  }
}

/* ============================================================
   Admin CRUD — all gated behind the admin check in routes/admin.tsx
   ============================================================ */
export async function addCategory(label: string) {
  await addDoc(collection(db, "bkCategories"), { label });
}
export async function removeCategory(id: string) {
  await deleteDoc(doc(db, "bkCategories", id));
}

export async function addService(data: Omit<BkService, "id">) {
  await addDoc(collection(db, "bkServices"), data);
}
export async function updateService(id: string, fields: Partial<BkService>) {
  await updateDoc(doc(db, "bkServices", id), fields);
}
export async function deleteService(id: string) {
  await deleteDoc(doc(db, "bkServices", id));
}

export async function saveHours(dow: string, hours: BkHours) {
  await setDoc(doc(db, "bkHours", dow), hours);
}
export async function addBlockedDate(dateStr: string) {
  await setDoc(doc(db, "bkBlockedDates", dateStr), { date: dateStr });
}
export async function removeBlockedDate(dateStr: string) {
  await deleteDoc(doc(db, "bkBlockedDates", dateStr));
}

export async function addPhoto(url: string, caption: string) {
  await addDoc(collection(db, "bkPhotos"), { url, caption });
}
export async function removePhoto(id: string) {
  await deleteDoc(doc(db, "bkPhotos", id));
}

export async function saveSettings(fields: BkSettings) {
  await setDoc(doc(db, "bkSettings", "main"), fields, { merge: true });
}

export async function cancelBooking(id: string) {
  await deleteDoc(doc(db, "bkBookings", id));
}

/** One-time helper if a brand-new project ever needs the 5 default categories seeded. */
export async function seedDefaultCategoriesIfEmpty() {
  const snap = await getDocs(collection(db, "bkCategories"));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  const defaults = [
    { key: "aesthetic", label: "Aesthetic & Beauty" },
    { key: "medical", label: "Medical Therapy" },
    { key: "physio", label: "Physiotherapy" },
    { key: "wellness", label: "Wellness & IV" },
    { key: "float", label: "Float" },
  ];
  defaults.forEach((c) => batch.set(doc(db, "bkCategories", c.key), { label: c.label }));
  await batch.commit();
}

export { WEEKDAY_KEYS };
