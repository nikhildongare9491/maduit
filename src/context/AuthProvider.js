import React, {createContext, useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, ToastAndroid} from 'react-native';
import initializeDatabase from '../screens/DataBase';
import {handleNavigationOnError} from '../screens/ErrorHandling/ErrorHandling';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [userProf, setUserProf] = useState({});
  const [ticketEntryDetails, setTicketEntryDetails] = useState([]);
  const [subStatusList, setSubStatusList] = useState([]);

  const [suStatusId, setSuStatusId] = useState([]);

  const [singleTktInfo, setSingleTktInfo] = useState('');
  const [ticketJourney, setTicketJourney] = useState([]);

  const [closedTkts, setClosedTkts] = useState([]);

  // No. 01 API
  const loginToken = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/GenerateToken`, {
        username: 'mAudit',
        password: 'Nimda@123',
      });
      let res = await response.data;
      console.log('Access Token :', res);
      await AsyncStorage.setItem('Token', JSON.stringify(res));
    } catch (err) {
      console.log(err.message);
      // await handleNavigationOnError(err, navi);
    }
  };

  // Instance of axios
  const getApi = token => {
    const api = axios.create({
      baseURL: `${BASE_URL}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return api;
  };

  // No. 02 API
  const clientLogin = async (
    token,
    email,
    password,
    navigation,
    fcmToken,
    dbToken,
  ) => {
    try {
      const response = await getApi(token).get('/TechnicianLogin', {
        params: {email: email, password: password},
      });
      const result = await response.data;
      if (result.message === 'success') {
        // SQLite database
        const storeUserCredentials = async () => {
          const database = await initializeDatabase();
          database.transaction(tx => {
            // Check if the credentials already exist in the database
            tx.executeSql(
              'SELECT * FROM users WHERE token = ? AND email = ? AND password = ? AND fcmToken = ?',
              [token, email, password, fcmToken],
              (_tx, results) => {
                const existingRow = results.rows.length;
                if (existingRow === 0) {
                  // User credentials already exist, update them
                  tx.executeSql(
                    'INSERT INTO users (token, email, password, fcmToken) VALUES (?, ?, ?, ?)',
                    [token, email, password, fcmToken],
                    () => {
                      console.log('User credentials stored successfully');
                    },
                    error => {
                      console.error('Error storing user credentials: ', error);
                    },
                  );
                } else {
                  // User credentials don't exist, insert them
                  console.log('user crendetal alredy stored');
                }
              },
              error => {
                console.error('Error checking user credentials: ', error);
              },
            );
          });
        };

        await storeUserCredentials();
        // SQLite end here
        await AsyncStorage.setItem('LoginData', JSON.stringify(result));
        navigation.navigate('BtmNav', {token, fcmToken, dbToken});
      } else {
        // console.log(response.data);
        Alert.alert('Incorrect Email or Password');
      }
    } catch (error) {
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 03 API
  const techniDetails = async (token, userId, navigation) => {
    try {
      const response = await getApi(token).get('/GetTechnicianDetailByUserId', {
        params: {
          userid: userId,
        },
      });
      const result = await response.data;
      setUserProf(result);
    } catch (error) {
      // console.log('techniDetails');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 04 API
  const techniPasswordChange = async (
    token,
    email,
    oldpassword,
    newpassword,
    navigation,
    refreshLoading,
    setOldPwd,
    setNewPwd,
    setConfirmNewPwd,
  ) => {
    // console.log(token, email, oldpassword, newpassword);
    try {
      const response = await getApi(token).post(
        '/TechnicianPasswordChange',
        null,
        {
          params: {
            email: email,
            oldpassword: oldpassword,
            newpassword: newpassword,
          },
        },
      );
      const res = await response.data;
      if (res.message === 'success') {
        const clearAsyncStorage = AsyncStorage.clear();

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
              (_, error) => {
                console.error('Error to remove:', error);
                reject(error);
              },
            );
          });
          await deletePromise;
        });

        await clearAsyncStorage;

        ToastAndroid.show('Password Change Successfully', ToastAndroid.LONG);

        setOldPwd('');
        setNewPwd('');
        setConfirmNewPwd('');
        refreshLoading(false);
        navigation.navigate('Splash');
      } else {
        ToastAndroid.show(res.message, ToastAndroid.LONG);
      }
    } catch (error) {
      // console.log('techniPasswordChange');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 05 API
  const techniForgetPassword = async (
    token,
    email,
    navigation,
    refreshLoading,
    setEmail,
  ) => {
    // console.log(token, email);
    try {
      const response = await getApi(token).get('/ForgotLoginPassword', {
        params: {
          email: email,
        },
      });
      const result = await response.data;
      if (result.message === 'success') {
        refreshLoading(false);
        setEmail('');
        Alert.alert('Link has been send to email address for change password.');
        navigation.navigate('Splash');
      } else {
        refreshLoading(false);
        Alert.alert('Email not Found');
      }
    } catch (error) {
      // console.log('techniForgetPassword');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 06 API no parameter required
  const ticketStatusList = async (token, refreshState, navigation) => {
    try {
      const response = await getApi(token).get('/TicketStatusList');
      const result = await response.data.data;

      refreshState(result);
      // await AsyncStorage.setItem('TicketStatus', JSON.stringify(result));
    } catch (error) {
      // console.log('ticketStatusList');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 07 API
  const subStatusTktList = async (token, ticketstatusid, navigation) => {
    try {
      const response = await getApi(token).get(
        '/SubStatusListByTicketstatusid',
        {
          params: {
            ticketstatusid: ticketstatusid,
          },
        },
      );
      const result = await response.data.data;
      console.log(result);
      // await AsyncStorage.setItem('TicketSubStatus', JSON.stringify(result));
      // refreshState(result);
      setSubStatusList(result);
    } catch (error) {
      // console.log('subStatusTktList');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 08 API
  const bindTicketEntryDetailsByTechnicianId = async (
    token,
    technicianid,
    navigation,
  ) => {
    try {
      const getTechniId = technicianid.data.userId;
      const response = await getApi(token).get('/TicketListByTechnicianId', {
        params: {
          technicianid: getTechniId,
        },
      });
      // console.log(response.data);
      const res = await response.data;
      if (res.message === 'success') {
        setTicketEntryDetails(res.data);
      } else {
        setTicketEntryDetails([]);
      }
    } catch (error) {
      // console.log('bindTicketEntryDetailsByTechnicianId');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 09 API
  const ticketJourneyByTktId = async (
    token,
    ticketId,
    // refreshState,
    navigation,
  ) => {
    try {
      const response = await getApi(token).get('/GetJourneyByTicketId', {
        params: {
          ticketId: ticketId,
        },
      });
      const result = await response.data;
      if (result.message === 'success') {
        setTicketJourney(result.data);
      } else {
        setTicketJourney([]);
      }
      // setTicketJourney(result);
      // refreshState(result);
    } catch (error) {
      // console.log('ticketJourneyByTktId');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
      return null;
    }
  };

  // No. 10 API
  const addTicketJourney = async (
    token,
    tktEntryId,
    userName,
    userId,
    tktStatusId,
    remark,
    subStatusId,
    navigation,
  ) => {
    // console.log('tktStatusId', tktStatusId);
    // console.log('suStatusId', subStatusId);
    try {
      const response = await getApi(token).post(
        '/AddTicketJournetTechnicianWise',
        {
          ticketEntryId: tktEntryId,
          updatedBy: userName,
          updatedById: userId,
          ticketStatusId: tktStatusId,
          remarks: remark,
          subStatusId: subStatusId,
        },
      );
      const result = response.data;
      return result;
    } catch (error) {
      // console.log('addTicketJourney');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 11 API fetch
  const addJourneyImage = async (
    token,
    journeyImg,
    tktEntryId,
    ticketJourneyId,
    latitude,
    longitude,
    navigation,
  ) => {
    try {
      const results = [];
      for (const img of journeyImg) {
        const formData = new FormData();
        formData.append('TicketId', tktEntryId);
        formData.append('TicketJourneyId', ticketJourneyId);
        formData.append('JourneyImageFormFile', {
          uri: img.url,
          name: img.fileName,
          type: img.type,
        });
        formData.append('Latitude', latitude);
        formData.append('Longitude', longitude);

        const response = await getApi(token).post(
          '/AddJournetImageByJourneyid',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        const result = response.data;
        if (result.message === 'success') {
          results.push(result.data);
          // Alert.alert('Data Save Successfully');
        }
      }
      if (results.length > 0) {
        Alert.alert('Data Saved Successfully');
      }
      return results;
    } catch (error) {
      // console.log('addJourneyImage');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // Here API 10 and API 11 called
  const refreshStateApi = async (
    tokenData,
    tktEntryId,
    userName,
    userId,
    tktStatusId,
    remark,
    subStatusId,
    journeyImg,
    latitude,
    longitude,
    navigation,
  ) => {
    try {
      const result1 = await addTicketJourney(
        tokenData,
        tktEntryId,
        userName,
        userId,
        tktStatusId,
        remark,
        subStatusId,
        navigation,
      );

      const journeyId = result1.journeyid;

      if (
        result1.message === 'success' &&
        journeyId !== '' &&
        Array.isArray(journeyImg) &&
        journeyImg.length > 0
      ) {
        const journeyImageResult = await addJourneyImage(
          tokenData,
          journeyImg,
          tktEntryId,
          journeyId,
          latitude,
          longitude,
          navigation,
        );
        return journeyImageResult;
      } else {
        Alert.alert('Data Save Successfully');
      }
    } catch (error) {
      // console.log('Error in refreshState:', error);
      // throw error;
      await handleNavigationOnError(error, navigation);
    }
  };

  // No. 17 API updating or adding compliance ticket check list
  const ticketCheckList = async (
    token,
    updatedByid,
    ticketEntryId,
    checkListData,
    latitude,
    longitude,
    navigation,
  ) => {
    try {
      const optionIds = Object.keys(checkListData);
      let result = '';

      for (const optionId of optionIds) {
        const dataValue = checkListData[optionId];

        for (const data of dataValue) {
          const formData = new FormData();
          formData.append('UpdatedByid', updatedByid);
          formData.append('TicketEntryId', ticketEntryId);
          const image = data.images[0];
          formData.append('id', image.serviceCheckListId);
          formData.append('ChecklistOptionsid', image.questionId);
          formData.append('IsWorking', data.answer);
          formData.append('Remark', data.remark);
          console.log(image);
          formData.append('FormFile', {
            uri: image.url,
            name: image.fileName,
            type: image.type,
          });
          formData.append('Latitude', latitude);
          formData.append('Longitude', longitude);

          const response = await getApi(token).post(
            '/AddTicketCheckListByTechnician',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          result = response.data;
        }
      }
      return result;
    } catch (error) {
      // console.log('ticketCheckList');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // API for Compliance Questions List
  const getComplianceQuestionList = async (
    token,
    ticketId,
    refreshState,
    navigation,
  ) => {
    try {
      const response = await getApi(token).get(
        '/GetComplianceQuestionListByTicketId',
        {
          params: {
            ticketId: ticketId,
          },
        },
      );
      const result = response.data;
      refreshState(result);
    } catch (error) {
      // console.log('getComplianceQuestionList');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // API for change ETA ChangeEtaByTechnician
  const changeETA = async (
    token,
    ticketid,
    ticketStatusId,
    updatedById,
    eta,
    oldeta,
    navigation,
  ) => {
    try {
      const response = await getApi(token).post(
        '/ChangeEtaByTechnician',
        null,
        {
          params: {
            ticketid: ticketid,
            subStatusId: ticketStatusId,
            updatedById: updatedById,
            eta: eta,
            oldeta: oldeta,
          },
        },
      );

      const result = await response.data;
      return result;
    } catch (error) {
      await handleNavigationOnError(error, navigation);
    }
  };

  // API for Compliance Check List Journey By Tkt Id
  const checkListJourneyByTktId = async (
    token,
    ticketId,
    refreshState,
    navigation,
  ) => {
    try {
      const response = await getApi(token).get('/CheckListJourneyByTeckeId', {
        params: {
          id: ticketId,
        },
      });
      const result = await response.data;
      // console.log('Compliance Journey', result);
      refreshState(result);
    } catch (error) {
      // console.log('checkListJourneyByTktId');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // Update Device Token
  const updateDeviceToken = async (
    token,
    technecianId,
    deviceToken,
    navigation,
  ) => {
    let deviceRegistered = false;
    try {
      if (!deviceRegistered) {
        const response = await getApi(token).post('/UpdateDeviceToken', null, {
          params: {
            technecianId: technecianId,
            devicetoken: deviceToken,
          },
        });
        const result = response.data;
        // console.log(result);
        deviceRegistered = true;
        return result;
      } else {
        console.log('Device already registered, skipping update');
      }
    } catch (error) {
      // console.log('updateDeviceToken');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // Ticket Details by Tkt id
  const singleTicketDetails = async (
    token,
    ticketid,
    // refreshState,
    navigation,
  ) => {
    try {
      const response = await getApi(token).get('/TicketDetailByTicketId', {
        params: {
          ticketid: ticketid,
        },
      });
      const result = await response.data;
      // console.log('Single Ticket Details', result);
      if (result.message === 'success') {
        setSingleTktInfo(result.data);
      } else {
        setSingleTktInfo();
      }
      // refreshState(result.data);
    } catch (error) {
      // console.log('singleTicketDetails');
      // console.log(error);
      await handleNavigationOnError(error, navigation);
    }
  };

  // Ticket Accepted
  const updateTicketAccepted = async (
    token,
    ticketid,
    technicianid,
    navigation,
    refreshLoading,
  ) => {
    try {
      const response = await getApi(token).post('/UpdateTicketAccepted', null, {
        params: {
          ticketid: ticketid,
          technicianid: technicianid,
        },
      });
      const result = response.data;
      if (result.message === 'success') {
        refreshLoading(false);
        ToastAndroid.show(result.data, ToastAndroid.LONG);
      }
      // console.log(response.data);
    } catch (error) {
      await handleNavigationOnError(error, navigation);
    }
  };

  // Ticket Reached
  const updateTicketReached = async (
    token,
    ticketid,
    technicianid,
    navigation,
    refreshLoading,
  ) => {
    try {
      const response = await getApi(token).post('/UpdateTicketReached', null, {
        params: {
          ticketid: ticketid,
          technicianid: technicianid,
        },
      });
      const result = response.data;
      if (result.message === 'success') {
        refreshLoading(false);
        ToastAndroid.show(result.data, ToastAndroid.LONG);
      }
      // console.log(response.data);
    } catch (error) {
      await handleNavigationOnError(error, navigation);
    }
  };

  // Profile image change
  const updateProfilePic = async (token, userId, image, navigation) => {
    try {
      const formData = new FormData();
      formData.append('UserId', userId);
      formData.append('FormFile', {
        uri: image.url,
        name: image.fileName,
        type: image.type,
      });
      const response = await getApi(token).post(
        '/UpdateUserProfilepicture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      // console.log(response);
      const result = await response.data;
      if (result.message === 'success') {
        ToastAndroid.show(
          'Profile photo change successfully',
          ToastAndroid.LONG,
        );
      } else {
        ToastAndroid.show('Try again', ToastAndroid.LONG);
      }
    } catch (error) {
      await handleNavigationOnError(error, navigation);
    }
  };

  // all sub status in api
  const getAllSuStatusForTechnician = async (token, id) => {
    try {
      const response = await getApi(token).get('/GetAllSuStatusForTechnician', {
        params: {
          id: id,
        },
      });
      // console.log(response.data);
      const result = response.data.data;
      setSuStatusId(result);
    } catch (error) {
      console.log(error);
    }
  };

  // closed tickets
  const closeTickets = async (token, technicianid, navigation) => {
    const techId = technicianid.data.userId;
    try {
      const response = await getApi(token).get('/GetAllPermanentCloesdTicket', {
        params: {
          techid: techId,
        },
      });
      const res = await response.data;
      if (res.message === 'success') {
        setClosedTkts(res.data);
      } else {
        setClosedTkts([]);
      }
    } catch (error) {
      await handleNavigationOnError(error, navigation);
    }
  };

  const contextVale = {
    loginToken,
    clientLogin,
    techniDetails,
    userProf,
    techniPasswordChange,
    techniForgetPassword,
    bindTicketEntryDetailsByTechnicianId,
    ticketEntryDetails,
    ticketJourneyByTktId,
    // ticketJourney,
    ticketJourney,
    ticketStatusList,
    subStatusTktList,
    subStatusList,
    addTicketJourney,
    addJourneyImage,
    ticketCheckList,
    refreshStateApi,
    getComplianceQuestionList,
    changeETA,
    checkListJourneyByTktId,
    updateDeviceToken,
    singleTicketDetails,
    singleTktInfo,
    updateTicketAccepted,
    updateTicketReached,
    updateProfilePic,
    getAllSuStatusForTechnician,
    suStatusId,
    closeTickets,
    closedTkts,
  };

  return (
    <AuthContext.Provider value={contextVale}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
