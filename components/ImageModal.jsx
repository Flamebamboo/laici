import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Modal, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const ImageModal = ({ visible, image, onClose }) => {
  const { width, height } = useWindowDimensions();

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <Animated.View style={styles.modalContainer} entering={FadeIn.duration(300)}>
        <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />

        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Feather name="x" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={[styles.imageWrapper, { width: width * 0.9, height: width * 0.9 }]}>
          <Image source={{ uri: image }} style={styles.fullImage} contentFit="contain" transition={300} />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#3693FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(54, 147, 255, 0.15)',
    borderRadius: 30,
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageModal;
