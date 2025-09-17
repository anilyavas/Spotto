import { Platform, StatusBar, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SocialPage() {
  return (
    <View className="flex-1">
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}>
        <Text className="border-b-hairline border-gray-400 p-2 text-xl font-bold text-green-600">
          {'Share Parking Experience'.toUpperCase()}
        </Text>
        <View>{/* Forum part for sharing spots*/}</View>
        <Pressable>{/* Add button for adding new spot on forum */}</Pressable>
      </SafeAreaView>
    </View>
  );
}
