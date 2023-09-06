import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commonComponents/Header';

const deviceWidth = Dimensions.get('window').width;

const ShowError = ({route}) => {
  const {msg} = route.params;

  const errorMsg = msg;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header title={'mAduit'} />
      {errorMsg === '404' ? (
        <View>
          <Text style={styles.showErrText}>Error 404: Resource not found</Text>
          <Text style={styles.showErrText}>
            Close the app and restart again.
          </Text>
        </View>
      ) : errorMsg === '503' ? (
        <View>
          <Text style={styles.showErrText}>
            Error 503: Service unavailable. Please try again later.
          </Text>
        </View>
      ) : errorMsg === 'NetErr' ? (
        <View>
          <Text style={styles.showErrText}>
            Network error: Please check your internet connection and restart the
            app.
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.showErrText}>Unknown Error. Restart the App</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ShowError;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth,
  },
  showErrText: {
    marginTop: 50,
    alignSelf: 'center',
    fontFamily: 'Raleway-Medium',
    fontSize: 18,
    color: '#000',
  },
});
