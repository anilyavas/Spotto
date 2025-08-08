import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocation } from '~/services/locationService';
import { LocationCoords } from '~/types/types';

export default function Home() {
  const [coords, setCoords] = useState<LocationCoords | null>(null);

  useEffect(() => {
    const getCoords = async () => {
      const location = await getLocation();
      if (location) {
        const { lat, lng } = location;
        setCoords({ latitude: lat, longitude: lng });
      }
    };
    getCoords();
  }, []);

  if (!coords) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <MapView style={{ width: '100%', height: '100%' }} zoomEnabled={true}>
        <Marker coordinate={coords} />
      </MapView>
    </View>
  );
}
