import React from 'react';

import BurgerIcon from '../../assets/icons/burger-drawer.svg';
import CartIcon from '../../assets/icons/cart.svg';
import ChatIcon from '../../assets/icons/chat.svg';
import SearchIcon from '../../assets/icons/search.svg';
import productPlaceholder from '../../assets/images/product-placeholder.png';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from '../../utils/wrapper/nativewind';

const Home = ({navigation}) => {
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
          <Pressable onPress={() => navigation.openDrawer()}>
            <SearchIcon width={25} height={25} />
          </Pressable>
          <Pressable onPress={() => navigation.openDrawer()}>
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
          <Pressable className="font-global pb-4">
            <Text className="font-global text-primary text-right">
              See more
            </Text>
          </Pressable>
        </View>
        <FlatList
          data={['', '', '', '', '', '']}
          className="flex-row px-6 flex-none bg-drawer"
          horizontal
          view
          showsHorizontalScrollIndicator={false}
          renderItem={items => (
            <View className="block relative items-center w-[220px] py-2 mx-6 rounded-lg justify-center">
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
            </View>
          )}
          nestedScrollEnabled></FlatList>

        <View className="px-8 py-4">
          <Text className="font-global text-primary font-bold text-xl">
            Promo for you
          </Text>
          <Pressable className="font-global">
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
            <View className="block relative items-center w-[220px] py-2 mx-6 rounded-lg justify-center">
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
            </View>
          )}
          nestedScrollEnabled></FlatList>
      </ScrollView>
    </>
  );
};

export default Home;
