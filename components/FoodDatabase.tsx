import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles'
import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import LoadingModal from './LoadingModal'
import ErrorModal from './ErrorModal'
import SuccessModal from './SuccesModal'
interface Props {
    user: any
}

const FoodDatabase = ({ user }: Props) => {
    const [loading, setLoading] = useState(false)
    const [message, setModalMessage] = useState('');
    const [newFoodName, setNewFoodName] = useState('');
    const [protein, setProtein] = useState<string>('');  // 改成 string
    const [carbohydrates, setCarbohydrates] = useState<string>('');
    const [fat, setFat] = useState<string>('');
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [result_FoodData, setResult_FoodData] = useState<any[]>([])
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
        setLoading(false)
        console.log(foodData)
    }
    useEffect(() => {
        fetchFoodData()
    }, [])
    const isValidFloat = (value: string) => {
        if (!value) return false;
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        return /^-?\d*(\.\d+)?$/.test(value);
    }
    const handleAddFood = async () => {
        if (
            !isValidFloat(protein) ||
            !isValidFloat(carbohydrates) ||
            !isValidFloat(fat)
        ) {
            setModalMessage('請輸入合法的數字（可含小數點）在蛋白質、碳水化合物和脂肪欄位');
            setErrorVisible(true);
            return;
        }
        const trimmedFoodName = newFoodName.trim();
        console.log(trimmedFoodName);
        if (trimmedFoodName === '') {
            setModalMessage('食物名稱不能為空白');
            setErrorVisible(true);
            return;
        }

        const isDuplicate = result_FoodData.some(
            (item) => item.food_name.toLowerCase() === trimmedFoodName.toLowerCase()
        );

        if (isDuplicate) {
            setModalMessage('此食物名稱已存在資料庫中，請輸入其他名稱');
            setErrorVisible(true);
            return;
        }
        setLoading(true)
        const proteinNum = parseFloat(protein);
        const fatNum = parseFloat(fat);
        const carbNum = parseFloat(carbohydrates);
        const calorie = fatNum * 9 + proteinNum * 4 + carbNum * 4;
        const { data, error } = await supabase.from('foods').insert([
            {
                food_name: trimmedFoodName,
                carbohydrates: carbNum,
                fat: fatNum,
                protein: proteinNum,
                create_id: user.id,
                calorie: calorie,
            },
        ]);
        setLoading(false)
        if (error) {
            setModalMessage('新增食物失敗：' + error.message);
            setErrorVisible(true);
            return;
        }
        setNewFoodName('');
        setProtein('');
        setCarbohydrates('');
        setFat('');
        fetchFoodData(); // 重新抓取資料庫資料

        setModalMessage('新增成功！');
        setSuccessVisible(true);
    }

    return (
        <View style={Common_styles.fullContainer}>
            <ScrollView style={Common_styles.scrollContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 5 }}>
                    <TextInput
                        style={Common_styles.input}
                        placeholder="輸入新增食物名稱"
                        placeholderTextColor="rgba(60, 130, 245, 0.5)"
                        value={newFoodName}
                        onChangeText={setNewFoodName}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                    <TextInput
                        style={[Common_styles.input, { flex: 2, marginRight: 5 }]}
                        placeholder="蛋白質"
                        placeholderTextColor="rgba(60, 130, 245, 0.5)"
                        value={protein}
                        onChangeText={setProtein}
                    />
                    <TextInput
                        style={[Common_styles.input, { flex: 2, marginRight: 5 }]}
                        placeholder="碳水化合物"
                        placeholderTextColor="rgba(60, 130, 245, 0.5)"
                        value={carbohydrates}
                        onChangeText={setCarbohydrates}
                    />
                    <TextInput
                        style={[Common_styles.input, { flex: 2, marginRight: 5 }]}
                        placeholder="脂肪"
                        placeholderTextColor="rgba(60, 130, 245, 0.5)"
                        value={fat}
                        onChangeText={setFat}
                    />
                    <TouchableOpacity
                        style={[Common_styles.submitBtn, { flex: 1 }]}
                        onPress={handleAddFood}
                    >
                        <Text style={{ color: 'white', textAlign: 'center' }}>新增</Text>
                    </TouchableOpacity>
                </View>

                {result_FoodData.length > 0 ? (
                    result_FoodData.map((item, index) => (
                        <View key={index} style={[Common_styles.diaryItem, { backgroundColor: '#4361a3' }]}>
                            <Text style={Common_styles.category}>
                                {item.owner_name}
                            </Text>
                            <Text style={Common_styles.name}>{item.food_name}</Text>
                            <Text style={Common_styles.details}>
                                {'卡路里:' + item.calorie}
                            </Text>
                            <Text style={Common_styles.details}>
                                {'蛋白質:' + item.protein + 'g 脂肪:' + item.fat + 'g 碳水化合物:' + item.carbohydrates + 'g'}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={Common_styles.noData}>目前食物資料庫中沒有資料</Text>
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

export default FoodDatabase