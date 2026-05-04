import { useEffect, useState } from "react";
import { Plane, Users, CalendarCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, type AdminTrip, type Profile, type Reservation } from "@/lib/supabase.ts";
import { useAuth } from "@/hooks/use-auth.ts";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [users, setUsers] = useState<Profile[] | null>(null);
  const [trips, setTrips] = useState<AdminTrip[] | null>(null);

  useEffect(() => {
    if (profile?.role !== "admin") return;
    supabase.from("reservations").select("*").order("created_at", { ascending: false }).then(({ data }) => setReservations((data as Reservation[]) ?? []));
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => setUsers((data as Profile[]) ?? []));
    supabase.from("trips").select("*").order("created_at", { ascending: false }).then(({ data }) => setTrips((data as AdminTrip[]) ?? []));
  }, [profile?.role]);

  if (profile?.role === "employee") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-blue-950">Espace employé</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vous pouvez consulter les réservations et modifier leur statut.</p>
        <Link to="/admin/reservations" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Voir les réservations
        </Link>
      </div>
    );
  }

  const pending = reservations?.filter((r) => r.status === "pending").length ?? 0;
  const confirmed = reservations?.filter((r) => r.status === "confirmed").length ?? 0;
  const stats = [
    { icon: CalendarCheck, label: "Réservations totales", value: reservations?.length ?? 0, sub: `${pending} en attente`, color: "from-blue-600 to-sky-500", to: "/admin/reservations" },
    { icon: Plane, label: "Voyages actifs", value: trips?.length ?? 0, sub: "Destinations disponibles", color: "from-sky-500 to-cyan-400", to: "/admin/voyages" },
    { icon: Users, label: "Utilisateurs", value: users?.length ?? 0, sub: "Comptes enregistrés", color: "from-blue-700 to-blue-500", to: "/admin/utilisateurs" },
    { icon: TrendingUp, label: "Confirmées", value: confirmed, sub: "Réservations confirmées", color: "from-green-600 to-emerald-500", to: "/admin/reservations" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8"><h1 className="text-2xl font-bold text-blue-950">Tableau de bord</h1><p className="mt-1 text-sm text-muted-foreground">Bienvenue dans l'espace administration d'Assia Tours</p></div>
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{stats.map((s) => <Link key={s.label} to={s.to}><div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}><s.icon className="h-5 w-5 text-white" /></div><div className="text-3xl font-bold text-blue-950">{s.value}</div><div className="mt-0.5 text-sm font-medium text-blue-900">{s.label}</div><div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div></div></Link>)}</div>
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-blue-50 p-5"><h2 className="font-bold text-blue-950">Dernières réservations</h2><Link to="/admin/reservations" className="text-sm font-medium text-blue-600 hover:underline">Voir tout</Link></div>{!reservations ? <div className="p-8 text-center text-sm text-muted-foreground">Chargement...</div> : reservations.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Aucune réservation pour l'instant.</div> : <div className="divide-y divide-blue-50">{reservations.slice(0, 5).map((r) => <div key={r.id} className="flex items-center justify-between px-5 py-4"><div><div className="text-sm font-medium text-blue-950">{r.first_name} {r.last_name}</div><div className="text-xs text-muted-foreground">{r.trip_name} - {r.departure_from}</div></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === "confirmed" ? "bg-green-100 text-green-700" : r.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>{r.status === "confirmed" ? "Confirmé" : r.status === "cancelled" ? "Annulé" : "En attente"}</span></div>)}</div>}</div>
    </div>
  );
}
