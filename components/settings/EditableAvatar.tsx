import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";

type EditableAvatarProps = {
  uri: string;
  onChange: (newUri: string) => void;
};

export default function EditableAvatar({ uri, onChange }: EditableAvatarProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputUrl, setInputUrl] = useState(uri);

  const openModal = () => {
    setInputUrl(uri);
    setModalVisible(true);
  };

  const saveAvatar = () => {
    onChange(inputUrl);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={openModal}>
        <Image source={{ uri }} style={styles.avatar} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>輸入頭像網址</Text>
            <TextInput
              value={inputUrl}
              onChangeText={setInputUrl}
              style={styles.input}
              placeholder="https://example.com/avatar.png"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.actions}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>取消</Text>
              </Pressable>
              <Pressable onPress={saveAvatar} style={styles.button}>
                <Text style={styles.buttonText}>儲存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 9999,
    backgroundColor: "#ccc",
  },
  info: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
