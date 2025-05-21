import React, { useState } from "react";
import { View, StyleSheet, Dimensions, SafeAreaView, Text } from "react-native";
import { match } from "ts-pattern";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
// @ts-ignore: Unreachable code error due to conditional return, bypassing TS5097
import Health from "./settings/Health.tsx";
// @ts-ignore: Unreachable code error due to conditional return, bypassing TS5097
import Profile from "./settings/Profile.tsx";

const { height: WINDOWS_HEIGHT, width: WINDOWS_WIDTH } =
  Dimensions.get("screen");

const isTablet = WINDOWS_WIDTH >= 768;
const isDesktop = WINDOWS_WIDTH >= 1024;
const cautionBMIRange = {
  l: "< 18.5",
  h: "18.5 ～ 24",
  n: "24 ～ 27",
};

export default function Settings({ user }: any) {
  useEffect(() => {
    const validateUser = async () => {
      const currentUser = await supabase.auth.getUser();
      if (!currentUser) {
        return;
      }
    };
    validateUser();
  }, []);
  return (
    <View style={pageStyles.screen}>
      <View style={pageStyles.dashWrapper}>
        <View style={pageStyles.dash}>
          <Profile user={user} />
          <Health user={user} />
        </View>
        <View style={pageStyles.caution}>
          <Text style={pageStyles.cautionRange}>
            {cautionBMIRange["l"]} 過輕 {"；"}
          </Text>
          <Text style={pageStyles.cautionRange}>
            {cautionBMIRange["h"]} 在正常範圍 {"；"}
          </Text>
          <Text style={pageStyles.cautionRange}>
            {cautionBMIRange["n"]} 過重
          </Text>
        </View>
      </View>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  //背景
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f2ff",
  },
  //白底
  dash: {
    flex: 1,
    width: "88%",
    maxWidth: 768, // 或你想要的最大寬度
    height: "77%", // 用百分比即可
    padding: 10,
    backgroundColor: "#819ac8",
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 16,
  },
  dashWrapper: {
    width: "100%",
    alignItems: "center", // 讓 dash 在寬螢幕置中
  },
  caution: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cautionRange: {
    fontSize: 15,
    color: "#4a7aba",
    textAlign: "center",
    fontWeight: "700",
  },
});
