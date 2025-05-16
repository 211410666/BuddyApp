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



const Add_food = ({ user }: Props) => {
    const [searchFoodName, setSearchFoodName] = useState('');
    const [message, setModalMessage] = useState('');
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [result_FoodData, setResult_FoodData] = useState<any[]>([])
    const [filter_FoodData, setFilter_FoodData] = useState<any[]>([])

    const getTodayDateRange = () => {
        const now = new Date();
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
        const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    };


    const fetchFoodData = async () => {
        setLoading(true)
        const { data: foodData, error: fetchFoodError } = await supabase
            .from('foods')
            .select('*')
        if (fetchFoodError) {
            setModalMessage('資料庫連線失敗')
            setErrorVisible(true)
            return
        }
        setResult_FoodData(foodData);
        setFilter_FoodData(foodData);
        setLoading(false)
    }
    const addFoodDiary = async (item: any) => {
        setLoading(true);
        const { start, end } = getTodayDateRange();
        const { data, error } = await supabase
            .from('diarys')
            .select('*')
            .eq('owner', user.id)
            .eq('category', 'food') // 如果你有類別分類
            .gte('create_time', start)
            .lte('create_time', end);
        if (error) {
            setLoading(false)
            setModalMessage('與資料庫連結失敗!請稍後再試')
            setErrorVisible(true)
            return;
        }

        let diary_food = data[0];

        if (data.length === 0) {
            const { data: insertData, error: insertError } = await supabase
                .from('diarys')
                .insert([
                    {
                        owner: user.id,
                        category: 'food'
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
                diary_food = insertData;
            }
        }
        const { data: insertDiaryFoodData, error: insertDiaryFoodError } = await supabase
            .from('diary_food')
            .insert([
                {
                    diarys_id: diary_food.diary_id,  // 注意是 diarys 的 id
                    food_id: item.food_id,
                }
            ])
            .select()
            .single();

        if (insertDiaryFoodError) {
            setLoading(false)
            setModalMessage('與資料庫連結失敗!請稍後再試')
            setErrorVisible(true)
            return;
        } else {
            setLoading(false)
            setModalMessage(`新增「飲食紀錄:${item.food_name}」完成!`)
            setSuccessVisible(true)
        }

    };

    const filterFoodData = () => {
        const filtered = result_FoodData.filter(item =>
            item.food_name?.toLowerCase().includes(searchFoodName.toLowerCase())
        );
        setFilter_FoodData(filtered);
    }
    useEffect(() => {
        filterFoodData();
    }, [searchFoodName])

    useEffect(() => {
        fetchFoodData()
    }, [])



    return (
        <View style={Common_styles.full_container}>
            <ScrollView style={Common_styles.scrollContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 5 }}>
                    <TextInput
                        style={Common_styles.input}
                        placeholder="輸入搜尋食物名稱"
                        value={searchFoodName}
                        onChangeText={setSearchFoodName}
                    />
                </View>
                {filter_FoodData.length > 0 ? (
                    filter_FoodData.map((item, index) => (
                        <View key={index} style={Common_styles.nutritionBox}>
                            <Text style={Common_styles.category}>{item.food_name}</Text>
                            <Text>{'蛋白質: ' + item.protein + 'g'}</Text>
                            <Text>{'脂肪: ' + item.fat + 'g'}</Text>
                            <Text>{'碳水化合物: ' + item.carbohydrates + 'g'}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>{'卡路里: ' + item.calorie + ' kcal'}</Text>
                                <TouchableOpacity
                                    style={Common_styles.submitBtn}
                                    onPress={() => addFoodDiary(item)}
                                >
                                    <Text style={{ color: 'white' }}>送出一筆飲食紀錄</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>查無符合的食物資料</Text>
                )}
            </ScrollView>
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

export default Add_food