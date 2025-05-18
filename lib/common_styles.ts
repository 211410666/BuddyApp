import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const Colors = {
  ButtonDf: '#fff',
  Button: '#a6c6ed',
  SubmitButton: '#4a7aba',
  //Box:'#d5e6f1',
  Box: '#b4e0f3',
  secondary: '#f59e0b',
  background: '#e0f2ff',
  Text: '#4a7aba',
  Text_1: '#333333',
  Text_2: '#666666',
  light: 'rgba(255, 255, 255, 0.3)',
  light_1: 'rgba(255, 255, 255, 0.5)',
  light_2: 'rgba(255, 255, 255, 0.8)',
  dark: 'rgba(80, 110, 255, 0.3)',
  BoxBackground: '#819ac8',
}
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
    backgroundColor: Colors.background,
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
  DYContainer: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: Colors.background,
  },
  dailyCalorie: {
    color: '#6B7280', // text-gray-500
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    marginBottom: 12,
  },
  DYHContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBlock: 20,
    paddingHorizontal: 20,
    gap: 8,
  },
  DYHText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#374151',//#374151"
  },
  section: {
    marginBottom: 2,
    borderTopWidth: 3,
    borderColor: '#16387cb1',
  },
  expandArea: {
    backgroundColor: "#rgba(255, 255, 255, 0.3)",
    borderRadius: 0,
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    
  },
  emptyText: {
    padding: 16,
    textAlign: "center",
    fontSize: 14,
    color: "#888",
  },
  //Calorie
  row: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",

  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  CEITitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  tag: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  food: {
    backgroundColor: "#f9d5cc",
    color: "#e74c3c",
  },
  exercise: {
    backgroundColor: "#d4f4e2",
    color: "#27ae60",
  },
  kcal: {
    fontWeight: "bold",
    fontSize: 14,
  },
  intake: {
    color: "#e74c3c",
  },
  burn: {
    color: "#27ae60",
  },
  //Form專區
  nutritionBox: {
    backgroundColor: Colors.light_1,
    borderRadius: 6,
    marginTop: 0,
    marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: "relative",
  },
  submitBtn: {
    backgroundColor: Colors.SubmitButton,
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "rgba(190,220,255,8)",
    borderRadius: 80,
    padding: 6,
    marginVertical: 3,
    minWidth: 0,
    backgroundColor: Colors.light_2,
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
    height: 30,
    fontSize: 16,
    borderRadius: 99,
    textAlign: "center",
    color: Colors.Text,
    backgroundColor: '#FFF',
  },
  full_container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.ButtonDf,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Colors.Button,
  },
  navText: {
    fontSize: 16,
    color: Colors.Text,
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
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: "relative", // ✅ 為了讓 likeIcon 可以絕對定位
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a7aba",
  },
  name: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#000",
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
    color: Colors.Text,
  },

  pickerFlexible: {
    flex: 1, // 剩餘寬度給 Picker
    paddingVertical: 4,
    marginVertical: 4,
  },
  big_title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.Text,
    marginBottom: 10,
  },
  sub_text: {
    fontSize: 18,
    color: Colors.Text,
    marginBottom: 20,
  },
  analysis_container: {
    flex: 1,
    backgroundColor: Colors.light_1,
    borderRadius: 8,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    borderTopWidth: 3,
    borderTopColor: 'rgba(145, 150, 160, 1.00)',
    backgroundColor: '#fff',
  }, tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: Colors.Button,
  },
  tabText: {
    fontSize: 20,
    color: 'rgba(130, 130, 130, 1)',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: Colors.Text,//下方Tab文字
  },
  //Friends專區
  friendContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.BoxBackground,
    borderRadius: 8,
  },
  createTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  likeContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  likeIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  goodTime: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  },
  FMCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c0b0b',
  },
  addFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  FDInput: {
    flex: 1,
    height: 40,
    marginRight: 20,
    backgroundColor: "rgba(190,220,255,8)",
    borderColor: 'rgba(60, 130, 245, 0.5)',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  FDTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.light,
  },
  friendText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  delButton: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: 'rgba(220, 60, 52,0.8)',
  },
  delButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Common_styles;
