import { Pressable, Text } from 'react-native';

export default function ParkButton({
  onPress,
  isParked,
}: {
  onPress: () => void;
  isParked: boolean;
}) {
  return (
    <Pressable
      className={`absolute bottom-5 w-3/4 items-center rounded-full p-4 ${
        isParked ? 'bg-red-600' : 'bg-green-600'
      }`}
      onPress={onPress}>
      <Text className="text-xl font-bold text-white">
        {isParked ? 'Clear Park!' : 'Park Here!'}
      </Text>
    </Pressable>
  );
}
