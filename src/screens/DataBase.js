import SQLite from 'react-native-sqlite-storage';

let databaseInitialized = false;
let databasePromise = null;

const initializeDatabase = () => {
  if (databaseInitialized) {
    return databasePromise;
  }

  databasePromise = new Promise((resolve, reject) => {
    const databaseName = 'maudit.db';
    const database = SQLite.openDatabase(
      {
        name: databaseName,
        location: 'default',
      },
      () => {
        console.log('Database opened successfully');
        // If the database is successfully opened, check if the 'users' table exists
        database.transaction(tx => {
          tx.executeSql(
            'SELECT name FROM sqlite_master WHERE type="table" AND name="users"',
            [],
            (_tt, results) => {
              if (results.rows.length === 0) {
                // 'users' table doesn't exist, create the table
                tx.executeSql(
                  'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, email TEXT, password TEXT, fcmToken TEXT)',
                  [],
                  () => {
                    console.log('Table created successfully');
                    resolve(database);
                  },
                  error => {
                    console.error('Error creating table: ', error);
                    reject(error);
                  },
                );
              } else {
                // 'users' table already exists, resolve the promise with the database object
                resolve(database);
              }
            },
            error => {
              console.error('Error checking table: ', error);
              reject(error);
            },
          );
        });
      },
      error => {
        console.error('Error opening database: ', error);
        reject(error);
      },
    );
  });

  databaseInitialized = true;
  return databasePromise;
};

export const saveLoginCredentials = (token, email, password, fcmToken) => {
  initializeDatabase()
    .then(database => {
      database.transaction(tx => {
        tx.executeSql(
          'INSERT INTO users (token, email, password, fcmToken) VALUES (?, ?, ?, ?)',
          [token, email, password, fcmToken],
          () => {
            console.log('Login credentials saved');
          },
          error => {
            console.error('Error saving login credentials: ', error);
          },
        );
      });
    })
    .catch(error => {
      console.error('Error initializing database: ', error);
    });
};

export const clearLoginCredentials = () => {
  initializeDatabase()
    .then(database => {
      database.transaction(tx => {
        tx.executeSql(
          'UPDATE users SET email = null, password = null ',
          [],
          () => {
            console.log('Login credentials cleared');
          },
          error => {
            console.error('Error clearing login credentials: ', error);
          },
        );
      });
    })
    .catch(error => {
      console.error('Error initializing database: ', error);
    });
};

export default initializeDatabase;

// export {initializeDatabase, saveLoginCredentials, clearLoginCredentials};
