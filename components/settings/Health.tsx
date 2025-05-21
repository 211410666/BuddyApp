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
import { FontAwesome } from "@expo/vector-icons";
import Common_styles from "../../lib/common_styles";
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
        {/* Height */}
        <View style={style.item}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={[Common_styles.iconContainer, { marginRight: 10 }]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="line-spacing"
              >
                <path
                  fill="#4a7aba"
                  d="M6.29,9.71a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-2-2a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-2,2A1,1,0,0,0,3.71,9.71L4,9.41v5.18l-.29-.3a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l2-2a1,1,0,0,0-1.42-1.42l-.29.3V9.41ZM11,8H21a1,1,0,0,0,0-2H11a1,1,0,0,0,0,2Zm10,3H11a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm0,5H11a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
                ></path>
              </svg>
            </View>
            <Text style={style.itemTitle}>身高</Text>
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
          />
        </View>

        {/* Weight */}
        <View style={style.item}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={[Common_styles.iconContainer, { marginRight: 10 }]}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  fill="#4a7aba"
                  d="M128 176a128 128 0 1 1 256 0 128 128 0 1 1 -256 0zM391.8 64C359.5 24.9 310.7 0 256 0S152.5 24.9 120.2 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-56.2 0zM296 224c0-10.6-4.1-20.2-10.9-27.4l33.6-78.3c3.5-8.1-.3-17.5-8.4-21s-17.5 .3-21 8.4L255.7 184c-22 .1-39.7 18-39.7 40c0 22.1 17.9 40 40 40s40-17.9 40-40z"
                />
              </svg>
            </View>
            <Text style={style.itemTitle}>體重</Text>
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
          />
        </View>

        {/* Body Fat Percentage */}
        <View style={style.item}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={[Common_styles.iconContainer, { marginRight: 10 }]}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
                <path
                  fill="#4a7aba"
                  d="M48 .5c-4.762 0-8.627 3.866-8.627 8.627 0 4.762 3.865 8.628 8.627 8.628 4.762 0 8.627-3.866 8.627-8.628 0-4.761-3.865-8.627-8.627-8.627zm0 3c3.106 0 5.627 2.522 5.627 5.627 0 3.106-2.521 5.628-5.627 5.628-3.106 0-5.627-2.522-5.627-5.628 0-3.105 2.521-5.627 5.627-5.627zM31.771 35.554l-4.719 3.128c-.648.43-.86 1.285-.488 1.969l3.375 6.187c.822 1.507.266 3.397-1.241 4.219-1.506.822-3.397.266-4.219-1.241 0 0-5.245-9.616-5.245-9.616-.725-1.329-.387-2.986.798-3.926.007-.005 12.88-9.711 12.88-9.711 1.772-1.336 3.931-2.059 6.151-2.059 4.843 0 13.031 0 17.874 0 2.22 0 4.379.723 6.151 2.059 0 0 12.873 9.706 12.873 9.706 1.191.939 1.531 2.6.805 3.931 0 0-5.245 9.616-5.245 9.616-.822 1.507-2.713 2.063-4.219 1.241-1.507-.822-2.063-2.712-1.241-4.219 0 0 3.375-6.187 3.375-6.187.372-.684.16-1.539-.488-1.969l-8.791-5.828c-.471-.313-1.079-.333-1.571-.053-.492.28-.784.813-.756 1.378.111 2.207-.505 9.47.193 18.313.912 11.549 3.874 25.487 5.422 34.989.384 2.355-1.217 4.578-3.572 4.962-2.355.384-4.579-1.217-4.962-3.572-.004-.02-.007-.04-.011-.06l-5.459-26.667c-.143-.699-.758-1.2-1.471-1.2-.713.001-1.327.504-1.469 1.203l-5.401 26.667c-.004.019-.007.038-.011.057-.383 2.355-2.607 3.956-4.962 3.572-2.355-.384-3.956-2.607-3.572-4.962.003-.016.005-.033.007-.049.977-7.547 3.666-22.635 5.012-34.894 1.04-9.473.875-17.255 1.019-18.555.09-.823-.504-1.564-1.327-1.655-.823-.091-1.565.504-1.655 1.327-.144 1.3.021 9.082-1.019 18.555-1.343 12.232-4.027 27.284-5.003 34.823-.633 3.971 2.075 7.723 6.056 8.371 3.986.649 7.75-2.057 8.404-6.042-.004.022 3.93-19.4 3.93-19.4 0 0 3.976 19.424 3.976 19.424.665 3.971 4.422 6.666 8.4 6.018 3.989-.65 6.701-4.416 6.051-8.405-1.537-9.436-4.487-23.275-5.392-34.743-.505-6.403-.317-11.973-.218-15.38 0 .001 5.347 3.546 5.347 3.546 0 0-2.716 4.979-2.716 4.979-1.615 2.961-.522 6.675 2.438 8.29 2.96 1.614 6.675.522 8.29-2.438 0 0 5.244-9.616 5.244-9.616 1.431-2.622.755-5.894-1.596-7.736-.007-.006-.015-.011-.022-.017 0 0-8.224-6.201-12.887-9.716-2.292-1.729-5.086-2.664-7.957-2.664-4.843 0-13.031 0-17.874 0-2.871 0-5.665.935-7.957 2.664-4.663 3.515-12.887 9.716-12.887 9.716-.007.006-.015.011-.022.017-2.351 1.842-3.027 5.114-1.596 7.736 0 0 5.244 9.616 5.244 9.616 1.615 2.96 5.33 4.052 8.29 2.438 2.96-1.615 4.053-5.329 2.438-8.29 0 0-2.716-4.979-2.716-4.979 0 0 3.571-2.368 3.571-2.368.69-.457.879-1.389.422-2.079-.458-.69-1.389-.878-2.079-.421z"
                />
              </svg>
            </View>
            <Text style={style.itemTitle}>體脂率</Text>
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
          />
        </View>
        <View style={style.item}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={Common_styles.iconContainer}>
              {/* TODO: Filled in with icons that fits BMI */}
            </View>
            <Text style={style.itemTitle}>BMI</Text>
          </View>
          <View style={[style.itemValue, { borderBottomWidth: 0 }]}>
            {(userHealth.weight / Math.pow(userHealth.height / 100, 2)).toFixed(
              1,
            )}
          </View>
        </View>
      </View>

      {/* ✅ Submit Button - centered */}
      <View
        style={{
          marginTop: 30,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
            if (updateHeightError)
              console.error("[Height Update] ", updateHeightError);
            if (updateWeightError)
              console.error("[Weight Update] ", updateWeightError);
            if (updateBFPError) console.error("[BFP Update] ", updateBFPError);
          }}
        >
          <Text style={style.textSummit}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  //下內框
  card: {
    alignSelf: "stretch",
    flex: 3,
    flexDirection: "column",
    justifyContent: "space-between",
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
    marginTop: 20,
    padding: 20,
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
    color: "#4a7aba",
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
});

export default Health;
