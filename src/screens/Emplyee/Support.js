import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

import styles from '../../config/styles';
import { api, color } from '../../config/config';
import { selectUserId } from '../../redux/slice/authSlice';
import { Loading } from '../../components/lottie';
import Groups from '../../config/Groups';

export default function Support({ route, navigation }) {
    const userId = useSelector(selectUserId);
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const ScrollRef = useRef();

    const getChat = async () => {
        setLoading(true);
        await axios.get(api + 'getChat/?chatId=' + route.params.chatId).then(res => {
            setChat(Groups(res.data.chat));
            setLoading(false);
        }).then(() => {
            ScrollRef.current.scrollToEnd();
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    };

    const sendChat = async () => {
        setLoading(true);
        if (message.length < 1) {
            setLoading(false);
            return;
        }
        await axios.post(api + 'postChat', {
            message: message, userId: userId, supportId: route.params.chatId
        }).then(() => {
            setMessage("");
            getChat();
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    const renderItem = ({ item, index }) => {
        if (item.type && item.type === 'day') {
            return (
                <View key={index} style={[styles.row, styles.justifyCenter]}>
                    <View style={{ height: 1, backgroundColor: color.grey, width: '30%' }}></View>
                    <Text key={item.created_at} style={[styles.bold, { color: color.grey, fontSize: 12, marginHorizontal: '5%' }]}>{item.date}</Text>
                    <View style={{ height: 1, backgroundColor: color.grey, width: '30%' }}></View>
                </View>
            )
        }
        if (item.from === userId) {
            return (
                <View key={item.id} style={styles.chatRight}>
                    <Text style={[styles.medium, { color: '#fff', fontSize: 15 }]}>{item.message}</Text>
                    <Text style={{ textAlign: 'right', fontSize: 10, color: color.grey, fontWeight: '500' }}>{moment(item.created_at).format('hh:MM a')}</Text>
                </View>
            )
        } else {
            return (
                <View key={item.id} style={styles.chatLeft}>
                    <Text style={[styles.medium, { color: color.red, fontSize: 15 }]}>{item.message}</Text>
                    <Text style={{ textAlign: 'right', fontSize: 10, color: color.grey, fontWeight: '500' }}>{moment(item.created_at).format('hh:MM a')}</Text>
                </View>
            )
        }
    }

    useEffect(() => {
        getChat();
    }, []);
    return (
        <View style={styles.container}>
            <View style={[styles.row, styles.justifyBetween, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <View style={styles.row}>
                    <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                    <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]}>Chat with Admin</Text>
                </View>
            </View>
            <FlatList
                data={chat}
                // inverted
                keyExtractor={(item, index) => index.toString()}
                ref={ScrollRef}
                style={{ flex: 1, paddingHorizontal: '5%' }}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem} />
            <View style={[styles.row, styles.justifyBetween, { paddingHorizontal: '5%' }]}>
                <TextInput placeholder='Enter Message...' style={[styles.input, styles.shadow_sm, { width: '80%' }]} multiline onChangeText={(e) => setMessage(e)} value={message} />
                {loading ?
                    <TouchableOpacity style={[styles.btn, styles.shadow_sm, { paddingHorizontal: '5%', maxWidth: '17%' }]} activeOpacity={1}>
                        <AnimatedLottieView source={Loading} autoPlay loop style={{ width: '100%' }} />
                    </TouchableOpacity> :
                    <TouchableOpacity style={[styles.btn, styles.shadow_sm, { paddingHorizontal: '5%', maxWidth: '17%' }]} onPress={sendChat}>
                        <Feather name="send" size={24} color="white" />
                    </TouchableOpacity>}
            </View>
            <View style={{ position: 'absolute', bottom: '-20%', left: '-20%' }}>
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