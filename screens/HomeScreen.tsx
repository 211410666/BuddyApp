import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Analysis from '../components/Analysis'
import Friends from '../components/Friends'
import AddData from '../components/AddData'
import Diary from '../components/Diary'
import Settings from '../components/Settings'
import Common_styles from '../lib/common_styles'
import Svg, { Path } from 'react-native-svg'
import { Colors } from 'react-native/Libraries/NewAppScreen'
// const tabs = ['好友', '分析', '新增數據', '日記', '設定']
const tabs = [
  { name: '好友', icon: '好友' },
  { name: '分析', icon: '分析' },
  { name: '新增數據', icon: <View style={[Common_styles.iconContainer,{width:50,height:50}]}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill='rgba(20,52,164,0.8)' d="M256,0C114.62,0,0,114.61,0,256s114.62,256,256,256,256-114.62,256-256S397.38,0,256,0Zm149.44,256c0,15.66-12.7,28.36-28.36,28.36h-92.72v92.72c0,15.66-12.7,28.36-28.36,28.36h0c-15.66,0-28.36-12.7-28.36-28.36v-92.72h-92.72c-15.66,0-28.36-12.7-28.36-28.36h0c0-15.66,12.7-28.36,28.36-28.36h92.72v-92.72c0-15.66,12.7-28.36,28.36-28.36h0c15.66,0,28.36,12.7,28.36,28.36v92.72h92.72c15.66,0,28.36,12.7,28.36,28.36h0Z"></path></svg></View> }, //<FontAwesome name="plus" size={38} color='rgba(20,52,164,1)' />
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


