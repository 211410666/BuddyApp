import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import FriendList from './FriendList'
import FriendPosts from './FriendPosts'
import FriendMessage from './FriendMessage'
import Common_styles from '../lib/common_styles'


export default function Friends({ user }: any) {
  const [activeTab, setActiveTab] = useState<'posts' | 'notifications' | 'list' | 'message'>('posts')

  return (
    <View style={Common_styles.full_container}>
      {/* Top Navbar */}
      <View style={Common_styles.navbar}>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'posts' && Common_styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={Common_styles.navText}>動態牆</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'list' && Common_styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={Common_styles.navText}>好友列表</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'message' && Common_styles.activeTab]}
          onPress={() => setActiveTab('message')}
        >
          <Text style={Common_styles.navText}>訊息</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={Common_styles.content}>
        {activeTab === 'posts' && <FriendPosts user={user} />}
        {activeTab === 'list' && (
          <FriendList user={user} />
        )}

        {activeTab === 'message' && <FriendMessage user={user}/>}
      </ScrollView>
    </View>
  )
}
