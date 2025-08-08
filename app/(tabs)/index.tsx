import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocation } from '~/services/locationService';
import { LocationCoords } from '~/types/types';
import ParkButton from '~/components/ParkButton';

export default function Home() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isParked, setIsParked] = useState(false);
  useEffect(() => {
    let subscription: any;
    const setupLocation = async () => {
      subscription = await getLocation((coords) => {
        setLocation(coords);
      });
    };
    setupLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handlePark = async () => {
    try {
      // parking logic here
    } catch (error) {
      console.error('Error while parking: ', error);
    } finally {
      setIsParked(true);
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
            title="You are here"
          />
        )}
      </MapView>
      <ParkButton onPress={handlePark} isParked={isParked} />
    </View>
  );
}
