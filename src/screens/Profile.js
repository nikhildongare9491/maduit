/* eslint-disable react-native/no-inline-styles */
import {
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Pressable,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState} from 'react';
import CustomIcons from '../commonComponents/CustomIcons';
import ProfileViewComponent from '../commonComponents/ProfileViewComponent';
import {AuthContext} from '../context/AuthProvider';
import {BASE_URL_IMG} from '../Config';
import {Image} from 'react-native';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initializeDatabase from './DataBase';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageOptionScreen from './ImageOptionScreen';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Profile({route}) {
  const navigation = useNavigation();
  const {userProf, updateProfilePic} = useContext(AuthContext);

  const loginUserEmail = userProf.data.email;
  const userId = userProf.data.userId;

  const {token} = route.params;

  const [loading, setLoading] = useState(false);

  const [isCameraOptionsVisible, setIsCameraOptionsVisible] = useState(false);

  const logoutCall = async () => {
    try {
      const clearAsyncStorage = AsyncStorage.clear();

      const database = await initializeDatabase();

      await database.transaction(async tx => {
        const deletePromise = new Promise((resolve, reject) => {
          tx.executeSql(
            // 'UPDATE users SET token = NULL, email = NULL, password = NULL, fcmToken = NULL WHERE id = 1',
            'DELETE FROM users',
            [],
            (_, result) => {
              console.log('successfully:', result);
              resolve(result);
            },
            (_, error) => {
              console.error('Error to remove:', error);
              reject(error);
            },
          );
        });
        await deletePromise;
      });

      await clearAsyncStorage;

      navigation.navigate('Splash');
    } catch (error) {
      console.error('Error deleting user data: ', error);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword', {
      token,
      loginUserEmail,
    });
  };

  const handleOpenCameraOptions = () => {
    setIsCameraOptionsVisible(true);
    setLoading(true);
  };

  const handleCloseImageAddOptions = () => {
    setLoading(false);
    setIsCameraOptionsVisible(false);
  };

  const handleCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // storing camera capture image
        try {
          let options = {
            storageOption: {
              path: 'image',
              mediaType: 'photo',
            },
            includeBase64: true,
          };
          launchCamera(options, response => {
            if (response.didCancel) {
              // User canceled the camera operation
              setLoading(false);
              console.log('Camera canceled');
            } else if (response.error) {
              // An error occurred while accessing the camera
              setLoading(false);
              console.log('Camera error:', response.error);
            } else {
              // Image captured successfully
              const capturedImage = {
                fileName: response.assets[0].fileName,
                url: response.assets[0].uri,
                type: response.assets[0].type,
              };
              setIsCameraOptionsVisible(false);
              // console.log(capturedImage);
              updateProfilePic(token, userId, capturedImage, navigation);
              setLoading(false);
            }
          });
        } catch {
          setLoading(false);
          console.log('Camera not open');
        }
      } else {
        setLoading(false);
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImagePickerGallery = () => {
    try {
      let options = {
        storageOption: {
          path: 'image',
          mediaType: 'photo',
          multiple: true,
        },
      };
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          // User canceled the gallery operation
          setLoading(false);
          console.log('User cancelled image selection');
        } else if (response.error) {
          // An error occurred while accessing the gallery
          setLoading(false);
          console.log('Image selection error:', response.error);
        } else {
          // Get the selected images
          const capturedImage = {
            fileName: response.assets[0].fileName,
            url: response.assets[0].uri,
            type: response.assets[0].type,
          };
          setIsCameraOptionsVisible(false);
          // console.log(capturedImage);
          updateProfilePic(token, userId, capturedImage, navigation);
          setLoading(false);
        }
      });
    } catch {
      console.log('Gallery not open');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={require('../../assets/images/logoWall.png')}
          style={styles.topImgBackground}
        />
        {/* Profile Picture */}
        <View style={styles.imgBox}>
          <View style={styles.circle1}>
            {userProf.data.userImage !== '' ? (
              <Image
                source={{uri: BASE_URL_IMG + userProf.data.userImage}}
                style={styles.profileImg}
              />
            ) : (
              <View style={styles.circle2} />
            )}
            <Pressable
              style={styles.cameraIcon}
              onPressIn={handleOpenCameraOptions}>
              {loading ? (
                <ActivityIndicator color={'#FFFFFF'} style={styles.loader} />
              ) : (
                <CustomIcons
                  name={'camera-sharp'}
                  color={'#FFFFFF'}
                  size={25}
                />
              )}
              {isCameraOptionsVisible && (
                <ImageOptionScreen
                  onCloseBtn={handleCloseImageAddOptions}
                  imagePickerGallery={() => handleImagePickerGallery()}
                  openCamera={() => handleCamera()}
                />
              )}
            </Pressable>
          </View>
        </View>

        {/*Profile Names */}
        <View style={styles.profileContainer}>
          <ProfileViewComponent
            iconName={'person-sharp'}
            title={userProf.data.userName}
          />
          <ProfileViewComponent
            iconName={'mail-sharp'}
            title={userProf.data.email}
          />
          <ProfileViewComponent
            iconName={'call-sharp'}
            title={userProf.data.mobile}
          />
          <ProfileViewComponent
            iconName={'business-sharp'}
            title={`${userProf.data.cityName}, ${userProf.data.stateName}`}
          />
          <ProfileViewComponent
            iconName={'build-sharp'}
            title={userProf.data.roleName}
          />
          <View style={styles.horizontalLine} />
        </View>
        <Pressable
          onPress={handleChangePassword}
          style={({pressed}) => [
            styles.changePasswordBox,
            {backgroundColor: pressed ? '#ADD8E6' : '#02437C'},
          ]}>
          <View style={styles.lockIconBox}>
            <CustomIcons
              name={'lock-closed-sharp'}
              color={'#FFFFFF'}
              size={18}
            />
          </View>
          <Text style={styles.changePasswordText}>Change Password</Text>
        </Pressable>
        <Pressable
          onPress={logoutCall}
          style={({pressed}) => [
            styles.changePasswordBox,
            {
              justifyContent: 'center',
              marginBottom: 30,
              backgroundColor: pressed ? '#ADD8E6' : '#02437C',
            },
          ]}>
          <Text style={[styles.changePasswordText, {letterSpacing: 2}]}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#003F76'},
  topImgBackground: {
    width: 393,
    height: 250,
  },
  circle1: {
    width: 145,
    height: 140,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#039DB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle2: {
    width: 128,
    height: 122,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: '#D8E5FD',
  },
  imgBox: {
    marginTop: -180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#039DB8',
    position: 'absolute',
    top: 80,
    left: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {marginTop: 40},
  horizontalLine: {
    marginVertical: 20,
    borderColor: '#1D5789',
    borderWidth: 1,
    marginHorizontal: 30,
  },
  changePasswordBox: {
    backgroundColor: '#02437C',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  lockIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#02437C',
    borderRadius: 50,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  changePasswordText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Raleway-Medium',
  },
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
