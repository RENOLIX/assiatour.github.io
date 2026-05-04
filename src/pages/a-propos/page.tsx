import { motion } from "motion/react";
import { Shield, Star, Users, MapPin, Phone, Award, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import ScrollReveal from "@/components/scroll-reveal.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { CONTACT } from "@/lib/travel-data.ts";

const values = [
  { icon: Shield, title: "Fiabilité", desc: "Agence agréée et reconnue, nous garantissons des voyages organisés en toute sécurité." },
  { icon: Star, title: "Excellence", desc: "Sélection rigoureuse des hôtels 4★ et 5★ pour vous offrir un hébergement premium." },
  { icon: Heart, title: "Passion", desc: "Une équipe passionnée de voyages qui met tout en oeuvre pour votre séjour." },
  { icon: Users, title: "Accompagnement", desc: "Guides professionnels francophones présents à chaque étape." },
];

const stats = [
  { value: "10+", label: "Années d'expérience" },
  { value: "5000+", label: "Clients satisfaits" },
  { value: "3", label: "Destinations exclusives" },
  { value: "100%", label: "Satisfaction garantie" },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 px-4 pb-20 pt-36 text-white">
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 border-white/25 bg-white/15 text-white">Notre histoire</Badge>
            <h1 className="mb-5 text-4xl font-bold md:text-5xl">À Propos d'Assia Tours</h1>
            <p className="text-lg leading-relaxed text-blue-100">Depuis plus de 10 ans, Assia Tours accompagne les familles algériennes dans la réalisation de leurs rêves de voyage.</p>
          </motion.div>
        </div>
      </section>
      <section className="border-b border-blue-50 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
          {stats.map((s, i) => <ScrollReveal key={s.label} delay={i * 0.1}><div className="text-center"><div className="text-4xl font-bold text-blue-700">{s.value}</div><div className="mt-1 text-sm text-muted-foreground">{s.label}</div></div></ScrollReveal>)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">
          <ScrollReveal direction="left"><div className="space-y-5"><Badge className="border-blue-200 bg-blue-100 text-blue-700">Notre mission</Badge><h2 className="text-3xl font-bold text-blue-950">Rendre le voyage accessible à tous les Algériens</h2><p className="leading-relaxed text-muted-foreground">Fondée avec la passion du voyage, Assia Tours est née de la volonté d'offrir aux familles algériennes des expériences premium à des tarifs accessibles.</p><p className="leading-relaxed text-muted-foreground">Notre agence, située au coeur d'Alger, travaille avec Turkish Airlines, Egyptair, Air Algérie et des hôtels prestigieux.</p><div className="flex items-center gap-2 font-medium text-blue-700"><Award className="h-5 w-5 text-sky-500" />Agence agréée - Alger</div></div></ScrollReveal>
          <ScrollReveal direction="right"><div className="relative"><img src="https://images.unsplash.com/photo-1694963059334-032b961079a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700" alt="Istanbul" className="h-80 w-full rounded-3xl object-cover shadow-2xl shadow-blue-900/20" /><div className="absolute -bottom-6 -left-4 rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-xl backdrop-blur-sm md:-left-6"><div className="text-2xl font-bold text-blue-700">10+</div><div className="text-sm text-muted-foreground">Années d'expertise</div></div></div></ScrollReveal>
        </div>
      </section>
      <section className="bg-gradient-to-br from-blue-50 to-sky-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-14 text-center"><Badge className="mb-3 border-blue-200 bg-blue-100 text-blue-700">Nos valeurs</Badge><h2 className="text-3xl font-bold text-blue-950">Ce qui nous définit</h2></ScrollReveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{values.map((v, i) => <ScrollReveal key={v.title} delay={i * 0.1}><div className="rounded-2xl border border-white bg-white/80 p-6 shadow-lg shadow-blue-900/6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30"><v.icon className="h-5 w-5 text-white" /></div><h3 className="mb-2 font-bold text-blue-950">{v.title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p></div></ScrollReveal>)}</div>
        </div>
      </section>
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-blue-700 to-sky-500 p-10 text-center text-white shadow-2xl shadow-blue-700/30">
          <h2 className="mb-3 text-2xl font-bold">Vous avez des questions ?</h2>
          <p className="mb-6 text-blue-100">Notre équipe est disponible pour vous conseiller.</p>
          <div className="flex flex-wrap justify-center gap-3">{CONTACT.mobiles.slice(0, 3).map((m) => <a key={m} href={`tel:${m.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold transition-all hover:bg-white/25"><Phone className="h-4 w-4" />{m}</a>)}</div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-100"><MapPin className="h-4 w-4" />{CONTACT.address}</div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
