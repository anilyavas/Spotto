import { Redirect, Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useAuth } from '~/context/AuthContext';

export default function TabLayout() {
  {
    /*  const { isAuthenticated, isLoading } = useAuth;

  if (!isAuthenticated && !isLoading) {
    return <Redirect href={'/(auth)/login'} />;
  }
*/
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarShowLabel: false,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
