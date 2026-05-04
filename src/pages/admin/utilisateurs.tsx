import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  supabase,
  supabasePublishableKey,
  supabaseUrl,
  type AppRole,
  type Profile,
} from "@/lib/supabase.ts";
import { Plus, Trash2, ShieldCheck, UserCog, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";

const roleConfig: Record<AppRole, { label: string; color: string; icon: typeof User }> = {
  admin: { label: "Admin", color: "bg-blue-100 text-blue-700", icon: ShieldCheck },
  employee: { label: "Employé", color: "bg-sky-100 text-sky-700", icon: UserCog },
};

export default function AdminUtilisateurs() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[] | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee" as AppRole,
  });

  const load = () =>
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setUsers((data as Profile[]) ?? []));

  useEffect(() => {
    if (profile?.role === "admin") load();
  }, [profile?.role]);

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.name) {
      toast.error("Nom, email et mot de passe sont obligatoires.");
      return;
    }
    setSaving(true);
    try {
      const adminCreateClient = createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: "assia-admin-create-user",
        },
      });
      const { error } = await adminCreateClient.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name, role: form.role } },
      });
      if (error) throw error;
      await adminCreateClient.auth.signOut();
      toast.success("Utilisateur créé.");
      setForm({ name: "", email: "", password: "", role: "employee" });
      setOpen(false);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Création impossible.");
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (id: string, role: AppRole) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) return toast.error(error.message);
    setUsers((items) => items?.map((u) => (u.id === id ? { ...u, role } : u)) ?? []);
    toast.success("Rôle mis à jour.");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le profil "${name}" ?`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setUsers((items) => items?.filter((u) => u.id !== id) ?? []);
    toast.success("Profil supprimé.");
  };

  if (profile?.role !== "admin") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-blue-950">Accès réservé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seul un administrateur peut gérer les utilisateurs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Gestion des utilisateurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les rôles et les accès des utilisateurs.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {(Object.entries(roleConfig) as [AppRole, typeof roleConfig[AppRole]][]).map(([role, cfg]) => (
          <span key={role} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${cfg.color}`}>
            <cfg.icon className="h-3.5 w-3.5" />
            {cfg.label}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-left text-blue-900">
                <th className="px-5 py-3 font-semibold">Utilisateur</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Rôle</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {!users ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">Chargement...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">Aucun utilisateur enregistré.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-blue-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-xs font-bold text-white">
                          {(u.name ?? u.email ?? "?")[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-blue-950">{u.name ?? "-"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{u.email ?? "-"}</td>
                    <td className="px-5 py-4">
                      <Select value={(u.role ?? "employee") as AppRole} onValueChange={(v) => handleRoleChange(u.id, v as AppRole)}>
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="employee">Employé</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(u.id, u.name ?? u.email ?? "?")} className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-blue-950">Nom complet</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nom complet" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-blue-950">Email</Label>
              <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@exemple.com" type="email" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-blue-950">Mot de passe</Label>
              <Input value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Mot de passe" type="password" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-blue-950">Rôle</Label>
              <Select value={form.role} onValueChange={(role) => setForm((f) => ({ ...f, role: role as AppRole }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employee">Employé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate} disabled={saving} className="w-full border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
              {saving ? "Création..." : "Créer l'utilisateur"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
