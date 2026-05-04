import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, ExternalLink, MessageCircle } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { CONTACT } from "@/lib/travel-data.ts";

export default function ContactPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 px-4 pb-16 pt-32 text-white">
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 text-4xl font-bold md:text-5xl">Contactez-nous</motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-lg text-blue-100">Notre équipe est disponible pour répondre à toutes vos questions.</motion.p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ContactCard icon={MapPin} title="Adresse"><p className="text-muted-foreground">{CONTACT.address}</p><div className="mt-6 border-t border-blue-50 pt-6"><div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-blue-500" />Horaires d'ouverture</div><p className="text-sm font-medium text-blue-950">Dimanche - Jeudi : 9h - 18h</p><p className="text-sm font-medium text-blue-950">Samedi : 9h - 14h</p></div></ContactCard>
          <ContactCard icon={Phone} title="Téléphones"><div className="space-y-2"><a href={`tel:${CONTACT.tel.replace(/\s/g, "")}`} className="flex items-center gap-2 font-medium text-blue-700 hover:text-blue-900"><Phone className="h-4 w-4" />{CONTACT.tel} (fixe)</a>{CONTACT.mobiles.map((m) => <a key={m} href={`tel:${m.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900"><MessageCircle className="h-4 w-4 text-sky-500" />{m}</a>)}</div></ContactCard>
          <ContactCard icon={Mail} title="Email"><a href={`mailto:${CONTACT.email}`} className="font-medium text-blue-700 hover:text-blue-900">{CONTACT.email}</a></ContactCard>
          <ScrollReveal direction="right"><div className="rounded-3xl bg-gradient-to-br from-blue-700 to-sky-500 p-8 text-white shadow-xl shadow-blue-700/30"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20"><ExternalLink className="h-6 w-6 text-white" /></div><h3 className="mb-2 text-xl font-bold">Facebook</h3><p className="mb-4 text-sm text-blue-100">Suivez-nous sur Facebook pour les dernières offres.</p><span className="rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold">{CONTACT.facebook}</span></div></ScrollReveal>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function ContactCard({ icon: Icon, title, children }: { icon: typeof Phone; title: string; children: React.ReactNode }) {
  return <ScrollReveal><div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-900/6"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30"><Icon className="h-6 w-6 text-white" /></div><h3 className="mb-4 text-xl font-bold text-blue-950">{title}</h3>{children}</div></ScrollReveal>;
}
