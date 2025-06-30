import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { 
  PenTool, 
  BookOpen, 
  Users, 
  Sparkles, 
  Clock,
  ArrowRight
} from 'lucide-react-native';

const STORY_GENRES = [
  'Mystery & Suspense',
  'Romance',
  'Fantasy & Magic',
  'Historical Fiction',
  'Science Fiction',
  'Literary Fiction'
];

const FEATURED_CHARACTERS = [
  {
    name: 'Elena Rosewood',
    description: 'A mysterious antiquarian with secrets in her past',
    genre: 'Mystery & Suspense'
  },
  {
    name: 'Captain Magnus Blackwell',
    description: 'A reformed pirate seeking redemption on land',
    genre: 'Historical Fiction'
  },
  {
    name: 'Dr. Lydia Chen',
    description: 'A brilliant scientist making moral choices in a dystopian future',
    genre: 'Science Fiction'
  }
];

export default function StoryBuilderTab() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStory = () => {
    if (!selectedGenre) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      // Navigate to story creation flow
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Story Builder</Text>
        <Text style={styles.headerSubtitle}>Create with AI</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Coming Soon Notice */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.comingSoonCard}
        >
          <View style={styles.comingSoonHeader}>
            <Sparkles size={24} color="#A58E63" />
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          </View>
          <Text style={styles.comingSoonText}>
            The Story Builder will launch after our first events begin. 
            Join an event to unlock collaborative storytelling!
          </Text>
        </Animated.View>

        {/* How It Works */}
        <Animated.View 
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>How Story Builder Works</Text>
          
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Attend an Event</Text>
              <Text style={styles.stepDescription}>
                Check in at a Chapter & Verse gathering to unlock story creation
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose Your Character</Text>
              <Text style={styles.stepDescription}>
                Select from 4-6 characters inspired by the event's theme
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Write Your Ending</Text>
              <Text style={styles.stepDescription}>
                Craft a custom conclusion to the collaborative story
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>AI Weaves It Together</Text>
              <Text style={styles.stepDescription}>
                All participant endings are combined into one complete story
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Preview: Genre Selection */}
        <Animated.View 
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Preview: Genre Selection</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred storytelling style
          </Text>

          <View style={styles.genreGrid}>
            {STORY_GENRES.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={[
                  styles.genreCard,
                  selectedGenre === genre ? styles.genreCardSelected : null
                ]}
                onPress={() => setSelectedGenre(genre)}
                disabled
              >
                <Text style={[
                  styles.genreText,
                  selectedGenre === genre ? styles.genreTextSelected : null
                ]}>
                  {genre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Preview: Featured Characters */}
        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Preview: Character Gallery</Text>
          <Text style={styles.sectionDescription}>
            Meet some of the characters you might encounter
          </Text>

          {FEATURED_CHARACTERS.map((character, index) => (
            <View key={index} style={styles.characterCard}>
              <View style={styles.characterInfo}>
                <Text style={styles.characterName}>{character.name}</Text>
                <Text style={styles.characterDescription}>{character.description}</Text>
                <View style={styles.characterGenre}>
                  <Text style={styles.characterGenreText}>{character.genre}</Text>
                </View>
              </View>
              <View style={styles.characterAction}>
                <BookOpen size={20} color="#A58E63" />
              </View>
            </View>
          ))}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E3D9C3',
  },
  headerTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 19.6,
    color: '#4B2E1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#5C3D2E',
  },
  scrollView: {
    flex: 1,
  },
  comingSoonCard: {
    margin: 24,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: 16,
    padding: 20,
  },
  comingSoonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comingSoonTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#92400E',
    marginLeft: 8,
  },
  comingSoonText: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 16,
    color: '#92400E',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 18,
    color: '#4B2E1E',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    marginBottom: 16,
    lineHeight: 20,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#A58E63',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontFamily: 'Literata-Bold',
    fontSize: 14,
    color: '#F7F2E7',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    opacity: 0.6,
  },
  genreCardSelected: {
    borderColor: '#A58E63',
    backgroundColor: '#A58E63',
  },
  genreText: {
    fontFamily: 'Literata-Regular',
    fontSize: 14,
    color: '#4B2E1E',
    textAlign: 'center',
  },
  genreTextSelected: {
    color: '#F7F2E7',
  },
  characterCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#4B2E1E',
    marginBottom: 4,
  },
  characterDescription: {
    fontFamily: 'Cormorant-Regular',
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
    marginBottom: 8,
  },
  characterGenre: {
    backgroundColor: '#F7F2E7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  characterGenreText: {
    fontFamily: 'Literata-Regular',
    fontSize: 10,
    color: '#A58E63',
  },
  characterAction: {
    marginLeft: 16,
  },
});