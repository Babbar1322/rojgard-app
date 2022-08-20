import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Keyboard, ImageBackground } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import styles from '../../config/styles';
import { api, color } from '../../config/config';
import { selectName, selectUserId, setIsActive } from '../../redux/slice/authSlice';
import { Loading, paymentSuccess } from '../../components/lottie';
import Card from '../../../assets/Images/Card.jpg';

export default function ActivateId({ navigation }) {
    const dispatch = useDispatch();
    const id = useSelector(selectUserId);
    const name = useSelector(selectName);
    const [balance, setBalance] = useState(0);
    const [packageData, setPackageData] = useState('');

    const [loading, setLoading] = useState(false);
    const [activateSuccess, setActivateSuccess] = useState(false);

    const getPackage = async () => {
        setLoading(true);
        setActivateSuccess(false);
        await axios.get(api + 'getPackage').then(res => {
            setPackageData(res.data);
            setLoading(false);
            getBalance();
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    }

    const getBalance = async () => {
        setLoading(true);
        await axios.get(api + 'getBalance/' + id).then(res => {
            setLoading(false);
            setBalance(res.data[0]);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    }

    const activate = async () => {
        Keyboard.dismiss();
        setLoading(true);
        setActivateSuccess(false);

        if (balance < packageData.amount) {
            setLoading(false);
            return alert('Insufficient Balance!');
        };

        await axios.post(api + 'activateUser', {
            userId: id, amount: packageData.amount
        }).then(res => {
            getBalance();
            if (res.status == 200) {
                setActivateSuccess(true);
                dispatch({ setIsActive: 1 });
            }
        }).catch(err => {
            getBalance();
            setLoading(false);
            if (err.toString().endsWith('400')) {
                alert('Insufficient Balance!');
            }
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
                    {activateSuccess ?
                        <AnimatedLottieView source={paymentSuccess} autoPlay loop={false} style={{ flex: 1, width: '100%', alignSelf: 'center', marginTop: '20%' }} /> :
                        <>
                            <Text style={[styles.bold, styles.h1, { marginVertical: '5%' }]}>Activate Your Account{'\n'}with Coins</Text>
                            <Text style={[styles.bold, { textAlign: 'right' }]}>Your Balance: {balance}</Text>
                            <ImageBackground source={Card} style={[styles.card, styles.shadow_sm]} resizeMode='stretch' borderRadius={20}>
                                <Text style={[styles.bold, styles.h1, {color: color.white, marginVertical: '3%'}]}>{packageData.name}</Text>
                                <Text style={[styles.bold, {color: color.white, marginVertical: '3%'}]}>Cost: {packageData.amount} Coins</Text>
                                <Text style={[styles.bold, {color: color.white, marginVertical: '3%', fontSize: 16}]}>{name} #{id}</Text>
                            </ImageBackground>
                            <TouchableOpacity style={[styles.btn, styles.shadow_sm, { marginVertical: '5%' }]} onPress={activate}>
                                <Text style={[styles.bold, styles.text_center, { color: '#fff' }]}>Activate Package</Text>
                            </TouchableOpacity>
                        </>}
                </View>
            )
        }
    }

    useEffect(() => {
        getPackage();
    }, []);
    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>Activate Account</Text>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                {screen()}
                {activateSuccess ?
                    <Text style={[styles.bold, styles.text_center, { color: 'green', marginVertical: '5%', fontSize: 16 }]}>Account Activated Successfully</Text> : null}
            </ScrollView>
            <View style={{ position: 'absolute', top: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '30%', right: '-50%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: 0, left: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 200, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}