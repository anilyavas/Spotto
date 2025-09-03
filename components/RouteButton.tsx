import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Linking, Platform, Pressable } from 'react-native';

export default function RouteButton({
  parkedCoords,
}: {
  parkedCoords?: { lat: number; lng: number };
}) {
  const routePress = ({ lat, lng }: { lat: number; lng: number }) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });

    const latLng = `${lat},${lng}`;
    const label = 'Parked Car';

    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch((err) => console.log('Error opening maps: ', err));
    }
  };
  return (
    <Pressable
      className="items-center justify-center rounded-full bg-blue-500 p-4"
      onPress={() =>
        routePress(parkedCoords ?? { lat: parkedCoords?.lat, lng: parkedCoords?.lng })
      }>
      <FontAwesome6 name="location-arrow" size={20} color="white" />
    </Pressable>
  );
}
