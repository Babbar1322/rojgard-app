import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loading, success } from '../../components/lottie';
import styles from '../../config/styles';
import axios from 'axios';
import Logo from '../../../assets/Logo.png';
import { color, api } from '../../config/config';
import AnimatedLottieView from 'lottie-react-native';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../redux/slice/authSlice';

export default function ProviderSignup({ navigation }) {
   const dispatch = useDispatch();

   const [pushToken, setPushToken] = useState(null);

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [password, setPassword] = useState('');

   const [loading, setLoading] = useState(false);
   const [registerSuccess, setRegisterSuccess] = useState(false);

   const onSignup = async () => {
      setLoading(true);
      setRegisterSuccess(false);
      Keyboard.dismiss();
      if (!name || !email || !phone || !password) {
         setLoading(false);
         return alert('Please Check All Feilds!');
      };
      await axios.post(api + 'register', {
         "name": name, "email": email, "phone": phone, "password": password, "role": "2", token: pushToken
      }).then(res => {

         if (res.status === 200) {
            setRegisterSuccess(true);
            const data = res.data;

            AsyncStorage.setItem('@user', JSON.stringify(data.user));
            const user = {
               isLoggedIn: true,
               email: data.user.email,
               userId: data.user.userId,
               phone: data.user.phone,
               name: data.user.name,
               userRole: data.user.role,
            }
            dispatch(setLogin(user));
            setTimeout(() => {
               setLoading(false);
               navigation.replace('AddJob');
            }, 700);
         }
      }).catch(err => {
         setLoading(false);
         alert("Something went wrong!");
         if(err.toString().endsWith('405')){
            alert('Email or Phone already exist');
         }
         console.log(err);
      });
   }

   const screen = () => {
      if (loading) {
         return (
            <AnimatedLottieView source={registerSuccess ? success : Loading} loop autoPlay style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '25%' }} />
         )
      } else {
         return(
         <View style={{ paddingHorizontal: '7%' }}>
            <TextInput
               style={[styles.input, styles.shadow]}
               placeholder='Full Name'
               autoComplete='off'
               autoCapitalize='words'
               onChangeText={(e) => setName(e)} />
            <TextInput
               style={[styles.input, styles.shadow]}
               placeholder='Email'
               textContentType='emailAddress'
               keyboardType='email-address'
               autoCapitalize='none'
               autoCorrect={false}
               autoCompleteType='email'
               onChangeText={(e) => setEmail(e)} />
            <TextInput
               style={[styles.input, styles.shadow]}
               placeholder='Phone Number'
               keyboardType='number-pad'
               onChangeText={(e) => setPhone(e)} />
            <TextInput
               style={[styles.input, styles.shadow]}
               placeholder='Create Password'
               secureTextEntry
               onChangeText={(e) => setPassword(e)} />

            <TouchableOpacity style={[styles.btn_outline, { marginTop: '10%' }]} activeOpacity={0.5} onPress={onSignup}>
               <Text style={[styles.bold, styles.text_center, { color: color.red, fontSize: 15 }]}>Signup</Text>
            </TouchableOpacity>
         </View>
         )
      }
   }

   useEffect(() => {
      async function setToken(){
          const token = await AsyncStorage.getItem('pushToken');
          setPushToken(token);
      };
      setToken();
  }, []);

   return (
      <View style={[styles.container]}>
         <Image source={Logo} style={[styles.logo, { alignSelf: 'center' }]} />

         <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: color.red, }]}>Create a new Provider account</Text>

         <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
            {screen()}
            <View>
               <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ProviderLogin')}>
                  <Text style={{ marginVertical: '4%', fontWeight: '500', fontSize: 15, textAlign: 'center' }}>Already a Provider? {"\n"} Login</Text>
               </TouchableOpacity>
            </View>
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
   );
};