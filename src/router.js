import React from 'react';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import DrawerContent from './components/Drawer';
import ForgotPass from './screens/Auth/ForgotPass';
import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import Home from './screens/Home';
import ProductList from './screens/Product';
import Cart from './screens/Product/Cart';
import ProductDetail from './screens/Product/Detail';
import DeliveryMethod from './screens/Transaction/DeliveryMethod';
import Payment from './screens/Transaction/Payment';
import Welcome from './screens/Welcome';
import {
  persistor,
  store,
} from './store';
import {Text} from './utils/wrapper/nativewind';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {width: '80%', borderTopRightRadius: 16},
      }}
      drawerContent={DrawerContent}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}
const WelcomeStack = () => {
  const {Navigator, Screen} = createStackNavigator();
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="Welcome" component={Welcome} />

      <Screen name="Login" component={Login} />
      <Screen name="Register" component={Register} />

      <Screen name="ProductList" component={ProductList} />
      <Screen name="ProductDetail" component={ProductDetail} />

      <Screen name="Cart" component={Cart} />
      <Screen name="DeliveryMethod" component={DeliveryMethod} />
      <Screen name="Payment" component={Payment} />

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
