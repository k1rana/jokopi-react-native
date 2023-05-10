import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {Dimensions} from 'react-native';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left.svg';
import CartIcon from '../../assets/icons/cart-white.svg';
import {cartActions} from '../../store/slices/cart.slice';
import {priceActions} from '../../store/slices/price.slice';
import {n_f} from '../../utils/helpers';
import {getProductById} from '../../utils/https/product';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const ProductDetail = () => {
  const windowHeight = Dimensions.get('window').height;
  const nav = useNavigation();
  const router = useRoute();
  const {product_id} = router.params;
  const [data, setData] = useState({
    id: 0,
    name: '',
    price: 0,
    category_id: 0,
    desc: null,
    img: '',
    category_name: '',
  });

  const price = useSelector(state => state.price);

  const dispatch = useDispatch();

  const [size, setSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const controller = useMemo(() => new AbortController(), []);

  useEffect(() => {
    if (!price.isFulfilled) {
      dispatch(priceActions.getPriceBySize({controller}));
    }
    getProductById(product_id, controller)
      .then(result => {
        // console.log(result.data.data[0]);
        setData(result.data.data[0]);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const addCart = () => {
    dispatch(
      cartActions.addtoCart({
        id: data.id,
        qty: 1,
        size_id: size,
        name: data.name,
        img: data.img,
        price: data.price,
      }),
    );
  };

  const disabled = () => {
    if (!size) return true;
    if (isLoading) return true;
    return false;
  };
  //   console.log(windowHeight);

  return (
    <View className="flex-1 bg-primary-bold">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()}>
          <BackIcon />
        </Pressable>
        <Pressable onPress={() => nav.navigate('Cart')}>
          <CartIcon />
        </Pressable>
      </View>
      <View className="flex-1 flex-row justify-between items-end px-6 relative z-10">
        <View className="  bg-secondary  rounded-t-3xl px-2 py-3">
          <Text className=" text-black font-global font-bold text-2xl min-w-[115] max-w-[115] text-center">
            {n_f(
              data.price *
                (price.isFulfilled && size !== ''
                  ? price.data[price.data.findIndex(x => x.id === Number(size))]
                      .price
                  : 1),
            )}
          </Text>
        </View>
        <Image
          source={
            data.img
              ? {uri: data.img}
              : require('../../assets/images/product-placeholder.png')
          }
          style={{
            position: 'relative',
            width: 200,
            aspectRatio: '1/1',
            marginBottom: '-25%',
            zIndex: 60,
            resizeMode: 'cover',
          }}
          className="rounded-full shadow-[10]"
        />
      </View>
      <View className="flex-[4_4_0%] bg-[#EBEBEB] rounded-tr-[50] px-8">
        <View className="flex-row mt-28 ">
          <Text className="flex-1 font-global text-black text-3xl text-right font-bold">
            {data.name}
          </Text>
        </View>
        <Text className="font-global text-primary text-base max-w-[200] mt-5">
          Delivery only on Monday to friday at 1 - 7 pm
        </Text>
        <ScrollView
          className="mt-5 max-h-28"
          showsVerticalScrollIndicator={false}>
          <Text className="font-global text-primary text-base font-bold">
            {data.desc || `This product doesn't have a description.`}
          </Text>
        </ScrollView>
        <View
          className={`${
            windowHeight < 780 && ` flex-row justify-between items-center py-4`
          }`}>
          <Text className="font-global text-black font-bold text-xl text-center mt-4">
            Choose a size{windowHeight < 780 && ':'}
          </Text>
          <View
            className={`${
              windowHeight > 780 && `mt-5`
            } flex-row justify-evenly `}>
            <Pressable
              onPress={() => setSize('1')}
              className={`${
                size === '1' ? 'bg-primary' : 'bg-secondary'
              } rounded-full items-center justify-center  mr-2`}>
              <Text
                className={`${
                  size === '1' ? 'text-secondary' : 'text-black'
                } font-global  font-bold h-12 w-12 text-center text-xl pt-[10]`}>
                R
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSize('2')}
              className={`${
                size === '2' ? 'bg-primary' : 'bg-secondary'
              } rounded-full items-center justify-center  mr-2`}>
              <Text
                className={`${
                  size === '2' ? 'text-secondary' : 'text-black'
                } font-global  font-bold h-12 w-12 text-center text-xl pt-[10]`}>
                L
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSize('3')}
              className={`${
                size === '3' ? 'bg-primary' : 'bg-secondary'
              } rounded-full items-center justify-center  mr-2`}>
              <Text
                className={`${
                  size === '3' ? 'text-secondary' : 'text-black'
                } font-global  font-bold h-12 w-12 text-center text-xl pt-[10]`}>
                XL
              </Text>
            </Pressable>
          </View>
        </View>
        <TouchableOpacity
          disabled={disabled()}
          onPress={addCart}
          className={`${
            disabled() ? 'bg-gray-400' : 'bg-[#6A4029]'
          }  py-5 rounded-2xl w-full flex-row justify-center mt-6`}>
          <Text
            className={` font-global text-center text-white text-base font-bold `}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetail;
