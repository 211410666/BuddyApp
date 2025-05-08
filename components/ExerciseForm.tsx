import React, { useState, useEffect } from 'react'
import * as Animatable from 'react-native-animatable'
import { Picker } from '@react-native-picker/picker'
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

export default function ExerciseForm({ user }: any) {
    const [hour, setHour] = useState('0')
    const [minute, setMinute] = useState('0')
    const [second, setSecond] = useState('0')
    const [modalVisible, setModalVisible] = useState(false)
    const [heartRate, setHeartRate] = useState('0')

    const [message, setModalMessage] = useState('');



    const handleSubmit = async () => {
        const h = parseFloat(hour)
        const m = parseFloat(minute)
        const s = parseFloat(second)
        const TotalSecond = h * 3600 + m * 60 + s
        if (!heartRate) {
            showMessage('請正確填寫平均心率')
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
                showMessage('無法建立運動紀錄')
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
            showMessage('寫入運動紀錄失敗')
        } else {
            showMessage('紀錄成功！')
            setHeartRate('0')
            setHour('0')
            setMinute('0')
            setSecond('0')
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

                {/* 手動新增區 */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>運動時長</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={styles.pickerWrapper}>
                            <Text style={styles.pickerLabel}>時</Text>
                            <Picker
                                selectedValue={hour}
                                onValueChange={(value) => setHour(value)}
                                style={styles.picker}
                            >
                                {[...Array(13).keys()].map(i => (
                                    <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.pickerWrapper}>
                            <Text style={styles.pickerLabel}>分</Text>
                            <Picker
                                selectedValue={minute}
                                onValueChange={(value) => setMinute(value)}
                                style={styles.picker}
                            >
                                {[...Array(60).keys()].map(i => (
                                    <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.pickerWrapper}>
                            <Text style={styles.pickerLabel}>秒</Text>
                            <Picker
                                selectedValue={second}
                                onValueChange={(value) => setSecond(value)}
                                style={styles.picker}
                            >
                                {[...Array(60).keys()].map(i => (
                                    <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>平均心率 (g)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        keyboardType="numeric"
                        value={heartRate}
                        onChangeText={setHeartRate}
                    />
                </View>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
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
    pickerWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    picker: {
        height: 44,
        width: '100%',
    },
    pickerLabel: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 4,
    },

})
