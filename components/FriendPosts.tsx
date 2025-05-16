import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import LoadingModal from './LoadingModal'
interface Props {
    user: any
}

const FriendPosts = ({ user }: Props) => {
    const [loading, setLoading] = useState(false)
    const [friendDiaryData, setFriendDiaryData] = useState<any[]>([])

    useEffect(() => {
        if (user?.id) {
            fetchFriendDiarys()
        }
    }, [user])

    const fetchFriendDiarys = async () => {
        setLoading(true)
        // ✅ 找出好友關係
        const { data: relations, error: relationError } = await supabase
            .from('relations')
            .select('owner_id, target_id')
            .or(`owner_id.eq.${user.id},target_id.eq.${user.id}`)
            .eq('relation_state', 1)

        if (relationError) {
            console.error('❌ 好友關係查詢失敗:', relationError)
            return
        }

        const friendIds = relations?.map(r =>
            r.owner_id === user.id ? r.target_id : r.owner_id
        )

        if (!friendIds || friendIds.length === 0) {
            console.log('⚠️ 無任何好友')
            return
        }

        // ✅ 查詢 diarys 中屬於好友的紀錄
        const { data: diarys, error: diaryError } = await supabase
            .from('diarys')
            .select('*')
            .in('owner', friendIds)

        if (diaryError) {
            console.error('❌ diarys 查詢失敗:', diaryError)
            return
        }

        const foodDiaryIds = diarys
            .filter(d => d.category === 'food')
            .map(d => d.diary_id) // 確保你這裡的欄位名對應 Supabase 資料表

        const exerciseDiaryIds = diarys
            .filter(d => d.category === 'exercise')
            .map(d => d.diary_id)

        // ✅ 查詢 diary_food 和 diary_exercise 中 diary_id 在相應範圍的所有資料，並關聯使用者名稱
        const { data: diaryFoodData, error: dfError } = await supabase
            .from('diary_food')
            .select(`
                *,
                diarys:diarys_id (
                    owner,
                    users:owner (
                        name,id
                    )
                )
            `)
            .in('diarys_id', foodDiaryIds)

        const { data: diaryExerciseData, error: deError } = await supabase
            .from('diary_exercise')
            .select(`
                *,
                diarys:diarys_id (
                    owner,
                    users:owner (
                        name,id
                    )
                )
            `)
            .in('diarys_id', exerciseDiaryIds)

        if (dfError || deError) {
            console.error('❌ diary_food 或 diary_exercise 查詢失敗:', dfError || deError)
            return
        }
        // 查詢對應的食物名稱
        const foodIds = diaryFoodData.map((item: any) => item.food_id)
        const { data: foodData, error: foodError } = await supabase
            .from('foods')
            .select('food_id, food_name')
            .in('food_id', foodIds)

        if (foodError) {
            console.error('❌ 食物資料查詢失敗:', foodError)
            return
        }
        // 用食物名稱替換 food_id
        const foodMap = foodData.reduce((acc: any, food: any) => {
            acc[food.food_id] = food.food_name
            return acc
        }, {})

       
        // 🔍 查出使用者對哪些日記按了讚（限定在 diary_id 為好友的日記）
        const { data: likedData, error: likedError } = await supabase
            .from('is_good')
            .select('diary_id,category')
            .eq('owner', user.id)

        if (likedError) {
            console.error('❌ is_good 按讚狀態查詢失敗:', likedError)
            return
        }
        

        const likedDiaryIds = likedData.map(item => item.diary_id)

        // 合併 food 和 exercise 類型的日記資料
        const mergedData = [
            ...diaryFoodData.map((food: any) => ({
                id:food.id,
                diary_id: food.diarys_id,
                owner_id: food.diarys.users.id,
                owner_name: food.diarys?.users?.name,
                category: '飲食',
                create_time: food.create_time,
                food_name: foodMap[food.food_id] || '未知食物', // 替換 food_id 為 food_name
                duration: null,
                heartrate: null,
                is_good: likedDiaryIds.includes(food.id) // ← 新增欄位
            })),
            ...diaryExerciseData.map((exercise: any) => ({
                id:exercise.id,
                diary_id: exercise.diarys_id,
                owner_id: exercise.diarys.users.id,
                owner_name: exercise.diarys?.users?.name,
                category: '運動',
                create_time: exercise.create_time,
                food_name: null,
                duration: exercise.duration,
                heartrate: exercise.avg_heartrate,
                is_good: likedDiaryIds.includes(exercise.id) // ← 新增欄位
            }))
        ]

        // ✅ 根據 create_time 進行排序，確保最新的日記在最上面
        mergedData.sort((a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime())

        // ✅ 更新顯示結果
        setLoading(false)
        setFriendDiaryData(mergedData)
    }

    const formatDuration = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${hours}時 ${minutes}分 ${seconds}秒`
    }

    const handleLikeToggle = async (item: any) => {

        if (item.is_good) {
            // 如果已經按讚，則刪除該紀錄
            const { error } = await supabase
                .from('is_good')
                .delete()
                .eq('owner', user.id)
                .eq('diary_id', item.id)

            if (error) {
                console.error('❌ 刪除按讚失敗:', error)
                return
            }
        } else{
            // 如果尚未按讚，則新增一筆
            const { error } = await supabase
                .from('is_good')
                .insert([
                    {
                        owner: user.id,
                        diary_id: item.id,
                        category: item.category,
                    },
                ])

            if (error) {
                console.error('❌ 新增按讚失敗:', error)
                return
            }
        }

        // ✅ 更新畫面：重新取得好友日記
        fetchFriendDiarys()
    }



    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {friendDiaryData.length > 0 ? (
                    friendDiaryData.map((item, index) => (
                        <View key={index} style={styles.diaryItem}>
                            <Text style={styles.category}>
                                {item.owner_name}
                            </Text>
                            <Text style={styles.name}>發布了一筆{item.category}紀錄</Text>
                            <Text style={styles.details}>
                                {item.category === '飲食'
                                    ? `食物名稱: ${item.food_name}`
                                    : `運動持續時間: ${formatDuration(item.duration)}，心跳率: ${item.heartrate}`}
                            </Text>
                            <Text style={styles.createTime}>
                                發布時間: {new Date(item.create_time).toLocaleString('zh-TW', {
                                    timeZone: 'Asia/Taipei',
                                    hour12: false,
                                })}
                            </Text>
                            <View style={styles.likeContainer}>
                                <TouchableOpacity
                                    style={styles.likeContainer}
                                    onPress={() => handleLikeToggle(item)}
                                >
                                    <Text style={[styles.likeIcon, { color: item.is_good ? 'red' : 'gray' }]}>
                                        {item.is_good ? '❤️' : '🤍'}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>目前無好友的日記資料</Text>
                )}
            </ScrollView>
            <LoadingModal visible={loading} />
        </View>
    )
}

export default FriendPosts

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#818080',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    scrollContainer: {
        marginBottom: 20,
    },
    diaryItem: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        position: 'relative', // ✅ 為了讓 likeIcon 可以絕對定位

    },
    category: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    name: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
    createTime: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
    },
    noData: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    likeContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    likeIcon: {
        fontSize: 20,
    },

})
