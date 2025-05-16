import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import Common_styles from '../lib/common_styles';
import Add_exercise from './Add_exercise';
import Add_food from './Add_food';
import FoodDatabase from './FoodDatabase';

export default function AddData({ user }: any) {
  const [activeTab, setActiveTab] = useState<'add_food' | 'add_exercise' | 'food_database'>('add_food')

  return (
    <View style={Common_styles.full_container}>
      {/* Top Navbar */}
      <View style={Common_styles.navbar}>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'add_food' && Common_styles.activeTab]}
          onPress={() => setActiveTab('add_food')}
        >
          <Text style={Common_styles.navText}>新增飲食紀錄</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'add_exercise' && Common_styles.activeTab]}
          onPress={() => setActiveTab('add_exercise')}
        >
          <Text style={Common_styles.navText}>新增運動紀錄</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Common_styles.navButton, activeTab === 'food_database' && Common_styles.activeTab]}
          onPress={() => setActiveTab('food_database')}
        >
          <Text style={Common_styles.navText}>食物資料庫</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={Common_styles.content}>
        {activeTab === 'add_food' && <Add_food user={user} />}
        {activeTab === 'add_exercise' && <Add_exercise user={user} />}
        {activeTab === 'food_database' && <FoodDatabase user={user}/>}
      </ScrollView>
    </View>
  )
}