import React from 'react';

import {styled} from 'nativewind';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import WelcomeImage from '../../assets/illustrations/welcome.svg';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <StyledView className="flex-1 justify-center items-center font-bold px-7 py-2">
      <StyledText
        style={{fontSize: 70, lineHeight: 80}}
        className="font-global text-black tracking-[-2] font-bold w-full mb-4">
        Coffee for Everyone
      </StyledText>
      <WelcomeImage width={600} height={400} />
      <StyledPressable
        className="bg-[#6A4029] py-5 rounded-2xl w-full"
        onPress={() => navigation.navigate('Login')}>
        <StyledText className="font-global text-center text-white text-lg font-bold">
          Get Started
        </StyledText>
      </StyledPressable>
    </StyledView>
  );
};

export default Welcome;
