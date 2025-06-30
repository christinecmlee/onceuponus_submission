import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { 
  Star, 
  Calendar, 
  BookOpen, 
  ChevronRight,
  Award,
  Clock
} from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { LITERARY_TYPES } from '@/data/quiz';
import { MockRevenueCatService } from '@/services/MockRevenueCatService';

export default function ProfileTab() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { user, clearUserData } = useUser();
  const router = useRouter();

  // Get user's actual literary type from context
  const literaryType = user?.literaryType ? LITERARY_TYPES[user.literaryType] : null;

  // Get upcoming events from user context, fallback to empty array
  const upcomingEvents = user?.upcomingEvents || [];

  const handleResetData = async () => {
    try {
      console.log('Resetting all app data...');
      
      // Reset mock RevenueCat subscription status
      MockRevenueCatService.resetMockSubscription();
      
      // Clear all user data from context and storage
      await clearUserData();
      
      // Navigate back to onboarding
      router.replace('/onboarding');
      
      console.log('App data reset complete');
    } catch (error) {
      console.error('Error resetting app data:', error);
    }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate API call to refresh user data
    // In a real app, this would fetch the latest user data from your backend
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  const authoredStories = [
    {
      id: 1,
      title: "Shadows in the Garden",
      event: "Midnight in the Garden",
      date: "Dec 2024",
      reads: 24
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Literary Journey</Text>
        <Image 
          source={require('@/assets/images/ChatGPT Image Jun 29, 2025, 07_02_37 PM.png')}
          style={styles.logoImage}
        />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#A58E63"
            colors={["#A58E63"]}
            progressBackgroundColor="#F7F2E7"
          />
        }
      >
        {/* Premium Status Section */}
        {user?.isPremium && (
          <Animated.View 
            entering={FadeInUp.delay(100).duration(600)}
            style={styles.premiumSection}
          >
            <View style={styles.premiumCard}>
              <View style={styles.premiumHeader}>
                <Star size={24} color="#F59E0B" />
                <Text style={styles.premiumTitle}>Premium Member</Text>
              </View>
              <Text style={styles.premiumDescription}>
                You have unlimited access to all literary events and early booking privileges.
              </Text>
              <View style={styles.premiumBenefits}>
                <Text style={styles.premiumBenefitText}>✨ Free event attendance</Text>
                <Text style={styles.premiumBenefitText}>⚡ Early booking access</Text>
                <Text style={styles.premiumBenefitText}>🎯 Priority support</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Literary Type Section */}
        <Animated.View 
          entering={FadeInUp.delay(user?.isPremium ? 300 : 200).duration(600)}
          style={styles.typeSection}
        >
          {literaryType ? (
            <View style={styles.typeCard}>
              <View style={styles.typeHeader}>
                <Star size={32} color="#A58E63" />
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>{literaryType.name}</Text>
                  <Text style={styles.typeDescription}>{literaryType.description}</Text>
                </View>
              </View>
            
              <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={() => router.push({
                  pathname: '/onboarding/quiz-result',
                  params: { literaryType: user?.literaryType }
                })}
              >
                <Text style={styles.viewDetailsText}>View Full Profile</Text>
                <ChevronRight size={16} color="#A58E63" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.typeCard}>
              <View style={styles.noTypeHeader}>
                <BookOpen size={32} color="#A58E63" />
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>Discover Your Literary Identity</Text>
                  <Text style={styles.typeDescription}>
                    Take our quiz to discover your unique reading personality and connect with like-minded literary enthusiasts.
                  </Text>
                </View>
              </View>
            
              <TouchableOpacity 
                style={styles.takeQuizButton}
                onPress={() => router.push('/onboarding/quiz-intro')}
              >
                <Text style={styles.takeQuizText}>Take Literary Quiz</Text>
                <ChevronRight size={16} color="#F7F2E7" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Upcoming Events */}
        <Animated.View 
          entering={FadeInUp.delay(user?.isPremium ? 500 : 400).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#A58E63" />
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
          </View>

          {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
                {event.status === 'confirmed' && (
                  <View style={styles.confirmedBadge}>
                    <Text style={styles.confirmedText}>Confirmed</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={styles.checkInButton}>
                <Clock size={16} color="#A58E63" />
                <Text style={styles.checkInText}>Check In</Text>
              </TouchableOpacity>
            </View>
          )) : (
            <View style={styles.emptyEventsCard}>
              <Calendar size={32} color="#A58E63" />
              <Text style={styles.emptyEventsTitle}>No Upcoming Events</Text>
              <Text style={styles.emptyEventsText}>
                Register for events in the Invites tab to see them here.
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Authored Stories */}
        <Animated.View 
          entering={FadeInUp.delay(user?.isPremium ? 700 : 600).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color="#A58E63" />
            <Text style={styles.sectionTitle}>Authored by You</Text>
          </View>

          {authoredStories.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyCard}>
              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyEvent}>From "{story.event}"</Text>
                <Text style={styles.storyDate}>{story.date}</Text>
              </View>
              
              <View style={styles.storyStats}>
                <Award size={16} color="#A58E63" />
                <Text style={styles.readsText}>{story.reads} reads</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Stories</Text>
            <ChevronRight size={16} color="#A58E63" />
          </TouchableOpacity>
        </Animated.View>

        {/* Literary Insights */}
        {literaryType && (
          <Animated.View 
            entering={FadeInUp.delay(user?.isPremium ? 900 : 800).duration(600)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Your Literary Insights</Text>
          
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Core Drive</Text>
              <Text style={styles.insightText}>{literaryType.coreDrive}</Text>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>You Connect Well With</Text>
              <View style={styles.pairingsContainer}>
                {literaryType.strongPairings.map((pairing, index) => (
                  <View key={index} style={styles.pairingTag}>
                    <Text style={styles.pairingText}>{pairing}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Reset Data Section (for testing) */}
        <Animated.View 
          entering={FadeInUp.delay(user?.isPremium ? 1100 : 1000).duration(600)}
          style={styles.resetSection}
        >
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetData}
          >
            <Text style={styles.resetButtonText}>Reset App Data (Testing)</Text>
          </TouchableOpacity>
          <Text style={styles.resetWarning}>
            This will clear all your data and return you to the welcome screen
          </Text>
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
  scrollView: {
    flex: 1,
  },
  premiumSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  premiumCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: 16,
    padding: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumTitle: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 20,
    color: '#92400E',
    marginLeft: 12,
  },
  premiumDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#92400E',
    lineHeight: 22,
    marginBottom: 16,
  },
  premiumBenefits: {
    gap: 4,
  },
  premiumBenefitText: {
    fontFamily: 'Literata-Regular',
    fontSize: 14,
    color: '#92400E',
  },
  typeSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    padding: 20,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  typeName: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 22,
    color: '#4B2E1E',
    marginBottom: 8,
  },
  typeDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
    lineHeight: 22,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F7F2E7',
    borderRadius: 12,
  },
  viewDetailsText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#A58E63',
    marginRight: 4,
  },
  noTypeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  takeQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#A58E63',
    borderRadius: 12,
  },
  takeQuizText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#F7F2E7',
    marginRight: 4,
  },
  section: {
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
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginBottom: 4,
  },
  eventDate: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    marginBottom: 6,
  },
  confirmedBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  confirmedText: {
    fontFamily: 'Literata-Regular',
    fontSize: 10,
    color: '#16A34A',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2E7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  checkInText: {
    fontFamily: 'Literata-Regular',
    fontSize: 12,
    color: '#A58E63',
    marginLeft: 4,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storyInfo: {
    flex: 1,
  },
  storyTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginBottom: 4,
  },
  storyEvent: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  storyDate: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
  },
  storyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readsText: {
    fontFamily: 'Literata-Regular',
    fontSize: 12,
    color: '#A58E63',
    marginLeft: 4,
  },
  emptyEventsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyEventsTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyEventsText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F7F2E7',
    borderRadius: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#A58E63',
    marginRight: 4,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#4B2E1E',
    marginBottom: 8,
  },
  insightText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  pairingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pairingTag: {
    backgroundColor: '#F7F2E7',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pairingText: {
    fontFamily: 'Literata-Regular',
    fontSize: 12,
    color: '#4B2E1E',
  },
  resetSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  resetButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  resetButtonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  resetWarning: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 12,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 16,
  },
});