import React, {useEffect} from 'react';

import {useDispatch} from 'react-redux';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import successIcon from '../../assets/images/check.png';
import failedIcon from '../../assets/images/close.png';
import {cartActions} from '../../store/slices/cart.slice';
import {
  Image,
  Text,
  View,
} from '../../utils/wrapper/nativewind';

const Result = () => {
  const router = useRoute();
  const {success, failed} = router.params;

  const data = {
    msg: success ? 'Transaction success' : 'Transaction success',
    Icon: success ? successIcon : failedIcon,
  };

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      dispatch(cartActions.resetCart());
      navigation.navigate('Home');
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, []);
  return (
    <View className="flex-1 bg-[#F2F2F2] items-center justify-center">
      <Image className="w-12 h-12" source={data.Icon}></Image>
      <Text className="mt-2 font-global text-primary text-lg font-semibold">
        {data.msg}
      </Text>
      <Text className="mt-5 font-global text-black">
        Redirecting to Home in 3 seconds...
      </Text>
    </View>
  );
};

export default Result;
