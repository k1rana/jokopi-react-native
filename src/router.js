import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './screens/Login';
import Welcome from './screens/Welcome';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
}
const WelcomeStack = () => {
  const {Navigator, Screen} = createStackNavigator();
  return (
    <Navigator>
      <Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="MyDrawer"
        component={MyDrawer}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
};

const Router = () => {
  return (
    <NavigationContainer>
      <WelcomeStack />
    </NavigationContainer>
  );
};

export default Router;
