import {TouchableOpacity} from 'react-native';
import React from 'react';
import CustomIcons from './CustomIcons';
import {useNavigation} from '@react-navigation/native';

export default function BackArrowComponent({style, color, size}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
      style={style}>
      <CustomIcons name={'arrow-back'} color={color} size={size} />
    </TouchableOpacity>
  );
}
