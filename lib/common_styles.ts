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
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 6,
    marginVertical: 3,
    minWidth: 0,
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
    width: "90%",
    borderBottomWidth: 1,
    borderColor: "#999",
    paddingVertical: 4,
    marginVertical: 4,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  full_container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#a0dca0",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#87c587",
  },
  navText: {
    fontSize: 16,
    color: "#1a4d1a",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  noData: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  scrollContainer: {
    marginBottom: 20,
  },
  diaryItem: {
    padding: 10,
    backgroundColor: "#666666",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative", // ✅ 為了讓 likeIcon 可以絕對定位
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  name: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#fff",
    //backgroundColor: "#818080",
  },
  fullContainer: {
    flex: 1,
    padding: 12,
  },
  pickerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  pickerLabel: {
    width: 30, // 固定寬度，讓文字在左邊不會被擠走
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a4d1a",
  },

  pickerFlexible: {
    flex: 1, // 剩餘寬度給 Picker
    borderBottomWidth: 1,
    borderColor: "#999",
    paddingVertical: 4,
    marginVertical: 4,
  },
  big_title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 10,
  },
  sub_text: {
    fontSize: 18,
    color: "#6b8e6b",
    marginBottom: 20,
  },
  analysis_container: {
        flex: 1,
        backgroundColor: '#f5fff7',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Common_styles;
