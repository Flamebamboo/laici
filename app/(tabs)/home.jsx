import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Survey from '../../components/Survey';
import UploadImage from '../../components/UploadImage';
import surveyQuestions from '../../utils/surveyData.json';

import { Feather } from '@expo/vector-icons';
import { useImage } from '../../Context/ImageProvider';
import GlowCircle from '../../components/GlowComponent';
import ImageModal from '../../components/ImageModal';
import NextButton from '../../components/NextButton';
import { analyzeImage } from '../../utils/pollinationClient';

import { downloadImage } from '../../components/downloadImage';

const Home = () => {
  const { width, height } = useWindowDimensions();
  const [step, setStep] = useState(1);
  const { image, setImage } = useImage();

  const [surveyIndex, setSurveyIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
      setHeadline('Your Professional Product Image');
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

  // disable Next if no image on step 1, or no answer on current survey step
  const isNextDisabled =
    step === 1
      ? !image
      : surveyIndex < surveyQuestions.length
      ? !surveyAnswers[surveyQuestions[surveyIndex].id]
      : false;

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
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImg} source={require('../../assets/images/laicilogo.png')} contentFit="cover" />
            <Text style={styles.logo}>Laici AI</Text>
          </View>

          {step > 1 && (
            <TouchableOpacity
              onPress={step === 2 && surveyIndex === 0 ? () => setStep(1) : handleSurveyBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={24} color="#3693FF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { width: width * 0.8, fontSize: Math.min(width * 0.06, 32) }]}>{headline}</Text>
        </View>

        {/* Content section */}
        {step === 1 ? (
          <UploadImage setHeadline={setHeadline} />
        ) : image && surveyIndex >= surveyQuestions.length ? (
          <View style={styles.resultContainer}>
            <TouchableOpacity style={styles.imageContainer} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
              <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
              <View style={styles.expandIcon}>
                <Feather name="maximize-2" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={() => {
                  setSurveyIndex(0);
                  setStep(1);
                  setSurveyAnswers({});
                  setHeadline('Turn Phone Photos Into Professional Product Listing');
                }}
              >
                <Feather name="refresh-cw" size={18} color="#3693FF" style={styles.buttonIcon} />
                <Text style={styles.restartButtonText}>Create another</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={downloadImage(image)} style={styles.downloadButton}>
                <Feather name="download" size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.downloadButtonText}>Save image</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Survey
            setHeadline={setHeadline}
            current={surveyIndex}
            answers={surveyAnswers}
            onSelect={handleSurveySelect}
          />
        )}

        <NextButton onPress={handleNext} disabled={isNextDisabled}>
          Next
        </NextButton>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Powered by Laici AI</Text>
        </View>

        {/* Image Modal */}
        <ImageModal visible={modalVisible} image={image} onClose={() => setModalVisible(false)} />
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
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  expandIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  generatingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato_400Regular',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    width: '100%',
  },
  restartButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(54, 147, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3693FF',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  downloadButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3693FF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
    fontWeight: 'bold',
  },

  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(54, 147, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default Home;
