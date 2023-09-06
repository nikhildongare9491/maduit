import initializeDatabase from '../DataBase';

export const handleNavigationOnError = async (error, navigation) => {
  let deleteDatabase = false;

  if (error.response) {
    // Handle HTTP response errors
    if (error.response.status === 401) {
      deleteDatabase = true;
    } else if (error.response.status === 404) {
      navigation.navigate('ShowError', {msg: '404'});
    } else if (error.response.status === 503) {
      navigation.navigate('ShowError', {msg: '503'});
    } else {
      navigation.navigate('ShowError', {msg: 'GenErr'});
    }
  } else if (error.message === 'Network Error') {
    // Handle network errors
    navigation.navigate('ShowError', {msg: 'NetErr'});
  } else {
    deleteDatabase = true;
  }

  if (deleteDatabase) {
    const database = await initializeDatabase();
    await database.transaction(async tx => {
      const deletePromise = new Promise((resolve, reject) => {
        tx.executeSql(
          // 'UPDATE users SET token = NULL, email = NULL, password = NULL, fcmToken = NULL WHERE id = 1',
          'DELETE FROM users',
          [],
          (_, result) => {
            console.log('successfully:', result);
            resolve(result);
          },
          (_, err) => {
            console.error('Error to remove:', err);
            reject(error);
          },
        );
      });
      await deletePromise;
    });
  }

  navigation.navigate('Splash');
};
