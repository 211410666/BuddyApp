import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Common_styles from "../../lib/common_styles";
type EntryType = "food" | "exercise";

type CalorieEntryItemProps = {
  time: string;
  title: string;
  type: EntryType;
  calories: number;
};

export default function CalorieEntryItem({
  time,
  title,
  type,
  calories,
}: CalorieEntryItemProps) {
  const isFood = type === "food";
  return (
    <View style={Common_styles.row}>
      <View style={Common_styles.left}>
        <Text style={Common_styles.time}>{time}</Text>
        <Text style={Common_styles.CEITitle}>{title}</Text>
        <Text style={[Common_styles.tag, isFood ? Common_styles.food : Common_styles.exercise]}>
          {type}
        </Text>
      </View>
      <Text style={[Common_styles.kcal, isFood ? Common_styles.intake : Common_styles.burn]}>
        {calories} kcal
      </Text>
    </View>
  );
}

