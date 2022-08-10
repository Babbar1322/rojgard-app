import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Button, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../config/styles';
import axios from 'axios';
import { api } from '../../config/config';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../redux/slice/authSlice';

export default function Documents({ navigation }) {
    const userId = useSelector(selectUserId);
    const [data, setData] = useState({});
    const getDocs = () => {
        axios.get(api + 'getDocs/' + userId).then(res => {
            setData(res.data);
        }).catch(err => {
            console.log(err);
        });
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
            { text: "Delete", onPress: () => {
            axios.post(api + 'deleteFile', {
                userId: userId, type: type, file: name
            }).then(res => {
                // console.log(res.data);
                getDocs();
            }).catch(err => {
                console.log(err);
            }) }}
          ]);
    }
    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>My Documents</Text>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.listContainer}>
                    <View style={[styles.listItem, styles.shadow_sm]}>
                        <Text>Resume</Text>
                        {data.resume ? data.resume.endsWith('pdf') ?
                            <>
                                <TouchableOpacity style={[styles.btn, { marginVertical: '2%' }]} onPress={() => Linking.openURL('https://rojgar.biz/uploads/documents/' + data.resume)}>
                                    <Text style={[styles.text_center, styles.bold, { color: '#fff' }]}>Open PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.row, styles.btn, styles.justifyCenter, { backgroundColor: 'red', marginVertical: '2%' }]} onPress={() => deleteFile(data.resume, 'resume')}>
                                    <Ionicons name="trash" size={24} color="#fff" />
                                    <Text style={[styles.bold, { color: '#fff' }]}>Delete Document</Text>
                                </TouchableOpacity>
                            </> :
                            <>
                                <Image source={{ uri: 'https://rojgar.biz/uploads/documents/' + data.resume }} style={{ width: '100%', height: 400, borderRadius: 10 }} />
                                <TouchableOpacity style={[styles.row, styles.btn, styles.justifyCenter, { backgroundColor: 'red', marginVertical: '2%' }]} onPress={() => deleteFile(data.resume, 'resume')}>
                                    <Ionicons name="trash" size={24} color="#fff" />
                                    <Text style={[styles.bold, { color: '#fff' }]}>Delete Document</Text>
                                </TouchableOpacity>
                            </> :
                            <Text>Not Uploaded Yet</Text>}
                    </View>
                    <View style={[styles.listItem, styles.shadow_sm]}>
                        <Text>Experience Letter</Text>
                        {data.experience ? data.experience.endsWith('pdf') ?
                            <>
                                <TouchableOpacity style={[styles.btn, { marginVertical: '2%' }]} onPress={() => Linking.openURL('https://rojgar.biz/uploads/documents/' + data.experience)}>
                                    <Text style={[styles.text_center, styles.bold, { color: '#fff' }]}>Open PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.row, styles.btn, styles.justifyCenter, { backgroundColor: 'red', marginVertical: '2%' }]} onPress={() => deleteFile(data.experience, 'experience')}>
                                    <Ionicons name="trash" size={24} color="#fff" />
                                    <Text style={[styles.bold, { color: '#fff' }]}>Delete Document</Text>
                                </TouchableOpacity>
                            </> :
                            <>
                                <Image source={{ uri: 'https://rojgar.biz/uploads/documents/' + data.experience }} style={{ width: '100%', height: 400, borderRadius: 10 }} />
                                <TouchableOpacity style={[styles.row, styles.btn, styles.justifyCenter, { backgroundColor: 'red', marginVertical: '2%' }]} onPress={() => deleteFile(data.experience, 'experience')}>
                                    <Ionicons name="trash" size={24} color="#fff" />
                                    <Text style={[styles.bold, { color: '#fff' }]}>Delete Document</Text>
                                </TouchableOpacity>
                            </> :
                            <Text>Not Uploaded Yet</Text>}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}