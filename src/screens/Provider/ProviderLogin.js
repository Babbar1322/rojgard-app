import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLottieView from 'lottie-react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import styles from '../../config/styles';
import Logo from '../../../assets/Logo.png';
import { color, api } from '../../config/config';
import { Loading, success } from '../../components/lottie';
import { setLogin } from '../../redux/slice/authSlice';

export default function ProviderLogin({ route, navigation }) {
    const dispatch = useDispatch();
    const [pushToken, setPushToken] = useState(null);

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const onLogin = async () => {
        setLoading(true);
        Keyboard.dismiss();
        if (!userId, !password) {
            setLoading(false);
            return alert('Please Fillout All Feilds!');
        };

        await axios.post(api + 'login', {
            "userId": userId, "password": password, "role": "2", token: pushToken
        }).then(res => {
            if (res.status === 200) {
                setLoginSuccess(true);
                const data = res.data.user;
                AsyncStorage.setItem('@user', JSON.stringify(data));

                const user = {
                    isLoggedIn: true,
                    email: data.email,
                    userId: data.userId,
                    phone: data.phone,
                    name: data.name,
                    userRole: data.role
                }
                dispatch(setLogin(user));
                setTimeout(() => {
                    setLoading(false);
                    navigation.replace('AddJob');
                }, 700);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
            if (err.toString().endsWith('400')) {
                alert('Invalid Details');
            }
            if (err.toString().endsWith('405')) {
                Alert.alert('Sorry', "You can't Login to your account, because we disabled your account for some reasons.");
            }
        })
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={loginSuccess ? success : Loading} loop autoPlay style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '25%' }} />
            )
        } else {
            return (
                <View style={{ paddingHorizontal: '7%' }}>
                    <TextInput style={[styles.input, styles.shadow]} placeholder='Enter UserID or Phone' autoCapitalize='none' autoCorrect={false} onChangeText={(e) => setUserId(e)} />
                    <TextInput style={[styles.input, styles.shadow]} placeholder='Enter Password' secureTextEntry onChangeText={(e) => setPassword(e)} />

                    <TouchableOpacity style={[styles.btn_outline, { marginTop: '10%' }]} activeOpacity={0.5} onPress={onLogin}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red, fontSize: 15 }]}>Login</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    useEffect(() => {
        AsyncStorage.getItem('pushToken', (err, res) => {
            setPushToken(res);
        });
    }, []);
    return (
        <View style={[styles.container]}>
            <Image source={Logo} style={[styles.logo, { alignSelf: 'center' }]} />

            <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: color.red, }]}>Login to your Provider account</Text>

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
                {screen()}
                <View>
                    <TouchableOpacity activeOpacity={0.5} style={{ alignSelf: 'center' }} onPress={() => navigation.navigate('ProviderSignup')}>
                        <Text style={{ marginTop: '4%', fontWeight: '500', fontSize: 15, textAlign: 'center' }}>Don't Have An Account?</Text>
                        <Text style={{ fontWeight: '500', fontSize: 15, textAlign: 'center', color: color.red }}>Become a Provider</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '-25%', right: '-5%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: '-2%', right: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 150, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}