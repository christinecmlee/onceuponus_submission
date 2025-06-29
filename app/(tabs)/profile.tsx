import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl
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

export default function ProfileTab() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { user, clearUserData } = useUser();
  const router = useRouter();

  // Mock data for user's literary type
  const literaryType = LITERARY_TYPES.romantic; // This would come from user data

  // Get upcoming events from user context, fallback to empty array
  const upcomingEvents = user?.upcomingEvents || [];

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
        {/* Literary Type Section */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.typeSection}
        >
          <View style={styles.typeCard}>
            <View style={styles.typeHeader}>
              <Star size={32} color="#A58E63" />
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>{literaryType.name}</Text>
                <Text style={styles.typeDescription}>{literaryType.description}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Full Profile</Text>
              <ChevronRight size={16} color="#A58E63" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Upcoming Events */}
        <Animated.View 
          entering={FadeInUp.delay(400).duration(600)}
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
          entering={FadeInUp.delay(600).duration(600)}
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
        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)}
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
  headerTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 28,
    color: '#4B2E1E',
  },
  scrollView: {
    flex: 1,
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
});