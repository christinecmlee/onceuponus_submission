import { Tabs } from 'expo-router';
import { Mail, User, PenTool } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F7F2E7',
          borderTopWidth: 2,
          borderTopColor: '#E3D9C3',
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#A58E63',
        tabBarInactiveTintColor: '#5C3D2E',
        tabBarLabelStyle: {
          fontFamily: 'Literata-SemiBold',
          fontSize: 12,
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Invites',
          tabBarIcon: ({ size, color }) => (
            <Mail size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="story-builder"
        options={{
          title: 'Stories',
          tabBarIcon: ({ size, color }) => (
            <PenTool size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}