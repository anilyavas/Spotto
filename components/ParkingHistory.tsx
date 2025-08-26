import { View, Text } from 'react-native';

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
    <View className="bg-gray-300 p-2">
      <Text>LAT: {item.latitude}</Text>
      <Text>LON: {item.longitude}</Text>
      <Text>TIME: {new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );
}
