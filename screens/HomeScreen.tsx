import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Analysis from '../components/Analysis'
import Friends from '../components/Friends'
import AddData from '../components/AddData'
import Diary from '../components/Diary'
import Settings from '../components/Settings'

const tabs = ['好友', '分析', '新增數據', '日記', '設定']

export default function HomeScreen({ route }: any) {
  const { user } = route.params
  const [activeTab, setActiveTab] = useState('好友')

  const renderContent = () => {
    switch (activeTab) {
      case '分析':
        return <Analysis />
      case '好友':
        return <Friends />
      case '新增數據':
        return <AddData user={user}/>
      case '日記':
        return <Diary user={user}/>
      case '設定':
        return <Settings user={user} />
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.toolbar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#d0e8d0',
  },
  tabText: {
    fontSize: 20,
    color: '#333',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#1a6e1a',
  },
})
