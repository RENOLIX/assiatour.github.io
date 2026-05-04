import { useEffect, useState } from "react";
import { supabase, type AdminTrip } from "@/lib/supabase.ts";
import { tripFromDb } from "@/lib/travel-data.ts";
import { Check, ImagePlus, Pencil, Plane, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

type DepartureForm = { id: string; from: string; to: string };
type HotelPriceKey = "double" | "triple" | "single" | "infant" | "child1" | "child2";
type HotelForm = {
  id: string;
  name: string;
  stars: string;
  image: string;
  prices: Record<HotelPriceKey, { enabled: boolean; value: string }>;
};
type TripForm = {
  destination: string;
  country: string;
  flag: string;
  tagline: string;
  description: string;
  airline: string;
  duration: string;
  basePrice: string;
  galleryImages: string[];
  departures: DepartureForm[];
  hotels: HotelForm[];
  includesRaw: string;
  excludesRaw: string;
  excursionsRaw: string;
  optionalRaw: string;
};

const priceLabels: Record<HotelPriceKey, string> = {
  double: "Chambre Double / Triple",
  triple: "Chambre Triple",
  single: "Supplément Single",
  infant: "Bébé (0-2 ans)",
  child1: "Enfant (2-6 ans)",
  child2: "Enfant (6-12 ans)",
};

const newDeparture = (): DepartureForm => ({ id: crypto.randomUUID(), from: "", to: "" });
const emptyPrices = (): HotelForm["prices"] => ({
  double: { enabled: false, value: "" },
  triple: { enabled: false, value: "" },
  single: { enabled: false, value: "" },
  infant: { enabled: false, value: "" },
  child1: { enabled: false, value: "" },
  child2: { enabled: false, value: "" },
});
const newHotel = (): HotelForm => ({
  id: crypto.randomUUID(),
  name: "",
  stars: "5",
  image: "",
  prices: emptyPrices(),
});

const empty: TripForm = {
  destination: "",
  country: "",
  flag: "WORLD",
  tagline: "",
  description: "",
  airline: "",
  duration: "",
  basePrice: "",
  galleryImages: [],
  departures: [newDeparture()],
  hotels: [newHotel()],
  includesRaw: "",
  excludesRaw: "",
  excursionsRaw: "",
  optionalRaw: "",
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function tripToForm(trip: AdminTrip): TripForm {
  const fullTrip = tripFromDb(trip);
  return {
    destination: fullTrip.destination,
    country: fullTrip.country,
    flag: fullTrip.flag,
    tagline: fullTrip.tagline,
    description: fullTrip.description,
    airline: fullTrip.airline,
    duration: fullTrip.duration,
    basePrice: String(fullTrip.basePrice),
    galleryImages: fullTrip.galleryImages.length ? fullTrip.galleryImages : fullTrip.heroImage ? [fullTrip.heroImage] : [],
    departures: fullTrip.departures.length ? fullTrip.departures : [newDeparture()],
    hotels: fullTrip.hotels.length
      ? fullTrip.hotels.map((hotel) => {
          const prices = emptyPrices();
          (Object.keys(prices) as HotelPriceKey[]).forEach((key) => {
            const price = hotel.prices?.[key];
            prices[key] = { enabled: Boolean(price), value: price ? String(price) : "" };
          });
          return {
            id: crypto.randomUUID(),
            name: hotel.name,
            stars: String(hotel.stars ?? 5),
            image: hotel.image ?? "",
            prices,
          };
        })
      : [newHotel()],
    includesRaw: fullTrip.includes.join("\n"),
    excludesRaw: fullTrip.excludes.join("\n"),
    excursionsRaw: fullTrip.excursions.join("\n"),
    optionalRaw: fullTrip.optionalActivities.join("\n"),
  };
}

async function uploadFiles(files: FileList | null, folder: string) {
  if (!files?.length) return [];
  const urls: string[] = [];
  for (const file of Array.from(files)) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("trip-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("trip-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export default function AdminVoyages() {
  const { profile } = useAuth();
  const [trips, setTrips] = useState<AdminTrip[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTrip | null>(null);
  const [form, setForm] = useState<TripForm>(empty);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof TripForm, v: string | string[] | DepartureForm[] | HotelForm[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const load = () =>
    supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setTrips((data as AdminTrip[]) ?? []));

  useEffect(() => {
    if (profile?.role === "admin") load();
  }, [profile?.role]);

  if (profile?.role !== "admin") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-blue-950">Accès réservé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seul un administrateur peut gérer les voyages.
        </p>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...empty,
      departures: [newDeparture()],
      hotels: [newHotel()],
      galleryImages: [],
    });
    setOpen(true);
  };

  const openEdit = (trip: AdminTrip) => {
    setEditing(trip);
    setForm(tripToForm(trip));
    setOpen(true);
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    try {
      const urls = await uploadFiles(files, "voyages");
      set("galleryImages", [...form.galleryImages, ...urls]);
      if (urls.length) toast.success("Photo ajoutée.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload impossible.");
    }
  };

  const handleHotelImageUpload = async (hotelId: string, files: FileList | null) => {
    try {
      const [url] = await uploadFiles(files, "hotels");
      if (!url) return;
      set(
        "hotels",
        form.hotels.map((hotel) => (hotel.id === hotelId ? { ...hotel, image: url } : hotel)),
      );
      toast.success("Photo hôtel ajoutée.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload impossible.");
    }
  };

  const handleSave = async () => {
    if (!form.tagline || !form.destination) {
      toast.error("Titre et destination sont obligatoires.");
      return;
    }
    if (!form.galleryImages.length) {
      toast.error("Ajoutez au moins une photo du voyage.");
      return;
    }

    const hotels = form.hotels
      .filter((hotel) => hotel.name.trim())
      .map((hotel) => {
        const prices: Record<string, number> = {};
        (Object.keys(hotel.prices) as HotelPriceKey[]).forEach((key) => {
          const item = hotel.prices[key];
          if (item.enabled && Number(item.value) > 0) prices[key] = Number(item.value);
        });
        return {
          name: hotel.name,
          stars: Number(hotel.stars) || 0,
          image: hotel.image,
          prices,
        };
      });

    const departures = form.departures
      .filter((dep) => dep.from || dep.to)
      .map((dep, index) => ({ id: String(index + 1), from: dep.from, to: dep.to }));

    setSaving(true);
    try {
      const payload = {
        slug: editing?.slug ?? slugify(form.tagline || form.destination),
        destination: form.destination,
        country: form.country,
        flag: form.flag,
        tagline: form.tagline,
        description: form.description,
        hero_image: form.galleryImages[0],
        gallery_images: form.galleryImages,
        airline: form.airline,
        duration: form.duration,
        base_price: Number(form.basePrice) || 0,
        departures,
        hotels,
        includes: form.includesRaw.split("\n").map((v) => v.trim()).filter(Boolean),
        excludes: form.excludesRaw.split("\n").map((v) => v.trim()).filter(Boolean),
        excursions: form.excursionsRaw.split("\n").map((v) => v.trim()).filter(Boolean),
        optional_activities: form.optionalRaw.split("\n").map((v) => v.trim()).filter(Boolean),
        active: true,
      };

      const request = editing
        ? supabase.from("trips").update(payload).eq("id", editing.id)
        : supabase.from("trips").insert(payload);
      const { error } = await request;
      if (error) throw error;
      toast.success(editing ? "Voyage modifié." : "Voyage créé avec succès !");
      setOpen(false);
      setEditing(null);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.");
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
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Gestion des voyages</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ajoutez, modifiez ou supprimez des voyages.</p>
        </div>
        <Button onClick={openCreate} className="border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau voyage
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-left text-blue-900">
                <th className="px-5 py-3 font-semibold">Voyage</th>
                <th className="px-5 py-3 font-semibold">Destination</th>
                <th className="px-5 py-3 font-semibold">Compagnie</th>
                <th className="px-5 py-3 font-semibold">Prix de base</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {!trips ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Chargement...</td></tr>
              ) : trips.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucun voyage. Cliquez sur Nouveau voyage pour commencer.</td></tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip.id} className="transition-colors hover:bg-blue-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{trip.flag}</span>
                        <div>
                          <div className="font-semibold text-blue-950">{trip.tagline}</div>
                          <div className="text-xs text-muted-foreground">{trip.duration}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-blue-900">{trip.destination}, {trip.country}</td>
                    <td className="px-5 py-4 font-medium text-blue-700">{trip.airline}</td>
                    <td className="px-5 py-4 font-bold text-blue-700">{Number(trip.base_price).toLocaleString("fr-DZ")} DA</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(trip)} className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(trip.id, trip.tagline)} className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              {editing ? "Modifier le voyage" : "Nouveau voyage"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-8">
            <Section title="Photos du voyage">
              <FilePicker label="Ajouter des photos depuis PC ou téléphone" multiple onChange={handleGalleryUpload} />
              {form.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {form.galleryImages.map((url, index) => (
                    <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-xl border border-blue-100">
                      <img src={url} alt="" className="h-28 w-full object-cover" />
                      <button
                        onClick={() => set("galleryImages", form.galleryImages.filter((_, i) => i !== index))}
                        className="absolute right-2 top-2 rounded-lg bg-white/90 p-1 text-red-500 opacity-0 shadow transition group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">Principale</span>}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Hôtels">
              <div className="space-y-5">
                {form.hotels.map((hotel, hotelIndex) => (
                  <div key={hotel.id} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold text-blue-950">Hôtel {hotelIndex + 1}</h3>
                      {form.hotels.length > 1 && (
                        <button onClick={() => set("hotels", form.hotels.filter((h) => h.id !== hotel.id))} className="text-sm font-semibold text-red-500">
                          Supprimer
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Field label="Nom de l'hôtel">
                        <Input value={hotel.name} onChange={(e) => updateHotel(hotel.id, { name: e.target.value })} placeholder="Hotel History" />
                      </Field>
                      <Field label="Nombre d'étoiles">
                        <Input value={hotel.stars} onChange={(e) => updateHotel(hotel.id, { stars: e.target.value })} type="number" min={1} max={5} placeholder="5" />
                      </Field>
                      <Field label="Photo de l'hôtel">
                        <FilePicker label={hotel.image ? "Remplacer la photo" : "Ajouter une photo"} onChange={(files) => handleHotelImageUpload(hotel.id, files)} />
                      </Field>
                    </div>
                    {hotel.image && <img src={hotel.image} alt="" className="mt-4 h-32 w-full rounded-xl object-cover md:w-72" />}
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {(Object.keys(priceLabels) as HotelPriceKey[]).map((key) => (
                        <label key={key} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-3">
                          <input
                            type="checkbox"
                            checked={hotel.prices[key].enabled}
                            onChange={(e) => updateHotelPrice(hotel.id, key, { enabled: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <span className="min-w-0 flex-1 text-sm font-medium text-blue-950">{priceLabels[key]}</span>
                          <Input
                            value={hotel.prices[key].value}
                            disabled={!hotel.prices[key].enabled}
                            onChange={(e) => updateHotelPrice(hotel.id, key, { value: e.target.value })}
                            type="number"
                            placeholder="DA"
                            className="h-9 w-28"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" onClick={() => set("hotels", [...form.hotels, newHotel()])}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un hôtel
              </Button>
            </Section>

            <Section title="Informations du voyage">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Titre du voyage *"><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Prestige Istanbul 2026" /></Field>
                <Field label="Destination *"><Input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Istanbul" /></Field>
                <Field label="Pays"><Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Turquie" /></Field>
                <Field label="Drapeau / code"><Input value={form.flag} onChange={(e) => set("flag", e.target.value)} placeholder="TR" /></Field>
                <Field label="Compagnie aérienne"><Input value={form.airline} onChange={(e) => set("airline", e.target.value)} placeholder="Turkish Airlines" /></Field>
                <Field label="Durée"><Input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="7 jours / 6 nuits" /></Field>
                <Field label="Prix de base (DA)"><Input value={form.basePrice} onChange={(e) => set("basePrice", e.target.value)} type="number" placeholder="119000" /></Field>
                <Field label="Slug automatique"><Input value={editing?.slug ?? slugify(form.tagline || form.destination)} disabled /></Field>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm font-medium text-blue-950">Description</Label>
                  <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="resize-none" />
                </div>
              </div>
            </Section>

            <Section title="Dates de départ">
              <div className="space-y-3">
                {form.departures.map((dep, index) => (
                  <div key={dep.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-blue-100 bg-white p-3 md:grid-cols-[1fr_1fr_auto]">
                    <Field label={`Date de départ ${index + 1}`}>
                      <Input type="date" value={dep.from} onChange={(e) => updateDeparture(dep.id, { from: e.target.value })} />
                    </Field>
                    <Field label="Date de retour / entrée">
                      <Input type="date" value={dep.to} onChange={(e) => updateDeparture(dep.id, { to: e.target.value })} />
                    </Field>
                    {form.departures.length > 1 && (
                      <Button variant="secondary" onClick={() => set("departures", form.departures.filter((d) => d.id !== dep.id))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="secondary" onClick={() => set("departures", [...form.departures, newDeparture()])}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un départ
              </Button>
            </Section>

            <Section title="Listes et excursions">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextBlock label="Ce qui est inclus (une ligne par item)" value={form.includesRaw} onChange={(value) => set("includesRaw", value)} />
                <TextBlock label="Excursions (une ligne par item)" value={form.excursionsRaw} onChange={(value) => set("excursionsRaw", value)} />
                <TextBlock label="Non inclus (une ligne par item)" value={form.excludesRaw} onChange={(value) => set("excludesRaw", value)} />
                <TextBlock label="Activités optionnelles (une ligne par item)" value={form.optionalRaw} onChange={(value) => set("optionalRaw", value)} />
              </div>
            </Section>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleSave} disabled={saving} className="flex-1 border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
              <Check className="mr-2 h-4 w-4" />
              {saving ? "Enregistrement..." : editing ? "Modifier le voyage" : "Créer le voyage"}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  function updateDeparture(id: string, patch: Partial<DepartureForm>) {
    set("departures", form.departures.map((dep) => (dep.id === id ? { ...dep, ...patch } : dep)));
  }

  function updateHotel(id: string, patch: Partial<HotelForm>) {
    set("hotels", form.hotels.map((hotel) => (hotel.id === id ? { ...hotel, ...patch } : hotel)));
  }

  function updateHotelPrice(id: string, key: HotelPriceKey, patch: Partial<HotelForm["prices"][HotelPriceKey]>) {
    set(
      "hotels",
      form.hotels.map((hotel) =>
        hotel.id === id
          ? {
              ...hotel,
              prices: {
                ...hotel.prices,
                [key]: { ...hotel.prices[key], ...patch },
              },
            }
          : hotel,
      ),
    );
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50/35 p-4">
      <h2 className="font-bold text-blue-950">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-blue-950">{label}</Label>
      {children}
    </div>
  );
}

function TextBlock({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-blue-950">{label}</Label>
      <Textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="resize-none" />
    </div>
  );
}

function FilePicker({
  label,
  multiple = false,
  onChange,
}: {
  label: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
      <ImagePlus className="h-4 w-4" />
      {label}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files);
          e.currentTarget.value = "";
        }}
      />
    </label>
  );
}
