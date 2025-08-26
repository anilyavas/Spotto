import { View, Text } from 'react-native';
import { ParkedLocation } from '~/store/locationStore';

export default function ParkingHistory({ item }: { item: ParkedLocation }) {
  return (
    <View>
      <Text>Parking History Component</Text>
    </View>
  );
}
