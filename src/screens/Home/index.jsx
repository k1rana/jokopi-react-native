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

import BurgerIcon from '../../assets/icons/burger-drawer.svg';
import CartIcon from '../../assets/icons/cart.svg';
import ChatIcon from '../../assets/icons/chat.svg';
import SearchIcon from '../../assets/icons/search.svg';
import productPlaceholder from '../../assets/images/product-placeholder.png';
import {priceActions} from '../../store/slices/price.slice';
import {n_f} from '../../utils/helpers';
import {getProducts} from '../../utils/https/product';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from '../../utils/wrapper/nativewind';

const Home = ({navigation}) => {
  const nav = useNavigation();
  const controller = useMemo(() => new AbortController(), []);
  const price = useSelector(state => state.price);
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);

  // useEffect(() => {
  //   if (auth.data.isLogin && !profile.isFulfilled) {
  //     dispatch(profileAction.getProfileThunk(auth.data.token, controller));
  //   }
  // }, [auth.data.isLogin]);

  const [favorite, setFavorite] = useState([]);

  useEffect(() => {
    if (!price.isFulfilled) {
      dispatch(priceActions.getPriceBySize(controller));
    }

    getProducts({orderBy: ''}, controller)
      .then(result => {
        setFavorite(result.data.data);
        // console.log(result.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <View className="px-8 bg-drawer py-6 flex-row justify-between">
        <Pressable onPress={() => navigation.openDrawer()}>
          <BurgerIcon width={25} height={25} />
        </Pressable>
        <View className="flex-row gap-x-8">
          <Pressable onPress={() => navigation.openDrawer()}>
            <ChatIcon width={25} height={25} />
          </Pressable>
          <Pressable onPress={() => nav.navigate('ProductList')}>
            <SearchIcon width={25} height={25} />
          </Pressable>
          <Pressable onPress={() => nav.navigate('Cart')}>
            <CartIcon width={25} height={25} />
          </Pressable>
        </View>
      </View>
      <ScrollView className="py-6">
        <View className="px-8">
          <Text className="font-global text-black text-4xl font-bold mb-6 max-w-xs">
            A good coffee is a good day
          </Text>
          <Text className="font-global text-primary font-bold text-xl">
            Favorite Products
          </Text>
          <Pressable
            className="font-global pb-4"
            onPress={() => nav.navigate('ProductList')}>
            <Text className="font-global text-primary text-right">
              See more
            </Text>
          </Pressable>
        </View>
        <FlatList
          data={favorite}
          className="flex-row px-6 flex-none bg-drawer"
          horizontal
          view
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable
              className="block relative items-center w-[220px] py-2 mx-6 rounded-lg justify-center"
              onPress={() =>
                nav.navigate('ProductDetail', {product_id: item.id})
              }>
              <View className="w-[180] h-[180] aspect-square bg-transparent -mb-32 relative z-20 rounded-xl  justify-center">
                <Image
                  source={item.img ? {uri: item.img} : productPlaceholder}
                  loadingIndicatorSource={productPlaceholder}
                  style={{width: 180, height: 180, resizeMode: 'cover'}}
                  className="rounded-2xl"
                />
              </View>
              <View className="bg-white items-center w-[220] h-[250] pt-36 pb-5 z-10  rounded-3xl gap-y-1  shadow-home-products justify-between">
                <Text className="font-global text-black min-h-[] text-xl font-bold text-center max-w-[150]">
                  {item.name}
                </Text>
                <Text className="font-global text-primary text-lg font-bold text-center">
                  IDR {n_f(item.price)}
                </Text>
              </View>
            </Pressable>
          )}
          nestedScrollEnabled></FlatList>

        <View className="px-8 py-4">
          <Text className="font-global text-primary font-bold text-xl">
            Promo for you
          </Text>
          <Pressable
            className="font-global"
            onPress={() => nav.navigate('ProductList')}>
            <Text className="font-global text-primary text-right">
              See more
            </Text>
          </Pressable>
        </View>
        <FlatList
          data={['', '', '', '', '', '']}
          className="flex-row px-6 flex-none bg-drawer mb-16"
          horizontal
          view
          showsHorizontalScrollIndicator={false}
          renderItem={items => (
            <Pressable
              className="block relative items-center w-[220px] py-2 mx-6 rounded-lg justify-center"
              onPress={() => nav.navigate('ProductDetail', {product_id: '2'})}>
              <View className="w-[180] h-[180] aspect-square bg-transparent -mb-32 relative z-20 rounded-xl  justify-center">
                <Image
                  source={productPlaceholder}
                  style={{width: 180, height: 180, resizeMode: 'cover'}}
                  className="rounded-2xl"
                />
              </View>
              <View className="bg-white items-center w-[220px] pt-36 pb-5 z-10  rounded-3xl gap-y-1  shadow-home-products">
                <Text className="font-global text-black min-h-[] text-xl font-bold text-center max-w-[150]">
                  Hazelnut Latte
                </Text>
                <Text className="font-global text-primary text-lg font-bold text-center">
                  IDR 30.000
                </Text>
              </View>
            </Pressable>
          )}
          nestedScrollEnabled></FlatList>
      </ScrollView>
    </>
  );
};

export default Home;
