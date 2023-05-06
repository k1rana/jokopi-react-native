import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './screens/Login';
import Welcome from './screens/Welcome';

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
