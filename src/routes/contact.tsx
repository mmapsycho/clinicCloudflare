import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Clock, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CLINIC } from "@/lib/clinic";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Opening Hours — RaVida Clinic, Tartu" },
      {
        name: "description",
        content:
          "Find RaVida Clinic at Ropka tee 6, Tartu. Opening hours, contact details, and directions — or request your appointment online.",
      },
      { property: "og:title", content: "Contact & Opening Hours — RaVida Clinic, Tartu" },
      {
        property: "og:description",
        content:
          "Find RaVida Clinic at Ropka tee 6, Tartu. Opening hours, contact details, and directions — or request your appointment online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { clinicName, phone, email, addressLine } = useSiteSettings();
  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Contact & opening hours
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Reach us by phone or email, visit us in Tartu — or request your appointment online at
            any time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                  <Phone className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-semibold">Phone</h2>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="mt-2 block font-medium text-primary hover:underline"
                >
                  {phone}
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  For bookings, changes, and cancellations.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                  <Mail className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-semibold">Email</h2>
                <a
                  href={`mailto:${email}`}
                  className="mt-2 block break-all font-medium text-primary hover:underline"
                >
                  {email}
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  We aim to reply within one working day.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                <Clock className="h-5 w-5 text-primary" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Opening hours</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {CLINIC.hours.map((row) => (
                  <li key={row.days} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{row.days}</span>
                    <span className="font-medium">{row.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                {CLINIC.hoursNote}
              </p>
            </div>

            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold">Prefer to book online?</h2>
              <p className="mt-2 text-sm text-primary-foreground/85">
                Request an appointment in under a minute — reception confirms the details with you.
              </p>
              <Button asChild variant="secondary" size="lg" className="mt-5">
                <Link to="/book">
                  <CalendarCheck className="h-5 w-5" aria-hidden />
                  Book an appointment
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-3xl border shadow-sm">
              <iframe
                title={`Map showing the location of ${clinicName}, ${CLINIC.address.street}, ${CLINIC.address.city}`}
                src={CLINIC.map.embedUrl}
                className="h-72 w-full sm:h-96 lg:h-[420px]"
                loading="lazy"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex min-w-0 items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <h2 className="font-semibold">{clinicName}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{addressLine}</p>
                </div>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <a href={CLINIC.map.linkUrl} target="_blank" rel="noreferrer">
                  Get directions
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
