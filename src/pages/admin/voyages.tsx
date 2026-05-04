import { useEffect, useState } from "react";
import { supabase, type AdminTrip } from "@/lib/supabase.ts";
import { Plus, Trash2, X, Check, Plane } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";

type TripForm = {
  slug: string;
  destination: string;
  country: string;
  flag: string;
  tagline: string;
  description: string;
  heroImage: string;
  airline: string;
  duration: string;
  basePrice: string;
  includesRaw: string;
  excludesRaw: string;
  excursionsRaw: string;
};

const empty: TripForm = {
  slug: "", destination: "", country: "", flag: "WORLD",
  tagline: "", description: "", heroImage: "", airline: "",
  duration: "", basePrice: "", includesRaw: "", excludesRaw: "", excursionsRaw: "",
};

export default function AdminVoyages() {
  const [trips, setTrips] = useState<AdminTrip[] | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TripForm>(empty);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof TripForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const load = () => supabase.from("trips").select("*").order("created_at", { ascending: false }).then(({ data }) => setTrips((data as AdminTrip[]) ?? []));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.slug || !form.tagline || !form.destination) return toast.error("Remplissez les champs obligatoires.");
    setSaving(true);
    try {
      const { error } = await supabase.from("trips").insert({
        slug: form.slug,
        destination: form.destination,
        country: form.country,
        flag: form.flag,
        tagline: form.tagline,
        description: form.description,
        hero_image: form.heroImage,
        airline: form.airline,
        duration: form.duration,
        base_price: Number(form.basePrice) || 0,
        includes: form.includesRaw.split("\n").filter(Boolean),
        excludes: form.excludesRaw.split("\n").filter(Boolean),
        excursions: form.excursionsRaw.split("\n").filter(Boolean),
        optional_activities: [],
        active: true,
      });
      if (error) throw error;
      toast.success("Voyage créé avec succès !");
      setForm(empty);
      setOpen(false);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le voyage "${name}" ?`)) return;
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setTrips((items) => items?.filter((trip) => trip.id !== id) ?? []);
    toast.success("Voyage supprimé.");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between"><div><h1 className="text-2xl font-bold text-blue-950">Gestion des voyages</h1><p className="mt-1 text-sm text-muted-foreground">Ajoutez ou supprimez des voyages.</p></div><Button onClick={() => setOpen(true)} className="border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white"><Plus className="mr-2 h-4 w-4" />Nouveau voyage</Button></div>
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-blue-50 text-left text-blue-900"><th className="px-5 py-3 font-semibold">Voyage</th><th className="px-5 py-3 font-semibold">Destination</th><th className="px-5 py-3 font-semibold">Compagnie</th><th className="px-5 py-3 font-semibold">Prix de base</th><th className="px-5 py-3 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-blue-50">{!trips ? <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Chargement...</td></tr> : trips.length === 0 ? <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucun voyage. Cliquez sur Nouveau voyage pour commencer.</td></tr> : trips.map((trip) => <tr key={trip.id} className="transition-colors hover:bg-blue-50/50"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{trip.flag}</span><div><div className="font-semibold text-blue-950">{trip.tagline}</div><div className="text-xs text-muted-foreground">{trip.duration}</div></div></div></td><td className="px-5 py-4 text-blue-900">{trip.destination}, {trip.country}</td><td className="px-5 py-4 font-medium text-blue-700">{trip.airline}</td><td className="px-5 py-4 font-bold text-blue-700">{Number(trip.base_price).toLocaleString("fr-DZ")} DA</td><td className="px-5 py-4"><button onClick={() => handleDelete(trip.id, trip.tagline)} className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle className="flex items-center gap-2"><Plane className="h-5 w-5 text-blue-600" />Nouveau voyage</DialogTitle></DialogHeader><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{[
        ["tagline", "Titre du voyage *", "Prestige Istanbul 2026"],
        ["slug", "Slug URL *", "prestige-istanbul"],
        ["destination", "Destination *", "Istanbul"],
        ["country", "Pays *", "Turquie"],
        ["flag", "Drapeau / code", "TR"],
        ["airline", "Compagnie aérienne", "Turkish Airlines"],
        ["duration", "Durée", "7 jours / 6 nuits"],
        ["basePrice", "Prix de base (DA)", "119000"],
      ].map(([k, label, placeholder]) => <div key={k} className="space-y-1.5"><Label className="text-sm font-medium text-blue-950">{label}</Label><Input placeholder={placeholder} value={form[k as keyof TripForm]} onChange={(e) => set(k as keyof TripForm, e.target.value)} /></div>)}<div className="space-y-1.5 md:col-span-2"><Label className="text-sm font-medium text-blue-950">URL de l'image principale</Label><Input placeholder="https://images.unsplash.com/..." value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} /></div><div className="space-y-1.5 md:col-span-2"><Label className="text-sm font-medium text-blue-950">Description</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="resize-none" /></div>{[
        ["includesRaw", "Ce qui est inclus (une ligne par item)"],
        ["excursionsRaw", "Excursions (une ligne par item)"],
        ["excludesRaw", "Non inclus (une ligne par item)"],
      ].map(([k, label]) => <div key={k} className="space-y-1.5 md:col-span-2"><Label className="text-sm font-medium text-blue-950">{label}</Label><Textarea rows={3} value={form[k as keyof TripForm]} onChange={(e) => set(k as keyof TripForm, e.target.value)} className="resize-none" /></div>)}</div><div className="mt-6 flex gap-3"><Button onClick={handleSave} disabled={saving} className="flex-1 border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white"><Check className="mr-2 h-4 w-4" />{saving ? "Création..." : "Créer le voyage"}</Button><Button variant="secondary" onClick={() => setOpen(false)}><X className="mr-2 h-4 w-4" />Annuler</Button></div></DialogContent></Dialog>
    </div>
  );
}
