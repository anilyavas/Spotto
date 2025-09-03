import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocation } from '~/services/locationService';
import { LocationCoords } from '~/types/types';
import ParkButton from '~/components/ParkButton';
import { useParkingStore } from '~/store/locationStore';
import RouteButton from '~/components/RouteButton';

export default function Home() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const { location: parkedLocation, parkHere, clearLocation, fetchLocation } = useParkingStore();

  useEffect(() => {
    let subscription: any;

    (async () => {
      subscription = await getLocation((coords) => {
        setLocation(coords);
      });
    })();

    fetchLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [fetchLocation]);

  const handlePark = async () => {
    if (!location) return;
    try {
      await parkHere(location?.lat, location?.lng);
      console.log('Parked at: ', location);
    } catch (error) {
      console.error('Error while parking: ', error);
    }
  };

  const handleClear = async () => {
    try {
      await clearLocation();
    } catch (error) {
      console.error('Error while clearing parked location: ', error);
    }
  };

  if (!location) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <MapView
        style={{ width: '100%', height: '100%' }}
        zoomEnabled={true}
        initialRegion={{
          latitude: location?.lat || 0,
          longitude: location?.lng || 0,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        region={{
          latitude: location?.lat || 0,
          longitude: location?.lng || 0,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}>
        {location && (
          <Marker
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            title="You are here!"
            pinColor="green"
          />
        )}
        {parkedLocation && (
          <Marker
            coordinate={{
              latitude: parkedLocation.lat + 0.00002,
              longitude: parkedLocation.lng + 0.00002,
            }}>
            <View className="rounded-full border-2 border-yellow-400 bg-white p-2">
              <Text className="text-2xl font-bold">🚗</Text>
            </View>
          </Marker>
        )}
      </MapView>
      <View className="absolute bottom-5 w-full flex-row items-center justify-around">
        <ParkButton
          onPress={parkedLocation ? handleClear : handlePark}
          isParked={!!parkedLocation}
        />
        {parkedLocation && <RouteButton parkedCoords={parkedLocation} />}
      </View>
    </View>
  );
}
