import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  ViewStyle,
  TextStyle,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons'
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

export function EditableText({ value, onChange, propStyles }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const toggleEdit = () => {
    if (isEditing) {
      onChange(draft); // 儲存變更
      Keyboard.dismiss();
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          style={[styles.input, propStyles?.input]}
          autoFocus
          onSubmitEditing={toggleEdit}
          returnKeyType="done"
        />
      ) : (
        <Text style={[styles.text, propStyles?.text]}>{value}</Text>
      )}

      <Pressable onPress={toggleEdit} style={[styles.icon, propStyles?.btn]}>
        <FontAwesome name={isEditing ? "check" : "pencil"} size={14} color="#4670b9" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
