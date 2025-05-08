import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { analyzeImage } from '../utils/pollinationClient';
import GlowCircle from './GlowComponent';
const UploadImage = () => {
  const { width, height } = useWindowDimensions();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: width * 0.8, height: height * 0.3, maxHeight: 400, maxWidth: 600 }]}
      onPress={pickImage}
    >
      <View
        style={{
          position: 'absolute',
          top: 50,
          backgroundColor: '#A1C3FE',
          width: 64,
          height: 64,
          borderRadius: 99,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Feather name="upload" size={32} color="#5558FF" />
      </View>

      <GlowCircle color="#3693FF" size={300} blur={140} />
      <View style={styles.contentWrapper}>
        <Text style={[styles.title, { fontSize: Math.min(width * 0.04, 24) }]}>Drop your photo here</Text>
        <Text style={[styles.subtitle, { fontSize: Math.min(width * 0.03, 16) }]}>or click to upload </Text>
      </View>

      <View style={styles.supportTextWrapper}>
        <Text style={[styles.supportText, { fontSize: Math.min(width * 0.03, 16) }]}>
          Supports PNG, JPG, WEBP (max --MB)
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 10,
    borderRadius: 20,
    borderStyle: 'dashed',
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportTextWrapper: {
    position: 'absolute',
    bottom: 40,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato_700Bold',
  },
  subtitle: {
    color: 'white',
    fontWeight: 'light',
    marginTop: 10,
    fontFamily: 'Lato_400Regular',
  },

  supportText: {
    color: '#898989',
    fontWeight: 'Regular',
    marginTop: 200,
    fontFamily: 'Lato_400Regular',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default UploadImage;
