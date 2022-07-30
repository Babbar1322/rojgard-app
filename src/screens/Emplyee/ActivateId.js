import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, ScrollView, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import styles from '../../config/styles';
import { api } from '../../config/config';
import { selectUserId, setIsActive } from '../../redux/slice/authSlice';
import { Loading, paymentSuccess } from '../../components/lottie';

export default function ActivateId({navigation}) {
    const dispatch = useDispatch();
    const id = useSelector(selectUserId);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');

    const [loading, setLoading] = useState(false);
    const [activateSuccess, setActivateSuccess] = useState(false);

    const getBalance = async () => {
        setLoading(true);
        setActivateSuccess(false);
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

        if(balance < amount){
            setLoading(false);
            return alert('Insufficient Balance!');
        }
        
        if(amount < 200){
            setLoading(false);
            return alert('Please Enter an Amount more than 200');
        };

        await axios.post(api + 'activateUser', {
            userId: id, amount: amount
        }).then(res => {
            getBalance();
            if(res.status == 200){
                setActivateSuccess(true);
                dispatch({setIsActive: 1});
            }
        }).catch(err => {
            getBalance();
            setLoading(false);
            if(err.toString().endsWith('400')){
                alert('Insufficient Balance!');
            }
            console.log(err);
        });
    }

    const screen = () => {
        if(loading){
            return(
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '50%' }} />
            )
        } else {
            return(
                <View style={{paddingHorizontal: '5%'}}>
                {activateSuccess ? 
                <AnimatedLottieView source={paymentSuccess} autoPlay loop={false} style={{ flex: 1, width: '100%', alignSelf: 'center', marginTop: '20%' }} /> : 
                <>
                <Text style={[styles.bold, styles.h1, {marginVertical: '5%'}]}>Activate Your Account{'\n'}with Coins</Text>
                    <Text style={[styles.bold, {textAlign: 'right'}]}>Balance: {balance}</Text>
                <TextInput placeholder='User ID' style={[styles.input, styles.shadow_sm]} autoCapitalize='characters' editable={false} value={id} />
                <TextInput placeholder='Coins' style={[styles.input, styles.shadow_sm]} onChangeText={(e) => setAmount(e)} />
                <TouchableOpacity style={[styles.btn, styles.shadow_sm, {marginVertical: '5%'}]} onPress={activate}>
                    <Text style={[styles.bold, styles.text_center, {color: '#fff'}]}>Activate</Text>
                </TouchableOpacity>
                </>}
            </View>
            )
        }
    }

    useEffect(() => {
        getBalance();
    }, []);
  return (
    <View style={styles.container}>
        <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>Activate Account</Text>
            </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
            {screen()}
            {activateSuccess ? 
            <Text style={[styles.bold, styles.text_center, {color: 'green', marginVertical: '5%', fontSize: 16}]}>Account Activated Successfully</Text> : null}
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