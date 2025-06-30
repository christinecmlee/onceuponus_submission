import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Users, 
  CircleCheck as CheckCircle, 
  CircleAlert as AlertCircle,
  Crown,
  Coffee,
  Star
} from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';

const { width } = Dimensions.get('window');

export default function EventDetails() {
  const router = useRouter();
  const { user, addUpcomingEvent, markMonthlyFreeEventUsed, checkAndResetMonthlyStatus } = useUser();
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Parse event data from params
  const eventData = {
    id: params.id as string,
    theme: params.theme as string,
    description: params.description as string,
    neighborhood: params.neighborhood as string,
    date: params.date as string,
    time: params.time as string,
    deadline: params.deadline as string,
    price: 25
  };

  // Check if user is already registered for this event
  const isAlreadyRegistered = user?.upcomingEvents?.some(
    event => event.id === eventData.id
  );

  // Check if premium user can use free event this month
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const canUseFreeEvent = user?.isPremiumSubscriber && 
                         (!user?.monthlyFreeEventUsed || 
                          user?.lastMonthlyFreeEventResetDate !== currentMonth);

  // Determine pricing for this user
  const effectivePrice = canUseFreeEvent ? 0 : eventData.price;
  const isFreeForUser = effectivePrice === 0;

  // Check and reset monthly status on component mount
  React.useEffect(() => {
    checkAndResetMonthlyStatus();
  }, [checkAndResetMonthlyStatus]);

  const handleRegisterAndPay = async () => {
    if (isAlreadyRegistered) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      const processingTime = isFreeForUser ? 1000 : 2000; // Faster for free events
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Create event object for user's upcoming events
      const newEvent = {
        id: eventData.id,
        title: eventData.theme,
        date: eventData.date,
        status: 'confirmed',
        checkInCode: generateCheckInCode()
      };

      // Add event to user's upcoming events
      const wasAdded = addUpcomingEvent(newEvent);

      if (wasAdded) {
        // If this was a free premium event, mark the monthly benefit as used
        if (canUseFreeEvent) {
          console.log('Marking monthly free event as used');
          markMonthlyFreeEventUsed();
        }

        // Show success message
        const successMessage = isFreeForUser 
          ? 'Registration successful! You\'ve used your monthly free event benefit.'
          : 'Registration successful! You\'re all set for this event.';
          
        if (Platform.OS === 'web') {
          alert(successMessage);
        } else {
          Alert.alert(
            'Registration Successful!',
            successMessage + ' Check your profile for details.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        }
      } else {
        // This shouldn't happen due to UI state, but good to handle
        if (Platform.OS === 'web') {
          alert('You\'re already registered for this event!');
        } else {
          Alert.alert('Already Registered', 'You\'re already registered for this event!');
        }
      }
    } catch (error) {
      console.error('Payment failed:', error);
      if (Platform.OS === 'web') {
        alert('Payment failed. Please try again.');
      } else {
        Alert.alert('Payment Failed', 'There was an issue processing your payment. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscribePrompt = () => {
    setShowPaywall(true);
  };

  const generateCheckInCode = () => {
    const codes = ['GOTHIC', 'VERSE', 'STORY', 'MYSTIC', 'PROSE', 'NOVEL'];
    return codes[Math.floor(Math.random() * codes.length)];
  };

  return (
    <View style={styles.container}>
      <SubscriptionPaywall 
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribed={() => {
          console.log('User subscribed from event details');
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#4B2E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Event Title Card */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.titleCard}
        >
          <Text style={styles.eventTitle}>{eventData.theme}</Text>
          <View style={styles.priceContainer}>
            {isFreeForUser ? (
              <>
                <Text style={styles.freeText}>FREE</Text>
                <Text style={styles.priceLabel}>premium benefit</Text>
              </>
            ) : (
              <>
                <Text style={styles.priceText}>${effectivePrice}</Text>
                <Text style={styles.priceLabel}>per person</Text>
              </>
            )}
          </View>
        </Animated.View>

        {/* Event Details */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.detailsCard}
        >
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.detailRow}>
            <MapPin size={20} color="#A58E63" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailText}>{eventData.neighborhood}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Calendar size={20} color="#A58E63" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailText}>{eventData.date} at {eventData.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Clock size={20} color="#A58E63" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>RSVP Deadline</Text>
              <Text style={styles.detailText}>{eventData.deadline} remaining</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Users size={20} color="#A58E63" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Expected Attendees</Text>
              <Text style={styles.detailText}>8-12 literary enthusiasts</Text>
            </View>
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.descriptionCard}
        >
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{eventData.description}</Text>
          
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>What to Expect</Text>
            <Text style={styles.highlightText}>
              • Intimate literary discussions{'\n'}
              • Curated readings and themes{'\n'}
              • Connect with fellow book lovers{'\n'}
              • Light refreshments provided{'\n'}
              • Story creation workshop
            </Text>
          </View>
        </Animated.View>

        {/* What's Included */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.includedCard}
        >
          <Text style={styles.sectionTitle}>What's Included</Text>
          
          <View style={styles.includedItem}>
            <CheckCircle size={18} color="#16A34A" />
            <Text style={styles.includedText}>Guided literary discussion</Text>
          </View>
          
          <View style={styles.includedItem}>
            <CheckCircle size={18} color="#16A34A" />
            <Text style={styles.includedText}>Curated reading materials</Text>
          </View>
          
          <View style={styles.includedItem}>
            <CheckCircle size={18} color="#16A34A" />
            <Text style={styles.includedText}>Light refreshments</Text>
          </View>
          
          <View style={styles.includedItem}>
            <CheckCircle size={18} color="#16A34A" />
            <Text style={styles.includedText}>Access to Story Builder tool</Text>
          </View>
        </Animated.View>

        {/* Registration Status or Payment */}
        {isAlreadyRegistered ? (
          <Animated.View
            entering={FadeInUp.delay(1000).duration(600)}
            style={styles.registeredCard}
          >
            <CheckCircle size={32} color="#16A34A" />
            <Text style={styles.registeredTitle}>You're Registered!</Text>
            <Text style={styles.registeredText}>
              Check your profile for event details and check-in information.
            </Text>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInUp.delay(1000).duration(600)}
            style={styles.paymentCard}
          >
            <Text style={styles.sectionTitle}>Complete Registration</Text>
            
            <View style={styles.paymentSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Event Ticket</Text>
                <Text style={styles.summaryValue}>
                  {isFreeForUser ? 'FREE' : `$${effectivePrice}.00`}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotal}>
                  {isFreeForUser ? 'FREE' : `$${effectivePrice}.00`}
                </Text>
              </View>
            </View>

            {!isFreeForUser && (
              <View style={styles.paymentNote}>
                <AlertCircle size={16} color="#A58E63" />
                <Text style={styles.paymentNoteText}>
                  Payment processed securely through RevenueCat
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
        {/* Premium Benefits (if user is premium subscriber) */}
        {user?.isPremiumSubscriber && (
          <Animated.View 
            entering={FadeInUp.delay(900).duration(600)}
            style={styles.premiumBenefitsCard}
          >
            <View style={styles.premiumHeader}>
              <Crown size={24} color="#A58E63" />
              <Text style={styles.premiumTitle}>Your Premium Benefits</Text>
            </View>
            
            <View style={styles.premiumBenefit}>
              <Coffee size={18} color="#16A34A" />
              <Text style={styles.premiumBenefitText}>Complimentary drink included</Text>
            </View>
            
            <View style={styles.premiumBenefit}>
              <Star size={18} color="#16A34A" />
              <Text style={styles.premiumBenefitText}>Priority booking access</Text>
            </View>

            {canUseFreeEvent && (
              <View style={styles.premiumBenefit}>
                <CheckCircle size={18} color="#16A34A" />
                <Text style={styles.premiumBenefitText}>
                  Monthly free event (available this month)
                </Text>
              </View>
            )}

            {user?.monthlyFreeEventUsed && user?.lastMonthlyFreeEventResetDate === currentMonth && (
              <View style={styles.premiumBenefit}>
                <AlertCircle size={18} color="#F59E0B" />
                <Text style={[styles.premiumBenefitText, { color: '#92400E' }]}>
                  Monthly free event already used this month
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Subscribe Prompt for Non-Premium Users */}
        {!user?.isPremiumSubscriber && (
          <Animated.View 
            entering={FadeInUp.delay(900).duration(600)}
            style={styles.subscribePromptCard}
          >
            <View style={styles.subscribePromptHeader}>
              <Crown size={24} color="#A58E63" />
              <Text style={styles.subscribePromptTitle}>Want This Event Free?</Text>
            </View>
            
            <Text style={styles.subscribePromptText}>
              Premium members get one free event every month, plus complimentary 
              drinks and priority booking at all events.
            </Text>
            
            <TouchableOpacity 
              style={styles.subscribePromptButton}
              onPress={handleSubscribePrompt}
            >
              <Crown size={16} color="#A58E63" />
              <Text style={styles.subscribePromptButtonText}>Learn More About Premium</Text>
            </TouchableOpacity>
          </Animated.View>
        )}


      {/* Bottom Action */}
      {!isAlreadyRegistered && (
        <Animated.View
          entering={FadeInDown.delay(1200).duration(600)}
          style={styles.bottomAction}
        >
          <TouchableOpacity
            style={[
              styles.registerButton,
              (isProcessing || isAlreadyRegistered) && styles.registerButtonDisabled
            ]}
            onPress={handleRegisterAndPay}
            disabled={isProcessing || isAlreadyRegistered}
          >
            <CreditCard size={20} color="#F7F2E7" style={styles.buttonIcon} />
            <Text style={styles.registerButtonText}>
              {isProcessing 
                ? 'Processing...' 
                : isFreeForUser 
                  ? 'Register for Free' 
                  : `Register & Pay $${effectivePrice}`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E3D9C3',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 20,
    color: '#4B2E1E',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  titleCard: {
    margin: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: '#4B2E1E',
    flex: 1,
    marginRight: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: 'Literata-Bold',
    fontSize: 28,
    color: '#A58E63',
  },
  freeText: {
    fontFamily: 'Literata-Bold',
    fontSize: 28,
    color: '#16A34A',
  },
  priceLabel: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
  },
  detailsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 24,
  },
  sectionTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 12,
    color: '#A58E63',
    marginBottom: 2,
  },
  detailText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#4B2E1E',
  },
  descriptionCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 24,
  },
  description: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    lineHeight: 24,
    marginBottom: 20,
  },
  highlightBox: {
    backgroundColor: '#F7F2E7',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 16,
  },
  highlightTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#4B2E1E',
    marginBottom: 8,
  },
  highlightText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  includedCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 24,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  includedText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#4B2E1E',
    marginLeft: 12,
  },
  registeredCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  registeredTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#15803D',
    marginTop: 12,
    marginBottom: 8,
  },
  registeredText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#16A34A',
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 24,
  },
  paymentSummary: {
    backgroundColor: '#F7F2E7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
  },
  summaryValue: {
    fontFamily: 'Literata-Regular',
    fontSize: 16,
    color: '#4B2E1E',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E3D9C3',
    marginVertical: 8,
  },
  summaryTotal: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
  },
  paymentNoteText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
  premiumBenefitsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#15803D',
    marginLeft: 8,
  },
  premiumBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumBenefitText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#16A34A',
    marginLeft: 8,
  },
  subscribePromptCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(165, 142, 99, 0.1)',
    borderWidth: 2,
    borderColor: '#A58E63',
    borderRadius: 16,
    padding: 20,
  },
  subscribePromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribePromptTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginLeft: 8,
  },
  subscribePromptText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
    marginBottom: 16,
  },
  subscribePromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F2E7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3D9C3',
  },
  subscribePromptButtonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#A58E63',
    marginLeft: 6,
  },
  bottomAction: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E3D9C3',
    backgroundColor: '#F7F2E7',
  },
  registerButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: '#A58E63',
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
  },
});