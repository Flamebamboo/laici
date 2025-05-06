import React from "react";
import { Text, View } from "react-native";

const Home = () => {
  console.log("Home component rendered");
  return (
    <View className="flex-1 justify-center items-center bg-black ">
      <Text className="text-xl text-white bg-black">homeeeex</Text>
    </View>
  );
};

export default Home;
