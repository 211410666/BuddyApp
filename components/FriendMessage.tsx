import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import LoadingModal from './LoadingModal'
import Common_styles from '../lib/common_styles'
interface Props {
    user: any
}

const FriendMessage = ({ user }: Props) => {
    const [loading, setLoading] = useState(false)
    const [friendDiaryData, setFriendDiaryData] = useState<any[]>([])

    useEffect(() => {
        if (user?.id) {
            fetchFriendDiarys()
        }
    }, [user])

    const fetchFriendDiarys = async () => {
        setLoading(true)
        const { data: my_diarys, error: fetchError } = await supabase
            .from('diarys')
            .select('*')
            .eq('owner', user.id)
        if (fetchError) {
            console.log('fetch your diarys Error!')
            return;
        }
        const foodDiaryIds = my_diarys
            .filter(d => d.category === 'food')
            .map(d => d.diary_id)
        const exerciseDiaryIds = my_diarys
            .filter(d => d.category === 'exercise')
            .map(d => d.diary_id)

        const { data: diaryFoods } = await supabase
            .from('diary_food')
            .select('*')
            .in('diarys_id', foodDiaryIds);

        const { data: diaryExercises } = await supabase
            .from('diary_exercise')
            .select('*')
            .in('diarys_id', exerciseDiaryIds);

        const foodData = (diaryFoods || []).map((item) => ({
            id: item.id,
            create_time: item.create_time,
            category: 'food',
        }));
        const exerciseData = (diaryExercises || []).map((item) => ({
            id: item.id,
            create_time: item.create_time,
            category: 'exercise',
        }));
        const mergedData = [...foodData, ...exerciseData];
        const ids = mergedData.map((item) => item.id);

        const { data: isGoodData } = await supabase
            .from('is_good')
            .select('diary_id, owner, create_time')
            .in('diary_id', ids);

        const goodMap = new Map<string, { owner: string; good_time: string }>();
        isGoodData?.forEach((item) => {
            goodMap.set(item.diary_id, {
                owner: item.owner,
                good_time: item.create_time,
            });
        });

        const mergedWithGood = mergedData
            .map((item) => {
                const good = goodMap.get(item.id);
                if (!good) return null;
                return {
                    ...item,
                    owner: good.owner,
                    good_time: good.good_time,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

        // 🔽 這邊是新加的：從 users 取出 name
        const ownerIds = Array.from(new Set(mergedWithGood.map(item => item.owner)));
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, name')
            .in('id', ownerIds);
        if (userError) {
            console.error('Failed to fetch users name:', userError.message);
        }

        const nameMap = new Map<string, string>();
        userData?.forEach(user => {
            nameMap.set(user.id, user.name);
        });

        const mergedWithNames = mergedWithGood.map(item => ({
            ...item,
            name: nameMap.get(item.owner) || '未知使用者',
        }));

        setFriendDiaryData(mergedWithNames);
        setLoading(false);
    };


    const formatDate = (datetime: string) => {
        const date = new Date(datetime);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    };


    return (
        <View style={Common_styles.friendContainer}>
            <ScrollView >
                {friendDiaryData.length > 0 ? (
                    friendDiaryData.map((item, index) => (
                        <View key={index} style={Common_styles.diaryItem}>
                            <Text style={Common_styles.message}>
                                <Text style={Common_styles.FMCategory}>{item.name}</Text>
                                {' 覺得你於 '}
                                {new Date(item.create_time).toISOString().split('T')[0]}
                                {' 發布的 '}
                                <Text style={Common_styles.FMCategory}>
                                    {item.category === 'food' ? '飲食' : '運動'}
                                </Text>
                                {' 紀錄很讚！'}
                            </Text>
                            <Text style={Common_styles.goodTime}>
                                {new Date(item.good_time).toLocaleString('zh-TW', {
                                    timeZone: 'Asia/Taipei',
                                    hour12: false,
                                })}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={Common_styles.noData}>目前無好友的日記資料</Text>
                )}
            </ScrollView>
            <LoadingModal visible={loading} />
        </View>

    )
}

export default FriendMessage

