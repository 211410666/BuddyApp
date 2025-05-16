import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles'
import SuccessModal from './SuccesModal'
import ErrorModal from './ErrorModal'
import LoadingModal from './LoadingModal'

interface Props {
    user: any
}




const Add_exercise = ({ user }: Props) => {
    const [message, setModalMessage] = useState('')
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [hour, setHour] = useState('0')
    const [minute, setMinute] = useState('0')
    const [second, setSecond] = useState('0')
    const [heartRate, setHeartRate] = useState('')

    const getTodayDateRange = () => {
        const now = new Date();
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
        const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    };


    const handleAddExercise = async () => {
        const h = Number(hour)
        const m = Number(minute)
        const s = Number(second)
        const hr = Number(heartRate)
        if (h === 0 && m === 0 && s === 0) {
            setModalMessage('請選擇運動時長（時、分、秒至少一項非零）')
            setErrorVisible(true)
            return
        }
        if (heartRate.trim() === '' || isNaN(hr) || hr <= 0) {
            setModalMessage('請輸入有效的平均心率（正數）')
            setErrorVisible(true)
            return
        }
        setLoading(true)
        const { start, end } = getTodayDateRange();
        const { data, error } = await supabase
            .from('diarys')
            .select('*')
            .eq('owner', user.id)
            .eq('category', 'exercise') // 如果你有類別分類
            .gte('create_time', start)
            .lte('create_time', end);
        if (error) {
            setLoading(false)
            setModalMessage('與資料庫連結失敗!請稍後再試')
            setErrorVisible(true)
            return;
        }

        let diary_exercise = data[0];

        if (data.length === 0) {
            const { data: insertData, error: insertError } = await supabase
                .from('diarys')
                .insert([
                    {
                        owner: user.id,
                        category: 'exercise'
                    }
                ])
                .select()
                .single()

            if (insertError) {
                setLoading(false)
                setModalMessage('與資料庫連結失敗!請稍後再試')
                setErrorVisible(true)
                return;
            } else {
                diary_exercise = insertData;
            }
        }
        const { data: insertExcercise, error: insertDiaryExerciseError } = await supabase
            .from('diary_exercise')
            .insert([
                {
                    diarys_id: diary_exercise.diary_id,  // 注意是 diarys 的 id
                    avg_heartrate: hr,
                    duration: h*3600+m*60+s,
                }
            ])
            .select()
            .single();

        if (insertDiaryExerciseError) {
            setLoading(false)
            setModalMessage('與資料庫連結失敗!請稍後再試')
            setErrorVisible(true)
            return;
        } else {
            setLoading(false)
            setModalMessage(`新增「運動紀錄紀錄」完成!`)
            setSuccessVisible(true)
        }
        setLoading(false)
        console.log('diary_exercise', diary_exercise)
    }

    return (
        <View style={Common_styles.fullContainer}>
            <Text style={[Common_styles.label, { fontSize: 24 }]}>運動時長</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                {/* Hour */}
                <View style={Common_styles.pickerRow}>
                    <Text style={Common_styles.pickerLabel}>時</Text>
                    <View style={Common_styles.pickerFlexible}>
                        <Picker
                            selectedValue={hour}
                            onValueChange={(value) => setHour(value)}
                            style={Common_styles.picker}
                        >
                            {[...Array(13).keys()].map(i => (
                                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Minute */}
                <View style={Common_styles.pickerRow}>
                    <Text style={Common_styles.pickerLabel}>分</Text>
                    <View style={Common_styles.pickerFlexible}>
                        <Picker
                            selectedValue={minute}
                            onValueChange={(value) => setMinute(value)}
                            style={Common_styles.picker}
                        >
                            {[...Array(60).keys()].map(i => (
                                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Second */}
                <View style={Common_styles.pickerRow}>
                    <Text style={Common_styles.pickerLabel}>秒</Text>
                    <View style={Common_styles.pickerFlexible}>
                        <Picker
                            selectedValue={second}
                            onValueChange={(value) => setSecond(value)}
                            style={Common_styles.picker}
                        >
                            {[...Array(60).keys()].map(i => (
                                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                            ))}
                        </Picker>
                    </View>
                </View>


            </View>
            <View style={[Common_styles.pickerRow, { marginTop: 20 }]}>
                <Text style={[Common_styles.pickerLabel, { width: 'auto', marginRight: 20 }]}>平均心率</Text>
                <TextInput
                    style={Common_styles.input}
                    placeholder="輸入平均運動心率"
                    value={heartRate}
                    onChangeText={setHeartRate}
                />
            </View>

            <View style={[Common_styles.pickerRow, { marginTop: 20, justifyContent: 'flex-end', width: '100%' }]}>
                <TouchableOpacity style={[Common_styles.submitBtn, { width: '30%' }]} onPress={handleAddExercise}>
                    <Text style={Common_styles.submitText}>送出</Text>
                </TouchableOpacity>
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

export default Add_exercise
