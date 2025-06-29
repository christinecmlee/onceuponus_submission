import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { QUIZ_QUESTIONS, QuizQuestion } from '@/data/quiz';
import { useUser } from '@/contexts/UserContext';

const { width } = Dimensions.get('window');

export default function Quiz() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    if (user && !isInitialized) {
      const savedQuestion = user.quizProgressCurrentQuestion ?? 0;
      const savedAnswers = user.quizProgressAnswers ?? [];
      
      setCurrentQuestion(savedQuestion);
      setAnswers(savedAnswers);
      
      // Set selected option if we're resuming a question that was partially answered
      if (savedAnswers[savedQuestion] !== undefined) {
        setSelectedOption(savedAnswers[savedQuestion]);
      }
      
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);

    // Save progress to user context
    const nextQuestion = currentQuestion + 1;
    updateUser({
      quizProgressCurrentQuestion: nextQuestion,
      quizProgressAnswers: newAnswers
    });
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
    } else {
      // Quiz complete, calculate results
      calculateResults(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setSelectedOption(answers[currentQuestion - 1] ?? null);
      
      // Update saved progress
      updateUser({
        quizProgressCurrentQuestion: prevQuestion,
        quizProgressAnswers: answers
      });
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    const scores = {
      romantic: 0,
      detective: 0,
      dreamer: 0,
      rebel: 0,
      architect: 0,
      philosopher: 0,
      observer: 0,
      entertainer: 0
    };

    finalAnswers.forEach((answerIndex, questionIndex) => {
      const question = QUIZ_QUESTIONS[questionIndex];
      const option = question.options[answerIndex];
      
      Object.entries(option.scores).forEach(([type, score]) => {
        scores[type as keyof typeof scores] += score;
      });
    });

    // Find the highest scoring type
    const topType = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0];

    // Clear quiz progress since quiz is completed
    updateUser({
      literaryType: topType,
      quizProgressCurrentQuestion: undefined,
      quizProgressAnswers: undefined
    });
    router.push({
      pathname: '/onboarding/quiz-result',
      params: { literaryType: topType }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft size={24} color={currentQuestion === 0 ? "#A58E63" : "#4B2E1E"} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[styles.progressBar, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          key={currentQuestion}
          entering={FadeInRight.duration(400)}
          style={styles.questionContainer}
        >
          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index ? styles.optionButtonSelected : null
                ]}
                onPress={() => handleOptionSelect(index)}
              >
                <Text style={[
                  styles.optionText,
                  selectedOption === index ? styles.optionTextSelected : null
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            { opacity: selectedOption !== null ? 1 : 0.5 }
          ]}
          onPress={handleNext}
          disabled={selectedOption === null}
        >
          <Text style={styles.buttonText}>
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#F7F2E7" style={styles.buttonIcon} />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#E3D9C3',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#A58E63',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Literata-Regular',
    fontSize: 12,
    color: '#5C3D2E',
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  questionContainer: {
    paddingTop: 20,
  },
  questionText: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 24,
    color: '#4B2E1E',
    lineHeight: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3D9C3',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  optionButtonSelected: {
    borderColor: '#A58E63',
    backgroundColor: '#A58E63',
  },
  optionText: {
    fontFamily: 'Cormorant-Medium',
    fontSize: 16,
    color: '#4B2E1E',
    lineHeight: 22,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#F7F2E7',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: '#A58E63',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Literata-SemiBold',
    fontSize: 16,
    color: '#F7F2E7',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});