import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Analysis from '../components/Analysis'
import Friends from '../components/Friends'
import AddData from '../components/AddData'
import Diary from '../components/Diary'
import Settings from '../components/Settings'
import Common_styles from '../lib/common_styles'
import Svg, { Path } from 'react-native-svg'

const tabs = ['好友', '分析', '新增數據', '日記', '設定']
const AddIcon = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={24} height={24}>
    <Path
      fill="#4a7aba"
      d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
    />
  </Svg>
)
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


