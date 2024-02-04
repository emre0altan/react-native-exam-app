import React, { useState } from 'react';
import { Divider, IconButton, List, Text } from 'react-native-paper';
import { Button, MD3Colors, Icon } from 'react-native-paper';
import {SafeAreaView, useWindowDimensions, View, ScrollView, TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';

const ExamQuestion = ({question, answers, questionSessionData, questionIndex, selectFunc, answerFunc, saveQuestionFunc, nextQuestionFunc}) => {
    return (
        <View style={{
            flex: 1,
            marginHorizontal: 10,
        }}>
            <View style={{
                flex: 1,
                justifyContent: 'space-between',
            }}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' + question.replace('<br>', '') + '</p></body></html>' }}
                    style={{backgroundColor:'#e8e8e8'}}
                />
                <View style={{
                    justifyContent: 'space-evenly',
                }}>
                    <List.Section>
                        {
                            ['A','B','C','D','E'].map((char, index) => {

                                const disabled = questionSessionData.userAnswer != -1;
                                let bgColor = 'transparent';
                                let textFontColor = disabled ? '#898989' : 'black'; 
                                if(questionSessionData.userAnswer == index){
                                    bgColor = questionSessionData.answerIndex == index ? '#5ddd00' : '#cd5c5c';
                                    textFontColor = 'white';
                                }else if(questionSessionData.answerIndex == index){
                                    bgColor = '#008000';
                                    textFontColor = 'white';
                                }else if(questionSessionData.selectedIndex == index){
                                    bgColor = "#898989"
                                    textFontColor = 'white';
                                }
                                
                                return (
                                    <List.Item 
                                        disabled={disabled}
                                        activeOpacity={disabled ? 1 : 0.7} 
                                        onPress={() => {
                                            selectFunc(index);
                                        }}
                                        left={
                                            () => 
                                            <Text style={{color:textFontColor}} adjustsFontSizeToFit={true} numberOfLines={2}> 
                                                {char + ') ' + answers[index].replaceAll('<p>',' ').replaceAll('</p>', ' ')}  
                                            </Text>
                                        } 
                                        style={{
                                            backgroundColor:bgColor, 
                                            margin: 5, 
                                            padding: 5,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#2222',
                                        
                                        }}
                                        key={'Answer' + index}
                                    />
                                )
                            })
                        }
                    </List.Section>
                </View>
                
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <TouchableOpacity 
                        style={{flex:1, alignItems:'center', justifyContent:'center'}} 
                        onPress={() => {
                            saveQuestionFunc(!questionSessionData.isSaved);
                        }}
                    >
                        <Icon source={questionSessionData.isSaved ? "bookmark" : "bookmark-outline"} color='black' size={20} />
                        <Text>Kaydet</Text>
                    </TouchableOpacity>
                    {
                        questionSessionData.userAnswer == -1 ? 
                        <Button 
                            style={{
                                margin: 5,
                                borderRadius: 12,
                                flex:3,
                                padding: 10,
                                backgroundColor: '#ddb500',
                            }} mode='contained' 
                            onPress={() => {
                                answerFunc();
                            }} 
                            labelStyle={{
                                fontSize: 20,
                            }}
                        >Cevapla</Button>
                        :
                        <Button 
                            style={{
                                margin: 5,
                                borderRadius: 12,
                                flex:3,
                                padding: 10,
                                backgroundColor: '#5ada00',
                            }} mode='contained' 
                            onPress={() => {
                                nextQuestionFunc();
                            }} 
                            labelStyle={{
                                fontSize: 20,
                            }}
                        >Sonraki Soru</Button>
                    }
                </View>
            </View>
        </View>
    );
};

export default ExamQuestion;
