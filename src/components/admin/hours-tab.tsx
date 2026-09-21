import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  addBlockedDate,
  fmtDateHuman,
  removeBlockedDate,
  saveHours,
  useAllHours,
  useBlockedDates,
  WEEKDAY_KEYS,
  WEEKDAY_NAMES,
  type BkHours,
} from "@/lib/booking";

const DEFAULT_ROW: BkHours = { open: "09:00", close: "18:00", slotMinutes: 30, closed: false };

export function AdminHoursTab() {
  const hoursByDay = useAllHours();
  const blockedDates = useBlockedDates();
  const [drafts, setDrafts] = useState<Record<string, BkHours>>({});
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  useEffect(() => {
    const next: Record<string, BkHours> = {};
    WEEKDAY_KEYS.forEach((k) => {
      next[k] = hoursByDay[k] ?? DEFAULT_ROW;
    });
    setDrafts(next);
  }, [hoursByDay]);

  function updateDraft(dow: string, fields: Partial<BkHours>) {
    setDrafts((prev) => ({ ...prev, [dow]: { ...(prev[dow] ?? DEFAULT_ROW), ...fields } }));
  }

  async function handleSave(dow: string) {
    await saveHours(dow, drafts[dow] ?? DEFAULT_ROW);
    setSavedMsg(`${WEEKDAY_NAMES[Number(dow)]} hours saved.`);
    setTimeout(() => setSavedMsg(null), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Working hours</h2>
        <div className="mt-4 divide-y">
          {WEEKDAY_KEYS.map((dow) => {
            const draft = drafts[dow] ?? DEFAULT_ROW;
            return (
              <div key={dow} className="grid items-center gap-3 py-3 sm:grid-cols-[100px_1fr_1fr_110px_auto]">
                <span className="text-sm font-semibold">{WEEKDAY_NAMES[Number(dow)]}</span>
                <Input
                  type="time"
                  value={draft.open}
                  onChange={(e) => updateDraft(dow, { open: e.target.value })}
                />
                <Input
                  type="time"
                  value={draft.close}
                  onChange={(e) => updateDraft(dow, { close: e.target.value })}
                />
                <Select
                  value={String(draft.slotMinutes)}
                  onValueChange={(v) => updateDraft(dow, { slotMinutes: Number(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Checkbox
                      id={`closed-${dow}`}
                      checked={draft.closed}
                      onCheckedChange={(v) => updateDraft(dow, { closed: v === true })}
                    />
                    <Label htmlFor={`closed-${dow}`} className="text-xs font-normal">
                      Closed
                    </Label>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => void handleSave(dow)}>
                    Save
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {savedMsg && <p className="mt-3 text-sm text-primary">{savedMsg}</p>}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Blocked dates (holidays, closures)</h2>
        <div className="mt-4 flex gap-2">
          <Input type="date" value={newBlockedDate} onChange={(e) => setNewBlockedDate(e.target.value)} className="w-48" />
          <Button
            variant="outline"
            onClick={async () => {
              if (!newBlockedDate) return;
              await addBlockedDate(newBlockedDate);
              setNewBlockedDate("");
            }}
          >
            + Block this date
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {blockedDates.length === 0 && <p className="text-sm text-muted-foreground">No blocked dates.</p>}
          {blockedDates.map((ds) => (
            <div key={ds} className="flex items-center justify-between rounded-lg border bg-background px-4 py-2.5">
              <span className="text-sm">{fmtDateHuman(ds)}</span>
              <Button variant="ghost" size="sm" onClick={() => void removeBlockedDate(ds)}>
                Unblock
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
