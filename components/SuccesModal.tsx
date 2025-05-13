import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
  visible: boolean
  message: string
  onClose: () => void
}

const SuccessModal = ({ visible, message, onClose }: Props) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>✅ 完成</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>關閉</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default SuccessModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#e7fce7',
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
