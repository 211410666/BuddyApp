import React from 'react'
import { Modal, View, Text, ActivityIndicator, StyleSheet,Image } from 'react-native'

interface LoadingModalProps {
  visible: boolean
}

const LoadingModal = ({ visible }: LoadingModalProps) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image
            source={require('../assets/loading.png')}
            style={styles.textImage}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    </Modal>
  )
}

export default LoadingModal

const styles = StyleSheet.create({
  textImage: {
    width: 120,
    height: 120,
    marginBottom: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 200,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
})
