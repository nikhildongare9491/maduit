/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  ScrollView,
  Linking,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CustomTextInput from '../commonComponents/CustomTextInput';
import CustomBtn from '../commonComponents/CustomBtn';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthProvider';
import validator from 'validator';
import CustomIcons from '../commonComponents/CustomIcons';

export default function LoginScreen({route}) {
  const {clientLogin, loginToken} = useContext(AuthContext);
  const navigation = useNavigation();

  const {fcmToken} = route.params;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [isSecureEntry, setIsSecureEntry] = useState(true);

  // only access token
  const [tokenDetails, setTokenDetails] = useState(null);

  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  useEffect(() => {
    loginToken().then(() => {
      getTokenData(setTokenDetails);
    });
  }, []);

  const getTokenData = async getToken => {
    const tokenString = await AsyncStorage.getItem('Token');
    const localToken = JSON.parse(tokenString);
    getToken(localToken.access_token);
  };

  const validateEmail = txt => {
    const isValid = validator.isEmail(txt);
    setEmail(txt);
    setIsEmailValid(isValid);
  };

  const handleLogin = () => {
    if (email === '') {
      setIsEmail(true);
      setIsPassword(true);
      ToastAndroid.show('Enter an email and password', ToastAndroid.LONG);
    } else if (password === '') {
      setIsPassword(true);
      ToastAndroid.show('Enter a password', ToastAndroid.LONG);
    } else {
      clientLogin(tokenDetails, email, password, navigation, fcmToken);
      setEmail('');
      setPassword('');
      setIsEmail(false);
      setIsPassword(false);
    }
  };

  const handleRST = async () => {
    try {
      const url = 'https://www.reliablesoftech.com/';
      await Linking.openURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <View style={styles.inputSection}>
        <View style={styles.userInputSection}>
          <CustomTextInput
            placeholder={'Email Address'}
            isChange={isEmail}
            value={email}
            onChangeTextValue={validateEmail}
          />
          {isEmailValid ? (
            <View style={styles.checkIcon}>
              <CustomIcons
                name={'checkmark-circle-outline'}
                size={20}
                color={'#2BC731'}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.userInputSection}>
          <CustomTextInput
            placeholder={'Password'}
            isChange={isPassword}
            value={password}
            isSecureTextEntry={isSecureEntry}
            iconsShow={() => {
              setIsSecureEntry(!isSecureEntry);
            }}
            rightImg={true}
            onChangeTextValue={txt => {
              setPassword(txt);
            }}
          />
        </View>
      </View>

      <View style={styles.forgetPasswordSection}>
        <Text
          style={styles.forgetPasswordText}
          onPress={() => {
            navigation.navigate('Password_Forget', {tokenDetails});
          }}>
          Forgot Password?
        </Text>
      </View>

      <ImageBackground
        source={require('../../assets/images/logoWall.png')}
        style={styles.imgbackground}>
        <CustomBtn
          title={'Sign In'}
          bgColor={'#E4AA52'}
          textColor={'#FFFFFF'}
          radius={5}
          onPress={handleLogin}
        />
        <Text style={styles.footerText} onPress={handleRST}>
          Powered by : Reliable Software Technology.
        </Text>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003F76',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  inputSection: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInputSection: {marginTop: 10},
  checkIcon: {position: 'absolute', right: 10, top: 20},
  forgetPasswordSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 27,
    marginVertical: 10,
  },
  forgetPasswordText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#B5B5B7',
    fontFamily: 'Raleway-Medium',
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  imgbackground: {width: '100%', height: 300},
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C4E3FF',
    position: 'absolute',
    bottom: 50,
    left: 100,
  },
});
