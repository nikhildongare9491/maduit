/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import CustomIcons from './CustomIcons';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {AuthContext} from '../context/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

export default function TicketDetailsComponent({data, token, acceptBtn}) {
  const navigation = useNavigation();
  const [isCalendarVisible, setIsCalenderVisible] = useState(false);

  const {userProf, changeETA, ticketJourneyByTktId} = useContext(AuthContext);

  const displayOnlyDate = data.createdOn;
  const ticketid = data.id;
  const ticketStatusId = data.subStatusId;

  const loginUserId = userProf.data.userId;

  // storing current date and time
  const currentDate = new Date();

  const formatDate = moment(displayOnlyDate).format('DD-MMM-YYYY');

  const formatETADate = moment(data.eta).format('YYYY-MM-DD HH:mm');

  // This date disply in ETA
  const newFormatETADate = moment(data.eta).format('YYYY-MM-DD hh:mm A');
  const [updatedETA, setUpdatedETA] = useState(newFormatETADate);

  const [loading, setLoading] = useState(false);

  const viewCalenadar = () => {
    setIsCalenderVisible(true);
  };

  const hideDatePicker = () => {
    setIsCalenderVisible(false);
  };

  const handleConfirm = async eta => {
    setLoading(true);
    const newETA = moment(eta).format('YYYY-MM-DD HH:mm');
    const newETAIndian = moment(eta).format('YYYY-MM-DD hh:mm A');

    const callingETAAPI = await changeETA(
      token,
      ticketid,
      ticketStatusId,
      loginUserId,
      newETA,
      formatETADate,
      navigation,
    );

    if (callingETAAPI.message === 'success') {
      setUpdatedETA(newETAIndian);
      ticketJourneyByTktId(token, ticketid, navigation);
      setLoading(false);
      setIsCalenderVisible(false);
      Alert.alert('ETA Updated successfully');
    } else {
      setUpdatedETA(newFormatETADate);
      setLoading(false);
      setIsCalenderVisible(false);
      Alert.alert('The ETA must not be less than the current date and time.');
    }
  };

  const latitude = data.atmLatitude;
  const longitude = data.atmLongitude;

  const handleGoogleMap = async () => {
    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      await Linking.openURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ticket Created details Container*/}
      <View style={styles.ticketCreatedDetailsBox}>
        <View style={styles.ticketCreatedDetails}>
          <View style={[styles.ticketNumBox, styles.ticketImg]}>
            <Image source={require('../../assets/images/ticket-icons.png')} />
            <View style={styles.ticketNumBox}>
              <Text style={[styles.ticketNum, {fontWeight: 700}]}>
                Ticket No
              </Text>
              <Text style={[styles.ticketNum, {fontWeight: 300}]}>
                {data.clientTicketNo}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.serviceName}>{data.serviceName}</Text>
          </View>
        </View>

        {/* date, state/city and tat view */}
        <View style={styles.dateCityTatBox}>
          <View style={styles.dateTatBox}>
            <View style={styles.iconsInfoBox}>
              <View style={styles.iconBox}>
                <CustomIcons
                  name="calendar-outline"
                  size={15}
                  color={'#57CB98'}
                />
              </View>
              <Text style={styles.IconText}>{formatDate}</Text>
            </View>
            <View
              style={[
                styles.iconsInfoBox,
                {
                  marginRight: responsiveWidth(5),
                  flexDirection: 'column',
                  marginTop: 10,
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.iconBox}>
                  <CustomIcons
                    name="time-outline"
                    size={15}
                    color={'#57CB98'}
                  />
                </View>
                <Text style={styles.IconText}>ETA : {updatedETA}</Text>
              </View>
              {acceptBtn && (
                <TouchableOpacity
                  onPress={viewCalenadar}
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -6,
                  }}>
                  {loading ? (
                    <ActivityIndicator color={'blue'} />
                  ) : (
                    <Text
                      style={{
                        color: 'blue',
                        textDecorationLine: 'underline',
                        fontFamily: 'Raleway-SemiBold',
                        fontSize: 11,
                      }}>
                      Change
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              <DateTimePickerModal
                mode="datetime"
                isVisible={isCalendarVisible}
                is24Hour={true}
                minimumDate={currentDate}
                // minimumTime={currentTime}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <View style={styles.iconsInfoBox}>
            <View style={styles.iconBox}>
              <CustomIcons name={'location'} size={15} color={'#57CB98'} />
            </View>
            <Text style={styles.IconText}>
              {data.cityName}, {data.stateName}
            </Text>
            <Pressable style={{marginLeft: 12}} onPressIn={handleGoogleMap}>
              <CustomIcons
                name={'navigate-circle-outline'}
                size={22}
                color={'blue'}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* oepn fault with issue in details */}
      <View style={styles.serviceCategoryContainer}>
        <View style={styles.serviceCategoryLabel}>
          <Text style={styles.serviceCategoryLabelText}>Open Faults</Text>
        </View>
        <View style={styles.serviceCategoryBox}>
          <Text style={styles.serviceCategoryText}>
            {data.serviceCategoryName}
          </Text>
        </View>
      </View>

      {/* Update User Info */}
      <View style={styles.updatedServiceBox}>
        <View style={styles.updatedBy}>
          <Text style={styles.updatedLabel}>
            Updated By : - {data.updatedBy}
          </Text>
          {/* <View style={styles.ticketStatusBox}> */}
          <Text style={styles.ticketStatusName}>{data.ticketStatusName}</Text>
          {/* </View> */}
        </View>
        <View style={styles.updatedDetailsBox}>
          <Text style={styles.updatedText}>ATM Id: {data.atmName}</Text>
          <Text style={styles.updatedText}>
            Vendor No: {data.vendorTicketNo}
          </Text>
          <Text style={styles.updatedText}>
            User Name: {data.assignedUserName}
          </Text>
          {/* <Text style={styles.updatedText}>Reviewed By: -</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginTop: 15},
  ticketCreatedDetailsBox: {
    backgroundColor: '#FDFDFF',
    borderRadius: 10,
  },
  ticketCreatedDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  ticketImg: {flexDirection: 'row', alignItems: 'center'},
  ticketNumBox: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  ticketNum: {
    fontSize: 17,
    color: '#323232',
    // fontFamily: 'PathwayExtreme_14pt_Condensed-Regular',
    letterSpacing: 0.2,
  },
  serviceName: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#7EC881',
    marginRight: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '300',
    color: '#fff',
    fontFamily: 'Raleway-SemiBold',
    borderRadius: 5,
    elevation: 1,
    letterSpacing: 1,
  },
  dateCityTatBox: {
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    elevation: 3,
  },
  dateTatBox: {
    marginTop: -10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconsInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginLeft: 15,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconText: {
    marginLeft: 8,
    fontSize: 11,
    color: 'black',
    fontFamily: 'Raleway-Bold',
    fontWeight: '600',
    letterSpacing: 1,
  },
  serviceCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  serviceCategoryLabel: {
    backgroundColor: '#ED6A40',
    borderRadius: 3,
    elevation: 3,
  },
  serviceCategoryLabelText: {
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#fff',
    // fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  serviceCategoryBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 3,
    elevation: 3,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCategoryText: {
    // alignItems: 'flex-start',
    textAlign: 'center',
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#5C5C5C',
    fontWeight: '600',
    letterSpacing: 1,
    paddingVertical: 8,
    paddingLeft: 20,
    paddingRight: 46,
  },
  updatedServiceBox: {
    paddingVertical: 15,
    marginTop: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 3,
  },
  updatedBy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updatedLabel: {
    marginLeft: 15,
    fontSize: 13,
    fontWeight: '600',
    color: '#322C46',
    letterSpacing: 1,
  },
  ticketStatusName: {
    backgroundColor: '#7EC881',
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    elevation: 5,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  updatedDetailsBox: {marginTop: 8, marginLeft: 15},
  updatedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#656565',
    letterSpacing: 1,
    lineHeight: 18,
  },
});
