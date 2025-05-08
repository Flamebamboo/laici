import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const PressableScale = ({ children, onPress, style }) => {
  const scale = useSharedValue(1);

  const handlePressUp = () => {
    if (onPress) {
      onPress();
    }
  };

  const gesture = Gesture.Tap()
    .onTouchesDown(() => {
      scale.value = withTiming(0.9);
    })
    .onTouchesUp(() => {
      runOnJS(handlePressUp)();
    })
    .onFinalize(() => {
      scale.value = withTiming(1);
    });

  const rButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, rButtonStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default PressableScale;
