import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';

const REFERRAL_OPTIONS = [
  'Instagram',
  'TikTok',
  'Facebook',
  'Word of Mouth',
  'Other'
];

export default function Referral() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [otherText, setOtherText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const isValidSelection = selectedOption && (selectedOption !== 'Other' || otherText.trim());

  const handleContinue = () => {
    if (isValidSelection) {
      router.push('/onboarding/quiz-intro');
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.content}
        >
          <Text style={styles.title}>How did you hear about us?</Text>
          <Text style={styles.subtitle}>
            This helps us understand how our literary community grows.
          </Text>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={[
                styles.dropdownText,
                selectedOption ? styles.dropdownTextSelected : null
              ]}>
                {selectedOption || 'Select an option'}
              </Text>
              <ChevronDown size={20} color="#A58E63" />
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownList}>
                {REFERRAL_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setSelectedOption(option);
                      setShowDropdown(false);
                      if (option !== 'Other') {
                        setOtherText('');
                      }
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {selectedOption === 'Other' && (
            <Animated.View 
              entering={FadeInUp.duration(400)}
              style={styles.otherInputContainer}
            >
              <TextInput
                style={styles.otherInput}
                value={otherText}
                onChangeText={setOtherText}
                placeholder="Please specify..."
                placeholderTextColor="#A58E63"
                multiline
              />
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            { opacity: isValidSelection ? 1 : 0.5 }
          ]}
          onPress={handleContinue}
          disabled={!isValidSelection}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: '#E3D9C3',
  },
  dropdownOptionText: {
    fontFamily: 'Literata-Regular',
    fontSize: 16,
    color: '#4B2E1E',
  },
  otherInputContainer: {
    marginTop: 16,
  },
  otherInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontFamily: 'Literata-Regular',
    fontSize: 16,
    color: '#4B2E1E',
    minHeight: 80,
    textAlignVertical: 'top',
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