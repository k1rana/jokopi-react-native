import React, {useEffect, useMemo, useState} from 'react';

import {Center, Fab, VStack} from 'native-base';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BurgerIcon from '../../assets/icons/burger-drawer.svg';
import CartIcon from '../../assets/icons/cart.svg';
import ChatIcon from '../../assets/icons/chat.svg';
import PenIcon from '../../assets/icons/pen.svg';
import SearchIcon from '../../assets/icons/search.svg';
import productPlaceholder from '../../assets/images/product-placeholder.png';
import {authActions} from '../../store/slices/auth.slice';
import {priceActions} from '../../store/slices/price.slice';
import {profileAction} from '../../store/slices/profile.slice';
import {n_f} from '../../utils/helpers';
import {logout} from '../../utils/https/auth';
import {getProducts} from '../../utils/https/product';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const Home = ({navigation}) => {
  const nav = useNavigation();
  const controller = useMemo(() => new AbortController(), []);
  const price = useSelector(state => state.price);
  const dispatch = useDispatch();
  const [logoutProcess, setLogoutProc] = useState(false);

  const [fab, setFab] = useState(false);

  const auth = useSelector(state => state.auth);
  const authController = useMemo(
    () => new AbortController(),
    [auth.data.token],
  );
  const profile = useSelector(state => state.profile);

  // useEffect(() => {
  //   if (auth.data.isLogin && !profile.isFulfilled) {
  //     dispatch(profileAction.getProfileThunk(auth.data.token, controller));
  //   }
  // }, [auth.data.isLogin]);

  const [favorite, setFavorite] = useState([]);
  const [promo, setPromo] = useState([]);
  const [promoLoad, setPromoLoad] = useState(true);
  const [favoriteLoad, setFavLoad] = useState(true);

  useEffect(() => {
    if (!price.isFulfilled) {
      dispatch(priceActions.getPriceBySize(controller));
    }

    getProducts({order_by: 'id', sort: 'asc'}, controller)
      .then(result => {
        setFavorite(result.data.data);
        // console.log(result.data.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setFavLoad(false));

    getProducts({order_by: 'price', sort: 'asc'}, controller)
      .then(result => {
        setPromo(result.data.data);
        // console.log(result.data.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setPromoLoad(false));
  }, []);

  const logoutHandler = () => {
    // console.log('lolo gabahaya ta?');
    setLogoutProc(true);
    logout(auth.data.token, authController)
      .then(result => {
        console.log('logout success');
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(authActions.reset());
        dispatch(profileAction.reset());
        setLogoutProc(false);
        nav.navigate('Home');
      });
  };

  return (
    <>
      <Modal
        isVisible={auth.logoutOpen}
        onBackdropPress={() => {
          !logoutProcess && dispatch(authActions.closeModal());
        }}>
        {logoutProcess ? (
          <View className="bg-white rounded-lg items-center justify-center p-4 flex-row">
            <ActivityIndicator color={'black'} />
            <Text className="text-black ml-2 font-global text-base font-semibold">
              Logout...
            </Text>
          </View>
        ) : (
          <View className="bg-white pt-4 items-center justify-center gap-y-3 rounded-lg">
            <Text className="font-global text-black text-lg font-semibold">
              Logout
            </Text>
            <Text className="font-global text-black text-base mb-3">
              Are you sure you want to logout?
            </Text>
            <View className="flex-row border-t border-gray-400">
              <TouchableOpacity
                className="flex-1 px-5 py-4 rounded-lg"
                onPress={logoutHandler}>
                <Text className="font-global text-primary text-center font-semibold">
                  Yes
                </Text>
              </TouchableOpacity>
              <Pressable
                className="flex-1 px-5 py-4 border-l border-gray-400"
                onPress={() => dispatch(authActions.closeModal())}>
                <Text className="font-global text-black text-center font-medium">
                  Nah, i'm stay
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
      <View className="flex-1">
        <Fab
          renderInPortal={false}
          shadow={2}
          bgColor={'primary'}
          size="sm"
          left={8}
          bottom={12}
          placement="bottom-left"
          zIndex={31}
          onPress={() => setFab(!fab)}
          icon={
            <Text
              className={`${
                fab ? 'rotate-45' : 'rotate-0'
              } font-global font-semibold mx-2 text-2xl text-white`}>
              +
            </Text>
          }
        />
        {fab && (
          <>
            <Pressable
              className="bg-black/40 z-30 absolute w-screen h-screen"
              onPress={() => setFab(false)}></Pressable>
            <View className="absolute z-40 bottom-2 left-28">
              <VStack space={4} alignItems="flex-start">
                <Pressable onPress={() => nav.navigate('CreateProduct')}>
                  <Center w="48" h="16" bg="secondary" rounded="md" shadow={3}>
                    <Text className="font-global text-primary font-bold">
                      New Product
                    </Text>
                  </Center>
                </Pressable>
                <Center w="48" h="16" bg="secondary" rounded="md" shadow={3}>
                  <Text className="font-global text-primary font-bold">
                    New Promo
                  </Text>
                </Center>
              </VStack>
            </View>
          </>
        )}
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
          {favoriteLoad ? (
            <FlatList
              className="flex-row px-6 flex-none bg-drawer"
              horizontal
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={<View className="mr-7"></View>}
              data={['', '', '']}
              renderItem={({item}) => (
                <View className="w-[220px] h-[270] bg-gray-300  py-2 mx-6 rounded-xl"></View>
              )}
              nestedScrollEnabled></FlatList>
          ) : (
            <FlatList
              data={favorite}
              className="flex-row px-6 flex-none bg-drawer"
              horizontal
              view
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={<View className="mr-7"></View>}
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
                    <Pressable
                      onPress={() =>
                        nav.navigate('EditProduct', {product_id: item.id})
                      }
                      className="rounded-full bg-primary absolute  w-[35] h-[35]  items-center justify-center -bottom-4 -right-4">
                      <PenIcon width={13} height={13} />
                    </Pressable>
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
          )}

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
          {promoLoad ? (
            <FlatList
              className="flex-row px-6 flex-none bg-drawer mb-32"
              horizontal
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={<View className="mr-7"></View>}
              data={['', '', '']}
              renderItem={({item}) => (
                <View className="w-[220px] h-[270] bg-gray-300  py-2 mx-6 rounded-xl"></View>
              )}
              nestedScrollEnabled></FlatList>
          ) : (
            <FlatList
              data={promo}
              className="flex-row px-6 flex-none bg-drawer mb-16"
              horizontal
              view
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={<View className="mr-7"></View>}
              renderItem={({item}) => (
                <Pressable
                  className="block relative items-center w-[220px] py-2 mx-6 rounded-lg justify-center"
                  onPress={() =>
                    nav.navigate('ProductDetail', {product_id: item.id})
                  }>
                  <View className="w-[180] h-[180] aspect-square bg-transparent -mb-32 relative z-20 rounded-xl  justify-center">
                    <Image
                      source={item.img ? {uri: item.img} : productPlaceholder}
                      style={{width: 180, height: 180, resizeMode: 'cover'}}
                      className="rounded-2xl"
                    />
                    <Pressable
                      onPress={() =>
                        nav.navigate('EditProduct', {product_id: item.id})
                      }
                      className="rounded-full bg-primary absolute  w-[35] h-[35]  items-center justify-center -bottom-4 -right-4">
                      <PenIcon width={13} height={13} />
                    </Pressable>
                  </View>
                  <View className="bg-white items-center w-[220px] h-[250] pt-36 pb-5 z-10  rounded-3xl gap-y-1  shadow-home-products justify-between">
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
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Home;
