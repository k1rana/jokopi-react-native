import React from 'react';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import {
  Pressable,
  Text,
  View,
} from '../../utils/wrapper/nativewind';

const PrivacyPolicy = () => {
  const nav = useNavigation();
  return (
    <View className="flex-1 bg-#F5F5F8">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.navigate('Home')}>
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          Privacy Policy
        </Text>

        <Text></Text>
      </View>
    </View>
  );
};

export default PrivacyPolicy;
