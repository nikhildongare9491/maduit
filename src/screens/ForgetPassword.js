/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useState} from 'react';
import BackArrowComponent from '../commonComponents/BackArrowComponent';
import {AuthContext} from '../context/AuthProvider';
import CustomTextInput from '../commonComponents/CustomTextInput';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const ForgetPassword = ({navigation, route}) => {
  const {tokenDetails} = route.params;

  const {techniForgetPassword} = useContext(AuthContext);

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const handleForgetPassword = () => {
    setLoading(true);
    try {
      if (email === '') {
        setShowAlert(true);
        ToastAndroid.show('Enter an email address', ToastAndroid.SHORT);
        setLoading(false);
      } else {
        techniForgetPassword(
          tokenDetails,
          email,
          navigation,
          setLoading,
          setEmail,
        );
      }
    } catch (error) {
      setLoading(false); // Stop the loader on error
      console.error(error);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#003F76',
      }}>
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <BackArrowComponent
          style={{position: 'absolute', top: 10, left: 10}}
          color={'#FFFFFF'}
          size={30}
        />
        <View
          style={{
            marginTop: 240,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <CustomTextInput
              placeholder={'Enter email id'}
              isChange={showAlert}
              value={email}
              onChangeTextValue={txt => {
                setEmail(txt);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleForgetPassword}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#E4AA52',
              width: responsiveWidth(90),
              height: responsiveHeight(7),
              marginTop: 30,
              borderRadius: 4,
            }}>
            {loading ? (
              <Text
                style={{
                  fontSize: 18,
                  color: '#FFFFFF',
                  fontFamily: 'Raleway-ExtraBoldItalic',
                  textAlign: 'center',
                }}>
                <ActivityIndicator color={'#FFFFFF'} /> Reseting
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  color: '#FFFFFF',
                  fontFamily: 'Raleway-ExtraBoldItalic',
                  textAlign: 'center',
                }}>
                Reset
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <ImageBackground
          resizeMode="cover"
          source={require('../../assets/images/logoWall.png')}
          style={styles.imgbackground}
        />
      </View>
    </ScrollView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  imgbackground: {
    width: 600,
    height: 300,
  },
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
