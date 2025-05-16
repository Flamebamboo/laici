import { Blur, Canvas, RadialGradient, Rect } from '@shopify/react-native-skia';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: WindowWidth, height: WindowHeight } = Dimensions.get('window');

function GlowCircle() {
  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={WindowWidth} height={WindowHeight} color="blue">
          <RadialGradient
            c={{ x: WindowWidth / 2, y: WindowHeight / 2 }}
            r={WindowWidth / 2}
            colors={['#3693FF', 'black']}
          />
          <Blur blur={100} />
        </Rect>
      </Canvas>
    </View>
  );
}

export default GlowCircle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: WindowHeight,
    width: WindowWidth,
  },
});
