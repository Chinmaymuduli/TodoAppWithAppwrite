import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './Routes';
import {AppContextProvider} from './src/appwrite';

const App = () => {
  return (
    <NavigationContainer>
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    </NavigationContainer>
  );
};

export default App;
