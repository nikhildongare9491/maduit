import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import BackButton from './BackButton';

export default function Header({title, onPress, showButton}) {
  return (
    <View style={styles.container}>
      <View style={styles.containerSection}>
        {showButton && (
          <BackButton style={styles.btnSection} onPress={onPress} />
        )}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {width: '100%', height: 80, backgroundColor: '#033764'},
  containerSection: {
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSection: {
    width: 32.4,
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#04447B',
    borderRadius: 8,
    position: 'absolute',
    left: 15,
  },
  titleSection: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 18,
    color: '#EEEEEE',
    // fontWeight: '600',
    fontFamily: 'Raleway-ExtraBoldItalic',
  },
});
