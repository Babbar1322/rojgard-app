import React, {useState} from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Keyboard, Alert } from 'react-native';
import styles from '../../config/styles';
import Logo from '../../../assets/Logo.png';
import { color, api } from '../../config/config';
import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreatePassword({ route, navigation }) {

    const [password, setPassword] = useState(null);

    const [loading, setLoading] = useState(false);

    const createPass = async () => {
        setLoading(true);
        Keyboard.dismiss();
  
        await axios.post(api + 'createPass', {
            password: passoword
        }).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        });
        setLoading(false);
     }

     const screen = () => {
        if(loading){
            return(
                <AnimatedLottieView source={Loading} autoPlay loop style={{flex: 1, width: '20%', alignSelf: 'center'}} />
            )
        } else {
            return(
                <View style={{ paddingHorizontal: '7%' }}>
                    <TextInput style={[styles.input, styles.shadow]} placeholder='Create New Password' autoCapitalize='none' autoCorrect={false} value={password} secureTextEntry onChangeText={(e) => setPassword(e)} />

                    <TouchableOpacity style={[styles.btn]} activeOpacity={0.5} onPress={createPass}>
                        <Text style={[styles.bold, styles.text_center, { color: color.white, fontSize: 15 }]}>Change Password</Text>
                    </TouchableOpacity>
                </View>
            )
        }
     }
    return (
        <View style={[styles.container]}>
            <Image source={Logo} style={[styles.logo, { alignSelf: 'center' }]} />

            <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: color.red, }]}>Create New Password</Text>

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
                {screen()}
            </ScrollView>
            <View style={{position: 'absolute', bottom: '-25%', left: '-20%'}}>
                <Image source={require('../../../assets/Images/circle.png')} style={{zIndex: -1}} />
            </View>
            <View style={{position: 'absolute', top: '-25%', right: '-5%'}}>
                <Image source={require('../../../assets/Images/circle.png')} style={{zIndex: -1}} />
            </View>
            <View style={{position: 'absolute', bottom: '-2%', right: '0%'}}>
                <Image source={require('../../../assets/Images/dots.png')} style={{width: 150, height: 50, resizeMode: 'contain',zIndex: -1}} />
            </View>
        </View>
    )
}