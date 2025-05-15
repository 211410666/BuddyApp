import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import CustomModal from "./CustomModal";
import DailyCalorieSection from "./diaries/DailyCalorieSection";
import DiaryHeader from "./diaries/DiaryHeader";
import { supabase } from "../lib/supabase";
import { UsersTable } from "../lib/types";

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

export default function Diary({ user }: DiaryProps) {
  const [userName, setUserName] = useState("");
  const [dailyData, setDailyData] = useState<DailyGroupData[]>([]);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("取得使用者名稱失敗:", error);
        return;
      }
      setUserName(data?.name ?? "");
    };

    fetchUserName();
  }, [user.id]);

  useEffect(() => {
    const mockData: DailyGroupData[] = [
      {
        date: "2025/05/15",
        foodCount: 2,
        exerciseCount: 1,
        items: [
          {
            id: "1",
            time: "08:30",
            title: "白飯",
            type: "food",
            calories: 450,
          },
          {
            id: "2",
            time: "12:00",
            title: "跑步",
            type: "exercise",
            calories: 300,
          },
          {
            id: "3",
            time: "20:00",
            title: "雞胸肉",
            type: "food",
            calories: 350,
          },
        ],
      },
      {
        date: "2025/05/14",
        foodCount: 1,
        exerciseCount: 2,
        items: [
          {
            id: "4",
            time: "09:00",
            title: "饅頭",
            type: "food",
            calories: 320,
          },
          {
            id: "5",
            time: "10:30",
            title: "跳繩",
            type: "exercise",
            calories: 250,
          },
          {
            id: "6",
            time: "18:00",
            title: "游泳",
            type: "exercise",
            calories: 400,
          },
        ],
      },
    ];
    setDailyData(mockData);
  }, []);

  const showMessage = (msg: string) => {
    setModalMessage(msg);
    setIsMessageModalVisible(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 64,
    backgroundColor: "#fff",
  },
});
