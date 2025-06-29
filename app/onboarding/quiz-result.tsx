import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Star, Users, ArrowRight } from 'lucide-react-native';
import { LITERARY_TYPES } from '@/data/quiz';
import { useUser } from '@/contexts/UserContext';

export default function QuizResult() {
  const router = useRouter();
  const { updateUser } = useUser();
  const { literaryType } = useLocalSearchParams<{ literaryType: string }>();
  
  const typeData = LITERARY_TYPES[literaryType];

  if (!typeData) {
    return (
      <View style={styles.container}>
        <Text>Error loading result</Text>
      </View>
    );
  }

  const handleContinue = () => {
    // Save the literary type to user context
    if (literaryType) {
      updateUser({ literaryType: literaryType });
    }
    
    router.push('/onboarding/city');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInUp.delay(300).duration(800)}
          style={styles.header}
        >
          <View style={styles.iconContainer}>
            <Star size={48} color="#A58E63" />
          </View>
          
          <Text style={styles.revealText}>Ah… you are </Text>
          <Text style={styles.typeTitle}>{typeData.name}</Text>
          <Text style={styles.typeDescription}>{typeData.description}</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(600).duration(800)}
          style={styles.detailsContainer}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Drive</Text>
            <Text style={styles.sectionText}>{typeData.coreDrive}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>You Connect Well With</Text>
            <View style={styles.pairingsContainer}>
              {typeData.strongPairings.map((pairing, index) => (
                <View key={index} style={styles.pairingTag}>
                  <Users size={16} color="#A58E63" />
                  <Text style={styles.pairingText}>{pairing}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Your Literary Style</Text>
            <Text style={styles.fullDescription}>{typeData.fullDescription}</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View 
        entering={FadeInDown.delay(900).duration(800)}
        style={styles.footer}
      >
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue Your Journey</Text>
          <ArrowRight size={20} color="#F7F2E7" style={styles.buttonIcon} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2E7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  revealText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 20,
    color: '#5C3D2E',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  typeTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: '#4B2E1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  typeDescription: {
    fontFamily: 'Cormorant-Medium',
    fontSize: 18,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 24,
  },
  detailsContainer: {
    paddingHorizontal: 32,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginBottom: 12,
  },
  sectionText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    lineHeight: 22,
  },
  pairingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pairingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2E7',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  pairingText: {
    fontFamily: 'Literata-Regular',
    fontSize: 12,
    color: '#4B2E1E',
    marginLeft: 6,
  },
  fullDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});