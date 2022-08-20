import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { api } from '../../config/config';
import AnimatedLottieView from 'lottie-react-native';
import { Loading, success } from '../../components/lottie';
import styles from '../../config/styles';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../redux/slice/authSlice';

export default function JobDetails({ route, navigation }) {
    const userId = useSelector(selectUserId);
    const [jobId, setJobId] = useState(route.params.id);
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);

    const getJob = async () => {
        setLoading(true);
        await axios.get(api + 'getJobDetails/' + jobId).then(res => {
            setData(res.data[0]);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }).catch(err => {
            setLoading(false);
            alert('Something went wrong!');
        });
    }

    const apply = async () => {
        setLoading(true);
        setApplied(false);
        await axios.post(api + 'applyJob', {
            userId: userId, jobId: route.params.id
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setApplied(true);
            }
        }).catch(err => {
            setLoading(false);
            if (err.toString().endsWith('400')) {
                return Alert.alert('Sorry', 'Your Profile is not completed yet!');
            }
            if (err.toString().endsWith('405')) {
                return Alert.alert('Sorry', 'You have already applied for this job!');
            }
            console.log(err);
            alert('Something went wrong!')
        })
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '40%' }} />
            )
        } else {
            return (
                applied ?
                    <>
                        <AnimatedLottieView source={success} autoPlay loop={false} style={{ flex: 1, width: '50%', alignSelf: 'center', marginTop: '30%' }} />
                        <Text style={[styles.bold, styles.text_center, { color: 'green', marginTop: '10%' }]}>Applied For Job Successfully</Text>
                    </> :
                    <View>
                        <View style={[styles.row, styles.shadow_sm, styles.detailsView]}>
                            <Image source={{ uri: 'https://rojgar.biz/' + data.image }} style={{ width: 100, height: 100, resizeMode: 'contain', borderRadius: 10 }} />
                            <View style={{ marginLeft: '5%' }}>
                                <Text style={[styles.bold, styles.h1, { maxWidth: '90%' }]}>{data.title}</Text>
                                <Text style={[styles.bold, { maxWidth: '100%' }]}>Offered by: {data.provider[0].name}</Text>
                                <Text style={[styles.bold]}>{data.location}</Text>
                            </View>
                        </View>
                        <View style={[styles.shadow_sm, styles.detailsView]}>
                            <Text style={[styles.bold]}>Vacancies: {data.employees} Employees</Text>
                            <Text style={[styles.bold]}>Salary: {data.min_salary}-{data.max_salary} per month</Text>
                            <Text style={[styles.bold]}>Job Location: {data.location}</Text>
                        </View>
                        <View style={[styles.shadow_sm, styles.detailsView]}>
                            <Text style={[styles.bold]}>Brief:</Text>
                            <Text style={[]}>{data.description}</Text>
                        </View>
                        {userId === null ?
                            <View style={[styles.row, styles.justifyAround, { paddingVertical: '2%' }]}>
                                <TouchableOpacity style={[styles.btn_sm, styles.shadow_sm, { width: '48%' }]} onPress={() => navigation.navigate('Login')}>
                                    <Text style={[styles.bold, styles.text_center, { color: '#fff' }]}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn_sm, styles.shadow_sm, { width: '48%' }]} onPress={() => navigation.navigate('Signup')}>
                                    <Text style={[styles.bold, styles.text_center, { color: '#fff' }]}>Signup</Text>
                                </TouchableOpacity>
                            </View> :
                            <TouchableOpacity style={[styles.btn, { alignSelf: 'center', paddingHorizontal: '5%', marginVertical: '5%' }]} activeOpacity={0.5} onPress={apply}>
                                <Text style={[styles.bold, styles.text_center, { color: '#fff' }]}>Apply Now</Text>
                            </TouchableOpacity>}
                    </View>
            )
        }
    }

    useEffect(() => {
        if (route.params) {
            setJobId(route.params.id);
        }
        getJob();
    }, []);
    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>Job Details</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                {screen()}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '-25%', right: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: '-2%', right: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 200, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}