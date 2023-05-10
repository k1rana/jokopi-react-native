import React, {
  useMemo,
  useState,
} from 'react';

import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import BankIcon from '../../assets/icons/payment/bank.svg';
import CardIcon from '../../assets/icons/payment/card.svg';
import CodIcon from '../../assets/icons/payment/cod.svg';
import {
  deliveryMethods,
  n_f,
  sizeLongName,
} from '../../utils/helpers';
import {createTransaction} from '../../utils/https/transaction';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const Payment = () => {
  const price = useSelector(state => state.price);
  const cart = useSelector(state => state.cart);
  const nav = useNavigation();
  const controller = useMemo(() => new AbortController(), []);

  const [methodSelected, setMethod] = useState('');

  const methods = [
    {id: '1', name: 'Card', fee: 5000, Icon: CardIcon},
    {id: '2', name: 'Bank account', fee: 0, Icon: BankIcon},
    {id: '3', name: 'Cash on Delivery', fee: 0, Icon: CodIcon},
  ];

  const totalPrice =
    cart.list.reduce(
      (accumulator, currentItem) =>
        accumulator +
        currentItem.price *
          (price.isFulfilled && currentItem.size_id !== ''
            ? price.data[
                price.data.findIndex(x => x.id === Number(currentItem.size_id))
              ].price
            : 1) *
          currentItem.qty,
      0,
    ) +
    Number(methodSelected ? methods[methodSelected - 1].fee : 0) +
    Number(
      deliveryMethods[deliveryMethods.findIndex(x => x.id === cart.delivery_id)]
        .fee,
    );
  const buttonHandler = () => {
    createTransaction(
      {payment_id: methodSelected, delivery_id: cart.delivery_id},
      cart.list,
      controller,
    )
      .then(result => {
        console.log(result);
        nav.navigate('Home');
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <View className="flex-1 bg-[#F2F2F2]">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()}>
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          Payment
        </Text>

        <Text></Text>
      </View>
      <ScrollView className="">
        <View className="px-8">
          <View className="flex-row justify-between mt-6 mb-3">
            <Text className="font-global text-black font-bold text-base">
              Products
            </Text>
          </View>
          <View className="bg-white rounded-2xl px-4 py-4 pb-2">
            {cart?.list?.length > 0 &&
              cart.list.map((item, key) => (
                <View key={key} className="flex-row mb-3 items-center">
                  <Image
                    source={
                      item.img
                        ? {uri: item.img}
                        : require('../../assets/images/product-placeholder.png')
                    }
                    className="w-[54] h-[54] rounded-xl"
                  />
                  <View className="ml-3">
                    <Text className="font-global text-black">{item.name}</Text>
                    <Text className="font-global text-black">x {item.qty}</Text>
                    <Text className="font-global text-black">
                      {sizeLongName(item.size_id)}
                    </Text>
                  </View>
                  <View className="ml-auto">
                    <Text className="text-black font-global text-base">
                      IDR{' '}
                      {n_f(
                        item.price *
                          (price.isFulfilled && item.size_id !== ''
                            ? price.data[
                                price.data.findIndex(
                                  x => x.id === Number(item.size_id),
                                )
                              ].price
                            : 1) *
                          item.qty,
                      )}
                    </Text>
                  </View>
                </View>
              ))}
          </View>

          <View className="flex-row justify-between mt-6 mb-3">
            <Text className="font-global text-black font-bold text-base">
              Payment Method
            </Text>
          </View>

          <View className="bg-white rounded-2xl px-4 py-4 mb-5">
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
                  <View className="flex-row  ml-3 items-center">
                    <item.Icon />
                    <Text className="font-global text-black text-base ml-3">
                      {item.name}
                    </Text>
                  </View>
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
              IDR {n_f(totalPrice)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={buttonHandler}
            disabled={methodSelected === ''}
            className={`${
              methodSelected !== '' ? `bg-[#6A4029]` : `bg-gray-300`
            }  py-5 rounded-2xl w-full flex-row justify-center mt-6`}>
            <Text
              className={`font-global text-center text-white text-base font-bold `}>
              Proceed to payment
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Payment;
