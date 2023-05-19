import React, {useEffect, useMemo, useState} from 'react';

import _ from 'lodash';
import {Skeleton} from 'native-base';
import {useSelector} from 'react-redux';

import {useRoute} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import {n_f, sizeLongName} from '../../utils/helpers';
import {getTransactionDetail} from '../../utils/https/transaction';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from '../../utils/wrapper/nativewind';

const HistoryDetail = () => {
  const route = useRoute();
  const auth = useSelector(state => state.auth);
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    id: '',
    receiver_email: '',
    receiver_name: '',
    payment_id: 0,
    payment_fee: 0,
    delivery_name: '',
    delivery_address: '',
    status_name: '',
    status_id: 0,
    delivery_fee: 0,
    grand_total: 0,
    products: [],
  });

  const fetchData = () => {
    const {transaction_id} = route.params;
    getTransactionDetail(transaction_id, auth.data.token, controller)
      .then(result => {
        setData(result.data.data[0]);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(route.params);

  return (
    <View className="flex-1 bg-[#ECECEC]">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()}>
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          History Detail
        </Text>

        <Text></Text>
      </View>
      <ScrollView className="px-8">
        <View className="flex-row justify-between  mb-3">
          <Text className="font-global text-black font-bold text-base">
            Order Detail
          </Text>
        </View>
        <Skeleton
          h={72}
          rounded={'lg'}
          isLoaded={!isLoading}
          startColor={'gray.300'}
          endColor={'gray.400'}>
          <View className="bg-white rounded-2xl px-4 py-4 pb-2 mb-6">
            <View className="flex-row justify-between">
              <Text className="font-global text-black">Total</Text>
              <Text className="font-global text-black font-semibold">
                IDR {n_f(data.grand_total)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-global text-black">Status</Text>
              <Text className="font-global text-black font-semibold">
                {data.status_name}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-global text-black">Payment Method</Text>
              <Text className="font-global text-black font-semibold">
                {data.payment_name}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-global text-black">Delivery Type</Text>
              <Text className="font-global text-black font-semibold">
                {data.delivery_name}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-global text-black">Transaction at</Text>
              <Text className="font-global text-black font-semibold">
                {data.transaction_time &&
                  new Date(data.transaction_time)
                    .toISOString()
                    .slice(0, 16)
                    .replace('T', ' ')}
              </Text>
            </View>

            <View className="flex-col mt-2">
              <Text className="font-global text-black font-semibold">
                Delivery Address
              </Text>
              <Text className="font-global text-black">
                {data.delivery_address || 'no delivery address'}
              </Text>
            </View>

            <View className="flex-col mt-2">
              <Text className="font-global text-black font-semibold">
                Notes
              </Text>
              <Text className="font-global text-black">
                {data.notes || 'no notes'}
              </Text>
            </View>
          </View>
        </Skeleton>
        <View className="flex-row justify-between mt-6 mb-3">
          <Text className="font-global text-black font-bold text-base">
            Products
          </Text>
        </View>
        <Skeleton
          h={96}
          rounded={'lg'}
          isLoaded={!isLoading}
          startColor={'gray.300'}
          endColor={'gray.400'}>
          <View className="bg-white rounded-2xl px-4 py-4 pb-2 mb-5">
            {data.products.length > 0 &&
              data.products.map((item, key) => (
                <View key={key} className="flex-row mb-3 items-center">
                  <Image
                    source={
                      item.product_img
                        ? {uri: item.product_img}
                        : require('../../assets/images/product-placeholder.png')
                    }
                    className="w-[54] h-[54] rounded-xl"
                  />
                  <View className="ml-3">
                    <Text className="font-global text-black">
                      {_.truncate(item.product_name, {
                        length: 20,
                        omission: '...',
                      })}
                    </Text>
                    <Text className="font-global text-black">x {item.qty}</Text>
                    <Text className="font-global text-black">
                      {sizeLongName(item.size_id)}
                    </Text>
                  </View>
                  <View className="ml-auto">
                    <Text className="text-black font-global text-base">
                      IDR {n_f(item.subtotal)}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </Skeleton>
      </ScrollView>
    </View>
  );
};

export default HistoryDetail;
