import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, BookOpen, Users, Heart, Zap } from 'lucide-react-native';

export default function QuizIntro() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#4B2E1E" />
        </TouchableOpacity>
      </View>

      <Animated.View 
        entering={FadeInUp.delay(200).duration(600)}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <BookOpen size={48} color="#A58E63" />
        </View>

        <Text style={styles.title}>Discover Your Literary Identity</Text>
        
        <Text style={styles.description}>
          Every reader has a unique literary personality that shapes how they connect 
          with stories, characters, and themes. Our quiz reveals your reading DNA 
          and helps us create the perfect literary experiences for you.
        </Text>

        <View style={styles.benefitsList}>
          <View style={styles.benefit}>
            <Users size={20} color="#A58E63" />
            <Text style={styles.benefitText}>Connect with like-minded readers</Text>
          </View>
          
          <View style={styles.benefit}>
            <Heart size={20} color="#A58E63" />
            <Text style={styles.benefitText}>Find events that match your style</Text>
          </View>
          
          <View style={styles.benefit}>
            <Zap size={20} color="#A58E63" />
            <Text style={styles.benefitText}>Get personalized story recommendations</Text>
          </View>
        </View>

        <View style={styles.quizDetails}>
          <Text style={styles.detailsText}>
            • 14 thoughtful questions{'\n'}
            • Takes about 3 minutes{'\n'}
            • Discover one of 8 literary types
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/onboarding/quiz')}
        >
          <Text style={styles.buttonText}>Start the Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2E7',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 28,
    color: '#4B2E1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  benefitsList: {
    marginBottom: 32,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  benefitText: {
    fontFamily: 'Literata-Regular',
    fontSize: 14,
    color: '#4B2E1E',
    marginLeft: 12,
    flex: 1,
  },
  quizDetails: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 20,
  },
  detailsText: {
    fontFamily: 'Cormorant-Medium',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  startButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
    textAlign: 'center',
  },
});