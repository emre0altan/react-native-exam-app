import './src/global'
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { ThemeProvider } from './src/ThemeProvider';
import { useEffect, useState } from 'react';
import { initialFetch } from './src/global';

export default function Main() {
    const [loaded, setLoaded] = useState(false);
    useEffect(()=>{
        const load = async () => {
            await initialFetch();
            setLoaded(true);
        }
        load();
    }, [loaded])

    let view = (<></>)
    if(loaded){
        view = (
            <ThemeProvider>
                <App />
            </ThemeProvider>
        )
    }
    return view;
  }

AppRegistry.registerComponent(appName, () => Main);
