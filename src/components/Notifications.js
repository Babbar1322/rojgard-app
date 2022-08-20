import React, {useState, useEffect} from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../config/styles';
import axios from 'axios';
import { selectUserId } from '../redux/slice/authSlice';
import { useSelector } from 'react-redux';
import { api, color } from '../config/config';
import Groups from '../config/Groups';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from './lottie';

export default function Notifications({ navigation }) {
    const userId = useSelector(selectUserId);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getNotifications = () => {
        setLoading(true);
        axios.get(api + 'getNotifications/' + userId).then(res => {
            setData(Groups(res.data));
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    const renderItem = ({ item, index }) => {
        if (item.type && item.type === 'day') {
            return (
                <View key={index} style={[styles.row, styles.justifyCenter, {marginVertical: '2%'}]}>
                    <View style={{ height: 1, backgroundColor: color.grey, width: '30%' }}></View>
                    <Text key={item.created_at} style={[styles.bold, { color: color.grey, fontSize: 12, marginHorizontal: '5%' }]}>{item.date}</Text>
                    <View style={{ height: 1, backgroundColor: color.grey, width: '30%' }}></View>
                </View>
            )
        } else {
            return(
                <TouchableOpacity key={index} style={[styles.listItem, styles.row, styles.shadow_sm]}>
                <View style={{ marginHorizontal: '3%' }}>
                    <Ionicons name='notifications-outline' color={color.red} size={40} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.bold, { color: '#000000' }]}>{item.title}</Text>
                    <Text style={[styles.bold, { color: '#000000' }]}>{item.message}</Text>
                </View>
            </TouchableOpacity>
            )
        }
    }

    const screen = () => {
        if(loading){
            return(
                <AnimatedLottieView source={Loading} autoPlay loop style={{width: '20%', alignSelf: 'center', marginTop: '30%'}} />
            )
        } else {
            return(
                <FlatList
                data={data}
                // inverted
                keyExtractor={(item, index) => index.toString()}
                style={{ flex: 1, paddingHorizontal: '5%' }}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem} />
            )
        }
    }

    useEffect(() => {
        getNotifications();
    }, []);
    return (
        <View style={styles.container}>
            <View style={[styles.row, { paddingVertical: '4%', paddingHorizontal: '5%' }]}>
                <Ionicons name='chevron-back' size={35} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]} onPress={() => navigation.goBack()}>Notifications</Text>
            </View>
            {screen()}
        </View>
    )
}