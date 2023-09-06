/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  Animated,
  ImageBackground,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import initializeDatabase from './DataBase';
import {AuthContext} from '../context/AuthProvider';
import {bootstrap, getPerrmissions, getToken} from './FCMBackgroundMessaging';
import NetInfo from '@react-native-community/netinfo';

export default function Splash() {
  // const [dbToken, setDbToken] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const opacity = new Animated.Value(0);

  const {clientLogin} = useContext(AuthContext);

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      getToken(setFcmToken);
      getPerrmissions();
      bootstrap();
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      animationCall();
      getDataBaseData();
    }
    // dataBaseToken();
  }, [fcmToken, isFocused]);

  const animationCall = () => {
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 1,
      duration: 3000,
    }).start();
  };

  // checking data in SQLite database
  const getDataBaseData = async () => {
    try {
      const database = await initializeDatabase();
      database.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users ORDER BY id DESC LIMIT 1',
          [],
          (_tt, results) => {
            if (results.rows.length > 0) {
              const user = results.rows.item(0);
              if (user.email !== null && user.password !== null) {
                if (user.token == null) {
                  if (isConnected) {
                    setTimeout(() => {
                      navigation.navigate('Login', {
                        fcmToken: fcmToken,
                      });
                    }, 5000);
                  }
                } else {
                  if (isConnected) {
                    clientLogin(
                      user.token,
                      user.email,
                      user.password,
                      navigation,
                      user.fcmToken,
                    );
                  }
                }
              } else {
                if (isConnected) {
                  setTimeout(() => {
                    navigation.navigate('Login', {
                      fcmToken: fcmToken,
                    });
                  }, 5000);
                }
              }
            } else {
              // when user not in database then navigate to Login page.
              if (isConnected) {
                setTimeout(() => {
                  navigation.navigate('Login', {
                    fcmToken: fcmToken,
                  });
                }, 5000);
              }
              // console.log('No user session found');
            }
          },
          error => {
            // console.error('Error retrieving user session: ', error)
            Alert.alert('Error retrieving user session');
          },
        );
      });
    } catch (error) {
      // console.error('Error initializing database: ', error);
      Alert.alert('Error initializing database');
    }
  };

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Animated.View style={[styles.animatedSection, {opacity}]}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
          </Animated.View>
          <View>
            <ImageBackground
              source={require('../../assets/images/logoWall.png')}
              style={styles.imgbackground}>
              <Text style={styles.footerText}>
                Powered by : Reliable Software Technology.
              </Text>
            </ImageBackground>
          </View>
        </>
      ) : (
        <View style={styles.mainContainerNoConnect}>
          <View style={{position: 'absolute', top: '60', left: '50'}}>
            <Text style={styles.noConnect}>No Internet</Text>
            <Text style={styles.noConnect}>
              Check internet connetion and restart app
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003F76',
    justifyContent: 'space-between',
  },
  animatedSection: {justifyContent: 'center', alignItems: 'center'},
  logo: {width: 160, height: 160, marginTop: 300},
  imgbackground: {width: 440, height: 300},
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C4E3FF',
    position: 'absolute',
    bottom: 20,
    left: 100,
  },
  mainContainerNoConnect: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noConnect: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    alignSelf: 'center',
  },
});
