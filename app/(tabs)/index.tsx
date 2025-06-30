import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { RotateCcw, Calendar, MapPin, Clock, Sparkles, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';

const { width } = Dimensions.get('window');

const DAILY_QUOTES = [
  {
    text: "The very best thing you can do for the whole world is to make the most of yourself.",
    author: "Wallace Wattles",
    book: "The Science of Getting Rich"
  },
  {
    text: "It is never too late to be what you might have been.",
    author: "George Eliot",
    book: "Silas Marner"
  },
  {
    text: "Tomorrow belongs to those who can hear it coming.",
    author: "David Bowie",
    book: "The Man Who Sold the World"
  }
];

const MOCK_INVITE = {
  id: "dark-romance-culver-city-2025", // Fixed ID for consistent identification
  theme: "Dark Romance",
  neighborhood: "Culver City",
  date: "Friday, Jul 17, 2025",
  time: "7:00 PM",
  deadline: "48 hours",
  description: "An evening exploring the shadows and passion of gothic literature, where love meets mystery in candlelit conversations."
};

export default function InvitesTab() {
  const router = useRouter();
  const { user } = useUser();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [hasInvite, setHasInvite] = useState(true);
  const flipAnimation = useSharedValue(0);

  const currentQuote = DAILY_QUOTES[quoteIndex];
  
  // Check if user is already registered for this event
  const isAlreadyRegistered = user?.upcomingEvents?.some(
    event => event.id === MOCK_INVITE.id
  ) || false;

  const flipCard = () => {
    flipAnimation.value = withTiming(showBack ? 0 : 180, { duration: 600 });
    setTimeout(() => setShowBack(!showBack), 300);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        rotateY: `${interpolate(flipAnimation.value, [0, 180], [0, 180])}deg` 
      }
    ],
    opacity: interpolate(flipAnimation.value, [0, 90, 180], [1, 0, 0]),
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        rotateY: `${interpolate(flipAnimation.value, [0, 180], [180, 360])}deg` 
      }
    ],
    opacity: interpolate(flipAnimation.value, [0, 90, 180], [0, 0, 1]),
  }));

  const handleRSVP = () => {
    // Navigate to event details with all event data
    router.push({
      pathname: '/event-details/[id]',
      params: {
        id: MOCK_INVITE.id,
        theme: MOCK_INVITE.theme,
        description: MOCK_INVITE.description,
        neighborhood: MOCK_INVITE.neighborhood,
        date: MOCK_INVITE.date,
        time: MOCK_INVITE.time,
        deadline: MOCK_INVITE.deadline,
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Page</Text>
        <Image 
          source={require('@/assets/images/ChatGPT Image Jun 29, 2025, 07_02_37 PM.png')}
          style={styles.logoImage}
        />
        {user?.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>Premium Member</Text>
          </View>
        )}
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Daily Quote Card */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.quoteSection}
        >
          <View style={styles.quoteCardContainer}>
            <Animated.View style={[styles.quoteCard, frontAnimatedStyle]}>
              <View style={styles.quoteContent}>
                <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
                <TouchableOpacity 
                  style={styles.flipButton}
                  onPress={flipCard}
                >
                  <RotateCcw size={20} color="#A58E63" />
                  <Text style={styles.flipText}>Reveal Author</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View style={[styles.quoteCard, styles.quoteCardBack, backAnimatedStyle]}>
              <View style={styles.quoteContent}>
                <Text style={styles.authorText}>{currentQuote.author}</Text>
                <Text style={styles.bookText}>{currentQuote.book}</Text>
                <TouchableOpacity 
                  style={styles.flipButton}
                  onPress={flipCard}
                >
                  <RotateCcw size={20} color="#A58E63" />
                  <Text style={styles.flipText}>Back to Quote</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Event Invite Section */}
        {hasInvite && (
          <Animated.View 
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.inviteSection}
          >
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color="#A58E63" />
              <Text style={styles.sectionTitle}>New Invitation</Text>
            </View>

            <View style={styles.inviteCard}>
              <View style={styles.inviteHeader}>
                <Text style={styles.inviteTheme}>{MOCK_INVITE.theme}</Text>
                <View style={styles.deadlineContainer}>
                  <Clock size={16} color="#DC2626" />
                  <Text style={styles.deadlineText}>{MOCK_INVITE.deadline} to RSVP</Text>
                </View>
              </View>

              <Text style={styles.inviteDescription}>
                {MOCK_INVITE.description}
              </Text>

              <View style={styles.inviteDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={18} color="#5C3D2E" />
                  <Text style={styles.detailText}>{MOCK_INVITE.neighborhood}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={18} color="#5C3D2E" />
                  <Text style={styles.detailText}>
                    {MOCK_INVITE.date} at {MOCK_INVITE.time}
                  </Text>
                </View>
              </View>

              {isAlreadyRegistered ? (
                <View style={styles.registeredContainer}>
                  <CheckCircle size={20} color="#16A34A" />
                  <Text style={styles.registeredText}>You are in!</Text>
                </View>
              ) : user?.isPremium ? (
                <TouchableOpacity 
                  style={styles.premiumRsvpButton}
                  onPress={handleRSVP}
                >
                  <Text style={styles.premiumRsvpButtonText}>Register (Free with Premium)</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.rsvpButton}
                  onPress={handleRSVP}
                >
                  <Text style={styles.rsvpButtonText}>RSVP ($25)</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}
        
        {/* Premium Early Access Notice */}
        {user?.isPremium && (
          <Animated.View 
            entering={FadeInUp.delay(500).duration(600)}
            style={styles.earlyAccessCard}
          >
            <Text style={styles.earlyAccessTitle}>🌟 Premium Early Access</Text>
            <Text style={styles.earlyAccessText}>
              You have priority booking for all upcoming events. New events are announced to Premium members 24 hours before general availability.
            </Text>
          </Animated.View>
        )}

        {/* Past Events Section */}
        <Animated.View 
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.pastEventsSection}
        >
          <Text style={styles.sectionTitle}>Past Gatherings</Text>
          <View style={styles.pastEventCard}>
            <Text style={styles.pastEventTitle}>Midnight in the Garden</Text>
            <Text style={styles.pastEventDate}>December 2024</Text>
            <Text style={styles.pastEventDescription}>
              An evening of Southern Gothic literature and mysterious tales.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E3D9C3',
  },
  logoImage: {
    width: 120,
    height: 34,
    resizeMode: 'contain',
    tintColor: '#4B2E1E',
  },
  headerTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 19.6,
    color: '#4B2E1E',
  },
  headerDate: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
  },
  scrollView: {
    flex: 1,
  },
  quoteSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  quoteCardContainer: {
    position: 'relative',
    height: 180,
  },
  quoteCard: {
    position: 'absolute',
    width: '100%',
    height: 180,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    backfaceVisibility: 'hidden',
  },
  quoteCardBack: {
    position: 'absolute',
  },
  quoteContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  quoteText: {
    fontFamily: 'Cormorant-Medium',
    fontSize: 18,
    color: '#4B2E1E',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  authorText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 20,
    color: '#4B2E1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  bookText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F7F2E7',
    borderRadius: 20,
  },
  flipText: {
    fontFamily: 'Literata-Regular',
    fontSize: 12,
    color: '#A58E63',
    marginLeft: 6,
  },
  inviteSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
    marginLeft: 8,
  },
  inviteCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 20,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  inviteTheme: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 22,
    color: '#4B2E1E',
    flex: 1,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  deadlineText: {
    fontFamily: 'Literata-Regular',
    fontSize: 10,
    color: '#DC2626',
    marginLeft: 4,
  },
  inviteDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    lineHeight: 22,
    marginBottom: 20,
  },
  inviteDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Literata-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    marginLeft: 8,
  },
  rsvpButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  rsvpButtonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
  },
  premiumRsvpButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumRsvpButtonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  premiumBadgeText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  registeredContainer: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  registeredText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#15803D',
    marginLeft: 8,
  },
  earlyAccessCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
  },
  earlyAccessTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#92400E',
    marginBottom: 8,
  },
  earlyAccessText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#92400E',
    lineHeight: 18,
  },
  pastEventsSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  pastEventCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 16,
    opacity: 0.8,
  },
  pastEventTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginBottom: 4,
  },
  pastEventDate: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
    marginBottom: 8,
  },
  pastEventDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 18,
  },
});