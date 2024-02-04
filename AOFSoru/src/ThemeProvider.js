import React, { createContext, useContext, useState, useEffect } from 'react';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { getKeyFast, globals } from './global';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

const customTheme = {
    dark: {
        ...MD3DarkTheme,
        colors: {
            ...MD3DarkTheme.colors,
            // primary: 'green',
            // secondary: 'brown',
        }
    },
    light: {
        ...MD3LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            // primary: 'white',
            // secondary: 'brown',
        }
    },
  };

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleTheme = (isDark) => {
        setIsDarkTheme(isDark);
    };

    const colorScheme = useColorScheme();

    const theme = colorScheme === 'dark' || isDarkTheme
      ? MD3DarkTheme
      : MD3LightTheme;

    useEffect(() => {
    const fetchData = async () => {
        try {
            const storedIsDarkMode = await getKeyFast(globals.IsDarkMode, false, true);
            setIsDarkTheme(storedIsDarkMode);
        } catch (error) {
            console.error('Error fetching settings data:', error);
        }
    };

    fetchData();
    }, []); // Run the effect only once on component mount
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};