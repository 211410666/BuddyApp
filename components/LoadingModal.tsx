import React from 'react'
import { Modal, View, Text, ActivityIndicator, StyleSheet,Image} from 'react-native'
import Common_styles from '../lib/common_styles'
interface LoadingModalProps {
  visible: boolean
}

const LoadingModal = ({ visible }: LoadingModalProps) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={Common_styles.LDOverlay}>
        <View style={Common_styles.LDModal}>
          <Image
            source={require('../assets/LoadingIcon.jpg')}
            style={Common_styles.LDTextImage}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#4a7aba" />
          <Text style={Common_styles.LDText}>資料庫讀取中...</Text>
        </View>
      </View>
    </Modal>
  )
}

export default LoadingModal


