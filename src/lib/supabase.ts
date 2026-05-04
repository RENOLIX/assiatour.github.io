import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://lhvnnglwfvxqtcqqxhaz.supabase.co/rest/v1/";

export const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable__eLhBhgFC2O3buoIcPQbuQ_eGSojPgH";

export const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "");

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type AppRole = "admin" | "employee";
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  role: AppRole;
  created_at: string;
};

export type AdminTrip = {
  id: string;
  slug: string;
  destination: string;
  country: string;
  flag: string;
  tagline: string;
  description: string;
  hero_image: string;
  gallery_images: string[] | null;
  airline: string;
  duration: string;
  base_price: number;
  departures: Array<{ id: string; from: string; to: string }> | null;
  hotels: Array<{
    name: string;
    stars: number;
    image: string;
    prices: Record<string, number | undefined>;
  }> | null;
  includes: string[];
  excludes: string[];
  excursions: string[];
  optional_activities: string[];
  active: boolean;
  created_at: string;
};

export type Reservation = {
  id: string;
  trip_slug: string;
  trip_name: string;
  departure_from: string;
  departure_to: string;
  hotel_name: string;
  room_type: string;
  passenger_count: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  passport_number: string;
  passport_expiry: string;
  nationality: string;
  birth_date: string;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
};

export type GalleryBlockPhoto = {
  id: string;
  line: "line1" | "line2";
  position: number;
  image_url: string;
  created_at: string;
};
