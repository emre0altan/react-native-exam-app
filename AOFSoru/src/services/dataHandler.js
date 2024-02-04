import { getKey, setKey } from "../global"
import { _getAllProgrammes, _getAllDepartments, _getAllCourses, _getAllExamInfos, _getExamQuestions, _getAllExamDates, _getAllAnnouncements } from "./dataFetcher"

examDates = []
announcements = []
programmes = []
departments = []
courses = []
examInfos = []
questions = {}

export const getAllExamDates = async (useCache=true) => {
    if(useCache && examDates.length > 0){
        return examDates;
    }
    const fetchedData = await _getAllExamDates(useCache);
    if(fetchedData != null){
        examDates = fetchedData;
    }
    return examDates;
}

export const getAllAnnouncements = async (useCache=true) => {
    if(useCache && announcements.length > 0){
        return announcements;
    }
    const fetchedData = await _getAllAnnouncements(useCache);
    if(fetchedData != null){
        announcements = fetchedData;
    }
    return announcements;
}

export const getAllProgrammes = async (useCache=true) => {
    if(useCache && programmes.length > 0){
        return programmes;
    }
    const fetchedData = await _getAllProgrammes(useCache);
    if(fetchedData != null){
        programmes = fetchedData;
    }
    return programmes;
}

export const getAllDepartments = async (params, useCache=true) => {
    if(useCache && departments.length > 0){
        return departments;
    }
    const fetchedData = await _getAllDepartments(useCache);

    if(fetchedData != null){
        departments = fetchedData;
    }
    
    return departments;
}

export const getAllCourses = async (useCache=true) => {
    if(useCache && courses.length > 0){
        return courses;
    }
    const fetchedData = await _getAllCourses(useCache);

    if(fetchedData != null){
        courses = fetchedData;
    }
    
    return courses;
}

export const getAllExamInfos = async (useCache=true) => {
    if(useCache && examInfos.length > 0){
        return examInfos;
    }
    const fetchedData = await _getAllExamInfos(useCache);

    if(fetchedData != null){
        examInfos = fetchedData;
    }
    
    return examInfos;
}

export const getExamQuestions = async (exam_info_id, useCache=true) => {
    const exam_info = await getExamInfoById(exam_info_id, useCache);
    const course = await getCourseById(exam_info.course_id, useCache);
    if(exam_info == null || course == null) return {};

    if(useCache && exam_info_id in questions && questions[exam_info_id].length > 0){
        return questions[exam_info_id];
    }
    const fetchedData = await _getExamQuestions(exam_info_id, useCache);
    
    if(fetchedData != null){
        const enhancedData = {
            'id': exam_info.id,
            'course_id': exam_info.course_id,
            'course_code': course.code,
            'course_name': course.name,
            'exam_duration': exam_info.exam_duration,
            'exam_term': exam_info.exam_term,
            'exam_type': exam_info.exam_type,
            'exam_year': exam_info.exam_year,
            'questions': fetchedData,
        };
    
        questions[exam_info_id] = enhancedData;
        setKey(exam_info_id + "Enhanced", enhancedData);
        return enhancedData;
    }
    
    return null;
}

export const isExamInfoDownloaded = async (params) => {
    const res = await getKey(params['id'], null);
    return res != null;
}

export const getProgrammeById = async (programme_id, useCache=true) => {
    if(programmes.length == 0){
        await getAllProgrammes(useCache);
    }
    for(var programme in programmes){
        if(programme['id'] == programme_id){
            return programme;
        }
    }
    return null;
}

export const getProgrammeDepartments = async (params, useCache=true) => {
    if(departments.length == 0){
        await getAllDepartments(useCache);
    }
    let sub = []
    for(var key in departments){
        const department = departments[key];
        if(department['programme_id'] == params['programme_id']){
            sub.push(department);
        }
    }
    return sub;
}

export const getDepartmentById = async (department_id, useCache=true) => {
    if(departments.length == 0){
        await getAllDepartments(useCache);
    }
    for(var key in departments){
        if(departments[key]['id'] == department_id){
            return departments[key];
        }
    }
    return null;
}

export const getDepartmentCourses = async (params, useCache=true) => {
    const department = await getDepartmentById(params['department_id'], useCache);
    let sub = [];
    if(department != null){
        const course_indexes = department['courses'];
        for(var key in course_indexes){
            const c_ind = course_indexes[key];
            const course = await getCourseById(c_ind['course_id'], useCache);
            if(course != null){
                sub.push({
                    'id': course['id'],
                    'code': course['code'],
                    'name': course['name'],
                    'term_id': c_ind['term_id'],
                })
            }
        }
    }else{
        console.log("department is null")
    }
    return sub;
}

export const getCourseById = async (course_id, useCache=true) => {
    if(courses.length == 0){
        await getAllCourses(useCache);
    }
    for(var key in courses){
        if(courses[key]['id'] == course_id){
            return courses[key];
        }
    }
    return null;
}

export const getCourseExamInfos = async (params, useCache=false) => {
    const course = await getCourseById(params['course_id'], useCache);
    if(examInfos.length == 0){
        await getAllExamInfos(useCache);
    }
    let sub = [];
    for(var key in examInfos){
        const examInfo = examInfos[key];
        if(examInfo['course_id'] == params['course_id']){
            const downloaded = await isExamInfoDownloaded(examInfo);
            examInfo['downloaded'] = downloaded;
            examInfo['course_code'] = course['code'];
            examInfo['course_name'] = course['name'];
            sub.push(examInfo);
        }
    }
    return sub;
}

export const getExamInfoById = async (exam_info_id, useCache=true) => {
    if(examInfos.length == 0){
        await getAllExamInfos(useCache);
    }
    for(var key in examInfos){
        if(examInfos[key]['id'] == exam_info_id){
            return examInfos[key];
        }
    }
    return null;
}

export const getTargetDate = async () => {
    const dates = await getAllExamDates();
    if(dates != null){
        return dates[0]; 
    }else{
        return new Date(); 
    }
}