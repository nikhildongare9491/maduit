import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';

import ImageOptionScreen from './ImageOptionScreen';
import CustomIcons from '../commonComponents/CustomIcons';

export default function CameraSectionScreen({
  handleOpenCameraOptions,
  isCameraOptionsVisible,
  handleCloseImageAddOptions,
  handleImagePickerGallery,
  handleCamera,
  imageCollection,
  removeImage,
}) {
  return (
    <View>
      <View style={styles.imgCamScetion}>
        {/* Display Images */}
        {imageCollection.length === 0 ? (
          <></>
        ) : (
          <View style={styles.imageContainer}>
            {imageCollection.map((imgUrl, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{uri: imgUrl.url}} style={styles.image} />
                <TouchableOpacity
                  onPress={removeImage}
                  style={styles.removeButton}>
                  <CustomIcons
                    name={'close-outline'}
                    size={18}
                    color={'rgba(220, 220, 220, 0.8)'}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleOpenCameraOptions}
          style={styles.addImageBtnBox}>
          {/* <Text style={styles.addImageBtnText}>Add Image</Text> */}
          <CustomIcons name={'camera'} size={30} color={'#000000'} />
        </TouchableOpacity>
      </View>

      {/* camera modal */}
      <View>
        {isCameraOptionsVisible && (
          <ImageOptionScreen
            onCloseBtn={handleCloseImageAddOptions}
            imagePickerGallery={handleImagePickerGallery}
            openCamera={handleCamera}
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
    backgroundColor: 'rgba(220, 220, 220, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    // flexWrap: 'wrap',
  },

  // for img adding with remove btn
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    // alignItems: 'center',
    // marginTop: 10,
    marginLeft: 16,
    maxWidth: '100%',
  },
  imageWrapper: {
    // position: 'relative',
    width: 60,
    aspectRatio: 1,
    marginRight: 5,
    marginBottom: 5,
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
