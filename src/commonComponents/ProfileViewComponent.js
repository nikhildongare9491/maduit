import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import CustomIcons from './CustomIcons';

export default function ProfileViewComponent({iconName, title}) {
  return (
    <View style={styles.container}>
      <View style={styles.profileIconBox}>
        <CustomIcons name={iconName} color={'#FFFFFF'} size={18} />
      </View>
      <Text style={styles.profileText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#02437C',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  profileIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#02437C',
    borderRadius: 50,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  profileText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Raleway-Medium',
  },
});
