/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CustomIcons from './CustomIcons';
import DropDownComponents from './DropDownComponents';
import {AuthContext} from '../context/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import CameraSectionScreen from '../screens/CameraSectionScreen';
import Geolocation from '@react-native-community/geolocation';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export default function SimpleBtnComponent({
  title,
  onPress,
  visible,
  onRequestClose,
  onCloseBtn,
  data,
  data1,
  tokenData,
  singleData,
  userId,
  userName,
  handleTicketStatus,
  // handleTicketSubStatus,
  statusListId,
  subStatusListId,
}) {
  const navigation = useNavigation();

  const {suStatusId} = useContext(AuthContext);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [remark, setRemark] = useState('');

  const [status, setStatus] = useState('active');

  // merge both camera and gallery image collections in cache memory
  const [imageCollection, setImageCollection] = useState([]);

  // const [selectedTktStatusIdValue, setSelectedTktStatusIdValue] = useState('');
  const [selectedSubStatusIdValue, setSelectedSubStatusIdValue] = useState('');

  const [isCameraOptionsVisible, setIsCameraOptionsVisible] = useState(false);

  const {ticketJourneyByTktId, refreshStateApi} = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const statusId = singleData.ticketStatusId;
  const statusName = singleData.ticketStatusName;

  const subStatusId = singleData.subStatusId;
  const subStatusName = singleData.subStatusName;
  const ticketId = singleData.id;

  useEffect(() => {
    geolocations();
    setTktSubStatusListId(subStatusId);
  }, [subStatusId]);

  // fectch latitude and longitude
  const geolocations = () => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setLatitude(crd.latitude);
      setLongitude(crd.longitude);
    });
  };

  // const handleSelectTktStatusId = value => {
  //   if (value) {
  //     setSelectedTktStatusIdValue(value);
  //   } else {
  //     setSelectedTktStatusIdValue(statusId);
  //   }
  // };

  const handleSelectSubStatusId = value => {
    if (value) {
      setSelectedSubStatusIdValue(value);
    } else {
      setSelectedSubStatusIdValue(subStatusId);
    }
  };

  const [tktSubStatusListId, setTktSubStatusListId] = useState('');

  const newsubStatusList = suStatusId.map(({label, value}) => ({
    key: value,
    value: label,
  }));

  const handleTicketSubStatus = val => {
    if (val !== null && val !== undefined) {
      setTktSubStatusListId(val);
    } else {
      setTktSubStatusListId(subStatusId);
    }
  };

  const statusUpdate = onStatusUpdated => {
    setIsLoading(!isLoading);
    const myPromise = new Promise((resolve, reject) => {
      resolve(saveToGallery());
    });

    myPromise.then(result => {
      return refreshStateApi(
        tokenData,
        singleData.id,
        userName,
        userId,
        statusId,
        // statusListId,
        // selectedTktStatusIdValue,
        remark,
        // subStatusListId
        tktSubStatusListId,
        // selectedSubStatusIdValue,
        result,
        latitude,
        longitude,
        navigation,
      )
        .then(() => {
          setIsLoading(isLoading);
          ticketJourneyByTktId(tokenData, ticketId, navigation);
        })
        .catch(error => {
          setIsLoading(isLoading);
        });
    });
  };

  const handleOpenCameraOptions = () => {
    setIsCameraOptionsVisible(true);
  };

  const handleCloseImageAddOptions = () => {
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
              console.log('User cancelled image selection');
            } else if (response.error) {
              console.log('Image selection error:', response.error);
            } else if (response.assets) {
              let imgSource = [];
              response.assets.map(image => {
                imgSource.push({
                  fileName: image.fileName,
                  url: image.uri,
                  type: image.type,
                });
              });

              // Handle the selected images here
              setIsCameraOptionsVisible(false);

              //collect both camera and gallery imgs
              setImageCollection(prevCollection => [
                ...prevCollection,
                ...imgSource,
              ]);
            }
          });
        } catch {
          console.log('Camera not open');
        }
      } else {
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
          console.log('User cancelled image selection');
        } else if (response.error) {
          console.log('Image selection error:', response.error);
        } else if (response.assets) {
          // Get the selected images
          let selectedImages = [];
          response.assets.map(asset => {
            selectedImages.push({
              fileName: asset.fileName,
              url: asset.uri,
              type: asset.type,
            });
          });
          // Handle the selected images here
          // setSelectGalleryImg([...selectGalleryImg, selectedImages]);
          setIsCameraOptionsVisible(false);

          //collection both camera and gallery imgs
          setImageCollection(prevCollection => [
            ...prevCollection,
            ...selectedImages,
          ]);
        }
      });
    } catch {
      console.log('Gallery not open');
    }
  };

  const removeImage = index => {
    const updatedImages = [...imageCollection];
    updatedImages.splice(index, 1);
    setImageCollection(updatedImages);
  };

  const saveToGallery = async () => {
    try {
      const savedImagePaths = await Promise.all(imageCollection);
      return savedImagePaths;
    } catch (error) {
      console.log('Image save error:', error);
    }
  };

  const handlePress = () => {
    if (status === 'active') {
      statusUpdate();
      onRequestClose();
      setRemark('');
      setImageCollection([]);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.changeStatusBtn}>
      <Text style={styles.changeStatusBtnText}>{title}</Text>
      {/* popup box */}
      <View>
        <Modal
          visible={visible}
          animationType="slide"
          transparent={false}
          onRequestClose={onRequestClose}>
          <View style={styles.modalContainer}>
            {/* Comment update section */}
            <View style={styles.modalContent}>
              {/* Close button */}
              <TouchableOpacity style={styles.closeButton} onPress={onCloseBtn}>
                <CustomIcons name={'close-sharp'} size={20} color={'#000'} />
              </TouchableOpacity>

              <View>
                <DropDownComponents
                  title={'Ticket Status'}
                  data={newsubStatusList}
                  handleSelect={handleTicketSubStatus}
                  onSelectChange={handleSelectSubStatusId}
                  initialId={subStatusId}
                  initialValue={subStatusName}
                />
              </View>

              {/* Camera Section and Image Upload Section*/}
              <View style={styles.imageUpdateSection}>
                <CameraSectionScreen
                  handleOpenCameraOptions={handleOpenCameraOptions}
                  isCameraOptionsVisible={isCameraOptionsVisible}
                  handleCloseImageAddOptions={handleCloseImageAddOptions}
                  imageCollection={imageCollection}
                  removeImage={index => removeImage(index)}
                  handleImagePickerGallery={() => handleImagePickerGallery()}
                  handleCamera={() => handleCamera()}
                />
              </View>

              {/* Remarks section */}
              <View style={styles.remarkSection}>
                <TextInput
                  value={remark}
                  onChangeText={txt => {
                    setRemark(txt);
                  }}
                  editable
                  multiline
                  placeholder="Comment"
                  placeholderTextColor={'#656565'}
                  style={styles.placeholderBoxStyle}
                />
              </View>

              {/* UPDATE Button */}
              <View>
                {remark === '' ? (
                  <></>
                ) : (
                  <View style={[styles.updateBtnSection, {marginTop: 18}]}>
                    <TouchableOpacity
                      onPress={handlePress}
                      disabled={status !== 'active'}
                      style={
                        status === 'active'
                          ? styles.updateBtnStyle
                          : styles.updateBtnStyleNonTouchable
                      }>
                      <Text style={styles.updateBtnTextStyle}>Upload</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* This modal open when onPress of Upload Btn */}
        <Modal visible={isLoading} transparent={false}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: 20,
                borderRadius: 10,
              }}>
              <ActivityIndicator size="large" color="green" />
              <Text style={{marginTop: 10, color: '#000'}}>
                Don't Refresh or back to page while data uploading
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  changeStatusBtn: {
    backgroundColor: '#2F97C2',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 26,
  },
  changeStatusBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Raleway-Medium',
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
    paddingLeft: 4,
  },
  placeholderBoxStyle: {
    backgroundColor: '#DCDCDC',
    borderColor: '#DCDCDC',
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 10,
    color: '#656565',
  },
  updateBtnStyle: {
    backgroundColor: '#2F97C2',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: 5,
  },
  updateBtnStyleNonTouchable: {
    backgroundColor: 'grey',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  updateBtnTextStyle: {
    // fontWeight: 'bold',
    fontFamily: 'Raleway-Medium',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 26,
    paddingBottom: 18,
    width: responsiveWidth(80),
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 3,
  },
  dropDownView: {flexDirection: 'row', justifyContent: 'space-around'},
  dropDownComp: {marginLeft: 20},
  remarkSection: {marginTop: 20},
  updateBtnSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageUpdateSection: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // flexWrap: 'wrap',
  },
});
