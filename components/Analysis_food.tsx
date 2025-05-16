import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Common_styles from '../lib/common_styles'
import { View, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native'
import SuccessModal from './SuccesModal';
import ErrorModal from './ErrorModal';
import LoadingModal from './LoadingModal';
interface Props {
    user: any
}



const Analysis_food = ({ user }: Props) => {
    const [message, setModalMessage] = useState('');
    const [successVisible, setSuccessVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [loading, setLoading] = useState(false)


    return (
        <View style={Common_styles.full_container}>
            <Text>飲食分析</Text>
            <LoadingModal visible={loading} />
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

export default Analysis_food