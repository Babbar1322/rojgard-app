import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Modal, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import {Ionicons} from '@expo/vector-icons';

import {Loading} from '../../components/lottie';
import { api, color } from '../../config/config';
import styles from '../../config/styles';
import { selectUserId } from '../../redux/slice/authSlice';

export default function ProviderUpdate({navigation}) {
    const userId = useSelector(selectUserId);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const getInfo = async () => {
        setLoading(true);
        await axios.get(api + 'userInfo/' + userId).then(res => {
            setName(res.data[0].name);
            setEmail(res.data[0].email);
            setPhone(res.data[0].phone);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    const upload = async () => {
        Keyboard.dismiss();
        setLoading(true);
        await axios.post(api + 'editProfile',{
            name: name, userId: userId, email: email, phone: phone
        }).then(res => {
            if(res.status === 200){
                navigation.navigate('AddJob');
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
            <Modal style={{flex: 1}} visible={loading} animationType="slide" transparent>
                <View style={[styles.justifyCenter, {backgroundColor: '#00000050', flex: 1}]}>
                    <AnimatedLottieView source={Loading} autoPlay loop style={{width: '20%', alignSelf: 'center'}} />
                </View>
            </Modal>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
            <View style={{ paddingHorizontal: '7%' }}>
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

                <TouchableOpacity style={[styles.btn_outline, { marginTop: '10%' }]} activeOpacity={0.5} onPress={upload}>
                    <Text style={[styles.bold, styles.text_center, { color: color.red, fontSize: 15 }]}>Update</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    )
}