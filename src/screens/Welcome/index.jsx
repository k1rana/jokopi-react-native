import React from 'react';

import {useNavigation} from '@react-navigation/native';

import WelcomeImage from '../../assets/illustrations/welcome.svg';
import {Pressable, Text, View} from '../../utils/wrapper/nativewind';

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center font-bold px-7 py-2">
      <Text
        style={{fontSize: 70, lineHeight: 80}}
        className="font-global text-black tracking-[-2] font-bold w-full mb-4">
        Coffee for Everyone
      </Text>
      <WelcomeImage width={600} height={400} />
      <Pressable
        className="bg-[#6A4029] py-5 rounded-2xl w-full"
        onPress={() => navigation.navigate('MyDrawer')}>
        <Text className="font-global text-center text-white text-lg font-bold">
          Get Started
        </Text>
      </Pressable>
    </View>
  );
};

export default Welcome;
