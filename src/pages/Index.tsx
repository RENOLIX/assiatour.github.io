import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plane, Star, Shield, Users, Clock, ArrowRight, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import ScrollReveal from "@/components/scroll-reveal.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import Marquee from "@/components/marquee.tsx";
import PhotoColumns from "@/components/photo-columns.tsx";
import { TRIPS, CONTACT } from "@/lib/travel-data.ts";

const whyUs = [
  { icon: Shield, title: "Agence Agréée", desc: "Agence de voyage officiellement agréée par les autorités algériennes." },
  { icon: Star, title: "Hôtels Premium", desc: "Sélection rigoureuse d'établissements 4★ et 5★ garantis." },
  { icon: Users, title: "Guides Experts", desc: "Accompagnement par des guides professionnels francophones." },
  { icon: Clock, title: "Disponibilité 24/7", desc: "Notre équipe reste à votre disposition pour toute question." },
];

export default function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pb-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1694963059334-032b961079a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/75 via-blue-900/55 to-sky-900/85" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-32 text-center md:pt-48">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Plane className="h-4 w-4 text-sky-300" /> Agence de voyage depuis Alger
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="mb-6 text-balance text-5xl font-bold leading-tight text-white md:text-7xl">
            Vivez des voyages<br /><span className="bg-gradient-to-r from-sky-300 to-blue-200 bg-clip-text text-transparent">d'exception</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.2 }} className="mx-auto mb-10 max-w-2xl text-balance text-lg text-blue-100 md:text-xl">
            Assia Tours vous emmène découvrir Istanbul, l'Égypte et Sharm El-Sheikh avec des formules tout compris, hôtels 5★ et guides professionnels.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.3 }} className="flex flex-col items-center gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="border-0 bg-white px-8 text-base font-semibold text-blue-900 shadow-2xl shadow-blue-900/40 hover:bg-blue-50">
                <Link to="/voyages">Voir nos voyages <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" className="border border-white/25 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20">
                <a href="tel:+213555398486"><Phone className="mr-2 h-5 w-5" /> Nous appeler</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Marquee />
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-14 text-center">
            <Badge className="mb-3 border-blue-200 bg-blue-100 text-blue-700">Nos destinations 2026</Badge>
            <h2 className="mb-4 text-4xl font-bold text-blue-950 md:text-5xl">Voyages organisés</h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">Des packages tout compris soigneusement préparés pour des souvenirs inoubliables.</p>
          </ScrollReveal>
          <TripGrid limit={3} />
        </div>
      </section>
      <PhotoColumns />
      <section className="bg-gradient-to-br from-blue-50 to-sky-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-14 text-center">
            <Badge className="mb-3 border-blue-200 bg-blue-100 text-blue-700">Pourquoi nous choisir</Badge>
            <h2 className="text-4xl font-bold text-blue-950">L'excellence à votre service</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/90 bg-white/70 p-6 text-center shadow-lg shadow-blue-900/6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 font-bold text-blue-950">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl p-10 text-center text-white shadow-2xl shadow-blue-700/40 md:p-14">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1559414059-34fe0a59e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200)" }} />
              <div className="absolute inset-0 bg-blue-900/45" />
              <div className="relative z-10">
                <h2 className="mb-3 text-3xl font-bold md:text-4xl">Prêt à voyager ?</h2>
                <p className="mx-auto mb-8 max-w-lg text-lg text-blue-100">Contactez-nous dès maintenant pour réserver votre place. Places limitées.</p>
                <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
                  {CONTACT.mobiles.slice(0, 3).map((m) => (
                    <a key={m} href={`tel:${m.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/25">
                      <Phone className="h-4 w-4" />{m}
                    </a>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-100"><CheckCircle2 className="h-4 w-4 text-sky-300" /><MapPin className="h-3.5 w-3.5" />{CONTACT.address}</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export function TripGrid({ limit }: { limit?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {TRIPS.slice(0, limit ?? TRIPS.length).map((trip, i) => (
        <ScrollReveal key={trip.id} delay={i * 0.1}>
          <Link to={`/voyage/${trip.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-3xl border border-blue-100/80 bg-white/80 shadow-xl shadow-blue-900/8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <img src={trip.heroImage} alt={trip.destination} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2"><span className="rounded bg-white/90 px-2 py-1 text-xs font-bold text-blue-800">{trip.flag}</span><span className="text-sm font-semibold text-white">{trip.country}</span></div>
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-700">{trip.airline}</div>
              </div>
              <div className="p-5">
                <h3 className="mb-1 line-clamp-1 text-lg font-bold text-blue-950">{trip.tagline}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{trip.description}</p>
                <div className="flex items-center justify-between">
                  <div><span className="text-xs text-muted-foreground">À partir de</span><div className="text-2xl font-bold text-blue-700">{trip.basePrice.toLocaleString("fr-DZ")} <span className="text-sm">DA</span></div></div>
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5"><Clock className="h-3.5 w-3.5 text-blue-600" /><span className="text-xs font-medium text-blue-700">{trip.duration}</span></div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-blue-50 pt-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{trip.departures.length} départs disponibles</div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-blue-600">Voir détails <ArrowRight className="h-4 w-4" /></span>
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
