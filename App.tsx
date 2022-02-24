//import React from 'react';
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

import { RootNavigator } from './navigation/RootNavigator';
import { createReduxStore } from './sdk/helper';
import reducers from './store';
import { dark } from './styles/color.theme';

import * as Linking from 'expo-linking';

const store = createReduxStore(reducers);

export default function App() {
  const [fontLoaded] = useFonts({
    'Play-Bold': require('./assets/fonts/Play-Bold.ttf'),
    'Play-Regular': require('./assets/fonts/Play-Regular.ttf'),
  });
  
  // TODO: Add deep link for universal links
  //*** INICIO DE COMENTARIOS */
  
  const prefix = Linking.createURL('/');

  const [data, setData] = useState(null);

  const getInitialUrl = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) setData(Linking.parse(initialUrl));
  };
  
  useEffect(() => {
     Linking.addEventListener("url", handleDeepLink);
     if (!data) {
       getInitialUrl();
     }
  
     return (() => {
       Linking.removeEventListener("url", handleDeepLink);
     });
  }, []);
  
  const handleDeepLink = (event) => {
     const data = Linking.parse(event.url);
     setData(data);
  };

  //*** FINAL DE COMENTARIOS */

  console.log("Paso 6");
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        {fontLoaded ? <RootNavigator /> : <AppLoading />}
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
  },
});
