import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.tag, isFood ? styles.food : styles.exercise]}>
          {type}
        </Text>
      </View>
      <Text style={[styles.kcal, isFood ? styles.intake : styles.burn]}>
        {calories} kcal
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
  },
  tag: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  food: {
    backgroundColor: "#f9d5cc",
    color: "#e74c3c",
  },
  exercise: {
    backgroundColor: "#d4f4e2",
    color: "#27ae60",
  },
  kcal: {
    fontWeight: "bold",
    fontSize: 14,
  },
  intake: {
    color: "#e74c3c",
  },
  burn: {
    color: "#27ae60",
  },
});
