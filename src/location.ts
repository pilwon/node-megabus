export enum LocationId {
  Atlanta = 289,
  Austin = 320,
  Boston = 94,
  Chicago = 100,
  Dallas = 317,
  Philadelphia = 127,
  Toronto = 145,
  NewHaven = 122,
  NewYork = 123,
  Washington = 142
}

export const LocationIds = {
  Atlanta: LocationId.Atlanta,
  Austin: LocationId.Austin,
  Boston: LocationId.Boston,
  Chicago: LocationId.Chicago,
  Dallas: LocationId.Dallas,
  "New Haven": LocationId.NewHaven,
  "New York": LocationId.NewYork,
  Philadelphia: LocationId.Philadelphia,
  Toronto: LocationId.Toronto,
  Washington: LocationId.Washington
};

export type LocationName =
  | "Atlanta"
  | "Austin"
  | "Boston"
  | "Chicago"
  | "Dallas"
  | "New Haven"
  | "New York"
  | "Philadelphia"
  | "Toronto"
  | "Washington";
