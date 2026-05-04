import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Plane, Phone } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Accueil", to: "/" },
    { label: "Nos Voyages", to: "/voyages" },
    { label: "À Propos", to: "/a-propos" },
    { label: "Réservation", to: "/reservation" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-blue-100/60 bg-white/85 shadow-lg shadow-blue-900/10 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <Link to="/" className="flex cursor-pointer items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 shadow-lg shadow-blue-500/30">
            <Plane className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="text-lg font-bold tracking-tight text-blue-900">ASSIA</span>
            <span className="text-lg font-bold tracking-tight text-sky-500"> TOURS</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                pathname === l.to
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : scrolled
                    ? "text-blue-900 hover:bg-blue-50"
                    : "text-white/90 hover:bg-white/15"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+213555398486" className={`flex cursor-pointer items-center gap-2 text-sm font-semibold ${scrolled ? "text-blue-700" : "text-white"}`}>
            <Phone className="h-4 w-4" />
            <span>0555 39 84 86</span>
          </a>
          <Button asChild size="sm" className="border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-sky-600">
            <Link to="/reservation">Réserver</Link>
          </Button>
        </div>

        <button className={`cursor-pointer rounded-lg p-2 md:hidden ${scrolled ? "text-blue-900" : "text-white"}`} onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="border-t border-blue-100 bg-white/95 px-4 pb-4 backdrop-blur-xl md:hidden">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className={`mt-1 block cursor-pointer rounded-lg px-4 py-3 text-sm font-medium ${pathname === l.to ? "bg-blue-600 text-white" : "text-blue-900 hover:bg-blue-50"}`}>
                {l.label}
              </Link>
            ))}
            <a href="tel:+213555398486" className="mt-1 flex items-center gap-2 px-4 py-3 text-sm font-semibold text-blue-700">
              <Phone className="h-4 w-4" />
              0555 39 84 86
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
