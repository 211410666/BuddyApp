import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import CustomModal from "./CustomModal";
import DailyCalorieSection from "./diaries/DailyCalorieSection";
import DiaryHeader from "./diaries/DiaryHeader";
import { supabase } from "../lib/supabase";
import { UsersTable } from "../lib/types";
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
  // console.log("[User Name]: ", data.name);
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
  console.log("[Diary Entries] 傳入的 userId 是：", userId);
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

async function getDiaryData(userId: string): Promise<DailyGroupData[]> {
  const isValidUser = await supabase.from("users").select("*").eq("id", userId);
  if (!isValidUser) {
    console.error("[Diary Data] Not Valid User");
    return [];
  }
  const diaryList = await fetchDiaryEntries(userId);
  const diaryIds = diaryList.map((d) => d.diary_id);

  const foodRecords = await fetchFoodRecords(diaryIds);
  const exerciseRecords = await fetchExerciseRecords(diaryIds);

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
            console.log("📌 處理 food category:", diary);
            const match = foodRecords.find(
              (f) => f.diarys_id === diary.diary_id,
            );
            if (!match) {
              console.log("❌ 沒有找到對應的 food record");
              return null;
            }
            console.log("✅ 找到對應 food record:", match);
            return {
              id: match.diarys_id,
              title: `食物 #${match.food_id}`,
              time: extractTime(match.create_time),
              type: "food" as const,
              calories: 0,
            };
          })
          .with("exercise", () => {
            console.log("📌 處理 exercise category:", diary);
            const match = exerciseRecords.find(
              (e) => e.diarys_id === diary.diary_id,
            );
            if (!match) {
              console.log("❌ 沒有找到對應的 exercise record");
              return null;
            }
            console.log("✅ 找到對應 exercise record:", match);
            const intensity = match.avg_heartrate > 140 ? 8 : 4;
            const calories = match.duration * intensity;
            return {
              id: match.diarys_id,
              title: "運動",
              time: extractTime(match.create_time),
              type: "exercise" as const,
              calories,
            };
          });

        if (result) {
          console.log("➡️ 推入項目:", result);
          items.push(result);
        }
      }

      return {
        date,
        foodCount: items.filter((i) => i.type === "food").length,
        exerciseCount: items.filter((i) => i.type === "exercise").length,
        items,
      };
    },
  );
  console.log('final Data',finalData);
  return finalData;
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
    // setDailyData([
    //   {
    //     date: "2025-05-15",
    //     foodCount: 2,
    //     exerciseCount: 1,
    //     items: [
    //       {
    //         id: "f1",
    //         title: "白飯",
    //         time: "08:00",
    //         type: "food",
    //         calories: 300,
    //       },
    //       {
    //         id: "f2",
    //         title: "便當",
    //         time: "12:00",
    //         type: "food",
    //         calories: 650,
    //       },
    //       {
    //         id: "e1",
    //         title: "跑步",
    //         time: "18:00",
    //         type: "exercise",
    //         calories: 450,
    //       },
    //     ],
    //   },
    //   {
    //     date: "2025-05-14",
    //     foodCount: 1,
    //     exerciseCount: 2,
    //     items: [
    //       {
    //         id: "e2",
    //         title: "游泳",
    //         time: "07:30",
    //         type: "exercise",
    //         calories: 600,
    //       },
    //       {
    //         id: "f3",
    //         title: "饅頭",
    //         time: "09:00",
    //         type: "food",
    //         calories: 220,
    //       },
    //       {
    //         id: "e3",
    //         title: "跳繩",
    //         time: "21:00",
    //         type: "exercise",
    //         calories: 300,
    //       },
    //     ],
    //   },
    //   {
    //     date: "2025-05-13",
    //     foodCount: 1,
    //     exerciseCount: 1,
    //     items: [
    //       {
    //         id: "f4",
    //         title: "麵包",
    //         time: "10:00",
    //         type: "food",
    //         calories: 280,
    //       },
    //       {
    //         id: "e4",
    //         title: "重訓",
    //         time: "17:00",
    //         type: "exercise",
    //         calories: 500,
    //       },
    //     ],
    //   },
    // ]);
  }, [user.id]);

  useEffect(() => {
    console.log("✅ dailyData 更新：", dailyData);
  }, [dailyData]);

  const showMessage = (msg: string) => {
    setModalMessage(msg);
    setIsMessageModalVisible(true);
  };

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
