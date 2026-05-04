import { useEffect, useState } from "react";
import { supabase, type AppRole, type Profile } from "@/lib/supabase.ts";
import { Trash2, ShieldCheck, UserCog, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { toast } from "sonner";

const roleConfig: Record<AppRole, { label: string; color: string; icon: typeof User }> = {
  admin: { label: "Admin", color: "bg-blue-100 text-blue-700", icon: ShieldCheck },
  employee: { label: "Employé", color: "bg-sky-100 text-sky-700", icon: UserCog },
  client: { label: "Client", color: "bg-gray-100 text-gray-600", icon: User },
};

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState<Profile[] | null>(null);
  useEffect(() => { supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => setUsers((data as Profile[]) ?? [])); }, []);

  const handleRoleChange = async (id: string, role: AppRole) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) return toast.error(error.message);
    setUsers((items) => items?.map((u) => u.id === id ? { ...u, role } : u) ?? []);
    toast.success("Rôle mis à jour.");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le profil "${name}" ?`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setUsers((items) => items?.filter((u) => u.id !== id) ?? []);
    toast.success("Profil supprimé.");
  };

  return (
    <div className="p-8">
      <div className="mb-8"><h1 className="text-2xl font-bold text-blue-950">Gestion des utilisateurs</h1><p className="mt-1 text-sm text-muted-foreground">Gérez les rôles et les accès des utilisateurs.</p></div>
      <div className="mb-6 flex flex-wrap gap-3">{(Object.entries(roleConfig) as [AppRole, typeof roleConfig[AppRole]][]).map(([role, cfg]) => <span key={role} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${cfg.color}`}><cfg.icon className="h-3.5 w-3.5" />{cfg.label}</span>)}</div>
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-blue-50 text-left text-blue-900"><th className="px-5 py-3 font-semibold">Utilisateur</th><th className="px-5 py-3 font-semibold">Email</th><th className="px-5 py-3 font-semibold">Rôle</th><th className="px-5 py-3 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-blue-50">{!users ? <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">Chargement...</td></tr> : users.length === 0 ? <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">Aucun utilisateur enregistré.</td></tr> : users.map((u) => <tr key={u.id} className="transition-colors hover:bg-blue-50/50"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-xs font-bold text-white">{(u.name ?? u.email ?? "?")[0].toUpperCase()}</div><span className="font-medium text-blue-950">{u.name ?? "-"}</span></div></td><td className="px-5 py-4 text-muted-foreground">{u.email ?? "-"}</td><td className="px-5 py-4"><Select value={u.role ?? "client"} onValueChange={(v) => handleRoleChange(u.id, v as AppRole)}><SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="employee">Employé</SelectItem><SelectItem value="client">Client</SelectItem></SelectContent></Select></td><td className="px-5 py-4"><button onClick={() => handleDelete(u.id, u.name ?? u.email ?? "?")} className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></div>
    </div>
  );
}
