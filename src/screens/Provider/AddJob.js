import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StatusBar, ScrollView, TextInput, Image, TouchableOpacity, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { color } from '../../config/config';
import styles from '../../config/styles';
import { selectName, selectUserId, setLogin } from '../../redux/slice/authSlice';
import { api } from '../../config/config';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';
import { setLogout } from '../../redux/slice/authSlice';

export default function AddJob({ navigation }) {
    const dispatch = useDispatch();
    const userName = useSelector(selectName);
    const userId = useSelector(selectUserId);
    const panelRef = useRef(null);

    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [employees, setEmployees] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [description, setDescription] = useState('');

    const pickOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
    }

    const launchGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync(pickOptions);

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const sendData = async () => {
        if (!image || !title || !city || !category || !employees || !minSalary || !maxSalary || !description) {
            alert('Add Fields are required!');
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('jobImg', {
            uri: image.uri,
            name: image.uri.replace(/^.*[\\\/]/, ''),
            type: "image/jpeg"
        });
        formData.append('title', title);
        formData.append('city', city);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('employees', employees);
        formData.append('minSalary', minSalary);
        formData.append('maxSalary', maxSalary);
        formData.append('description', description);
        formData.append('userId', userId);

        await axios.post(api + 'addJob',
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    navigation.navigate('Success');
                }
            }).catch(err => {
                setLoading(false);
                console.log(err);
                alert('Something went wrong!');
            });
    }

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

    const updateUser = async () => {
        await axios.get(api + 'userInfo/' + userId).then(res => {
            const newData = res.data[0];
            let image = null;
            if (newData.dp !== null) {
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
    }

    const handleBackPress = () => {
        if (!navigation.isFocused()) {
            return false;
        } else {
            Alert.alert('Exit!', 'Are you sure you want to Exit?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        }
    };

    const getCategory = async () => {
        setLoading(true);
        await axios.get(api + 'getCategory').then(res => {
            setCatData(res.data.category);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    }
    const getSubCategory = async (catId) => {
        setLoading(true);
        await axios.get(api + 'getSubCategory?catId=' + catId).then(res => {
            if (!res.data.subcategory) {
                setSubCatData([]);
                setLoading(false);
            } else {
                setSubCatData(res.data.subcategory);
                setLoading(false);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '50%' }} />
            )
        } else {
            return (
                <View style={{ paddingHorizontal: '5%' }}>
                    <View style={[styles.row, { marginBottom: '5%', justifyContent: 'center' }]}>
                        {image ?
                            <TouchableOpacity activeOpacity={0.7} onPress={launchGallery}>
                                <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 50 }} />
                            </TouchableOpacity> :
                            <TouchableOpacity activeOpacity={0.7} style={{ borderWidth: 2, borderColor: color.red, borderRadius: 50, padding: '4%' }} onPress={launchGallery}>
                                <Ionicons name="camera-sharp" size={30} color={color.red} />
                            </TouchableOpacity>}
                        <View style={{ marginLeft: 10 }}>
                            <Text style={[styles.bold, { fontSize: 25, maxWidth: 300 }]}>Add Image</Text>
                            <Text>Upload image for your job</Text>
                        </View>
                    </View>
                    <TextInput style={[styles.input, styles.shadow_sm]} placeholder='Job Title' onChangeText={(e) => setTitle(e)} value={title} />
                    <TextInput style={[styles.input, styles.shadow_sm]} placeholder='Job City' onChangeText={(e) => setCity(e)} value={city} />
                    <View style={[styles.row, styles.justifyBetween]}>
                        <Picker selectedValue={category} style={[styles.input, styles.shadow_sm, { width: subCatData.length === 0 ? '100%' : '48%' }]} onValueChange={(e) => {
                            setCategory(e)
                            getSubCategory(e)
                        }}>
                            <Picker.Item value='' label='Choose Category' />
                            {catData.map((item, index) => (
                                <Picker.Item key={index} label={item.cat_name} value={item.id} />
                            ))}
                        </Picker>
                        {subCatData.length !== 0 && <Picker selectedValue={subCategory} style={[styles.input, styles.shadow_sm, { width: '48%' }]} onValueChange={(e) => setSubCategory(e)}>
                            <Picker.Item value='' label='Choose Sub Category' />
                            {subCatData.map((item, index) => (
                                <Picker.Item key={index} label={item.sub_cat_name} value={item.id} />
                            ))}
                        </Picker>}
                    </View>
                    <TextInput style={[styles.input, styles.shadow_sm]} placeholder='Employees Required' keyboardType='number-pad' onChangeText={(e) => setEmployees(e)} value={employees} />
                    <View style={[styles.row, styles.justifyBetween]}>
                        <TextInput style={[styles.input, styles.shadow_sm, { width: '48%' }]} placeholder='Minimum Salary' keyboardType='number-pad' onChangeText={(e) => setMinSalary(e)} value={minSalary} />
                        <TextInput style={[styles.input, styles.shadow_sm, { width: '48%' }]} placeholder='Maximum Salary' keyboardType='number-pad' onChangeText={(e) => setMaxSalary(e)} value={maxSalary} />
                    </View>
                    <TextInput style={[styles.input, styles.shadow_sm, { textAlignVertical: 'top' }]} placeholder='Description' numberOfLines={5} multiline={true} onChangeText={(e) => setDescription(e)} value={description} />
                    <TouchableOpacity activeOpacity={0.5} style={[styles.btn_outline, { marginVertical: '5%' }]} onPress={sendData}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red }]}>Submit</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    useEffect(() => {
        getCategory();
        updateUser();

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='handled'>
                <View style={[styles.row, styles.justifyBetween, { paddingVertical: '5%', paddingHorizontal: '6%' }]}>
                    <View></View>
                    <Text style={[styles.bold, styles.text_center, { fontSize: 18 }]}>Fill Your Requirments</Text>
                    <Entypo name="dots-three-vertical" size={24} color="black" onPress={() => panelRef.current.togglePanel()} />
                </View>
                {screen()}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: '-20%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '-25%', right: '-5%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1, opacity: 0.5 }} />
            </View>
            <View style={{ position: 'absolute', top: '23%', right: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 150, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
            <BottomSheet isOpen={false} ref={ref => panelRef.current = ref} sliderMinHeight={0}>
                <View style={{ paddingBottom: '5%' }}>
                    <View style={{ marginVertical: '5%' }}>
                        <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]}>{userName}</Text>
                        <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]}>#{userId}</Text>
                    </View>
                    <TouchableOpacity style={[styles.btn_outline, { marginVertical: '5%' }]}
                        onPress={() => navigation.navigate('AddedJobs')}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red }]}>Added Jobs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn]} onPress={() => navigation.navigate('ProviderUpdate')}>
                        <Text style={[styles.bold, styles.text_center, { color: '#fff' }]}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn_outline, { marginVertical: '5%' }]}
                        onPress={logout}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </View>
    )
}