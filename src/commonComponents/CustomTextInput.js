import {View, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import React from 'react';
import CustomIcons from './CustomIcons';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const CustomTextInput = ({
  editable,
  placeholder,
  isChange,
  onChangeTextValue,
  isSecureTextEntry,
  iconsShow,
  rightImg,
  value,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        editable={editable}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={isChange ? 'red' : 'grey'}
        secureTextEntry={isSecureTextEntry}
        onChangeText={onChangeTextValue}
        style={styles.placeholderTextStyle}
      />
      {rightImg ? (
        <TouchableOpacity onPress={iconsShow} style={styles.iconStyle}>
          {isSecureTextEntry ? (
            <CustomIcons name={'eye-off-sharp'} color={'grey'} size={20} />
          ) : (
            <CustomIcons name={'eye-sharp'} color={'grey'} size={20} />
          )}
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(90),
    height: responsiveHeight(8),
    borderRadius: responsiveWidth(2),
    Height: 59,
    Top: 426,
    borderColor: '#fff',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  placeholderTextStyle: {
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Raleway-Medium',
    color: '#000',
  },
  iconStyle: {position: 'absolute', right: 10},
});
