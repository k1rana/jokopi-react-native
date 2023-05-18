/**
 * @format
 */
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';

import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import App from './App';
import {name as appName} from './app.json';

async function onMessageReceived(message) {
  console.log('fcm payload', message);
  const {android, title, subtitle, body} = message.notification;

  const bodyRandom = [
    "Don't miss out on limited offers! Get our exclusive specialty coffee packs, including a wide selection of coffee variants, at a special price.",
    'Good morning, coffee lovers! Enjoy your favorite coffee at a special price for the first purchase every day. Starting today, your life is blessed with delicious coffee.',
    "Are you a coffee lover? Don't miss our free coffee workshop this Saturday. Learn the art of brewing the perfect cup and taste the difference!",
    "Coffee enthusiasts, we've got good news for you! Starting today, all our new flavored coffee drinks are available in-store. Don't miss out!",
    "Don't miss out on limited-time offers! Get our exclusive coffee package, featuring a selection of premium coffee varieties, at a special price.",
    'Want to kickstart your day with a boost? Get an extra espresso shot for free with any coffee purchase. Visit our store now!',
  ];

  await notifee.displayNotification({
    android: {
      ...android,
      channelId: android.channelId || 'general',
      smallIcon: 'ic_notification',
      largeIcon: 'ic_launcher',
    },
    title: title || 'Hey Coffeeholic!',
    subtitle: subtitle || undefined,
    body: body || bodyRandom[Math.floor(Math.random() * bodyRandom.length)],
  });
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

AppRegistry.registerComponent(appName, () => App);
