import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Analysis from '../components/Analysis'
import Friends from '../components/Friends'
import AddData from '../components/AddData'
import Diary from '../components/Diary'
import Settings from '../components/Settings'
import Common_styles from '../lib/common_styles'
import Svg, { Path } from 'react-native-svg'
import { FontAwesome } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
// const tabs = ['好友', '分析', '新增數據', '日記', '設定']
const tabs = [
  { name: '好友', icon: '好友' },
  { name: '分析', icon: '分析' },
  { name: '新增數據', icon: <FontAwesome name="plus" size={38} color='rgba(20,52,164,1)' /> }, //20 52 164
  { name: '日記', icon: '日記' },
  { name: '設定', icon: '設定'},
]

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
            key={tab.name}
            style={[
              Common_styles.tabButton,
              activeTab === tab.name && Common_styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.name)}
          >
            <Text
              style={[
                Common_styles.tabText,
                activeTab === tab.name && Common_styles.activeTabText,
              ]}
            >
              {tab.icon}
            </Text>
          </TouchableOpacity>
        ))}

      </View>
    </View>
  )
}


