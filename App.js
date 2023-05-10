import React, {useEffect} from 'react'; //import useEffect();

import SplashScreen from 'react-native-splash-screen'; //import SplashScreen

import Router from './src/router';

const App = () => {
  //   const theme = {
  //     ...DefaultTheme,
  //     colors: {
  //       ...DefaultTheme.colors,
  //       border: "transparent",
  //     }
  //   }
  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);

  return <Router />;
};
export default App;
