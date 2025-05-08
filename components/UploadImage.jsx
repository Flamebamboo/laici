import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { analyzeImage } from '../utils/pollinationClient';
import GlowCircle from './GlowComponent';

const UploadImage = () => {
  const { width, height } = useWindowDimensions();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets);
    if (!result.canceled) {
      setLoading(true);
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: width * 0.8, height: height * 0.3, maxHeight: 400, maxWidth: 600 }]}
      onPress={!image ? pickImage : undefined}
      activeOpacity={image ? 1 : 0.7}
    >
      <GlowCircle color="#3693FF" size={300} blur={140} />
      {!image ? (
        <>
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
          <View style={styles.contentWrapper}>
            <Text style={[styles.title, { fontSize: Math.min(width * 0.04, 24) }]}>Drop your photo here</Text>
            <Text style={[styles.subtitle, { fontSize: Math.min(width * 0.03, 16) }]}>or click to upload </Text>
          </View>
          <View style={styles.supportTextWrapper}>
            <Text style={[styles.supportText, { fontSize: Math.min(width * 0.03, 16) }]}>
              Supports PNG, JPG, WEBP (max --MB)
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.imageWrapper}>
          {loading && <ActivityIndicator size="large" color="#3693FF" style={styles.loader} />}
          <Image
            style={styles.image}
            contentFit="cover"
            transition={500}
            source={{ uri: image }}
            onLoadEnd={() => setLoading(false)}
          />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Feather name="x" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',

    margin: 10,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'white',
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
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loader: {
    position: 'absolute',
    zIndex: 2,
    alignSelf: 'center',
    top: '45%',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#5558FF',
    borderRadius: 12,
    padding: 4,
    zIndex: 3,
    elevation: 2,
  },
});

export default UploadImage;
