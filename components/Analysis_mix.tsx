import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles'
import { View, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native'
import SuccessModal from './SuccesModal'
import ErrorModal from './ErrorModal'
import LoadingModal from './LoadingModal'

interface Props {
    user: any
}

const Analysis_mix = ({ user }: Props) => {
    const [message, setModalMessage] = useState('')
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const [sportData, setSportData] = useState<any[]>([])
    const [foodData, setFoodData] = useState<any[]>([])
    const [exerciseDetails, setExerciseDetails] = useState<any[]>([])
    const [foodDetails, setFoodDetails] = useState<any[]>([])

    // 分析結果狀態
    const [exerciseAnalysis, setExerciseAnalysis] = useState<string>('')
    const [foodAnalysis, setFoodAnalysis] = useState<string>('')

    useEffect(() => {
        if (user) {
            fetchMonthlyData()
        }
    }, [user])

    const fetchMonthlyData = async () => {
        setLoading(true)

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

        try {
            // 抓 diarys 資料
            const { data: sport, error: sportError } = await supabase
                .from('diarys')
                .select('*')
                .eq('owner', user.id)
                .eq('category', 'exercise')
                .gte('create_time', startOfMonth)
                .lte('create_time', endOfMonth)

            const { data: food, error: foodError } = await supabase
                .from('diarys')
                .select('*')
                .eq('owner', user.id)
                .eq('category', 'food')
                .gte('create_time', startOfMonth)
                .lte('create_time', endOfMonth)

            if (sportError || foodError) {
                setModalMessage('讀取 diarys 時發生錯誤')
                setErrorVisible(true)
                setLoading(false)
                return
            }

            setSportData(sport || [])
            setFoodData(food || [])

            // 擷取 diarys_id 陣列
            const sportDiaryIds = (sport || []).map(item => item.diary_id)
            const foodDiaryIds = (food || []).map(item => item.diary_id)

            // 抓 diary_exercise 詳細資料
            const { data: exerciseDetails, error: exerciseError } = await supabase
                .from('diary_exercise')
                .select('*')
                .in('diarys_id', sportDiaryIds)

            // 抓 diary_food 詳細資料
            const { data: foodDetails, error: foodErrorDetail } = await supabase
                .from('diary_food')
                .select('*')
                .in('diarys_id', foodDiaryIds)

            if (exerciseError || foodErrorDetail) {
                setModalMessage('讀取詳細資料時發生錯誤')
                setErrorVisible(true)
                setLoading(false)
                return
            }
            setExerciseDetails(exerciseDetails || [])
            setFoodDetails(foodDetails || [])

            const foodIds = (foodDetails || [])
                .map(item => item.food_id)
                .filter((id, index, self) => id && self.indexOf(id) === index) // 去除重複與空值

            // 查詢 foods 表
            const { data: foodInfoList, error: foodInfoError } = await supabase
                .from('foods')
                .select('*')
                .in('food_id', foodIds)

            if (foodInfoError) {
                setModalMessage('讀取食物詳細資料時發生錯誤')
                setErrorVisible(true)
                setLoading(false)
                return
            }

            // 合併每筆 diary_food 的 food_id 與 foods 的詳細資料
            const mergedFoodDetails = foodDetails.map(item => {
                const foodInfo = foodInfoList.find(f => f.food_id === item.food_id)
                return {
                    ...item,
                    food_info: foodInfo || null,
                }
            })
            setFoodDetails(mergedFoodDetails)

            // 做分析
            analyzeExercise(exerciseDetails)
            analyzeFood(mergedFoodDetails, food || [])

        } catch (error) {
            setModalMessage('無法連接資料庫')
            setErrorVisible(true)
        }
        setLoading(false)
    }

    // 運動分析
    const analyzeExercise = (details: any[]) => {
        if (details.length === 0) {
            setExerciseAnalysis('本月無運動紀錄')
            return
        }

        // 預設條件
        const age = 25
        const zone2MaxHR = 0.7 * (220 - age) // Zone 2 最大心率約70%

        // 運動頻率(本月天數中，有運動紀錄的天數比例)
        const daysWithExercise = new Set(details.map(d => new Date(d.create_time).toDateString())).size
        const now = new Date()
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        const freqRatio = daysWithExercise / daysInMonth

        // 平均心率、平均運動時間
        const avgHeartRate = details.reduce((sum, d) => sum + (d.heartrate || 0), 0) / details.length
        const avgDuration = details.reduce((sum, d) => sum + (d.duration || 0), 0) / details.length // 假設duration單位為分鐘

        // 分析結果文字
        let freqComment = ''
        if (freqRatio >= 0.5) freqComment = '運動頻率良好，每週約3-4次以上'
        else if (freqRatio >= 0.3) freqComment = '運動頻率中等，可再增加運動次數'
        else freqComment = '運動頻率偏低，建議增加運動次數'

        let intensityComment = ''
        if (avgHeartRate <= zone2MaxHR * 0.6) intensityComment = '運動強度偏低，建議提升運動強度至Zone 2心率區間'
        else if (avgHeartRate <= zone2MaxHR) intensityComment = '運動強度適中，維持目前強度即可'
        else intensityComment = '運動強度過高，建議適度降低強度避免過度疲勞'

        let durationComment = ''
        if (avgDuration < 30) durationComment = '每次運動時間偏短，建議每次運動時間至少30分鐘'
        else if (avgDuration <= 60) durationComment = '每次運動時間適中，維持目前時間即可'
        else durationComment = '每次運動時間偏長，注意避免運動過度'

        const result =
            `運動頻率分析：${freqComment}\n` +
            `平均心率分析：${intensityComment}\n` +
            `運動時間分析：${durationComment}`

        setExerciseAnalysis(result)
    }

    // 飲食分析（偏高蛋白質導向）
    const analyzeFood = (foodDetails: any[], foodDiaryList: any[]) => {
        if (foodDetails.length === 0) {
            setFoodAnalysis('本月無飲食紀錄')
            return
        }

        // 根據有紀錄的日期計算平均營養素
        // 先找出有飲食紀錄的日期（排除重複）
        const datesWithFood = Array.from(new Set(foodDiaryList.map(d => new Date(d.create_time).toDateString())))

        // 針對每日期，計算當日蛋白質、脂肪、碳水、熱量總和
        const dailyNutritionMap: { [date: string]: { protein: number; fat: number; carbs: number; calorie: number } } = {}

        // 初始化每天的營養素為0
        datesWithFood.forEach(dateStr => {
            dailyNutritionMap[dateStr] = { protein: 0, fat: 0, carbs: 0, calorie: 0 }
        })

        // 將foodDetails依照所屬 diary_id 找日期並加總
        foodDetails.forEach(fd => {
            const diary = foodDiaryList.find(d => d.diary_id === fd.diarys_id)
            if (!diary) return
            const dateStr = new Date(diary.create_time).toDateString()
            if (!dailyNutritionMap[dateStr]) dailyNutritionMap[dateStr] = { protein: 0, fat: 0, carbs: 0, calorie: 0 }

            const fi = fd.food_info || {}
            dailyNutritionMap[dateStr].protein += fi.protein || 0
            dailyNutritionMap[dateStr].fat += fi.fat || 0
            dailyNutritionMap[dateStr].carbs += fi.carbohydrates || 0
            dailyNutritionMap[dateStr].calorie += fi.calorie || 0
        })

        // 計算各營養素日均值
        const daysCount = datesWithFood.length
        const avgProtein = Object.values(dailyNutritionMap).reduce((sum, v) => sum + v.protein, 0) / daysCount
        const avgFat = Object.values(dailyNutritionMap).reduce((sum, v) => sum + v.fat, 0) / daysCount
        const avgCarbs = Object.values(dailyNutritionMap).reduce((sum, v) => sum + v.carbs, 0) / daysCount
        const avgCalorie = Object.values(dailyNutritionMap).reduce((sum, v) => sum + v.calorie, 0) / daysCount

        // 分析邏輯（以偏高蛋白質為主）
        // 估算建議蛋白質攝取量 (g): 體重65kg * 1.2 ~ 1.5 (稍微增加量)
        const recommendedProteinMin = 65 * 1.2
        const recommendedProteinMax = 65 * 1.5

        let proteinComment = ''
        if (avgProtein < recommendedProteinMin) proteinComment = '蛋白質攝取偏低，建議增加蛋白質攝取量以促進肌肉修復與生長。'
        else if (avgProtein <= recommendedProteinMax) proteinComment = '蛋白質攝取適中，維持目前攝取量。'
        else proteinComment = '蛋白質攝取偏高，注意均衡飲食避免過度攝取。'

        // 脂肪和碳水化合物也給簡單建議
        let fatComment = ''
        if (avgFat > 70) fatComment = '脂肪攝取偏高，建議選擇較健康的脂肪來源並適度控制攝取量。'
        else fatComment = '脂肪攝取量適中。'

        let carbComment = ''
        if (avgCarbs < 130) carbComment = '碳水化合物攝取偏低，注意補充足夠的能量來源。'
        else if (avgCarbs > 300) carbComment = '碳水化合物攝取偏高，注意血糖控制與體重管理。'
        else carbComment = '碳水化合物攝取適中。'

        const calorieComment = avgCalorie > 2500 ? '熱量攝取偏高，注意控制每日總熱量以維持體重。' :
            avgCalorie < 1800 ? '熱量攝取偏低，建議適度增加熱量攝取。' :
                '熱量攝取適中。'

        const result =
            `平均每日蛋白質攝取量：${avgProtein.toFixed(1)}g\n${proteinComment}\n` +
            `平均每日脂肪攝取量：${avgFat.toFixed(1)}g\n${fatComment}\n` +
            `平均每日碳水化合物攝取量：${avgCarbs.toFixed(1)}g\n${carbComment}\n` +
            `平均每日熱量攝取量：${avgCalorie.toFixed(0)} kcal\n${calorieComment}`

        setFoodAnalysis(result)
    }

    return (
         <View style={[Common_styles.fullContainer, { padding: 20, backgroundColor: '#f5f8fa' }]}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    marginBottom: 15,
                    color: '#2a9d8f',
                    textAlign: 'center',
                }}>
                    本月健康分析報告
                </Text>

                {/* 運動分析區塊 */}
                <View style={{
                    backgroundColor: '#e0f2f1',
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 25,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 3,
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: '#00796b',
                        marginBottom: 10,
                    }}>
                        運動分析結果
                    </Text>

                    <ScrollView
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 6,
                            padding: 10,
                        }}
                        nestedScrollEnabled={true}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: '#004d40',
                            lineHeight: 22,
                            whiteSpace: 'pre-line',
                        }}>
                            {exerciseAnalysis || '資料載入中...'}
                        </Text>
                    </ScrollView>
                </View>

                {/* 飲食分析區塊 */}
                <View style={{
                    backgroundColor: '#fff3e0',
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 25,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 3,
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: '#ef6c00',
                        marginBottom: 10,
                    }}>
                        飲食分析結果
                    </Text>

                    <ScrollView
                        style={{
                            backgroundColor: '#fff8e1',
                            borderRadius: 6,
                            padding: 10,
                        }}
                        nestedScrollEnabled={true}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: '#bf360c',
                            lineHeight: 22,
                            whiteSpace: 'pre-line',
                        }}>
                            {foodAnalysis || '資料載入中...'}
                        </Text>
                    </ScrollView>
                </View>

            </ScrollView>

            {/* Modal 區域 */}
            <SuccessModal
                visible={successVisible}
                message={message}
                onClose={() => setSuccessVisible(false)}
            />
            <ErrorModal
                visible={errorVisible}
                message={message}
                onClose={() => setErrorVisible(false)}
            />
            <LoadingModal visible={loading} />
        </View>
    )
}

export default Analysis_mix
