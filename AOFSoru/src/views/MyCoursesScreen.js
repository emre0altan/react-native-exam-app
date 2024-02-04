import * as React from "react";
import { View } from "react-native";
import MyCourseTabs from "../components/MyCourseTabs";
import { IconButton, Text } from "react-native-paper";


const MyCoursesScreen = ({ navigation }) => {
    return (
        <View style={{flex:1}}>
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: 15}}>
            <Text variant="titleLarge" style={{fontWeight:"bold"}}>Derslerim</Text>
            <IconButton icon="plus" size={40} onPress={() => console.log('Pressed')}/>
        </View>
        <MyCourseTabs style={{flex:6}} navigation={navigation} />
        </View>
    );
};


export default MyCoursesScreen;
