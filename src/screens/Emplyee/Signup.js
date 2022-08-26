import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLottieView from 'lottie-react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { Loading, success } from '../../components/lottie';
import styles from '../../config/styles';
import Logo from '../../../assets/Logo.png';
import { color, api } from '../../config/config';
import { setLogin } from '../../redux/slice/authSlice';

export default function Signup({ route, navigation }) {
   const dispatch = useDispatch();
   const [pushToken, setPushToken] = useState(null);

   const [sponsorId, setSponsorId] = useState("");
   const [sponsorData, setSponsorData] = useState(null);
   const [sponsorErr, setSponsorErr] = useState(null);
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [password, setPassword] = useState('');

   const [loading, setLoading] = useState(false);
   const [registerSucess, setRegisterSucess] = useState(false);

   const onSignup = async () => {
      setLoading(true);
      Keyboard.dismiss();
      if (!name || !email || !phone || !password || sponsorErr || !sponsorId) {
         setLoading(false);
         return alert('Please Check All Feilds!');
      };

      await axios.post(api + 'register', {
         "sponsorId": sponsorId, "name": name, "email": email, "phone": phone, "password": password, "role": "1", token: pushToken
      }).then(res => {
         if (res.status === 200) {
            setRegisterSucess(true);
            const data = res.data;

            AsyncStorage.setItem('@user', JSON.stringify(data.user));
            const user = {
               isLoggedIn: true,
               email: data.user.email,
               userId: data.user.userId,
               phone: data.user.phone,
               name: data.user.name,
               refererId: data.user.sponsorId,
               userRole: data.user.role,
               isActive: data.user.isActive,
               profileStatus: data.profileStatus,
               isProfileCompleted: data.user.profileStatus
            }
            dispatch(setLogin(user));
            setTimeout(() => {
               setLoading(false);
               navigation.replace('HomeTab');
            }, 700);
         }
      }).catch(err => {
         setLoading(false);
         if(err.toString().endsWith('405')){
            alert('Email or Phone already exist!');
            return;
         }
         alert('Somthing went wrong');
      });
   }

   const handleSponsor = async () => {
      await axios.get(api + 'checkSponsor/?sponsorId=' + sponsorId).then(res => {
         if(res.data.user == null){
            setSponsorErr(true);
            return;
         } else {
            setSponsorData(res.data);
         }
      }).catch(err => {
         console.log(err);
      });
   }

   const screen = () => {
      if (loading) {
         return (
            <AnimatedLottieView source={registerSucess ? success : Loading} loop autoPlay style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '25%' }} />
         )
      } else {
         return (
            <>
               <View style={{ paddingHorizontal: '7%' }}>
                  <Text
                     style={[styles.bold, { fontSize: 12 }]}>If You Don't Have Sponsor ID. Use RG1234</Text>
                  <TextInput
                     style={[styles.input, styles.shadow]}
                     placeholder='Sponsor ID'
                     onChangeText={(e) => setSponsorId(e)}
                     onBlur={handleSponsor}
                     value={sponsorId}
                     onFocus={() => {
                        setSponsorData(null);
                        setSponsorErr(null)
                     }}
                     autoCapitalize={'characters'} />
                  {sponsorData ?
                     <Text style={[styles.bold, { fontSize: 12, color: 'green' }]}>Sponsor Name: {sponsorData.user}</Text>
                     : null}
                  {sponsorErr ?
                     <Text style={[styles.bold, { fontSize: 12, color: 'red', textAlign: 'right' }]}>Please Enter Valid Sponsor ID</Text>
                     : null}
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

                  <TouchableOpacity style={[styles.btn, { marginTop: '5%' }]} activeOpacity={0.5} onPress={onSignup}>
                     <Text style={[styles.bold, styles.text_center, { color: color.white, fontSize: 15 }]}>Signup</Text>
                  </TouchableOpacity>
               </View>
               <View>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Login')}>
                     <Text style={{ marginVertical: '4%', fontWeight: '500', fontSize: 15, textAlign: 'center' }}>Already Have An Account? {"\n"} Login</Text>
                  </TouchableOpacity>
               </View>
            </>
         )
      }
   }

   useEffect(() => {
         AsyncStorage.getItem('pushToken', (err, res) => {
            setPushToken(res);
         });
      if(route.params){
         setSponsorId(route.params.id);
         axios.get(api + 'checkSponsor/?sponsorId=' + route.params.id).then(res => {
            if(res.data.user == null){
               setSponsorErr(true);
               return;
            } else {
               setSponsorData(res.data);
            }
         }).catch(err => {
            console.log(err);
         });
      }
   });

   return (
      <View style={[styles.container]}>
         <Image source={Logo} style={[styles.logo, { alignSelf: 'center' }]} />

         <Text style={[styles.h1, styles.bold, styles.text_center, { marginBottom: '10%', color: color.red, }]}>Create a new account</Text>

         <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
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
   );
};