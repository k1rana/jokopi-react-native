import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import {n_f} from '../../utils/helpers';
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const DeliveryMethod = () => {
  const nav = useNavigation();
  const [methodSelected, setMethod] = useState('');

  const methods = [
    {id: '1', name: 'Door delivery'},
    {id: '2', name: 'Pick up at store'},
    {id: '3', name: 'Dine in'},
  ];

  return (
    <View className="flex-1 bg-[#F2F2F2]">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()}>
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          Checkout
        </Text>

        <Text></Text>
      </View>
      <View className="px-8 flex-1">
        <Text className="font-global text-black font-black text-4xl mt-3">
          Delivery
        </Text>
        <View className="flex-row justify-between mt-6 mb-3">
          <Text className="font-global text-black font-black text-base">
            Address details
          </Text>
          <Pressable>
            <Text className="font-global text-primary">change</Text>
          </Pressable>
        </View>
        <View className="bg-white rounded-2xl px-4 py-4">
          <TextInput
            value="Iskandar Street"
            className="font-global text-black py-1 font-medium text-base border-b border-[#BABABA]"
          />
          <TextInput
            multiline
            numberOfLines={2}
            value="Km 5 refinery road oppsite re
public road, effurun, Jakarta"
            className="font-global text-black py-1 text-base border-b border-[#BABABA]"
          />
          <TextInput
            value="+62 81348287878"
            className="font-global text-black py-1 text-base"
          />
        </View>

        <View className="flex-row justify-between mt-6 mb-3">
          <Text className="font-global text-black font-black text-base">
            Delivery methods
          </Text>
        </View>

        <View className="bg-white rounded-2xl px-4 py-4">
          {methods.map((item, idx) => (
            <View key={item.name}>
              <Pressable
                className="flex-row py-3 items-center"
                onPress={() => setMethod(item.id)}>
                <View
                  style={[
                    {
                      height: 24,
                      width: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                  className="border-primary">
                  {methodSelected === item.id && (
                    <View
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                      }}
                      className="bg-primary"
                    />
                  )}
                </View>
                <Text className="font-global text-black text-base ml-3">
                  {item.name}
                </Text>
              </Pressable>
              {idx + 1 < methods.length && (
                <View className="h-[0.5] bg-black mx-8"></View>
              )}
            </View>
          ))}
        </View>
      </View>
      <View className="px-8 mb-5">
        <View className="flex-row justify-between">
          <Text className="font-global text-black text-base">Total</Text>
          <Text className="font-global text-black text-xl font-bold">
            IDR {n_f(125000)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => nav.navigate('DeliveryMethod')}
          className={` bg-[#6A4029] py-5 rounded-2xl w-full flex-row justify-center mt-6`}>
          <Text
            className={`font-global text-center text-white text-base font-bold `}>
            Proceed to payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeliveryMethod;
