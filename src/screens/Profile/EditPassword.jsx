import React, {useMemo, useState} from 'react';

import _ from 'lodash';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import HidePassIcon from '../../assets/icons/eye-password-hide.svg';
import ShowPassIcon from '../../assets/icons/eye-password-show.svg';
import {editPassword} from '../../utils/https/auth';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const EditPassword = () => {
  const nav = useNavigation();
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [view, setView] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setLoading] = useState(false);
  const auth = useSelector(state => state.auth);
  const controller = useMemo(() => new AbortController(), []);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    response: '',
  });
  const formHandler = () => {
    setLoading(true);
    editPassword(form, auth.data.token, controller)
      .then(result => {
        console.log('hooh');
        setSuccess(true);
        setForm({oldPassword: '', newPassword: '', confirmPassword: ''});
      })
      .catch(err => {
        console.log(err);
        console.log(err.response?.data);
        if (err.response?.data?.msg) {
          return setError({...error, response: err.response?.data?.msg});
        }
        setError({
          ...error,
          response:
            "An error ocurred and your password can't change now. Try again later",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const disabled =
    form.confirmPassword === '' ||
    form.newPassword === '' ||
    form.oldPassword === '' ||
    error.confirmPassword !== '' ||
    error.newPassword !== '' ||
    error.oldPassword !== '' ||
    isLoading;

  const changeHandler = (name, text) => {
    let newErr = {
      //   newPassword: '',
      //   oldPassword: '',
      //   confirmPassword: '',
    };
    if (name === 'oldPassword' && _.isEqual(form.newPassword, text)) {
      newErr.newPassword = 'The new password cannot same as the old one';
    }
    if (name === 'newPassword' && _.isEqual(form.oldPassword, text)) {
      newErr.newPassword = 'The new password cannot same as the old one';
    }
    if (name === 'confirmPassword' && !_.isEqual(form.newPassword, text)) {
      newErr.confirmPassword = 'New password confirmation must same';
    }

    if (name === 'newPassword' && !_.isEqual(form.confirmPassword, text)) {
      newErr.confirmPassword = 'New password confirmation must same';
    }

    if (
      !newErr.newPassword &&
      (name === 'oldPassword' || name === 'newPassword')
    ) {
      newErr.newPassword = '';
    }
    if (
      !newErr.confirmPassword &&
      (name === 'confirmPassword' || name === 'newPassword')
    ) {
      newErr.confirmPassword = '';
    }

    setError({...error, ...newErr});
    setForm({...form, [name]: text});
  };

  return (
    <>
      <Modal
        isVisible={error.response !== ''}
        onBackdropPress={() => setError({...error, response: ''})}>
        <View className="bg-white rounded-lg">
          <Text className="font-global text-black text-lg font-bold text-center py-4">
            Changes not saved
          </Text>
          <Text className="font-global text-black text-sm font-medium text-center pb-4">
            {error.response}
          </Text>
          <Pressable
            className="py-3 border-t border-gray-300"
            onPress={() => setError({...error, response: ''})}>
            <Text className="text-black text-base text-center">OK</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal isVisible={success} onBackdropPress={() => setSuccess(false)}>
        <View className="bg-white rounded-lg">
          <Text className="font-global text-black text-lg font-bold text-center py-4">
            Changes saved
          </Text>
          <Text className="font-global text-black text-sm font-medium text-center pb-4">
            Password successfully changed
          </Text>
          <Pressable
            className="py-3 border-t border-gray-300"
            onPress={() => setSuccess(false)}>
            <Text className="text-black text-base text-center">OK</Text>
          </Pressable>
        </View>
      </Modal>
      <View className="flex-1 bg-[#ECECEC]">
        <View className="px-10 py-6 flex-row justify-between items-center">
          <Pressable onPress={() => nav.goBack()} className="pr-4">
            <BackIcon />
          </Pressable>

          <Text></Text>
        </View>
        <ScrollView className="px-8">
          <Text className="font-global text-black text-2xl font-bold">
            Edit Password
          </Text>
          <Text className="font-global text-black text-sm mt-3">
            Your password must be more than 8 characters long and contain a
            combination of numbers and letters
          </Text>

          <View className="relative">
            <TextInput
              placeholderTextColor={'#9A9A9D'}
              className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-5"
              placeholder="Current password"
              value={form.oldPassword}
              secureTextEntry={!view.oldPassword}
              onChange={e => changeHandler('oldPassword', e.nativeEvent.text)}
            />
            <Pressable
              className="absolute right-0 top-6 px-2"
              onPress={() =>
                setView({...view, oldPassword: !view.oldPassword})
              }>
              {view.oldPassword ? (
                <HidePassIcon width={20} height={20} />
              ) : (
                <ShowPassIcon width={20} height={20} />
              )}
            </Pressable>
          </View>
          <Text className="font-global text-black">{error.oldPassword}</Text>

          <View className="relative">
            <TextInput
              placeholderTextColor={'#9A9A9D'}
              className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-5"
              placeholder="New password"
              value={form.newPassword}
              secureTextEntry={!view.newPassword}
              onChange={e => changeHandler('newPassword', e.nativeEvent.text)}
            />
            <Pressable
              className="absolute right-0 top-6 px-2"
              onPress={() =>
                setView({...view, newPassword: !view.newPassword})
              }>
              {view.newPassword ? (
                <HidePassIcon width={20} height={20} />
              ) : (
                <ShowPassIcon width={20} height={20} />
              )}
            </Pressable>
          </View>
          <Text className="font-global text-black">{error.newPassword}</Text>

          <View className="relative">
            <TextInput
              placeholderTextColor={'#9A9A9D'}
              className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-5"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              secureTextEntry={!view.confirmPassword}
              onChange={e =>
                changeHandler('confirmPassword', e.nativeEvent.text)
              }
            />
            <Pressable
              className="absolute right-0 top-6 px-2"
              onPress={() =>
                setView({...view, confirmPassword: !view.confirmPassword})
              }>
              {view.confirmPassword ? (
                <HidePassIcon width={20} height={20} />
              ) : (
                <ShowPassIcon width={20} height={20} />
              )}
            </Pressable>
          </View>
          <Text className="font-global text-black">
            {error.confirmPassword}
          </Text>
        </ScrollView>
        <View className="px-8 mb-5">
          <TouchableOpacity
            disabled={disabled}
            onPress={formHandler}
            className={`${
              disabled ? 'bg-gray-500' : 'bg-[#6A4029]'
            }  py-5 rounded-2xl w-full flex-row justify-center mt-6`}>
            {isLoading && (
              <ActivityIndicator color={'white'} className="mr-3" />
            )}
            <Text
              className={`font-global text-center text-white text-base font-bold `}>
              Save and update
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default EditPassword;
