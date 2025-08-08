import { View, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { ParkingSpot } from '~/types/types';

export default function ParkButton({
  onPress,
  isParked,
}: {
  onPress: () => void;
  isParked: boolean;
}) {
  const [parkedLocation, setParkedLocation] = useState<ParkingSpot | null>(null);

  const handlePress = async () => {};

  return (
    <Pressable
      className="absolute bottom-5 w-3/4 items-center rounded-full bg-green-600 p-4"
      onPress={handlePress}>
      <Text className="text-xl font-bold text-white">Park Here!</Text>
    </Pressable>
  );
}
