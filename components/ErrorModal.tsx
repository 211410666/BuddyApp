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
        <View style={[Common_styles.modal,{ backgroundColor: '#fdecea' }]}>
          <Text style={Common_styles.alertTitle}><FontAwesome name="times-circle" size={24} color="rgb(217,63,94)" /></Text>
          <Text style={[Common_styles.alertMessage,{color:'#b71c1c'}]}>{message}</Text>
          <TouchableOpacity style={[Common_styles.AlertButton,{backgroundColor: '#b71c1c'}]} onPress={onClose}>
            <Text style={Common_styles.AlertButtonText}>關閉</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ErrorModal

