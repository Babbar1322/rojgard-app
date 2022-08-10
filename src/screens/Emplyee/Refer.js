import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useSelector } from 'react-redux';
import styles from '../../config/styles';
import ReferVector from '../../../assets/Images/Refer.png';
import { selectUserId } from '../../redux/slice/authSlice';

export default function Refer() {
    const userId = useSelector(selectUserId);
    const share = async () => {
        await Share.share({
            "message": "https://rojgar.page.link/?link=https://rojgar.biz/signup/" + userId + "&apn=com.rojgar"
        })
    }
    return (
        <View style={styles.container}>
            <View style={{paddingVertical: '5%'}}>
                <Text style={[styles.bold, styles.text_center, {fontSize: 16}]}>Refer</Text>
                <Image source={ReferVector} style={{width: '100%', height: '65%', resizeMode: 'contain'}} />
                <View style={{paddingHorizontal: '5%'}}>
                    <Text style={[styles.h1, styles.bold, {maxWidth: '80%', fontSize: 25}]}>Refer Rojgar to your friends & help them in finding jobs.</Text>
                </View>
                <TouchableOpacity style={[styles.btn, {alignSelf: 'center', paddingHorizontal: '20%', marginVertical: '5%'}]} onPress={share}>
                    <Text style={[styles.bold, styles.text_center, {color: '#fff'}]}>Refer Now</Text>
                </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', bottom: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '-30%', right: '-5%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: '-2%', right: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 150, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}