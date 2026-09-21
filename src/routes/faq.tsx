import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Phone } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CLINIC, FAQS } from "@/lib/clinic";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Patient FAQ — RaVida Clinic Tartu" },
      {
        name: "description",
        content:
          "Answers to common questions about booking, first visits, referrals, cancellations, and what to bring to RaVida Clinic in Tartu.",
      },
      { property: "og:title", content: "Patient FAQ — RaVida Clinic Tartu" },
      {
        property: "og:description",
        content:
          "Answers to common questions about booking, first visits, referrals, cancellations, and what to bring to RaVida Clinic in Tartu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-20">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Everything patients usually ask before their first visit to {CLINIC.name}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-16">
        <Accordion type="single" collapsible>
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-3xl border bg-card p-6 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold">Still have a question?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Our reception is happy to help — or simply send an appointment request and we'll call
            you back.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/book">
                <CalendarCheck className="h-5 w-5" aria-hidden />
                Book an appointment
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={CLINIC.phoneHref}>
                <Phone className="h-4 w-4" aria-hidden />
                {CLINIC.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
