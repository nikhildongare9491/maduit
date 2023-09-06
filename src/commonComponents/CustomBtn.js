import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const CustomBtn = ({onPress, title, bgColor, textColor, disabled, radius}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        onPress();
      }}
      style={[
        styles.btnView,
        {backgroundColor: bgColor, borderRadius: radius},
      ]}>
      <Text style={[styles.btnText, {color: {textColor}}]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({
  btnView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    width: responsiveWidth(90),
    height: responsiveHeight(8),
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Raleway-Medium',
    lineHeight: 19,
  },
});
