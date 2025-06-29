import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';

export default function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef<TextInput[]>([]);
  const shakeAnimation = useSharedValue(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Check if code is complete
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      verifyCode(newCode.join(''));
    }
  };

  const handleBackspace = (index: number) => {
    if (code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyCode = (enteredCode: string) => {
    // Simulate verification - replace with actual API call
    if (enteredCode === '123456') {
      router.push('/onboarding/profile');
    } else {
      setError('Invalid code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      
      // Shake animation
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    setError('');
    setCode(['', '', '', '', '', '']);
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
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to your phone number.
        </Text>

        <Animated.View style={[styles.codeContainer, animatedStyle]}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputs.current[index] = ref!}
              style={[
                styles.codeInput,
                error ? styles.codeInputError : null
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(index);
                }
              }}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </Animated.View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>
              Resend code in {resendTimer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendButton}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    fontFamily: 'Literata-SemiBold',
    fontSize: 20,
    color: '#4B2E1E',
    textAlign: 'center',
  },
  codeInputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendTimer: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
  },
  resendButton: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#A58E63',
  },
});