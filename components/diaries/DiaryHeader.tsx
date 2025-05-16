import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Common_styles from "../../lib/common_styles";
type DiaryHeaderProps = {
  userName: string;
};

export default function DiaryHeader({ userName }: DiaryHeaderProps) {
  return (
    <View style={Common_styles.DYHContainer}>
      <Text style={Common_styles.DYHText}>{userName}</Text>
      <Text style={Common_styles.DYHText}>近期紀錄</Text>
    </View>
  );
}

