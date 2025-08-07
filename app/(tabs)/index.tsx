import { useEffect } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import { getLocation } from '~/services/locationService';

export default function Home() {
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <MapView style={{ width: '100%', height: '100%' }} zoomEnabled={true} />
    </View>
  );
}
