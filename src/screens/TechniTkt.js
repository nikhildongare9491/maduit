/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  AppState,
  FlatList,
  Pressable,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {memo, useContext, useEffect, useState} from 'react';
import Header from '../commonComponents/Header';
import TechnicianTickets from '../commonComponents/TechnicianTickets';
import {AuthContext} from '../context/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

import messaging from '@react-native-firebase/messaging';

import initializeDatabase from './DataBase';
import NavigationService from '../NavigationService';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomIcons from '../commonComponents/CustomIcons';

export const MemoizedTechnicianTickets = memo(TechnicianTickets);

PushNotification.createChannel(
  {
    channelId: 'mAudit.com',
    channelName: 'mAudit',
    channelDescription: 'New Ticket has been created',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => {
    if (created) {
      console.log('Notification channel created');
    } else {
      console.log('Notification channel already exists');
    }
  },
);

export default function TechniTkt({data, fcmToken}) {
  const navigation = useNavigation();

  // login user data
  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(true);

  const [dbToken, setDbToken] = useState('');

  // const [refresh, setRefresh] = useState(false);
  // const [showMsg, setShowMsg] = useState(false);

  const [technicianid, setTechnicianid] = useState('');

  const {
    bindTicketEntryDetailsByTechnicianId,
    techniDetails,
    ticketEntryDetails,
    updateDeviceToken,
  } = useContext(AuthContext);

  const [deviceTokenUpdated, setDeviceTokenUpdated] = useState(false);

  useEffect(() => {
    getClientData(setUserData);

    if (technicianid !== '') {
      bindTicketEntryDetailsByTechnicianId(data, userData, navigation).then(
        () => {
          setLoading(false);
        },
      );
    }
    if (userData !== '') {
      getProfileView(userData);
    }
    setTechnicianid(userData);

    if (userData !== '' && !deviceTokenUpdated) {
      updateDeviceToken(data, userData.data.userId, fcmToken, navigation).then(
        () => {
          // Mark the device token as updated
          setDeviceTokenUpdated(true);
        },
      );
    }
    dataBaseToken();
  }, [data, userData, fcmToken, deviceTokenUpdated]);

  // get user deatils from local storage
  const getClientData = async getUser => {
    try {
      const clientDataString = await AsyncStorage.getItem('LoginData');
      const clientData = JSON.parse(clientDataString);
      getUser(clientData);
    } catch (error) {
      console.error('Error occurred while retrieving and parsing data:', error);
    }
  };

  // Technician profile
  const getProfileView = () => {
    techniDetails(data, userData.data.userId, navigation);
    // updateDeviceToken(data, userData.data.userId, fcmToken);
  };

  // show single ticket details
  const getserviceCategoryId = item => {
    try {
      setCloseBtn(false);
      const singleData = item.id;
      // const ticketId = item.id;
      const userId = userData.data.userId;
      const userName = userData.data.userName;
      // ticketJourneyByTktId(data, ticketId);
      {
        singleData &&
          navigation.navigate('TicketDetails', {
            singleData,
            data,
            userId,
            userName,
          });
      }
    } catch (error) {
      console.error(
        'Error occurred while retrieving and parsing data in single data extracting:',
        error,
      );
    }
  };

  const dataBaseToken = async () => {
    try {
      const database = await initializeDatabase();
      await new Promise((resolve, reject) => {
        database.transaction(tx => {
          tx.executeSql('SELECT token FROM users', [], (tt, result) => {
            if (result.rows.length > 0) {
              const dToken = result.rows.item(0).token;
              setDbToken(dToken);
            }
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotification = async remoteMessage => {
    console.log(remoteMessage);
    const id = remoteMessage.data.ticketId;

    if (AppState.currentState === 'active') {
      // Display the incoming notification in the status bar
      PushNotification.localNotification({
        channelId: 'mAudit.com',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
      // NavigationService.navigate('TicketDetails', {
      //   data: data,
      //   singleData: id,
      // });
    } else {
      // The app is in the background or not running
      if (dbToken) {
        NavigationService.navigate('TicketDetails', {
          data: dbToken,
          singleData: id,
        });
      }
    }
  };

  // message handlers
  useEffect(() => {
    // when app in running in background
    messaging().setBackgroundMessageHandler(remoteMessage => {
      console.log('back ground handler', remoteMessage);
      handleNotification(remoteMessage);
    });

    const notificationHandler = messaging().onMessage(remoteMessage => {
      console.log('on Message handler', remoteMessage);
      handleNotification(remoteMessage);
    });

    // const openedAppHandler =
    //   messaging().onNotificationOpenedApp(handleNotification);

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('from quit state', remoteMessage);
          handleNotification(remoteMessage);
        }
      });

    return () => {
      notificationHandler();
      // openedAppHandler()
    };
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [closeBtn, setCloseBtn] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  const flatListContent = ({item}) => (
    <TechnicianTickets
      key={item.id}
      item={item}
      onPress={() => {
        getserviceCategoryId(item);
        setShowSearchInput(false);
        setScrolled(false);
        setSearchQuery('');
        setFilteredData([]);
      }}
    />
  );

  const emptyFlatListContent = () => (
    <View>
      <Text style={styles.noDataText}>No Ticket Found</Text>
    </View>
  );

  useEffect(() => {
    if (scrolled && scrollPosition > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
      setShowSearchInput(false);
      // setFilteredData([]);
    }
  }, [scrolled, scrollPosition]);

  const filterData = () => {
    const filterTkt = ticketEntryDetails.filter(item => {
      return item.clientTicketNo.includes(searchQuery);
    });
    // console.log(filterTkt);
    setFilteredData(filterTkt);
    setCloseBtn(true);

    setToastShown(false);
    setSearchPerformed(filterTkt.length === 0);
  };

  // console.log('filteredData:', filteredData);
  // console.log('searchPerformed:', searchPerformed);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header title={'Assigned Tickets'} />
      {loading ? (
        <ActivityIndicator size={'small'} color={'red'} style={styles.loader} />
      ) : (
        <FlatList
          // data={ticketEntryDetails}
          data={filteredData.length > 0 ? filteredData : ticketEntryDetails}
          renderItem={flatListContent}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={emptyFlatListContent}
          onScroll={e => {
            setScrolled(true);
            setScrollPosition(e.nativeEvent.contentOffset.y);
          }}
        />
      )}
      {scrolled ? (
        <Pressable
          style={{position: 'absolute', top: 20, right: 14}}
          onPress={() => {
            setShowSearchInput(!showSearchInput);
          }}>
          <CustomIcons name={'search-outline'} size={24} color={'#FFFFFF'} />
        </Pressable>
      ) : (
        <></>
      )}
      {showSearchInput ? (
        <TextInput
          placeholder="Search here"
          style={{
            position: 'absolute',
            top: 44,
            right: 6,
            textDecorationLine: 'underline',
            width: 84,
            paddingVertical: 6,
            textAlign: 'right',
          }}
          value={searchQuery}
          onChangeText={txt => {
            setSearchQuery(txt);
          }}
          onEndEditing={() => {
            filterData();
            setScrolled(false);
          }}
        />
      ) : (
        <></>
      )}
      {closeBtn ? (
        <Pressable
          style={{position: 'absolute', top: 30, right: 14}}
          onPress={() => {
            setFilteredData([]);
            setCloseBtn(false);
            setScrolled(true);
            setSearchPerformed(false);
          }}>
          <CustomIcons name={'close-sharp'} size={20} color={'#FFFFFF'} />
        </Pressable>
      ) : (
        <></>
      )}
      {searchPerformed && filterData.length === 0 && !toastShown ? (
        (() => {
          ToastAndroid.show('No Such a Ticket Found.', ToastAndroid.LONG);
          setToastShown(true);
        })()
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FFFFF'},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noDataText: {
    marginTop: 50,
    alignSelf: 'center',
    fontFamily: 'Raleway-Medium',
    fontSize: 18,
    color: '#000',
  },
});
