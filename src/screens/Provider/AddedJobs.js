import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'

import { selectUserId } from '../../redux/slice/authSlice';
import { api, color } from '../../config/config';
import styles from '../../config/styles';
import AnimatedLottieView from 'lottie-react-native';
import { Loading, noData } from '../../components/lottie';

export default function AddedJobs({ navigation }) {
    const userId = useSelector(selectUserId);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);

    const getJobs = async () => {
        setLoading(true);
        setEmpty(false);
        await axios.get(api + 'providerJobs/' + userId).then(res => {
            setJobs(res.data);
            if (res.data.length === 0) {
                setEmpty(true);
            }
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            setEmpty(true);
            alert('Something went wrong!');
        });
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '50%' }} />
            )
        } else {
            return (
                jobs.map((item, index) => (
                    <View key={index} style={[styles.shadow_sm, { backgroundColor: '#fff', marginVertical: '2%', borderRadius: 10 }]}>
                        <View style={[styles.row, { paddingVertical: '2%', paddingHorizontal: '2%', justifyContent: 'space-between' }]}>
                            <Image source={{ uri: 'https://rojgar.biz/' + item.image }} style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 10 }} />
                            <View style={{ width: '50%' }}>
                                <Text numberOfLines={1} style={[styles.bold, { fontSize: 16 }]}>{item.title}</Text>
                                <View style={styles.row}>
                                    <Ionicons name="location-sharp" size={16} color={color.red} />
                                    <Text>{item.location}</Text>
                                </View>
                                { item.status == 0 && <Text style={{color: 'blue'}}>In Review</Text>}
                                { item.status == 1 && <Text style={{color: 'green'}}>Listed</Text>}
                                { item.status == -1 && <Text style={{color: 'red'}}>Rejected</Text>}
                            </View>
                            <View>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Min - {item.min_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Max - {item.max_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>per month</Text>
                            </View>
                        </View>
                    </View>
                ))
            )
        }
    }

    useEffect(() => {
        getJobs();
    }, []);
    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>Added Jobs</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: '5%' }}>
                    {screen()}
                    {empty ?
                        <>
                            <AnimatedLottieView source={noData} autoPlay loop style={{ flex: 1, width: '80%', alignSelf: 'center', marginTop: '20%' }} />
                            <Text style={[styles.bold, styles.text_center]}>Sorry, No data found</Text>
                        </>
                        : null}
                </View>
            </ScrollView>
        </View>
    )
}