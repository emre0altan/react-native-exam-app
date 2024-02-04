import { _getUserData, _updateUserData } from "./dataFetcher"

user_data = null;
k_exam_data = 'exam_data';
k_bought = 'bought_exams';
k_saved_data = 'saved_data';
k_departments = 'departments';
k_courses = 'courses';
k_exams = 'exams';
k_questions = 'questions';
k_timestamp = 'timestamp';
k_save_id = 'id';

getUserData();

export const updateBoughtExams = async ( exam_id ) => {
    if(user_data == null) {
        return;
    }
    if(!(k_bought in user_data)){
        user_data[k_bought] = {}
    }

    user_data[k_bought][exam_id] = { k_timestamp: new Date().toISOString() }

    await sendUpdateUserData();
}

export const updateExamData = async ( exam_id, exam_session_data ) => {
    if(user_data == null) {
        return;
    }
    if(!(k_exam_data in user_data)){
        user_data[k_exam_data] = {}
    }

    user_data[k_exam_data][exam_id] = { k_timestamp: new Date().toISOString(), k_save_id: exam_session_data }

    await sendUpdateUserData();
}

export const saveDepartment = async ( department_id ) => {
    if(user_data == null) {
        return;
    }
    if(!(k_saved_data in user_data)){
        user_data[k_saved_data] = {}
    }

    if(!(k_departments in user_data[k_saved_data])){
        user_data[k_saved_data][k_departments] = []
    }
    user_data[k_saved_data][k_departments].push({ k_timestamp: new Date().toISOString(), k_save_id: department_id });

    await sendUpdateUserData();
}

export const saveCourse = async ( course_id ) => {
    if(user_data == null) {
        return;
    }
    if(!(k_saved_data in user_data)){
        user_data[k_saved_data] = {}
    }

    if(!(k_courses in user_data[k_saved_data])){
        user_data[k_saved_data][k_courses] = []
    }
    user_data[k_saved_data][k_courses].push({ k_timestamp: new Date().toISOString(), k_save_id: course_id });

    await sendUpdateUserData();
}

export const saveExam = async ( exam_id ) => {
    if(user_data == null) {
        return;
    }
    if(!(k_saved_data in user_data)){
        user_data[k_saved_data] = {}
    }

    if(!(k_exams in user_data[k_saved_data])){
        user_data[k_saved_data][k_exams] = []
    }
    user_data[k_saved_data][k_exams].push({ k_timestamp: new Date().toISOString(), k_save_id: exam_id });

    await sendUpdateUserData();
}

export const saveQuestion = async ( exam_id, question_index ) => {
    if(user_data == null) {
        return;
    }
    if(!(k_saved_data in user_data)){
        user_data[k_saved_data] = {}
    }

    if(!(k_questions in user_data[k_saved_data])){
        user_data[k_saved_data][k_questions] = []
    }
    user_data[k_saved_data][k_questions].push({ k_timestamp: new Date().toISOString(), k_save_id: exam_id, 'qIndex': question_index });

    await sendUpdateUserData();
} 

export const getUserData = async (useCache=true) => {
    if(useCache && user_data != null){
        return user_data;
    }
    const fetchedData = await _getUserData(useCache);
    if(fetchedData != null){
        user_data = fetchedData;
    }
    return user_data;
}

const sendUpdateUserData = async () => {
    await updateUserData();
}

export const updateUserData = async () => {
    const res = await _updateUserData(user_data);
    console.log(res);
}