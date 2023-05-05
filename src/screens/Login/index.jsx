import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Login</Text>
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.homeBtnText}>back to Welcome</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  homeBtn: {
    borderRadius: 20,
    backgroundColor: 'black',
    marginTop: 10,
    padding: 10,
  },
  homeBtnText: {
    color: '#FFF',
  },
});

export default Login;
