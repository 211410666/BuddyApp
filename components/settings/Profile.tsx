import { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { EditableText } from "./EditableText";
import EditableAvatar from "./EditableAvatar";
import { supabase } from "../../lib/supabase";
import { Picker } from "@react-native-picker/picker";

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
          propStyles={{ text: { fontSize: 24 } }}
          onChange={(userName) =>
            setUserProfile((prev) => ({ ...prev, name: userName }))
          }
        />
        <EditableText
          value={userProfile.email}
          propStyles={{ text: { fontSize: 18 } }}
          onChange={(userEmail) =>
            setUserProfile((prev) => ({ ...prev, email: userEmail }))
          }
        />
        <Picker
          selectedValue={userProfile.sex}
          onValueChange={(itemValue) =>
            setUserProfile((prev) => ({ ...prev, sex: itemValue }))
          }
          style={style.picker}
        >
          <Picker.Item label="請選擇生理性別" value={0} />
          <Picker.Item label="男生" value={1} />
          <Picker.Item label="女生" value={2} />
        </Picker>
      </View>
      <Pressable onPress={() => handleSaveProfile()}>
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 32,
    backgroundColor: "rgba(48, 58, 75, 0.1)",
    borderRadius: 8,
  },
  avatar: {
    borderRadius: 9999,
  },
  avatarContainer: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  contactContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  picker: {},
});

export default Profile;
