import React from 'react'
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native'

interface LoadingModalProps {
  visible: boolean
}

const LoadingModal = ({ visible }: LoadingModalProps) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.text}>資料庫讀取中...</Text>
        </View>
      </View>
    </Modal>
  )
}

export default LoadingModal

const styles = StyleSheet.create({
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
