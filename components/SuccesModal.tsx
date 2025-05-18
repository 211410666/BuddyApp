import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import Common_styles from '../lib/common_styles'


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
      <View style={Common_styles.overlay}>
        <View style={Common_styles.modal}>
          <Text style={Common_styles.alertTitle}><FontAwesome name="check-circle" size={24} color="#33cc61" /></Text>
          <Text style={Common_styles.alertMessage}>{message}</Text>
          <TouchableOpacity style={Common_styles.AlertButton} onPress={onClose}>
            <Text style={Common_styles.AlertButtonText}>關閉</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default SuccessModal

const styles = StyleSheet.create({
  
})
