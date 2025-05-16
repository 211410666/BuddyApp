import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type DailySummaryButtonProps = {
  date: string;
  foodCount: number;
  exerciseCount: number;
  isExpanded: boolean;
  onPress: () => void;
};

export default function DailySummaryButton({
  date,
  foodCount,
  exerciseCount,
  isExpanded,
  onPress,
}: DailySummaryButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.date}>{date}</Text>
      <View style={styles.rightRow}>
        <Text style={styles.count}>🍚 {foodCount}</Text>
        <Text style={styles.count}>🏃 {exerciseCount}</Text>
        <Text style={styles.expand}>{isExpanded ? "▲" : "▼"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  count: {
    fontSize: 14,
    color: "#555",
  },
  expand: {
    fontSize: 14,
    color: "#aaa",
  },
});
