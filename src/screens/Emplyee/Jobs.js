import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import styles from '../../config/styles';
import { api, color, SW } from '../../config/config';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';

export default function Jobs({ navigation }) {
    const [jobData, setJobData] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async (data) => {
        setLoading(true);
        await axios.get(api + 'searchJob/?data=' + data).then(res => {
            setJobData(res.data.jobs);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log(err);
            alert('Something went wrong!');
        });
    }

    const getJob = async () => {
        setLoading(true);
        await axios.get(api + 'getAllJobs').then(res => {
            setJobData(res.data.jobs);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '20%', alignSelf: 'center', marginTop: '20%' }} />
            )
        } else {
            return (
                jobData.map((item, index) => (
                    <TouchableOpacity key={index} style={[styles.shadow_sm, { backgroundColor: '#fff', marginVertical: '2%', borderRadius: 10 }]} onPress={() => navigation.navigate('JobDetails', { id: item.id})}>
                        <View style={[styles.row, { paddingVertical: '2%', paddingHorizontal: '2%', justifyContent: 'space-between' }]}>
                            <Image source={{ uri: 'https://rojgar.biz/'+item.image }} style={{ width: '20%', height: '100%', resizeMode: 'contain', borderRadius: 10 }} />
                            <View style={{width: '50%'}}>
                                <Text numberOfLines={1} style={[styles.bold, { fontSize: 16 }]}>{item.title}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 16 }}>{item.userId.name}</Text>
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
        getJob();
    }, []);
    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: '5%', paddingVertical: '5%' }}>
                <Text style={[styles.bold, { textAlign: 'center', fontSize: 16 }]}>Jobs</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1}}>
                <View style={{paddingHorizontal: '5%'}}>
                <TextInput style={[styles.input, styles.shadow_sm]} placeholder='Search' onChangeText={(data) => search(data)} />
                {screen()}
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', top: '30%', right: '-50%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: SW / 8, left: '-40%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
        </View>
    )
}