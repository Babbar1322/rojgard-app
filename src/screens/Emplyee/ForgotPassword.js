import React, {useState, useEffect} from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import styles from '../../config/styles';
import Logo from '../../../assets/Logo.png';
import { color, api } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPassword({ route, navigation }) {

    const [userId, setUserId] = useState("");

    const onLogin = () => {
        Keyboard.dismiss();
  
        fetch(api + 'login', {
           method: "POST",
           headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
           },
           body: JSON.stringify({
              "userId": userId, "password": password
           })
        }).then(res => res.json()).then(json => {
            AsyncStorage.setItem('@user', JSON.stringify(json));
            navigation.replace('HomeTab');
        });
     }
    return (
        <View style={[styles.container]}>
            <Image source={Logo} style={[styles.logo, { alignSelf: 'center' }]} />

            <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: color.red, }]}>Reset your password</Text>
            <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: 'red' }]}>Currently not in service</Text>

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
                <View style={{ paddingHorizontal: '7%' }}>
                    <TextInput style={[styles.input, styles.shadow]} placeholder='Enter UserID or Phone' autoCapitalize='none' autoCorrect={false} onChangeText={(e) => setUserId(e)} />

                    <TouchableOpacity style={[styles.btn]} activeOpacity={0.5}>
                        <Text style={[styles.bold, styles.text_center, { color: color.white, fontSize: 15 }]}>Send OTP</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{position: 'absolute', bottom: '-25%', left: '-20%'}}>
                <Image source={require('../../../assets/Images/circle.png')} style={{zIndex: -1}} />
            </View>
            <View style={{position: 'absolute', top: '-25%', right: '-5%'}}>
                <Image source={require('../../../assets/Images/circle.png')} style={{zIndex: -1}} />
            </View>
            <View style={{position: 'absolute', bottom: '-2%', right: '0%'}}>
                <Image source={require('../../../assets/Images/dots.png')} style={{width: 150, height: 50, resizeMode: 'contain',zIndex: -1}} />
            </View>
        </View>
    )
}