import { Stack } from "expo-router";
import React from "react";

const TabLayout = () => {
  console.log("Tabs layout rendered");

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabLayout;
