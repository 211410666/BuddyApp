import React, { useState, useEffect } from 'react'
import * as Animatable from 'react-native-animatable'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native'
import { supabase } from '../lib/supabase'
import CustomModal from './CustomModal'

export default function FoodForm({ user }: any) {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedFood, setSelectedFood] = useState<any | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [newFoodName, setNewFoodName] = useState('')
  const [carbs, setCarbs] = useState('0')
  const [protein, setProtein] = useState('0')
  const [fat, setFat] = useState('0')
  const [message, setModalMessage] = useState('');

  useEffect(() => {
    const fetchFoods = async () => {
      if (searchText.length < 2) {
        setSearchResults([])
        return
      }
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .ilike('food_name', `%${searchText}%`)
        .limit(10)
      if (!error) {
        setSearchResults(data)
      }
    }
    fetchFoods()
  }, [searchText])

  const handleAddNewFood = async () => {
    const carb = parseFloat(carbs)
    const prot = parseFloat(protein)
    const f = parseFloat(fat)

    if (!newFoodName || isNaN(carb) || isNaN(prot) || isNaN(f)) {
      showMessage('請填寫正確的食物與營養成分')
      return
    }

    const calorie = carb * 4 + prot * 4 + f * 9

    const { error } = await supabase.from('foods').insert({
      food_name: newFoodName,
      carbohydrates: carb,
      protein: prot,
      fat: f,
      calorie: calorie,
      create_id: user.id,
    }).throwOnError()

    if (error) {
      showMessage('新增失敗')
    } else {
      showMessage('新增成功！')
      setNewFoodName('')
      setCarbs('0')
      setProtein('0')
      setFat('0')
    }
  }

  const handleSubmit = async () => {
    if (!selectedFood) {
      showMessage('請先從上方搜尋並選擇一個食物')
      return
    }

    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' }) // 格式: YYYY-MM-DD

    // 1. 查找是否已存在 diarys 資料
    const { data: existingDiarys, error: diarysError } = await supabase
      .from('diarys')
      .select('*')
      .eq('owner', user.id)
      .eq('category', 'food')
      .gte('create_time', `${today}T00:00:00+08:00`)
      .lt('create_time', `${today}T23:59:59+08:00`)
      .limit(1)

    let diarys_id = existingDiarys?.[0]?.diary_id

    if (!diarys_id) {
      // 若無，新增一筆
      const { data: newDiarys, error: insertDiaryError } = await supabase
        .from('diarys')
        .insert({
          owner: user.id,
          category: 'food',
        })
        .select()
        .single()

      if (insertDiaryError || !newDiarys) {
        showMessage('無法建立日記紀錄')
        return
      }
      diarys_id = newDiarys.diary_id
    }

    // 2. 將資料寫入 diary_food
    const { error: insertFoodError } = await supabase
      .from('diary_food')
      .insert({
        diarys_id: diarys_id,
        food_id: selectedFood.food_id,
      })

    if (insertFoodError) {
      showMessage('寫入日記食物失敗')
    } else {
      showMessage('紀錄成功！')
      setSelectedFood(null)
      setSearchText('')
      setSearchResults([])
    }
  }

  const showMessage = (msg: string) => {
    setModalMessage(msg)
    setModalVisible(true)
  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 搜尋區 */}
        <TextInput
          style={styles.input}
          placeholder="輸入食物名稱..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.food_id.toString()}
          renderItem={({ item, index }) => (
            <Animatable.View animation="fadeInUp" duration={500} delay={index * 50}>
              <TouchableOpacity onPress={() => setSelectedFood(item)}>
                <Text style={styles.resultItem}>{item.food_name}</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        />

        {selectedFood && (
          <View style={styles.nutritionBox}>
            <Text>碳水: {selectedFood.carbohydrates}g</Text>
            <Text>蛋白質: {selectedFood.protein}g</Text>
            <Text>脂肪: {selectedFood.fat}g</Text>
            <Text>熱量: {selectedFood.calorie} kcal</Text>
          </View>
        )}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>送出</Text>
        </TouchableOpacity>


        {/* 手動新增區 */}
        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
          找不到你要的食物嗎？從這裡新增！
        </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>食物名稱</Text>
          <TextInput
            style={styles.input}
            placeholder="輸入食物名稱"
            value={newFoodName}
            onChangeText={setNewFoodName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>碳水化合物 (g)</Text>
          <TextInput
            style={styles.input}
            placeholder="碳水化合物 (g)"
            keyboardType="numeric"
            value={carbs}
            onChangeText={setCarbs}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>蛋白質 (g)</Text>
          <TextInput
            style={styles.input}
            placeholder="蛋白質 (g)"
            keyboardType="numeric"
            value={protein}
            onChangeText={setProtein}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>脂肪 (g)</Text>
          <TextInput
            style={styles.input}
            placeholder="脂肪 (g)"
            keyboardType="numeric"
            value={fat}
            onChangeText={setFat}
          />
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleAddNewFood}>
          <Text style={styles.submitText}>新增</Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomModal visible={modalVisible} message={message} onClose={() => setModalVisible(false)} />
    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 32,
    paddingBottom: 100, // 保留底部空間
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  resultItem: {
    padding: 10,
    backgroundColor: '#e0f7e0',
    marginBottom: 4,
    borderRadius: 6,
  },
  nutritionBox: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  submitBtn: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

})
