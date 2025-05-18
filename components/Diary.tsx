import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import CustomModal from "./CustomModal";
import DailyCalorieSection from "./diaries/DailyCalorieSection";
import DiaryHeader from "./diaries/DiaryHeader";
import { supabase } from "../lib/supabase";
import Common_styles from "../lib/common_styles";
import { format } from 'date-fns';
import SuccessModal from "./SuccesModal";
import ErrorModal from "./ErrorModal";
import LoadingModal from "./LoadingModal";

interface Props {
  user: any
}

type CombinedEntry = {
  type: 'food' | 'exercise';
  create_time: string;
  data: any; // 可根據實際型別調整
};

type GroupedByDate = Record<string, CombinedEntry[]>;

function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'yyyy-MM-dd');
}

function groupByDate(
  foods: any[], // mergedFoodDetails
  exercises: any[] // exerciseDetails
): GroupedByDate {
  const grouped: GroupedByDate = {};

  // 處理食物資料
  for (const food of foods) {
    const date = formatDate(food.create_time);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push({
      type: 'food',
      create_time: food.create_time,
      data: food,
    });
  }

  // 處理運動資料
  for (const ex of exercises) {
    const date = formatDate(ex.create_time);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push({
      type: 'exercise',
      create_time: ex.create_time,
      data: ex,
    });
  }

  return grouped;
}


const Diary = ({ user }: Props) => {
  const [message, setModalMessage] = useState('')
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dailyData, setDailyData] = useState<any[]>([])
  const [userData, setUserData] = useState<any[]>([])

  const calculateCalories = ({
    weightKg,
    age,
    sex, // 1=男，2=女
    durationSec,
    heartRate,
  }: {
    weightKg: number;
    age: number;
    sex: number;
    durationSec: number;
    heartRate: number;
  }) => {
    const durationMin = durationSec / 60;
    let calories = 0;
    console.log('sex', sex)
    if (sex === 1 || sex === 1) {
      // 男性
      calories =
        ((-55.0969 + 0.6309 * heartRate + 0.1988 * weightKg + 0.2017 * age) *
          durationMin) /
        4.184;
      console.log('heartRate', heartRate)
    } else {
      // 女性
      calories =
        ((-20.4022 + 0.4472 * heartRate - 0.1263 * weightKg + 0.074 * age) *
          durationMin) /
        4.184;
    }

    return Math.max(Math.round(calories), 0); // 不要負數
  };

  const fetchDiarysData = async () => {
    setLoading(true)
    const { data: sport, error: sportError } = await supabase
      .from('diarys')
      .select('*')
      .eq('owner', user.id)
      .eq('category', 'exercise')
    const { data: food, error: foodError } = await supabase
      .from('diarys')
      .select('*')
      .eq('owner', user.id)
      .eq('category', 'food')
    if (sportError || foodError) {
      setModalMessage('讀取 diarys 時發生錯誤')
      setErrorVisible(true)
      setLoading(false)
      return
    }
    const sportDiaryIds = (sport || []).map(item => item.diary_id)
    const foodDiaryIds = (food || []).map(item => item.diary_id)

    const { data: exerciseDetails, error: exerciseError } = await supabase
      .from('diary_exercise')
      .select('*')
      .in('diarys_id', sportDiaryIds)
    const { data: foodDetails, error: foodErrorDetail } = await supabase
      .from('diary_food')
      .select('*')
      .in('diarys_id', foodDiaryIds)
    if (exerciseError || foodErrorDetail) {
      setModalMessage('讀取詳細資料時發生錯誤')
      setErrorVisible(true)
      setLoading(false)
      return
    }
    const foodIds = (foodDetails || [])
      .map(item => item.food_id)
      .filter((id, index, self) => id && self.indexOf(id) === index) // 去除重複與空值
    const { data: foodInfoList, error: foodInfoError } = await supabase
      .from('foods')
      .select('*')
      .in('food_id', foodIds)
    if (foodInfoError) {
      setModalMessage('讀取食物詳細資料時發生錯誤')
      setErrorVisible(true)
      setLoading(false)
      return
    }
    const mergedFoodDetails = foodDetails.map(item => {
      const foodInfo = foodInfoList.find(f => f.food_id === item.food_id)
      return {
        ...item,
        food_info: foodInfo || null,
      }
    })
    const { data: udata, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    const { weight, age, sex } = udata
    if (error) { return }
    const exerciseWithCalories = exerciseDetails.map((item) => {
      const calories = calculateCalories({
        weightKg: weight,
        age,
        sex,
        durationSec: item.duration,
        heartRate: item.avg_heartrate,
      });

      return {
        ...item,
        calories,
      };
    });

    const groupedData = groupByDate(mergedFoodDetails, exerciseWithCalories);
    console.log('Grouped by date:', groupedData);
    setDailyData(groupedData);
    setLoading(false);
  }
  useEffect(() => {
    fetchDiarysData();
  }, [])

  useEffect(() => {
    console.log('Daily Data', dailyData);

  }, [dailyData])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={Common_styles.DYContainer}>
        <DiaryHeader userName={user.name} />

        {Object.entries(dailyData)
          .sort(([dateA], [dateB]) => {
            // 把日期字串轉成 Date，比較大小
            return new Date(dateB).getTime() - new Date(dateA).getTime(); // 最新日期在前
            // 如果要最舊日期在前，改成：new Date(dateA).getTime() - new Date(dateB).getTime()
          })
          .map(([date, items]) => {
            const foodCount = items.filter(i => i.type === 'food').length;
            const exerciseCount = items.filter(i => i.type === 'exercise').length;
            return (
              <DailyCalorieSection
                key={date}
                date={date}
                foodCount={foodCount}
                exerciseCount={exerciseCount}
                items={items}
              />
            );
          })}
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
        <LoadingModal visible={loading} />
      </ScrollView>
    </SafeAreaView>
  )
}


export default Diary