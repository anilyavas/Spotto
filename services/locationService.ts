import * as Location from 'expo-location';

export const getPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return false;
  }
  //console.log('Permission granted!');
  return true;
};

export const getLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  const permission = await getPermission();

  if (!permission) return null;
  try {
    const { coords } = await Location.getCurrentPositionAsync({});
    //console.log('Location: ', coords.latitude, coords.longitude);
    return { lat: coords.latitude, lng: coords.longitude };
  } catch (error) {
    console.error('Error getting location: ', error);
    return null;
  }
};
