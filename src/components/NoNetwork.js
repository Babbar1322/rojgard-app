import React from 'react';
import { View, Text } from 'react-native';
import styles from '../config/styles';
import AnimatedLottieView from 'lottie-react-native';
import { noInternet } from './lottie';
import { color } from '../config/config';

export default function NoNetwork() {
  return (
    <View style={[styles.container, styles.justifyCenter, {alignItems: 'center'}]}>
      <AnimatedLottieView style={{ width: '50%' }} autoPlay loop={false} source={noInternet} />
      <Text style={[styles.bold, styles.h1, {color: color.red}]}>No Network Found</Text>
      <Text style={[styles.bold, {color: color.red}]}>Please Check Your Settings</Text>
    </View>
  )
}