import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';

export default function PhoneVerification() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const inputRef = useRef<TextInput>(null);

  const formatPhoneNumber = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const isValidPhone = phone.replace(/\D/g, '').length === 10;

  const handleContinue = () => {
    if (isValidPhone) {
      router.push('/onboarding/verify');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>
          We'll send you a verification code to ensure it's really you.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.phoneInput}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="(555) 123-4567"
            placeholderTextColor="#A58E63"
            keyboardType="phone-pad"
            maxLength={14}
            autoFocus
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.continueButton,
            { opacity: isValidPhone ? 1 : 0.5 }
          ]}
          onPress={handleContinue}
          disabled={!isValidPhone}
        >
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By continuing, you agree to receive SMS messages from Chapter & Verse. 
          Message and data rates may apply.
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
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
  inputContainer: {
    marginBottom: 32,
  },
  phoneInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontFamily: 'Literata-Regular',
    fontSize: 18,
    color: '#4B2E1E',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
    textAlign: 'center',
  },
  disclaimer: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 16,
  },
});