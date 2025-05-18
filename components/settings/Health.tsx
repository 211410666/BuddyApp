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
import { FontAwesome } from '@expo/vector-icons';
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
      <View style={style.items}>
        <View style={style.item}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={style.iconFormat}>
              <FontAwesome name="arrows-v" size={20} color="#4a7aba" />
            </View>
            <Text style={style.itemTitle}>Height</Text>
          </View>
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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={style.iconFormat}>
              <FontAwesome name="balance-scale" size={20} color="#4a7aba" />
            </View>
            <Text style={style.itemTitle}>Weight</Text>
          </View>
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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={style.iconFormat}>
              <FontAwesome name="tint" size={20} color="#4a7aba" />
            </View>
            <Text style={style.itemTitle}>Body Fat Percentage</Text>
          </View>
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
  //下內框
  card: {
    alignSelf: "stretch",
    flex: 3,
    flexDirection: "column",
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: "relative",

  },
  items: {
    flexDirection: "column",
    width: "100%",
  },
  //參數項目
  item: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  //參數名稱
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",

  },
  //參數值
  itemValue: {
    width: 80,
    height: 36,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
  },
  btnSubmit: {
    borderRadius: 8,
    backgroundColor: "#4a7aba",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginHorizontal: "auto",
    marginBottom: 30,
  },

  textSummit: {
    color: "#fff",
    fontWeight: "600",
  },
  iconFormat: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  }
});

export default Health;
