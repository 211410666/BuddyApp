import React, { useEffect } from 'react'
import { Button, Text, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { supabase } from '../lib/supabase'

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen({ navigation }: any) {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true })

  const insertUserIfNotExist = async (user: any) => {
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)

    if (existingUser?.length === 0) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        name: user.email,
        email: user.email,
      })
      if (insertError) console.error('Insert Error:', insertError.message)
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    })
    if (error) console.error(error)
  }

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user
      if (user) {
        await insertUserIfNotExist(user)
        navigation.replace('Home', { user })
      }
    }
    checkUser()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>請使用 Google 登入</Text>
      <Button title="Google 登入" onPress={signInWithGoogle} />
    </View>
  )
}
