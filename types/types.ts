export type LocationCoords = {
  lat: number;
  lng: number;
};

export type ParkingSpot = {
  id: string;
  coordinates: LocationCoords;
  timestamp: Date;
};
