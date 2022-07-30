import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';

import styles from '../../config/styles';
import { api, color } from '../../config/config';
import { selectUserId } from '../../redux/slice/authSlice';
import { Loading } from '../../components/lottie';

export default function Support() {
    const userId = useSelector(selectUserId);
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const ScrollRef = useRef();

    const getChat = async () => {
        setLoading(true);
        await axios.get(api + 'getChat/?id=' + userId).then(res => {
            setChat(res.data.chat);
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
            return
        }
        await axios.post(api + 'postChat', {
            message: message, userId: userId
        }).then(() => {
            setMessage("");
            getChat();
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    useEffect(() => {
        getChat();
        setTimeout(() => {
            ScrollRef.current.scrollToEnd();
        }, 2000);
    }, []);
    return (
        <View style={styles.container}>
            <View style={{ paddingVertical: '5%' }}>
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]}>Chat with Admin</Text>
            </View>
            <ScrollView ref={ScrollRef} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: '5%' }}>
                    {chat.map((item, index) => (
                        item.from === userId ?
                            <View style={styles.chatRight}>
                                <Text style={[styles.medium, { color: '#fff', fontSize: 15 }]}>{item.message}</Text>
                            </View> :
                            <View style={styles.chatLeft}>
                                <Text style={[styles.medium, {color: color.red, fontSize: 15}]}>{item.message}</Text>
                            </View>
                    ))}
                </View>
            </ScrollView>
            <View style={[styles.row, styles.justifyBetween, { paddingHorizontal: '5%' }]}>
                <TextInput placeholder='Enter Message...' style={[styles.input, styles.shadow_sm, { width: '80%' }]} multiline onChangeText={(e) => setMessage(e)} value={message} />
                {loading ? <TouchableOpacity style={[styles.btn, styles.shadow_sm, { paddingHorizontal: '5%', maxWidth: '17%' }]} activeOpacity={1}>
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