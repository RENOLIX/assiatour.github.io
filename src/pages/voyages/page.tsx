import { motion } from "motion/react";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { TripGrid } from "@/pages/Index.tsx";
import { usePublicTrips } from "@/hooks/use-public-trips.ts";

export default function VoyagesPage() {
  const trips = usePublicTrips();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-36 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/assiatour.github.io/voyages-pool-hero.webp)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center [text-shadow:0_2px_18px_rgba(255,255,255,0.95),0_1px_3px_rgba(255,255,255,0.85)]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 border-white/25 bg-white/15 text-white">Saison 2026</Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Nos Voyages Organisés</h1>
            <p className="text-lg text-blue-100">Découvrez toutes nos destinations avec des formules tout compris, hôtels premium et guides professionnels.</p>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex items-center justify-between">
          <p className="text-muted-foreground"><span className="font-semibold text-blue-950">{trips.length}</span> voyages disponibles</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Filter className="h-4 w-4" />Tous les voyages</div>
        </div>
        <TripGrid trips={trips} />
      </section>
      <Footer />
    </div>
  );
}
