import React, {
  useEffect,
  useMemo,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import DeleteIcon from '../../assets/icons/delete-black.svg';
import SwipeIcon from '../../assets/icons/swipe.svg';
import WishlistIcon from '../../assets/icons/wishlist-black.svg';
import CartIcon from '../../assets/illustrations/wishlist.svg';
import {cartActions} from '../../store/slices/cart.slice';
import {priceActions} from '../../store/slices/price.slice';
// import CartAction from '../../components/CartAction';
import {
  n_f,
  sizeLongName,
  sizeName,
} from '../../utils/helpers';
import {
  Image,
  Pressable,
  ScrollView,
  Swipable,
  Text,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const CartAction = ({onDelete, onStar}) => {
  return (
    <View className=" pl-6 flex-row items-center justify-center">
      <TouchableOpacity className="bg-secondary w-12 h-12 rounded-full items-center justify-center mr-3 my-auto">
        <WishlistIcon />
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-secondary w-12 h-12 rounded-full items-center justify-center"
        onPress={onDelete}>
        <DeleteIcon />
      </TouchableOpacity>
    </View>
  );
};

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const price = useSelector(state => state.price);
  const controller = useMemo(() => new AbortController(), []);
  const nav = useNavigation();
  useEffect(() => {
    if (!price.isFulfilled) {
      dispatch(priceActions.getPriceBySize({controller}));
    }
  }, []);
  return (
    <View className="flex-1 bg-[#ECECEC]">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()}>
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">Cart</Text>

        <Text></Text>
      </View>
      <View className="flex-row justify-center mb-3">
        <SwipeIcon />
        <Text className="ml-2 font-global text-black">
          swipe on an item to delete
        </Text>
      </View>
      <ScrollView className="pr-8 flex-1">
        {typeof cart.list === 'object' && cart.list.length > 0 ? (
          cart.list.map((item, key) => (
            <Swipable
              containerStyle={{marginBottom: 10}}
              renderRightActions={() => (
                <CartAction
                  onDelete={() =>
                    dispatch(
                      cartActions.removeFromCart({
                        id: item.id,
                        size_id: item.size_id,
                      }),
                    )
                  }
                />
              )}
              key={`${item.id}-${item.size_id}`}>
              <View className="bg-white rounded-xl flex-row py-3 px-3 ml-8 relative">
                <Image
                  source={
                    item.img
                      ? {uri: item.img}
                      : require('../../assets/images/product-placeholder.png')
                  }
                  className="w-[70] h-[70] rounded-full"></Image>
                <View className="ml-3">
                  <Text className="font-global text-black font-bold text-lg">
                    {item.name}
                  </Text>
                  <Text className="font-global text-black text-base">
                    {sizeName(item.size_id)} ({sizeLongName(item.size_id)})
                  </Text>
                  <Text className="font-global text-primary text-base">
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
                <View className="absolute right-3 bottom-2 bg-primary flex-row items-center rounded-xl">
                  <Pressable
                    onPress={() =>
                      dispatch(
                        cartActions.decrementQty({
                          id: item.id,
                          size_id: item.size_id,
                        }),
                      )
                    }>
                    <Text className="font-global text-white text-xl font-black px-2 py-1">
                      -
                    </Text>
                  </Pressable>
                  <Text className="font-origin text-white text-lg font-black w-7 text-center">
                    {item.qty}
                  </Text>
                  <Pressable
                    onPress={() =>
                      dispatch(
                        cartActions.incrementQty({
                          id: item.id,
                          size_id: item.size_id,
                        }),
                      )
                    }>
                    <Text className="font-global text-white text-xl font-black px-2 py-1">
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Swipable>
          ))
        ) : (
          <View className="h-96 justify-center items-center ml-8">
            <CartIcon />
            <Text className="font-global text-xl text-black text-center font-bold mt-4">
              Cart is Empty
            </Text>
          </View>
        )}
      </ScrollView>
      {typeof cart.list === 'object' && cart.list.length > 0 ? (
        <View className="px-8 mb-5">
          <TouchableOpacity
            onPress={() => nav.navigate('DeliveryMethod')}
            className={` bg-[#6A4029] py-5 rounded-2xl w-full flex-row justify-center mt-6`}>
            <Text
              className={`font-global text-center text-white text-base font-bold `}>
              Confirm and Checkout
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="px-8 mb-5">
          <TouchableOpacity
            className={` bg-[#6A4029] py-5 rounded-2xl w-full flex-row justify-center mt-6`}
            onPress={() => nav.navigate('ProductList')}>
            <Text
              className={`font-global text-center text-white text-base font-bold `}>
              Start choosing
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Cart;
