import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Plane, Star, CheckCircle2, XCircle, Phone, ChevronLeft, CalendarDays, Users, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import ScrollReveal from "@/components/scroll-reveal.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { CONTACT } from "@/lib/travel-data.ts";
import { usePublicTrips } from "@/hooks/use-public-trips.ts";

function StarRating({ count }: { count: number }) {
  return <span className="flex items-center gap-0.5">{Array.from({ length: count }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</span>;
}

export default function TripPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const trips = usePublicTrips();
  const trip = trips.find((t) => t.slug === slug);
  if (!trip) {
    return <div className="flex min-h-screen flex-col items-center justify-center"><p className="mb-4 text-xl text-muted-foreground">Voyage introuvable</p><Button onClick={() => navigate("/")}>Retour à l'accueil</Button></div>;
  }

  const priceLabels: Record<string, string> = {
    double: "Chambre Double / Triple",
    triple: "Chambre Triple",
    single: "Supplément Single",
    infant: "Bébé (0-2 ans)",
    child1: "Enfant (2-6 ans)",
    child2: "Enfant (6-12 ans)",
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <section className="relative flex h-[70vh] min-h-[480px] items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${trip.heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <button onClick={() => navigate("/voyages")} className="mb-5 flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"><ChevronLeft className="h-4 w-4" />Retour aux voyages</button>
            <div className="mb-3 flex items-center gap-3"><span className="rounded bg-white px-2 py-1 text-sm font-bold text-blue-800">{trip.flag}</span><Badge className="border-white/25 bg-white/15 text-white">{trip.airline}</Badge><Badge className="border-sky-400/25 bg-sky-500/80 text-white">{trip.duration}</Badge></div>
            <h1 className="mb-3 text-balance text-4xl font-bold text-white md:text-6xl">{trip.tagline}</h1>
            <p className="max-w-2xl text-lg text-blue-100">{trip.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"><CalendarDays className="h-4 w-4 text-sky-300" />{trip.departures.length} départs disponibles</div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"><Plane className="h-4 w-4 text-sky-300" />Départ : Aéroport d'Alger</div>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center text-white sm:text-left"><span className="text-sm text-white/70">À partir de</span><div className="text-3xl font-bold">{trip.basePrice.toLocaleString("fr-DZ")} DA <span className="text-base font-normal text-sky-200">/ personne</span></div></div>
          <Button asChild className="border-0 bg-white font-semibold text-blue-700 hover:bg-blue-50"><Link to="/reservation"><Phone className="mr-2 h-4 w-4" />Réserver maintenant</Link></Button>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 md:px-8 lg:grid-cols-3">
        <div className="space-y-14 lg:col-span-2">
          <ScrollReveal><SectionTitle icon={CalendarDays} title="Dates de départ" /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{trip.departures.map((dep, i) => <InfoRow key={dep.id} index={i + 1} text={`${dep.from} → ${dep.to}`} sub={trip.duration} />)}</div></ScrollReveal>
          <ScrollReveal><SectionTitle icon={Sparkles} title="Galerie" /><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{trip.galleryImages.map((img, i) => <div key={img} className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}><img src={img} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" style={{ minHeight: i === 0 ? 240 : 110 }} /></div>)}</div></ScrollReveal>
          {trip.includes.length > 0 && <ListSection icon={CheckCircle2} title="L'offre comprend" items={trip.includes} tone="green" />}
          {trip.excludes.length > 0 && <ListSection icon={XCircle} title="Non inclus" items={trip.excludes} tone="red" />}
          {trip.excursions.length > 0 && <ListSection icon={MapPin} title="Excursions incluses" items={trip.excursions} tone="blue" ordered />}
          {trip.optionalActivities.length > 0 && <ListSection icon={Sparkles} title="Activités optionnelles" items={trip.optionalActivities} tone="sky" />}
        </div>
        <aside className="space-y-6">
          <ScrollReveal direction="right">
            <div className="sticky top-24">
              <SectionTitle icon={Users} title="Nos Hôtels" />
              <div className="space-y-5">{trip.hotels.map((hotel) => <div key={hotel.name} className="overflow-hidden rounded-2xl border border-blue-100/80 bg-white/80 shadow-lg shadow-blue-900/6"><div className="relative h-36 overflow-hidden"><img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent" /><div className="absolute bottom-3 left-3"><StarRating count={hotel.stars} /></div></div><div className="p-4"><h3 className="mb-3 font-bold text-blue-950">{hotel.name}</h3>{Object.entries(hotel.prices).map(([key, price]) => <div key={key} className="flex items-center justify-between text-sm"><span className="text-xs text-muted-foreground">{priceLabels[key]}</span><span className="font-semibold text-blue-700">{price?.toLocaleString("fr-DZ")} DA</span></div>)}</div></div>)}</div>
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white"><h4 className="mb-2 font-bold">Réserver ce voyage</h4><p className="mb-4 text-sm text-blue-100">Contactez-nous pour réserver et obtenir plus d'informations.</p><div className="space-y-2">{CONTACT.mobiles.slice(0, 3).map((m) => <a key={m} href={`tel:${m.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm transition-all hover:bg-white/25"><Phone className="h-3.5 w-3.5" />{m}</a>)}</div><Button asChild className="mt-4 w-full border-0 bg-white font-semibold text-blue-700 hover:bg-blue-50"><Link to="/contact">Nous contacter</Link></Button></div>
            </div>
          </ScrollReveal>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Plane; title: string }) {
  return <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-blue-950"><Icon className="h-6 w-6 text-blue-600" />{title}</h2>;
}

function InfoRow({ index, text, sub }: { index: number; text: string; sub: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{String(index).padStart(2, "0")}</div><div><div className="text-sm font-semibold text-blue-950">{text}</div><div className="text-xs text-muted-foreground">{sub}</div></div><CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-500" /></div>;
}

function ListSection({ icon: Icon, title, items, tone, ordered = false }: { icon: typeof Plane; title: string; items: string[]; tone: "green" | "red" | "blue" | "sky"; ordered?: boolean }) {
  const classes = { green: "bg-green-50/80 border-green-100 text-green-600", red: "bg-red-50/80 border-red-100 text-red-500", blue: "bg-blue-50/80 border-blue-100 text-blue-600", sky: "bg-sky-50/80 border-sky-100 text-sky-500" }[tone];
  return <ScrollReveal><SectionTitle icon={Icon} title={title} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{items.map((item, i) => <div key={item} className={`flex items-start gap-3 rounded-xl border p-3.5 ${classes}`}>{ordered ? <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{i + 1}</div> : <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />}<span className="text-sm text-blue-900">{item}</span></div>)}</div></ScrollReveal>;
}
