/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../commonComponents/Header';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthProvider';
import TicketDetailsComponent from '../commonComponents/TicketDetailsComponent';
import {Text} from 'react-native';
import TicketJourneyDetailsComponent from '../commonComponents/TicketJourneyDetailsComponent';
import SimpleBtnComponent from '../commonComponents/SimpleBtnComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {ActivityIndicator} from 'react-native';
import TechnicianButton from '../commonComponents/TechnicianButton';

export default function TicketDetail({route}) {
  const {
    singleTicketDetails,
    singleTktInfo,
    getComplianceQuestionList,
    updateTicketAccepted,
    updateTicketReached,
    getAllSuStatusForTechnician,
  } = useContext(AuthContext);

  const navigattion = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [journeyQues, setJourneyQues] = useState('');

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // single ticket data
  const {singleData} = route.params;
  const ticketId = singleData;
  const ticketCategory = singleTktInfo.serviceName;

  const ticketStatus = singleTktInfo.ticketStatusName;

  // Token
  const {data} = route.params;

  // userName and userId
  const {userName} = route.params;
  const {userId} = route.params;

  useEffect(() => {
    singleTicketDetails(data, ticketId, navigattion).then(() => {
      setLoading(false);
    });

    getComplianceQuestionList(data, ticketId, setJourneyQues, navigattion);
  }, [data, ticketId]);

  const initialSatatusId = singleTktInfo.ticketStatusId;

  const openModal = () => {
    setModalVisible(true);
    getAllSuStatusForTechnician(data, initialSatatusId, navigattion);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const acceptBtn = singleTktInfo.isAccepted;
  const techniReachedBtn = singleTktInfo.isReached;

  const acceptHandler = async () => {
    try {
      setIsLoading(true);
      await updateTicketAccepted(
        data,
        ticketId,
        userId,
        navigattion,
        setIsLoading,
      );
      await singleTicketDetails(data, ticketId, navigattion);
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show('Not Accepted', ToastAndroid.LONG);
    }
  };

  const techniReachedHandler = async () => {
    try {
      setIsLoading(true);
      await updateTicketReached(
        data,
        ticketId,
        userId,
        navigattion,
        setIsLoading,
      );
      await singleTicketDetails(data, ticketId, navigattion);
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show('Status not updated', ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        title={
          ticketStatus === 'Closed' ? 'Closed Ticket Details' : 'Ticket Details'
        }
        showButton
        onPress={() => {
          {
            ticketStatus === 'Closed'
              ? navigattion.navigate('Like')
              : navigattion.goBack();
          }
        }}
      />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'small'} color={'#ED6A40'} />
          <Text
            style={{
              color: '#ED6A40',
              fontSize: 18,
              fontFamily: 'Raleway-Medium',
              alignSelf: 'center',
            }}>
            Data is loading please wait........
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}>
          {ticketStatus === 'Closed' ? (
            <>
              {singleTktInfo ? (
                <>
                  <TicketDetailsComponent
                    data={singleTktInfo}
                    token={data}
                    acceptBtn={acceptBtn}
                  />

                  {/* Ticket Journey Details */}
                  <>
                    <View style={styles.ticketJourneyTitle}>
                      <Text style={styles.ticketJourneyTitleText}>
                        Ticket Journey Details
                      </Text>
                    </View>
                    <View style={styles.ticketJourneyBox}>
                      <TicketJourneyDetailsComponent
                        ticketId={ticketId}
                        token={data}
                      />
                    </View>
                    {singleTktInfo.serviceName === 'Compliance' ? (
                      <>
                        <View style={styles.journeyUpdateBox}>
                          <TouchableOpacity
                            style={styles.complianceBtn}
                            onPress={() => {
                              navigattion.navigate('ShowComplianceJourney', {
                                data,
                                ticketId,
                              });
                            }}>
                            <Text style={styles.textCompliance}>
                              Show Compliance QA
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : null}
                  </>
                </>
              ) : null}
            </>
          ) : (
            // Display when is not closed
            <>
              {singleTktInfo ? (
                <>
                  <TicketDetailsComponent
                    data={singleTktInfo}
                    token={data}
                    acceptBtn={acceptBtn}
                  />

                  {/* Add Accept Btn show on false */}
                  {!acceptBtn && !techniReachedBtn && (
                    <TechnicianButton
                      onPress={acceptHandler}
                      title={'Accept'}
                      loader={isLoading}
                    />
                  )}

                  {/* After accepting tkt show techni reached btn on false */}
                  {acceptBtn && !techniReachedBtn && (
                    <TechnicianButton
                      onPress={techniReachedHandler}
                      title={'Reached'}
                    />
                  )}

                  {/* Ticket Journey Details */}
                  {acceptBtn && (
                    <>
                      <View style={styles.ticketJourneyTitle}>
                        <Text style={styles.ticketJourneyTitleText}>
                          Ticket Journey Details
                        </Text>
                      </View>
                      <View style={styles.ticketJourneyBox}>
                        {/* {ticketJourney ? ( */}
                        <TicketJourneyDetailsComponent
                          // data={ticketJourney}
                          ticketId={ticketId}
                          token={data}
                        />
                        {/* ) : null} */}
                      </View>
                      <View style={styles.changeStatusBox}>
                        <SimpleBtnComponent
                          title={'Change Status'}
                          onPress={openModal}
                          onRequestClose={closeModal}
                          onCloseBtn={closeModal}
                          visible={modalVisible}
                          tokenData={data}
                          singleData={singleTktInfo}
                          userId={userId}
                          userName={userName}
                          ticketCategory={ticketCategory}
                        />
                      </View>
                      {singleTktInfo.serviceName === 'Compliance' ? (
                        <>
                          <View style={styles.journeyUpdateBox}>
                            <TouchableOpacity
                              style={styles.complianceBtn}
                              onPress={() => {
                                navigattion.navigate('ShowComplianceJourney', {
                                  data,
                                  ticketId,
                                });
                              }}>
                              <Text style={styles.textCompliance}>
                                Show Compliance QA
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.complianceBtn}
                              onPress={() => {
                                navigattion.navigate('ComplianceCheckList2', {
                                  journeyQues,
                                  data,
                                  userId,
                                  ticketId,
                                });
                              }}>
                              <Text style={styles.textCompliance}>
                                Update Compliance QA
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : null}
                    </>
                  )}
                </>
              ) : null}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  journeyUpdateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  complianceBtn: {
    backgroundColor: '#2F97C2',
    marginBottom: 26,
    borderRadius: 4,
    marginVertical: 4,
    width: responsiveWidth(45),
  },
  textCompliance: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Raleway-Medium',
    paddingVertical: 4,
    paddingHorizontal: 7,
  },
  mainContainer: {
    flex: 1,
    height: '100%',
  },
  scrollViewContainer: {marginHorizontal: 16},
  ticketJourneyTitle: {
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: '#6F706F',
    alignSelf: 'flex-start',
    borderRadius: 3,
    paddingVertical: 10,
    paddingLeft: 20,
    width: responsiveWidth(90),
  },
  ticketJourneyTitleText: {
    color: '#FFFFFF',
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
  },
  ticketJourneyBox: {marginVertical: 16, marginHorizontal: 3},
  changeStatusBox: {marginTop: 10},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
