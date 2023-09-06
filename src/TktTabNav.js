import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TechniTkt from './screens/TechniTkt';
import TicketDetail from './screens/TicketDetail';
import ComplianceCheckList2 from './screens/ComplianceCheckList2';

const Stack = createNativeStackNavigator();

export default function TktTabNav({token, fcmToken}) {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="TechniTkt">
      <Stack.Screen name="TechniTkt">
        {props => (
          <TechniTkt
            {...props}
            data={token}
            fcmToken={fcmToken}
            // dbToken={dbToken}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="TicketDetails" component={TicketDetail} />
      <Stack.Screen
        name="ComplianceCheckList2"
        component={ComplianceCheckList2}
      />
    </Stack.Navigator>
  );
}
