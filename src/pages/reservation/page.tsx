import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { useState } from "react";
import { Plane, User, Phone, Mail, MapPin, CreditCard, Calendar, Users, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { toast } from "sonner";
import ScrollReveal from "@/components/scroll-reveal.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { usePublicTrips } from "@/hooks/use-public-trips.ts";
import { supabase } from "@/lib/supabase.ts";

const schema = z.object({
  tripSlug: z.string().min(1, "Choisissez un voyage"),
  departureFrom: z.string().min(1, "Choisissez une date de départ"),
  hotelName: z.string().min(1, "Choisissez un hôtel"),
  roomType: z.string().min(1, "Choisissez un type de chambre"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(9, "Téléphone requis"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  passportNumber: z.string().min(5, "Numéro de passeport requis"),
  passportExpiry: z.string().min(1, "Date d'expiration requise"),
  nationality: z.string().min(2, "Nationalité requise"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  passengerCount: z.coerce.number().min(1).max(20),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
const roomTypes = ["Chambre Double", "Chambre Triple", "Supplément Single"];

export default function ReservationPage() {
  const [done, setDone] = useState(false);
  const trips = usePublicTrips();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { passengerCount: 1, nationality: "Algérienne", tripSlug: "", departureFrom: "", hotelName: "", roomType: "" },
  });
  const selectedTrip = trips.find((t) => t.slug === watch("tripSlug"));

  const onSubmit = async (data: FormValues) => {
    try {
      const trip = trips.find((t) => t.slug === data.tripSlug);
      if (!trip) return;
      const dep = trip.departures.find((d) => d.from === data.departureFrom);
      const { error } = await supabase.from("reservations").insert({
        trip_slug: data.tripSlug,
        trip_name: trip.tagline,
        departure_from: data.departureFrom,
        departure_to: dep?.to ?? "",
        hotel_name: data.hotelName,
        room_type: data.roomType,
        passenger_count: data.passengerCount,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        passport_number: data.passportNumber,
        passport_expiry: data.passportExpiry,
        nationality: data.nationality,
        birth_date: data.birthDate,
        notes: data.notes ?? "",
        status: "pending",
      });
      if (error) throw error;
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg rounded-3xl border border-blue-100 bg-white p-12 text-center shadow-2xl shadow-blue-900/10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><CheckCircle2 className="h-9 w-9 text-green-600" /></div>
            <h2 className="mb-3 text-2xl font-bold text-blue-950">Réservation envoyée !</h2>
            <p className="mb-6 text-muted-foreground">Votre demande a bien été reçue. Notre équipe vous contactera rapidement pour confirmer votre voyage.</p>
            <Button onClick={() => setDone(false)} className="border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">Nouvelle réservation</Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 px-4 pb-16 pt-36 text-white">
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 border-white/25 bg-white/15 text-white">Formulaire officiel</Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Réservez votre voyage</h1>
            <p className="text-lg text-blue-100">Remplissez le formulaire ci-dessous et notre équipe vous contactera.</p>
          </motion.div>
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-4 py-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <Panel icon={Plane} title="Informations du voyage">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Destination *" error={errors.tripSlug?.message} wide>
                <Select onValueChange={(v) => { setValue("tripSlug", v, { shouldValidate: true }); setValue("departureFrom", ""); setValue("hotelName", ""); }}>
                  <SelectTrigger className={errors.tripSlug ? "border-red-400" : ""}><SelectValue placeholder="Choisissez un voyage" /></SelectTrigger>
                  <SelectContent>{trips.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.flag} {t.tagline}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Date de départ *" error={errors.departureFrom?.message}>
                <Select disabled={!selectedTrip} onValueChange={(v) => setValue("departureFrom", v, { shouldValidate: true })}>
                  <SelectTrigger className={errors.departureFrom ? "border-red-400" : ""}><SelectValue placeholder={selectedTrip ? "Choisissez une date" : "Choisissez d'abord un voyage"} /></SelectTrigger>
                  <SelectContent>{selectedTrip?.departures.map((d) => <SelectItem key={d.id} value={d.from}>{d.from} → {d.to}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Hôtel *" error={errors.hotelName?.message}>
                <Select disabled={!selectedTrip} onValueChange={(v) => setValue("hotelName", v, { shouldValidate: true })}>
                  <SelectTrigger className={errors.hotelName ? "border-red-400" : ""}><SelectValue placeholder="Choisissez un hôtel" /></SelectTrigger>
                  <SelectContent>{selectedTrip?.hotels.map((h) => <SelectItem key={h.name} value={h.name}>{h.stars}★ {h.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Type de chambre *" error={errors.roomType?.message}><Select onValueChange={(v) => setValue("roomType", v, { shouldValidate: true })}><SelectTrigger className={errors.roomType ? "border-red-400" : ""}><SelectValue placeholder="Choisissez" /></SelectTrigger><SelectContent>{roomTypes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></Field>
              <Field label="Nombre de passagers *" error={errors.passengerCount?.message as string}><Input type="number" min={1} max={20} {...register("passengerCount")} /></Field>
            </div>
          </Panel>
          <Panel icon={User} title="Informations personnelles"><InputGrid fields={[["firstName", "Prénom *", "Mohamed"], ["lastName", "Nom *", "Benali"], ["birthDate", "Date de naissance *", "", "date"], ["nationality", "Nationalité *", "Algérienne"]]} register={register} errors={errors} /></Panel>
          <Panel icon={CreditCard} title="Passeport"><InputGrid fields={[["passportNumber", "Numéro de passeport *", "AB1234567"], ["passportExpiry", "Date d'expiration *", "", "date"]]} register={register} errors={errors} /></Panel>
          <Panel icon={Mail} title="Coordonnées"><InputGrid fields={[["email", "Email *", "email@exemple.com", "email"], ["phone", "Téléphone *", "0555 00 00 00", "tel"], ["address", "Adresse *", "Rue de la Paix, N°12"], ["city", "Ville *", "Alger"]]} register={register} errors={errors} /></Panel>
          <Panel icon={MessageSquare} title="Remarques / Demandes spéciales"><Textarea placeholder="Ex : chambre non-fumeur, étage élevé, repas végétarien..." rows={4} {...register("notes")} className="resize-none" /></Panel>
          <ScrollReveal><div className="flex flex-col items-center gap-3"><Button type="submit" disabled={isSubmitting} size="lg" className="border-0 bg-gradient-to-r from-blue-600 to-sky-500 px-12 text-base font-semibold text-white shadow-xl shadow-blue-500/30">{isSubmitting ? "Envoi en cours..." : <><CheckCircle2 className="mr-2 h-5 w-5" />Envoyer ma réservation</>}</Button><p className="max-w-sm text-center text-xs text-muted-foreground">En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.</p></div></ScrollReveal>
        </form>
      </div>
      <Footer />
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: typeof Plane; title: string; children: React.ReactNode }) {
  return <ScrollReveal><div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-lg shadow-blue-900/6"><h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-blue-950"><Icon className="h-5 w-5 text-blue-600" />{title}</h2>{children}</div></ScrollReveal>;
}

function Field({ label, error, children, wide = false }: { label: string; error?: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={`space-y-1.5 ${wide ? "md:col-span-2" : ""}`}><Label className="font-medium text-blue-950">{label}</Label>{children}{error && <p className="text-xs text-red-500">{error}</p>}</div>;
}

function InputGrid({ fields, register, errors }: { fields: [keyof FormValues, string, string, string?][]; register: ReturnType<typeof useForm<FormValues>>["register"]; errors: ReturnType<typeof useForm<FormValues>>["formState"]["errors"] }) {
  return <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{fields.map(([name, label, placeholder, type]) => <Field key={name} label={label} error={errors[name]?.message as string}><Input type={type ?? "text"} placeholder={placeholder} {...register(name)} className={errors[name] ? "border-red-400" : ""} /></Field>)}</div>;
}
