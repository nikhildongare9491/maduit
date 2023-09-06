import {TouchableOpacity} from 'react-native';
import React from 'react';
import CustomIcons from './CustomIcons';

export default function BackButton({style, onPress}) {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <CustomIcons name={'chevron-back'} color={'#FFFFFF'} size={20} />
    </TouchableOpacity>
  );
}
