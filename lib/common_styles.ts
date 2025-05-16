import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Common_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // 垂直置中
    alignItems: "center", // 水平置中
    backgroundColor: "#fff",
  },
  common_button: {
    backgroundColor: "#a0dca0",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 12,
    width: "80%",
    alignItems: "center",
  },
  common_buttonText: {
    fontSize: 18,
    color: "#1a4d1a",
    fontWeight: "bold",
  },
  common_scrollContainer: {
    paddingHorizontal: 64,
  },

  //CommonModal專區
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    opacity: 0.9,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeText: {
    fontSize: 16,
    color: "#333",
  },

  //Diary專區

  //Form專區
  nutritionBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    marginTop: 0,
    marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  submitBtn: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 6,
    marginVertical: 3,
  },
  inputGroup: {
    marginBottom: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
  resultItem: {
    padding: 10,
    backgroundColor: "#e0f7e0",
    marginBottom: 4,
    borderRadius: 6,
  },
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    height: 44,
    width: "100%",
  },
});

export default Common_styles;
