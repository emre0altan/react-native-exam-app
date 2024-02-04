import React, { useEffect, useState } from "react";
import { Text, Button, IconButton, Icon, Card, Surface } from "react-native-paper";
import { globals, setKey } from "../global";
import { getExamQuestions } from "../services/dataHandler";

export const getProgrammeItems = (items, navigation) => {
    return items.map((item, index)=>(
        <Button 
            mode='contained-tonal' 
            key={item['id']} 
            compact={true}
            onPress={ () => {
                setKey(globals.ProgrammeListIndex, index);
                setKey(globals.ProgrammeListItem, item);
                setKey(globals.ProgrammeSelected, true);
                navigation.navigate('HomeDepartments');
            } }
            style={{
                marginHorizontal: 5,
                marginVertical: 5,
                borderRadius: 6,
            }}
            >
            <Text variant="bodyLarge" >{item['name']}</Text>
        </Button>
    ))
}

export const getDepartmentItems = (items, navigation) => {
    return items.map((item, index)=>(
        <Button 
            mode="contained-tonal" 
            key={item['id']} 
            compact={true}
            onPress={ () => {
                
                (globals.DepartmentListIndex, index);
                setKey(globals.DepartmentListItem, item);
                setKey(globals.DepartmentSelected, true);
                navigation.navigate('HomeCourses');
            } }
            style={{
                marginHorizontal: 5,
                marginVertical: 5,
                borderRadius: 6,
            }}
            >
            <Text variant="bodyLarge">{item['name']}</Text>
        </Button>
    ))
}

export const getCourseItems = (items, navigation) => {
    let mapped = [];
    let last_term_id = 0;
    let print_term_text = false;
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if(last_term_id != item['term_id']){
            print_term_text = true;
            last_term_id = item['term_id'];
        }
        mapped.push(
            <Surface key={item['id']} style={{
                flex: 1,
            }}>
                {   
                    print_term_text ?
                    <Text  
                        variant="titleMedium" 
                        key={last_term_id.toString() + "TT"}
                        style={{
                            marginTop: 10,
                            marginLeft: 10,
                        }}>{last_term_id}.YARIYIL
                    </Text>
                    :
                    <></>
                }
                <Button 
                    mode="contained-tonal" 
                    key={item['id'].toString() + "Btn"} 
                    compact={true}
                    onPress={ () => {
                        setKey(globals.CourseListIndex, index);
                        setKey(globals.CourseListItem, item);
                        setKey(globals.CourseSelected, true);
                        navigation.navigate('HomeExamInfos');
                    } }
                    style={{
                        marginHorizontal: 5,
                        marginVertical: 5,
                        borderRadius: 6,
                    }}
                    >
                    <Text variant="bodyLarge">{item['name']}</Text>
                </Button>
            </Surface>
        )
        print_term_text = false;
    }
    return mapped;
}

export const getExamInfoItems = (items, navigation, downloads, downloadFlags, handleDownload) => {
    const getActions = (id, item, index) => {
        const downloaded = item['downloaded'];
        const downloading = id in downloads ? downloads[id] : false;
        const downloadFlag = id in downloadFlags ? downloadFlags[id] : false;
        
        if(downloaded || downloadFlag){
            const func = () => {
                setKey(globals.ExamInfoListIndex, index);
                setKey(globals.ExamInfoListItem, item);
                setKey(globals.ExamInfoSelected, true);
                navigation.navigate('Exam');
            } 
            return [(
                <Card.Actions key={id + "CA"} >
                    <Button key={id + "CAList"}  onPress={() => {}}>Listeme Ekle</Button>
                    <Button 
                        key={id + "CAStart"} 
                        onPress={func}
                    >Başla</Button>
                </Card.Actions>
            ), func]
        }else if(downloading){
            return [(
                <Card.Actions key={id + "CA"} >
                    <Text>İndiriliyor...</Text>
                </Card.Actions>
            ), () => {}]
        }else if(id in downloadFlags && !downloadFlag){
            return [(
                <Card.Actions key={id + "CA"} >
                    <Text>Daha sonra tekrar deneyiniz.</Text>
                </Card.Actions>
            ), () => {}]
        }else{
            const func = () => {
                handleDownload(id);
            }
            return [(
                <Card.Actions key={id + "CA"} >
                    <Button 
                        key={id + "CADownload"} 
                        onPress={func}
                    >İndir</Button>
                </Card.Actions>
            ), func]
        }
    }

    return items.map((item, index) => {
        const id = item['id'];
        const [actions, mainFunc] = getActions(id, item, index);
        return (
            <Card mode="contained" key={id + "C"} 
                style={{
                    marginVertical: 4,
                    marginHorizontal: 10,
                }}
                onPress={() => mainFunc()}
            >
                <Card.Content key={id + "CCt"} >
                    <Text variant="titleMedium" key={id + "CCtTxt"} >{item['exam_year']} - {item['exam_term']}. Dönem {item['exam_type'].charAt(0).toUpperCase() + item['exam_type'].slice(1)} Sınavı</Text>
                </Card.Content>
                {
                    actions
                }
            </Card>
    
        )
    })
}
