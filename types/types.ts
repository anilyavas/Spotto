export type LocationCoords = {
  lat: number;
  lng: number;
};

export type ParkingSpot = {
  id: string;
  coordinates: LocationCoords;
  timestamp: Date;
};

export type ParkedLocation = {
  id: string;
  lng: number;
  lat: number;
  created_at: string;
};
