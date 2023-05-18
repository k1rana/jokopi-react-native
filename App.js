import React, {useEffect} from 'react'; //import useEffect();

import SplashScreen from 'react-native-splash-screen'; //import SplashScreen

import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import Router from './src/router';

const App = () => {
  //   const theme = {
  //     ...DefaultTheme,
  //     colors: {
  //       ...DefaultTheme.colors,
  //       border: "transparent",
  //     }
  //   }
  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.

    async function initRegisterFcm() {
      try {
        await notifee.requestPermission(); // request permission

        const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
        if (!isRegistered) {
          await messaging().registerDeviceForRemoteMessages();
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function initializeNotificationChannels() {
      // Define your notification channel(s)
      const channels = [
        {
          id: 'new-order',
          name: 'New Order',
          importance: AndroidImportance.HIGH,
        },
        {
          id: 'general',
          name: 'General',
          importance: AndroidImportance.HIGH,
        },
        {
          id: 'promo',
          name: 'Promo',
          importance: AndroidImportance.HIGH,
        },
        // Add more channels if needed
      ];
      // Create the notification channel(s)
      await Promise.all(
        channels.map(async channel => await notifee.createChannel(channel)),
      );
    }
    initRegisterFcm();
    initializeNotificationChannels();
  }, []);

  return <Router />;
};
export default App;
