import type { Reservation } from "@/lib/supabase.ts";

type Passenger = NonNullable<Reservation["passengers"]>[number];

const PASSENGERS_MARKER = "__ASSIA_PASSENGERS__=";

export function buildReservationNotes(summary: string, notes: string | undefined, passengers: Passenger[]) {
  return [summary, notes?.trim(), `${PASSENGERS_MARKER}${JSON.stringify(passengers)}`]
    .filter(Boolean)
    .join("\n");
}

export function getReservationPassengers(reservation: Reservation): Passenger[] {
  const storedPassengers = Array.isArray(reservation.passengers) ? reservation.passengers : [];
  const markerLine = reservation.notes
    ?.split("\n")
    .find((line) => line.startsWith(PASSENGERS_MARKER));

  if (markerLine) {
    try {
      const fallbackPassengers = JSON.parse(markerLine.slice(PASSENGERS_MARKER.length));
      if (Array.isArray(fallbackPassengers) && fallbackPassengers.length > storedPassengers.length) {
        return fallbackPassengers as Passenger[];
      }
    } catch {
      // Keep the database value if an old note does not contain valid JSON.
    }
  }

  if (storedPassengers.length > 0) return storedPassengers;

  return [{
    type: "ADT",
    firstName: reservation.first_name,
    lastName: reservation.last_name,
    birthDate: reservation.birth_date,
    nationality: reservation.nationality,
    passportNumber: reservation.passport_number,
    passportExpiry: reservation.passport_expiry,
  }];
}

export function getVisibleReservationNotes(notes: string | null) {
  return notes
    ?.split("\n")
    .filter((line) => !line.startsWith(PASSENGERS_MARKER))
    .join("\n")
    .trim();
}
