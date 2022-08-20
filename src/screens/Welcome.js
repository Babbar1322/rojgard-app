import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../config/styles';
import { color } from '../config/config';
import { MaterialIcons } from '@expo/vector-icons';

export default function Welcome({ navigation }) {

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

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, [BackHandler]);

    return (
        <>
            <View style={styles.container}>
                <LinearGradient colors={[color.red, color.grey]} start={[0, 0]} end={[1, 0.5]} style={{flex: 1, paddingHorizontal: '7%'}}>
                <Text style={[styles.text_center, styles.bold, { marginTop: '15%', color: '#fff', fontSize: 35 }]}>Welcome to Rojgar</Text>
                <Text style={[styles.text_center, styles.h1, styles.bold, { marginVertical: '15%', color: '#fff' }]}>Which service are you looking for?</Text>
                <Text style={[styles.bold,styles.text_center, {color: '#fff'}]}>You can search for jobs or provide jobs.</Text>
                <View style={{ position: 'absolute', bottom: '20%', width: '100%', alignSelf: 'center' }}>
                    <TouchableOpacity activeOpacity={0.5} style={[styles.row, styles.welcome_btn, {
                        backgroundColor: '#00000000', borderColor: '#fff', borderWidth: 2
                    }]} onPress={() => navigation.navigate('Guest')}>
                        <Text style={[styles.bold, { color: color.white }]}>Seeking for Job</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={[styles.row, styles.justifyBetween, { marginVertical: '5%' }]}>
                        <View style={{height: 1, width: '40%', backgroundColor: '#fff'}}></View>
                        <Text style={[styles.bold, styles.text_center, { color: color.white }]}>OR</Text>
                        <View style={{height: 1, width: '40%', backgroundColor: '#fff'}}></View>
                    </View>
                    <TouchableOpacity activeOpacity={0.5} style={[styles.row, styles.welcome_btn, {
                        backgroundColor: '#00000000', borderColor: color.red, borderWidth: 2
                    }]} onPress={() => navigation.navigate('ProviderLogin')}>
                        <Text style={[styles.bold, { color: color.red }]}>Seeking for Employee</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color={color.red} />
                    </TouchableOpacity>
                </View>
                </LinearGradient>
            </View>
        </>
    )
}