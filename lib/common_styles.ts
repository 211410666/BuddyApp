import { StyleSheet,Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const Common_styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center', // 垂直置中
    alignItems: 'center',     // 水平置中
    backgroundColor: '#fff',
  },
  common_button: {
    backgroundColor: '#a0dca0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 12,
    width: '80%',
    alignItems: 'center',
  },
  common_buttonText: {
    fontSize: 18,
    color: '#1a4d1a',
    fontWeight: 'bold',
  },
  //CommonModal專區
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    opacity:0.9,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#333',
  },

  //Diary專區
  
})

export default Common_styles
