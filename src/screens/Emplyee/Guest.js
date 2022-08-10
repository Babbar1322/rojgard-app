import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from '../../config/styles';
import { api, color } from '../../config/config';
import { Loading } from '../../components/lottie';

export default function Guest({ navigation }) {

    const [jobData, setJobData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getJobs = () => {
        setLoading(true);
        axios.get(api + 'getAllJobs').then(res => {
            setJobData(res.data.jobs);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '20%', alignSelf: 'center', marginTop: '10%' }} />
            )
        } else {
            return (
                jobData.map((item, index) => (
                    <TouchableOpacity key={index} style={[styles.shadow_sm, { backgroundColor: '#fff', marginVertical: '2%', borderRadius: 10 }]} onPress={() => navigation.navigate('JobDetails', { id: item.id })}>
                        <View style={[styles.row, { paddingVertical: '2%', paddingHorizontal: '2%', justifyContent: 'space-between' }]}>
                            <Image source={{ uri: 'https://rojgar.biz/' + item.image }} style={{ width: '20%', height: '100%', resizeMode: 'contain', borderRadius: 10 }} />
                            <View style={{ width: '50%' }}>
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
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: '5%' }}>
                    <Image source={require('../../../assets/Images/Banner.png')} style={{ width: '100%', resizeMode: 'contain', alignSelf: 'center' }} />

                    <View>
                        <Text style={[styles.bold, { fontSize: 16 }]}>Suggested Jobs</Text>
                        {screen()}
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.row, styles.justifyAround, {paddingVertical: '2%'}]}>
                <TouchableOpacity style={[styles.btn_sm, styles.shadow_sm, {width: '48%'}]} onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.bold, styles.text_center, {color: '#fff'}]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn_sm, styles.shadow_sm, {width: '48%'}]} onPress={() => navigation.navigate('Signup')}>
                    <Text style={[styles.bold, styles.text_center, {color: '#fff'}]}>Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}