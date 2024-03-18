import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, SignUp} from '../screen/Auth';

export type PublicRoutesTypes = {
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<PublicRoutesTypes>();

const PublicRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: '#000',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default PublicRoutes;
