import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles'
import { View, ScrollView, TextInput, Text, TouchableOpacity, Dimensions } from 'react-native'
import SuccessModal from './SuccesModal';
import ErrorModal from './ErrorModal';
import LoadingModal from './LoadingModal';
import { BarChart } from 'react-native-chart-kit'

interface Props {
    user: any
}

const screenWidth = Dimensions.get('window').width

const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(4, 55, 242, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForBackgroundLines: {
        stroke: '#a7a6a6',          // 背景線顏色
        strokeDasharray: '4',       // 虛線
    },
    propsForLabels: {
        fontSize: 15,               // 標籤字體大小
    },
    style: {
        borderRadius: 16,
    },
}


const Analysis_food = ({ user }: Props) => {
    const [message, setModalMessage] = useState('')
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [foodData, setFoodData] = useState<any[]>([])
    const [thisMonthFoodData, setThisMonthFoodData] = useState<any[]>([])
    const [totalCalorie, setTotalCalorie] = useState(0)
    const [totalProtein, setTotalProtein] = useState(0)
    const [totalFat, setTotalFat] = useState(0)
    const [totalCarbs, setTotalCarbs] = useState(0)
    const [thisMonthStats, setThisMonthStats] = useState({
        calorie: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
    })
    const [barChartData, setBarChartData] = useState<any[]>([])
    const [advices, setAdvices] = useState<string[]>([])


    // 幫助函式：取得前六個月的 YYYY-MM 格式
    const getLastSixMonths = () => {
        const months: string[] = []
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const label = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            months.push(label)
        }
        return months
    }

    const fetchFoodData = async () => {
        setLoading(true)
        const { data: diarysData, error: diarysError } = await supabase
            .from('diarys')
            .select('*')
            .eq('owner', user.id)

        if (diarysError) {
            setLoading(false)
            setModalMessage('資料庫連線失敗!請稍後再試')
            setErrorVisible(true)
            return
        }

        const diaryIds = diarysData.map(item => item.diary_id)
        if (diaryIds.length === 0) {
            setLoading(false)
            setModalMessage('還沒有任何紀錄喔~趕快去記錄一筆飲食吧~')
            setSuccessVisible(true)
            return
        }

        const { data: fooddata, error: foodError } = await supabase
            .from('diary_food')
            .select('*')
            .in('diarys_id', diaryIds)

        if (foodError) {
            setLoading(false)
            setModalMessage('資料庫連線失敗!請稍後再試')
            setErrorVisible(true)
            return
        }
        if (fooddata.length === 0) {
            setLoading(false)
            setModalMessage('還沒有任何紀錄喔~趕快去記錄一筆飲食吧~')
            setSuccessVisible(true)
            return
        }
        console.log('foodData', fooddata)
        const foodIds = fooddata.map(item => item.food_id)
        console.log('foodIds', foodIds)
        const { data: foodsData, error: foodsError } = await supabase
            .from('foods')
            .select('food_id, food_name, fat, carbohydrates, protein, calorie')
            .in('food_id', foodIds)
        if (foodsError) {
            setLoading(false)
            setModalMessage('取得食物資料失敗!請稍後再試')
            setErrorVisible(true)
            return
        }
        const foodsMap = new Map(foodsData.map(food => [food.food_id, food]))
        const mergedFoodData = fooddata.map(item => {
            const foodInfo = foodsMap.get(item.food_id)
            return {
                ...item,
                ...foodInfo // 合併 food_name, fat, carbohydrates, protein, calorie
            }
        })
        setFoodData(mergedFoodData)
        console.log('mergedFoodData', mergedFoodData)
        const now = new Date()
        const thisMonthData = mergedFoodData.filter(item => {
            const itemDate = new Date(item.create_time)
            return (
                itemDate.getFullYear() === now.getFullYear() &&
                itemDate.getMonth() === now.getMonth()
            )
        })
        setThisMonthFoodData(thisMonthData)
        let totalCalorie = 0
        let totalProtein = 0
        let totalFat = 0
        let totalCarbs = 0

        thisMonthData.forEach(item => {
            totalCalorie += item.calorie || 0
            totalProtein += item.protein || 0
            totalFat += item.fat || 0
            totalCarbs += item.carbohydrates || 0
        })

        // 記錄在 state 中方便顯示
        setTotalCalorie(totalCalorie)
        setTotalProtein(totalProtein)
        setTotalFat(totalFat)
        setTotalCarbs(totalCarbs)

        // 計算本月總熱量、蛋白質、脂肪、碳水化合物
        let monthCalorie = 0
        let monthProtein = 0
        let monthFat = 0
        let monthCarbs = 0

        thisMonthData.forEach(item => {
            monthCalorie += item.calorie || 0
            monthProtein += item.protein || 0
            monthFat += item.fat || 0
            monthCarbs += item.carbohydrates || 0
        })

        // 記錄統計結果
        setThisMonthStats({
            calorie: monthCalorie,
            protein: monthProtein,
            fat: monthFat,
            carbohydrates: monthCarbs,
        })
        const lastSixMonths = getLastSixMonths()
        const monthCaloriesMap: { [month: string]: number } = {}

        lastSixMonths.forEach(month => {
            monthCaloriesMap[month] = 0
        })

        mergedFoodData.forEach(item => {
            const date = new Date(item.create_time)
            const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            if (monthCaloriesMap.hasOwnProperty(month)) {
                monthCaloriesMap[month] += item.calorie || 0
            }
        })

        const barChartData = lastSixMonths.map(month => ({
            month,
            calorie: Math.round(monthCaloriesMap[month])
        }))

        setBarChartData(barChartData)
        // 高蛋白飲食建議邏輯
        const { protein, fat, carbohydrates } = {
            protein: monthProtein,
            fat: monthFat,
            carbohydrates: monthCarbs
        }
        const totalMacros = protein + fat + carbohydrates

        let suggestion = ''

        if (totalMacros > 0) {
            const proteinRatio = protein / totalMacros
            if (proteinRatio < 0.35) {
                suggestion = '建議增加蛋白質攝取，提升為高蛋白飲食，有助於減脂與增肌。'
            } else {
                suggestion = '你的蛋白質攝取比例已經不錯，但仍建議持續維持高蛋白飲食習慣。'
            }
        } else {
            suggestion = '目前尚無足夠的營養素資料，請多記錄你的飲食內容。'
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchFoodData()
    }, [])

    useEffect(() => {
        if (thisMonthStats.calorie === 0 && thisMonthStats.protein === 0 && thisMonthStats.fat === 0 && thisMonthStats.carbohydrates === 0) {
            setAdvices(['目前尚無足夠的營養素資料，請多記錄你的飲食內容。'])
            return
        }

        const proteinRatio = thisMonthStats.protein / (thisMonthStats.protein + thisMonthStats.fat + thisMonthStats.carbohydrates)

        const newAdvices: string[] = []

        if (proteinRatio < 0.35) {
            newAdvices.push('建議增加蛋白質攝取，提升為高蛋白飲食，有助於減脂與增肌。')
        } else {
            newAdvices.push('你的蛋白質攝取比例已經不錯，但仍建議持續維持高蛋白飲食習慣。')
        }

        // 你可以再依據脂肪或碳水比重補充建議，例如：
        const fatRatio = thisMonthStats.fat / (thisMonthStats.protein + thisMonthStats.fat + thisMonthStats.carbohydrates)
        if (fatRatio > 0.35) {
            newAdvices.push('脂肪攝取偏高，建議適度調整以維持均衡飲食。')
        }

        setAdvices(newAdvices)
    }, [thisMonthStats])


    return (
        <View style={Common_styles.analysis_container}>
            <Text style={Common_styles.big_title}>
                本月熱量共 {Math.round(thisMonthStats.calorie)} cal
            </Text>
            <Text style={Common_styles.sub_text}>
                碳水 {Math.round(thisMonthStats.carbohydrates)} (g)
                脂肪 {Math.round(thisMonthStats.fat)} (g)
                蛋白質 {Math.round(thisMonthStats.protein)} (g)
            </Text>
            <Text style={Common_styles.sub_text}>
                創建以來進食總熱量 {Math.round(totalCalorie)} cal
            </Text>
            <BarChart
                data={{
                    labels: barChartData.map(item => item.month),
                    datasets: [
                        {
                            data: barChartData.map(item => item.calorie),
                        },
                    ],
                }}
                width={screenWidth - 80}  // 保留邊距
                height={400}
                yAxisSuffix=" cal"
                chartConfig={chartConfig}
                verticalLabelRotation={90}
                fromZero={true}
                showValuesOnTopOfBars={true}
                style={{
                    marginVertical: 8,
                    borderWidth: 1,
                    borderColor: '#444444',   // 深灰色邊框
                    borderRadius: 8,
                    backgroundColor: '#ffffff',
                    padding: 10,
                }}
            />
            <View style={{ marginTop: 30, padding: 15, backgroundColor: '#f0f8ff', borderRadius: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>本月飲食建議</Text>
                {advices.length === 0 ? (
                    <Text>本月飲食狀況良好，請繼續保持！</Text>
                ) : (
                    advices.map((advice, index) => (
                        <Text key={index} style={{ marginBottom: 6, fontSize: 16, color: '#333' }}>
                            • {advice}
                        </Text>
                    ))
                )}
            </View>
            <LoadingModal visible={loading} />
            <ErrorModal
                visible={errorVisible}
                message={message}
                onClose={() => setErrorVisible(false)}
            />
            <SuccessModal
                visible={successVisible}
                message={message}
                onClose={() => setSuccessVisible(false)}
            />
        </View>
    )
}

export default Analysis_food