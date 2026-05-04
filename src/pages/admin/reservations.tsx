import { useEffect, useState } from "react";
import { supabase, type Reservation, type ReservationStatus } from "@/lib/supabase.ts";
import { Trash2, CheckCircle2, XCircle, Clock, Phone, Mail, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";

const statusConfig: Record<ReservationStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "En attente", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmed: { label: "Confirmé", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-600", icon: XCircle },
};

export default function AdminReservations() {
  const { profile } = useAuth();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const canDelete = profile?.role === "admin";

  const load = () =>
    supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setReservations((data as Reservation[]) ?? []));

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id: string, status: ReservationStatus) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setReservations((items) => items?.map((r) => (r.id === id ? { ...r, status } : r)) ?? []);
    toast.success("Statut mis à jour.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setSelected(null);
    setReservations((items) => items?.filter((r) => r.id !== id) ?? []);
    toast.success("Réservation supprimée.");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-950">Réservations reçues</h1>
        <p className="mt-1 text-sm text-muted-foreground">{reservations?.length ?? 0} réservation(s) au total</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {(Object.entries(statusConfig) as [ReservationStatus, typeof statusConfig[ReservationStatus]][]).map(([status, cfg]) => {
          const count = reservations?.filter((r) => r.status === status).length ?? 0;
          return (
            <span key={status} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${cfg.color}`}>
              <cfg.icon className="h-3.5 w-3.5" />
              {cfg.label} ({count})
            </span>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-left text-blue-900">
                <th className="px-5 py-3 font-semibold">Passager</th>
                <th className="px-5 py-3 font-semibold">Voyage</th>
                <th className="px-5 py-3 font-semibold">Départ</th>
                <th className="px-5 py-3 font-semibold">Hôtel</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                {canDelete && <th className="px-5 py-3 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {!reservations ? (
                <tr><td colSpan={canDelete ? 6 : 5} className="px-5 py-8 text-center text-muted-foreground">Chargement...</td></tr>
              ) : reservations.length === 0 ? (
                <tr><td colSpan={canDelete ? 6 : 5} className="px-5 py-8 text-center text-muted-foreground">Aucune réservation pour l'instant.</td></tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="cursor-pointer transition-colors hover:bg-blue-50/50" onClick={() => setSelected(r)}>
                    <td className="px-5 py-4"><div className="font-semibold text-blue-950">{r.first_name} {r.last_name}</div><div className="text-xs text-muted-foreground">{r.phone}</div></td>
                    <td className="px-5 py-4 font-medium text-blue-900">{r.trip_name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.departure_from}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{r.hotel_name}</td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <Select value={r.status} onValueChange={(v) => handleStatus(r.id, v as ReservationStatus)}>
                        <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmé</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    {canDelete && (
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleDelete(r.id)} className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
            <DialogHeader><DialogTitle>Détails de la réservation</DialogTitle></DialogHeader>
            <div className="mt-2 space-y-4">
              <div className="space-y-1 rounded-xl bg-blue-50 p-4">
                <div className="text-lg font-bold text-blue-950">{selected.first_name} {selected.last_name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" />{selected.phone}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" />{selected.email}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{selected.address}, {selected.city}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Voyage", value: selected.trip_name },
                  { label: "Départ", value: `${selected.departure_from} → ${selected.departure_to}` },
                  { label: "Hôtel", value: selected.hotel_name },
                  { label: "Chambre", value: selected.room_type },
                  { label: "Passagers", value: String(selected.passenger_count) },
                  { label: "Nationalité", value: selected.nationality },
                  { label: "Date de naissance", value: selected.birth_date },
                  { label: "Passeport", value: selected.passport_number },
                  { label: "Expiration passeport", value: selected.passport_expiry },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-blue-100 bg-white p-3">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="mt-0.5 text-sm font-semibold text-blue-950">{value}</div>
                  </div>
                ))}
              </div>
              {selected.notes && <div className="rounded-xl border border-amber-100 bg-amber-50 p-4"><div className="mb-1 text-xs font-semibold text-amber-700">Remarques</div><p className="text-sm text-amber-900">{selected.notes}</p></div>}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
