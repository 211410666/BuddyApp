import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles'
import { View, ScrollView, Text, Dimensions } from 'react-native'
import SuccessModal from './SuccesModal'
import ErrorModal from './ErrorModal'
import LoadingModal from './LoadingModal'
import { BarChart } from 'react-native-chart-kit'

interface Props {
    user: any
}

const screenWidth = Dimensions.get('window').width

const Analysis_exercise = ({ user }: Props) => {
    const [message, setModalMessage] = useState('')
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [exerciseData, setExerciseData] = useState<any[]>([])
    const [thisMonthExerciseData, setThisMonthExerciseData] = useState<any[]>([])
    const [userData, setUserData] = useState<any[]>([])


    async function fetchFoodData(foodsIds: string[]) {
        console.log(foodsIds);
        const { data, error } = await supabase
            .from('foods')
            .select('*')
            .in('food_id', foodsIds)
        if (error) {
            console.error("[Exercise Records] Error: ", error);
            return [];
        }
        if (!data || data.length === 0) {
            console.error("[Exercise Records] Data is empty");
            return [];
        }
        setUserData(data);
    }

    const fetchExerciseData = async () => {
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
            setModalMessage('還沒有任何紀錄喔~趕快去運動吧~')
            setSuccessVisible(true)
            return
        }

        const { data: exercisedata, error: exerciseError } = await supabase
            .from('diary_exercise')
            .select('*')
            .in('diarys_id', diaryIds)

        if (exerciseError) {
            setLoading(false)
            setModalMessage('資料庫連線失敗!請稍後再試')
            setErrorVisible(true)
            return
        }
        if (exercisedata.length === 0) {
            setLoading(false)
            setModalMessage('還沒有任何紀錄喔~趕快去運動吧~')
            setSuccessVisible(true)
            return
        }

        setExerciseData(exercisedata)

        const now = new Date()
        const thisMonthData = exercisedata.filter(item => {
            const itemDate = new Date(item.create_time)
            return (
                itemDate.getFullYear() === now.getFullYear() &&
                itemDate.getMonth() === now.getMonth()
            )
        })
        setThisMonthExerciseData(thisMonthData)
        setLoading(false)
    }

    useEffect(() => {
        fetchExerciseData()
    }, [])

    const getHoursFromDuration = (data: any[]) => {
        const totalSeconds = data.reduce((acc, cur) => acc + (cur.duration || 0), 0)
        const totalHours = (totalSeconds / 3600).toFixed(1)
        return { totalSeconds, totalHours }
    }

    const getRollingYearStatsSplit = (data: any[]) => {
        const now = new Date()
        const labelsFirst6: string[] = []
        const monthlyTotalsFirst6: number[] = []
        const labelsLast6: string[] = []
        const monthlyTotalsLast6: number[] = []

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const label = `${date.getMonth() + 1}月`

            const totalSeconds = data
                .filter(item => {
                    const itemDate = new Date(item.create_time)
                    return (
                        itemDate.getFullYear() === date.getFullYear() &&
                        itemDate.getMonth() === date.getMonth()
                    )
                })
                .reduce((sum, item) => sum + (item.duration || 0), 0)

            const totalHours = Number((totalSeconds / 3600).toFixed(1))

            if (i >= 6) {
                labelsFirst6.push(label)
                monthlyTotalsFirst6.push(totalHours)
            } else {
                labelsLast6.push(label)
                monthlyTotalsLast6.push(totalHours)
            }
        }

        return {
            labelsFirst6,
            monthlyTotalsFirst6,
            labelsLast6,
            monthlyTotalsLast6,
        }
    }

    // === 新增本月運動建議計算 ===
    // 運動頻率 = 本月有運動的天數 / 本月天數(30)
    // 平均運動時間(分鐘)
    // 平均心率
    const now = new Date()
    const daysInMonth = 30 // 假設30天簡化
    const uniqueExerciseDays = new Set(
        thisMonthExerciseData.map(item => (new Date(item.create_time)).getDate())
    )
    const frequency = uniqueExerciseDays.size / daysInMonth

    const totalDurationSeconds = thisMonthExerciseData.reduce((sum, item) => sum + (item.duration || 0), 0)
    const avgDurationMinutes = thisMonthExerciseData.length > 0 ? totalDurationSeconds / 60 / thisMonthExerciseData.length : 0

    const totalHeartrate = thisMonthExerciseData.reduce((sum, item) => sum + (item.avg_heartrate || 0), 0)
    const avgHeartrate = thisMonthExerciseData.length > 0 ? totalHeartrate / thisMonthExerciseData.length : 0

    // Zone 2 心率區間
    const maxHeartRate = 220 - (userData.age || 30) // 如果沒有年齡預設30歲
    const zone2Lower = maxHeartRate * 0.6
    const zone2Upper = maxHeartRate * 0.7
    const fatCaloriesBurned = avgDurationMinutes * 0.12 * avgHeartrate
    const fatGramsBurned = (fatCaloriesBurned / 9).toFixed(1)

    // 建議文字陣列
    const advices: string[] = []

    // 1. 運動頻率
    if (frequency < 0.6) {
        // 計算建議一週增加幾次，目標是每週運動4次（60%頻率約18天），以實際次數為基準
        const weeksInMonth = 4
        const currentWeeklyFreq = uniqueExerciseDays.size / weeksInMonth
        const recommendedWeeklyFreq = 4
        const needAddTimes = Math.max(0, Math.ceil(recommendedWeeklyFreq - currentWeeklyFreq))
        advices.push(`本月運動頻率較低，建議每週增加運動次數約 ${needAddTimes} 次`)
    }

    // 2. 運動時間
    if (avgDurationMinutes < 45) {
        advices.push(`平均運動時間偏短，建議每次運動時間增加至45~60分鐘`)
    } else if (avgDurationMinutes > 60) {
        advices.push(`平均運動時間偏長，建議每次運動時間減少至45~60分鐘`)
    }

    // 3. 心率強度
    if (avgHeartrate < zone2Lower) {
        advices.push(`平均心率偏低，建議提高運動強度以達到 Zone 2 心率範圍 (${Math.round(zone2Lower)}-${Math.round(zone2Upper)})`)
    } else if (avgHeartrate > zone2Upper) {
        advices.push(`平均心率偏高，建議降低運動強度以達到 Zone 2 心率範圍 (${Math.round(zone2Lower)}-${Math.round(zone2Upper)})`)
    }

    const thisMonthStats = getHoursFromDuration(thisMonthExerciseData)
    const allTimeStats = getHoursFromDuration(exerciseData)
    const {
        labelsLast6,
        monthlyTotalsLast6,
    } = getRollingYearStatsSplit(exerciseData)

    return (
        <View style={Common_styles.analysis_container}>
            <Text style={Common_styles.big_title}>本月運動 {thisMonthStats.totalHours} 小時</Text>
            <Text style={Common_styles.sub_text}>總運動時數：{allTimeStats.totalHours} 小時</Text>
            <Text style={Common_styles.sub_text}>你因為運動這個月總共多消耗了{fatGramsBurned}g 脂肪</Text>
            <Text style={{ marginTop: 20, fontWeight: 'bold' }}>最近6個月運動時數</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={{
                        labels: labelsLast6,
                        datasets: [{ data: monthlyTotalsLast6 }],
                    }}
                    width={Math.max(labelsLast6.length * 50, screenWidth * 0.9)}
                    height={220}
                    fromZero
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(4, 55, 242, ${opacity}`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        propsForBackgroundLines: {
                            stroke: '#a7a6a6',
                            strokeDasharray: '4',
                        },
                        propsForLabels: {
                            fontSize: 15,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderWidth: 1,
                        borderColor: '#444444',
                        borderRadius: 8,
                        backgroundColor: '#ffffff',
                        paddingVertical: 16,
                        paddingTop: 20,
                    }}
                />
            </ScrollView>

            {/* 新增本月運動建議區塊 */}
            <View style={{ marginTop: 30, padding: 15, backgroundColor: '#f0f8ff', borderRadius: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>本月運動建議</Text>
                {advices.length === 0 ? (
                    <Text>本月運動狀況良好，請繼續保持！</Text>
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

export default Analysis_exercise
