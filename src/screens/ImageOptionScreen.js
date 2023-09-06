import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import React from 'react';
import CustomIcons from '../commonComponents/CustomIcons';

export default function ImageOptionScreen({
  visible,
  onCloseBtn,
  imagePickerGallery,
  openCamera,
}) {
  return (
    <View style={styles.container}>
      <Modal
        visible={visible}
        animationIn={'bounce'}
        style={styles.modalStyle}
        transparent={false}
        onBackButtonPress={onCloseBtn}>
        <View style={styles.popBoxStyle}>
          <View style={styles.popBoxContainer}>
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={openCamera} style={styles.btnBox}>
                <CustomIcons name="camera-outline" size={45} color={'#000'} />
                <Text style={styles.btnText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={imagePickerGallery}
                style={styles.btnBox}>
                <CustomIcons name="folder-outline" size={45} color={'#000'} />
                <Text style={styles.btnText}>Galley</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  modalStyle: {marginLeft: 0, marginRight: 0, marginTop: 0, width: '100%'},
  popBoxStyle: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)'},
  popBoxContainer: {
    width: '100%',
    height: 100,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 40,
  },
  btnBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});
