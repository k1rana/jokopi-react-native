import React from 'react';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import {Pressable, Text, View} from '../../utils/wrapper/nativewind';

const History = () => {
  const nav = useNavigation();
  return (
    <View className="flex-1 bg-[#ECECEC]">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()}>
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          Order History
        </Text>

        <Text></Text>
      </View>
    </View>
  );
};

export default History;
