import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import surveyQuestions from '../utils/surveyData.json';

const Survey = ({ setHeadline, current, answers, onSelect, onBack, onNext }) => {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    setHeadline && setHeadline('Answer a few questions to customize your product photo');
  }, [setHeadline]);

  //surveyQuestions is an array of questions, we're accesing the question using the current index
  const currentQuestion = surveyQuestions[current];

  // Ensure currentQuestion is valid
  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', fontSize: 16 }}>No question available. Please check the survey data.</Text>
      </View>
    );
  }

  // answers is an object with question id as key and selected option id as value
  //example: {1: 2, 2: 3} means question 1 selected option 2 and question 2 selected option 3
  const selectedOption = answers[currentQuestion.id];
  const progress = ((current + 1) / surveyQuestions.length) * 100;

  const handleOptionSelect = (optionId) => {
    onSelect(optionId);
    // //create auto next question logic
    // if (onNext && current < surveyQuestions.length - 1) {
    //   onNext();
    // }
  };

  return (
    <View style={[styles.container, { width: width, maxHeight: 450, maxWidth: 700 }]}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} entering={FadeIn.duration(300)} />
      </View>
      <View style={styles.headerRow}>
        {current > 0 && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="chevron-left" size={24} color="#3693FF" />
          </TouchableOpacity>
        )}
        <Animated.Text
          style={styles.questionText}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(200)}
        >
          {currentQuestion.question}
        </Animated.Text>
      </View>

      {/* Options */}
      <Animated.View style={{ width: '100%', alignItems: 'center' }} entering={FadeIn.duration(400).delay(150)}>
        {currentQuestion.options.map((option) => (
          <Animated.View key={option.id} entering={FadeIn.duration(400).delay(200 + option.id * 50)}>
            <TouchableOpacity
              style={[
                styles.questionContainer,
                { width: width * 0.7, height: height * 0.06 },
                selectedOption === option.id && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.choiceText, selectedOption === option.id && styles.selectedText]}>
                {option.text}
              </Text>
              {selectedOption === option.id && (
                <Animated.View style={styles.checkmark} entering={FadeIn.duration(300)}>
                  <Feather name="check" size={18} color="#3693FF" />
                </Animated.View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
};

export default Survey;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  progressBarContainer: {
    width: '85%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3693FF',
    borderRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,

    width: '85%',
    alignSelf: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(54, 147, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Lato_400Regular',
    lineHeight: 24,
  },
  questionContainer: {
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 11,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#3693FF',
    backgroundColor: 'rgba(54,147,255,0.15)',
    borderWidth: 2,
  },
  choiceText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Lato_400Regular',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  checkmark: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};
