import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import CustomModal from "./CustomModal";
import DailyCalorieSection from "./diaries/DailyCalorieSection";
import DiaryHeader from "./diaries/DiaryHeader";
import { supabase } from "../lib/supabase";
import { Integer4, UsersTable } from "../lib/types";
import { match } from "ts-pattern";
import Common_styles from "../lib/common_styles";
interface DiaryProps {
  user: Pick<UsersTable, "id">;
}

type EntryType = "food" | "exercise";

interface EntryItem {
  id: string;
  title: string;
  time: string;
  type: EntryType;
  calories: number;
}

interface DailyGroupData {
  date: string;
  foodCount: number;
  exerciseCount: number;
  items: EntryItem[];
}

async function getUserName(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from("users")
    .select("name")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("取得使用者名稱失敗:", error);
    return "";
  }
  if (!data) {
    console.error("[User Name] Can not fetch user name");
    return "";
  }
  return data.name ?? "";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

function extractTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

async function fetchDiaryEntries(userId: string) {

  const { data, error } = await supabase
    .from("diarys")
    .select("*")
    .eq("owner", userId)
    .order("create_time", { ascending: false });
  if (error) {
    console.error(`[Fetch Diaries] error: ${error}`);
    return [];
  }
  if (!data || data.length === 0) {
    console.error("[Fetch Diaries] Data is empty");
    return [];
  }
  return data;
}

async function fetchFoodRecords(diaryIds: string[]) {
  const { data, error } = await supabase
    .from("diary_food")
    .select("diarys_id, food_id, create_time")
    .in("diarys_id", diaryIds);
  if (error) {
    console.error("[Food Records] Error: ", error);
    return [];
  }
  if (!data || data.length === 0) {
    console.error("[Food Records] Data is empty");
    return [];
  }
  console.log("🥬 foodRecords:", data);
  return data;
}

async function fetchExerciseRecords(diaryIds: string[]) {
  const { data, error } = await supabase
    .from("diary_exercise")
    .select("diarys_id, avg_heartrate, duration, create_time")
    .in("diarys_id", diaryIds);
  if (error) {
    console.error("[Exercise Records] Error: ", error);
    return [];
  }
  if (!data || data.length === 0) {
    console.error("[Exercise Records] Data is empty");
    return [];
  }
  console.log("🏃‍♂️ exerciseRecords:", data);
  return data;
}

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
  return data
}

async function getDiaryData(userId: string): Promise<DailyGroupData[]> {
  const isValidUser = await supabase.from("users").select("*").eq("id", userId);
  if (!isValidUser) {
    console.error("[Diary Data] Not Valid User");
    return [];
  }
  const diaryList = await fetchDiaryEntries(userId);
  const diaryIds = diaryList.map((d) => d.diary_id);
  const foodRecords = await fetchFoodRecords(diaryIds);
  const foodIds = foodRecords.map((d) => d.food_id);
  const exerciseRecords = await fetchExerciseRecords(diaryIds);
  const foodDatas = await fetchFoodData(foodIds);
  const userData = await fetchUserData(userId);

  const groupedByDate: Record<
    string,
    { diary_id: string; category: string }[]
  > = {};
  for (const diary of diaryList) {
    const date = formatDate(diary.create_time);
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push({
      diary_id: diary.diary_id,
      category: diary.category,
    });
  }

  const finalData: DailyGroupData[] = Object.entries(groupedByDate).map(
    ([date, entries]) => {
      const items: EntryItem[] = [];

      for (const diary of entries) {
        const result = match(diary.category)
          .with("food", () => {
            const match = foodRecords.find(
              (f) => f.diarys_id === diary.diary_id,
            );
            if (!match) {
              return null;
            }
            const foodData = foodDatas.find((f) => f.food_id === match.food_id);
            const calories = foodData ? foodData.calorie : 0;
            return {
              id: match.diarys_id,
              title: `食物 #${match.food_id}`,
              time: extractTime(match.create_time),
              type: "food" as const,
              calories: calories,
            };
          })
          .with("exercise", () => {
            const match = exerciseRecords.find(
              (e) => e.diarys_id === diary.diary_id,
            );
            if (!match) {
              return null;
            }
            const heartRate = match.avg_heartrate;
            const durationInHours = match.duration / 3600;
            const weight = userData.weight ?? 60; // 預設60公斤，防呆
            let MET = 3.5;

            if (heartRate >= 140) MET = 8.0;
            else if (heartRate >= 120) MET = 6.0;
            else if (heartRate >= 100) MET = 4.5;
            else MET = 2.5;
            
            const calories = (MET * weight * durationInHours).toFixed(1);
            console.log('calorie',calories)
        
            return {
              id: match.diarys_id,
              title: "運動",
              time: extractTime(match.create_time),
              type: "exercise" as const,
              calories,
            };
          });

        if (result) {
          items.push(result);
        }
      }

      return {
        date,
        foodCount: items.filter((i) => i.state.value.type === "food").length,
        exerciseCount: items.filter((i) => i.state.value.type === "exercise").length,
        items,
      };
    },
  );
  return finalData;
}

async function fetchUserData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.log('loading error')
    return;
  }
  return data;
}

export default function Diary({ user }: DiaryProps) {
  const [userName, setUserName] = useState("");
  const [dailyData, setDailyData] = useState<DailyGroupData[]>([]);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");



  useEffect(() => {
    getUserName(user.id).then((name) => {
      const cleanedName = name.replace("@gmail.com", ""); // 刪除特定字串
      setUserName(cleanedName);
    });
    getDiaryData(user.id).then(setDailyData);

  }, [user.id]);

  useEffect(() => {
    console.log("✅ dailyData 更新：", dailyData);
  }, [dailyData]);

  const closeMessageModal = () => {
    setIsMessageModalVisible(false);
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={Common_styles.DYContainer}>
        <DiaryHeader userName={userName} />

        {dailyData.map((day) => (
          <DailyCalorieSection
            key={day.date}
            date={day.date}
            foodCount={day.foodCount}
            exerciseCount={day.exerciseCount}
            items={day.items}
          />
        ))}

        <CustomModal
          visible={isMessageModalVisible}
          message={modalMessage}
          onClose={closeMessageModal}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
