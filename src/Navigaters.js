import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Splash from './screens/Splash';
import LoginScreen from './screens/LoginScreen';
import ForgetPassword from './screens/ForgetPassword';
import ChangePassword from './screens/ChangePassword';
import BottomNav from './BottomNav';
import ShowComplianceJourney from './screens/ShowComplianceJourney';
import NavigationService from './NavigationService';
import ShowError from './screens/ErrorHandling/ShowError';

const Stack = createNativeStackNavigator();

export default function Navigaters() {
  return (
    <NavigationContainer
      ref={ref => {
        NavigationService.setTopLevelNavigator(ref);
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Password_Forget" component={ForgetPassword} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen
          name="ShowComplianceJourney"
          component={ShowComplianceJourney}
        />
        <Stack.Screen name="ShowError" component={ShowError} />
        <Stack.Screen name="BtmNav" component={BottomNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
