import { Link, Outlet, useLocation } from "react-router-dom";
import { Plane, Users, CalendarCheck, LayoutDashboard, LogOut, ChevronRight } from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", to: "/admin" },
  { icon: Plane, label: "Voyages", to: "/admin/voyages" },
  { icon: Users, label: "Utilisateurs", to: "/admin/utilisateurs" },
  { icon: CalendarCheck, label: "Réservations", to: "/admin/reservations" },
];

function AdminSidebar() {
  const { pathname } = useLocation();
  const { removeUser, user } = useAuth();
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <div className="border-b border-blue-800/60 p-6">
        <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-500"><Plane className="h-4 w-4 text-white" /></div><div className="leading-none"><div className="text-sm font-bold">ASSIA TOURS</div><div className="text-xs text-blue-300">Administration</div></div></div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = pathname === item.to;
          return <Link key={item.to} to={item.to} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}><item.icon className="h-4 w-4" />{item.label}{active && <ChevronRight className="ml-auto h-4 w-4" />}</Link>;
        })}
      </nav>
      <div className="border-t border-blue-800/60 p-4"><div className="mb-2 truncate text-xs text-blue-300">{user?.profile.name ?? user?.profile.email ?? "Admin"}</div><button onClick={() => removeUser()} className="flex items-center gap-2 text-sm text-blue-300 transition-colors hover:text-white"><LogOut className="h-4 w-4" />Déconnexion</button></div>
    </aside>
  );
}

export default function AdminLayout() {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-blue-950 text-white">Chargement...</div>;
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 to-blue-900">
        <div className="mx-4 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-10 text-center text-white backdrop-blur-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500"><Plane className="h-7 w-7 text-white" /></div>
          <h1 className="mb-2 text-2xl font-bold">Espace Admin</h1>
          <p className="mb-6 text-sm text-blue-200">Connectez-vous pour accéder au panneau d'administration.</p>
          <SignInButton className="w-full" />
        </div>
      </div>
    );
  }
  return <div className="flex min-h-screen bg-background"><AdminSidebar /><main className="flex-1 overflow-auto"><Outlet /></main></div>;
}
