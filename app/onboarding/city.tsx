import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, MapPin, ChevronDown } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';

const CITIES = [
  'Los Angeles, CA'
];

export default function City() {
  const router = useRouter();
  const { updateUser } = useUser();
  const [selectedCity, setSelectedCity] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleContinue = () => {
    if (selectedCity) {
      updateUser({ 
        city: selectedCity,
        onboardingComplete: true 
      });
      router.replace('/(tabs)');
    }
  };

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
          <MapPin size={48} color="#A58E63" />
        </View>

        <Text style={styles.title}>Where are you located?</Text>
        <Text style={styles.subtitle}>
          We'll notify you about literary events and gatherings in your area.
        </Text>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={[
              styles.dropdownText,
              selectedCity ? styles.dropdownTextSelected : null
            ]}>
              {selectedCity || 'Select your city'}
            </Text>
            <ChevronDown size={20} color="#A58E63" />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownList}>
              {CITIES.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedCity(city);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.comingSoonText}>
          Currently available in Los Angeles.{'\n'}
          More cities coming soon!
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            { opacity: selectedCity ? 1 : 0.5 }
          ]}
          onPress={handleContinue}
          disabled={!selectedCity}
        >
          <Text style={styles.buttonText}>Enter Once Upon Us</Text>
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
    paddingTop: 40,
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
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  dropdownContainer: {
    marginBottom: 24,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontFamily: 'Literata-Regular',
    fontSize: 16,
    color: '#A58E63',
  },
  dropdownTextSelected: {
    color: '#4B2E1E',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -2,
  },
  dropdownOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dropdownOptionText: {
    fontFamily: 'Literata-Regular',
    fontSize: 16,
    color: '#4B2E1E',
  },
  comingSoonText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
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