import React, { useEffect } from 'react'
import {  TouchableOpacity, Text, View,ImageBackground } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { supabase } from '../lib/supabase'
import { FontAwesome } from '@expo/vector-icons'
import Common_styles from '../lib/common_styles'

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
    <View style={Common_styles.container}>
      <ImageBackground
        source={require('../assets/Logo.jpg')} // 本地圖片
        style={Common_styles.background}
        resizeMode="contain" // 可選："cover", "contain", "stretch", etc.
      >
        <View style={Common_styles.LoginSection}>
          <View style={Common_styles.LoginTop}>
            <Text style={[Common_styles.title,{color:'#fff',marginBottom:0}]}>Buddy</Text>
          </View>
          <Text style={[Common_styles.title, { alignContent: 'center' }]}>
            <FontAwesome name="google" size={32} color="#2d85f0" />  Using Google Login
          </Text>
          <TouchableOpacity style={[Common_styles.submitBtn, { marginBottom: 20 }]} onPress={signInWithGoogle}>
            <Text style={Common_styles.submitText}>Google 登入</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground >
    </View >
  )
}
