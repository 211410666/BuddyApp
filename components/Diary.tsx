import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import Common_styles from '../lib/common_styles';
import ErrorModal from './ErrorModal';
import LoadingModal from './LoadingModal';
import SuccessModal from './SuccesModal';

export default function Diary({ user }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [message, setMessage] = useState('');
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [diarys, setDiarys] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null); // 用來儲存選中的 diary
  const [loadingVisble, setLoadingVisble] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)

  useEffect(() => {
    const fetchDiarys = async () => {
      setLoadingVisble(true)
      const { data, error } = await supabase
        .from('diarys')
        .select('*')
        .eq('owner', user.id)
        .order('create_time', { ascending: false });

      if (error) {
        setMessage('Failed to fetch diarys:');
      } else {
        // 先 food 再 exercise 排序
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.create_time).toISOString().substring(0, 10);
          const dateB = new Date(b.create_time).toISOString().substring(0, 10);

          if (dateA === dateB) {
            return a.category === 'food' ? -1 : 1;
          }
          return dateA > dateB ? -1 : 1;
        });

        setDiarys(sorted);
      }
      setLoadingVisble(false);
    };

    fetchDiarys();
  }, [user.id]);

  useEffect(() => {
    const fetchUserName = async () => {
      setLoadingVisble(true);
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch user name:', error);
      } else {
        setUserName(data.name || '');
      }
      setLoadingVisble(false)
    };

    fetchUserName();
  }, [user.id]);

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.nameText}>{userName} 您好!</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setNameInput(userName);
            setModalVisible(true);
          }}
        >
          <Text style={styles.editText}>修改姓名</Text>
        </TouchableOpacity>
      </View>

      <View>
        {diarys.map((item, index) => {
          const currentDate = new Date(item.create_time).toISOString().substring(0, 10); // 取得日期格式
          const previousDate = index > 0 ? new Date(diarys[index - 1].create_time).toISOString().substring(0, 10) : null;

          const isNewDate = currentDate !== previousDate;

          return (
            <View key={item.diary_id}>
              {/* 只顯示不同日期的分隔線 */}
              {isNewDate && index !== 0 && (
                <View style={styles.divider}></View>
              )}

              {/* 顯示日記項目 */}
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <View style={styles.diaryItem}>
                  <Text style={styles.diaryText}>
                    {item.create_time
                      ? new Date(item.create_time).toLocaleDateString('zh-TW')
                      : '無時間資料'}{' '}
                    的 {item.category === 'food' ? '飲食紀錄' : item.category === 'exercise' ? '運動紀錄' : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Modal for editing name */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Diary ID: {selectedItem?.diary_id}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error / success message */}
      <LoadingModal
        visible={loadingVisble}
      />

      <ErrorModal
        visible={errorVisible}
        message={message}
        onClose={() => setErrorVisible(false)}
      />

      <SuccessModal
        visible={successVisible}
        message={message}
        onClose={() => setSuccessVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 16,
  },
  editBtn: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  diaryItem: {
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
