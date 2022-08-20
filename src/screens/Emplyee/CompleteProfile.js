import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, ImageBackground, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';

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
    const [qData, setQData] = useState([]);
    const [subQData, setSubQData] = useState([]);

    const [image, setImage] = useState("");
    const [qualification, setQualification] = useState("");
    const [subQualification, setSubQualification] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [resume, setResume] = useState("");
    const [experience, setExperience] = useState("");
    const [profile, setProfile] = useState("");
    const [downloadExp, setDownloadExp] = useState("");
    const [downloadResume, setDownloadResume] = useState("");

    const [haveExperience, setHaveExperience] = useState('no');
    const [yearsOfExp, setYearsOfExp] = useState("");
    const [completed, setCompleted] = useState(0);

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

    const getNull = async () => {
        setLoading(true);
        setUpload(true);
        await axios.get(api + 'getNull/' + userId).then(res => {
            if(res.data[1] != null){
                setCompleted(parseFloat(res.data[0]));
                if(res.data[1].profile_photo){
                    setProfile(res.data[1].profile_photo);
                }
                if(res.data[1].qualification){
                    setQualification(res.data[1].qualification);
                }
                if(res.data[1].sub_qualification){
                    setSubQualification(res.data[1].sub_qualification);
                }
                if(res.data[1].category){
                    setCategory(res.data[1].category);
                }
                if(res.data[1].haveExperience){
                    setHaveExperience(res.data[1].haveExperience);
                    if(res.data[1].yearsOfExp){
                        setYearsOfExp(res.data[1].yearsOfExp);
                    }
                    if(res.data[1].experience){
                        setDownloadExp(res.data[1].experience);
                    }
                }
                if(res.data[1].resume){
                    setDownloadResume(res.data[1].resume);
                }
            }
        }).catch(err => {
            console.log(err);
        });
        setUpload(false);
        setLoading(false);
    }

    const sumbitData = async () => {
        setUpload(true);
        const formData = new FormData();
        if (image) {
            formData.append('profilePic', {
                uri: image.uri,
                name: image.uri.replace(/^.*[\\\/]/, ''),
                type: image.type + "/" + image.uri.split(/[#?]/)[0].split('.').pop().trim()
            });
        }
        if (resume) {
            formData.append('resume', {
                uri: resume.uri,
                name: resume.name,
                type: resume.mimeType
            });
        }
        if (experience) {
            formData.append('experience', {
                uri: experience.uri,
                name: experience.name,
                type: experience.mimeType
            });
        }
        formData.append('userId', userId);
        formData.append('qualification', qualification);
        formData.append('subQualification', subQualification);
        formData.append('haveExperience', haveExperience);
        formData.append('yearsOfExp', yearsOfExp);
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
            dispatch(completedProfile({ isProfileCompleted: 0 }));
            navigation.navigate('HomeTab');
        }).catch(err => {
            console.log(err);
            alert('Please try again!');
        });
        setUpload(false);
        setProgress(0);
    };

    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if (result.type !== 'cancel') {
            if(result.size > 1500000){
                return Alert.alert('File Size is too large', 'Please choose a file smaller than 1.5MB')
            }
            setResume(result);
        }
    }

    const pickExperience = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if (result.type !== 'cancel') {
            if(result.size > 1500000){
                return Alert.alert('File Size is too large', 'Please choose a file smaller than 1.5MB')
            }
            setExperience(result);
        }
    }

    const getCategory = async () => {
        setLoading(true);
        setUpload(true);
        await axios.get(api + 'getCategory').then(res => {
            setCatData(res.data.category);
            setLoading(false);
            setUpload(false);
        }).catch(err => {
            setLoading(false);
            setUpload(false);
            console.log(err);
            alert('Something went wrong!');
        });
    }
    const getSubCategory = async (catId) => {
        setLoading(true);
        setUpload(true);
        await axios.get(api + 'getSubCategory?catId=' + catId).then(res => {
            if (!res.data.subcategory) {
                setSubCatData([]);
                setLoading(false);
                setUpload(false);
            } else {
                setSubCatData(res.data.subcategory);
                setLoading(false);
                setUpload(false);
            }
        }).catch(err => {
            setLoading(false);
            setUpload(false);
            console.log(err);
            alert('Something went wrong!');
        });
    }

    const getQualification = async () => {
        setLoading(true);
        setUpload(true);
        await axios.get(api + 'getQualification').then(res => {
            setQData(res.data);
            setUpload(false);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setUpload(false);
            setLoading(false);
        });
    }
    const getSubQualification = async (qId) => {
        setUpload(true);
        setLoading(true);
        await axios.get(api + 'getSubQualification?qId=' + qId).then(res => {
            setSubQData(res.data);
            setUpload(false);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setUpload(false);
            setLoading(false);
        });
    }

    useEffect(() => {
        getCategory();
        getQualification();
        getNull();
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
                <ImageBackground source={require('../../../assets/Images/transparent.png')} style={[styles.justifyCenter, { flex: 1, width: '100%' }]} resizeMode='stretch' blurRadius={50}>
                    {loading ?
                        <AnimatedLottieView source={Loading} autoPlay loop style={{ width: '20%', alignSelf: 'center' }} resizeMode="contain" /> :
                        <View style={{ marginHorizontal: '10%' }}>
                            <Text style={[styles.h1, styles.bold, styles.text_center, { color: '#fff', marginBottom: '5%' }]}>Uploading Files</Text>
                            <Progress.Bar progress={parseFloat(progress)} width={null} color={color.white} borderColor={color.white} borderWidth={5} height={20} borderRadius={20} />
                        </View>}
                </ImageBackground>
            </Modal>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                <View style={{ paddingHorizontal: '5%' }}>
                    <View style={[styles.row, styles.justifyCenter, { marginVertical: '10%' }]}>
                        {image ?
                            <TouchableOpacity activeOpacity={0.7} onPress={() => profile ? null : setModalVisible(true)}>
                                <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 50 }} />
                            </TouchableOpacity> :
                            <TouchableOpacity activeOpacity={0.7} style={{ borderWidth: 2, borderColor: color.red, borderRadius: 50, padding: profile ? 0 : '4%' }} onPress={() => profile ? null : setModalVisible(true)}>
                                {profile ? 
                                <Image source={{ uri: 'https://rojgar.biz/uploads/documents/' + profile }} style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 50 }} /> :
                                <Ionicons name="camera-sharp" size={30} color={color.red} />}
                            </TouchableOpacity>}
                        <View style={{ marginLeft: 10 }}>
                            <Text style={[styles.bold, { fontSize: 25, maxWidth: 300 }]}>Hi, {name}!</Text>
                            <Text>Upload your profile photo</Text>
                        </View>
                    </View>
                    <View style={{paddingVertical: '2%'}}>
                        <Text style={{fontSize: 12, fontWeight: '500'}}>Profile Setup</Text>
                        <Progress.Bar progress={completed} width={null} height={20} color={color.red} borderRadius={30} />
                        <Text style={{fontSize: 12, fontWeight: '500', textAlign: 'right'}}>{completed*100}% Completed</Text>
                    </View>
                    <View style={{ marginHorizontal: '2%' }}>
                        <Text style={[styles.bold]}>Qualification</Text>
                        <Picker
                            style={[styles.pill, styles.shadow_sm]}
                            selectedValue={qualification}
                            onValueChange={(itemValue, itemIndex) => {
                                setQualification(itemValue);
                                getSubQualification(itemValue);
                                console.log(qualification);
                            }}>
                                <Picker.Item value="" label="Choose Qualificaton" />
                            {qData.map((item, index) => (
                                <Picker.Item key={index} value={item.id} label={item.title} />
                            ))}
                        </Picker>
                        {subQData.length !== 0 && <Picker
                            style={[styles.pill, styles.shadow_sm]}
                            selectedValue={subQualification}
                            onValueChange={(itemValue, itemIndex) => {
                                setSubQualification(itemValue);
                                console.log(subQualification);
                            }}>
                                <Picker.Item value="" label="Choose Sub Qualificaton" />
                            {subQData.map((item, index) => (
                                <Picker.Item key={index} value={item.id} label={item.title} />
                            ))}
                        </Picker>}
                        <Text style={[styles.bold, { marginTop: '4%' }]}>Category</Text>
                        <Picker
                            style={[styles.pill, styles.shadow_sm]}
                            selectedValue={category}
                            onValueChange={(itemValue, itemIndex) => {
                                setCategory(itemValue);
                                getSubCategory(itemValue);
                            }}>
                                <Picker.Item value="" label="Choose Category" />
                            {catData.map((item, index) => (
                                <Picker.Item key={index} label={item.cat_name} value={item.id} />
                            ))}
                        </Picker>
                        {subCatData.length !== 0 &&
                            <><Text style={[styles.bold]}>Sub Category</Text>
                                <Picker
                                    style={[styles.pill, styles.shadow_sm]}
                                    selectedValue={subCategory}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSubCategory(itemValue)
                                    }>
                                        <Picker.Item value="" label="Choose Sub Category" />
                                    {subCatData.map((item, index) => (
                                        <Picker.Item key={index} label={item.sub_cat_name} value={item.id} />
                                    ))}
                                </Picker>
                            </>}
                        <Text style={[styles.bold, { marginTop: '4%' }]}>Do You have any work experience?</Text>
                        <View style={[styles.row]}>
                            <RadioButton
                                value='yes'
                                color={color.red}
                                status={haveExperience === 'yes' ? 'checked' : 'unchecked'}
                                onPress={() => setHaveExperience('yes')} />
                            <Text>Yes</Text>
                        </View>
                        <View style={[styles.row]}>
                            <RadioButton
                                value='no'
                                color={color.red}
                                status={haveExperience === 'no' ? 'checked' : 'unchecked'}
                                onPress={() => setHaveExperience('no')} />
                            <Text>No</Text>
                        </View>
                        {haveExperience === 'yes' &&
                            <View>
                                <Text>How many years of experience you have?</Text>
                                <Picker
                                    style={[styles.pill, styles.shadow_sm]}
                                    selectedValue={yearsOfExp}
                                    mode='dropdown'
                                    onValueChange={(itemValue, itemIndex) => 
                                        setYearsOfExp(itemValue)
                                    }>
                                        <Picker.Item value="" label="Choose Years of Eperience" />
                                    <Picker.Item value={1} label='1 Year' />
                                    <Picker.Item value={2} label='2 Years' />
                                    <Picker.Item value={3} label='3 Years' />
                                    <Picker.Item value={4} label='4 or More Years' />
                                </Picker>
                            </View>}
                    </View>
                    <Text style={[styles.bold, { color: 'red', fontSize: 12 }]}>* Only PDF or Images are allowed</Text>
                    <View style={[styles.row, styles.justifyAround, { marginHorizontal: '2%' }]}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={downloadResume ? null : pickResume}>
                            <TouchableOpacity activeOpacity={0.7} style={{ borderColor: downloadResume ? 'green' : color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={downloadResume ? null : pickResume}>
                                <Feather name={downloadResume ? "check" : "file"} size={24} color={downloadResume ? 'green' : color.red} />
                            </TouchableOpacity>
                            <Text style={[styles.text_center, { fontSize: 12, width: '80%' }]}>{resume ? resume.name : downloadResume ? downloadResume : 'Upload\nResume'}</Text>
                        </TouchableOpacity>
                        {haveExperience === 'yes' && <TouchableOpacity activeOpacity={0.7} style={styles.filePill} onPress={downloadExp ? null : pickExperience}>
                            <TouchableOpacity activeOpacity={0.7} style={{ borderColor: downloadExp ? 'green' : color.red, borderWidth: 1, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10 }} onPress={downloadExp ? null : pickExperience}>
                                <Feather name={downloadExp ? "check" : "file"} size={24} color={downloadExp ? 'green' : color.red} />
                            </TouchableOpacity>
                            <Text style={[styles.text_center, { fontSize: 12, width: '80%' }]}>{experience ? experience.name : downloadExp ? downloadExp : 'Upload\nExperience'}</Text>
                        </TouchableOpacity>}
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={[styles.welcome_btn, styles.shadow_sm, { borderRadius: 40, paddingVertical: '3%', marginTop: '5%' }]} onPress={sumbitData}>
                        <Text style={[styles.bold, styles.text_center, { fontSize: 16, color: '#fff' }]}>Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={[styles.btn_outline, styles.shadow_sm, { borderRadius: 40, paddingVertical: '3%', marginVertical: '5%' }]} onPress={() => {
                        dispatch(completedProfile({ isProfileCompleted: 0 }));
                        navigation.navigate('HomeTab');
                    }}>
                        <Text style={[styles.bold, styles.text_center, { fontSize: 16, color: color.red }]}>Skip</Text>
                    </TouchableOpacity>
                </View>
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