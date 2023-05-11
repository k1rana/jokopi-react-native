import React, {
  useMemo,
  useState,
} from 'react';

import {styled} from 'nativewind';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import GoogleIcon from '../../assets/icons/google.svg';
import LoadingIcon from '../../assets/icons/loading-btn.svg';
import RegisterImage from '../../assets/illustrations/signup.svg';
import {register} from '../../utils/https/auth';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from '../../utils/wrapper/nativewind';

const Register = () => {
  const StyledIcon = styled(LoadingIcon);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const auth = useSelector(state => state.auth);

  if (auth.data?.isLogin) {
    nav.navigate('Home');
  }
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    phone_number: '',
  });

  const controller = useMemo(() => new AbortController(), []);

  const setErrMsg = msg => {
    setModalVisible(true);
    setError(msg);
  };

  const formHandler = async () => {
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    const passRegex = /^(?=.*[0-9])(?=.*[a-z]).{8,}$/g;
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;

    // validation
    if (!form.email) return setErrMsg('Input your email address');
    if (!form.email.match(emailRegex))
      return setErrMsg('Invalid email address');
    if (!form.password) return setErrMsg('Input your password');
    if (form.password.length < 8)
      return setErrMsg('Password length minimum is 8');
    if (!form.password.match(passRegex))
      setErrMsg('Password must be combination alphanumeric');

    if (!form.phone_number) setErrMsg('Input your phone number');
    else if (!form.phone_number.match(phoneRegex))
      return setErrMsg('Invalid phone number');

    setIsLoading(true);
    register(
      {
        email: form.email,
        password: form.password,
        phone_number: form.phone_number,
      },
      controller,
    )
      .then(result => {
        setIsLoading(false);
        setModalVisible(true);
        setSuccess(true);
        setError('');
      })
      .catch(err => {
        setIsLoading(false);
        if (err?.response?.data?.msg) {
          setModalVisible(true);
          setError(err.response.data.msg);
        }
        console.log(err.response.data.msg);
      });
  };

  return (
    <View className="flex-1 px-6 items-center justify-center gap-y-4">
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          success ? nav.navigate('Login') : setModalVisible(false);
        }}>
        <View className="bg-white py-4 px-4 items-center justify-center gap-y-3 rounded-lg">
          {success ? (
            <Text className="font-global text-success text-lg">
              Register success
            </Text>
          ) : (
            <Text className="font-global text-error text-lg">{error}</Text>
          )}
          {success ? (
            <Pressable
              className="bg-primary px-5 py-2 rounded-lg"
              onPress={() => nav.navigate('Login')}>
              <Text className="font-global text-white">Go to login</Text>
            </Pressable>
          ) : (
            <Pressable
              className="bg-primary px-5 py-2 rounded-lg"
              onPress={() => setModalVisible(false)}>
              <Text className="font-global text-white">OK</Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <RegisterImage width={400} height={300} />
      <View className="w-full gap-y-4">
        <TextInput
          placeholderTextColor={'#9A9A9D'}
          className="font-global text-black text-base border-b border-[#9F9F9F] py-1"
          placeholder="Enter your email address"
          value={form.email}
          onChange={e => setForm({...form, email: e.nativeEvent.text})}
        />

        <TextInput
          placeholderTextColor={'#9A9A9D'}
          className="font-global text-black text-base border-b border-[#9F9F9F] py-1"
          placeholder="Enter your password"
          secureTextEntry={true}
          passwordRules={{required: 'digit'}}
          value={form.password}
          onChange={e => setForm({...form, password: e.nativeEvent.text})}
        />

        <TextInput
          placeholderTextColor={'#9A9A9D'}
          className="font-global text-black text-base border-b border-[#9F9F9F] mb-5 py-1"
          placeholder="Enter your phone number"
          value={form.phone_number}
          onChange={e => setForm({...form, phone_number: e.nativeEvent.text})}
        />

        <Pressable
          className={`${
            isLoading ? 'bg-gray-500' : 'bg-[#6A4029]'
          }  py-5 rounded-2xl w-full flex-row justify-center`}
          onPress={formHandler}
          disabled={isLoading}>
          {isLoading && <ActivityIndicator className="mr-3" color={'#FFF'} />}
          <Text
            className={`font-global text-center text-white text-base font-bold `}>
            Create Account
          </Text>
        </Pressable>

        <Pressable
          className={`${
            isLoading && `bg-gray-200`
          } border-2 py-3 rounded-2xl w-full flex-row justify-center items-center`}
          onPress={() => nav.navigate('MyDrawer')}>
          <GoogleIcon width={20} height={20} />
          <Text className="font-global text-center text-primary text-base font-bold ml-2">
            Create with Google
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Register;
