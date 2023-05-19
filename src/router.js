/* eslint-disable prettier/prettier */
import React, {useEffect, useMemo} from 'react';

import _ from 'lodash';
import {extendTheme, NativeBaseProvider} from 'native-base';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ArrowIcon from './assets/icons/drawer/arrow.svg';
import menuIcon from './assets/icons/drawer/menu.svg';
import orderIcon from './assets/icons/drawer/order.svg';
import privacyIcon from './assets/icons/drawer/privacy-policy.svg';
import profileIcon from './assets/icons/drawer/profile.svg';
import securityIcon from './assets/icons/drawer/security.svg';
import profilePlaceholder from './assets/images/profile-img-placeholder.png';
import AdminDashboard from './screens/Admin';
import ManageOrder from './screens/Admin/ManageOrder';
import OrderDetail from './screens/Admin/OrderDetail';
// import DrawerContent from './components/Drawer';
import ForgotPass from './screens/Auth/ForgotPass';
import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import Home from './screens/Home';
import PrivacyPolicy from './screens/Home/PrivacyPolicy';
import ProductList from './screens/Product';
import Cart from './screens/Product/Cart';
import CreateProduct from './screens/Product/Create';
import ProductDetail from './screens/Product/Detail';
import EditProduct from './screens/Product/Edit';
import Profile from './screens/Profile';
import EditPassword from './screens/Profile/EditPassword';
import History from './screens/Profile/History';
import HistoryDetail from './screens/Profile/HistoryDetail';
import CreatePromo from './screens/Promo/CreatePromo';
import EditPromo from './screens/Promo/EditPromo';
import DeliveryMethod from './screens/Transaction/DeliveryMethod';
import Payment from './screens/Transaction/Payment';
import Result from './screens/Transaction/Result';
import Welcome from './screens/Welcome';
import {persistor, store} from './store';
import {authActions} from './store/slices/auth.slice';
import {profileAction} from './store/slices/profile.slice';
import {logout} from './utils/https/auth';
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
  const dispatch = useDispatch();
  // console.log(auth);

  let routes;
  switch (Number(auth.data.role)) {
    case 2:
      routes = [
        {
          path: 'Profile',
          title: 'Edit Profile',
          Icon: profileIcon,
          needLogin: true,
        },
        {
          path: 'ManageOrder',
          title: 'Orders',
          Icon: orderIcon,
          needLogin: true,
        },
        {
          path: 'ProductList',
          title: 'All menu',
          Icon: menuIcon,
          needLogin: false,
        },
        {
          path: 'AdminDashboard',
          title: 'Sales Report',
          Icon: privacyIcon,
          needLogin: true,
        },
        {
          path: 'EditPassword',
          title: 'Security',
          Icon: securityIcon,
          needLogin: true,
        },
      ];
      break;

    default:
      routes = [
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
          path: 'EditPassword',
          title: 'Security',
          Icon: securityIcon,
          needLogin: true,
        },
      ];
      break;
  }

  return (
    <View className="flex-1 bg-drawer">
      <View className="bg-primary rounded-br-3xl items-center py-8">
        <Image
          source={
            auth.data.isLogin && profile.data.img
              ? {uri: profile.data.img}
              : profilePlaceholder
          }
          className="rounded-full mb-2 bg-white"
          // eslint-disable-next-line react-native/no-inline-styles
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
            <View className="h-[0.3] bg-primary w-[80%] mx-auto" />
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
          </View>
        ))}
      </View>
      {auth.data.isLogin && (
        <View className="mt-auto mb-6 px-5">
          <Pressable
            className="flex-row items-center"
            onPress={() => dispatch(authActions.openModal())}>
            <Text className="font-global text-primary text-lg ml-3 font-semibold mr-3">
              Sign-out
            </Text>
            <ArrowIcon />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const Drawer = createDrawerNavigator();

function HomeDrawer() {
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
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{swipeEnabled: false}}
      />
      <Drawer.Screen
        name="History"
        component={History}
        options={{swipeEnabled: false}}
      />
      <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{swipeEnabled: false}}
      />
    </Drawer.Navigator>
  );
}
const WelcomeStack = () => {
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  const controller = useMemo(() => new AbortController(), [auth.data.isLogin]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.data.isLogin) {
      // console.log(profile);
      if (!profile.isFulfilled && !profile.isLoading && !profile.isRejected) {
        dispatch(
          profileAction.getProfileThunk({token: auth.data.token, controller}),
        );
      }

      if (auth.data.exp * 1000 < Date.now()) {
        dispatch(authActions.reset());
        dispatch(profileAction.reset());
        logout(auth.data.token, controller)
          .then(result => {
            console.log('success logout');
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    } else {
      if (profile.isFulfilled) {
        dispatch(profileAction.reset());
      }
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

      <Screen name="EditPassword" component={EditPassword} />

      <Screen name="CreateProduct" component={CreateProduct} />
      <Screen name="EditProduct" component={EditProduct} />

      <Screen name="AdminDashboard" component={AdminDashboard} />
      <Screen name="ManageOrder" component={ManageOrder} />
      <Screen name="OrderDetail" component={OrderDetail} />

      <Screen name="HistoryDetail" component={HistoryDetail} />

      <Screen name="CreatePromo" component={CreatePromo} />
      <Screen name="EditPromo" component={EditPromo} />

      <Screen name="Cart" component={Cart} />
      <Screen name="DeliveryMethod" component={DeliveryMethod} />
      <Screen name="Payment" component={Payment} />
      <Screen name="Result" component={Result} />

      <Screen name="ForgotPass" component={ForgotPass} />
      <Screen name="HomeDrawer" component={HomeDrawer} />
    </Navigator>
  );
};

const Router = () => {
  const theme = extendTheme({
    colors: {
      // Add new color
      primary: '#6A4029',
      secondary: '#ffba33',
      // Redefining only one shade, rest of the color will remain same.
      amber: {
        400: '#d97706',
      },
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'dark',
    },
  });

  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <WelcomeStack />
          </NavigationContainer>
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
};

export default Router;
