import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import Common_styles from '../lib/common_styles'
interface Props {
  visible: boolean
  message: string
  onClose: () => void
}

const ErrorModal = ({ visible, message, onClose }: Props) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={Common_styles.overlay}>
        <View style={[Common_styles.modal, { backgroundColor: '#fdecea' }]}>
          <Text style={Common_styles.alertTitle}>
            <View style={Common_styles.iconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#b71c1c" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg>
            </View>
          </Text>
          <Text style={[Common_styles.alertMessage, { color: '#b71c1c' }]}>{message}

          </Text>
          <TouchableOpacity style={[Common_styles.AlertButton, { backgroundColor: '#b71c1c' }]} onPress={onClose}>
            <Text style={Common_styles.AlertButtonText}>關閉</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ErrorModal

