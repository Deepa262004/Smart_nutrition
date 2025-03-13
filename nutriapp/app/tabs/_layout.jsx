import { View, Image, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { useRef } from 'react';

// Import icons
import homeIcon from '../../assets/icons/home.png';
import profileIcon from '../../assets/icons/profile.png';
import logIcon from '../../assets/icons/plus.png'; // Ensure correct path

const TabIcon = ({ icon, color, focused, isLogButton }) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.2 : 1)).current;

  Animated.timing(scaleAnim, {
    toValue: focused ? 1.2 : 1,
    duration: 200,
    useNativeDriver: true,
  }).start();

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: scaleAnim }],
        backgroundColor: isLogButton ? '#F5C518' : focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        width: isLogButton ? 60 : 'auto',
        height: isLogButton ? 60 : 'auto',
        borderRadius: isLogButton ? 30 : 10,
        elevation: isLogButton ? 8 : 0,
        shadowColor: isLogButton ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        padding: isLogButton ? 0 : 10,
        borderWidth: isLogButton ? 2 : 0,
        borderColor: isLogButton ? 'white' : 'transparent',
      }}
    >
      <Image
        source={icon}
        style={{
          width: isLogButton ? 28 : 26,
          height: isLogButton ? 28 : 26,
          tintColor: isLogButton ? '#0c3b2e' : color,
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0c3b2e',
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          color: 'white',
        },
        tabBarActiveTintColor: '#F5C518',
        tabBarInactiveTintColor: 'white',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={homeIcon} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="logMeal"
        options={{
          title: 'Log',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={logIcon} color={color} focused={focused} />,
          // tabBarButton: (props) => <View style={{ top: -20 }}>{props.children}</View>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={profileIcon} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
