import Fontisto from '@expo/vector-icons/Fontisto';
import { View, Text, Pressable } from 'react-native';

export default function ParkingHistory({
  item,
}: {
  item: {
    latitude: string;
    longitude: string;
    created_at: string;
    id: number;
  };
}) {
  return (
    <View className="m-0.5 flex-row">
      <View className="flex-1 flex-row justify-between bg-gray-300 p-2">
        <View className="p-2">
          <Text className="text-lg font-bold">Location Coords</Text>
          <Text>
            <Text className="text-md font-semibold">LAT:</Text> {item.latitude}
          </Text>
          <Text>
            <Text className="text-md font-semibold">LON:</Text> {item.longitude}
          </Text>
        </View>
        <View className="p-2">
          <Text className="text-lg font-bold">Time & Date</Text>
          <Text className="text-md font-semibold">
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
      <Pressable className="items-center justify-center bg-green-600 p-4" onPress={() => {}}>
        <Fontisto name="navigate" size={20} color={'white'} />
      </Pressable>
      <Pressable className="items-center justify-center bg-red-600 p-4" onPress={() => {}}>
        <Fontisto name="trash" size={20} color={'white'} />
      </Pressable>
    </View>
  );
}
