import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import Purchases from 'react-native-purchases';
import {
  Literata_400Regular,
  Literata_600SemiBold,
  Literata_700Bold,
} from '@expo-google-fonts/literata';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/contexts/UserContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [isRevenueCatReady, setIsRevenueCatReady] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    'Literata-Regular': Literata_400Regular,
    'Literata-SemiBold': Literata_600SemiBold,
    'Literata-Bold': Literata_700Bold,
    'Cormorant-Regular': CormorantGaramond_400Regular,
    'Cormorant-Medium': CormorantGaramond_500Medium,
    'Cormorant-SemiBold': CormorantGaramond_600SemiBold,
    'Playfair-Regular': PlayfairDisplay_400Regular,
    'Playfair-SemiBold': PlayfairDisplay_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  // Initialize RevenueCat
  useEffect(() => {
    const initializeRevenueCat = async () => {
      if (Platform.OS === 'web') {
        console.log('RevenueCat - Skipping initialization on web platform');
        setIsRevenueCatReady(true);
        return;
      }

      try {
        const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
        if (!apiKey) {
          console.error('RevenueCat - API key not found in environment variables');
          setIsRevenueCatReady(true);
          return;
        }

        console.log('RevenueCat - Initializing SDK...');
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        
        await Purchases.configure({
          apiKey: apiKey,
          appUserID: null, // Use anonymous user ID, will be set later if needed
        });

        console.log('RevenueCat - SDK initialized successfully');
        setIsRevenueCatReady(true);
      } catch (error) {
        console.error('RevenueCat - Initialization failed:', error);
        setIsRevenueCatReady(true); // Continue anyway to prevent app blocking
      }
    };

    initializeRevenueCat();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && isRevenueCatReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isRevenueCatReady]);

  if ((!fontsLoaded && !fontError) || !isRevenueCatReady) {
    return null;
  }

  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="event-details/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" backgroundColor="#F7F2E7" />
    </UserProvider>
  );
}