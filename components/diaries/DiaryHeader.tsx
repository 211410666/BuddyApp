import React from "react";
import { Text, StyleSheet, View } from "react-native";

type DiaryHeaderProps = {
  userName: string;
};

export default function DiaryHeader({ userName }: DiaryHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{userName}</Text>
      <Text style={styles.text}>近期紀錄</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBlock: 32,
    gap: 8,
  },
  text: {
    fontSize: 21,
    fontWeight: "bold",
  },
});
