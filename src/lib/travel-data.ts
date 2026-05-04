export type Hotel = {
  name: string;
  stars: number;
  image: string;
  prices: {
    double?: number;
    triple?: number;
    single?: number;
    infant?: number;
    child1?: number;
    child2?: number;
  };
};

export type Departure = {
  id: string;
  from: string;
  to: string;
};

export type Trip = {
  id: string;
  slug: string;
  destination: string;
  country: string;
  flag: string;
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  airline: string;
  airlineLogo: string;
  duration: string;
  basePrice: number;
  currency: string;
  departures: Departure[];
  hotels: Hotel[];
  includes: string[];
  excludes: string[];
  excursions: string[];
  optionalActivities: string[];
};

export const TRIPS: Trip[] = [
  {
    id: "istanbul-2026",
    slug: "prestige-istanbul",
    destination: "Istanbul",
    country: "Turquie",
    flag: "TR",
    tagline: "Prestige Istanbul 2026",
    description:
      "Découvrez la magie d'Istanbul, ville des sultans et des minarets, où l'Orient rencontre l'Occident. Un voyage inoubliable à bord de Turkish Airlines.",
    heroImage:
      "https://images.unsplash.com/photo-1694963059334-032b961079a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    galleryImages: [
      "https://images.unsplash.com/photo-1641284357918-ac72db6b7574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1714903229316-7ed7e3764a34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1766720061041-176265a87732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1559414059-34fe0a59e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    airline: "Turkish Airlines",
    airlineLogo: "✈",
    duration: "7 jours / 6 nuits",
    basePrice: 119000,
    currency: "DA",
    departures: [
      { id: "1", from: "01/06/2026", to: "07/06/2026" },
      { id: "2", from: "08/06/2026", to: "14/06/2026" },
      { id: "3", from: "15/06/2026", to: "21/06/2026" },
      { id: "4", from: "22/06/2026", to: "28/06/2026" },
      { id: "5", from: "29/06/2026", to: "05/07/2026" },
    ],
    hotels: [
      {
        name: "Hotel History",
        stars: 4,
        image:
          "https://images.unsplash.com/photo-1666601479400-4033a9c5eab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
        prices: { double: 119000, triple: 119000, single: 155900, infant: 30000, child1: 59900, child2: 70900 },
      },
      {
        name: "Hotel Oran",
        stars: 4,
        image:
          "https://images.unsplash.com/photo-1648401443998-7c49da9481db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
        prices: { double: 139000, triple: 139000, single: 189000, infant: 30000, child1: 69900, child2: 89900 },
      },
    ],
    includes: [
      "Billet d'avion Turkish Airlines aller-retour",
      "Hébergement 7 jours / 6 nuits",
      "Transfert Aéroport - Hôtel - Aéroport",
      "4 jours d'excursion guidée",
      "Accompagnement professionnel",
    ],
    excludes: [],
    excursions: ["Visite guidée de la Mosquée Bleue", "Sainte-Sophie et le Grand Bazar", "Croisière sur le Bosphore", "Palais de Topkapi"],
    optionalActivities: [],
  },
  {
    id: "caire-sharm-2026",
    slug: "caire-sharm-el-sheikh",
    destination: "Le Caire & Sharm El-Sheikh",
    country: "Égypte",
    flag: "EG",
    tagline: "Combiné Caire & Sharm El-Sheikh",
    description:
      "Un fabuleux combiné Caire / Sharm El Sheikh: explorez les pyramides de Gizeh puis détendez-vous sur les rivages cristallins de la Mer Rouge.",
    heroImage:
      "https://images.unsplash.com/photo-1678038592672-e63442537f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    galleryImages: [
      "https://images.unsplash.com/photo-1678038592492-d73c063bb9e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1747336755296-a9e715350b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1561531526-68a24a396f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1771987428767-a4514ab87567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    airline: "Egyptair",
    airlineLogo: "✈",
    duration: "10 jours / 9 nuits",
    basePrice: 288000,
    currency: "DA",
    departures: [
      { id: "1", from: "27/07/2026", to: "05/08/2026" },
      { id: "2", from: "29/07/2026", to: "07/08/2026" },
      { id: "3", from: "30/07/2026", to: "08/08/2026" },
      { id: "4", from: "19/08/2026", to: "28/08/2026" },
      { id: "5", from: "20/08/2026", to: "29/08/2026" },
      { id: "6", from: "26/08/2026", to: "04/09/2026" },
      { id: "7", from: "29/08/2026", to: "07/09/2026" },
      { id: "8", from: "09/09/2026", to: "18/09/2026" },
    ],
    hotels: [
      { name: "Seigenberger Pyramids Cairo", stars: 5, image: "https://images.unsplash.com/photo-1678038592327-c5730737f867?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", prices: {} },
      { name: "Safir Sharm Waterfalls Resort", stars: 5, image: "https://images.unsplash.com/photo-1747336755438-e822d83e9383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", prices: { double: 299000, triple: 288000, single: 380000, infant: 35000, child1: 126000, child2: 200000 } },
      { name: "Parrotel Beach Resort", stars: 5, image: "https://images.unsplash.com/photo-1747336755296-a9e715350b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", prices: { double: 345000, triple: 340000, single: 440000, infant: 35000, child1: 126000, child2: 240000 } },
    ],
    includes: ["Billet d'avion Egyptair Alger-Caire-Sharm", "Transfert Aéroport - Hôtel - Aéroport", "7 nuits à Sharm El-Sheikh en All Inclusive Soft", "2 nuits au Caire petit déjeuner inclus", "Croisière sur le Nil avec dîner", "Musée Égyptien ticket inclus"],
    excludes: ["Visa d'entrée : 30 USD payable à l'arrivée"],
    excursions: ["Pyramides de Gizeh & Sphinx", "Déjeuner dans un restaurant égyptien au Caire", "Croisière Bateau Mouche sur le Nil", "Musée Égyptien", "City Tour Sharm El-Sheikh"],
    optionalActivities: ["Plongée sous-marine", "Quad & Parachute", "Baignade avec les dauphins", "Dîner de gala du Nouvel An"],
  },
  {
    id: "sharm-direct-2026",
    slug: "sharm-el-sheikh-direct",
    destination: "Sharm El-Sheikh",
    country: "Égypte",
    flag: "EG",
    tagline: "Sharm El-Sheikh Vol Direct",
    description:
      "Le paradis de la Mer Rouge en vol direct depuis Alger. 8 nuits / 9 jours en hôtel 5 étoiles All Inclusive.",
    heroImage:
      "https://images.unsplash.com/photo-1771987428767-a4514ab87567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    galleryImages: [
      "https://images.unsplash.com/photo-1747336755296-a9e715350b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1747336755438-e822d83e9383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1678038592492-d73c063bb9e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1561531526-68a24a396f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    airline: "Air Algérie",
    airlineLogo: "✈",
    duration: "9 jours / 8 nuits",
    basePrice: 234000,
    currency: "DA",
    departures: [
      { id: "1", from: "30/07/2026", to: "07/08/2026" },
      { id: "2", from: "07/08/2026", to: "15/08/2026" },
      { id: "3", from: "15/08/2026", to: "23/08/2026" },
      { id: "4", from: "23/08/2026", to: "31/08/2026" },
    ],
    hotels: [
      { name: "Parrotel Lagoon Sharm", stars: 5, image: "https://images.unsplash.com/photo-1747336755296-a9e715350b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", prices: { double: 236000, triple: 234000, single: 300000, infant: 35000, child1: 126000, child2: 169000 } },
      { name: "Safir Waterfalls Sharm", stars: 5, image: "https://images.unsplash.com/photo-1747336755438-e822d83e9383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", prices: { double: 259000, triple: 254000, single: 335000, infant: 35000, child1: 126000, child2: 189000 } },
      { name: "Cleopatra Luxury Resort", stars: 5, image: "https://images.unsplash.com/photo-1696489011621-62e117b67dc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", prices: { double: 330000, triple: 329000, single: 440000, infant: 35000, child1: 126000, child2: 225000 } },
      { name: "Pickalbatros Royal Moderna", stars: 5, image: "https://images.unsplash.com/photo-1771987428767-a4514ab87567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", prices: { double: 400000, triple: 398000, single: 588000, infant: 35000, child1: 126000, child2: 275000 } },
    ],
    includes: ["Vol direct aller-retour Air Algérie sans visa", "Transferts inclus", "Accompagnement & guides professionnels", "8 nuits en All Inclusive Soft", "2 visites : vieux marché & Soho Square"],
    excludes: [],
    excursions: [],
    optionalActivities: ["Excursion Ras Mohamed", "Safari quad dans le désert du Sinaï", "Visite d'un camp bédouin"],
  },
];

