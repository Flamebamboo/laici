import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PressableScale from './PressableScale';

const Button = ({ children, onPress }) => {
  return (
    <PressableScale onPress={onPress} s>
      <LinearGradient
        colors={['#4F5BDC', '#8C08C2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.text}>{children}</Text>
      </LinearGradient>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'Lato_400Regular',
    fontSize: 20,
  },
});

export default Button;
