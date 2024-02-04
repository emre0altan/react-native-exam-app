import React, {useState, useEffect, useRef} from "react";
import { Button, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { Searchbar, Icon, Text, Surface, Portal, Modal } from "react-native-paper";
import RefreshableList from '../components/RefreshableList'
import { useTheme } from "../ThemeProvider";
import { getAllAnnouncements, getAllProgrammes, getTargetDate } from "../services/dataHandler";
import { getProgrammeItems } from "../components/ItemMaps";
import { useIsFocused } from "@react-navigation/native";

function calculateTimeRemaining(timeDifference) {
    // Calculate days, hours, minutes, and seconds
    var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}

const HomeMain = ({ navigation }) => {
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');

    const selectedAnnouncement = useRef(null);
    const [anModalVisible, setAnModalVisible] = React.useState(false);

    const announcements = useRef(null);
    const targetDateInfo = useRef(null);
    const targetDate = useRef(null);
    const [updating, setUpdating] = useState(false);

    const [time, setTime] = React.useState(new Date() || 10);
    const timerRef = React.useRef(time);
    
    const useFocused = useIsFocused();

    useEffect(() => {
        const fetchTargetDate = async () => {
            setUpdating(true);
            const dateInfo = await getTargetDate();
            if(dateInfo != null){
                targetDateInfo.current = dateInfo;
                targetDate.current = new Date(dateInfo.id);
                setTime(targetDate.current - new Date());
                timerRef.current = targetDate.current - new Date();
            }
            setUpdating(false);
        }

        const fetchAnnouncements = async () => {
            setUpdating(true);
            const res = await getAllAnnouncements();
            if(res != null){
                announcements.current = res;
            }
            setUpdating(false);
        }

        if(!updating && announcements.current == null){
            fetchAnnouncements();
        }

        if(!updating && targetDate.current == null){
            fetchTargetDate();
        }

        if(targetDate.current != null && useFocused){
            const interval = setInterval(() => {
                timerRef.current -= 30000;
                if (timerRef.current < 0) {
                    clearInterval(timerId);
                } else {
                    setTime(timerRef.current);
                }
            }, 30000);
            
            return () => {
                clearInterval(interval);
            };
        }
    }, [time, useFocused, updating]);

    var remainingTime = {days:0, hours:0, minutes:0, seconds:0}

    if(targetDate.current != null){
        remainingTime = calculateTimeRemaining(time);
    }

    return (
        <Surface elevation={0} style={{flex:1}}>
            <Portal>
                <Modal visible={anModalVisible} onDismiss={() => setAnModalVisible(false)} contentContainerStyle={{
                    backgroundColor: 'white', 
                    padding: 20,
                    width: '80%',
                    minHeight: '30%',
                    maxHeight: '60%',
                    alignSelf: 'center',
                }}>
                    <ScrollView>
                        <Text>{selectedAnnouncement.current != null ? selectedAnnouncement.current.body : ''}</Text>
                    </ScrollView>
                </Modal>
            </Portal>
            <Surface elevation={0} style={{
                flex: 0.3,
                flexDirection: 'row',
            }}>
                <Surface elevation={0} style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                }}>
                    <Text variant="titleLarge" style={{textAlign:'center'}}>{ targetDateInfo.current != null ? targetDateInfo.current.name : '-' }</Text>
                    <Text variant="titleMedium" style={{textAlign:'center'}}>{
                        remainingTime.days + ' gün : ' + remainingTime.hours + ' saat : ' + 
                        remainingTime.minutes + ' dakika'
                    }</Text>
                </Surface>
            </Surface>
            <Surface elevation={2} style={{
                flex: 1,
                margin: 10,
                borderWidth: 1.3,
                borderColor: '#777',
                borderRadius: 10,
                paddingBottom: 10,
            }}>
                <Text variant="titleMedium" style={{
                    padding: 1,
                    fontSize: 20,
                    textAlign: 'center',
                }}>Duyurular</Text>
                <ScrollView fadingEdgeLength={80} elevation={0} style={{
                    padding: 5,
                    
                }}>
                    {announcements.current != null ?
                     announcements.current.map((item, index) => (
                        <Pressable key={index} onPress={() => {
                            setAnModalVisible(true);
                            selectedAnnouncement.current = item;
                        }} style={{
                            backgroundColor: '#e6e6fa',
                            padding: 5,
                            margin: 3,
                            borderRadius: 10,
                            minHeight: 40,
                        }}>
                            <Text>{item.title}</Text>
                        </Pressable>
                    )) : <></>}
                </ScrollView>
            </Surface>
            <Searchbar
                placeholder='Bölüm & Ders Ara'
                onChangeText={ query => setSearchQuery(query)}
                value={searchQuery}
                elevation={1}
                style={{
                    marginHorizontal: 7,
                    borderRadius: 10,
                }}
            />
            <RefreshableList 
                fetchFunc={getAllProgrammes}
                params={{}}
                itemMap={getProgrammeItems} 
                navigation={navigation}
                filterText={searchQuery}
                theme={theme}
            />
        </Surface>
    );
};

export default HomeMain;
