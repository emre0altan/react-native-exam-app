// App.js
import React from 'react';
import Home from './views/Home'
import { Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Exam from './views/Exam';
import { Text, View } from 'react-native-paper';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
const Stack = createNativeStackNavigator();

const App = () => {
    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState();

    React.useEffect(() => {
        const restoreState = async () => {
        try {
            const initialUrl = await Linking.getInitialURL();

            if (Platform.OS !== 'web' && initialUrl == null) {
                // Only restore state if there's no deep link and we're not on web
                const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                const state = savedStateString ? JSON.parse(savedStateString) : undefined;

                if (state !== undefined) {
                    setInitialState(state);
                }
            }
        } finally {
            setIsReady(true);
        }
        };

        if (!isReady) {
            restoreState();
        }
    }, [isReady]);

    if (!isReady) {
        return null;
    }

    return (
        <NavigationContainer
            initialState={initialState}
            onStateChange={(state) =>
                AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }
        >
            <Stack.Navigator>
                <Stack.Group>
                    <Stack.Screen 
                        name="Home" 
                        component={Home} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="Exam" 
                        component={Exam} 
                    />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
