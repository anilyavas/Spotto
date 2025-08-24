import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useParkingStore } from '~/store/locationStore';
import { FlashList } from '@shopify/flash-list';
import ParkingHistory from '~/components/ParkingHistory';

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
      <FlashList
        data={history}
        renderItem={({ item }) => <ParkingHistory item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
