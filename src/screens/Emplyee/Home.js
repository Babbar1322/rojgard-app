import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, ScrollView, Image, TextInput, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';

import styles from '../../config/styles';
import { Ionicons } from '@expo/vector-icons';
import { api, color } from '../../config/config';
import { selectName, selectIsActive, selectIsProfileCompleted } from '../../redux/slice/authSlice';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';

export default function Home({ navigation }) {
    const name = useSelector(selectName);
    const isActive = useSelector(selectIsActive);
    const profileStatus = useSelector(selectIsProfileCompleted);

    const [jobData, setJobData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getJobs = async () => {
        setLoading(true);
        await axios.get(api + 'getAllJobs').then(res => {
            setJobData(res.data.jobs);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    const handleBackPress = () => {
        if (!navigation.isFocused()) {
            return false;
        } else {
            Alert.alert('Exit!', 'Are you sure you want to Exit?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        }
    };

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '20%', alignSelf: 'center', marginTop: '10%' }} />
            )
        } else {
            return (
                jobData.map((item, index) => (
                    <TouchableOpacity key={index} style={[styles.shadow_sm, { backgroundColor: '#fff', marginVertical: '2%', borderRadius: 10 }]} onPress={() => navigation.navigate('JobDetails', { id: item.id})}>
                        <View style={[styles.row, { paddingVertical: '2%', paddingHorizontal: '2%', justifyContent: 'space-between' }]}>
                            <Image source={{ uri: 'https://rojgar.biz/'+item.image }} style={{ width: '20%', height: '100%', resizeMode: 'contain', borderRadius: 10 }} />
                            <View style={{width: '50%'}}>
                                <Text numberOfLines={1} style={[styles.bold, { fontSize: 16 }]}>{item.title}</Text>
                                <Text style={{ fontSize: 16 }}>{item.userId.name}</Text>
                                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                    <View style={styles.row}>
                                        <Ionicons name="location-sharp" size={16} color={color.red} />
                                        <Text>{item.location}</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Min - {item.min_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Max - {item.max_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>per month</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
                )
            )
        }
    }
    useEffect(() => {
        getJobs();

        if(profileStatus == 0){
            navigation.navigate('CompleteProfile');
        }

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: '5%' }}>
                    <Text style={[styles.h1, styles.bold, { marginVertical: '5%' }]}>Welcome {name}</Text>
                    {isActive == 1 ?
                        <Text style={[styles.bold, { color: 'green' }]}>Your Account is active</Text> :
                        <>
                            <Text style={[styles.bold, { color: 'red' }]}>Your Account is not active</Text>
                            <TouchableOpacity style={styles.btn_sm} onPress={() => navigation.navigate('ActivateId')}>
                                <Text style={[styles.text_center, { color: '#fff' }]}>Activate Now</Text>
                            </TouchableOpacity>
                        </>}
                    <Image source={require('../../../assets/Images/Banner.png')} style={{ width: '100%', resizeMode: 'contain', alignSelf: 'center' }} />

                    <View>
                        <View style={[styles.row, styles.justifyBetween]}>
                            <TouchableOpacity style={[styles.pill, styles.shadow_sm, { width: '45%' }]} onPress={() => navigation.navigate('Downline')}>
                                <Text style={[styles.bold, styles.text_center]}>Downline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pill, styles.shadow_sm, { width: '45%' }]} onPress={() => navigation.navigate('LevelIncome')}>
                                <Text style={[styles.bold, styles.text_center]}>Level Income</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.bold, { fontSize: 16 }]}>Suggested Jobs</Text>
                        {screen()}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}