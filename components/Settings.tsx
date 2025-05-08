import React from 'react'
import { View, Text } from 'react-native'

export default function Settings({ user }: any) {
  return (
    <View>
      <Text>設定頁面</Text>
      <Text>Email: {user.email}</Text>
      <Text>ID: {user.id}</Text>
    </View>
  )
}
