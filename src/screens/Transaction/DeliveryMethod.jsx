import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import {cartActions} from '../../store/slices/cart.slice';
import {priceActions} from '../../store/slices/price.slice';
import {n_f} from '../../utils/helpers';
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const DeliveryMethod = () => {
  const price = useSelector(state => state.price);
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const controller = useMemo(() => new AbortController(), []);
  const nav = useNavigation();

  const [details, setDetails] = useState({
    address: cart.delivery_address,
    notes: cart.notes,
  });

  useEffect(() => {
    if (!price.isFulfilled) {
      dispatch(priceActions.getPriceBySize({controller}));
    }
  }, []);
  const [methodSelected, setMethod] = useState(cart.delivery_id);

  const methods = [
    {id: '1', name: 'Door delivery', fee: 10000},
    {id: '2', name: 'Pick up at store', fee: 0},
    {id: '3', name: 'Dine in', fee: 0},
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
    ) + (methodSelected && methods[methodSelected - 1].fee);

  const handleButton = () => {
    nav.navigate('Payment');
    dispatch(
      cartActions.setDelivery({
        delivery_id: methodSelected,
        delivery_address: details.address,
        notes: details.notes,
      }),
    );
  };

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
            value={details.address}
            onChange={e =>
              setDetails({...details, address: e.nativeEvent.text})
            }
            className="font-global text-black py-1 font-medium text-base border-b border-[#BABABA]"
          />
          <TextInput
            multiline
            numberOfLines={2}
            value={details.notes}
            onChange={e => setDetails({...details, notes: e.nativeEvent.text})}
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
            IDR {n_f(totalPrice)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleButton}
          disabled={methodSelected === ''}
          className={`${
            methodSelected !== '' ? `bg-[#6A4029]` : 'bg-gray-300'
          }  py-5 rounded-2xl w-full flex-row justify-center mt-6`}>
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
