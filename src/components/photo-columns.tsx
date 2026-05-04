import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { DEFAULT_GALLERY_LINE_1, DEFAULT_GALLERY_LINE_2 } from "@/lib/gallery-photos.ts";
import { supabase } from "@/lib/supabase.ts";

const IMG_HEIGHT = 260;
const GAP = 10;
const ITEM_HEIGHT = IMG_HEIGHT + GAP;

function ScrollColumn({
  photos,
  direction,
  speed = 0.4,
}: {
  photos: string[];
  direction: "down" | "up";
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef<number>(0);
  const singleSetPx = photos.length * ITEM_HEIGHT;

  useEffect(() => {
    posRef.current = direction === "up" ? -singleSetPx : 0;
  }, [direction, singleSetPx]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const animate = () => {
      if (direction === "down") {
        posRef.current += speed;
        if (posRef.current >= singleSetPx) posRef.current = 0;
      } else {
        posRef.current -= speed;
        if (posRef.current <= -singleSetPx * 2) posRef.current = -singleSetPx;
      }
      el.style.transform = `translateY(${posRef.current}px)`;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [direction, speed, singleSetPx]);

  const repeated = [...photos, ...photos, ...photos];
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-20 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-20 bg-gradient-to-t from-white to-transparent" />
      <div ref={trackRef} className="flex flex-col will-change-transform" style={{ gap: `${GAP}px` }}>
        {repeated.map((src, i) => (
          <div key={i} className="flex-shrink-0 overflow-hidden rounded-xl shadow-md shadow-blue-900/10" style={{ height: `${IMG_HEIGHT}px`, minHeight: `${IMG_HEIGHT}px` }}>
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoColumns() {
  const [line1, setLine1] = useState(DEFAULT_GALLERY_LINE_1);
  const [line2, setLine2] = useState(DEFAULT_GALLERY_LINE_2);

  useEffect(() => {
    supabase
      .from("gallery_block_photos")
      .select("line,image_url,position")
      .order("position", { ascending: true })
      .then(({ data }) => {
        const nextLine1 = data?.filter((item) => item.line === "line1").map((item) => item.image_url).filter(Boolean) ?? [];
        const nextLine2 = data?.filter((item) => item.line === "line2").map((item) => item.image_url).filter(Boolean) ?? [];
        if (nextLine1.length) setLine1(nextLine1);
        if (nextLine2.length) setLine2(nextLine2);
      });
  }, []);

  return (
    <section className="overflow-hidden px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="order-1 flex-1 text-center md:text-left">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-sky-500">Depuis Alger · Vers le Monde</span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-blue-950 md:text-5xl lg:text-6xl">
              Explorez le Monde <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">avec Assia Tours</span>
            </h2>
            <p className="mx-auto mb-8 max-w-md text-lg leading-relaxed text-muted-foreground md:mx-0">
              Istanbul, l'Égypte, Sharm El-Sheikh. Laissez-vous guider par nos experts et vivez des expériences uniques.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Button asChild size="lg" className="cursor-pointer bg-blue-600 px-8 font-semibold text-white hover:bg-blue-700">
                <Link to="/voyages">Voir nos voyages <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="cursor-pointer font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                <Link to="/a-propos">En savoir plus</Link>
              </Button>
            </div>
          </motion.div>
          <div className="order-2 flex flex-shrink-0 gap-3" style={{ height: "480px", width: "260px" }}>
            <ScrollColumn photos={line1} direction="down" speed={0.4} />
            <ScrollColumn photos={line2} direction="up" speed={0.4} />
          </div>
        </div>
      </div>
    </section>
  );
}
