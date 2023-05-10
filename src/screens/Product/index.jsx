import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {Drawer} from 'react-native-drawer-layout';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import productPlaceholder from '../../assets/images/product-placeholder.png';
import {n_f} from '../../utils/helpers';
import {getProducts} from '../../utils/https/product';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from '../../utils/wrapper/nativewind';

const ProductList = () => {
  const [open, setOpen] = React.useState(false);
  const nav = useNavigation();
  const dispatch = useDispatch();
  const price = useSelector(state => state.price);
  const [list, setList] = useState([]);

  const [filters, setFilter] = useState({
    category: '',
  });
  const controller = useMemo(() => new AbortController(), [filters.category]);

  const categories = [
    {
      id: '',
      name: 'Related',
    },
    {
      id: 1,
      name: 'Coffee',
    },
    {
      id: 2,
      name: 'Non-Coffee',
    },
    {
      id: 3,
      name: 'Food',
    },
    {
      id: 4,
      name: 'Add-ons',
    },
  ];

  useEffect(() => {
    if (!price.isFulfilled) {
      dispatch(priceActions.getPriceBySize({controller}));
    }
    console.log(filters.category);
    getProducts({orderBy: '', category: filters.category}, controller)
      .then(result => {
        setList(result.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [filters.category]);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => {
        return <Text>Drawer content</Text>;
      }}>
      <View className="flex-1 bg-[#EEEEEE]">
        <View className="px-8 py-4 flex-row justify-between items-center">
          <Pressable onPress={() => nav.goBack()}>
            <BackIcon />
          </Pressable>
          <View className="flex-1 mx-7">
            <TextInput
              className="py-1 px-2 bg-[#DDD] font-global text-base rounded-lg text-black"
              placeholderTextColor={'#AAA'}
              placeholder="Search..."
            />
          </View>
          <Pressable onPress={() => setOpen(true)}>
            <FilterIcon width={21} height={22} />
          </Pressable>
        </View>
        {/* <ScrollView
        className="flex-row"
        horizontal
        showsHorizontalScrollIndicator={false}>
        <Pressable className="w-20 pb-2 border-b-2 border-primary">
          <Text className="font-global text-primary text-center text-base">
            Related
          </Text>
        </Pressable> */}
        <FlatList
          data={categories}
          keyExtractor={item => item.name}
          showsHorizontalScrollIndicator={false}
          onRefresh={() => {}}
          renderItem={({item}) => (
            <Pressable
              onPress={() => setFilter({...filters, category: item.id})}
              className={`w-24 pb-2 border-b-2 ${
                item.id === filters.category
                  ? `border-primary`
                  : `border-[#DDD]`
              }`}>
              <Text
                className={`font-global text-[#9A9A9D] text-center text-base ${
                  item.id === filters.category
                    ? `text-primary`
                    : `text-[#9A9A9D]`
                }`}>
                {item.name}
              </Text>
            </Pressable>
          )}
          horizontal></FlatList>
        {/* </ScrollView> */}
        <FlatList
          data={list}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, idx) => idx}
          className="py-2"
          renderItem={list => (
            <Pressable
              className="w-[50%] items-center mb-4"
              onPress={() => nav.navigate('ProductDetail', {product_id: 2})}>
              <Image
                source={
                  list.item.img ? {uri: list.item.img} : productPlaceholder
                }
                className="w-[90%] h-auto aspect-square rounded-full relative -mb-[50%] z-40"
                style={{
                  width: 144,
                  height: 144,
                  aspectRatio: '1/1',
                  resizeMode: 'cover',
                }}
              />
              <View
                className="bg-white w-[85%] rounded-[30px] px-4 pb-4 pt-28"
                style={{elevation: 3}}>
                <Text className="font-global text-black font-bold text-lg text-center h-[70]">
                  {list.item.name}
                </Text>
                <Text className="font-global text-primary font-bold text-base text-center">
                  IDR {n_f(list.item.price)}
                </Text>
              </View>
            </Pressable>
          )}></FlatList>
      </View>
    </Drawer>
  );
};

export default ProductList;
