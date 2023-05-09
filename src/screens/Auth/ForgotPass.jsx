import React, {
  useMemo,
  useState,
} from 'react';

import Modal from 'react-native-modal';

import FpImage from '../../assets/illustrations/forgotpass.svg';
import {requestResetPass} from '../../utils/https/auth';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const ForgotPass = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [sent, setSent] = useState(false);

  const controller = useMemo(() => new AbortController(), []);

  const formHandler = () => {
    if (!form.email) {
      setError('Input your email');
      setModalVisible(true);
      return;
    }
    setIsLoading(true);

    requestResetPass(form.email, controller)
      .then(result => {
        setIsLoading(false);
        setSent(true);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        setModalVisible(true);
        if (err?.response?.data?.msg) {
          setError(err.response.data.msg);
          return;
        }
        setError('Email not registered yet');
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
          <Text className="font-global text-error text-lg text-center">
            {error}
          </Text>
          <Pressable
            className="bg-primary px-5 py-2 rounded-lg"
            onPress={() => setModalVisible(false)}>
            <Text className="font-global text-white">OK</Text>
          </Pressable>
        </View>
      </Modal>
      <View className="flex-1 items-center justify-center px-6 py-5">
        <Text
          style={{fontSize: 65, lineHeight: 70, letterSpacing: -3}}
          className="font-global text-black font-bold w-full mb-4 text-center">
          Don’t Worry!
        </Text>
        <Text
          style={{letterSpacing: 0.1}}
          className="font-global text-black text-center max-w-xs text-base">
          We’ve just sent a link to your email to request a new password
        </Text>
        <FpImage width={400} height={300} />
        {sent ? (
          <View className="w-full">
            <Text className="font-global text-black text-center mt-4 text-base">
              Haven’t received any link?
            </Text>
            <TouchableOpacity
              className={`${
                isLoading ? 'bg-gray-500' : 'bg-[#6A4029]'
              }  py-5 rounded-2xl w-full flex-row justify-center mt-6`}
              onPress={formHandler}
              disabled={isLoading}>
              {isLoading && (
                <ActivityIndicator className="mr-3" color={'#FFF'} />
              )}
              <Text
                className={`font-global text-center text-white text-base font-bold `}>
                Resend Link
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="w-full mt-5">
              <TextInput
                placeholderTextColor={'#9A9A9D'}
                className="font-global text-black text-base border-b border-[#9F9F9F] py-1"
                placeholder="Enter your email address"
                value={form.email}
                onChange={e => setForm({...form, email: e.nativeEvent.text})}
              />
            </View>
            <TouchableOpacity
              className={`${
                isLoading ? 'bg-gray-500' : 'bg-[#6A4029]'
              }  py-5 rounded-2xl w-full flex-row justify-center mt-6`}
              onPress={formHandler}
              disabled={isLoading}>
              {isLoading && (
                <ActivityIndicator className="mr-3" color={'#FFF'} />
              )}
              <Text
                className={`font-global text-center text-white text-base font-bold `}>
                Send Link
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

export default ForgotPass;
