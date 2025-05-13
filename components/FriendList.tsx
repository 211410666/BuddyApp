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

export default function FriendList({ user, showMessage }: { user: any; showMessage: (msg: string) => void }) {
  const [friends, setFriends] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [newFriendEmail, setNewFriendEmail] = useState('')

  useEffect(() => {
    fetchFriends()
    fetchPendingRequests()
  }, [])

  const fetchFriends = async () => {
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
  }

  const fetchPendingRequests = async () => {
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
    showMessage('好友申請已通過')
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
    showMessage('刪除成功!')
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
      showMessage('找不到該用戶')
      return
    }

    if (targetUser.id === user.id) {
      showMessage('不能新增自己為好友')
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
      if (state === 1) return showMessage('你們已經是好友了')
      if (state === 0) return showMessage('好友申請正在等待對方同意')
    }

    const { error: insertError } = await supabase
      .from('relations')
      .insert({
        owner_id: user.id,
        target_id: targetUser.id,
        relation_state: 0,
      })

    if (insertError) {
      showMessage('新增好友失敗')
      return
    }

    showMessage('新增好友成功,等待通過申請')
    setNewFriendEmail('')
  }

  return (
    <View>
      {/* 新增好友區塊 */}
      <View style={styles.addFriendContainer}>
        <TextInput
          style={styles.input}
          placeholder="以 email 新增好友"
          placeholderTextColor="#888"
          value={newFriendEmail}
          onChangeText={setNewFriendEmail}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
          <Text style={styles.addButtonText}>新增</Text>
        </TouchableOpacity>
      </View>

      {/* 好友列表 */}
      <Text style={styles.title}>目前好友列表:</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.friendText}>{item.name}</Text>
            <TouchableOpacity style={styles.delButton} onPress={() => handDelFriend(item.id)}>
              <Text style={styles.delButtonText}>刪除好友</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>目前沒有好友</Text>}
      />

      {/* 待通過申請列表 */}
      <Text style={styles.title}>待通過申請列表:</Text>
      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.friendText}>{item.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.addButton} onPress={() => handleAcceptFriend(item.id)}>
                <Text style={styles.addButtonText}>通過</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delButton} onPress={() => handDelFriend(item.id)}>
                <Text style={styles.delButtonText}>拒絕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>目前沒有待通過申請</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  addFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 8,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  delButton: {
    backgroundColor: '#d00d0d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 20,
    borderRadius: 8,
  },
  delButtonText: {
    color: '#fff',
    fontSize: 14,
  },
})
