import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  addService,
  deleteService,
  fmtDurationWithPrice,
  updateService,
  useAllServices,
  useCategories,
  type BkService,
} from "@/lib/booking";

const STANDARD_DURATIONS = [30, 60, 90];

export function AdminServicesTab() {
  const categories = useCategories();
  const services = useAllServices();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Services</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each duration can have its own price. Leave the fallback price blank if every duration is priced
          individually.
        </p>

        <div className="mt-5 space-y-4">
          {services.map((s) => (
            <ServiceRow key={s.id} service={s} categories={categories} />
          ))}
          {services.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
        </div>
      </div>

      <NewServiceForm categories={categories} />
    </div>
  );
}

function ServiceRow({ service, categories }: { service: BkService; categories: { id: string; label: string }[] }) {
  const durations = service.durations ?? [];
  const customs = durations.filter((d) => d !== 0 && !STANDARD_DURATIONS.includes(d));
  const [customMin, setCustomMin] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  function toggleDuration(d: number, checked: boolean) {
    const next = checked ? [...durations, d] : durations.filter((x) => x !== d);
    next.sort((a, b) => a - b);
    void updateService(service.id, { durations: next });
  }

  function setDurationPrice(dKey: string, value: string) {
    const prices = { ...(service.durationPrices ?? {}) };
    if (value.trim()) prices[dKey] = value.trim();
    else delete prices[dKey];
    void updateService(service.id, { durationPrices: prices });
  }

  function addCustomDuration() {
    const val = Number(customMin);
    if (!val || val < 1) return;
    const next = [...durations, val].sort((a, b) => a - b);
    void updateService(service.id, { durations: next });
    if (customPrice.trim()) setDurationPrice(String(val), customPrice.trim());
    setCustomMin("");
    setCustomPrice("");
  }

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="grid gap-3 sm:grid-cols-[2fr_1.2fr_1fr]">
        <Input
          value={service.name}
          onChange={(e) => void updateService(service.id, { name: e.target.value })}
        />
        <Select value={service.category} onValueChange={(v) => void updateService(service.id, { category: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="fallback price"
          value={service.price ?? ""}
          onChange={(e) => void updateService(service.id, { price: e.target.value })}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {STANDARD_DURATIONS.map((d) => (
          <div key={d} className="flex items-center gap-2">
            <Checkbox
              id={`${service.id}-${d}`}
              checked={durations.includes(d)}
              onCheckedChange={(checked) => toggleDuration(d, checked === true)}
            />
            <Label htmlFor={`${service.id}-${d}`} className="text-sm font-normal">
              {d} min
            </Label>
            <Input
              placeholder="price"
              defaultValue={service.durationPrices?.[String(d)] ?? ""}
              onBlur={(e) => setDurationPrice(String(d), e.target.value)}
              className="h-8 w-24 text-xs"
            />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${service.id}-notime`}
            checked={durations.includes(0)}
            onCheckedChange={(checked) => toggleDuration(0, checked === true)}
          />
          <Label htmlFor={`${service.id}-notime`} className="text-sm font-normal">
            No time
          </Label>
          <Input
            placeholder="price"
            defaultValue={service.durationPrices?.["0"] ?? ""}
            onBlur={(e) => setDurationPrice("0", e.target.value)}
            className="h-8 w-24 text-xs"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Switch
            id={`${service.id}-active`}
            checked={service.active !== false}
            onCheckedChange={(checked) => void updateService(service.id, { active: checked })}
          />
          <Label htmlFor={`${service.id}-active`} className="text-sm font-normal">
            Active
          </Label>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            aria-label="Remove service"
            onClick={() => {
              if (confirm("Remove this service? Existing bookings for it are kept.")) void deleteService(service.id);
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Input
          type="number"
          min={1}
          placeholder="custom minutes"
          value={customMin}
          onChange={(e) => setCustomMin(e.target.value)}
          className="h-8 w-32 text-xs"
        />
        <Input
          placeholder="price (optional)"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          className="h-8 w-28 text-xs"
        />
        <Button variant="outline" size="sm" onClick={addCustomDuration}>
          + Add duration
        </Button>
        {customs.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => toggleDuration(d, false)}
            title="Click to remove"
            className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
          >
            {fmtDurationWithPrice(service, d)} ✕
          </button>
        ))}
      </div>

      <div className="mt-3">
        <Label className="text-xs">Description (shown to clients under this service)</Label>
        <Textarea
          rows={2}
          defaultValue={service.description ?? ""}
          onBlur={(e) => void updateService(service.id, { description: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  );
}

function NewServiceForm({ categories }: { categories: { id: string; label: string }[] }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(categories[0]?.id ?? "");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState<Record<number, boolean>>({ 30: true });
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [customMin, setCustomMin] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customs, setCustoms] = useState<{ minutes: number; price: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  function addCustom() {
    const val = Number(customMin);
    if (!val || val < 1) return;
    setCustoms((prev) => [...prev, { minutes: val, price: customPrice.trim() }]);
    setCustomMin("");
    setCustomPrice("");
  }

  async function handleAdd() {
    if (!name.trim()) {
      setError("Enter a service name.");
      return;
    }
    const durations: number[] = [];
    const durationPrices: Record<string, string> = {};
    [30, 60, 90, 0].forEach((d) => {
      if (checked[d]) {
        durations.push(d);
        if (prices[d]) durationPrices[String(d)] = prices[d];
      }
    });
    customs.forEach((c) => {
      durations.push(c.minutes);
      if (c.price) durationPrices[String(c.minutes)] = c.price;
    });
    if (durations.length === 0) {
      setError("Pick at least one duration.");
      return;
    }
    durations.sort((a, b) => a - b);
    await addService({ name: name.trim(), category, durations, durationPrices, price: price.trim(), description: description.trim(), active: true });
    setName("");
    setPrice("");
    setDescription("");
    setChecked({ 30: true });
    setPrices({});
    setCustoms([]);
    setError(null);
  }

  return (
    <div className="rounded-2xl border-l-4 border-l-primary bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Add a new service</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input className="mt-1.5" placeholder="e.g. Facial" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <Label>Durations offered (with an optional price for each)</Label>
        <div className="mt-2 space-y-2">
          {[30, 60, 90].map((d) => (
            <div key={d} className="flex items-center gap-3">
              <Checkbox
                id={`new-${d}`}
                checked={checked[d] ?? false}
                onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [d]: v === true }))}
              />
              <Label htmlFor={`new-${d}`} className="w-16 text-sm font-normal">
                {d} min
              </Label>
              <Input
                placeholder="price optional"
                className="h-8 w-32 text-xs"
                value={prices[d] ?? ""}
                onChange={(e) => setPrices((prev) => ({ ...prev, [d]: e.target.value }))}
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Checkbox
              id="new-notime"
              checked={checked[0] ?? false}
              onCheckedChange={(v) => setChecked((prev) => ({ ...prev, 0: v === true }))}
            />
            <Label htmlFor="new-notime" className="w-16 text-sm font-normal">
              No time
            </Label>
            <Input
              placeholder="price optional"
              className="h-8 w-32 text-xs"
              value={prices[0] ?? ""}
              onChange={(e) => setPrices((prev) => ({ ...prev, 0: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Input
            type="number"
            min={1}
            placeholder="custom minutes"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            className="h-8 w-32 text-xs"
          />
          <Input
            placeholder="price optional"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            className="h-8 w-28 text-xs"
          />
          <Button variant="outline" size="sm" onClick={addCustom}>
            + Add duration
          </Button>
          {customs.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCustoms((prev) => prev.filter((_, idx) => idx !== i))}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
            >
              {c.minutes} min{c.price ? ` (${c.price})` : ""} ✕
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Label>Fallback price (used only for durations left blank above)</Label>
        <Input className="mt-1.5" placeholder="e.g. 500 EGP" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="mt-4">
        <Label>Description (optional — shown to clients under this service)</Label>
        <Textarea
          rows={2}
          className="mt-1.5"
          placeholder="Any extra info for clients"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <Button className="mt-5" onClick={handleAdd}>
        + Add service
      </Button>
    </div>
  );
}
