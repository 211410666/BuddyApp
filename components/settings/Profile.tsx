import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  ViewStyle,
  TextStyle,
  Dimensions,
} from "react-native";
import EditableAvatar from "./EditableAvatar";
import { supabase } from "../../lib/supabase";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import Common_styles from "../../lib/common_styles";
import Toast from "react-native-toast-message";
//
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

//
const { height: WINDOWS_HEIGHT, width: WINDOWS_WIDTH } =
  Dimensions.get("screen");

type ProfileData = {
  avatarUri: string;
  name: string;
  email: string;
  sex: number;
};

const Profile = ({ user }: { user: any }) => {
  const [userProfile, setUserProfile] = useState<ProfileData>({
    avatarUri: "",
    name: "",
    email: "",
    sex: 0,
  });
  const [userProfilePrev, setUserProfilePrev] = useState<ProfileData>({
    avatarUri: "",
    name: "",
    email: "",
    sex: 0,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function EditableText({ value, onChange, propStyles }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const toggleEdit = () => {
      if (isEditing) {
        onChange(draft); // 儲存變更
        Keyboard.dismiss();
      }
      handleSaveProfile();
      setIsEditing((prev) => !prev);
    };

    return (
      <View style={style.container}>
        {isEditing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            style={[style.input, propStyles?.input]}
            autoFocus
            onSubmitEditing={toggleEdit}
            returnKeyType="done"
          />
        ) : (
          <Text style={[style.text, propStyles?.text]}>{value}</Text>
        )}
        <Pressable onPress={toggleEdit} style={[style.icon, propStyles?.btn]}>
          <FontAwesome
            name={isEditing ? "check" : "pencil"}
            size={14}
            color="#4670b9"
          />
        </Pressable>
      </View>
    );
  }

  const handleSaveProfile = async () => {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email: userProfile.email,
        name: userProfile.name,
        avatar_uri: userProfile.avatarUri,
        sex: userProfile.sex,
      })
      .eq("id", user.id);
    if (updateError) {
      console.error("[Update Profile] Failed:", updateError);
    }
    console.log("[Profile Update] Success");
  };
  const fetchUserProfile = async () => {
    const { data: userProfile, error: fetchProfileError } = await supabase
      .from("users")
      .select("email, name, avatar_uri, sex")
      .eq("id", user.id)
      .single();
    if (fetchProfileError) {
      console.error("[User Profile] ", fetchProfileError);
      Toast.show({
        type: "error",
        text1: "Search User",
      });
    }
    if (!userProfile) {
      console.error("[User Profile] Can not Search Profile");
      Toast.show({
        type: "error",
        text1: "Search User",
        text2: "Can't search",
      });
      return;
    }
    return userProfile;
  };
  useEffect(() => {
    const setDefaultData = async () => {
      const currentUser = await fetchUserProfile();
      setUserProfile({
        name: currentUser?.name || "Anonymous",
        email: currentUser?.email || "",
        avatarUri: currentUser?.avatar_uri || "",
        sex: currentUser?.sex.toString() || "Not Answer",
      });
      setUserProfilePrev({
        name: currentUser?.name || "Anonymous",
        email: currentUser?.email || "",
        avatarUri: currentUser?.avatar_uri || "",
        sex: currentUser?.sex.toString() || "Not Answer",
      });
    };
    setDefaultData();
  }, []);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (JSON.stringify(userProfile) === JSON.stringify(userProfilePrev)) {
      return;
    }
    Toast.show({
      type: "success",
      text1: "Update User",
      visibilityTime: 10000,
    });
    timerRef.current = setTimeout(async () => {
      handleSaveProfile();
    }, 10000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [userProfile]);
  return (
    <View style={style.card}>
      <View style={style.avatarContainer}>
        <EditableAvatar
          uri={
            userProfile.avatarUri === ""
              ? `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`
              : userProfile.avatarUri
          }
          onChange={(newUri) =>
            setUserProfile((prev) => ({ ...prev, avatarUri: newUri }))
          }
        />
      </View>
      <View style={style.contactContainer}>
        <EditableText
          value={userProfile.name}
          propStyles={{
            text: { fontSize: 24, fontWeight: 700, color: "#4a7aba" },
          }}
          onChange={(userName) =>
            setUserProfile((prev) => ({ ...prev, name: userName }))
          }
        />
        <Text>ID:{userProfile.email.replace("@gmail.com", "")}</Text>
        {/* <EditableText
          value={userProfile.email.replace("@gmail.com", "")}
          propStyles={{ text: { fontSize: 18 } }}
          onChange={(userEmail) =>
            setUserProfile((prev) => ({ ...prev, email: userEmail }))
          }
        /> */}
        <Picker
          selectedValue={userProfile.sex}
          onValueChange={(itemValue) =>
            setUserProfile((prev) => ({ ...prev, sex: itemValue }))
          }
          style={[
            Common_styles.picker,
            {
              width: "auto",
              height: 20,
              fontSize: 14,
            },
          ]}
        >
          <Picker.Item label="生理性別" value={0} />
          <Picker.Item label="男生" value={1} />
          <Picker.Item label="女生" value={2} />
        </Picker>
      </View>
      {/* <View style={{flex: 1,
  justifyContent: 'flex-end'}}>
        <Pressable onPress={() => handleSaveProfile()} style={style.btnSubmit}>
          <FontAwesome name="floppy-o" size={24} color="#4a7aba" />
      </Pressable>
      </View> */}
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 8,
    gap: 10,
    width: "100%",
    height: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: "relative",
  },
  avatar: {
    borderRadius: 9999,
  },
  avatarContainer: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    borderWidth: 5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    position: "relative",
  },
  contactContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 2,
    height: 80,
    width: 100,
  },
  picker: {},
  btnSubmit: {
    justifyContent: "center",
    alignItems: "center",
  },
  textSummit: {},
  container: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    gap: 8,
    width: "auto",
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
    width: "auto",
  },
  icon: {
    // padding: 4,
  },
});

export default Profile;
