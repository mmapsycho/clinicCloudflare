import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSettings, useSettings } from "@/lib/booking";

export function AdminSettingsTab() {
  const settings = useSettings();

  const [clinicName, setClinicName] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [waApiKey, setWaApiKey] = useState("");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [waSavedMsg, setWaSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    setClinicName(settings.clinicName ?? "");
    setTagline(settings.tagline ?? "");
    setPhone(settings.phone ?? "");
    setEmail(settings.email ?? "");
    setAddressLine(settings.addressLine ?? "");
    setWaNumber(settings.whatsappNumber ?? "");
    setWaApiKey(settings.whatsappApiKey ?? "5924321");
  }, [settings]);

  async function handleSaveInfo() {
    await saveSettings({ clinicName, tagline, phone, email, addressLine });
    setSavedMsg("Saved.");
    setTimeout(() => setSavedMsg(null), 2500);
  }

  async function handleSaveWhatsApp() {
    await saveSettings({ whatsappNumber: waNumber.trim(), whatsappApiKey: waApiKey.trim() });
    setWaSavedMsg("Saved — new bookings will now alert this number.");
    setTimeout(() => setWaSavedMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Clinic info</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Clinic name</Label>
            <Input className="mt-1.5" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input className="mt-1.5" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Input className="mt-1.5" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          </div>
        </div>
        <Button className="mt-4" variant="outline" onClick={handleSaveInfo}>
          Save
        </Button>
        {savedMsg && <p className="mt-2 text-sm text-primary">{savedMsg}</p>}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">WhatsApp booking alerts</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Uses the free CallMeBot service. Add the clinic's WhatsApp number and hit Save to turn on booking
          alerts — every new booking will trigger a message automatically.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Clinic WhatsApp number (with country code, digits only)</Label>
            <Input className="mt-1.5" placeholder="e.g. 201234567890" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} />
          </div>
          <div>
            <Label>CallMeBot API key</Label>
            <Input className="mt-1.5" value={waApiKey} onChange={(e) => setWaApiKey(e.target.value)} />
          </div>
        </div>
        <Button className="mt-4" variant="outline" onClick={handleSaveWhatsApp}>
          Save
        </Button>
        {waSavedMsg && <p className="mt-2 text-sm text-primary">{waSavedMsg}</p>}
      </div>
    </div>
  );
}
