/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

import CustomIcons from './CustomIcons';
import ImageOptionScreen from '../screens/ImageOptionScreen';

export default function ComplianceChechkListCamera({
  parentId,
  questionId,
  selectedParentId,
  selectedQuestionId,
  handleOpenCameraOptions,
  isCameraOptionsVisible,
  handleCloseImageAddOptions,
  handleImagePickerGallery,
  handleCamera,
  imageCollection,
  removeImage,
}) {
  // console.log(imageCollection);
  const imageExists =
    imageCollection.some(
      item =>
        item.serviceCheckListId === parentId && item.questionId === questionId,
    ) || false;
  return (
    <View>
      <View style={styles.imgCamScetion}>
        {imageExists ? (
          <View
            style={{
              paddingVertical: 7,
              paddingHorizontal: 7,
              backgroundColor: '#FCFCFE',
              borderRadius: 10,
              elevation: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 20,
            }}>
            <CustomIcons
              name={'checkmark-done-outline'}
              size={20}
              color={'green'}
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleOpenCameraOptions}
              style={styles.addImageBtnBox}>
              <CustomIcons name={'camera-outline'} size={25} color={'black'} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* camera modal */}
      <View>
        {isCameraOptionsVisible && (
          <ImageOptionScreen
            onCloseBtn={handleCloseImageAddOptions}
            imagePickerGallery={() =>
              handleImagePickerGallery(selectedParentId, selectedQuestionId)
            }
            openCamera={() =>
              handleCamera(selectedParentId, selectedQuestionId)
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imgCamScetion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageBtnBox: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    backgroundColor: '#FCFCFE',
    borderRadius: 10,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },

  // for img adding with remove btn
  imageContainer: {
    marginRight: 15,
  },
  imageWrapper: {
    position: 'relative',
    width: 50,
    aspectRatio: 1,
    marginRight: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    // top: 1,
    right: 1,
  },
});
