/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CustomIcons from './CustomIcons';
import {BASE_URL_IMG} from '../Config';
import {AuthContext} from '../context/AuthProvider';
import {useIsFocused, useNavigation} from '@react-navigation/native';

export default function TicketJourneyDetailsComponent({data, ticketId, token}) {
  const navigation = useNavigation();
  // const [ticketJourney, setTicketJourney] = useState([]);

  const isFocused = useIsFocused();

  const {ticketJourneyByTktId, ticketJourney} = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (isFocused) {
      ticketJourneyByTktId(token, ticketId, navigation)
        .then(() => {
          // After fetching data, set loading to false
          setLoading(false);
        })
        .catch(error => {
          // Handle errors if necessary
          console.error('Error fetching ticket journey:', error);
          setLoading(false);
        });
    }
  }, [isFocused, ticketId, token]);

  // const mergeUniqueData = (oldData, newData) => {
  //   const uniqueIds = new Set(oldData.map(item => item.id));
  //   const mergedData = [
  //     ...oldData,
  //     ...newData.filter(item => !uniqueIds.has(item.id)),
  //   ];
  //   return mergedData;
  // };

  // const mergedJourney = mergeUniqueData(ticketJourney, newTktJourney);

  // console.log('data come after eta change', newTktJourney);

  return (
    <View style={styles.journeySection}>
      <View style={{backgroundColor: '#fff', height: '100%'}}>
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              size={'small'}
              color={'red'}
              style={styles.loader}
            />
          </View>
        ) : (
          <>
            {ticketJourney ? (
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}>
                {ticketJourney.map(item => (
                  <View style={{marginBottom: 10}} key={item.id}>
                    <View>
                      <View style={styles.journeyCategorySection}>
                        <View style={styles.journeyCategorySectionLine} />
                        <CustomIcons
                          name={'arrow-forward-circle-outline'}
                          size={20}
                          color={'#000'}
                        />
                        <Image
                          source={{uri: BASE_URL_IMG + item.image}}
                          style={{width: 20, height: 20, marginLeft: 2}}
                        />
                        <Text style={styles.journeyCategoryTitle}>
                          {item.name}
                        </Text>
                      </View>
                      {item.substatuslist.map((subStatusList, index) => (
                        <View key={index}>
                          <View style={{marginLeft: -8}}>
                            <View style={[styles.journeySubCategorySection]}>
                              <View
                                style={{
                                  position: 'absolute',
                                  left: 15,
                                }}>
                                <View
                                  style={styles.journeySubCategorySectionLine}
                                />
                                <CustomIcons
                                  name={'arrow-forward-circle-outline'}
                                  size={15}
                                  color={'#000'}
                                />
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginLeft: 32,
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={{
                                    uri:
                                      BASE_URL_IMG +
                                      subStatusList.subStatusIconImg,
                                  }}
                                  style={{width: 10, height: 10}}
                                />
                                <Text style={styles.journeySubCategoryTitle}>
                                  {subStatusList.subStatusName}
                                </Text>
                              </View>
                              <View style={{marginLeft: 10}}>
                                <Text style={styles.journeySubCategoryDate}>
                                  {subStatusList.updatedOn}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={{marginLeft: 63}}>
                            <Text style={styles.journeySubCategoryUpdate}>
                              {subStatusList.updatedBy}{' '}
                              <Text style={styles.journeySubCategoryUpdate}>
                                ({subStatusList.roleName})
                              </Text>
                            </Text>
                            <Text style={styles.journeySubCategoryUpdate}>
                              Remark : {subStatusList.remarks}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Raleway-BoldItalic',
                    fontSize: 17,
                    color: '#808080',
                  }}>
                  No Journey Found
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  journeySection: {
    height: 250,
    borderWidth: 1,
    borderColor: '#C0C0C0',
  },
  journeyCategorySectionLine: {
    borderStyle: 'dotted',
    height: 480,
    borderLeftWidth: 3,
    borderColor: '#C0C0C0',
    position: 'absolute',
    top: 1,
    left: 7,
  },
  journeyCategorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    marginTop: 15,
  },
  journeyCategoryTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginLeft: 6,
  },
  journeySubCategorySectionLine: {
    borderStyle: 'dotted',
    height: 85,
    borderLeftWidth: 3,
    borderColor: '#C0C0C0',
    position: 'absolute',
    left: 2,
    top: 1,
  },
  journeySubCategorySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 3,
  },
  journeySubCategoryTitle: {
    marginLeft: 4,
    color: '#000',
    fontWeight: '600',
  },
  journeySubCategoryDate: {
    color: '#0F3761',
    fontWeight: '600',
    fontSize: 12,
    marginRight: 10,
  },
  journeySubCategoryUpdate: {marginTop: 3, color: '#808080'},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
