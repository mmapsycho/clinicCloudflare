import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, Check, CircleCheck, Clock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  computeAvailableSlots,
  createBooking,
  fmtDateHuman,
  fmtDurationWithPrice,
  to12h,
  useAllServices,
  useCategories,
  type BkService,
} from "@/lib/booking";

const STEPS = [
  { id: 1, label: "Category & service" },
  { id: 2, label: "Date & time" },
  { id: 3, label: "Your details" },
] as const;

export function BookingFlow({
  initialCategory,
  initialService,
}: {
  initialCategory?: string | undefined;
  initialService?: string | undefined;
}) {
  const categories = useCategories();
  const services = useAllServices();

  const [step, setStep] = useState(1);
  const [categoryKey, setCategoryKey] = useState<string | undefined>(initialCategory);
  const [serviceId, setServiceId] = useState<string | undefined>(initialService);
  const [duration, setDuration] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsClosedReason, setSlotsClosedReason] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ service: BkService; date: string; time: string } | null>(null);

  const activeServices = useMemo(
    () => services.filter((s) => s.category === categoryKey && s.active !== false),
    [services, categoryKey],
  );
  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);
  const dateStr = date ? date.toLocaleDateString("en-CA") : "";

  useEffect(() => {
    if (categories.length && !categoryKey) setCategoryKey(categories[0]?.id);
  }, [categories, categoryKey]);

  useEffect(() => {
    setDuration(null);
    setTime(null);
  }, [serviceId]);

  useEffect(() => {
    setTime(null);
    if (!dateStr || !categoryKey || duration === null) {
      setSlots(null);
      setSlotsClosedReason(null);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setSlots(null);
    setSlotsClosedReason(null);
    computeAvailableSlots(dateStr, duration, categoryKey)
      .then((result) => {
        if (cancelled) return;
        if (result.closed) {
          setSlotsClosedReason(result.reason);
          setSlots([]);
        } else {
          setSlots(result.slots);
        }
      })
      .catch(() => {
        if (!cancelled) setSlotsClosedReason("Couldn't check availability — please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dateStr, duration, categoryKey]);

  async function handleSubmit() {
    if (!selectedService || duration === null || !dateStr || !time || !name.trim() || !phone.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await createBooking({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      durationMinutes: duration,
      date: dateStr,
      time,
      patientName: name.trim(),
      patientPhone: phone.trim(),
      notes: notes.trim(),
    });
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setConfirmed({ service: selectedService, date: dateStr, time });
  }

  if (confirmed) {
    return (
      <div className="rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12">
        <CircleCheck className="mx-auto h-14 w-14 text-primary" aria-hidden />
        <h2 className="mt-5 text-2xl font-semibold">Booking confirmed</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          {name}, your {confirmed.service.name} appointment is booked for{" "}
          <strong className="text-foreground">{fmtDateHuman(confirmed.date)}</strong> at{" "}
          <strong className="text-foreground">{to12h(confirmed.time)}</strong>. We'll contact you at {phone} to
          confirm.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setConfirmed(null);
            setStep(1);
            setServiceId(undefined);
            setDuration(null);
            setTime(null);
            setName("");
            setPhone("");
            setNotes("");
          }}
        >
          Book another appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <ol className="flex flex-wrap gap-2">
        {STEPS.map((s) => (
          <li
            key={s.id}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              step === s.id
                ? "border-primary bg-primary text-primary-foreground"
                : step > s.id
                  ? "border-primary/40 bg-secondary text-foreground"
                  : "border-border bg-muted text-muted-foreground",
            )}
          >
            {s.id}. {s.label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="mt-6 space-y-6">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Category
            </Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategoryKey(c.id);
                    setServiceId(undefined);
                  }}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    categoryKey === c.id
                      ? "border-primary bg-secondary text-foreground"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {c.label}
                </button>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">Categories coming soon.</p>
              )}
            </div>
          </div>

          {categoryKey && (
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Service
              </Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {activeServices.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceId(s.id)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left transition-colors",
                      serviceId === s.id
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <p className="text-sm font-semibold">{s.name}</p>
                    {s.description && (
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{s.description}</p>
                    )}
                  </button>
                ))}
                {activeServices.length === 0 && (
                  <p className="text-sm text-muted-foreground">No services listed here yet.</p>
                )}
              </div>
            </div>
          )}

          {selectedService && (
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Duration
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(selectedService.durations?.length ? selectedService.durations : [30, 60, 90]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      duration === d
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {fmtDurationWithPrice(selectedService, d)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button disabled={!selectedService || duration === null} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && selectedService && duration !== null && (
        <div className="mt-6 space-y-6">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mt-2 w-full justify-start font-normal sm:w-64">
                  <CalendarIcon className="h-4 w-4 text-primary" aria-hidden />
                  {date ? date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Available times
            </Label>
            <div className="mt-2">
              {loadingSlots && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Checking availability…
                </p>
              )}
              {!loadingSlots && slotsClosedReason && (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  {slotsClosedReason}
                </p>
              )}
              {!loadingSlots && !slotsClosedReason && slots && slots.length === 0 && (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No times left for this date — try another day.
                </p>
              )}
              {!loadingSlots && slots && slots.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTime(s)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                        time === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      {to12h(s)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button disabled={!time} onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && selectedService && duration !== null && time && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl bg-secondary/60 p-4 text-sm">
            <p className="font-semibold">{selectedService.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {fmtDurationWithPrice(selectedService, duration)} · {fmtDateHuman(dateStr)} at {to12h(time)}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="bk-name">Full name</Label>
              <Input id="bk-name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bk-phone">Phone number</Label>
              <Input id="bk-phone" type="tel" className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="bk-notes">Notes (optional)</Label>
            <Textarea id="bk-notes" rows={3} className="mt-1.5" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {submitError && <p className="text-sm text-destructive">{submitError}</p>}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button disabled={!name.trim() || !phone.trim() || submitting} onClick={handleSubmit}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Booking…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" aria-hidden /> Confirm booking
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
