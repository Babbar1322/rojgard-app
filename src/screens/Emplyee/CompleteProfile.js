import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity, Image, Modal, TextInput, BackHandler, Alert, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';

import styles from '../../config/styles';
import { Ionicons, Feather } from '@expo/vector-icons';
import { color, api } from '../../config/config';
import { completedProfile, selectName, selectUserId } from '../../redux/slice/authSlice';
import { Loading } from '../../components/lottie';

export default function CompleteProfile({ navigation }) {
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [upload, setUpload] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
    
    const [image, setImage] = useState(null);
    const [qualification, setQualification] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [resume, setResume] = useState('');
    const [experience, setExperience] = useState('');
    const [document, setDocument] = useState('');

    const name = useSelector(selectName);
    const userId = useSelector(selectUserId);

    const pickOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
    }

    const launchGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync(pickOptions);
        if (!result.cancelled) {
            setImage(result);
            setModalVisible(false);
        }
    };

    const launchCamera = async () => {
        let result = await ImagePicker.launchCameraAsync(pickOptions);
        if (!result.cancelled) {
            setImage(result);
            setModalVisible(false);
        }
    };

    const sumbitData = async () => {
        if(!image || !qualification || !category || !subCategory || !resume || !experience || !document){
            alert("Please Choose All Fields!");
            return;
        }
        setUpload(true);
        const formData = new FormData();
        formData.append('profilePic', {
            uri: image.uri,
            name: image.uri.replace(/^.*[\\\/]/, ''),
            type: image.type + "/" + image.uri.split(/[#?]/)[0].split('.').pop().trim()
        });
        formData.append('resume', {
            uri: resume.uri,
            name: resume.name,
            type: resume.mimeType
        });
        formData.append('experience', {
            uri: experience.uri,
            name: experience.name,
            type: experience.mimeType
        });
        formData.append('document', {
            uri: document.uri,
            name: document.name,
            type: document.mimeType
        });
        formData.append('userId', userId);
        formData.append('qualification', qualification);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        await axios.post(api + 'addUserDetails',
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: e => {
                    setProgress((e.loaded / e.total).toFixed(2))
                },
            }
        ).then((res) => {
            setUpload(false);
            setProgress(0);
            dispatch(completedProfile({isProfileCompleted: 0}));
            navigation.navigate('HomeTab');
        }).catch(err => console.log(err));
    };

    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if(result.type !== 'cancel'){
            setResume(result);
        }
    }

    const pickExperience = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if(result.type !== 'cancel'){
            setExperience(result);
        }
    }

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if(result.type !== 'cancel'){
            setDocument(result);
        }
    }

    const getCategory = async () => {
        setLoading(true);
        setUpload(true);
        await axios.get(api + 'getCategory').then(res => {
            setCatData(res.data.category);
            setSubCatData(res.data.subCategory);
            setLoading(false);
            setUpload(false);
        }).catch(err => {
            setLoading(false);
            setUpload(false);
            console.log(err);
            alert('Something went wrong!');
        });
    }

    useEffect(() => {
        getCategory();
    }, []);
    return (
        <View style={styles.container}>
            <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: '#00000050', justifyContent: 'space-evenly' }}>
                    <View style={[styles.row, styles.justifyAround, { paddingHorizontal: '10%' }]}>
                        <View style={[styles.pill, styles.shadow_sm]}>
                            <TouchableOpacity style={styles.circle} onPress={launchCamera}>
                                <Ionicons name='camera' size={30} color='#fff' />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.pill, styles.shadow_sm]}>
                            <TouchableOpacity style={styles.circle} onPress={launchGallery}>
                                <Ionicons name='image' size={30} color='#fff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => setModalVisible(false)} style={[styles.pill, styles.shadow_sm, { alignSelf: 'center', paddingHorizontal: '7%' }]}>
                        <Ionicons name='close' size={40} />
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal
                visible={upload}
                onDismiss={() => setUpload(false)}
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => setUpload(false)}>
                    <ImageBackground source={require('../../../assets/Images/transparent.png')} style={[styles.justifyCenter, {flex: 1, width: '100%'}]} resizeMode='stretch' blurRadius={50}>
                        {loading ? 
                        <AnimatedLottieView source={Loading} autoPlay loop style={{ width: '20%', alignSelf: 'center'}} resizeMode="contain" /> :
                        <View style={{marginHorizontal: '10%'}}>
                        <Text style={[styles.h1, styles.bold, styles.text_center, {color: '#fff', marginBottom: '5%'}]}>Uploading Files</Text>
                        <Progress.Bar progress={progress} width={null} color={color.white} borderColor={color.white} borderWidth={5} height={20} borderRadius={20} />
                        </View>}
                    </ImageBackground>
            </Modal>
            <ScrollView style={{ flex: 1, marginHorizontal: '5%' }} keyboardShouldPersistTaps={'handled'}>
                <View style={[styles.row, { marginVertical: '10%', justifyContent: 'center' }]}>
                    {image ?
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(true)}>
                            <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 50 }} />
                        </TouchableOpacity> :
                        <TouchableOpacity activeOpacity={0.7} style={{ borderWidth: 2, borderColor: color.red, borderRadius: 50, padding: '4%' }} onPress={() => setModalVisible(true)}>
                            <Ionicons name="camera-sharp" size={30} color={color.red} />
                        </TouchableOpacity>}
                    <View style={{ marginLeft: 10 }}>
                        <Text style={[styles.bold, { fontSize: 25, maxWidth: 300 }]}>Hi, {name}!</Text>
                        <Text>Upload your profile photo</Text>
                    </View>
                </View>
                <View style={{ width: '100%' }}>
                    <Text style={[styles.bold, { fontSize: 16 }]}>Profile Setup</Text>
                    <Progress.Bar progress={0.3} width={null} color={color.red} borderColor={color.black} height={20} borderRadius={20} />
                    <Text style={{ textAlign: 'right' }}>30% Completed</Text>
                </View>
                <View style={{ marginHorizontal: '2%' }}>
                    <TextInput activeOpacity={0.7} style={[styles.pill, styles.shadow_sm]} placeholder={'Qualification'} placeholderTextColor={'#000'} onChangeText={(e) => setQualification(e)} />
                    <Picker
                        style={[styles.pill, styles.shadow_sm]}
                        selectedValue={category}
                        onValueChange={(itemValue, itemIndex) =>
                            setCategory(itemValue)
                        }>
                        {catData.map((item, index) => (
                            <Picker.Item key={index} label={item.cat_name} value={item.id} />
                        ))}
                    </Picker>
                    <Picker
                        style={[styles.pill, styles.shadow_sm]}
                        selectedValue={subCategory}
                        onValueChange={(itemValue, itemIndex) =>
                            setSubCategory(itemValue)
                        }>
                        {subCatData.map((item, index) => (
                            <Picker.Item key={index} label={item.sub_cat_name} value={item.id} />
                        ))}
                    </Picker>
                </View>
                <Text style={[styles.bold, { color: 'red', fontSize: 12 }]}>* Only PDF or Images are allowed</Text>
                <View style={[styles.row, { marginHorizontal: '2%', justifyContent: 'space-between' }]}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={pickResume}>
                        <TouchableOpacity activeOpacity={0.7} style={{ borderColor: color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={pickResume}>
                            <Feather name="file" size={24} color={color.red} />
                        </TouchableOpacity>
                        <Text style={[styles.text_center, { fontSize: 12 }]}>{resume ? resume.name : 'Upload\nResume'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={pickExperience}>
                        <TouchableOpacity activeOpacity={0.7} style={{ borderColor: color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={pickExperience}>
                            <Feather name="file" size={24} color={color.red} />
                        </TouchableOpacity>
                        <Text style={[styles.text_center, { fontSize: 12 }]}>{experience ? experience.name : 'Upload\nExperience'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={pickDocument}>
                        <TouchableOpacity activeOpacity={0.7} style={{ borderColor: color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={pickDocument}>
                            <Feather name="file" size={24} color={color.red} />
                        </TouchableOpacity>
                        <Text style={[styles.text_center, { fontSize: 12 }]}>{document ? document.name : 'Upload\nDocument'}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={[styles.welcome_btn, styles.shadow_sm, { borderRadius: 40, paddingVertical: '3%', marginTop: '5%' }]} onPress={sumbitData}>
                    <Text style={[styles.bold, styles.text_center, { fontSize: 16, color: '#fff' }]}>Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={[styles.btn_outline, styles.shadow_sm, { borderRadius: 40, paddingVertical: '3%', marginVertical: '5%' }]} onPress={() => {
                    dispatch(completedProfile({isProfileCompleted: 0}));
                    navigation.navigate('HomeTab');
                }}>
                    <Text style={[styles.bold, styles.text_center, { fontSize: 16, color: color.red }]}>Skip</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={{ position: 'absolute', top: '-25%', right: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: '-2%', left: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 200, height: 50, resizeMode: 'contain', zIndex: -1, transform: [{ rotate: '30deg' }] }} />
            </View>
        </View>
    )
}