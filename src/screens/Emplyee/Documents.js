import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import styles from '../../config/styles';
import axios from 'axios';
import { api, color } from '../../config/config';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../redux/slice/authSlice';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';

export default function Documents({ navigation }) {
    const userId = useSelector(selectUserId);
    const [data, setData] = useState({});

    const [loading, setLoading] = useState(true);

    const getDocs = async () => {
        setLoading(true);
        await axios.get(api + 'getDocs/' + userId).then(res => {
            setData(res.data);
        }).catch(err => {
            console.log(err);
        });
        setLoading(false);
    }
    useEffect(() => {
        getDocs();
    }, []);

    const deleteFile = async (name, type) => {
        Alert.alert('Are you sure?', 'This cannot be undone!',
            [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "Delete", onPress: () => {
                        axios.post(api + 'deleteFile', {
                            userId: userId, type: type, file: name
                        }).then(res => {
                            getDocs();
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                }
            ]);
    }

    const updateDocument = async (docType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf']
        });
        if (result.type !== 'cancel') {
            setLoading(true);
            const formData = new FormData();
            formData.append(docType, {
                uri: result.uri,
                name: result.name,
                type: result.mimeType
            });
            formData.append('userId', userId);
            await axios.post(api + 'updateDocument', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then(res => {
                console.log(res.data);
                getDocs();
            }).catch(err => {
                console.log(err);
                Alert.alert('Oops!', 'Something went wrong!');
            });
            setLoading(false);
        }
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '40%' }} />
            )
        } else {
            return (
                <View style={styles.listContainer}>
                    <View style={[styles.listItem, styles.shadow_sm]}>
                        <Text style={{ fontWeight: '500' }}>Resume</Text>
                        {data.resume ? data.resume.endsWith('pdf') ?
                            <>
                                <TouchableOpacity style={[styles.btn, { marginVertical: '2%' }]} onPress={() => Linking.openURL('https://rojgar.biz/uploads/documents/' + data.resume)}>
                                    <Text style={[styles.text_center, styles.bold, { color: '#fff' }]}>Open PDF</Text>
                                </TouchableOpacity>
                            </> :
                            <>
                                <Image source={{ uri: 'https://rojgar.biz/uploads/documents/' + data.resume }} style={{ width: '100%', height: 400, borderRadius: 10 }} />
                            </> :
                            <Text>Not Uploaded Yet</Text>}
                            {data.resume && <View style={[styles.row, styles.justifyAround]}>
                                    <TouchableOpacity style={[styles.row, styles.btn, styles.shadow_sm, styles.justifyCenter, { backgroundColor: color.white, marginVertical: '2%', paddingHorizontal: '7%' }]} onPress={() => updateDocument('resume')}>
                                        <Ionicons name="ios-cloud-upload" size={20} color="#000" />
                                        <Text style={[styles.bold, { color: '#000', marginLeft: '2%' }]}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.row, styles.btn, styles.justifyCenter, styles.shadow_sm, { backgroundColor: 'red', marginVertical: '2%', paddingHorizontal: '7%' }]} onPress={() => deleteFile(data.resume, 'resume')}>
                                        <Ionicons name="trash" size={20} color="#fff" />
                                        <Text style={[styles.bold, { color: '#fff' }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>}
                    </View>
                    <View style={[styles.listItem, styles.shadow_sm]}>
                        <Text style={{ fontWeight: '500' }}>Experience Letter</Text>
                        {data.experience ? data.experience.endsWith('pdf') ?
                            <>
                                <TouchableOpacity style={[styles.btn, { marginVertical: '2%' }]} onPress={() => Linking.openURL('https://rojgar.biz/uploads/documents/' + data.experience)}>
                                    <Text style={[styles.text_center, styles.bold, { color: '#fff' }]}>Open PDF</Text>
                                </TouchableOpacity>
                            </> :
                            <>
                                <Image source={{ uri: 'https://rojgar.biz/uploads/documents/' + data.experience }} style={{ width: '100%', height: 400, borderRadius: 10 }} />
                            </> :
                                <Text>Not Uploaded Yet</Text>}
                                {data.experience && <View style={[styles.row, styles.justifyAround]}>
                                    <TouchableOpacity style={[styles.row, styles.btn, styles.shadow_sm, styles.justifyCenter, { backgroundColor: color.white, marginVertical: '2%', paddingHorizontal: '7%' }]} onPress={() => updateDocument('experience')}>
                                        <Ionicons name="ios-cloud-upload" size={20} color="#000" />
                                        <Text style={[styles.bold, { color: '#000', marginLeft: '2%' }]}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.row, styles.btn, styles.justifyCenter, styles.shadow_sm, { backgroundColor: 'red', marginVertical: '2%', paddingHorizontal: '7%' }]} onPress={() => deleteFile(data.experience, 'experience')}>
                                        <Ionicons name="trash" size={20} color="#fff" />
                                        <Text style={[styles.bold, { color: '#fff' }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>}
                    </View>
                </View>
            )
        }
    }
    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>My Documents</Text>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {screen()}
            </ScrollView>
        </View>
    )
}