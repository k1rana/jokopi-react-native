import React from 'react';

import {styled} from 'nativewind';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';

const StyledView = styled(View);
const StyledText = styled(Text);

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <StyledView className="font-bold px-2">
      <Text style={styles.textTitle}>Coffee for Everyone</Text>
      <StyledText className="font-bold text-slate-900">
        Halo selamat datang!
      </StyledText>
      <Pressable
        style={styles.homeBtn}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.homeBtnText}>Login</Text>
      </Pressable>
    </StyledView>
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
  textTitle: {
    fontFamily: 'Poppins',
    letterSpacing: -2,
    fontSize: 40,
    color: 'black',
    fontWeight: 700,
  },
});
