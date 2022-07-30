import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Bar } from 'react-native-progress';
import { Ionicons, Feather } from '@expo/vector-icons';

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
    const [resume, setResume] = useState(null);
    const [experience, setExperience] = useState(null);
    const [document, setDocument] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const getInfo = async () => {
        setLoading(true);
        await axios.get(api + 'userInfo/' + userId).then(res => {
            setName(res.data[0].name);
            setEmail(res.data[0].email);
            setPhone(res.data[0].phone);
            setProfile('https://rojgar.biz/' + res.data[0].dp.profile_photo);
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

    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if (result.type !== 'cancel') {
            setLoading(true);
            setIsUploading(true);
            setResume(result);
            const formData = new FormData();
            formData.append('resume', {
                uri: result.uri,
                name: result.name,
                type: result.mimeType
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
                setLoading(false);
                setIsUploading(false);
                setProgress(0);
            }).catch(err => {
                console.log(err);
                setLoading(false);
                setIsUploading(false);
                setProgress(0);
                if (err.toString().endsWith('405')) {
                    alert('You must complete your profile before updating it.');
                    return;
                }
                alert('Something went wrong while updating your resume');
            });
        }
    }

    const pickExperience = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if (result.type !== 'cancel') {
            setLoading(true);
            setIsUploading(true);
            setExperience(result);
            const formData = new FormData();
            formData.append('experience', {
                uri: result.uri,
                name: result.name,
                type: result.mimeType
            });
            formData.append('userId', userId);
            await axios.post(api + 'updateDocument', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: e => {
                    setProgress((e.loaded / e.total).toFixed(2))
                },
            })
                .then((res) => {
                    setIsUploading(false);
                    setProgress(0);
                    setLoading(false);
                }).catch(err => {
                    console.log(err);
                    setLoading(false);
                    setIsUploading(false);
                    setProgress(0);
                    if (err.toString().endsWith('405')) {
                        alert('You must complete your profile before updating it.');
                        return;
                    }
                    alert('Something went wrong while updating your experience');
                });
        }
    }

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if (result.type !== 'cancel') {
            setLoading(true);
            setIsUploading(true);
            setDocument(result);
            const formData = new FormData();
            formData.append('document', {
                uri: result.uri,
                name: result.name,
                type: result.mimeType
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
                setIsUploading(false);
                setProgress(0);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
                setIsUploading(false);
                setProgress(0);
                if (err.toString().endsWith('405')) {
                    alert('You must complete your profile before updating it.');
                    return;
                }
                alert('Something went wrong while updating your document');
            });
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
            setLoading(false);
            setIsUploading(false);
            setProgress(0);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            setIsUploading(false);
            setProgress(0);
            if (err.toString().endsWith('405')) {
                alert('You must complete your profile before updating it.');
                return;
            }
            alert('Something went wrong while updating your profile photo');
        });
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
                        <Bar progress={progress} width={null} color={color.white} borderColor={color.white} borderWidth={5} height={20} borderRadius={20} /> :
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
                            <Image source={{ uri: profile }} style={styles.image} />
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
                        value={phone}
                        onChangeText={(e) => setPhone(e)} />

                    <Text style={[styles.bold, { color: 'red', fontSize: 12 }]}>* Only PDF or Images are allowed</Text>
                    <View style={[styles.row, { marginHorizontal: '2%', justifyContent: 'space-between' }]}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={pickResume}>
                            <TouchableOpacity activeOpacity={0.7} style={{ borderColor: color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={pickResume}>
                                <Feather name="file" size={24} color={color.red} />
                            </TouchableOpacity>
                            <Text style={[styles.text_center, { fontSize: 12 }]}>{resume ? resume.name : 'Update\nResume'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={pickExperience}>
                            <TouchableOpacity activeOpacity={0.7} style={{ borderColor: color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={pickExperience}>
                                <Feather name="file" size={24} color={color.red} />
                            </TouchableOpacity>
                            <Text style={[styles.text_center, { fontSize: 12 }]}>{experience ? experience.name : 'Update\nExperience'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={pickDocument}>
                            <TouchableOpacity activeOpacity={0.7} style={{ borderColor: color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={pickDocument}>
                                <Feather name="file" size={24} color={color.red} />
                            </TouchableOpacity>
                            <Text style={[styles.text_center, { fontSize: 12 }]}>{document ? document.name : 'Update\nDocument'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.btn_outline, { marginTop: '10%' }]} activeOpacity={0.5} onPress={upload}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red, fontSize: 15 }]}>Update</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}