import React, {
  useMemo,
  useState,
} from 'react';

import {View} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import GoogleIcon from '../../assets/icons/google.svg';
import LoginImage from '../../assets/illustrations/login.svg';
import {login} from '../../utils/https/auth';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
} from '../../utils/wrapper/nativewind';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const nav = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const controller = useMemo(() => new AbortController(), []);
  const state = useSelector(state => state.auth);

  const setErrMsg = msg => {
    setModalVisible(true);
    setError(msg);
  };

  const formHandler = () => {
    if (!form.email) return setErrMsg('Input your email');
    if (!form.password) return setErrMsg('Input your password');
    setIsLoading(true);
    login({email: form.email, password: form.password}, controller)
      .then(result => {
        setIsLoading(false);
        console.log('Success login');
      })
      .catch(err => {
        setIsLoading(false);
        setErrMsg("Email and password doesn't match");
      });
  };
  return (
    <>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
        }}>
        <View className="bg-white py-4 px-4 items-center justify-center gap-y-3 rounded-lg">
          <Text className="font-global text-error text-lg">{error}</Text>
          <Pressable
            className="bg-primary px-5 py-2 rounded-lg"
            onPress={() => setModalVisible(false)}>
            <Text className="font-global text-white">OK</Text>
          </Pressable>
        </View>
      </Modal>
      <View className="flex-1 px-6 items-center justify-center">
        <LoginImage width={400} height={300} />

        <View className="w-full gap-y-4 justify-start">
          <TextInput
            placeholderTextColor={'#9A9A9D'}
            className="font-global text-black text-base border-b border-[#9F9F9F] py-1"
            placeholder="Enter your email address"
            value={form.email}
            onChange={e => setForm({...form, email: e.nativeEvent.text})}
          />

          <TextInput
            placeholderTextColor={'#9A9A9D'}
            className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mb-2"
            placeholder="Enter your password"
            secureTextEntry={true}
            passwordRules={{required: 'digit'}}
            value={form.password}
            onChange={e => setForm({...form, password: e.nativeEvent.text})}
          />
          <Pressable onPress={() => nav.navigate('ForgotPass')}>
            <Text className="font-global text-primary text-sm underline mb-7">
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        <Pressable
          className={`${
            isLoading ? 'bg-gray-500' : 'bg-[#6A4029]'
          }  py-5 rounded-2xl w-full flex-row justify-center mb-8`}
          onPress={formHandler}
          disabled={isLoading}>
          {isLoading && <ActivityIndicator className="mr-3" color={'#FFF'} />}
          <Text
            className={`font-global text-center text-white text-base font-bold `}>
            Login
          </Text>
        </Pressable>
        <View className="h-[1] w-full bg-[#9F9F9F] -mb-3"></View>
        <Text className="font-global text-[#9A9A9D] bg-[#f2f2f2] px-5">
          or login with
        </Text>
        <Pressable
          className={`${
            isLoading && `bg-gray-200`
          } border border-[#C7C7C7] py-5 rounded-2xl w-full flex-row justify-center items-center bg-white mt-4 `}
          onPress={() => nav.navigate('MyDrawer')}>
          <GoogleIcon width={20} height={20} />
          <Text className="font-global text-center text-black text-base font-medium  ml-2">
            Login with Google
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default Login;
