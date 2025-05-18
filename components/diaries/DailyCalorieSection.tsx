import React, { useState } from "react";
import {
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  Text,
} from "react-native";
import DailySummaryButton from "./DailySummaryButton";
import CalorieEntryItem from "./CalorieEntryItem";
import Common_styles from "../../lib/common_styles";
type EntryType = "food" | "exercise";

type EntryItem = {
  id: string;
  title: string;
  time: string;
  type: EntryType;
  calories: number;
};

type DailyCalorieSectionProps = {
  date: string;
  foodCount: number;
  exerciseCount: number;
  items: EntryItem[];
};

// 啟用 Android 的 LayoutAnimation
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DailyCalorieSection({
  date,
  foodCount,
  exerciseCount,
  items,
}: DailyCalorieSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };
  return (
    <View style={Common_styles.section}>
      <DailySummaryButton
        date={date}
        foodCount={foodCount}
        exerciseCount={exerciseCount}
        isExpanded={expanded}
        onPress={toggleExpanded}
      />

      {expanded && (
        <View style={Common_styles.expandArea}>
          <View style={Common_styles.divider} />
          {items.length === 0 ? (
            <Text style={Common_styles.emptyText}>這天沒有紀錄喔！</Text>
          ) : (
            items.map((entry, index) => {
              console.log("entry", index, entry);

              // 取時間時分，例如 "2025-05-18T15:30:00" 取成 "15:30"
              const time =
                entry.data?.create_time
                  ? new Date(entry.data.create_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "";

              if (entry.type === "food") {
                return (
                  <CalorieEntryItem
                    key={entry.data.id}
                    time={time}
                    title={entry.data.food_info.food_name}
                    type={entry.type}
                    calories={entry.data.food_info.calorie}
                  />
                );
              } else if (entry.type === "exercise") {
                return (
                  <CalorieEntryItem
                    key={entry.data.id}
                    time={time}
                    title="運動"
                    type={entry.type}
                    calories={entry.data.calories}
                  />
                );
              } else {
                // 萬一有其它 type，避免錯誤
                return null;
              }
            })
          )}

          <View style={Common_styles.divider} />
        </View>
      )}
    </View>
  );
}
