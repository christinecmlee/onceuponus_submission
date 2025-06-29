import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeInUp.delay(300).duration(800)}
        style={styles.headerContainer}
      >
        <Text style={styles.title}>Chapter & Verse</Text>
        <Text style={styles.subtitle}>
          A Literary Community for{'\n'}Curious Minds
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.delay(600).duration(800)}
        style={styles.descriptionContainer}
      >
        <Text style={styles.description}>
          Join intimate gatherings where stories come alive, personalities are explored, 
          and connections are forged through the power of literature.
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(900).duration(800)}
        style={styles.buttonContainer}
      >
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/onboarding/phone')}
        >
          <Text style={styles.buttonText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2E7',
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingBottom: 60,
  },
  headerContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 36,
    color: '#4B2E1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Cormorant-Medium',
    fontSize: 20,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 28,
  },
  descriptionContainer: {
    paddingHorizontal: 8,
  },
  description: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 18,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
    textAlign: 'center',
  },
});