import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Survey from '../../components/Survey';
import UploadImage from '../../components/UploadImage';
import surveyQuestions from '../../utils/surveyData.json';

import { useImage } from '../../Context/ImageProvider';
import GlowCircle from '../../components/GlowComponent';
import NextButton from '../../components/NextButton';
import { analyzeImage } from '../../utils/pollinationClient';

const Home = () => {
  const { width, height } = useWindowDimensions();
  const [step, setStep] = useState(1);
  const { image, setImage } = useImage();

  const [surveyIndex, setSurveyIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState({});

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSurveySelect = (optionId) => {
    setSurveyAnswers({ ...surveyAnswers, [surveyQuestions[surveyIndex].id]: optionId });

    // surveyAnswers looks like this: {1: 2, 2: 3}
  };

  const handleSurveyBack = () => {
    if (surveyIndex > 0) {
      setSurveyIndex(surveyIndex - 1);
    }
  };

  const [headline, setHeadline] = useState('Turn Phone Photos Into Professional Product Listing');

  //handleGenerate function to extract the answers from survey (not just ID)
  //we have survey answers with question ID and selected option ID
  //need to map the selected option ID to the actual answer text
  //Pass that answers to analyzeImage

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      // Map through surveyQuestions and extract the answers
      const answers = surveyQuestions.map((question) => {
        const selectedOptionId = surveyAnswers[question.id];
        const selectedOption = question.options.find((option) => option.id === selectedOptionId);

        return {
          questionId: question.id,
          answer: selectedOption ? selectedOption.text : null,
        };
      });

      const formattedAnswers = {};
      answers.forEach((item) => {
        if (item.answer) {
          formattedAnswers[item.questionId] = item.answer;
        }
      });

      await analyzeImage(image, setImage, answers);
    } catch (error) {
      console.error('Errorrr:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (surveyIndex < surveyQuestions.length - 1) {
      setSurveyIndex(surveyIndex + 1);
    } else {
      handleGenerate();
      setSurveyIndex(surveyQuestions.length);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#03224C', '#05062A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.background, { height: height }]}
      />
      <GlowCircle />

      <View style={styles.mainWrapper}>
        <View style={styles.logoContainer}>
          <Image style={styles.logoImg} source={require('../../assets/images/laicilogo.png')} contentFit="cover" />
          <Text style={styles.logo}>Laici AI</Text>
        </View>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[styles.title, { width: width * 0.8, fontSize: Math.min(width * 0.06, 32) }]}>{headline}</Text>
        </View>

        {/* GlowCircle behind UploadImage */}

        {step === 1 ? (
          <UploadImage setHeadline={setHeadline} />
        ) : image && surveyIndex >= surveyQuestions.length ? (
          // Show the final image if we've completed all survey questions
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.generatingText}>Your professional product image:</Text>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
            </View>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={() => {
                setSurveyIndex(0);
                setSurveyAnswers({});
              }}
            >
              <Text style={styles.restartButtonText}>Create another image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Survey
            setHeadline={setHeadline}
            current={surveyIndex}
            answers={surveyAnswers}
            onSelect={handleSurveySelect}
            onNext={handleNext}
            onBack={handleSurveyBack}
          />
        )}

        <NextButton onPress={handleNext}>Next</NextButton>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Powered by Laici AI</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05062A',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,

    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImg: {
    width: 64,
    height: 64,
  },
  logo: {
    color: 'white',
    width: '100%',
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: 'Lato_400Regular',
  },
  title: {
    color: 'white',
    fontWeight: 'semibold',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Lato_400Regular',
  },

  footerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 14,
    fontFamily: 'Lato_400Regular',
  },
  imageContainer: {
    width: 320,
    height: 320,
    borderRadius: 20,
    shadowColor: '#3693FF',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    backgroundColor: 'rgba(54, 147, 255, 0.1)',
    padding: 10,
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  generatingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato_400Regular',
    marginBottom: 10,
  },
  restartButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(54, 147, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3693FF',
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
  },
});

export default Home;
