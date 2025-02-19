import { View, Text, Image } from 'react-native';
import { Tabs } from 'expo-router';

import homeIcon from '../../assets/images/home.png'; // Ensure correct path

const TabIcon = ({ icon, color }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image source={homeIcon} style={{ width: 24, height: 24, tintColor: color }} resizeMode="contain" />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0c3b2e', // Custom tab background
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: 'white',
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabIcon icon={homeIcon} color={color} />,
        }}
      />
      {/* Add more tabs here if needed */}
    </Tabs>
  );
};

export default TabsLayout;
