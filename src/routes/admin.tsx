import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth } from "@/lib/admin-auth";

import { AdminBookingsTab } from "@/components/admin/bookings-tab";
import { AdminCategoriesTab } from "@/components/admin/categories-tab";
import { AdminServicesTab } from "@/components/admin/services-tab";
import { AdminHoursTab } from "@/components/admin/hours-tab";
import { AdminBrandingTab } from "@/components/admin/branding-tab";
import { AdminSettingsTab } from "@/components/admin/settings-tab";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — RaVida Clinic" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, name, isAdmin, loading, login, logout } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin login={login} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">RaVida Admin</h1>
          <p className="text-sm text-muted-foreground">Signed in as {name}</p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          <LogOut className="h-4 w-4" aria-hidden /> Log out
        </Button>
      </div>

      <Tabs defaultValue="bookings" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="hours">Hours & closures</TabsTrigger>
          <TabsTrigger value="branding">Gallery & branding</TabsTrigger>
          <TabsTrigger value="settings">Clinic info & WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-6">
          <AdminBookingsTab />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <AdminCategoriesTab />
        </TabsContent>
        <TabsContent value="services" className="mt-6">
          <AdminServicesTab />
        </TabsContent>
        <TabsContent value="hours" className="mt-6">
          <AdminHoursTab />
        </TabsContent>
        <TabsContent value="branding" className="mt-6">
          <AdminBrandingTab />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <AdminSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdminLogin({ login }: { login: (email: string, password: string) => Promise<string | null> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const err = await login(email, password);
    setSubmitting(false);
    if (err) setError(err);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Use your RaVida admin account.</p>

        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <Button type="submit" className="mt-5 w-full" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Sign in
        </Button>
      </form>
    </div>
  );
}

export function InlineTrashButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label={label} className="text-destructive hover:text-destructive">
      <Trash2 className="h-4 w-4" aria-hidden />
    </Button>
  );
}
