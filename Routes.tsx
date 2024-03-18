import React, {useEffect, useState} from 'react';
import PrivateRoutes from './src/routes/PrivateRoutes';
import PublicRoutes from './src/routes/PublicRoutes';
import {ActivityIndicator, Text, View} from 'react-native';
import {useAppContext} from './src/appwrite';

const Routes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {appwrite, isLoggedIn, setIsLoggedIn} = useAppContext();

  useEffect(() => {
    appwrite
      .getCurrentUser()
      .then((response: any) => {
        setIsLoading(false);
        if (response) {
          setIsLoggedIn(true);
        }
      })
      .catch((_: any) => {
        setIsLoading(false);
        setIsLoggedIn(false);
      });
  }, [appwrite, setIsLoggedIn]);
  console.log({isLoggedIn});

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
        <Text style={{fontSize: 15, color: 'red'}}>Loading</Text>
      </View>
    );
  }

  return isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />;
};

export default Routes;
