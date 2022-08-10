import React from 'react';
import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as Progress from 'react-native-progress';

import styles from '../../config/styles';
import profileBackground from '../../../assets/Images/profileBackground.png';
import { color, api } from '../../config/config';
import { selectEmail, selectName, selectPhone, selectProfilePhoto, selectProfileStatus, selectUserId, setLogin, setLogout } from '../../redux/slice/authSlice';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile({ navigation }) {
    const progress = useSelector(selectProfileStatus);
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
            let resume = null;
            let experience = null;
            let exp = null;
            if (newData.dp !== null) {
                image = newData.dp.profile_photo;
                resume = newData.dp.resume;
                experience = newData.dp.experience;
                exp = newData.dp.yearsOfExp;
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
                resume: resume,
                experience: experience,
                exp: exp
            }
            dispatch(setLogin(state));
        }).catch(err => {
            console.log(err);
        });
    });
    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <ImageBackground source={profileBackground} style={[styles.row, {
                    height: 300, paddingHorizontal: '5%'
                }]}>
                    {profileImage !== null ?
                        <Image source={{ uri: 'https://rojgar.biz/uploads/documents/' + profileImage }} style={[styles.image, { borderColor: '#fff' }]} /> :
                        <Image source={{ uri: 'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }} style={[styles.image, { borderColor: '#fff' }]} />}
                    <View style={{ marginLeft: '5%', maxWidth: '60%' }}>
                        <Text style={[styles.h1, styles.bold, { fontSize: 22, color: '#fff', marginBottom: '5%' }]}>{name}</Text>
                        <Text style={[styles.h1, styles.bold, { fontSize: 22, color: '#fff', marginBottom: '5%' }]}>#{userId}</Text>
                        <Text style={[styles.bold, { color: '#fff', marginBottom: '5%' }]}>{email}</Text>
                        <Text style={[styles.bold, { color: '#fff', marginBottom: '5%' }]}>{phone}</Text>
                    </View>
                </ImageBackground>
                <View style={{ paddingHorizontal: '5%', marginTop: '5%' }}>
                    <View style={{paddingVertical: '2%'}}>
                        <Text style={{fontSize: 12, fontWeight: '500'}}>Profile Setup</Text>
                        <Progress.Bar progress={parseFloat(progress)} width={null} height={20} color={color.red} borderRadius={30} />
                        <Text style={{fontSize: 12, fontWeight: '500', textAlign: 'right'}}>{progress*100}% Completed</Text>
                    </View>
                    {profileStatus == 1 ? null : <TouchableOpacity style={[styles.row, { paddingVertical: '2%', marginVertical: '2%' }]}
                        onPress={() => navigation.navigate('CompleteProfile')}>
                        <MaterialCommunityIcons name="account-check-outline" size={30} color={color.red} />
                        <Text style={[styles.bold, { fontSize: 16, marginLeft: '5%' }]}>Complete Profile</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity style={[styles.row, { paddingVertical: '2%', marginVertical: '2%' }]}
                        onPress={() => navigation.navigate('Documents')}>
                        <MaterialCommunityIcons name="file-document-multiple-outline" size={30} color={color.red} />
                        <Text style={[styles.bold, { fontSize: 16, marginLeft: '5%' }]}>My Documents</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, { paddingVertical: '2%', marginVertical: '2%' }]}
                        onPress={() => navigation.navigate('AppliedJobs')}>
                        <MaterialCommunityIcons name="briefcase-account-outline" size={30} color={color.red} />
                        <Text style={[styles.bold, { fontSize: 16, marginLeft: '5%' }]}>My Jobs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, { paddingVertical: '2%', marginVertical: '2%' }]}
                        onPress={() => navigation.navigate('EditProfile')}>
                        <MaterialCommunityIcons name="pencil-outline" size={30} color={color.red} />
                        <Text style={[styles.bold, { fontSize: 16, marginLeft: '5%' }]}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, { paddingVertical: '2%', marginVertical: '2%' }]}
                        onPress={logout}>
                        <MaterialCommunityIcons name="logout" size={30} color={color.red} />
                        <Text style={[styles.bold, { fontSize: 16, marginLeft: '5%' }]}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, { paddingVertical: '2%', marginVertical: '2%' }]}
                        onPress={() => navigation.navigate('Tickets')}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={30} color={color.red} />
                        <Text style={[styles.bold, { fontSize: 16, marginLeft: '5%' }]}>Raise a ticket</Text>
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