import { createContext, useContext, type ReactNode } from "react";
import { CLINIC } from "./clinic";
import { useSettings, type BkSettings } from "./booking";

export interface ResolvedSiteSettings {
  clinicName: string;
  tagline: string;
  logoUrl?: string | undefined;
  heroBackgroundUrl?: string | undefined;
  homeSecondaryImageUrl?: string | undefined;
  aboutImageUrl?: string | undefined;
  phone: string;
  email: string;
  addressLine: string;
  raw: BkSettings;
}

const SiteSettingsContext = createContext<ResolvedSiteSettings | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const settings = useSettings();

  const resolved: ResolvedSiteSettings = {
    clinicName: settings.clinicName || CLINIC.name,
    tagline: settings.tagline || CLINIC.tagline,
    logoUrl: settings.logoUrl,
    heroBackgroundUrl: settings.heroBackgroundUrl,
    homeSecondaryImageUrl: settings.homeSecondaryImageUrl,
    aboutImageUrl: settings.aboutImageUrl,
    phone: settings.phone || CLINIC.phoneDisplay,
    email: settings.email || CLINIC.email,
    addressLine:
      settings.addressLine ||
      `${CLINIC.address.street}, ${CLINIC.address.postalCode} ${CLINIC.address.city}, ${CLINIC.address.country}`,
    raw: settings,
  };

  return <SiteSettingsContext.Provider value={resolved}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): ResolvedSiteSettings {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    return {
      clinicName: CLINIC.name,
      tagline: CLINIC.tagline,
      phone: CLINIC.phoneDisplay,
      email: CLINIC.email,
      addressLine: `${CLINIC.address.street}, ${CLINIC.address.postalCode} ${CLINIC.address.city}, ${CLINIC.address.country}`,
      raw: {},
    };
  }
  return ctx;
}
