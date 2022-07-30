import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { splashAnim, success } from './lottie';
import styles from '../config/styles';
import circle from '../../assets/Images/circle.png';
import dots from '../../assets/Images/dots.png';
import { setLogin } from '../redux/slice/authSlice';
import axios from 'axios';
import { api } from '../config/config';

export default function Splash({ route, navigation }) {
    const dispatch = useDispatch();
    const ballAnimatedValue = useRef(new Animated.Value(0)).current;
    const ballAnimatedValue2 = useRef(new Animated.Value(0)).current;
    const fade = useRef(new Animated.Value(0)).current;

    const moveBall = () => {
        Animated.timing(ballAnimatedValue, {
            toValue: 800,
            duration: 1000,
            useNativeDriver: true,
        }).start();
        Animated.timing(ballAnimatedValue2, {
            toValue: 400,
            duration: 1000,
            useNativeDriver: true,
        }).start();
        Animated.timing(fade, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const position = {
        transform: [
            {
                translateY: ballAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                })
            }
        ]
    };

    const position2 = {
        transform: [
            {
                translateX: ballAnimatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                })
            },
            {
                translateY: ballAnimatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                })
            }
        ]
    };

    const checkLogin = async () => {
        if(route.params){
            navigation.replace('Signup', {id: route.params.id});
            return;
        }
        const data = await AsyncStorage.getItem('@user');
        if (data) {
            const user = JSON.parse(data);
            await axios.get(api + 'userInfo/' + user.userId).then(res => {
                const newData = res.data[0];
                let image = null;
                if(newData.dp !== null){
                    image = newData.dp.profile_photo;
                }
                const state = {
                    isLoggedIn: true,
                    email: newData.email,
                    userId: newData.userId,
                    phone: newData.phone,
                    name: newData.name,
                    refererId: newData.sponsorId,
                    isActive: newData.isActive,
                    profileStatus: newData.profileStatus,
                    isProfileCompleted: newData.profileStatus,
                    profilePhoto: image,
                }
                dispatch(setLogin(state));
            }).catch(err => {
                console.log(err);
                navigation.replace('NoNetwork')
            });
            if (user.role == 1) {
                navigation.replace('HomeTab');
            } else {
                navigation.replace('AddJob');
            }
        } else {
            navigation.replace('Welcome');
        }
    }
    useEffect(() => {
        NetInfo.fetch().then(state => {
            if(!state.isConnected){
                navigation.replace('NoNetwork');
                return;
            }
        });
        moveBall();
    }, [])
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <AnimatedLottieView style={{ width: '60%' }} autoPlay loop={false} source={splashAnim} onAnimationFinish={checkLogin} />
            <Animated.View style={{ opacity: fade }}>
                <Text style={[styles.bold, styles.text_center]}>मेरा रोजगार मेरा अधिकार</Text>
            </Animated.View>
            <Animated.View style={{ position: 'absolute', left: '-40%', top: '-40%' }}>
                <Animated.Image source={circle} style={position} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', left: '-40%', top: '-40%' }}>
                <Animated.Image source={circle} style={position2} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', right: '0%', bottom: '0%' }}>
                <Animated.Image source={dots} style={{ opacity: fade, width: 200, height: 50, resizeMode: 'contain' }} />
            </Animated.View>
        </View>
    )
}