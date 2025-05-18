// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export const downloadImage = async (imageURI) => {
  if (Platform.OS === 'web') {
    //cant figure out how to download image on web still working on it
  }
};
