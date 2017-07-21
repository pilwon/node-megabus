export enum LocationId {
  Atlanta = 289,
  Boston = 94,
  Chicago = 100,
  Philadelphia = 127,
  Toronto = 145,
  NewHaven = 122,
  NewYork = 123,
  Washington = 142,
}

export const LocationIds = {
  'Atlanta': LocationId.Atlanta,
  'Boston': LocationId.Boston,
  'Chicago': LocationId.Chicago,
  'New Haven': LocationId.NewHaven,
  'New York': LocationId.NewYork,
  'Philadelphia': LocationId.Philadelphia,
  'Toronto': LocationId.Toronto,
  'Washington': LocationId.Washington,
};

export type LocationName =
  'Atlanta' | 'Boston' | 'Chicago' | 'New Haven' | 'New York' |
  'Philadelphia' | 'Toronto' | 'Washington';
