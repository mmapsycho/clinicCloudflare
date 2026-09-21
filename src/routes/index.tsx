import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import aboutImage from "../assets/about-therapy.jpg";
import heroImage from "../assets/hero-clinic.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CLINIC, FAQS, WHY_CHOOSE_US } from "@/lib/clinic";
import { useSiteSettings } from "@/lib/site-settings";
import { useAllServices, useCategories } from "@/lib/booking";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RaVida Clinic — Rehabilitation & Physiotherapy in Tartu" },
      {
        name: "description",
        content:
          "Calm, professional rehabilitation and physiotherapy care at Ropka tee 6, Tartu. Request your appointment online in under a minute.",
      },
      { property: "og:title", content: "RaVida Clinic — Rehabilitation & Physiotherapy in Tartu" },
      {
        property: "og:description",
        content:
          "Calm, professional rehabilitation and physiotherapy care at Ropka tee 6, Tartu. Request your appointment online in under a minute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { clinicName, tagline, heroBackgroundUrl, homeSecondaryImageUrl } = useSiteSettings();
  const categories = useCategories();
  const allServices = useAllServices();
  const featuredServices = allServices.filter((s) => s.active !== false).slice(0, 6);
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              {tagline}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              Move better, <span className="text-primary">live fully.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {clinicName} provides calm, professional rehabilitation and physiotherapy care —
              focused on pain reduction and sustainable mobility, at your pace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link to="/book">
                  <CalendarCheck className="h-5 w-5" aria-hidden />
                  Book an appointment
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                <Link to="/services">
                  Explore our services
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Registered Estonian clinic", "Individual treatment plans", "No account needed"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative">
            <img
              src={heroBackgroundUrl || heroImage}
              alt="A calm, bright treatment room at RaVida Clinic with a therapy table and natural light"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg ring-1 ring-border"
            />
            <div className="mt-4 flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm lg:absolute lg:-bottom-8 lg:left-8 lg:mt-0 lg:max-w-xs">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                <Clock className="h-5 w-5 text-primary" aria-hidden />
              </span>
              <p className="text-sm font-medium leading-snug">
                Request an appointment online in under a minute — we confirm by phone or email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <h2 className="text-3xl font-semibold sm:text-4xl">Care built around you</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                From first assessment to full rehabilitation programmes — every service starts with
                listening.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden shrink-0 sm:inline-flex">
              <Link to="/services">
                All services
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                to="/book"
                search={{ category: service.category, service: service.id }}
                className="group rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Stethoscope className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description || categories.find((c) => c.id === service.category)?.label || ""}
                </p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Learn more
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </p>
              </Link>
            ))}
            {featuredServices.length === 0 && (
              <p className="text-sm text-muted-foreground">Services coming soon.</p>
            )}
          </div>

          <div className="mt-8 sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link to="/services">All services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <img
              src={homeSecondaryImageUrl || aboutImage}
              alt="A physiotherapist gently guiding a patient through a mobility exercise"
              width={1280}
              height={960}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md ring-1 ring-border"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-semibold sm:text-4xl">Why patients choose {clinicName}</h2>
            <p className="mt-3 text-muted-foreground">
              Rehabilitation works best when it fits your life. Here's how we make that happen.
            </p>
            <ul className="mt-8 space-y-5">
              {WHY_CHOOSE_US.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
                    <Check className="h-4 w-4 text-primary" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link to="/about">
                More about the clinic
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How booking works */}
      <section className="border-y bg-accent/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">Booking takes three simple steps</h2>
            <p className="mt-3 text-muted-foreground">
              No accounts, no waiting on hold — just tell us what you need.
            </p>
          </div>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Tell us what you need",
                text: "Choose a service and share your contact details and anything we should know.",
              },
              {
                title: "Pick a time that suits you",
                text: "Select a preferred date and time from the available slots.",
              },
              {
                title: "We confirm with you",
                text: "Reception contacts you to confirm the exact time — then you're all set.",
              },
            ].map((stepItem, index) => (
              <li key={stepItem.title} className="relative rounded-2xl border bg-card p-6 text-center shadow-sm">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{stepItem.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stepItem.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/book">
                <CalendarCheck className="h-5 w-5" aria-hidden />
                Book an appointment
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Visit us in Tartu</h2>
          <p className="mt-3 text-muted-foreground">
            Find the clinic, check opening hours, or get in touch — whatever works for you.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
              <Clock className="h-5 w-5 text-primary" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-semibold">Opening hours</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {CLINIC.hours.map((row) => (
                <li key={row.days} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{row.days}</span>
                  <span className="font-medium">{row.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{CLINIC.hoursNote}</p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
              <Phone className="h-5 w-5 text-primary" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={CLINIC.phoneHref} className="font-medium text-primary hover:underline">
                  {CLINIC.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CLINIC.email}`} className="text-muted-foreground hover:text-primary">
                  {CLINIC.email}
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              For cancellations or changes, please contact reception as early as possible.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
              <MapPin className="h-5 w-5 text-primary" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-semibold">Location</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {CLINIC.address.street}
              <br />
              {CLINIC.address.postalCode} {CLINIC.address.city}, {CLINIC.address.country}
            </p>
            <a
              href={CLINIC.map.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Get directions
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">Common questions</h2>
            <p className="mt-3 text-muted-foreground">
              Everything patients usually ask before their first visit.
            </p>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.slice(0, 4).map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link to="/faq">
                View all questions
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <ShieldCheck className="mx-auto h-10 w-10 opacity-90" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Ready to take the first step?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Request your appointment online now — reception will confirm the details with you
            personally.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
            <Link to="/book">
              <CalendarCheck className="h-5 w-5" aria-hidden />
              Book an appointment
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
