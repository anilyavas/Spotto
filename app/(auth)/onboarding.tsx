import { router } from 'expo-router';
import { Dimensions, SafeAreaView, StatusBar, View, Text, Platform, Image } from 'react-native';
import { Button } from '~/components/Button';
import Swiper from 'react-native-swiper';
import onboard1 from '../../assets/onboarding/onboard1.png';
import onboard2 from '../../assets/onboarding/onboard2.png';
import onboard3 from '../../assets/onboarding/onboard3.png';

export default function OnboardingPage() {
  return (
    <View className="flex-1 bg-black">
      <SafeAreaView
        className="flex-1"
        style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Text className="text-center text-3xl font-bold text-green-600">Spotto</Text>
        <Swiper loop={false} showsPagination dotColor="white" activeDotColor="green">
          <View className="items-center justify-center gap-7 p-10">
            <Image
              source={onboard1}
              style={{
                height: Dimensions.get('window').height / 2,
                width: Dimensions.get('window').width - 50,
                borderRadius: 30,
              }}
            />
            <Text className="text-center text-2xl font-bold text-white">
              Never Lose Your Parking Spot
            </Text>
            <Text className="text-center text-lg font-semibold text-gray-400">
              Save your car’s location instantly and find it later with ease.
            </Text>
          </View>
          <View className="items-center justify-center gap-7 p-10">
            <Image
              source={onboard2}
              style={{
                height: Dimensions.get('window').height / 2,
                width: Dimensions.get('window').width - 50,
                borderRadius: 30,
              }}
            />
            <Text className="text-center text-2xl font-bold text-white">Guided Navigation</Text>
            <Text className="text-center text-lg font-semibold text-gray-400">
              Get step-by-step directions to your parked car using Google or Apple Maps.
            </Text>
          </View>
          <View className="items-center justify-center gap-7 p-10">
            <Image
              source={onboard3}
              style={{
                height: Dimensions.get('window').height / 2,
                width: Dimensions.get('window').width - 50,
                borderRadius: 30,
              }}
            />
            <Text className="text-center text-2xl font-bold text-white">Your Parking History</Text>
            <Text className="text-center text-lg font-semibold text-gray-400">
              Keep track of your recent parking spots and delete them anytime.
            </Text>
            <Button
              title="Get Started"
              onPress={() => router.push('/(auth)/login')}
              style={{ width: Dimensions.get('window').width - 100 }}
            />
          </View>
        </Swiper>
        <StatusBar />
      </SafeAreaView>
    </View>
  );
}
