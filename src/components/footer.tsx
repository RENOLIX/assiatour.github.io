import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { CONTACT } from "@/lib/travel-data.ts";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-sky-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/assiatour.github.io/assia-logo.png" alt="Assia Tours" className="h-20 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed text-blue-200">
              Votre agence de voyage de confiance depuis Alger. Voyages organisés, hébergements premium et excursions guidées.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Nos Voyages</h4>
            <ul className="space-y-2">
              {[
                { label: "Prestige Istanbul 2026", to: "/voyage/prestige-istanbul" },
                { label: "Caire & Sharm El-Sheikh", to: "/voyage/caire-sharm-el-sheikh" },
                { label: "Sharm El-Sheikh Direct", to: "/voyage/sharm-el-sheikh-direct" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="cursor-pointer text-sm text-blue-200 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-blue-200"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />{CONTACT.address}</li>
              <li className="flex items-center gap-2 text-sm text-blue-200"><Phone className="h-4 w-4 shrink-0 text-sky-400" />{CONTACT.tel}</li>
              <li className="flex items-center gap-2 text-sm text-blue-200"><Mail className="h-4 w-4 shrink-0 text-sky-400" />{CONTACT.email}</li>
              <li className="flex items-center gap-2 text-sm text-blue-200"><ExternalLink className="h-4 w-4 shrink-0 text-sky-400" />{CONTACT.facebook}</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Réservation</h4>
            <ul className="space-y-2">
              {CONTACT.mobiles.map((m) => (
                <li key={m}>
                  <a href={`tel:${m.replace(/\s/g, "")}`} className="flex cursor-pointer items-center gap-2 text-sm text-blue-200 transition-colors hover:text-white">
                    <Phone className="h-3 w-3 text-sky-400" />
                    {m}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-blue-800/60 pt-6 md:flex-row">
          <p className="text-sm text-blue-300">© {new Date().getFullYear()} Assia Tours - Tous droits réservés</p>
          <p className="text-xs text-blue-400">Agence agréée - Alger, Algérie</p>
        </div>
      </div>
    </footer>
  );
}
