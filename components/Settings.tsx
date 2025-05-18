import React, { useState } from "react";
import { View, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { match } from "ts-pattern";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import Health from "./settings/Health.tsx";
import Profile from "./settings/Profile.tsx";

const { height: WINDOWS_HEIGHT, width: WINDOWS_WIDTH } =
  Dimensions.get("screen");

const isTablet = WINDOWS_WIDTH >= 768;
const isDesktop = WINDOWS_WIDTH >= 1024;

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
    <SafeAreaView style={pageStyles.screen}>
      <View
        style={[
          pageStyles.dash,
          isTablet && { width: WINDOWS_WIDTH * 0.8 },
          isDesktop && { width: WINDOWS_WIDTH * 0.75 },
        ]}
      >
        <Profile user={user}></Profile>
        <Health user={user}></Health>
      </View>
    </SafeAreaView>
  );
}

const pageStyles = StyleSheet.create({
  screen: {
    flex: 1,
    width: WINDOWS_WIDTH,
    height: WINDOWS_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(208, 224, 253, 1)",
  },
  dash: {
    width: WINDOWS_WIDTH * 0.88,
    height: WINDOWS_HEIGHT * 0.77,
    padding: 4 * 12,
    backgroundColor: "rgba(246, 249, 255, 1)",
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 16,
  },
});
