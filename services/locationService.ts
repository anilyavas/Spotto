import * as Location from 'expo-location';
import { LocationSubscription } from 'expo-location';

export const getPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return false;
  }
  return true;
};

export const getLocation = async (
  onLocationChange: (coords: { lat: number; lng: number }) => void
): Promise<LocationSubscription | null> => {
  const permission = await getPermission();

  if (!permission) return null;
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        onLocationChange({ lat: latitude, lng: longitude });
      }
    );
    return subscription;
  } catch (error) {
    console.error('Error getting location: ', error);
    return null;
  }
};

export const getCurrentLocation = async () => {
  const permission = await getPermission();
  if (!permission) return null;
  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 5,
    });
    return { lat: coords.latitude, lng: coords.longitude };
  } catch (error) {
    console.error('Error getting current location: ', error);
    return null;
  }
};
