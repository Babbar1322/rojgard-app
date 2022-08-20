import React, {useState} from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Keyboard, Alert } from 'react-native';
import styles from '../../config/styles';
import Logo from '../../../assets/Logo.png';
import { color, api } from '../../config/config';
import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';

export default function ForgotPassword({ route, navigation }) {

    const [userId, setUserId] = useState("");
    const [visible, setVisible] = useState(false);
    const [exist, setExist] = useState(false);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [verified, setVerified] = useState(false);
    const [password, setPassword] = useState(null);

    const [loading, setLoading] = useState(false);

    const forgot = async () => {
        setLoading(true);
        Keyboard.dismiss();
  
        await axios.post(api + 'forgotPassword', {
            userId: userId, exist: exist, email: email, phone: phone, verified: verified, password: password
        }).then(res => {
            if(res.data === 'Exist'){
                setExist(true);
                setVisible(true);
            }
            if(res.data === 'Verified'){
                setVerified(true);
            }
            if(res.data === 'Changed'){
                navigation.goBack();
            }
        }).catch(err => {
            console.log(err);
            if(err.toString().endsWith('406')){
                Alert.alert('Sorry', "You can't Reset your password, because we disabled your account for some reasons.");
            }
            if(err.toString().endsWith('405')){
                Alert.alert('Not Found', 'Account not Found');
            }
            if(err.toString().endsWith('400')){
                Alert.alert('Invalid Details', "Your Email or Phone Doesn't matched!");
            }
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
                    <TextInput style={[styles.input, styles.shadow]} placeholder='Enter UserID' autoCapitalize='characters' autoCorrect={false} value={userId} editable={!exist} onChangeText={(e) => setUserId(e)} />

                    {visible && <TextInput style={[styles.input, styles.shadow]} placeholder='Enter Email' autoCapitalize='none' keyboardType='email-address' autoComplete='email' autoCorrect={false} value={email} editable={!verified} onChangeText={(e) => setEmail(e)} />}
                    {visible && <TextInput style={[styles.input, styles.shadow]} placeholder='Enter Phone' autoCapitalize='none' value={phone} keyboardType='number-pad' autoComplete='tel' autoCorrect={false} editable={!verified} onChangeText={(e) => setPhone(e)} />}
                    {verified && <TextInput style={[styles.input, styles.shadow]} placeholder='Create New Password' secureTextEntry onChangeText={(e) => setPassword(e)} />}

                    <TouchableOpacity style={[styles.btn]} activeOpacity={0.5} onPress={forgot}>
                        <Text style={[styles.bold, styles.text_center, { color: color.white, fontSize: 15 }]}>Next Step</Text>
                    </TouchableOpacity>
                </View>
            )
        }
     }
    return (
        <View style={[styles.container]}>
            <Image source={Logo} style={[styles.logo, { alignSelf: 'center' }]} />

            <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: color.red, }]}>Reset your password</Text>

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