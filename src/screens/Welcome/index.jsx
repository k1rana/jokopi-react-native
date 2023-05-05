import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#F2F2F2'}}>
      <Text style={{fontSize: 40, color: 'black', fontWeight: 700}}>
        Coffee for Everyone
      </Text>

      <Pressable
        style={styles.homeBtn}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.homeBtnText}>Login</Text>
      </Pressable>
    </View>
  );
};

export default Welcome;

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
