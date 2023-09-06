/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../commonComponents/Header';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthProvider';
import {BASE_URL_IMG} from '../Config';
import CustomIcons from '../commonComponents/CustomIcons';
import moment from 'moment';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const deviceWidth = Dimensions.get('window').width;

export default function ShowComplianceJourney({route}) {
  const navigation = useNavigation();

  const {data} = route.params;
  const {ticketId} = route.params;

  const {checkListJourneyByTktId} = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [complianceJourneyData, setComplianceJourneyData] = useState([]);

  useEffect(() => {
    checkListJourneyByTktId(
      data,
      ticketId,
      setComplianceJourneyData,
      navigation,
    )
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        console.log('Error fetching compliance journey data:', error);
        setLoading(false);
      });
  }, []);

  const newData = complianceJourneyData.data;

  return (
    <SafeAreaView styles={styles.container}>
      <Header
        title={'Compliance Check List Details'}
        showButton
        onPress={() => {
          navigation.goBack();
        }}
      />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="small"
            color="#CD5C5C"
            style={{marginTop: 100}}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}>
          {newData.length > 0 ? (
            newData.map(item => (
              <View style={{marginLeft: 10}} key={item.id}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <View style={[styles.journeyCategorySectionLine]} />
                  <View style={{marginTop: 10}}>
                    <CustomIcons
                      name={'arrow-forward-circle-outline'}
                      size={18}
                      color={'#000'}
                    />
                  </View>
                  <Image
                    style={{width: 20, height: 20, marginLeft: 8, marginTop: 6}}
                    source={{uri: BASE_URL_IMG + item.mainicon}}
                  />
                  <Text style={styles.airCon}>{item.checkListName}</Text>
                </View>
                {item.complaincelist.map(option => (
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',
                      marginLeft: -6,
                    }}
                    key={option.id}>
                    <View style={styles.journeySubCategorySectionLine} />
                    <View style={{marginLeft: 28, marginTop: 6}}>
                      <CustomIcons
                        name={'arrow-forward-circle-outline'}
                        size={16}
                        color={'#000'}
                      />
                    </View>
                    <View>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={{uri: BASE_URL_IMG + option.iconimge}}
                          style={{
                            width: 16,
                            height: 16,
                            marginLeft: 6,
                            marginTop: 4,
                          }}
                        />
                        <Text style={styles.questionText}>
                          {option.checklistOptionsName}
                        </Text>
                        <Text style={styles.questionText}>
                          {option.isWorking}
                        </Text>

                        {/* Display images */}
                        <View style={{marginLeft: responsiveWidth(20)}}>
                          {item.imagelist.map(
                            img =>
                              img.imagid === option.id && (
                                <Image
                                  key={img.imagid}
                                  source={{
                                    uri: BASE_URL_IMG + img.complainceThumbnail,
                                  }}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 4,
                                  }}
                                />
                              ),
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          marginLeft: 34,
                          marginTop: -18,
                        }}>
                        <Text style={{color: '#000', fontSize: 11}}>
                          User : {option.updatedUserName}(
                          {option.updatedUserRole})
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 11,
                            lineHeight: 18,
                          }}>
                          Update Date :&nbsp;
                          {moment(option.updateOn).format('DD-MM-YYYY hh:mm A')}
                        </Text>

                        <Text style={{color: '#000', fontSize: 11}}>
                          Remark : {option.remark}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 16,
                  fontFamily: 'Raleway-Medium',
                  paddingTop: 50,
                }}>
                No Journey Founded
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, width: deviceWidth},
  airConView: {
    marginTop: 15,
    alignSelf: 'center',
    width: '90%',
    height: 50,
    backgroundColor: '#FCFCFE',
    borderRadius: 10,
    flexDirection: 'row',
  },
  airCon: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
    marginLeft: 10,
    textAlign: 'center',
  },
  journeySubCategorySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 3,
  },
  questionText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '600',
    color: '#323232',
    letterSpacing: 1,
    textAlign: 'center',
  },

  journeySubCategorySectionLine: {
    borderStyle: 'dotted',
    height: 70,
    borderLeftWidth: 3,
    borderColor: '#C0C0C0',
    position: 'absolute',
    left: 34,
    top: 6,
  },
  journeyCategorySectionLine: {
    borderStyle: 'dotted',
    height: 1200,
    borderLeftWidth: 3,
    borderColor: '#C0C0C0',
    position: 'absolute',
    top: 16,
    left: 7,
  },
});
