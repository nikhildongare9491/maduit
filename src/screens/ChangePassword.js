/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState} from 'react';
import BackArrowComponent from '../commonComponents/BackArrowComponent';
import {AuthContext} from '../context/AuthProvider';
import CustomTextInput from '../commonComponents/CustomTextInput';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const ChangePassword = ({navigation, route}) => {
  const {techniPasswordChange} = useContext(AuthContext);
  const {token} = route.params;
  const {loginUserEmail} = route.params;

  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');

  const [isSecureOldEntry, setIsSecureOldEntry] = useState(true);
  const [isSecureNewEntry, setIsSecureNewEntry] = useState(true);
  const [isSecureNewEntryCheck, setIsSecureNewEntryCheck] = useState(true);

  const [loading, setLoading] = useState(false);

  const validatePasswordsMatch = () => {
    return newPwd === confirmNewPwd;
  };

  const handleSubmit = () => {
    setLoading(true);
    if (validatePasswordsMatch()) {
      techniPasswordChange(
        token,
        loginUserEmail,
        oldPwd,
        confirmNewPwd,
        navigation,
        setLoading,
        setOldPwd,
        setNewPwd,
        setConfirmNewPwd,
      );
    } else {
      console.log('Passwords do not match.');
    }
  };

  const passwordsMatch = validatePasswordsMatch();

  return (
    <View
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
              placeholder={'Old Password'}
              value={oldPwd}
              isSecureTextEntry={isSecureOldEntry}
              iconsShow={() => {
                setIsSecureOldEntry(!isSecureOldEntry);
              }}
              rightImg={true}
              onChangeTextValue={txt => {
                setOldPwd(txt);
                // console.log(txt);
              }}
            />
          </View>

          <View
            style={{
              marginVertical: 10,
            }}>
            <CustomTextInput
              placeholder={'New Password'}
              value={newPwd}
              isSecureTextEntry={isSecureNewEntry}
              iconsShow={() => {
                setIsSecureNewEntry(!isSecureNewEntry);
              }}
              rightImg={true}
              onChangeTextValue={txt => {
                setNewPwd(txt);
              }}
            />
          </View>

          <View>
            <CustomTextInput
              placeholder={'Confirm New Password'}
              value={confirmNewPwd}
              isSecureTextEntry={isSecureNewEntryCheck}
              iconsShow={() => {
                setIsSecureNewEntryCheck(!isSecureNewEntryCheck);
              }}
              rightImg={true}
              onChangeTextValue={txt => {
                setConfirmNewPwd(txt);
              }}
            />
          </View>

          {passwordsMatch ? null : (
            <Text style={{color: 'red', marginTop: 10}}>
              Passwords not match
            </Text>
          )}

          <TouchableOpacity
            disabled={!passwordsMatch}
            onPress={handleSubmit}
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
                  fontSize: 20,
                  color: '#FFFFFF',
                  fontFamily: 'Raleway-ExtraBoldItalic',
                  textAlign: 'center',
                  letterSpacing: 1,
                }}>
                <ActivityIndicator color={'#FFFFFF'} /> Reseting Password
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  color: '#FFFFFF',
                  fontFamily: 'Raleway-ExtraBoldItalic',
                  textAlign: 'center',
                  letterSpacing: 1,
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
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  imgbackground: {
    width: 600,
    height: 300,
  },
  checkIcon: {position: 'absolute', right: 10, top: 20},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
