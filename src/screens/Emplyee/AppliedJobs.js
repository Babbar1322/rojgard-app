import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { Loading, noData } from '../../components/lottie';
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
        }).catch(err => {
            console.log(err);
        });
        setLoading(false);
    }
    
    const search = async (data) => {
        setLoading(true);
        await axios.get(api + 'searchAppliedJobs/?userId='+userId+'&data='+data).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        });
        setLoading(false);
    }

    const screen = () => {
        if(loading){
            return(
                <AnimatedLottieView source={Loading} autoPlay loop style={{flex: 1, width: '30%', alignSelf: 'center', marginTop: '30%'}} />
            )
        } else {
            return(
                <>
                    {data.map((item,  index) => (
                        <TouchableOpacity key={index} style={[styles.shadow_sm, { backgroundColor: '#fff', marginVertical: '2%', borderRadius: 10 }]}>
                        <View style={[styles.row, { paddingVertical: '2%', paddingHorizontal: '2%', justifyContent: 'space-between' }]}>
                            <Image source={{ uri: 'https://rojgar.biz/'+item.job.image }} style={{ width: '20%', height: '100%', resizeMode: 'contain', borderRadius: 10 }} />
                            <View style={{width: '50%'}}>
                                <Text numberOfLines={1} style={[styles.bold, { fontSize: 16 }]}>{item.job.title}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 16 }}>{item.provider.name}</Text>
                                <View style={styles.row}>
                                    <Ionicons name="location-sharp" size={16} color={color.red} />
                                    <Text>{item.job.location}</Text>
                                </View>
                                {item.status == 'Accepted' && <Text style={{color: 'green'}}>Approved</Text>}
                                {item.status == 'Rejected' && <Text style={{color: 'red'}}>Rejected</Text>}
                                {item.status == 'Pending' && <Text style={{color: 'blue'}}>Pending</Text>}
                            </View>
                            <View>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Min - {item.job.min_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>Max - {item.job.max_salary}</Text>
                                <Text style={[styles.bold, { fontSize: 12, textAlign: 'right' }]}>per month</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    ))}
                    {data.length === 0 && !loading ? 
                    <AnimatedLottieView source={noData} autoPlay loop style={{flex: 1, alignSelf: 'center', width: '90%', marginTop: '20%'}} /> : null}
                    </>
            )
        }
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
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
            <View style={{paddingHorizontal: '5%'}}>
                <TextInput style={[styles.input, styles.shadow_sm]} placeholder='Search' onChangeText={search} />
                {screen()}
                </View>
            </ScrollView>
        </View>
    )
}