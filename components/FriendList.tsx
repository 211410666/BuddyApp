// components/FriendList.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles';
import ErrorModal from './ErrorModal';
import LoadingModal from './LoadingModal';
import SuccessModal from './SuccesModal';

export default function FriendList({ user }: { user: any; }) {
  const [friends, setFriends] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [newFriendEmail, setNewFriendEmail] = useState('')
  const [message, setModalMessage] = useState('');
  const [loadingVisble, setLoadingVisble] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)

  useEffect(() => {
    fetchFriends()
    fetchPendingRequests()
  }, [])

  const fetchFriends = async () => {
    setLoadingVisble(true);
    const { data: relations, error } = await supabase
      .from('relations')
      .select('owner_id, target_id')
      .or(`owner_id.eq.${user.id},target_id.eq.${user.id}`)
      .eq('relation_state', 1)

    if (error) {
      console.error('關係查詢失敗:', error)
      return
    }

    const friendIds = relations?.map((r: any) =>
      r.owner_id === user.id ? r.target_id : r.owner_id
    )

    if (!friendIds || friendIds.length === 0) {
      setFriends([])
      return
    }

    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', friendIds)

    if (userError) {
      console.error('用戶查詢失敗:', userError)
      return
    }

    setFriends(users || [])
    setLoadingVisble(false)
  }

  const fetchPendingRequests = async () => {
    setLoadingVisble(true)
    const { data: relations, error } = await supabase
      .from('relations')
      .select('owner_id')
      .eq('target_id', user.id)
      .eq('relation_state', 0)

    if (error) {
      console.error('查詢待通過好友失敗:', error)
      return
    }

    const ownerIds = relations.map((r: any) => r.owner_id)

    if (ownerIds.length === 0) {
      setPendingRequests([])
      return
    }

    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', ownerIds)

    if (userError) {
      console.error('查詢用戶失敗:', userError)
      return
    }

    setPendingRequests(users || [])
    setLoadingVisble(false)
  }

  const handleAcceptFriend = async (friendId: string) => {
    const { error } = await supabase
      .from('relations')
      .update({ relation_state: 1 })
      .match({
        owner_id: friendId,
        target_id: user.id,
        relation_state: 0,
      })

    if (error) {
      console.error('接受好友申請失敗:', error)
      return
    }

    fetchFriends()
    fetchPendingRequests()
    setModalMessage('好友申請已通過')
    setSuccessVisible(true)
  }

  const handDelFriend = async (friendId: string) => {
    const { error } = await supabase
      .from('relations')
      .delete()
      .or(
        `and(owner_id.eq.${user.id},target_id.eq.${friendId}),and(owner_id.eq.${friendId},target_id.eq.${user.id})`
      )

    if (error) {
      console.error('刪除好友失敗:', error)
      return
    }

    fetchFriends()
    fetchPendingRequests()
    setModalMessage('刪除成功!')
    setSuccessVisible(true);
  }

  const handleAddFriend = async () => {
    if (!newFriendEmail.trim()) {
      alert('請輸入 Email')
      return
    }

    const { data: targetUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', newFriendEmail.trim())
      .single()

    if (error || !targetUser) {
      setModalMessage('找不到該用戶')
      setErrorVisible(true)
      return
    }

    if (targetUser.id === user.id) {
      setModalMessage('不能新增自己為好友')
      setErrorVisible(true)
      return
    }

    const { data: existingRelation } = await supabase
      .from('relations')
      .select('*')
      .or(
        `and(owner_id.eq.${user.id},target_id.eq.${targetUser.id}),and(owner_id.eq.${targetUser.id},target_id.eq.${user.id})`
      )

    if (existingRelation && existingRelation.length > 0) {
      const state = existingRelation[0].relation_state
      console.log(state);
      if (state === 1) { setModalMessage('你們已經是好友了'); setErrorVisible(true);}
      if (state === 0) { console.log("???");setModalMessage('好友申請正在等待對方同意'); setErrorVisible(true);}
      return;
    }

    const { error: insertError } = await supabase
      .from('relations')
      .insert({
        owner_id: user.id,
        target_id: targetUser.id,
        relation_state: 0,
      })

    if (insertError) {
      setModalMessage('新增好友失敗')
      setErrorVisible(true)
      return
    }

    setModalMessage('新增好友成功,等待通過申請')
    setSuccessVisible(true)
    setNewFriendEmail('')
  }

  return (
    <View>
      {/* 新增好友區塊 */}
      <View style={Common_styles.addFriendContainer}>
        <TextInput
          style={[Common_styles.input,{marginRight: 20,height:40}]}
          placeholder="以 email 新增好友"
          placeholderTextColor="rgba(60, 130, 245, 0.3)"
          value={newFriendEmail}
          onChangeText={setNewFriendEmail}
        />
        <TouchableOpacity style={[Common_styles.submitBtn,{borderRadius:30}]} onPress={handleAddFriend}>
          <Text style={Common_styles.addButtonText}>新增</Text>
        </TouchableOpacity>
      </View>

      {/* 好友列表 */}
      <Text style={Common_styles.FDTitle}>好友列表:</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={Common_styles.friendItem}>
            <Text style={Common_styles.friendText}>{item.name}</Text>
            <TouchableOpacity style={Common_styles.delButton} onPress={() => handDelFriend(item.id)}>
              <Text style={Common_styles.delButtonText}>刪除</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>目前沒有好友</Text>}
      />

      {/* 待通過申請列表 */}
      <Text style={Common_styles.FDTitle}>待通過申請列表:</Text>
      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={Common_styles.friendItem}>
            <Text style={Common_styles.friendText}>{item.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={Common_styles.addButton} onPress={() => handleAcceptFriend(item.id)}>
                <Text style={Common_styles.addButtonText}>通過</Text>
              </TouchableOpacity>
              <TouchableOpacity style={Common_styles.delButton} onPress={() => handDelFriend(item.id)}>
                <Text style={Common_styles.delButtonText}>拒絕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>目前沒有待通過申請</Text>}
      />
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
  )
}

