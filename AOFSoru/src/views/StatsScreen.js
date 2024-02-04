import React, { useState, useEffect } from "react";
import { View } from "react-native";

const StatsScreen = ({ navigation }) => {
    const handleRefresh = () => {
    }
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        handleRefresh();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View>
        
        </View>
    );
};


export default StatsScreen;
