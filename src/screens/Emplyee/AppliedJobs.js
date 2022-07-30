import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { Loading } from '../../components/lottie';
import { api, color } from '../../config/config';

import styles from '../../config/styles';
import { selectUserId } from '../../redux/slice/authSlice';

export default function AppliedJobs({ navigation }) {
    const userId = useSelector(selectUserId);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const getAppliedJobs = async () => {
        setLoading(true);
        await axios.get(api + 'userAppliedJobs/' + userId).then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }
    useLayoutEffect(() => {
        getAppliedJobs();
    }, []);
    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>Applied Jobs</Text>
            </View>
            <Modal style={{ flex: 1 }} visible={loading} animationType="slide" transparent>
                <View style={[styles.justifyCenter, { backgroundColor: '#00000050', flex: 1 }]}>
                    <AnimatedLottieView source={Loading} autoPlay loop style={{ width: '20%', alignSelf: 'center' }} />
                </View>
            </Modal>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <View style={{paddingHorizontal: '5%'}}>
                    {data.map((item,  index) => (
                        <TouchableOpacity key={index} style={[styles.shadow_sm, { backgroundColor: '#fff', marginVertical: '2%', borderRadius: 10 }]}>
                        <View style={[styles.row, { paddingVertical: '2%', paddingHorizontal: '2%', justifyContent: 'space-between' }]}>
                            <Image source={{ uri: 'https://rojgar.biz/'+item.job.image }} style={{ width: '20%', height: '100%', resizeMode: 'contain', borderRadius: 10 }} />
                            <View style={{width: '50%'}}>
                                <Text numberOfLines={1} style={[styles.bold, { fontSize: 16 }]}>{item.job.title}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 16 }}>{item.provider.name}</Text>
                                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                    <View style={styles.row}>
                                        <Ionicons name="location-sharp" size={16} color={color.red} />
                                        <Text>{item.job.location}</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Min - {item.job.min_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Max - {item.job.max_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>per month</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}