// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export const downloadImage = async (image) => {
  if (Platform.OS === 'web') {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'downloaded_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    //IOS AND ANDROID
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        await MediaLibrary.createAlbumAsync('Laici AI Images', asset, false);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(image);
        }
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  }
};

{
  /*
    Notes for web download.

    const link = document.createElement('a');
    - This creates a new a tag eleement in the web page or DOM you call it.

    link.href = image;
    - This sets the href attribute to the image value 
    - Image in this case is base64. Typically it would be a URL too.
    
    link.download = 'name of the file';
    - tells the browser when this link is clicked, it should download the image instead of navigating to it.

    document.body.appendChild(link);
    - this adds the a tag (link) to the DOM


    link.click();
    - this triggers the click event which starts the download

    document.body.removeChild(link);
    - this removes the link from the DOM after the download is initiated why? because we don't need it anymore and we want to keep the DOM clean.
    

    */
}
