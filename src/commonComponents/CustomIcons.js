import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function CustomIcons({name, color, size}) {
  return <Ionicons name={name} color={color} size={size} />;
}
