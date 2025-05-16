import React, { useState } from "react";
import {
  View,
  StyleSheet,
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
            items.map((entry) => (
              <CalorieEntryItem
                key={entry.id}
                time={entry.time}
                title={entry.title}
                type={entry.type}
                calories={entry.calories}
              />
            ))
          )}
          <View style={Common_styles.divider} />
        </View>
      )}
    </View>
  );
}

