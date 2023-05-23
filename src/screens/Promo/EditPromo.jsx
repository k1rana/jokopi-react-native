import React, {useEffect, useMemo, useState} from 'react';

import _ from 'lodash';
import {CheckIcon, Select, Skeleton} from 'native-base';
import ImageCropPicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';

import {useNavigation, useRoute} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import PenIcon from '../../assets/icons/pen.svg';
import productPlaceholder from '../../assets/images/product-placeholder.png';
import {createProductEntry, getProductById} from '../../utils/https/product';
import imagePicker from '../../utils/imagePicker';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const EditPromo = () => {
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  const route = useRoute();
  const {product_id} = route.params;

  const controller = useMemo(() => new AbortController(), []);
  const [data, setData] = useState({
    name: '',
    category_id: '',
    price: '',
    desc: '',
    img: '',
  });
  const [dataLoad, setDataLoad] = useState(true);

  const [image, setImage] = useState({
    path: '',
  });
  const [modalPfp, setModalPfp] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    price: '',
    category_id: 0,
    desc: '',
    image: {
      uri: '',
      type: '',
      name: 'image.jpg',
    },
  });

  const nav = useNavigation();

  useEffect(() => {
    getProductById(product_id, controller)
      .then(result => {
        setData({...result.data.data[0]});
        const {name, price, category_id, desc} = result.data.data[0];
        setForm({
          ...form,
          name,
          price: JSON.stringify(price),
          category_id,
          desc,
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setDataLoad(false);
      });
  }, []);

  const saveHandler = async () => {
    try {
      setLoading(true);

      const result = await createProductEntry(
        form,
        auth.data.token,
        controller,
      );
      setForm({
        name: '',
        price: '',
        category_id: 0,
        desc: '',
        image: {
          uri: '',
          type: '',
          name: 'image.jpg',
        },
      });
      setSuccess(result.data.data[0].id);
      console.log('berhasil');
      await ImageCropPicker.clean();
    } catch (error) {
      if (error?.response?.data?.msg)
        return setError(error?.response?.data?.msg);
      setError('An error ocurred, please check your internet before submit');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const pickPhoto = () => {
    imagePicker
      .picker()
      .then(image => {
        setImage(image);
        setForm({
          ...form,
          image: {
            uri: image.path,
            type: image.mime,
            name: 'image.jpg',
          },
        });
        // console.log(image);
      })
      .catch(err => {
        console.log(err);
      });
    setModalPfp(false);
  };
  const openCamera = () => {
    imagePicker
      .camera()
      .then(image => {
        setImage(image);
        setForm({
          ...form,
          image: {
            uri: image.path,
            type: image.mime,
            name: 'image.jpg',
          },
        });
        // console.log(image);
      })
      .catch(err => {
        console.log(err);
      });
    setModalPfp(false);
  };

  const categories = [
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

  const disabled =
    form.category_id === '' ||
    form.name === '' ||
    form.price === '' ||
    form.desc === '' ||
    (_.isEqual(form.name, data.name) &&
      form.image.uri === '' &&
      _.isEqual(form.category_id, data.category_id) &&
      _.isEqual(form.price, JSON.stringify(data.price)) &&
      _.isEqual(form.desc, data.desc));
  isLoading;

  const modalResult = error !== '' || success !== '';
  const closeResult = () => {
    setError('');
    setSuccess('');
  };

  return (
    <>
      <Modal isVisible={modalPfp} onBackdropPress={() => setModalPfp(false)}>
        <View className="bg-white rounded-lg">
          <Text className="font-global text-black text-lg font-bold text-center py-4">
            Select image:
          </Text>
          <Pressable
            className="py-3 border-t border-gray-300"
            onPress={openCamera}>
            <Text className="text-black text-center">Camera</Text>
          </Pressable>
          <Pressable
            className="py-3 border-t border-gray-300"
            onPress={pickPhoto}>
            <Text className="text-black text-center">Gallery</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal isVisible={modalResult} onBackdropPress={closeResult}>
        <View className="bg-white rounded-lg">
          <Text className="font-global text-black text-lg font-bold text-center pt-4">
            {success !== '' ? 'Success' : 'Changes not saved'}
          </Text>
          <Text className="font-global text-black text-sm font-medium text-center pb-4 pt-2">
            {success !== '' ? 'Product successfully added!' : error}
          </Text>
          {success !== '' ? (
            <View className="flex-row">
              <Pressable
                className="flex-1 py-4 border-t border-gray-300 font-medium border-r"
                onPress={() => setSuccess('')}>
                <Text className="text-black text-center">Add another</Text>
              </Pressable>
              <Pressable
                className="flex-1 py-4 border-t border-gray-300 font-medium"
                onPress={() =>
                  nav.navigate('ProductDetail', {product_id: success})
                }>
                <Text className="text-black text-center">Go to product</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              className="py-4 border-t border-gray-300 font-medium"
              onPress={closeResult}>
              <Text className="text-black text-center">OK</Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <View className="flex-1 bg-[#ECECEC]">
        <View className="px-10 py-6 flex-row justify-between items-center">
          <Pressable onPress={() => nav.goBack()}>
            <BackIcon />
          </Pressable>
          <Text className="font-global text-black text-base font-bold">
            Edit Product
          </Text>

          <Text></Text>
        </View>
        <ScrollView>
          <View className="items-center mt-5">
            <View>
              <Skeleton
                h={200}
                w={200}
                rounded={'full'}
                isLoaded={!dataLoad}
                startColor={'gray.300'}
                endColor={'gray.400'}>
                <Image
                  source={
                    image.path !== ''
                      ? {uri: image.path}
                      : data.img
                      ? {uri: data.img}
                      : productPlaceholder
                  }
                  className="w-[200] h-[200] aspect-square rounded-full bg-white mx-auto"
                  style={{resizeMode: 'cover'}}
                />
                <Pressable
                  onPress={() => setModalPfp(true)}
                  className="bg-primary w-[40] h-[40] items-center justify-center rounded-full absolute bottom-0 right-0">
                  <PenIcon />
                </Pressable>
              </Skeleton>
            </View>
          </View>
          <View className="px-8 mt-8">
            <Skeleton
              h={6}
              isLoaded={!dataLoad}
              w={20}
              startColor={'gray.300'}
              endColor={'gray.400'}>
              <Text className="font-global text-black font-black text-lg mt-2">
                Name
              </Text>
            </Skeleton>

            <Skeleton
              marginTop="2"
              isLoaded={!dataLoad}
              startColor={'gray.300'}
              endColor={'gray.400'}>
              <TextInput
                placeholderTextColor={'#9A9A9D'}
                className="font-global text-black text-sm border-b border-[#9F9F9F] py-1"
                placeholder="Input the product name min. 30 characters"
                value={form.name}
                onChange={e => setForm({...form, name: e.nativeEvent.text})}
              />
            </Skeleton>

            <Skeleton
              h={6}
              isLoaded={!dataLoad}
              w={24}
              startColor={'gray.300'}
              endColor={'gray.400'}
              marginTop="6">
              <Text className="font-global text-black font-black text-lg mt-6">
                Category
              </Text>
            </Skeleton>

            <Skeleton
              marginTop="2"
              isLoaded={!dataLoad}
              startColor={'gray.300'}
              endColor={'gray.400'}>
              <Select
                selectedValue={form.category_id}
                variant="unstyled"
                accessibilityLabel="Choose category"
                placeholder="Choose category"
                borderBottomWidth={1}
                borderBottomColor={'#9F9F9F'}
                color={'black'}
                fontFamily={'Poppins'}
                fontSize={14}
                _selectedItem={{
                  color: 'black',
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue =>
                  setForm({...form, category_id: itemValue})
                }>
                {categories.map(({name, id}) => (
                  <Select.Item label={name} value={id} key={id} />
                ))}
              </Select>
            </Skeleton>

            <Skeleton
              h={6}
              isLoaded={!dataLoad}
              w={16}
              startColor={'gray.300'}
              endColor={'gray.400'}
              marginTop="6">
              <Text className="font-global text-black font-black text-lg mt-6">
                Price
              </Text>
            </Skeleton>

            <Skeleton
              marginTop="2"
              isLoaded={!dataLoad}
              startColor={'gray.300'}
              endColor={'gray.400'}>
              <TextInput
                placeholderTextColor={'#9A9A9D'}
                className="font-global text-black text-sm border-b border-[#9F9F9F] py-1 mt-2"
                placeholder="Input the product price"
                keyboardType="numeric"
                value={form.price}
                onChange={e => setForm({...form, price: e.nativeEvent.text})}
              />
            </Skeleton>

            <Skeleton
              h={6}
              isLoaded={!dataLoad}
              w={32}
              startColor={'gray.300'}
              endColor={'gray.400'}
              marginTop="6">
              <Text className="font-global text-black font-black text-lg mt-6">
                Description
              </Text>
            </Skeleton>

            <Skeleton
              marginTop="2"
              isLoaded={!dataLoad}
              startColor={'gray.300'}
              endColor={'gray.400'}>
              <TextInput
                placeholderTextColor={'#9A9A9D'}
                className="font-global text-black text-sm border-b border-[#9F9F9F] py-1 mt-2"
                placeholder="Describe your product min. 150 characters"
                multiline
                value={form.desc}
                onChange={e => setForm({...form, desc: e.nativeEvent.text})}
              />
            </Skeleton>

            <Skeleton
              marginTop="10"
              marginBottom="6"
              h={16}
              isLoaded={!dataLoad}
              startColor={'gray.300'}
              endColor={'gray.400'}>
              <TouchableOpacity
                className={`${
                  disabled ? 'bg-gray-500' : 'bg-[#6A4029]'
                }  py-5 rounded-2xl w-full flex-row justify-center mt-10 mb-6`}
                onPress={saveHandler}
                disabled={disabled}>
                {isLoading && (
                  <ActivityIndicator color={'white'} className="mr-3" />
                )}
                <Text
                  className={`font-global text-center text-white text-base font-bold`}>
                  Save changes
                </Text>
              </TouchableOpacity>
            </Skeleton>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default EditPromo;
