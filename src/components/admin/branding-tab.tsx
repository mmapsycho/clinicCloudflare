import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPhoto, removePhoto, saveSettings, usePhotos, useSettings } from "@/lib/booking";

export function AdminBrandingTab() {
  const settings = useSettings();
  const photos = usePhotos();

  const [logoUrl, setLogoUrl] = useState("");
  const [heroBg, setHeroBg] = useState("");
  const [homeSecondaryImage, setHomeSecondaryImage] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [lightbox, setLightbox] = useState<{ url: string; caption?: string } | null>(null);

  useEffect(() => {
    setLogoUrl(settings.logoUrl ?? "");
    setHeroBg(settings.heroBackgroundUrl ?? "");
    setHomeSecondaryImage(settings.homeSecondaryImageUrl ?? "");
    setAboutImage(settings.aboutImageUrl ?? "");
  }, [settings.logoUrl, settings.heroBackgroundUrl, settings.homeSecondaryImageUrl, settings.aboutImageUrl]);

  async function handleSaveBranding() {
    await saveSettings({
      logoUrl: logoUrl.trim(),
      heroBackgroundUrl: heroBg.trim(),
      homeSecondaryImageUrl: homeSecondaryImage.trim(),
      aboutImageUrl: aboutImage.trim(),
    });
    setSavedMsg("Saved.");
    setTimeout(() => setSavedMsg(null), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Site photos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every photo on the site is editable here — paste a full image URL, or upload the file to this same
          repo/folder and just type its filename (e.g. <code>logo2.png</code>) — no URL needed.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <Label>Logo (next to the clinic name in the header/footer)</Label>
            <Input
              className="mt-1.5"
              placeholder="https://... OR just a filename like logo2.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Homepage hero photo (top of the main page)</Label>
            <Input
              className="mt-1.5"
              placeholder="https://... OR just a filename like hero-bg.jpg"
              value={heroBg}
              onChange={(e) => setHeroBg(e.target.value)}
            />
          </div>
          <div>
            <Label>Homepage "Why choose us" photo (second photo on the main page)</Label>
            <Input
              className="mt-1.5"
              placeholder="https://... OR just a filename like why-us.jpg"
              value={homeSecondaryImage}
              onChange={(e) => setHomeSecondaryImage(e.target.value)}
            />
          </div>
          <div>
            <Label>About page photo</Label>
            <Input
              className="mt-1.5"
              placeholder="https://... OR just a filename like about.jpg"
              value={aboutImage}
              onChange={(e) => setAboutImage(e.target.value)}
            />
          </div>

        </div>

        <Button className="mt-4" variant="outline" onClick={handleSaveBranding}>
          Save
        </Button>
        {savedMsg && <p className="mt-2 text-sm text-primary">{savedMsg}</p>}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Clinic photos</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Input
            placeholder="Image URL or just a filename like clinic1.jpg"
            className="min-w-[220px] flex-[2]"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
          />
          <Input
            placeholder="Caption (optional)"
            className="min-w-[160px] flex-1"
            value={newPhotoCaption}
            onChange={(e) => setNewPhotoCaption(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={async () => {
              if (!newPhotoUrl.trim()) return;
              await addPhoto(newPhotoUrl.trim(), newPhotoCaption.trim());
              setNewPhotoUrl("");
              setNewPhotoCaption("");
            }}
          >
            + Add photo
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-xl border">
              <img
                src={p.url}
                alt={p.caption ?? ""}
                className="h-32 w-full cursor-pointer object-cover"
                onClick={() => setLightbox({ url: p.url, caption: p.caption ?? "" })}
              />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => void removePhoto(p.id)}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-destructive shadow"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          ))}
          {photos.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No photos yet.</p>}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox.url} alt={lightbox.caption ?? ""} className="max-h-[80vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}
