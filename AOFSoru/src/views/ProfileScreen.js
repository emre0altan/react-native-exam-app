import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import ProfileSettings from "../components/ProfileSettings";

const ProfileTopPart = ({ navigation }) => {
    return (
        <View style={{
            flex:1
        }}>
            <View style={{
                alignItems:'flex-end'
            }}>
                <Button mode="contained" style={{
                    marginEnd: 20,
                    marginTop: 20,
                }}>Çıkış</Button>
            </View>
            <View style={{
                alignItems: 'center'
            }}>
                <Avatar.Text style={{
                    marginTop: 80,
                    marginBottom: 15,
                }} size={70} label="EA" />
                <Text style={{
                    fontSize: 20
                }} variant="titleMedium">Isim</Text>
            </View>
        </View>
    );
};

const ProfileScreen = ({ navigation }) => {
    return (
        <View style={{
            flex:1,
            flexDirection: 'column',
            justifyContent: 'space-evenly'
        }}>
            <ProfileTopPart />
            <ProfileSettings />
        </View>
    );
};


export default ProfileScreen;
