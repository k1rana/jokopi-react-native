import React from 'react';

import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import WelcomeImage from '../../assets/illustrations/welcome.svg';
import {Pressable, Text, View} from '../../utils/wrapper/nativewind';

const Welcome = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);
  if (auth.data.isLogin) {
    navigation.navigate('HomeDrawer');
  }

  return (
    <View className="flex-1 justify-center items-center font-bold px-7 py-2">
      <Text
        style={{fontSize: 70, lineHeight: 80, letterSpacing: -3}}
        className="font-global text-black font-bold w-full mb-4">
        Coffee for Everyone
      </Text>
      <WelcomeImage width={600} height={400} />
      <Pressable
        className="bg-[#6A4029] py-5 rounded-2xl w-full"
        onPress={() => navigation.navigate('HomeDrawer')}>
        <Text className="font-global text-center text-white text-lg font-bold">
          Get Started
        </Text>
      </Pressable>
    </View>
  );
};

export default Welcome;
