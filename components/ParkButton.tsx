import { Pressable, Text } from 'react-native';

export default function ParkButton({ onPress }: { onPress: () => void; isParked: boolean }) {
  const handlePress = async () => {
    onPress();
  };

  return (
    <Pressable
      className="absolute bottom-5 w-3/4 items-center rounded-full bg-green-600 p-4"
      onPress={handlePress}>
      <Text className="text-xl font-bold text-white">Park Here!</Text>
    </Pressable>
  );
}
