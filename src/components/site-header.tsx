import { Link } from "@tanstack/react-router";
import { CalendarCheck, HeartPulse, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSiteSettings } from "@/lib/site-settings";

const NAV_ITEMS = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

function Logo() {
  const { clinicName, logoUrl } = useSiteSettings();
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label={`${clinicName} — home`}>
      {logoUrl ? (
        <img src={logoUrl} alt="" className="h-9 w-9 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" aria-hidden />
        </span>
      )}
      <span className="truncate font-display text-xl font-semibold tracking-tight">{clinicName}</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { clinicName, tagline } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: false }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/book">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Book appointment
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 max-w-[85vw]">
              <SheetHeader>
                <SheetTitle className="font-display">{clinicName}</SheetTitle>
                <SheetDescription>{tagline}</SheetDescription>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                    activeProps={{ className: "bg-secondary text-primary" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="px-4 pt-4">
                <Button asChild size="lg" className="w-full">
                  <Link to="/book" onClick={() => setOpen(false)}>
                    <CalendarCheck className="h-4 w-4" aria-hidden />
                    Book appointment
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
