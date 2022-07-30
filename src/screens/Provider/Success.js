import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import styles from '../../config/styles';
import { success } from '../../components/lottie';
import { color } from '../../config/config';

export default function Success({navigation}) {
    return (
        <View style={[styles.container, { justifyContent: 'center' }]}>
            <View>
                <Text style={[styles.bold, styles.text_center, { color: 'green', fontSize: 16 }]}>Your Job Requirment Submited Successfully</Text>
            </View>
            <AnimatedLottieView style={{ width: '100%', alignSelf: 'center' }} autoPlay loop={false} source={success} />
            <View>
                <TouchableOpacity style={[styles.btn_outline, { paddingHorizontal: '10%', alignSelf: 'center' }]} onPress={() => navigation.replace('AddJob')}>
                    <Text style={[styles.bold, styles.text_center, { color: color.red, fontSize: 16 }]}>Add New Job</Text>
                </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', bottom: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '25%', right: '-40%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '2%', left: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 150, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}