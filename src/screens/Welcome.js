import React, { useEffect } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../config/styles';
import WelcomeVector from '../../assets/Images/Welcome.png';
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
            <View style={[styles.container, { paddingHorizontal: '7%' }]}>
                <Text style={[styles.text_center, styles.h1, { marginVertical: '15%' }]}>Which service are you looking for?</Text>
                <Image source={WelcomeVector} style={{ width: '80%', resizeMode: 'contain', alignSelf: 'center' }} />
                <View style={{ position: 'absolute', bottom: '20%', width: '100%', alignSelf: 'center' }}>
                    <TouchableOpacity activeOpacity={0.5} style={[styles.row, styles.welcome_btn]} onPress={() => navigation.navigate('Login')}>
                        <Text style={[styles.bold, { color: color.white }]}>Seeking for Job</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={{ marginVertical: '5%' }}>
                        <Text style={[styles.bold, styles.text_center, { color: color.red }]}>OR</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.5} style={[styles.row, styles.welcome_btn, {
                        backgroundColor: '#00000000', borderColor: color.red, borderWidth: 2
                    }]}
                        onPress={() => navigation.navigate('ProviderLogin')}>
                        <Text style={[styles.bold, { color: color.red }]}>Seeking for Employee</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color={color.red} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}