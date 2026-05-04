import { Star, Plane, Map, Clock, CheckCircle2, Umbrella, Shield, Users } from "lucide-react";

const items = [
  { icon: Star, label: "Hôtels 4★ et 5★" },
  { icon: Plane, label: "Vols Directs" },
  { icon: Map, label: "Visites Guidées" },
  { icon: Clock, label: "Assistance 24/7" },
  { icon: CheckCircle2, label: "Tout Inclus" },
  { icon: Umbrella, label: "All Inclusive" },
  { icon: Shield, label: "Agence Agréée" },
  { icon: Users, label: "Guides Experts" },
];

export default function Marquee() {
  const all = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-blue-100 bg-white py-3">
      <div className="flex w-max gap-0 animate-[marquee_28s_linear_infinite]">
        {all.map((item, i) => (
          <div key={i} className="flex select-none items-center gap-2 whitespace-nowrap px-8 text-blue-700">
            <item.icon className="h-4 w-4 shrink-0 text-sky-500" strokeWidth={2} />
            <span className="text-sm font-semibold tracking-wide">{item.label}</span>
            <span className="ml-8 text-lg font-light text-blue-200">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
