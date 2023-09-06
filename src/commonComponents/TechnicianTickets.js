/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import CustomIcons from './CustomIcons';
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width;

export default function TechnicianTickets({item, onPress}) {
  // const displayOnlyDate = item.createdOn;
  // const formatDate = moment(displayOnlyDate).format('DD-MMM-YYYY');

  // const displayEtaDate = item.eta;
  // const eta = moment(displayEtaDate).format('DD-MM-YYYY hh:mm A');

  // const closedDate = item.closedOn;
  // const close = moment(closedDate).format('DD-MM-YYYY hh:mm A');

  const splitTextOnPinCode = text => {
    const index = text.indexOf('Pin Code');
    if (index !== -1) {
      return text.slice(0, index) + '\n' + text.slice(index);
    }
    return text;
  };

  return (
    <View style={styles.container}>
      {/* 1st section */}
      <View style={styles.detailsSection}>
        <View style={{marginLeft: 8}}>
          <Text style={[styles.textFont]}>ATM ID: {item.atmName}</Text>
          {/* <Text style={[styles.textFont, styles.textMargin]}>
            ATM Name: {item.atmName}
          </Text> */}
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[styles.textFont, styles.textMargin, styles.addressText]}>
              Address: &nbsp;
            </Text>
            <Text
              style={[styles.textFont, styles.textMargin, styles.addressText]}>
              {splitTextOnPinCode(item.atmLocation)}
            </Text>
          </View>
          <View style={{marginLeft: 60}}>
            <Text style={styles.textFont}>{item.cityName}</Text>
            <Text style={styles.textFont}>{item.stateName}</Text>
          </View>
          <Text style={[styles.textFont, styles.textMargin]}>
            Issue: {item.serviceCategoryName}
          </Text>
        </View>
        {/* first section right side */}
        <View style={{marginRight: 10}}>
          <Text
            style={[
              styles.textFont,
              styles.rightSideText,
              {backgroundColor: '#BADEED'},
            ]}>
            {item.clientTicketNo}
          </Text>
          <Text
            style={[
              styles.textFont,
              styles.rightSideText,
              {backgroundColor: '#D4EFD5'},
            ]}>
            {moment(item.createdOn).format('DD-MMM-YYYY')}
          </Text>
          <Text
            style={[
              styles.textFont,
              styles.rightSideText,
              {
                backgroundColor:
                  item.serviceName === 'HSK' ? '#F0EBDE' : '#FFE4E4',
              },
            ]}>
            {item.serviceName}
          </Text>
        </View>
      </View>
      {/* 2nd section */}
      <View style={styles.bottomSection}>
        <View style={styles.tatSection}>
          {item.ticketStatusName === 'Closed' ? (
            <>
              <CustomIcons name={'ellipse-sharp'} color={'#10A716'} size={14} />
              <Text
                style={[styles.textFont, styles.tatText, {color: '#10A716'}]}>
                Close :&nbsp;
                {moment(item.closedOn).format('DD-MM-YYYY hh:mm A')}
              </Text>
            </>
          ) : (
            <>
              <CustomIcons
                name={'ellipse-sharp'}
                color={item.etaCrossed === true ? '#10A716' : '#FF0000'}
                size={14}
              />
              <Text
                style={[
                  styles.textFont,
                  styles.tatText,
                  {color: item.etaCrossed === true ? '#10A716' : '#FF0000'},
                ]}>
                ETA :&nbsp;{moment(item.eta).format('DD-MM-YYYY hh:mm A')}
              </Text>
            </>
          )}
        </View>
        <Pressable
          style={({pressed}) => [
            {
              borderBottomRightRadius: 10,
              paddingVertical: 15,
              backgroundColor: pressed ? '#DCDCDC' : '#FFFFFF',
              paddingHorizontal: 10,
            },
          ]}
          onPressIn={onPress}>
          <Text style={[styles.textFont, styles.showMoreText]}>
            Show more....
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textFont: {
    fontFamily: 'Raleway-Medium',
    color: '#322C46',
    fontSize: 12,
    marginLeft: 4,
  },
  textMargin: {
    marginTop: 3,
  },
  addressText: {
    // flexWrap: 'wrap',
    lineHeight: 18,
  },
  rightSideText: {
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 6,
    width: deviceWidth < 400 ? 100 : 100,
    paddingBottom: deviceWidth < 400 ? 3 : 3,
  },
  container: {
    width: '96%',
    alignSelf: 'center',
    marginVertical: 12,
    elevation: 3,
    borderRadius: 10,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FDFDFF',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingVertical: 18,
  },
  bottomSection: {
    backgroundColor: '#ffff',
    elevation: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // paddingVertical: 15,
  },
  tatSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: 16,
  },
  tatText: {
    alignSelf: 'center',
    // color: '#10A716',
    fontSize: 15,
    marginLeft: 8,
    marginTop: -3,
    fontFamily: 'Raleway-Medium',
  },
  showMoreText: {
    alignSelf: 'center',
    color: '#FF5F2D',
    fontSize: 15,
  },
});
