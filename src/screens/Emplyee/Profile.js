import React from 'react';
import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import styles from '../../config/styles';
import profileBackground from '../../../assets/Images/profileBackground.png';
import { color, api } from '../../config/config';
import { selectEmail, selectName, selectPhone, selectProfilePhoto, selectProfileStatus, selectUserId, setLogin, setLogout } from '../../redux/slice/authSlice';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile({ navigation }) {
    const dispatch = useDispatch();
    const name = useSelector(selectName);
    const userId = useSelector(selectUserId);
    const email = useSelector(selectEmail);
    const phone = useSelector(selectPhone);
    const profileStatus = useSelector(selectProfileStatus);
    const profileImage = useSelector(selectProfilePhoto);
    const logout = () => {
        if (!navigation.isFocused()) {
            return false;
        } else {
            Alert.alert('Logout!', 'Are you sure you want to Logout?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES', onPress: async () => {
                        await AsyncStorage.clear();
                        dispatch(setLogout());
                        navigation.replace('Welcome');
                    }
                },
            ]);
            return true;
        };
    }

    useFocusEffect(() => {
        axios.get(api + 'userInfo/' + userId).then(res => {
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
        });
    });
    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <ImageBackground source={profileBackground} style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    {profileStatus == 1 ? 
                    <Image source={{uri: 'https://rojgar.biz/' + profileImage}} style={[styles.image, {borderColor: '#fff'}]} />:
                    <Image source={{ uri: 'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }} style={[styles.image, {borderColor: '#fff'}]} />}
                    <Text style={[styles.h1, styles.bold, { fontSize: 22, color: '#fff', marginBottom: '10%' }]}>{name}</Text>
                </ImageBackground>
                <View style={{ paddingHorizontal: '5%', marginTop: '5%' }}>
                    {profileStatus == 0 ? 
                    <TouchableOpacity style={[styles.btn, {marginVertical: '5%'}]} onPress={() => navigation.navigate('CompleteProfile')}>
                        <Text style={[styles.bold, styles.text_center, {color: '#fff'}]}>Complete Your Profile</Text>
                    </TouchableOpacity> : null}
                    <View style={[styles.row, { marginVertical: '2%' }]}>
                        <Ionicons name='person' color={color.red} size={30} />
                        <Text style={[styles.bold, { marginLeft: '3%', fontSize: 16 }]}>{userId}</Text>
                    </View>
                    <View style={[styles.row, { marginVertical: '2%' }]}>
                        <Ionicons name='mail' color={color.red} size={30} />
                        <Text style={[styles.bold, { marginLeft: '3%', fontSize: 16 }]}>{email}</Text>
                    </View>
                    <View style={[styles.row, { marginVertical: '2%' }]}>
                        <Ionicons name='call' color={color.red} size={30} />
                        <Text style={[styles.bold, { marginLeft: '3%', fontSize: 16 }]}>{phone}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.btn, styles.shadow_sm,
                        { marginVertical: '2%', backgroundColor: '#fff', borderWidth: 2, borderColor: color.red }]}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('AppliedJobs')}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red }]}>Applied Jobs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.shadow_sm, { marginVertical: '2%' }]} activeOpacity={0.5} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={[styles.bold, styles.text_center, { color: '#fff' }]}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, styles.shadow_sm,
                        { marginVertical: '2%', backgroundColor: '#fff', borderWidth: 2, borderColor: color.red }]}
                        activeOpacity={0.5}
                        onPress={logout}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red }]}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, styles.shadow_sm, { marginVertical: '2%' }]}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('Tickets')}>
                        <Text style={[styles.bold, styles.text_center, { color: color.white }]}>Raise a ticket</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: '-2%', right: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 200, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}