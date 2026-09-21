import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";

import { BookingFlow } from "@/components/booking/booking-flow";
import { CLINIC } from "@/lib/clinic";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { category?: string | undefined; service?: string | undefined } => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
    service: typeof search["service"] === "string" ? (search["service"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book an Appointment — RaVida Clinic" },
      {
        name: "description",
        content: "Book an appointment at RaVida Clinic online: choose a category, service, and time that suits you.",
      },
      { property: "og:title", content: "Book an Appointment — RaVida Clinic" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { category, service } = Route.useSearch();
  const { phone, addressLine } = useSiteSettings();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">Book an appointment</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          No account needed — pick a category, a service, and a time that works for you.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <BookingFlow initialCategory={category} initialService={service} />

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {[
                "You pick a service, date, and time that's open.",
                "You submit your name and phone number.",
                "Your appointment is booked instantly — we'll contact you to confirm.",
              ].map((text, index) => (
                <li key={text} className="flex gap-3 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed text-muted-foreground">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Clinic details</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{addressLine}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-primary">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>
                  {CLINIC.hours.map((row) => (
                    <span key={row.days} className="block">
                      {row.days}: {row.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          <p className="flex items-start gap-2.5 rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            Your details are used only to arrange your appointment and are handled confidentially.
          </p>
        </aside>
      </div>
    </section>
  );
}
