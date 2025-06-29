import { Stack } from 'expo-router/stack';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="referral" />
      <Stack.Screen name="quiz-intro" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="quiz-result" />
      <Stack.Screen name="city" />
    </Stack>
  );
}