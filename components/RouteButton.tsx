import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable } from 'react-native';

export default function RouteButton() {
  return (
    <Pressable className="items-center justify-center rounded-full bg-blue-500 p-4">
      <FontAwesome6 name="location-arrow" size={20} color="white" />
    </Pressable>
  );
}
