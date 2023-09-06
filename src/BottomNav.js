/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TktTabNav from './TktTabNav';
import Profile from './screens/Profile';
import Notification from './screens/Notification';
import Search from './screens/Search';
import Like from './screens/Like';

import CustomIcons from './commonComponents/CustomIcons';
import {Image, StyleSheet, View} from 'react-native';

const BtmTab = createBottomTabNavigator();

const profileScreen = 'Profile';
const notificationScreen = 'Notifications';
const likeScreen = 'Like';
const searchScreen = 'Search';

const BottomNav = ({route}) => {
  const {token} = route.params;
  const {fcmToken} = route.params;
  // const {dbToken} = route.params;

  // console.log('BottomNav', dbToken);

  return (
    <BtmTab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;
          let rn = route.name;
          if (rn === profileScreen) {
            iconName = 'person-outline';
          } else if (rn === notificationScreen) {
            iconName = 'notifications-outline';
          } else if (rn === likeScreen) {
            iconName = 'reader-outline';
          } else if (rn === searchScreen) {
            iconName = 'search-outline';
          }
          return <CustomIcons name={iconName} color={color} size={28} />;
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#FFFFFF',
        },
        tabBarActiveTintColor: '#2F4F4F',
        tabBarInactiveTintColor: '#D3D3D3',
      })}>
      <BtmTab.Screen
        name={searchScreen}
        component={Search}
        initialParams={{token: token}}
      />

      <BtmTab.Screen
        name={likeScreen}
        component={Like}
        initialParams={{token: token}}
      />

      <BtmTab.Screen
        name={'Home'}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.homePageBtn}>
                <Image
                  source={require('../assets/images/homeBtn.png')}
                  style={styles.imgBtn}
                />
              </View>
            );
          },
        }}>
        {props => (
          <TktTabNav
            {...props}
            token={token}
            fcmToken={fcmToken}
            // dbToken={dbToken}
          />
        )}
      </BtmTab.Screen>

      <BtmTab.Screen name={notificationScreen} component={Notification} />

      <BtmTab.Screen
        name={profileScreen}
        component={Profile}
        initialParams={{token: token}}
      />
    </BtmTab.Navigator>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  homePageBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    top: -10,
    backgroundColor: '#FFFFFF',
  },
  imgBtn: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
});
