import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Divider, IconButton, Text, Icon, Surface } from 'react-native-paper';
import { Button, MD3Colors } from 'react-native-paper';
import ExamQuestion from '../components/ExamQuestion';
import { getKey, setKey, globals } from '../global';

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

const CustomHeaderTimer = (props) => {
    const [time, setTime] = React.useState(props.seconds || 10);
    const timerRef = React.useRef(time);

    React.useEffect(() => {
        const timerId = setInterval(() => {
            timerRef.current -= 1;
            if (timerRef.current < 0) {
                clearInterval(timerId);
            } else {
                setTime(timerRef.current);
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, []);
    return (
        <View style={{
            backgroundColor:'black',
            borderRadius: 10,
            flexDirection: 'row',
            paddingVertical:6,
            paddingHorizontal: 3,
        }}>
            <Icon source="timer-outline" color='white' size={20} />
            <Text style={{
                fontWeight:'bold', 
                color: 'white',
                marginHorizontal: 3,
            }}>{new Date(time * 1000).toISOString().slice(time > 3600 ? 11 : 14, 19)}</Text>
        </View>
    )
}

const CustomHeaderTitle = (props) => {
    return (
        <View>
            <Text style={{
                fontWeight: 'bold',
                fontSize: 20
            }} >{props.title}</Text>
            <Text>{props.subTitle}</Text>
        </View>
    )
}

const getAnswerInd = (char) => {
    switch (char) {
        case 'A':
            return 0;
        case 'B':
            return 1;
        case 'C':
            return 2;
        case 'D':
            return 3;
        case 'E':
            return 4;
        default:
            return 0;
    }
}


const Exam = ({navigation}, props) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [exam, setExam] = useState(null);
    const [fetching, setFetching] = useState(false);

    const [examSessionData, setExamSessionData] = useState([]); // 'userAnswer', 'answerIndex'
    useEffect(()=>{
        const fetchExam = async () =>{
            setFetching(true);
            const examInfo = await getKey(globals.ExamInfoListItem, null);
            if(examInfo == null){
                return null;
            }

            const ex = await getKey(examInfo.id + "Enhanced", null);
            
            if(ex != null){
                let initialSessionData = [];
                for (let index = 0; index < ex.questions.length; index++) {
                    const isSaved = await getKey(examInfo.id + 'QSaved' + index, false)
                    initialSessionData.push({
                        'questionIndex': ex.questions[index].question_index,
                        'userAnswer': -1,
                        'answerIndex': -1,
                        'selectedIndex': -1,
                        'isSaved': isSaved,
                    })
                }
                setExamSessionData(initialSessionData);
                setExam(ex);
                navigation.setOptions({ 
                    headerTitle: (props) => {
                        props.title = ex.course_name  
                        props.subTitle = ex.course_code.toUpperCase() + ' ' + ex.exam_year + '-' + (parseInt(ex.exam_year)+1)+ ' ' + (ex.exam_type.charAt(0).toUpperCase() + ex.exam_type.slice(1)) + ' Sinavi'
                        return (
                            <CustomHeaderTitle
                                {...props}
                            />
                        )
                    },
                    headerRight: (props) => {
                        props.seconds = ex.exam_duration;
                        return (
                            <CustomHeaderTimer
                                {...props}
                            />
                        )
                    },
                })
            }
            setFetching(false);
        }

        if(!fetching && exam == null){
            fetchExam();
        }
    })

    if(exam == null){
        return (
        <Surface elevation={0} style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            flex: 1,
        }}>
            <Icon source='wifi-strength-off-outline'
                size={20}
            />
            <Text variant="bodyMedium">İnternet Bağlantısı Yok</Text>
        </Surface>
        )
    }

    const renderItem = ({ item }) => (
        <View style={styles.questionItem}>
            <View style={styles.leftCell}>
                <Text>{item.question_index}</Text>
            </View>
            {/* Add more information for the right cell if needed */}
            <View style={[styles.rightCell, { backgroundColor: item.answered ? (item.correct ? 'green' : 'red') : 'white' }]}>
            </View>
        </View>
    );

    const selectFunc = (ind) => {
        let _examSessionData = [...examSessionData];
        _examSessionData[currentQIndex].selectedIndex = ind;
        setExamSessionData(_examSessionData);
    }

    const answerFunc = () => {
        let _examSessionData = [...examSessionData];
        _examSessionData[currentQIndex].userAnswer = _examSessionData[currentQIndex].selectedIndex;
        _examSessionData[currentQIndex].answerIndex = getAnswerInd(exam.questions[currentQIndex].correct_answer);
        setExamSessionData(_examSessionData);
    }

    const saveQuestionFunc = (isSaved) => {
        setKey(exam.id + 'QSaved' + currentQIndex, isSaved)
        let _examSessionData = [...examSessionData];
        _examSessionData[currentQIndex].isSaved = isSaved;
        setExamSessionData(_examSessionData);
    }

    const nextQuestionFunc = () => {
        setCurrentQIndex((currentQIndex + 1) % exam.questions.length);
    }
    return (
        <View style={styles.container}>
            <View>
                <ScrollView horizontal={true} fadingEdgeLength={200}>
                {
                    examSessionData.map((item, index)=>{
                        let bgColor = '#ccc2';
                        let borderColor = '#6662';
                        let textColor = '#2228';
                        if(currentQIndex == index){
                            bgColor = 'black';
                            borderColor = 'white';
                            textColor = 'white';
                        }else if(examSessionData[index].userAnswer != -1){
                            if(examSessionData[index].userAnswer == examSessionData[index].answerIndex){
                                bgColor = 'white';
                                borderColor = 'green';
                                textColor = 'green';
                            }else{
                                bgColor = 'white';
                                borderColor = 'red';
                                textColor = 'red';
                            }
                        }
                        return (
                            <TouchableOpacity
                                key={"QTO" + index}
                                style={{
                                    borderWidth:1,
                                    borderColor: borderColor,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    width:50,
                                    height:50,
                                    backgroundColor: bgColor,
                                    borderRadius:25,
                                    marginRight:15,
                                    marginVertical:10,
                                    borderWidth:3,
                                }}
                                onPress={() => {
                                    setCurrentQIndex(index);
                                }} >
                                <Text key={"QT" + index} variant='headlineMedium' style={{
                                    color: textColor
                                }}>{item.questionIndex}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
                </ScrollView>
            </View>
            <ExamQuestion
                question={exam.questions[currentQIndex].question}
                answers={exam.questions[currentQIndex].answers}
                questionSessionData={examSessionData[currentQIndex]}
                questionIndex={currentQIndex}
                selectFunc={ selectFunc }
                answerFunc={ answerFunc }
                saveQuestionFunc={ saveQuestionFunc }
                nextQuestionFunc={ nextQuestionFunc }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    examInfo: {
        flex: 2,    
        padding: 10,
    },
    currentQuestionInfo: {
        marginTop: 20,
    },
});

export default Exam;
