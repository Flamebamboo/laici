import React, { useState } from "react";
import { Image, View } from "react-native";

const Index = () => {
  const [imageBase64, setImageBase64] = useState(null);

  async function fetchImage(prompt, params = {}) {
    const defaultParams = {
      // width: 1024, height: 1024 // Defaults are handled by API
    };
    const queryParams = new URLSearchParams({ ...defaultParams, ...params });
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${queryParams.toString()}`;

    console.log("Fetching image from:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const imageBlob = await response.blob();

      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Base64 string
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }

  // useEffect(() => {
  //   fetchImage("Nissan Skyline GT-R R35");
  // }, []);

  return <View className="flex-1 justify-center items-center">{imageBase64 && <Image source={{ uri: imageBase64 }} className="w=[300px] h-[300px]" />}</View>;
};

export default Index;
