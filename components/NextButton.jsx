import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const NextButton = ({ children, onPress, disabled }) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      {disabled ? (
        <Text style={[styles.gradient, { backgroundColor: 'grey', opacity: 0.5 }, styles.text]}>{children}</Text>
      ) : (
        <LinearGradient
          colors={['#4F5BDC', '#8C08C2']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.text}>{children}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
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

export default NextButton;
