import React, { useEffect } from 'react'
import { TouchableOpacity, Text, View, ImageBackground, Image } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { supabase } from '../lib/supabase'
import { FontAwesome } from '@expo/vector-icons'
import Common_styles from '../lib/common_styles'
import { useFonts, AncizarSerif_400Regular } from '@expo-google-fonts/ancizar-serif';

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    AncizarSerif_400Regular,
  });
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
      <View style={Common_styles.LoginSection}>
        <Image
          source={require('../assets/LoadingIcon.jpg')} // 本地圖片
          style={Common_styles.logo}
          resizeMode="contain" // 可選："cover", "contain", "stretch", etc.
        >
        </Image>
        <Text style={[Common_styles.title, { alignContent: 'center', fontSize: 14, fontFamily: 'AncizarSerif_400Regular', fontStyle: 'italic', fontWeight: 200 }]}>Using Google Login</Text>
        <TouchableOpacity style={[Common_styles.submitBtn, { marginBottom: 20, flexDirection: 'row' }]} onPress={signInWithGoogle}>
          <View style={Common_styles.iconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="#ffffff" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
          </View>
          <Text style={[Common_styles.submitText, { marginLeft: 10, fontSize: 16, fontStyle: 'italic' }]}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View >
  )
}
