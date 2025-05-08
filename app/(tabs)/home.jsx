import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import UploadImage from '../../components/UploadImage';

const Home = () => {
  const { width, height } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#03224C', '#05062A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.background, { height: height }]}
      />
      <View style={styles.mainWrapper}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Laici AI</Text>
        </View>
        <Text style={[styles.title, { width: width * 0.8, fontSize: Math.min(width * 0.06, 32) }]}>
          Turn Phone Photos Into Proffesional Product Listing
        </Text>
        {/* GlowCircle behind UploadImage */}

        <UploadImage />

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
    marginHorizontal: 40,
  },
  logo: {
    color: 'white',
    width: '100%',
    fontWeight: 'bold',
    fontSize: 24,
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default Home;
