import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { supabase } from '../lib/supabase'
import ErrorModal from './ErrorModal'
import SuccessModal from './SuccesModal'
import Common_styles from '../lib/common_styles'

export default function ExerciseForm({ user }: any) {
    const [hour, setHour] = useState('0')
    const [minute, setMinute] = useState('0')
    const [second, setSecond] = useState('0')
    const [heartRate, setHeartRate] = useState('')
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [message, setModalMessage] = useState('');



    const handleSubmit = async () => {
        const h = parseFloat(hour)
        const m = parseFloat(minute)
        const s = parseFloat(second)
        const TotalSecond = h * 3600 + m * 60 + s
        if (!heartRate) {
            setModalMessage('請正確填寫平均心率')
            setErrorVisible(true);
            return
        }
        const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
        const { data: existingDiarys, error: diarysError } = await supabase
            .from('diarys')
            .select('*')
            .eq('owner', user.id)
            .eq('category', 'exercise')
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
                    category: 'exercise',
                })
                .select()
                .single()

            if (insertDiaryError || !newDiarys) {
                setModalMessage('無法建立運動紀錄')
                setErrorVisible(true);
                return
            }
            diarys_id = newDiarys.diary_id
        }

        const { error: insertFoodError } = await supabase
            .from('diary_exercise')
            .insert({
                diarys_id: diarys_id,
                avg_heartrate: parseFloat(heartRate),
                duration: TotalSecond,
            })

        if (insertFoodError) {
            setModalMessage('寫入運動紀錄失敗')
            setErrorVisible(true);
        } else {
            setModalMessage('紀錄成功！')
            setSuccessVisible(true);
            setHeartRate('0')
            setHour('0')
            setMinute('0')
            setSecond('0')
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={Common_styles.common_scrollContainer}>

                {/* 手動新增區 */}
                <View style={Common_styles.inputGroup}>
                    <Text style={Common_styles.label}>運動時長</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={Common_styles.pickerWrapper}>
                            <Text style={Common_styles.label}>時</Text>
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
                        <View style={Common_styles.pickerWrapper}>
                            <Text style={Common_styles.label}>分</Text>
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
                        <View style={Common_styles.pickerWrapper}>
                            <Text style={Common_styles.label}>秒</Text>
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

                <View style={Common_styles.inputGroup}>
                    <Text style={Common_styles.label}>平均心率 (g)</Text>
                    <TextInput
                        style={Common_styles.input}
                        placeholder=""
                        keyboardType="numeric"
                        value={heartRate}
                        onChangeText={setHeartRate}
                    />
                </View>
                <TouchableOpacity style={Common_styles.submitBtn} onPress={handleSubmit}>
                    <Text style={Common_styles.submitText}>新增</Text>
                </TouchableOpacity>
            </ScrollView>
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
        </KeyboardAvoidingView>

    )
}