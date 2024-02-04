import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { Surface, Switch, Text } from 'react-native-paper';
import { getKey, setKey, globals } from '../global';
import { useTheme } from '../ThemeProvider';

const SettingsScreen = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotificationOn, setIsNotificationOn] = useState(false);
    const [fontSize, setFontSize] = useState(1);
    const [examTime, setExamTime] = useState(60);

    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const storedIsDarkMode = await getKey(globals.isDarkMode, false, true);
            setIsDarkMode(storedIsDarkMode);
            const storedIsNotificationOn = await getKey(globals.IsNotificationOn, true, true);
            setIsNotificationOn(storedIsNotificationOn);
            const storedFontSize = await getKey(globals.FontSize, 6, true);
            setFontSize(storedFontSize);
            const storedExamTime = await getKey(globals.ExamTime, 1, true);
            setExamTime(storedExamTime);
        } catch (error) {
            console.error('Error fetching settings data:', error);
        }
        };

        fetchData();
    }, []); // Run the effect only once on component mount

    const handleFontSizeSliderChange = (value) => {
        setFontSize(value);
        setKey(globals.FontSize, value);
    };

    const handleExamTimeSliderChange = (value) => {
        setExamTime(value);
        setKey(globals.ExamTime, value);
    };

    const toggleDarkMode = () => {
        setKey(globals.IsDarkMode, !isDarkMode);
        toggleTheme(!isDarkMode);
        setIsDarkMode(!isDarkMode);
    };

    const toggleNotificationOn = () => {
        setKey(globals.IsNotificationOn, !isNotificationOn);
        setIsNotificationOn(!isNotificationOn);
    };

    return (
        <Surface style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            flex: 1,
        }}>
            <Surface style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 3,
                paddingLeft: 4,
            }}>
                <Text>Dark Mode</Text>
                <Switch 
                value={isDarkMode}
                onValueChange={toggleDarkMode} 
                />
            </Surface>
            <Surface style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 3,
                paddingLeft: 4,
            }}>
                <Text>Font Size</Text>
                <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={fontSize}
                onValueChange={handleFontSizeSliderChange}
                />
            </Surface>
            <Surface style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 3,
                paddingLeft: 4,
            }}>
                <Text>Notifications</Text>
                <Switch 
                value={isNotificationOn} 
                onValueChange={toggleNotificationOn} 
                />
            </Surface>
            <Surface style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 3,
                paddingLeft: 4,
            }}>
                <Text>Exam Time</Text>
                <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={30}
                maximumValue={120}
                step={15}
                value={examTime}
                onValueChange={handleExamTimeSliderChange}
                />
            </Surface>
        </Surface>
    );
};

export default SettingsScreen;
