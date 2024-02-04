import React, { useState, useEffect } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";
import NetInfo from '@react-native-community/netinfo';


const handleSearch = (listData, text) => {
    if(text == ""){
        return listData;
    }
    if(listData == null){
        return [];
    }
        
    return listData.filter((item) => {
        for (const element of item) {
            if (element && typeof element === 'string' && element.toLowerCase().includes(text.toLowerCase())) {
                return true;
            }
        }
        return false;
    });
};


const NoConnection = () => {
    return (
        <Surface elevation={0} style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            flex: 1,
        }}>
            <Icon source='wifi-strength-off-outline'
                size={20}
            />
            <Text variant="bodyMedium">İnternet Bağlantısı Yok</Text>
        </Surface>
    );
}

const ScrollRefreshList = (refreshing, onRefresh, list) => {
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={40} />
            }>
            {
            <Surface elevation={0}>
                <ScrollView>
                {
                    list
                }
                </ScrollView>
            </Surface>
            }
        </ScrollView>
    );
}

const NoServer = (refreshing, onRefresh) => {
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={40} />
            }>
            {
                refreshing ?
                <Surface elevation={0}>
                </Surface>
                :
                <Surface elevation={0}>
                
                    <Icon source='arrow-down'
                        size={20}
                    />
                    <Text variant="bodyMedium">Pull down to refresh</Text>
                </Surface>
            }
        </ScrollView>
    );
}

const RefreshableList = ({ itemMap, filterText, fetchFunc, params, navigation}) => {
    const [isConnected, setIsConnected] = useState(null);
    const [fetchRequested, setFetchRequested] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [listData, setListData] = useState([]);
    const [mappedListData, setMappedListData] = useState([]);

    const handleRefresh = () => {
        setFetchRequested(true);
    };
 
    const fetchData = async () => {
        const result = await fetchFunc(params);
        if (result) {
            setListData(result);
        }else{
            console.log(fetchFunc.name + " : result is NULL")
        }
    };
 
    useEffect(() => {
        const checkInternetConnection = async () => {
            const netInfoState = await NetInfo.fetch();
            setIsConnected(netInfoState.isConnected);
        };
    
        const handleConnectionChange = (state) => {
            setIsConnected(state.isConnected);
        };
    
        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener(handleConnectionChange);
    
        const fetchDataAndSetState = async () => {
            try {
                setFetching(true);
                const result = await fetchData();
                setFetching(false);
                setFetched(result != null);
        
            } catch (error) {
            }
        };
    
        checkInternetConnection();
    
        if(!fetched && fetchRequested){
            setFetchRequested(prevState => {
                if (prevState) {
                    fetchDataAndSetState();
                    return false;
                }
                return prevState;
            });
        }
        
        setMappedListData(itemMap(handleSearch(listData, filterText), navigation));
    
        return () => {
            unsubscribe(); // This should work to remove the event listener
        };
    }, [fetchRequested, listData, filterText]);


    const renderContent = () => {
        if (!isConnected) {
            return NoConnection();
        }

        if (mappedListData.length > 0) {
            return ScrollRefreshList(fetching, handleRefresh, mappedListData);
        }

        return NoServer(fetching, handleRefresh);
    };
 

    return <Surface elevation={0} style={{flex: 1, marginTop: 10}}>{renderContent()}</Surface>;
};

export default RefreshableList;
