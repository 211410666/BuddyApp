import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native'
import FoodForm from './FoodForm'
import ExerciseForm from './ExerciseForm'
import Common_styles from '../lib/common_styles';



export default function AddData({ user }: any) {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'food' | 'exercise' | null>(null)

  const openModal = (type: 'food' | 'exercise') => {
    setModalType(type)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalType(null)
  }

  const renderModalContent = () => {
    if (modalType === 'food') return <FoodForm user={user}/>
    if (modalType === 'exercise') return <ExerciseForm user={user}/>
    return null
  }

  return (
    <View style={Common_styles.container}>
      <TouchableOpacity style={Common_styles.common_button} onPress={() => openModal('food')}>
        <Text style={Common_styles.common_buttonText}>新增飲食</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Common_styles.common_button}
        onPress={() => openModal('exercise')}
      >
        <Text style={Common_styles.common_buttonText}>新增運動</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={Common_styles.modalOverlay}>
          <View style={Common_styles.modalContent}>
            <Text style={Common_styles.modalTitle}>
              {modalType === 'food' ? '新增飲食' : '新增運動'}
            </Text>

            <View style={{ flex: 1, justifyContent: 'center' }}>
              {renderModalContent()}
            </View>

            <TouchableOpacity onPress={closeModal} style={Common_styles.closeButton}>
              <Text style={Common_styles.closeText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}