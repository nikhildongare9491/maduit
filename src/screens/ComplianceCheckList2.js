/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Header from '../commonComponents/Header';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import ComplianceChechkListCamera from '../commonComponents/ComplianceChechkListCamera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';

import {BASE_URL_IMG} from '../Config';
import {AuthContext} from '../context/AuthProvider';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function ComplainceCheckList2({route}) {
  const navigattion = useNavigation();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [surveyData, setSurveyData] = useState([]);

  // Camera options
  const [imageCollection, setImageCollection] = useState([]);

  const [isCameraOptionsVisible, setIsCameraOptionsVisible] = useState(false);

  // collect serviceCheckListId and checkListOptionId while open the camera
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  // route data
  const {journeyQues} = route.params;
  const {data} = route.params;
  const {userId} = route.params;
  const {ticketId} = route.params;

  useEffect(() => {
    geolocations();
  }, []);

  const geolocations = () => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setLatitude(crd.latitude);
      setLongitude(crd.longitude);
    });
  };

  // get UpdatedById here i.e. userId
  const {ticketCheckList} = useContext(AuthContext);

  const newData = journeyQues.data.serviceChecklist;

  const insents = useSafeAreaFrame();
  const scrollContainerStyle = {paddingBottom: insents.bottom};

  // store value and change the background color
  const [selectedOptionId, setSelectedOptionId] = useState({});

  // Disable update button
  const [updateBtn, setUpdateBtn] = useState(false);

  const totalHeight = newData.reduce((acc, currentItem) => {
    const checklistOptionsCount = currentItem.checklistOptions.length;
    return acc + checklistOptionsCount * 23;
  }, 0);

  const handleAnswer = (optionId, questionId, answer) => {
    handleDataUpdate(optionId, questionId, 'answer', answer);
    setSelectedOptionId(prevSelectedOptions => ({
      ...prevSelectedOptions,
      [questionId]: {optionId, answer},
    }));
  };

  const handleRemark = (optionId, questionId, remark) => {
    handleDataUpdate(optionId, questionId, 'remark', remark);
  };

  const handleDataUpdate = (optionId, questionId, dataToUpdate, value) => {
    setSurveyData(prevData => {
      const updatedData = {...prevData};
      if (!updatedData[optionId]) {
        updatedData[optionId] = [];
      }
      const existingAnswerIndex = updatedData[optionId].findIndex(
        item => item.questionId === questionId,
      );

      if (existingAnswerIndex !== -1) {
        updatedData[optionId][existingAnswerIndex] = {
          ...updatedData[optionId][existingAnswerIndex],
          [dataToUpdate]: value,
          // images: imageCollection.filter(
          //   image =>
          //     image.questionId === questionId &&
          //     image.serviceCheckListId === optionId,
          // ),
        };
      } else {
        updatedData[optionId].push({
          questionId,
          [dataToUpdate]: value,
          // images: imageCollection.filter(
          //   image =>
          //     image.questionId === questionId &&
          //     image.serviceCheckListId === optionId,
          // )
        });
      }

      return updatedData;
    });
  };

  const handleOpenCameraOptions = (parentId, questionId) => {
    setIsCameraOptionsVisible(true);
    setSelectedParentId(parentId);
    setSelectedQuestionId(questionId);
  };

  const handleCloseImageAddOptions = () => {
    setIsCameraOptionsVisible(false);
  };

  const handleCamera = async (parentId, questionId) => {
    // console.log(parentId, questionId);
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
          };
          launchCamera(options, response => {
            if (response.didCancel) {
              // User canceled the camera operation
              // setLoading(false);
              console.log('Camera canceled');
            } else if (response.error) {
              // An error occurred while accessing the camera
              // setLoading(false);
              console.log('Camera error:', response.error);
            } else {
              let imgSource = [];
              response.assets.map(image => {
                imgSource.push({
                  fileName: image.fileName,
                  url: image.uri,
                  type: image.type,
                  serviceCheckListId: parentId,
                  questionId: questionId,
                });
              });
              // console.log(imgSource);
              setIsCameraOptionsVisible(false);
              //collect both camera and gallery imgs
              setImageCollection(preImg => [...preImg, ...imgSource]);
              handleDataUpdate(parentId, questionId, 'images', imgSource);
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

  const handleImagePickerGallery = (parentId, questionId) => {
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
              serviceCheckListId: parentId,
              questionId: questionId,
            });
          });

          setIsCameraOptionsVisible(false);
          //collection both camera and gallery imgs
          setImageCollection(preImg => [...preImg, ...selectedImages]);
          handleDataUpdate(parentId, questionId, 'imgaes', selectedImages);
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

  const [isLoading, setIsLoading] = useState(false);

  // updating or adding compliance ticket check list
  const handleUpload = async () => {
    setIsLoading(!isLoading);
    try {
      const result = await ticketCheckList(
        data,
        userId,
        ticketId,
        surveyData,
        latitude,
        longitude,
        navigattion,
      );

      if (result.message === 'success') {
        setIsLoading(isLoading);
        Alert.alert('All data has been submitted successfully.');
        navigattion.goBack();
      }
    } catch (error) {
      console.log('Error occurred while submitting checklist:', error);
    }
    setUpdateBtn(true);
  };

  // reset all data
  const handleReset = () => {
    setImageCollection([]); // Clear image collection
    setSelectedOptionId({}); // Clear selected options
    setSurveyData([]); // Clear survey data
  };

  return (
    <SafeAreaView styles={styles.container}>
      <Header
        title={'Check List'}
        showButton
        onPress={() => {
          navigattion.goBack();
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollContainerStyle}>
        {newData.length > 0 ? (
          <>
            {newData.map(checkListItem => (
              <View key={checkListItem.id} style={{marginLeft: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      justifyContent: 'center',
                      marginTop: 15,
                      marginLeft: 10,
                    }}>
                    <Image
                      source={{uri: BASE_URL_IMG + checkListItem.iconImage}}
                      style={{width: '100%', height: '100%'}}
                    />
                  </View>
                  <Text style={styles.airCon}>
                    {checkListItem.checklistName}
                  </Text>
                  <View
                    style={[
                      styles.journeySubCategorySectionLine,
                      {height: totalHeight},
                    ]}
                  />
                </View>
                {checkListItem.checklistOptions.map((option, index) => (
                  <View key={index} style={{marginBottom: 20}}>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                      <Text style={styles.qText}>Q</Text>
                      <Text style={styles.questionText}>
                        {option.optionsName}
                      </Text>
                      <Image
                        source={{uri: BASE_URL_IMG + option.iconImage}}
                        style={{
                          width: 20,
                          height: 20,
                          marginHorizontal: 10,
                          marginTop: 5,
                        }}
                      />
                    </View>
                    <View style={styles.journeyCategorySectionLine} />
                    <View style={styles.cameraView}>
                      <View style={styles.answerBox}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={[
                            styles.touchBox,
                            styles.yesTextBox,
                            selectedOptionId[option.id] &&
                            selectedOptionId[option.id].answer === true
                              ? styles.selectYesBox
                              : null,
                          ]}
                          onPress={() =>
                            handleAnswer(
                              option.serviceCheckListId,
                              option.id,
                              true,
                            )
                          }>
                          <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={[
                            styles.touchBox,
                            styles.noTextBox,
                            selectedOptionId[option.id] &&
                            selectedOptionId[option.id].answer === false
                              ? styles.selectNoBox
                              : null,
                          ]}
                          onPress={() =>
                            handleAnswer(
                              option.serviceCheckListId,
                              option.id,
                              false,
                            )
                          }>
                          <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                      </View>

                      {/* camera ang image section */}
                      <View style={{}}>
                        <ComplianceChechkListCamera
                          parentId={option.serviceCheckListId}
                          questionId={option.id}
                          selectedParentId={selectedParentId}
                          selectedQuestionId={selectedQuestionId}
                          handleOpenCameraOptions={() =>
                            handleOpenCameraOptions(
                              option.serviceCheckListId,
                              option.id,
                            )
                          }
                          isCameraOptionsVisible={isCameraOptionsVisible}
                          handleCloseImageAddOptions={
                            handleCloseImageAddOptions
                          }
                          imageCollection={imageCollection}
                          removeImage={() => removeImage(index)}
                          handleImagePickerGallery={handleImagePickerGallery}
                          handleCamera={handleCamera}
                        />
                      </View>
                    </View>
                    {/* Conditional rendering for message */}
                    {selectedOptionId[option.id] === undefined && (
                      <Text
                        style={{color: 'red', marginLeft: 75, marginBottom: 5}}>
                        Please select Yes or No
                      </Text>
                    )}
                    {/* remark Section */}
                    <View style={styles.remarkSection}>
                      <TextInput
                        placeholder="Remarks"
                        placeholderTextColor={'#A9A9A9'}
                        multiline
                        style={styles.textInput}
                        onChangeText={text =>
                          handleRemark(
                            option.serviceCheckListId,
                            option.id,
                            text,
                          )
                        }
                      />
                    </View>
                  </View>
                ))}
              </View>
            ))}
            {/* update and reset button */}
            <View style={styles.updateresetContainer}>
              <TouchableOpacity
                disabled={updateBtn}
                style={[styles.btnView, styles.uploadBtnView]}
                onPress={handleUpload}>
                <Text style={styles.btnViewText}>Update</Text>
                <Modal isVisible={isLoading}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        alignItems: 'center',
                      }}>
                      <ActivityIndicator size="large" color="green" />
                      <Text style={{marginTop: 10, color: '#000'}}>
                        Don't Refresh or back to page while data uploading
                      </Text>
                    </View>
                  </View>
                </Modal>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnView, styles.resetBtnView]}
                onPress={handleReset}>
                <Text style={styles.btnViewText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={{color: '#000', fontSize: 16}}>No Data found</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, height: deviceHeight, width: deviceWidth},
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
    marginTop: 12,
    fontSize: 22,
    fontWeight: '700',
    color: 'red',
    letterSpacing: 1,
    marginLeft: 16,
    textAlign: 'center',
  },

  qText: {
    width: 30,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    color: '#F55522',
    fontSize: 22,
    textAlign: 'center',
    elevation: 1,
    fontWeight: '600',
    marginLeft: 40,
  },
  questionText: {
    marginLeft: 10,
    marginTop: 4,
    fontSize: 17,
    fontWeight: '600',
    color: '#323232',
    letterSpacing: 1,
    textAlign: 'center',
  },
  answerBox: {
    marginLeft: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchBox: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
    elevation: 1,
  },
  yesTextBox: {backgroundColor: '#D3D3D3'},
  noTextBox: {backgroundColor: '#D3D3D3', marginLeft: 10},
  buttonText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  selectYesBox: {backgroundColor: '#7DC780'},
  selectNoBox: {backgroundColor: '#ED6A20', marginLeft: 10},
  touchCam: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    backgroundColor: '#FCFCFE',
    borderRadius: 10,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  textInput: {
    marginLeft: 50,
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 1,
    paddingLeft: 15,
    color: '#000',
  },
  updateresetContainer: {
    marginTop: 60,
    marginBottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btnView: {
    width: 173,
    height: 40,
    borderRadius: 10,
  },
  uploadBtnView: {
    backgroundColor: '#2F97C2',
  },
  btnViewText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    top: 8,
  },
  resetBtnView: {
    backgroundColor: '#7EC781',
  },
  cameraView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 6,
    marginBottom: 10,
  },
  remarkSection: {
    marginLeft: 30,
  },
  questionSection: {
    // width: '90%',
    // alignSelf: 'center',
  },
  quesContainer: {flexDirection: 'row'},

  journeySubCategorySectionLine: {
    borderStyle: 'dotted',
    // height: 810,
    borderLeftWidth: 3,
    borderColor: '#C0C0C0',
    position: 'absolute',
    left: 24,
    top: 34,
  },
  journeyCategorySectionLine: {
    borderStyle: 'dotted',
    height: 120,
    borderLeftWidth: 3,
    borderColor: '#C0C0C0',
    position: 'absolute',
    top: 34,
    left: 55,
  },
});
