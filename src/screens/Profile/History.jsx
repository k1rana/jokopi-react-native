import React, {useEffect, useMemo, useState} from 'react';

import _ from 'lodash';
import {useSelector} from 'react-redux';

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import SwipeIcon from '../../assets/icons/swipe.svg';
// import SwipeIcon from '../../assets/icons/swipe.svg';
import HistoryIcon from '../../assets/illustrations/history.svg';
import DetailActionSwipe from '../../components/DetailActionSwipe';
import {n_f} from '../../utils/helpers';
import {getTransactionHistory} from '../../utils/https/transaction';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Swipable,
  Text,
  View,
} from '../../utils/wrapper/nativewind';

const History = () => {
  const nav = useNavigation();
  const auth = useSelector(state => state.auth);
  const controller = useMemo(() => new AbortController(), []);
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({
    totalData: '0',
    perPage: 10,
    currentPage: 1,
    totalPage: 1,
    prev: null,
    next: null,
  });

  const fetchData = async () => {
    setIsLoading(true);
    getTransactionHistory(auth.data.token, controller)
      .then(result => {
        // console.log(result.data.data);
        setData(result.data.data);
        setMeta({...meta, ...result.data.meta});
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = () => fetchData();

      return () => unsubscribe();
    }, []),
  );
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View className="flex-1 bg-[#ECECEC]">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()} className="pr-4">
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          Order History
        </Text>

        <Text></Text>
      </View>
      <View className="flex-row justify-center mb-3">
        <SwipeIcon />
        <Text className="ml-2 font-global text-black">
          swipe on an item to see details
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color="black" size="large" />
      ) : (
        <ScrollView className="pr-8 flex-1 pt-2">
          {typeof data === 'object' && data.length > 0 ? (
            data.map((item, key) => (
              <Swipable
                containerStyle={{marginBottom: 10}}
                key={key}
                renderLeftActions={() => (
                  <DetailActionSwipe
                    onDetail={() =>
                      nav.navigate('HistoryDetail', {
                        transaction_id: item.id,
                      })
                    }
                  />
                )}>
                <View className="bg-white rounded-xl flex-row py-3 px-3 ml-8 relative">
                  <Image
                    source={
                      item.products[0].product_img
                        ? {uri: item.products[0].product_img}
                        : require('../../assets/images/product-placeholder.png')
                    }
                    className="w-[70] h-[70] rounded-full"
                  />
                  <View className="ml-3">
                    {item.products.length < 2 ? (
                      <Text className="font-global text-black font-bold text-base">
                        {_.truncate(item.products[0].product_name, {
                          length: 24,
                          omission: '...',
                        })}
                      </Text>
                    ) : (
                      <View className="flex-row">
                        <Text className="font-global text-black font-bold text-base">
                          {_.truncate(item.products[0].product_name, {
                            length: 16,
                            omission: '...',
                          })}
                        </Text>
                        <Text className="font-global text-primary text-base ml-1">
                          + {item.products.length - 1} more
                        </Text>
                      </View>
                    )}
                    <Text className="font-global text-primary text-base">
                      IDR {n_f(item.grand_total)}
                    </Text>
                    {item.products.length > 1 && (
                      <Text className="font-global text-primary text-base">
                        {item.status_name}
                      </Text>
                    )}
                  </View>
                </View>
              </Swipable>
            ))
          ) : (
            <View className="h-96 justify-center items-center ml-8">
              <HistoryIcon />
              <Text className="font-global text-xl text-black text-center font-bold mt-4">
                No history yet
              </Text>
              <Text className="font-global text-base text-black text-center mt-2">
                Hit the orange button down below to Create an order
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default History;
