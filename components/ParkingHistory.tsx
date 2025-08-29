import Fontisto from '@expo/vector-icons/Fontisto';
import { View, Text, Pressable, Linking, Platform, Alert } from 'react-native';
import { supabase } from '~/utils/supabase';

export default function ParkingHistory({
  item,
}: {
  item: {
    latitude: string;
    longitude: string;
    created_at: string;
    id: string;
  };
}) {
  const deleteParkingHistory = async (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this parking history?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabase.from('parking_history').delete().eq('id', id);
            console.log('Item deleted successfully');
            // Add resfesher function
          } catch (error: any) {
            console.log('Error while deleting item ', error.message);
          }
        },
      },
    ]);
  };

  const navigateToParkingPlace = ({ lat, lng }: { lat: number; lng: number }) => {
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

      <Pressable
        className="items-center justify-center bg-green-600 p-4"
        onPress={() =>
          navigateToParkingPlace({
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude),
          })
        }>
        <Fontisto name="navigate" size={20} color={'white'} />
      </Pressable>

      <Pressable
        className="items-center justify-center bg-red-600 p-4"
        onPress={() => deleteParkingHistory(item.id)}>
        <Fontisto name="trash" size={20} color={'white'} />
      </Pressable>
    </View>
  );
}
