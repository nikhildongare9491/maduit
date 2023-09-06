import {PermissionsAndroid, Platform} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

// permission for push notification
export const getPerrmissions = () => {
  Platform.OS === 'android'
    ? requestUserPermissionAndroid()
    : requestUserPermission();
};

// request for android
const requestUserPermissionAndroid = async () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
};

// request for ios
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

export const bootstrap = async () => {
  await inAppMessaging().setMessagesDisplaySuppressed(true);
};

export const getToken = refreshToken => {
  // for FCM Token
  if (requestUserPermission) {
    messaging()
      .getToken()
      .then(fcmtoken => {
        refreshToken(fcmtoken);
        // console.log(fcmtoken);
      });
  } else {
    console.log('Not Authorization status:');
  }
};
