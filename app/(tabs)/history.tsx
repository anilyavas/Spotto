import { useEffect } from 'react';
import { ActivityIndicator, View, Text, Platform, StatusBar } from 'react-native';
import { useParkingStore } from '~/store/locationStore';
import { FlashList } from '@shopify/flash-list';
import ParkingHistory from '~/components/ParkingHistory';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { fetchHistory, history, isLoading } = useParkingStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  return (
    <View className="flex-1">
      <SafeAreaView
        style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
        className="flex-1">
        <Text className="border-b-hairline border-gray-400 p-2 text-xl font-bold text-green-600">
          {'Parking History'.toUpperCase()}
        </Text>
        <FlashList
          data={history}
          renderItem={({ item }) => <ParkingHistory item={item} />}
          keyExtractor={(item) => item.id}
          estimatedItemSize={100}
        />
      </SafeAreaView>
    </View>
  );
}
