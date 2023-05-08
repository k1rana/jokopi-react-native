import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';

import profilePlaceholder from '../assets/images/profile-img-placeholder.png';
import {
  BaseButton,
  Image,
  Pressable,
  RectButton,
  Text,
  View,
} from '../utils/wrapper/nativewind';

const DrawerContent = () => {
  const [login, setLogin] = useState(false);
  const nav = useNavigation();
  return (
    <View className="flex-1 bg-drawer">
      <View className="bg-primary rounded-br-2xl items-center py-8">
        <Image
          source={profilePlaceholder}
          className="rounded-full mb-2"
          style={{
            width: 100,
            height: 100,
            aspectRatio: '1/1',
            resizeMode: 'cover',
          }}
        />
        <View className="min-h-[3rem] items-center">
          {login ? (
            <>
              <Text className="font-global text-white text-lg font-semibold text-center">
                Zulaikha
              </Text>
              <Text className="font-global text-white text-base text-center">
                zulaikha17@gmail.com
              </Text>
            </>
          ) : (
            <View className="flex-row mt-3 gap-x-3">
              <Pressable>
                <RectButton onPress={() => nav.navigate('Login')}>
                  <View className="bg-white py-2 px-4 rounded-md">
                    <Text className="font-global text-primary">Login</Text>
                  </View>
                </RectButton>
              </Pressable>
              <Pressable>
                <BaseButton onPress={() => nav.navigate('Register')}>
                  <View className="bg-transparent border-white border  py-2 px-4 rounded-md">
                    <Text className="font-global text-global">Register</Text>
                  </View>
                </BaseButton>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default DrawerContent;
