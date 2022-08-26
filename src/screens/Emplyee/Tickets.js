import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';

import styles from '../../config/styles';
import { Loading, noData } from '../../components/lottie';
import { color, api } from '../../config/config';
import { selectUserId } from '../../redux/slice/authSlice';

export default function Tickets({ navigation }) {
    const userId = useSelector(selectUserId);

    const [data, setData] = useState([]);

    const [visible, setVisible] = useState(false);
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    const [modalLoading, setModalLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const getTickets = async () => {
        setLoading(true);
        await axios.get(api + 'getTicket/?id=' + userId).then(res => {
            setData(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        });
        setLoading(false);
    }

    const submitTicket = async () => {
        if (!topic || !subject || !message || !email) {
            alert('All fields are required!');
            return;
        }
        setModalLoading(true);
        await axios.post(api + 'submitTicket', {
            subject: subject, message, message, email: email, topic: topic, userId: userId
        }).then(res => {
            getTickets();
            setModalLoading(false);
            setVisible(false);
        }).catch(err => {
            console.log(err);
            setModalLoading(false);
            setVisible(false);
        });
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, marginTop: '30%', width: '30%', alignSelf: 'center' }} />
            )
        } else {
            return (
                data.length > 0 ? <View>
                    {data.map((item, index) => (
                        item.status == 'pending' ?
                            <TouchableOpacity key={index} style={[styles.listItem, styles.row, styles.shadow_sm]} onPress={() => navigation.navigate('Support', { chatId: item.id })}>
                                <View style={{ marginHorizontal: '3%' }}>
                                    <Ionicons name='star' color={color.red} size={40} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    {item.replied == 1 &&
                                        <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                            <Ionicons name="alert-circle" size={24} color="red" />
                                        </View>}
                                    <Text style={[styles.bold, { color: '#000000' }]}>{item.subject}</Text>
                                    <Text style={[styles.bold, { color: '#000000' }]}>{item.topic}</Text>
                                    <Text style={[styles.bold, { color: item.status == 'pending' ? 'blue' : 'green' }]}>{item.status == 'pending' ? "Pending" : "Completed"}</Text>
                                </View>
                            </TouchableOpacity> :
                            <View key={index} style={[styles.listItem, styles.row, styles.shadow_sm]}>
                                <View style={{ marginHorizontal: '3%' }}>
                                    <Ionicons name='star' color={color.red} size={40} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    {item.replied == 1 &&
                                        <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                            <Ionicons name="alert-circle" size={24} color="red" />
                                        </View>}
                                    <Text style={[styles.bold, { color: '#000000' }]}>{item.subject}</Text>
                                    <Text style={[styles.bold, { color: '#000000' }]}>{item.topic}</Text>
                                    <Text style={[styles.bold, { color: item.status == 'pending' ? 'blue' : 'green' }]}>{item.status == 'pending' ? "Pending" : "Completed"}</Text>
                                </View>
                            </View>
                    ))}
                </View>: 
                <View>
                    <Text style={[styles.text_center, styles.bold, styles.h1, {marginTop: '50%'}]}>Great, There's not any tickets{"\n"}It Means there's no problem in app</Text>
                </View>
            )
        }
    }

    useEffect(() => {
        getTickets();
    }, []);
    return (
        <View style={styles.container}>
            <Modal transparent visible={visible} animationType={'slide'}>
                <ScrollView style={{ flex: 1, backgroundColor: '#000000bb' }} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                        {modalLoading ?
                            <AnimatedLottieView source={Loading} autoPlay loop style={{ marginTop: '50%', flex: 1, width: '60%', alignSelf: 'center' }} /> :
                            <>
                                <Text style={[styles.bold, styles.h1, styles.text_center, { color: color.white, paddingVertical: '5%' }]}>Raise new Ticket</Text>
                                <Picker style={styles.pill} mode='dropdown' onValueChange={(e) => setTopic(e)} selectedValue={topic}>
                                    <Picker.Item value={''} label="Select a category" />
                                    <Picker.Item value={'General'} label="General" />
                                    <Picker.Item value={'Tech Support'} label="Tech Support" />
                                    <Picker.Item value={'Enquiries'} label="Enquiries" />
                                    <Picker.Item value={'Account'} label="Account" />
                                    <Picker.Item value={'Other'} label="Other" />
                                </Picker>
                                <TextInput style={styles.pill} placeholder="Enter Subject" onChangeText={(e) => setSubject(e)} />
                                <TextInput style={styles.pill} autoComplete={'email'} autoCapitalize='none' keyboardType='email-address' placeholder="Enter Email" onChangeText={(e) => setEmail(e)} />
                                <TextInput style={[styles.pill, { textAlignVertical: 'top' }]} placeholder="Enter Message" multiline numberOfLines={4} onChangeText={(e) => setMessage(e)} />
                                <TouchableOpacity style={[styles.btn, styles.shadow_sm, { marginVertical: '5%' }]} onPress={submitTicket}>
                                    <Text style={[styles.bold, styles.text_center, { color: '#fff' }]}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_outline, styles.shadow_sm]} onPress={() => setVisible(false)}>
                                    <Text style={[styles.bold, styles.text_center, { color: color.red }]}>Close</Text>
                                </TouchableOpacity>
                            </>}
                    </View>
                </ScrollView>
            </Modal>
            <View style={[styles.row, styles.justifyBetween, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <View style={styles.row}>
                    <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                    <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]}>Raise a ticket</Text>
                </View>
                <View>
                    <Ionicons name='add' size={35} color={'black'} onPress={() => setVisible(true)} />
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                {screen()}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '-25%', right: '-5%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: '-2%', right: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 150, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}