import { useEffect, useState } from "react";
import { supabase, type AdminTrip } from "@/lib/supabase.ts";
import { TRIPS, tripFromDb, type Trip } from "@/lib/travel-data.ts";

export function usePublicTrips() {
  const [trips, setTrips] = useState<Trip[]>(TRIPS);

  useEffect(() => {
    let alive = true;
    supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!alive || !data?.length) return;
        setTrips((data as AdminTrip[]).map((trip) => tripFromDb(trip)));
      });
    return () => {
      alive = false;
    };
  }, []);

  return trips;
}
