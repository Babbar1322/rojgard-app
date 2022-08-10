import React, { useState } from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import styles from '../../config/styles';
import Logo from '../../../assets/Logo.png';
import { color, api } from '../../config/config';
import { Loading, success } from '../../components/lottie';
import { setLogin } from '../../redux/slice/authSlice';

export default function Login({ route, navigation }) {
    const dispatch = useDispatch();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [loginSuccess, setloginSuccess] = useState(false);

    const onLogin = async () => {
        setLoading(true);
        Keyboard.dismiss();
        if (!userId, !password) {
            setLoading(false);
            return alert('Please Fillout All Feilds!');
        };

        await axios.post(api + 'login', {
            "userId": userId, "password": password, "role": "1"
        }).then(res => {
            if (res.status === 200) {
                setloginSuccess(true);
                const data = res.data.user;
                let image = null;
                if(res.data.detail){
                    image = res.data.detail.profile_photo;
                };
                AsyncStorage.setItem('@user', JSON.stringify(data));

                const user = {
                    isLoggedIn: true,
                    email: data.email,
                    userId: data.userId,
                    phone: data.phone,
                    name: data.name,
                    refererId: data.sponsorId,
                    userRole: data.role,
                    isActive: data.isActive,
                    profileStatus: data.profileStatus,
                    isProfileCompleted: data.profileStatus,
                    profilePhoto: image
                }
                dispatch(setLogin(user));
                setTimeout(() => {
                    setLoading(false);
                    navigation.replace('HomeTab');
                }, 700);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
            if (err.toString().endsWith('400')) {
                alert('Invalid Details');
            }
            if(err.toString().endsWith('405')){
                Alert.alert('Sorry', "You can't Login to your account, because we disabled your account for some reasons.");
            }
        });
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

                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} activeOpacity={0.5} onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={{ marginVertical: '4%', fontWeight: '500', fontSize: 15 }}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn]} activeOpacity={0.5} onPress={onLogin}>
                        <Text style={[styles.bold, styles.text_center, { color: color.white, fontSize: 15 }]}>Login</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
    return (
        <View style={[styles.container]}>
            <Image source={Logo} style={[styles.logo, { alignSelf: 'center' }]} />

            <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: color.red, }]}>Login to your account</Text>

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
                {screen()}
                <View>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Signup')}>
                        <Text style={{ marginVertical: '4%', fontWeight: '500', fontSize: 15, textAlign: 'center' }}>Don't Have An Account? {"\n"} Sign Up</Text>
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