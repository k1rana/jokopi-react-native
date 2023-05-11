import React, {
  useEffect,
  useMemo,
} from 'react';

import _ from 'lodash';
import {
  Provider,
  useDispatch,
  useSelector,
} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import menuIcon from './assets/icons/drawer/menu.svg';
import orderIcon from './assets/icons/drawer/order.svg';
import privacyIcon from './assets/icons/drawer/privacy-policy.svg';
import profileIcon from './assets/icons/drawer/profile.svg';
import securityIcon from './assets/icons/drawer/security.svg';
import profilePlaceholder from './assets/images/profile-img-placeholder.png';
// import DrawerContent from './components/Drawer';
import ForgotPass from './screens/Auth/ForgotPass';
import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import Home from './screens/Home';
import ProductList from './screens/Product';
import Cart from './screens/Product/Cart';
import ProductDetail from './screens/Product/Detail';
import Profile from './screens/Profile';
import History from './screens/Profile/History';
import DeliveryMethod from './screens/Transaction/DeliveryMethod';
import Payment from './screens/Transaction/Payment';
import Result from './screens/Transaction/Result';
import Welcome from './screens/Welcome';
import {
  persistor,
  store,
} from './store';
import {profileAction} from './store/slices/profile.slice';
import {
  BaseButton,
  Image,
  Pressable,
  RectButton,
  Text,
  View,
} from './utils/wrapper/nativewind';

const DrawerContent = ({auth, profile}) => {
  const nav = useNavigation();
  // console.log(auth);
  const routes = [
    {
      path: 'Profile',
      title: 'Edit Profile',
      Icon: profileIcon,
      needLogin: true,
    },
    {path: 'History', title: 'Orders', Icon: orderIcon, needLogin: true},
    {
      path: 'ProductList',
      title: 'All menu',
      Icon: menuIcon,
      needLogin: false,
    },
    {
      path: 'PrivacyPolicy',
      title: 'Privacy policy',
      Icon: privacyIcon,
      needLogin: false,
    },
    {
      path: 'PrivacyPolicy',
      title: 'Security',
      Icon: securityIcon,
      needLogin: false,
    },
  ];

  return (
    <View className="flex-1 bg-drawer">
      <View className="bg-primary rounded-br-3xl items-center py-8">
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
        <View className="min-h-[70] items-center">
          {auth.data.isLogin ? (
            <>
              <Text className="font-global text-white text-lg font-semibold text-center mt-2">
                {_.truncate(
                  profile.data?.display_name ||
                    _.split(profile.data?.email, '@')[0],
                  {
                    length: 20,
                    omission: '...',
                  },
                )}
              </Text>
              <Text className="font-global text-white text-base text-center">
                {_.truncate(profile.data?.email, {
                  length: 20,
                  omission: '...',
                })}
              </Text>
            </>
          ) : (
            <View className="flex-row mt-3 gap-x-3">
              <Pressable>
                <RectButton onPress={() => nav.navigate('Login')}>
                  <View className="bg-white py-2 px-4 rounded-md">
                    <Text className="font-global text-primary font-semibold">
                      Login
                    </Text>
                  </View>
                </RectButton>
              </Pressable>
              <Pressable>
                <BaseButton onPress={() => nav.navigate('Register')}>
                  <View className="bg-transparent border-white border  py-2 px-4 rounded-md">
                    <Text className="font-global text-global font-semibold">
                      Register
                    </Text>
                  </View>
                </BaseButton>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <View className="flex-col p-5 justify-center">
        {routes.map((item, key) => (
          <View key={key}>
            <Pressable
              className="flex-row py-5 items-center"
              onPress={() =>
                item.needLogin
                  ? auth.data.isLogin
                    ? nav.navigate(item.path)
                    : nav.navigate('Login')
                  : nav.navigate(item.path)
              }>
              <item.Icon width={22} />
              <Text className="font-global text-primary text-lg ml-3 font-semibold">
                {item.title}
              </Text>
            </Pressable>
            {routes.length > key + 1 ? (
              <View className="h-[0.3] bg-primary w-[80%] mx-auto" />
            ) : (
              ''
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const Drawer = createDrawerNavigator();

function MyDrawer() {
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {width: '80%', borderTopRightRadius: 16},
      }}
      drawerContent={() => <DrawerContent auth={auth} profile={profile} />}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}
const WelcomeStack = () => {
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  const controller = useMemo(() => new AbortController(), [auth.data.isLogin]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.data.isLogin && !profile.isFulfilled) {
      dispatch(
        profileAction.getProfileThunk({token: auth.data.token, controller}),
      );
    }
  }, [auth.data.isLogin]);
  // console.log(profile);
  const {Navigator, Screen} = createStackNavigator();
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="Welcome" component={Welcome} />

      <Screen name="Login" component={Login} />
      <Screen name="Register" component={Register} />

      <Screen name="ProductList" component={ProductList} />
      <Screen name="ProductDetail" component={ProductDetail} />

      <Screen name="Profile" component={Profile} />
      <Screen name="History" component={History} />

      <Screen name="Cart" component={Cart} />
      <Screen name="DeliveryMethod" component={DeliveryMethod} />
      <Screen name="Payment" component={Payment} />
      <Screen name="Result" component={Result} />

      <Screen name="ForgotPass" component={ForgotPass} />
      <Screen name="MyDrawer" component={MyDrawer} />
    </Navigator>
  );
};

const Router = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer>
          <WelcomeStack />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default Router;
