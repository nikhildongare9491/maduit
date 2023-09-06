/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {memo, useContext, useEffect, useState} from 'react';
import Header from '../commonComponents/Header';
import TechnicianTickets from '../commonComponents/TechnicianTickets';
import {AuthContext} from '../context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const MemoizedTechnicianTickets = memo(TechnicianTickets);

export default function Like({route}) {
  const {closeTickets, closedTkts} = useContext(AuthContext);

  const {token} = route.params;

  const navigation = useNavigation();

  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(true);

  const [technicianid, setTechnicianid] = useState('');

  useEffect(() => {
    getClientData(setUserData);

    setTechnicianid(userData);

    if (technicianid !== '') {
      closeTickets(token, userData, navigation).then(() => {
        setLoading(false);
      });
    }
  }, [token, userData]);

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

  // show single ticket details
  const getserviceCategoryId = item => {
    try {
      const singleData = item.id;
      // const ticketId = item.id;
      const userId = userData.data.userId;
      const userName = userData.data.userName;
      // ticketJourneyByTktId(data, ticketId);
      {
        singleData &&
          navigation.navigate('TicketDetails', {
            singleData,
            token,
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

  const flatListContent = ({item}) => (
    <TechnicianTickets
      key={item.id}
      item={item}
      onPress={() => {
        getserviceCategoryId(item);
      }}
    />
  );

  const emptyFlatListContent = () => (
    <View>
      <Text style={styles.noDataText}>No Ticket Found</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header title={'Closed Tickets'} />
      {loading ? (
        <ActivityIndicator size={'small'} color={'red'} style={styles.loader} />
      ) : (
        <FlatList
          data={closedTkts}
          renderItem={flatListContent}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={emptyFlatListContent}
        />
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
