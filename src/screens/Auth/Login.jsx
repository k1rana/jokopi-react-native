import React from 'react';

import {View} from 'react-native';

import LoginImage from '../../assets/illustrations/login.svg';
import {TextInput} from '../../utils/wrapper/nativewind';

const Login = () => {
  return (
    <View className="px-6 items-center">
      <LoginImage width={400} height={300} />
      <TextInput
        placeholderTextColor={'#9A9A9D'}
        className="font-global text-black"
        placeholder="Enter your email address"
      />

      <TextInput
        placeholderTextColor={'#9A9A9D'}
        className="font-global text-black"
        placeholder="Enter your password"
        secureTextEntry={true}
        passwordRules={{required: 'digit'}}
      />
    </View>
  );
};

export default Login;
