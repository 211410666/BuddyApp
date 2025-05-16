import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles'
import { View, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native'
import SuccessModal from './SuccesModal';
import ErrorModal from './ErrorModal';
import LoadingModal from './LoadingModal';
interface Props {
    user: any
}



const Analysis_exercise = ({ user }: Props) => {
    const [message, setModalMessage] = useState('');
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [exerciseData, setExerciseData] = useState<any[]>([])
    const [thisMonthexerciseData, setThisMonthExerciseData] = useState<any[]>([])

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

        setExerciseData(exercisedata);

        const now = new Date()
        const thisMonthData = exercisedata.filter(item => {
            const itemDate = new Date(item.create_time)
            return (
                itemDate.getFullYear() === now.getFullYear() &&
                itemDate.getMonth() === now.getMonth()
            )
        })
        setThisMonthExerciseData(thisMonthData)
        setLoading(false);
    }

    useEffect(() => {
        fetchExerciseData();
    }, [])

    const getHoursFromDuration = (data: any[]) => {
        const totalSeconds = data.reduce((acc, cur) => acc + (cur.duration || 0), 0)
        const totalHours = (totalSeconds / 3600).toFixed(1)
        return { totalSeconds, totalHours }
    }

    const thisMonthStats = getHoursFromDuration(thisMonthexerciseData)
    const allTimeStats = getHoursFromDuration(exerciseData)

    return (
        <View style={Common_styles.analysis_container}>
            <Text style={Common_styles.big_title}>本月運動 {thisMonthStats.totalHours} 小時</Text>
            <Text style={Common_styles.sub_text}>總運動時數：{allTimeStats.totalHours} 小時</Text>

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