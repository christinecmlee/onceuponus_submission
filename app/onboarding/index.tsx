import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { useUser } from '@/contexts/UserContext';

const { width, height } = Dimensions.get('window');

const words = [
  'Welcome to Once Upon Us.',
  'Where stories live between us.',
  'Meet kindred spirits.',
  'Write your next chapter',
  'Discover endings you never saw coming.',
  'Ready to turn the page?'
];

export default function OnboardingIntro() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const opacity = useSharedValue(0);
  const animationStartedRef = useRef(false);

  useEffect(() => {
    // Wait for user data to load before making navigation decisions
    if (isLoading || animationStartedRef.current) {
      return;
    }

    // Mark that we've started the animation logic to prevent duplicate execution
    animationStartedRef.current = true;

    if (user?.onboardingComplete) {
      router.replace('/(tabs)');
      return;
    }

    // Check if user has quiz progress and navigate to quiz
    if (user?.quizProgressCurrentQuestion !== undefined && user?.quizProgressCurrentQuestion >= 0) {
      router.replace('/onboarding/quiz');
      return;
    }
    
    animateWords();
  }, [user, isLoading]);

  const animateWords = () => {
    if (currentWordIndex < words.length) {
      opacity.value = withSequence(
        withTiming(1, { duration: 600 }),
        withDelay(800, withTiming(0, { duration: 400 }, () => {
          // Use runOnJS to ensure state update happens on JS thread
          runOnJS(() => {
            setCurrentWordIndex(prev => prev + 1);
          })();
        }))
      );
    } else {
      // Use runOnJS for navigation as well
      runOnJS(() => {
        router.push('/onboarding/phone');
      })();
    }
  };

  useEffect(() => {
    if (currentWordIndex > 0 && currentWordIndex < words.length) {
      animateWords();
    } else if (currentWordIndex >= words.length) {
      // Final navigation with a delay
      setTimeout(() => {
        router.push('/onboarding/phone');
      }, 1000);
    }
  }, [currentWordIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wordContainer, animatedStyle]}>
        <Text style={styles.word}>
          {words[currentWordIndex]}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2E7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  word: {
    fontFamily: 'Playfair-Regular',
    fontSize: 32,
    color: '#4B2E1E',
    textAlign: 'center',
    lineHeight: 44,
  },
});