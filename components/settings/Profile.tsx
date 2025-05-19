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
import Common_styles from "../../lib/common_styles";
import { FontAwesomeIcon } from 'expo-fontawesome';
import { faCheck,faPencil } from '@fortawesome/free-solid-svg-icons';
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
              <View style={[Common_styles.iconContainer,{width: 15, height: 15}]}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#4670b9" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
              </View>
              {/* <FontAwesomeIcon icon={faCheck} style={{color: "#4670b9",}}/> */}
            </Pressable>
          )}
        </>
      ) : (
        <Pressable onPress={() => setIsEditing(true)} style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[style.text, propStyles?.text]}>{value || "未填寫"}</Text>
          <View style={[Common_styles.iconContainer,{width: 15, height: 15}]}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#4670b9" d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
          </View>
          {/* <FontAwesomeIcon icon={faPencil} style={{ marginLeft: 6 ,color:"#4670b9" }}/> */}
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
