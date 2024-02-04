import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setKey, clearKey, globals, getKeyFast } from '../global';

export const DataKeys = { 
    Programmes: 'Programmes',
    Departments: 'Departments',
    Courses: 'Courses',
    ExamInfos: 'ExamInfos',
    Questions: 'Questions',
    ExamDates: 'ExamDates',
    Announcements: 'Announcements',
    UserData: 'UserData',
};

const maxRetries = 5;
const retryInterval = 1000;
const httpAddress = '-' //https server address
let retries = 0;

export const _getUserData = async (useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=DataKeys.UserData,
        path='get_user_data',
        jsonParams={ 'client_user_id': '1111' },
        useCache,
        true
    );

    return fetchedData;
}

export const _updateUserData = async (user_data, useCache=false) => {
    const fetchedData = await fetchData(
        dataKey='NoCache',
        path='update_user_data',
        jsonParams={ 
            'client_user_id': '1111', 
            'saved_data': user_data['saved_data'],
            'bought_exams': user_data['bought_exams'],
            'finished_exams_data': user_data['finished_exams_data'],
            'ongoing_exams_data': user_data['ongoing_exams_data']
        },
        useCache,
        true
    );

    return fetchedData;
}

export const _getAllExamDates = async (useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=DataKeys.ExamDates,
        path='get_exam_dates',
        jsonParams={ },
        useCache,
        true
    );

    return fetchedData;
}

export const _getAllAnnouncements = async (useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=DataKeys.Announcements,
        path='get_announcements',
        jsonParams={ },
        useCache,
        true
    );

    return fetchedData;
}

export const _getAllProgrammes = async (useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=DataKeys.Programmes,
        path='get_programmes',
        jsonParams={ },
        useCache,
        true
    );

    return fetchedData;
}

export const _getAllDepartments = async (useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=DataKeys.Departments,
        path='get_departments',
        jsonParams={ },
        useCache,
        true
    );

    return fetchedData;
}

export const _getAllCourses = async (useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=DataKeys.Courses,
        path='get_courses',
        jsonParams={ },
        useCache,
        true
    );

    return fetchedData;
}

export const _getAllExamInfos = async (useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=DataKeys.ExamInfos,
        path='get_exam_infos',
        jsonParams={ },
        useCache,
        true
    );
    return fetchedData;
}

export const _getExamQuestions = async (exam_info_id, useCache=true) => {
    const fetchedData = await fetchData(
        dataKey=exam_info_id,
        path='get_questions',
        jsonParams={ 'exam_info_id': exam_info_id },
        useCache,
        true
    );

    return fetchedData;
}

async function putUser(device_id, first_name, last_name, email) {
    const fetchedData = await fetchData(
        dataKey='NoCache',
        path='put_user',
        jsonParams={
            'device_id': device_id,
            'first_name': first_name,
            'last_name': last_name,
            'email': email
        },
        false,
        false
    );

    return fetchedData;
}

async function get_session() {
    let session_key = await getKeyFast(globals.SessionKey, null, false);
    if(session_key == null){
        let result = await await fetchData(
            dataKey="NoCache",
            path='get_session',
            jsonParams={  },
            false,
            false
        );
        if('error' in result){
            console.log("Get Session Key returned error:\n", result);
        }else{
            session_key = result['session_key'];
            setKey(globals.SessionKey, session_key);
        }
    }
}

const fetchData = async (dataKey, path, jsonParams, useCache, put_session_key) => {
    if(useCache){
        let res = await AsyncStorage.getItem(dataKey);
        if(res != null){
            return JSON.parse(res);
        }
    }

    jsonParams['user_id'] = '1111'

    if(put_session_key){
        if(await getKeyFast(globals.SessionKey, null, false) == null) await get_session();
        if(await getKeyFast(globals.SessionKey, null, false) == null) return;
        jsonParams['session_key'] = await getKeyFast(globals.SessionKey, false)
    }

    http=httpAddress + path; 
    json=jsonParams;
    config={
        headers: {
        'Content-Type': 'application/json',
        },
        timeout: 5000
    } 

    retries = 0;
    try {
        const response = await postWithRetry( http, json, config )
        if(response != null){
            const data = response.data;
            if('session-error' in data){
                console.log(path + " - SESSION ERROR: ", data['session-error']);
                clearKey(globals.SessionKey);
                return await fetchData(dataKey, path, jsonParams, useCache, put_session_key);
            }
            if('error' in data){
                console.log("ERROR IN DATA RETURNING NULL!!!")
                return null;
            }
            if(data != null){
                await AsyncStorage.setItem(dataKey, JSON.stringify(data));
            }
            return data;
        }
        return null;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error(path + ' - Response data:', error.response.data);
            console.error(path + ' - Response status:', error.response.status);
            console.error(path + ' - Response headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error(path + ' - Request:', error.request);
          } else {
            // Something happened in setting up the request that triggered an error
            console.error(path + ' - Error message:', error.message);
          }
          console.error(path + ' - Error config:', error.config, error.status);
        return null;
    }
}

const postWithRetry = async (url, json, config) => {
    while (retries < maxRetries) {
        try {
            console.log(url + ` - Request sent: `, url);
            const response = await axios.post(url, json, config);
            console.log(url + ` - Response came: `);
            console.log(url + ` - Response came: `, response);
            return response;
        } catch (error) {
            console.log(url + ` - Request failed: `, error);
            retries++;
            console.log(url + ` - Retrying (${retries}/${maxRetries}) in ${retryInterval / 1000} seconds...`);
        }
    }
    console.log(url + ` - Max retries exceeded. Could not complete POST request to `, url);
    return null;
};
