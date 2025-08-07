import * as Location from 'expo-location';

export const getPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return false;
  }
};

export const getLocation = async () => {
  const permission = await getPermission();
  if (!permission) return null;

  const { coords } = await Location.getCurrentPositionAsync({});
  console.log('Location: ', coords.latitude, coords.longitude);
  return coords;
};
