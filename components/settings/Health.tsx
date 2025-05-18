import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const { height: WINDOWS_HEIGHT, width: WINDOWS_WIDTH } =
  Dimensions.get("screen");

type DataHealth = {
  weight: number;
  height: number;
  bodyFatPercentage: number;
};

const Health = ({ user }: { user: any }) => {
  const [userHealth, setUserHealth] = useState<DataHealth>({
    weight: 0,
    height: 0,
    bodyFatPercentage: 0,
  });
  useEffect(() => {
    const fetchUserHealth = async () => {
      const { data: userHealth, error: fetchHealthError } = await supabase
        .from("users")
        .select("height, weight, bfp")
        .eq("id", user.id)
        .single();
      if (fetchHealthError) {
        console.error("[User Health] ", fetchHealthError);
      }
      if (!userHealth) {
        console.error("[User Health] Can not Search Health");
        return;
      }
      setUserHealth({
        weight: userHealth.weight || 0,
        height: userHealth.height || 0,
        bodyFatPercentage: userHealth.bfp || 0,
      });
    };
    fetchUserHealth();
  }, []);
  useEffect(() => {
    console.log(userHealth);
  }, [userHealth]);
  return (
    <View style={style.card}>
      <View style={style.item}>
        <Text style={style.itemTitle}>Height</Text>
        <TextInput
          style={style.itemValue}
          value={userHealth.height.toString()}
          onChangeText={(newHeight) =>
            setUserHealth((prev) => ({
              ...prev,
              height: parseInt(newHeight.replace(/[^\d]/g, "")),
            }))
          }
        ></TextInput>
      </View>
      <View style={style.item}>
        <Text style={style.itemTitle}>Weight</Text>
        <TextInput
          style={style.itemValue}
          value={userHealth.weight.toString()}
          onChangeText={(newWeight) =>
            setUserHealth((prev) => ({
              ...prev,
              weight: parseInt(newWeight.replace(/[^\d]/g, "")),
            }))
          }
        ></TextInput>
      </View>
      <View style={style.item}>
        <Text style={style.itemTitle}>Body Fat Percentage</Text>
        <TextInput
          style={style.itemValue}
          value={userHealth.bodyFatPercentage.toString()}
          onChangeText={(newUri) =>
            setUserHealth((prev) => ({
              ...prev,
              bodyFatPercentage: parseFloat(newUri.replace(/[^\d]/g, "")),
            }))
          }
        ></TextInput>
      </View>
      <Pressable
        style={style.btnSubmit}
        onPress={async () => {
          const { error: updateHeightError } = await supabase
            .from("users")
            .update({ height: userHealth.height })
            .eq("id", user.id);
          const { error: updateWeightError } = await supabase
            .from("users")
            .update({ weight: userHealth.weight })
            .eq("id", user.id);
          const { error: updateBFPError } = await supabase
            .from("users")
            .update({ bfp: userHealth.bodyFatPercentage })
            .eq("id", user.id);
          if (updateHeightError) {
            console.error("[Height Update] ", updateHeightError);
          }
          if (updateWeightError) {
            console.error("[Weight Update] ", updateWeightError);
          }
          if (updateBFPError) {
            console.error("[BFP Update] ", updateBFPError);
          }
        }}
      >
        <Text style={style.textSummit}>Submit</Text>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    flex: 3,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2c2c2c",
  },
  item: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemValue: {
    width: 80,
    height: 36,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "right",
  },
  btnSubmit: {},
  textSummit: {},
});

export default Health;
