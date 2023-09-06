import {Text, Pressable, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';

const TechnicianButton = ({onPress, title, loader}) => {
  return (
    <Pressable style={styles.btnStyle} onPress={onPress}>
      {loader ? (
        <ActivityIndicator color={'#FFFFFF'} style={styles.loader} />
      ) : (
        <Text style={styles.txtStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

export default TechnicianButton;

const styles = StyleSheet.create({
  btnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#2F97C2',
    borderRadius: 4,
    paddingVertical: 5,
  },
  txtStyle: {
    fontFamily: 'Raleway-Medium',
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 30,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
