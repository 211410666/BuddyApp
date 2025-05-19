import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Alert,
} from "react-native";
import EditableAvatar from "./EditableAvatar";
import { supabase } from "../../lib/supabase";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import Common_styles from "../../lib/common_styles";

type Props = {
  value: string;
  onChange: (newValue: string) => void;
  propStyles?: {
    text?: TextStyle;
    btn?: ViewStyle;
    input?: TextStyle;
    container?: ViewStyle;
  };
};

type ProfileData = {
  avatarUri: string;
  name: string;
  email: string;
  sex: number;
};

const EditableText = ({
  value,
  onChange,
  propStyles,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const saveAndExitEdit = async () => {
    if (draft.trim() === "") {
      Alert.alert("錯誤", "姓名不可為空");
      return;
    }
    if (draft.trim() === value) {
      // 沒改變直接關閉編輯
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await onChange(draft.trim());
      setIsEditing(false);
    } catch (error) {
      Alert.alert("更新失敗", "請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[style.container, propStyles?.container]}>
      {isEditing ? (
        <>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            style={[style.input, propStyles?.input]}
            autoFocus
            onSubmitEditing={saveAndExitEdit}
            returnKeyType="done"
            editable={!loading}
          />
          {loading ? (
            <ActivityIndicator size="small" color="#4670b9" />
          ) : (
            <Pressable onPress={saveAndExitEdit} style={[style.icon, propStyles?.btn]}>
              <FontAwesome name="check" size={16} color="#4670b9" />
            </Pressable>
          )}
        </>
      ) : (
        <Pressable onPress={() => setIsEditing(true)} style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[style.text, propStyles?.text]}>{value || "未填寫"}</Text>
          <FontAwesome name="pencil" size={14} color="#4670b9" style={{ marginLeft: 6 }} />
        </Pressable>
      )}
    </View>
  );
};

const Profile = ({ user }: { user: any }) => {
  const [userProfile, setUserProfile] = useState<ProfileData>({
    avatarUri: "",
    name: "",
    email: "",
    sex: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("email, name, avatar_uri, sex")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("[User Profile] Fetch error:", error);
        return;
      }
      if (!data) {
        console.error("[User Profile] No profile found");
        return;
      }

      setUserProfile({
        name: data.name || "Anonymous",
        email: data.email || "",
        avatarUri: data.avatar_uri || "",
        sex: data.sex ?? 0,
      });
    };
    fetchUserProfile();
  }, [user.id]);

  // 單欄位更新，返回 Promise 方便 EditableText await
  const updateField = async (field: keyof ProfileData, value: any) => {
    const updateObj = { [field]: value };
    const { error } = await supabase.from("users").update(updateObj).eq("id", user.id);
    if (error) {
      console.error(`[Update Profile] ${field} failed:`, error);
      throw error;
    }
    // 更新本地 state
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={style.card}>
      <View style={style.avatarContainer}>
        <EditableAvatar
          uri={
            userProfile.avatarUri === ""
              ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  userProfile.name
                )}`
              : userProfile.avatarUri
          }
          onChange={(newUri) => updateField("avatarUri", newUri)}
        />
      </View>

      <View style={style.contactContainer}>
        <EditableText
          value={userProfile.name}
          propStyles={{ text: { fontSize: 24, fontWeight: "700", color: "#4a7aba" } }}
          onChange={(newName) => updateField("name", newName)}
        />
        <Text style={{ fontSize: 16, marginVertical: 4 }}>
          ID: {userProfile.email.replace("@gmail.com", "")}
        </Text>

        <Picker
          selectedValue={userProfile.sex}
          onValueChange={(itemValue) => updateField("sex", itemValue)}
          style={[
            Common_styles.picker,
            {
              width: "100%",
              height: 36,
              fontSize: 14,
              marginTop: 5,
            },
          ]}
          itemStyle={{ fontSize: 14 }}
        >
          <Picker.Item label="生理性別" value={0} />
          <Picker.Item label="男生" value={1} />
          <Picker.Item label="女生" value={2} />
        </Picker>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    gap: 12,
    width: "100%",
    height: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: "relative",
  },
  avatarContainer: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 65,
    width: 130,
    height: 130,
    borderWidth: 5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    position: "relative",
  },
  contactContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 14,
    minWidth: 60,
    color: "#2c2c2c",
  },
  input: {
    fontSize: 14,
    color: "#2c2c2c",
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    minWidth: 60,
  },
  icon: {
    paddingHorizontal: 4,
  },
});

export default Profile;
