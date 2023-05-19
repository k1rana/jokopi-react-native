import React, {useEffect, useMemo, useState} from 'react';

import _ from 'lodash';
import {Box, Spinner, useToast} from 'native-base';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import CheckIcon from '../../assets/icons/check.svg';
import DetailIcon from '../../assets/icons/detail.svg';
import SwipeIcon from '../../assets/icons/swipe.svg';
import {n_f} from '../../utils/helpers';
import {
  getTransactions,
  setTransactionDone,
} from '../../utils/https/transaction';
import {
  FlatList,
  Image,
  Pressable,
  Swipable,
  Text,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const OrderAction = ({onDone, onDetail}) => {
  return (
    <View className=" pl-6 flex-row items-center justify-center">
      <TouchableOpacity
        className="bg-primary w-12 h-12 rounded-full items-center justify-center"
        onPress={onDone}>
        <CheckIcon />
      </TouchableOpacity>
    </View>
  );
};

const OrderActionDetail = ({onDetail}) => {
  return (
    <View className=" pl-6 flex-row items-center justify-center">
      <TouchableOpacity
        className="bg-primary w-12 h-12 rounded-full items-center justify-center"
        onPress={onDetail}>
        <DetailIcon />
      </TouchableOpacity>
    </View>
  );
};

const ManageOrder = () => {
  const nav = useNavigation();
  const [data, setData] = useState([]);
  const auth = useSelector(state => state.auth);
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [isProcess, setIsProcess] = useState(false);
  const toast = useToast();

  const fetch = () => {
    getTransactions({page: 1}, auth.data.token, controller)
      .then(result => {
        setData(result.data.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const doneHandler = id => {
    setIsProcess(true);
    setTransactionDone(id, auth.data.token, controller)
      .then(result => {
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                Success processing order!
              </Box>
            );
          },
        });
      })
      .catch(err => {
        toast.show({
          render: () => {
            return (
              <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                An error occurred!
              </Box>
            );
          },
        });
        console.log(err);
      })
      .finally(() => {
        setIsProcess(false);
        fetch();
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Modal
        isVisible={modal}
        onBackdropPress={() => {
          setModal(false);
        }}>
        {data.length < 1 ? (
          <View className="bg-white rounded-lg items-center justify-center">
            <Text className="text-black ml-2 font-global text-base font-semibold py-4">
              No Order yet
            </Text>

            <View className="flex-row border-t border-gray-400">
              <TouchableOpacity
                className="flex-1 px-5 py-4 rounded-lg"
                onPress={() => {
                  setModal(false);
                }}>
                <Text className="font-global text-primary text-center font-semibold">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="bg-white pt-4 items-center justify-center gap-y-3 rounded-lg">
            <Text className="font-global text-black text-lg font-semibold">
              Mark as Done
            </Text>
            <Text className="font-global text-black text-base mb-3">
              Are you sure you want to mark all as done?
            </Text>
            <View className="flex-row border-t border-gray-400">
              <TouchableOpacity
                className="flex-1 px-5 py-4 rounded-lg"
                onPress={() => {
                  setModal(false);
                  doneHandler(data.map(item => item.id));
                }}>
                <Text className="font-global text-primary text-center font-semibold">
                  Yes
                </Text>
              </TouchableOpacity>
              <Pressable
                className="flex-1 px-5 py-4 border-l border-gray-400"
                onPress={() => setModal(false)}>
                <Text className="font-global text-black text-center font-medium">
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
      <View className="flex-1 bg-[#ECECEC]">
        {isProcess && (
          <View className="absolute w-screen h-screen bg-black/40 z-40 items-center justify-center">
            <Spinner color="primary" />
          </View>
        )}
        <View className="px-10 py-6 flex-row justify-between items-center">
          <Pressable onPress={() => nav.goBack()}>
            <BackIcon />
          </Pressable>
          <Text className="font-global text-black text-base font-bold">
            Customer Order
          </Text>

          <Text></Text>
        </View>

        <View className="flex-row justify-center mb-3">
          <SwipeIcon />
          <Text className="ml-2 font-global text-black">
            swipe on an item when it’s done
          </Text>
        </View>
        <View className="pr-8 flex-1">
          {isLoading ? (
            <Spinner color="primary" />
          ) : (
            <FlatList
              ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center">
                  <Text className="font-global text-black font-bold text-lg pl-8">
                    No orders yet
                  </Text>
                </View>
              )}
              data={data}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <Swipable
                  containerStyle={{marginBottom: 10}}
                  renderLeftActions={() => (
                    <OrderActionDetail
                      onDetail={() =>
                        nav.navigate('OrderDetail', {transaction_id: item.id})
                      }
                    />
                  )}
                  renderRightActions={() => (
                    <OrderAction onDone={() => doneHandler(item.id)} />
                  )}>
                  <View className="bg-white rounded-xl flex-row py-3 px-3 ml-8 relative">
                    <Image
                      source={
                        item.products[0].product_img
                          ? {uri: item.products[0].product_img}
                          : require('../../assets/images/product-placeholder.png')
                      }
                      className="w-[70] h-[70] rounded-full"></Image>
                    <View className="ml-3">
                      <Text className="font-global text-black font-bold text-lg">
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
                      </Text>
                      <Text className="font-global text-primary text-base">
                        IDR {n_f(item.grand_total)}
                      </Text>
                      <Text className="font-global text-primary text-base">
                        Delivery to{' '}
                        {_.truncate(item.delivery_address, {
                          length: 13,
                          omission: '...',
                        })}
                      </Text>
                    </View>
                  </View>
                </Swipable>
              )}></FlatList>
          )}
        </View>
        <View className="px-8 py-4">
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => setModal(true)}
            className={` bg-secondary py-5 rounded-2xl w-full flex-row justify-center mt-6`}>
            <Text className="font-global text-black font-bold text-base">
              Mark all as done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ManageOrder;
