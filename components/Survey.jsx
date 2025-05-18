import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import surveyQuestions from '../utils/surveyData.json';

const Survey = ({ setHeadline, current, answers, onSelect, onNext }) => {
  const { width, height } = useWindowDimensions();

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

  useEffect(() => {
    setHeadline && setHeadline('Answer a few questions to customize your product photo');

    const handleKeyDown = (event) => {
      if (event.key >= '1' && event.key <= '4') {
        const index = parseInt(event.key) - 1;
        const options = currentQuestion?.options || [];

        if (options[index]) {
          handleOptionSelect(options[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setHeadline, current, selectedOption, onNext]);

  return (
    <View style={[styles.container, { width: width, maxHeight: 450, maxWidth: 700 }]}>
      {/* Progress indicator section */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>{`Question ${current + 1} of ${surveyQuestions.length}`}</Text>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} entering={FadeIn.duration(300)} />
        </View>
      </View>

      {/* Question section */}
      <View style={styles.questionSection}>
        <Animated.Text
          style={styles.questionText}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(200)}
        >
          {currentQuestion.question}
        </Animated.Text>
      </View>

      {/* Options section */}
      <Animated.View style={styles.optionsContainer} entering={FadeIn.duration(400).delay(150)}>
        {currentQuestion.options.map((option) => (
          <Animated.View
            key={option.id}
            style={styles.optionWrapper}
            entering={FadeIn.duration(400).delay(200 + option.id * 50)}
          >
            <TouchableOpacity
              style={[styles.questionContainer, selectedOption === option.id && styles.selectedOption]}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 40,
  },
  progressSection: {
    width: '85%',
    marginBottom: 15,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: 'Lato_400Regular',
    opacity: 0.8,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3693FF',
    borderRadius: 3,
  },
  questionSection: {
    width: '85%',
    marginBottom: 20,
  },
  questionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'Lato_400Regular',
    lineHeight: 26,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  optionWrapper: {
    width: '85%',
    marginVertical: 6,
  },
  questionContainer: {
    padding: 16,
    width: '100%',
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
