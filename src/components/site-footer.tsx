import { Link } from "@tanstack/react-router";
import { Clock, HeartPulse, Mail, MapPin, Phone } from "lucide-react";

import { CLINIC } from "@/lib/clinic";
import { useSiteSettings } from "@/lib/site-settings";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { clinicName, tagline, phone, email, addressLine, logoUrl } = useSiteSettings();

  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-9 w-9 rounded-xl object-cover" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <HeartPulse className="h-5 w-5" aria-hidden />
              </span>
            )}
            <span className="font-display text-xl font-semibold">{clinicName}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tagline}. Individual, unhurried care focused on pain reduction and sustainable mobility.
          </p>
        </div>

        <nav className="space-y-3" aria-label="Services">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Services</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/services" className="font-medium text-primary transition-colors hover:underline">
                Browse all services
              </Link>
            </li>
            <li>
              <Link to="/book" className="transition-colors hover:text-primary">
                Book an appointment
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="space-y-3" aria-label="Clinic">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Clinic</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="transition-colors hover:text-primary">
                About us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-primary">
                Patient FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-primary">
                Contact & hours
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Contact</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{addressLine}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-primary">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href={`mailto:${email}`} className="transition-colors hover:text-primary">
                {email}
              </a>
            </li>
            {CLINIC.hours[0] ? (
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>
                  {CLINIC.hours[0].days}: {CLINIC.hours[0].time}
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <div className="space-y-1.5">
            <p>
              © {year} {CLINIC.legalName} · Registry code {CLINIC.registryCode} · {clinicName}
            </p>
            <p>
              The information on this website is general in nature and does not replace individual
              medical advice, diagnosis, or treatment.
            </p>
          </div>
          {/* Intentionally subtle — this is the admin sign-in entry point. */}
          <Link
            to="/admin"
            aria-label="Admin"
            className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/20 transition-colors hover:bg-muted-foreground/50"
          />
        </div>
      </div>
    </footer>
  );
}
