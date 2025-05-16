import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Analysis from '../components/Analysis'
import Friends from '../components/Friends'
import AddData from '../components/AddData'
import Diary from '../components/Diary'
import Settings from '../components/Settings'
import Common_styles from '../lib/common_styles'
const tabs = ['好友', '分析', '新增數據', '日記', '設定']

export default function HomeScreen({ route }: any) {
  const { user } = route.params
  const [activeTab, setActiveTab] = useState('好友')

  const renderContent = () => {
    switch (activeTab) {
      case '分析':
        return <Analysis user={user} />
      case '好友':
        return <Friends user={user} />
      case '新增數據':
        return <AddData user={user} />
      case '日記':
        return <Diary user={user} />
      case '設定':
        return <Settings user={user} />
      default:
        return null
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderContent()}</View>
      <View style={Common_styles.toolbar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              Common_styles.tabButton,
              activeTab === tab && Common_styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                Common_styles.tabText,
                activeTab === tab && Common_styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}


