import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cancelBooking, fmtDateHuman, to12h, todayStr, useBookingsForDate, useCategories } from "@/lib/booking";

export function AdminBookingsTab() {
  const [dateStr, setDateStr] = useState(todayStr());
  const bookings = useBookingsForDate(dateStr);
  const categories = useCategories();

  function shift(delta: number) {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + delta);
    setDateStr(d.toLocaleDateString("en-CA"));
  }

  function categoryLabel(key: string) {
    return categories.find((c) => c.id === key)?.label ?? key;
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Bookings</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous day">
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          <Input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-44" />
          <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next day">
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button variant="outline" onClick={() => setDateStr(todayStr())}>
            Today
          </Button>
        </div>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">{fmtDateHuman(dateStr)}</p>

      <div className="mt-5 overflow-x-auto">
        {bookings.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No bookings for this date.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{to12h(b.time)}</TableCell>
                  <TableCell>{categoryLabel(b.category)}</TableCell>
                  <TableCell>{b.patientName}</TableCell>
                  <TableCell>{b.patientPhone}</TableCell>
                  <TableCell>{b.serviceName}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-muted-foreground">{b.notes || "—"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Cancel this booking? This frees up the time slot again.")) {
                          void cancelBooking(b.id);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