export const CONTACT = {
  address: "19 MAI BERTHELOT, Alger Centre, Alger 16000",
  tel: "+213 (0) 020 08 27 85",
  mobiles: [
    "+213 (0) 555 39 84 86",
    "+213 (0) 555 00 48 81",
    "+213 (0) 773 73 36 18",
    "+213 (0) 657 76 34 95",
    "+213 (0) 557 75 33 51",
  ],
  email: "assia.tours@outlook.com",
  facebook: "#Assia tours",
};

type DbTrip = {
  slug: string;
  destination?: string | null;
  country?: string | null;
  flag?: string | null;
  tagline?: string | null;
  description?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  airline?: string | null;
  duration?: string | null;
  base_price?: number | null;
  departures?: Departure[] | null;
  hotels?: Hotel[] | null;
  includes?: string[] | null;
  excludes?: string[] | null;
  excursions?: string[] | null;
  optional_activities?: string[] | null;
};

export function tripFromDb(db: DbTrip): Trip {
  const base = TRIPS.find((trip) => trip.slug === db.slug);
  const gallery = db.gallery_images?.length ? db.gallery_images : base?.galleryImages;
  return {
    id: base?.id ?? db.slug,
    slug: db.slug,
    destination: db.destination || base?.destination || "",
    country: db.country || base?.country || "",
    flag: db.flag || base?.flag || "WORLD",
    tagline: db.tagline || base?.tagline || "",
    description: db.description || base?.description || "",
    heroImage: db.hero_image || gallery?.[0] || base?.heroImage || "",
    galleryImages: gallery || [],
    airline: db.airline || base?.airline || "",
    airlineLogo: base?.airlineLogo || "✈",
    duration: db.duration || base?.duration || "",
    basePrice: Number(db.base_price ?? base?.basePrice ?? 0),
    currency: base?.currency || "DA",
    departures: db.departures?.length ? db.departures : base?.departures || [],
    hotels: db.hotels?.length ? db.hotels : base?.hotels || [],
    includes: db.includes?.length ? db.includes : base?.includes || [],
    excludes: db.excludes?.length ? db.excludes : base?.excludes || [],
    excursions: db.excursions?.length ? db.excursions : base?.excursions || [],
    optionalActivities: db.optional_activities?.length
      ? db.optional_activities
      : base?.optionalActivities || [],
  };
}
