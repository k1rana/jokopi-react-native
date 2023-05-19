import React, {useCallback, useEffect, useMemo, useState} from 'react';

import _ from 'lodash';
import {Drawer} from 'react-native-drawer-layout';
import {useDispatch, useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import productPlaceholder from '../../assets/images/product-placeholder.png';
import {priceActions} from '../../store/slices/price.slice';
import {n_f} from '../../utils/helpers';
import {getProducts} from '../../utils/https/product';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
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

  const [isLoading, setIsLoading] = useState('true');
  const [searchTerm, setSearchTerm] = useState('');

  const [meta, setMeta] = useState({
    isEnd: false,
    moreLoading: false,
    totalPage: 1,
    currentPage: 1,
  });

  const [filters, setFilter] = useState({
    category: '',
    search: '',
  });

  const [sort, setSort] = useState({
    orderBy: '',
    sort: '',
  });

  const controller = useMemo(() => new AbortController(), [filters.category]);

  const categories = [
    {
      id: '',
      name: 'Favorite',
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
  const fetchData = () => {
    setIsLoading(true);
    const initialValue = {
      isEnd: false,
      moreLoading: false,
      currentPage: 1,
      totalPage: 1,
    };
    setMeta({...initialValue});
    getProducts(
      {
        order_by: sort.orderBy,
        sort: sort.sort,
        orderBy: '',
        search: filters.search,
        category: filters.category,
      },
      controller,
    )
      .then(result => {
        setIsLoading(false);
        console.log(sort.orderBy);
        setList(result.data.data);
        const {totalPage, currentPage} = result.data.meta;
        setMeta({
          ...initialValue,
          currentPage,
          totalPage,
          isEnd: result.data.meta.next === null,
        });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const loadMore = () => {
    if (!meta.moreLoading && !meta.isEnd) {
      setMeta({...meta, moreLoading: true});
      getProducts(
        {
          order_by: sort.orderBy,
          sort: sort.sort,
          search: filters.search,
          category: filters.category,
          page: meta.currentPage + 1,
        },
        controller,
      )
        .then(result => {
          // console.log(result.data.data);
          setList([...list, ...result.data.data]);
          const {next} = result.data.meta;
          let isEnd = false;
          if (!next) {
            isEnd = true;
          }

          setMeta({
            ...meta,
            moreLoading: false,
            isEnd,
            currentPage: meta.currentPage + 1,
          });
          // setMeta({currentPage: meta.currentPage + 1});
        })
        .catch(err => {
          setMeta({...meta, isEnd: true, moreLoading: false});
          console.log(err);
        });
    }
  };

  const delayedSearch = useCallback(
    _.debounce(q => {
      setFilter({...filters, search: q});
    }, 1500),
    [],
  );
  useEffect(() => {
    delayedSearch(searchTerm);
    console.log(searchTerm);
  }, [searchTerm]);
  useEffect(() => {
    if (!price.isFulfilled) {
      dispatch(priceActions.getPriceBySize({controller}));
    }
    fetchData();
  }, [filters.category, sort.orderBy, sort.sort, filters.search]);

  const sorts = [
    {orderBy: 'price', sort: 'asc', name: 'Price (Low to High)'},
    {orderBy: 'price', sort: 'desc', name: 'Price (High to Low)'},
    {orderBy: 'id', sort: 'desc', name: 'Latest'},
    {orderBy: 'id', sort: 'asc', name: 'Oldest'},
    {orderBy: 'name', sort: 'asc', name: 'Name (A-Z)'},
    {orderBy: 'name', sort: 'desc', name: 'Name (Z-A)'},
  ];

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerPosition="right"
      drawerStyle={{width: '90%'}}
      renderDrawerContent={() => {
        return (
          <View className="flex-1">
            <View className="bg-[#EEEEEE] py-2 px-3 mb-5">
              <Text className="font-global text-black text-lg font-semibold">
                Sort
              </Text>
            </View>
            <FlatList
              data={sorts}
              numColumns={2}
              keyExtractor={item => `${item.orderBy}-${item.sort}`}
              className="gap-y-2"
              renderItem={({item}) => (
                <View className="w-[50%] items-center mb-4">
                  <Pressable
                    onPress={() =>
                      setSort({orderBy: item.orderBy, sort: item.sort})
                    }
                    className={`${
                      sort.orderBy === item.orderBy && sort.sort === item.sort
                        ? 'border-primary'
                        : 'border-[#EEEEEE]'
                    } border items-center  w-[90%] p-2 bg-[#EEEEEE]`}>
                    <Text
                      className={`${
                        sort.orderBy === item.orderBy && sort.sort === item.sort
                          ? 'text-primary'
                          : 'text-black'
                      } font-global  text-center`}>
                      {item.name}
                    </Text>
                  </Pressable>
                </View>
              )}></FlatList>
          </View>
        );
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
              value={searchTerm}
              onChange={e => setSearchTerm(e.nativeEvent.text)}
            />
          </View>
          <Pressable onPress={() => setOpen(true)}>
            <FilterIcon width={21} height={22} />
          </Pressable>
        </View>

        <View>
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
                  className={`font-global text-[#a0a0a3] text-center text-base ${
                    item.id === filters.category
                      ? `text-primary`
                      : `text-[#9A9A9D]`
                  }`}>
                  {item.name}
                </Text>
              </Pressable>
            )}
            horizontal></FlatList>
        </View>
        <SafeAreaView className="flex-1 pt-1">
          {isLoading ? (
            <FlatList
              data={['', '', '', '', '', '']}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, idx) => idx}
              className="py-2"
              renderItem={item => (
                <View className="w-[50%] items-center mb-4">
                  <View className="bg-[#d3d3d3] w-[85%] h-[250] rounded-[30px] px-4 pb-4 pt-28"></View>
                </View>
              )}
            />
          ) : (
            <FlatList
              data={list}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, idx) => idx}
              className="py-2"
              onEndReachedThreshold={0.2}
              ListFooterComponent={() => (
                <>
                  {meta.moreLoading || meta.currentPage < meta.totalPage ? (
                    <Text className="font-global text-black text-center mt-2 mb-4">
                      Loading...
                    </Text>
                  ) : (
                    <Text className="font-global text-black text-center mt-2 mb-4">
                      End of the page
                    </Text>
                  )}
                </>
              )}
              onEndReached={loadMore}
              renderItem={list => (
                <Pressable
                  className="w-[50%] items-center mb-4"
                  onPress={() =>
                    nav.navigate('ProductDetail', {product_id: list.item.id})
                  }>
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
          )}
        </SafeAreaView>
      </View>
    </Drawer>
  );
};

export default ProductList;
