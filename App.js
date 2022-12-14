import React, { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import * as PushNotifications from 'expo-notifications';

/**** Navigations ****/
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/**** Screens ****/
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Emplyee/Home';
import Login from './src/screens/Emplyee/Login';
import Signup from './src/screens/Emplyee/Signup';
import ForgotPassword from './src/screens/Emplyee/ForgotPassword';
import CompleteProfile from './src/screens/Emplyee/CompleteProfile';
import Jobs from './src/screens/Emplyee/Jobs';
import Profile from './src/screens/Emplyee/Profile';
import Refer from './src/screens/Emplyee/Refer';
import ActivateId from './src/screens/Emplyee/ActivateId';
import LevelIncome from './src/screens/Emplyee/LevelIncome';
import Downline from './src/screens/Emplyee/Downline';
import Splash from './src/components/Splash';
import NoNetwork from './src/components/NoNetwork';
import JobDetails from './src/screens/Emplyee/JobDetails';
import Support from './src/screens/Emplyee/Support';
import EditProfile from './src/screens/Emplyee/EditProfile';
import AppliedJobs from './src/screens/Emplyee/AppliedJobs';
import Tickets from './src/screens/Emplyee/Tickets';
import Guest from './src/screens/Emplyee/Guest';
import Documents from './src/screens/Emplyee/Documents';

/**** Provider Screens ****/
import ProviderLogin from './src/screens/Provider/ProviderLogin';
import ProviderSignup from './src/screens/Provider/ProviderSignup';
import AddJob from './src/screens/Provider/AddJob';
import Success from './src/screens/Provider/Success';
import AddedJobs from './src/screens/Provider/AddedJobs';
import ProviderUpdate from './src/screens/Provider/ProviderUpdate';

/**** Components ****/
import { color } from './src/config/config';
import { store } from './src/redux/store';
import './src/config/IgnoreWarnings';
import Linking from './src/config/Linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifications from './src/components/Notifications';

/**** Constants ****/
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen options={{
        tabBarActiveTintColor: color.red,
        tabBarInactiveTintColor: color.black,
        tabBarIcon: ({ focused, tintColor }) => (
          focused ? <Ionicons name="home" size={24} color={color.red} /> :
            <Ionicons name="home-outline" size={24} color={color.black} />
        )
      }} name='Home' component={Home} />
      <Tab.Screen options={{
        tabBarActiveTintColor: color.red,
        tabBarInactiveTintColor: color.black,
        tabBarIcon: ({ focused, tintColor }) => (
          focused ? <Ionicons name="briefcase" size={24} color={color.red} /> :
            <Ionicons name="briefcase-outline" size={24} color={color.black} />
        )
      }} name='Jobs' component={Jobs} />
      <Tab.Screen options={{
        tabBarActiveTintColor: color.red,
        tabBarInactiveTintColor: color.black,
        tabBarIcon: ({ focused, tintColor }) => (
          focused ? <Ionicons name="share-social" size={24} color={color.red} /> :
            <Ionicons name="share-social-outline" size={24} color={color.black} />
        )
      }} name='Refer' component={Refer} />
      <Tab.Screen options={{
        tabBarActiveTintColor: color.red,
        tabBarInactiveTintColor: color.black,
        tabBarIcon: ({ focused, tintColor }) => (
          focused ? <Ionicons name="person" size={24} color={color.red} /> :
            <Ionicons name="person-outline" size={24} color={color.black} />
        )
      }} name='Profile' component={Profile} />
    </Tab.Navigator>
  )
}

PushNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await PushNotifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await PushNotifications.requestPermissionsAsync();
    finalStatus = status;
    console.log("existingStatus", existingStatus)
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    console.log("finalStatus", finalStatus)
    return;
  }
  token = (await PushNotifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    await PushNotifications.setNotificationChannelAsync('default', {
      name: 'default',
      showBadge: true,
      importance: PushNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FE9018',
    });
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token =>
      AsyncStorage.setItem('pushToken', token)
    );

    notificationListener.current = PushNotifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = PushNotifications.addNotificationResponseReceivedListener(response => {
      const { notification: { request: { content: { data: { screen } } } } } = response
      if (screen) {
        props.navigation.navigate(screen)
      }
    });

    return () => {
      PushNotifications.removeNotificationSubscription(notificationListener.current);
      PushNotifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer linking={Linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Splash'>
          {/**** User Routes ****/}
          <Stack.Screen name='Splash' component={Splash} />
          <Stack.Screen name='Welcome' component={Welcome} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Signup' component={Signup} />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
          <Stack.Screen name='CompleteProfile' component={CompleteProfile} />
          <Stack.Screen name='ActivateId' component={ActivateId} />
          <Stack.Screen name='LevelIncome' component={LevelIncome} />
          <Stack.Screen name='Downline' component={Downline} />
          <Stack.Screen name='JobDetails' component={JobDetails} />
          <Stack.Screen name='Support' component={Support} />
          <Stack.Screen name='EditProfile' component={EditProfile} />
          <Stack.Screen name='AppliedJobs' component={AppliedJobs} />
          <Stack.Screen name='Tickets' component={Tickets} />
          <Stack.Screen name='Guest' component={Guest} />
          <Stack.Screen name='Documents' component={Documents} />
          <Stack.Screen name='NoNetwork' component={NoNetwork} />
          <Stack.Screen name='Notifications' component={Notifications} />
          <Stack.Screen name='HomeTab' component={HomeTab} />
          {/**** Provider Routes ****/}
          <Stack.Screen name='ProviderLogin' component={ProviderLogin} />
          <Stack.Screen name='ProviderSignup' component={ProviderSignup} />
          <Stack.Screen name='AddJob' component={AddJob} />
          <Stack.Screen name='Success' component={Success} />
          <Stack.Screen name='AddedJobs' component={AddedJobs} />
          <Stack.Screen name='ProviderUpdate' component={ProviderUpdate} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}