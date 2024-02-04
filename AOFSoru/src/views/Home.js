import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyCoursesScreen from "./MyCoursesScreen";
import StatsScreen from "./StatsScreen";
import ProfileScreen from "./ProfileScreen";
import HomeMain from "./HomeMain";
import HomeDepartments from "./HomeDepartments";
import HomeCourses from "./HomeCourses";
import HomeExamInfos from "./HomeExamInfos";
import SettingsScreen from "./SettingsScreen";

const HomeStack = createNativeStackNavigator()

const HomeStackScreen = () => {
    const view = (
        <HomeStack.Navigator initialRouteName={'HomeMain'}>
            <HomeStack.Screen name='HomeMain' component={HomeMain} options={{ title: 'Anasayfa', headerTitleAlign:'center' }} />
            <HomeStack.Screen name='HomeDepartments' component={HomeDepartments} options={{ title: 'Bölümler' }} />
            <HomeStack.Screen name='HomeCourses' component={HomeCourses} options={{ title: 'Dersler' }} />
            <HomeStack.Screen name='HomeExamInfos' component={HomeExamInfos} options={{ title: 'Sınavlar' }} />
            <HomeStack.Screen name='SettingsScreen' component={SettingsScreen} options={{ title: 'SettingsScreen' }} />
        </HomeStack.Navigator>
    );

    return view;
}

const BottomTab = createMaterialBottomTabNavigator();

const Home = () => {
    const view = (
        <BottomTab.Navigator 
            initialRouteName={"HomeStack"}
            activeColor="#e91e63"
            labelStyle={{ fontSize: 12 }}
            style={{ backgroundColor: 'tomato' }}
        >
        <BottomTab.Screen name="HomeStack" component={HomeStackScreen} 
            options={{
                tabBarLabel: 'Anasayfa',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
            }}
        />
        <BottomTab.Screen name="MyCourses" component={MyCoursesScreen}
            options={{
                tabBarLabel: 'Derslerim',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="school" color={color} size={26} />
                ),
            }}
        />
        <BottomTab.Screen name="Stats" component={StatsScreen} 
            options={{
                tabBarLabel: 'Istatistikler',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="chart-bar" color={color} size={26} />
                ),
            }}
        />
        <BottomTab.Screen name="Profile" component={ProfileScreen} 
            options={{
                tabBarLabel: 'Profil',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
            }}
        />
        </BottomTab.Navigator>
    )
    return view;
};

export default Home;