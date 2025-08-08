export type LocationCoords = {
  latitude: number;
  longitude: number;
};

export type ParkingSpot = {
  id: string;
  coordinates: LocationCoords;
  timestamp: Date;
};
