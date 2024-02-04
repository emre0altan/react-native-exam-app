import AsyncStorage from '@react-native-async-storage/async-storage';

export const globals = { 
    UserData: 'UserData',
    SessionKey: 'SessionKey',
    LoggedIn: 'LoggedIn',
    ProgrammeListIndex: 'ProgrammeListIndex',
    ProgrammeListItem: 'ProgrammeListItem',
    DepartmentListIndex: 'DepartmentListIndex',
    DepartmentListItem: 'DepartmentListItem',
    CourseListIndex: 'CourseListIndex',
    CourseListItem: 'CourseListItem',
    ExamInfoListIndex: 'ExamInfoListIndex',
    ExamInfoListItem: 'ExamInfoListItem',
};

global.vars = {} 

export const initialFetch = async () => {
    for (const [key, value] of Object.entries(globals)) {
        await getKey(value, null, true);
    }
}

export const getKeyFast = (keyId, defaultVal) => {
    if(keyId in global.vars){
        return global.vars[keyId];
    }else{
        return defaultVal;
    }
}

export const getKey = async (keyId, defaultVal, jsonValue=true) => {
    if(keyId == null){
        console.log("NULL KEY(getKey), default: ", defaultVal, "  json: ", jsonValue)
        return null;
    }
    if(keyId in global.vars){
        return global.vars[keyId];
    }else{
        let saved = null;
        if(jsonValue) saved = await getDataJSON(keyId);
        else saved = await getData(keyId);

        if(saved == null)
            return defaultVal;
        else{
            global.vars[keyId] = saved;
            return saved;
        }
    }
}

export const setKey = async (keyId, val, jsonValue=true) => {
    if(keyId == null){
        console.log("NULL KEY(setKey), val: ", val, "  json: ", jsonValue)
        return null;
    }
    global.vars[keyId] = val;
    if(jsonValue){
        await storeDataJSON(keyId, val);
    }else{
        await storeData(keyId, val);
    }
}

export const clearKey = async (keyId) => {
    if(keyId == null){
        console.log("NULL KEY(clearKey)")
        return null;
    }
    if(keyId in global.vars){
        delete global.vars[keyId];
    }
    await removeSaved(keyId);
}

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.log(key + " - async storage saving error:\n", e);
        return false;
    }
};

const storeDataJSON = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (e) {
        console.log(key + " - async storage JSON saving error:\n", e);
        return false;
    }
};

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.log(key + " - async storage reading error:\n", e);
        return null;
    }
};

const getDataJSON = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(key + " - async storage JSON reading error:\n", e);
        return null;
    }
};

const removeSaved = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch(e) {
        console.log(key + " - async storage key removing error:\n", e);
    }
}