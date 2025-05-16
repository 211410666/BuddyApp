import React, { useState } from 'react'
import { View, Text, TouchableOpacity,ScrollView } from 'react-native'
import Common_styles from '../lib/common_styles';
import Analysis_exercise from './Analysis_exercise';
import Analysis_food from './Analysis_food';
import Analysis_mix from './Analysis_mix';
export default function Analysis({ user }: any) {
  const [activeTab, setActiveTab] = useState<'exercise' | 'food' | 'mix'>('exercise')
  return (
    <View style={Common_styles.full_container}>
      <View style={Common_styles.navbar}>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'exercise' && Common_styles.activeTab]}
          onPress={() => setActiveTab('exercise')}
        >
          <Text style={Common_styles.navText}>運動分析</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'food' && Common_styles.activeTab]}
          onPress={() => setActiveTab('food')}
        >
          <Text style={Common_styles.navText}>飲食分析</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'mix' && Common_styles.activeTab]}
          onPress={() => setActiveTab('mix')}
        >
          <Text style={Common_styles.navText}>綜合分析</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={Common_styles.content}>
        {activeTab === 'exercise' && <Analysis_exercise user={user} />}
        {activeTab === 'food' && <Analysis_food user={user} />}
        {activeTab === 'mix' && <Analysis_mix user={user}/>}
      </ScrollView>
    </View>
  )
}
