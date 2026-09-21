import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Ear, HeartHandshake, MapPin, Target } from "lucide-react";

import aboutImage from "../assets/about-therapy.jpg";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/lib/clinic";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RaVida Clinic — Rehabilitation Care in Tartu" },
      {
        name: "description",
        content:
          "Learn about RaVida Clinic's approach to rehabilitation: individual treatment plans, unhurried appointments, and a focus on lasting mobility in Tartu.",
      },
      { property: "og:title", content: "About RaVida Clinic — Rehabilitation Care in Tartu" },
      {
        property: "og:description",
        content:
          "Learn about RaVida Clinic's approach to rehabilitation: individual treatment plans, unhurried appointments, and a focus on lasting mobility in Tartu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Ear,
    title: "We listen first",
    text: "Good rehabilitation starts with understanding your history, your daily life, and what you want to get back to.",
  },
  {
    icon: Target,
    title: "Goals you can feel",
    text: "We agree on concrete, meaningful goals — walking without pain, working comfortably, returning to sport — and review them together.",
  },
  {
    icon: HeartHandshake,
    title: "Unhurried, personal care",
    text: "Appointments leave room for questions and careful treatment. You see a specialist, not a stopwatch.",
  },
] as const;

function AboutPage() {
  const { aboutImageUrl } = useSiteSettings();
  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Rehabilitation that respects your pace
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {CLINIC.name} is a rehabilitation clinic in Tartu focused on pain reduction and
            sustainable mobility restoration — helping you move with confidence again.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Our approach</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Recovery is rarely a straight line. That's why every treatment plan at{" "}
                {CLINIC.name} is individual — built after a careful assessment, and adjusted as you
                progress.
              </p>
              <p>
                We combine hands-on treatment with practical guidance for everyday life, so the
                progress you make in the clinic holds up at home, at work, and wherever you move.
              </p>
              <p>
                And because rehabilitation often involves more than one specialist, we work in
                cooperation with your physician whenever your situation calls for it.
              </p>
            </div>
            <Button asChild size="lg" className="mt-8">
              <Link to="/book">
                <CalendarCheck className="h-5 w-5" aria-hidden />
                Book a first appointment
              </Link>
            </Button>
          </div>
          <img
            src={aboutImageUrl || aboutImage}
            alt="A specialist at RaVida Clinic guiding a patient through a gentle mobility exercise"
            width={1280}
            height={960}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md ring-1 ring-border"
          />
        </div>
      </section>

      <section className="border-y bg-accent/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">What guides us</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                  <value.icon className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid items-center gap-8 rounded-3xl border bg-card p-6 shadow-sm sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
              <MapPin className="h-5 w-5 text-primary" aria-hidden />
            </span>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">A registered Estonian clinic</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              {CLINIC.name} is operated by {CLINIC.legalName} (registry code {CLINIC.registryCode}),
              a registered medical-specialist practice located at {CLINIC.address.street},{" "}
              {CLINIC.address.postalCode} {CLINIC.address.city}, {CLINIC.address.country}.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link to="/contact">
              Contact & opening hours
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
