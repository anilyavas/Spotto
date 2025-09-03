import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable } from 'react-native';

export default function RouteButton({ onPress }: { onPress: () => void }) {
  const routePress = () => {};
  return (
    <Pressable
      className="items-center justify-center rounded-full bg-blue-500 p-4"
      onPress={routePress}>
      <FontAwesome6 name="location-arrow" size={20} color="white" />
    </Pressable>
  );
}
