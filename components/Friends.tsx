import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native'
import CustomModal from './CustomModal'
import FriendList from './FriendList'
import FriendPosts from './FriendPosts'


export default function Friends({ user }: any) {
  const [activeTab, setActiveTab] = useState<'posts' | 'notifications' | 'list' | 'message'>('posts')
  const [message, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false)


  const showMessage = (msg: string) => {
    setModalMessage(msg)
    setModalVisible(true)
  }
  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={styles.navText}>動態牆</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={styles.navText}>好友列表</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'message' && styles.activeTab]}
          onPress={() => setActiveTab('message')}
        >
          <Text style={styles.navText}>訊息</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'posts' && <FriendPosts user={user} />}
        {activeTab === 'list' && (
          <FriendList user={user} showMessage={showMessage} />
        )}

        {activeTab === 'message' && <Text>訊息</Text>}
      </ScrollView>

      <CustomModal visible={modalVisible} message={message} onClose={() => setModalVisible(false)} />
    </View>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#a0dca0',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#87c587',
  },
  navText: {
    fontSize: 16,
    color: '#1a4d1a',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
})

