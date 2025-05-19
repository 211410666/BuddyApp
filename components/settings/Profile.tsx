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
  Dimensions,
} from "react-native";
import EditableAvatar from "./EditableAvatar";
import { supabase } from "../../lib/supabase";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from '@expo/vector-icons'
import Common_styles from "../../lib/common_styles";
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

  function EditableText({ value, onChange, propStyles }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const toggleEdit = () => {
      if (isEditing) {
        onChange(draft); // 儲存變更
        Keyboard.dismiss();
      }
      handleSaveProfile()
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
          <FontAwesome name={isEditing ? "check" : "pencil"} size={14} color="#4670b9" />
        </Pressable>
      </View>
    );
  }

  const handleSaveProfile = async () => {
    const { error: updateNameError } = await supabase
      .from("users")
      .update({
        name: userProfile.name,
      })
      .eq("id", user.id);
    const { error: updateEmailError } = await supabase
      .from("users")
      .update({
        email: userProfile.email,
      })
      .eq("id", user.id);
    const { error: updateAvatarError } = await supabase
      .from("users")
      .update({
        avatar_uri: userProfile.avatarUri,
      })
      .eq("id", user.id);
    const { error: updateGenderError } = await supabase
      .from("users")
      .update({
        sex: userProfile.sex,
      })
      .eq("id", user.id);
    if (updateNameError) {
      console.error("[Update Profile] Failed:", updateNameError);
    }
    if (updateEmailError) {
      console.error("[Update Profile] Failed:", updateEmailError);
    }
    if (updateAvatarError) {
      console.error("[Update Profile] Failed:", updateAvatarError);
    }
    if (updateGenderError) {
      console.error("[Update Profile] Failed:", updateAvatarError);
    }
    console.log("[Profile Update] Success");
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: userProfile, error: fetchProfileError } = await supabase
        .from("users")
        .select("email, name, avatar_uri, sex")
        .eq("id", user.id)
        .single();
      if (fetchProfileError) {
        console.error("[User Profile] ", fetchProfileError);
      }
      if (!userProfile) {
        console.error("[User Profile] Can not Search Profile");
        return;
      }
      setUserProfile({
        name: userProfile.name || "Anonymous",
        email: userProfile.email || "",
        avatarUri: userProfile.avatar_uri || "",
        sex: userProfile.sex.toString() || "Not Answer",
      });
    };
    fetchUserProfile();
    console.log(userProfile);
  }, []);
  useEffect(() => {
    console.log(userProfile);
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
          propStyles={{ text: { fontSize: 24,fontWeight:700,color:'#4a7aba' } }}
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
          style={[Common_styles.picker, {
            width: "auto",
            height: 20,
            fontSize: 14,
          }]}
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
