import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { fmtDurationWithPrice, useAllServices, useCategories } from "@/lib/booking";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — RaVida Clinic" },
      {
        name: "description",
        content: "Browse every service at RaVida Clinic, grouped by category, and book online.",
      },
      { property: "og:title", content: "Services — RaVida Clinic" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const categories = useCategories();
  const services = useAllServices();
  const { clinicName } = useSiteSettings();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function isCollapsed(key: string) {
    return collapsed[key] ?? true; // collapsed by default
  }

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">Our services</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Browse what {clinicName} offers, grouped by category. Tap any service to jump straight into booking it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="space-y-4">
          {categories.map((cat) => {
            const list = services.filter((s) => s.category === cat.id && s.active !== false);
            if (list.length === 0) return null;
            const closed = isCollapsed(cat.id);
            return (
              <div key={cat.id} className="rounded-2xl border bg-card shadow-sm">
                <button
                  type="button"
                  onClick={() => setCollapsed((prev) => ({ ...prev, [cat.id]: !closed }))}
                  className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
                  aria-expanded={!closed}
                >
                  <span className="text-lg font-semibold">{cat.label}</span>
                  {closed ? (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden />
                  )}
                </button>

                {!closed && (
                  <div className="grid gap-3 border-t px-6 py-5 sm:grid-cols-2">
                    {list.map((service) => (
                      <Link
                        key={service.id}
                        to="/book"
                        search={{ category: service.category, service: service.id }}
                        className="flex flex-col rounded-xl border bg-background p-4 transition-colors hover:border-primary/60 hover:bg-secondary/50"
                      >
                        <span className="font-semibold">{service.name}</span>
                        <span className="mt-1 text-sm text-muted-foreground">
                          {(service.durations?.length ? service.durations : [30, 60, 90])
                            .map((d) => fmtDurationWithPrice(service, d))
                            .join(" · ")}
                        </span>
                        {service.description && (
                          <span className="mt-1.5 text-sm leading-snug text-muted-foreground">
                            {service.description}
                          </span>
                        )}
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          <CalendarCheck className="h-4 w-4" aria-hidden /> Book this
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {categories.length === 0 && (
            <p className="text-center text-muted-foreground">Services coming soon.</p>
          )}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Not sure which service fits your situation?{" "}
          <Link to="/book" className="font-medium text-primary hover:underline">
            Start a booking
          </Link>{" "}
          and reception will help you choose the right starting point.
        </p>

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link to="/book">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Book an appointment
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
