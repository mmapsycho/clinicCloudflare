import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCategory, removeCategory, useCategories } from "@/lib/booking";

export function AdminCategoriesTab() {
  const categories = useCategories();
  const [newLabel, setNewLabel] = useState("");

  async function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    await addCategory(label);
    setNewLabel("");
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Categories</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        These are the top-level groups clients pick from first when booking (e.g. Physiotherapy, Aesthetic &
        Beauty).
      </p>

      <div className="mt-5 space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border bg-background px-4 py-2.5">
            <span className="text-sm font-medium">{c.label}</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              aria-label={`Remove ${c.label}`}
              onClick={() => {
                if (
                  confirm(
                    "Remove this category? Any services currently using it will need to be reassigned afterward.",
                  )
                ) {
                  void removeCategory(c.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        ))}
        {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
      </div>

      <div className="mt-5 flex gap-2">
        <Input
          placeholder="Category name, e.g. Nutrition"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd}>+ Add category</Button>
      </div>
    </div>
  );
}
