import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Bar } from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';

import { Loading } from '../../components/lottie';
import { api, color } from '../../config/config';
import styles from '../../config/styles';
import { selectUserId } from '../../redux/slice/authSlice';

export default function EditProfile({ navigation }) {
    const userId = useSelector(selectUserId);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profile, setProfile] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const getInfo = async () => {
        setLoading(true);
        await axios.get(api + 'userInfo/' + userId).then(res => {
            setName(res.data[0].name);
            setEmail(res.data[0].email);
            setPhone(res.data[0].phone);
            if(res.data[0].dp === null){
                setProfile(null);
            }else{
                setProfile(res.data[0].dp.profile_photo);
            }
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
        });
        if (!result.cancelled) {
            setImage(result);
            uploadImage(result);
        }
    }

    const uploadImage = async (pic) => {
        setLoading(true);
        setIsUploading(true);
        const formData = new FormData();
        formData.append('profilePic', {
            uri: pic.uri,
            name: pic.uri.replace(/^.*[\\\/]/, ''),
            type: pic.type + "/" + pic.uri.split(/[#?]/)[0].split('.').pop().trim()
        });
        formData.append('userId', userId);
        await axios.post(api + 'updateDocument', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: e => {
                setProgress((e.loaded / e.total).toFixed(2))
            },
        }).then((res) => {
            setProgress(0);
        }).catch(err => {
            console.log(err);
            setProgress(0);
            alert('Something went wrong while updating your profile photo');
        });
        setLoading(false);
        setIsUploading(false);
    }

    const upload = async () => {
        setLoading(true);
        await axios.post(api + 'editProfile', {
            name: name, userId: userId, email: email, phone: phone
        }).then(res => {
            if (res.status === 200) {
                navigation.navigate('Profile');
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    }

    useLayoutEffect(() => {
        getInfo();
    }, []);

    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>Edit Your Profile</Text>
            </View>
            <Modal style={{ flex: 1 }} visible={loading} animationType="slide" transparent>
                <View style={[styles.justifyCenter, { backgroundColor: '#00000050', flex: 1, paddingHorizontal: '10%' }]}>
                    {isUploading ?
                    <>
                    <Text style={[styles.text_center, styles.bold, {color: '#fff', marginBottom: '2%'}]}>Uploading</Text>
                        <Bar progress={parseFloat(progress)} width={null} color={color.white} borderColor={color.white} borderWidth={5} height={20} borderRadius={20} /></>:
                        <AnimatedLottieView source={Loading} autoPlay loop style={{ width: '20%', alignSelf: 'center' }} />}
                </View>
            </Modal>
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps
                ={'handled'} showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: '7%' }}>
                    {image ?
                        <TouchableOpacity onPress={pickImage}>
                            <Image source={{ uri: image.uri }} style={styles.image} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={pickImage}>
                            <Image source={{ uri: profile ? "https://rojgar.biz/uploads/documents/" +profile : 'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }} style={styles.image} />
                        </TouchableOpacity>
                    }
                    <TextInput
                        style={[styles.input, styles.shadow]}
                        placeholder='Full Name'
                        autoComplete='off'
                        autoCapitalize='words'
                        value={name}
                        onChangeText={(e) => setName(e)} />
                    <TextInput
                        style={[styles.input, styles.shadow]}
                        placeholder='Email'
                        textContentType='emailAddress'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={email}
                        autoCompleteType='email'
                        onChangeText={(e) => setEmail(e)} />
                    <TextInput
                        style={[styles.input, styles.shadow]}
                        placeholder='Phone Number'
                        keyboardType='number-pad'
                        editable={false}
                        value={phone}
                        onChangeText={(e) => setPhone(e)} />

                    <TouchableOpacity style={[styles.btn_outline, { marginTop: '10%' }]} activeOpacity={0.5} onPress={upload}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red, fontSize: 15 }]}>Update</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}