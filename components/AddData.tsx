import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native'
import FoodForm from './FoodForm'
import ExerciseForm from './ExerciseForm'

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => openModal('food')}>
        <Text style={styles.buttonText}>新增飲食</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => openModal('exercise')}
      >
        <Text style={styles.buttonText}>新增運動</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'food' ? '新增飲食' : '新增運動'}
            </Text>

            <View style={{ flex: 1, justifyContent: 'center' }}>
              {renderModalContent()}
            </View>

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // 垂直置中
    alignItems: 'center',     // 水平置中
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#a0dca0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 12,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#1a4d1a',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    opacity:0.9,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#333',
  },
})
