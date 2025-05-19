import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
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
          <Text style={Common_styles.alertTitle}><View style={Common_styles.iconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#33cc61" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
          </View></Text>
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
