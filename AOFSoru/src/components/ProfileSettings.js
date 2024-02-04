import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { IconButton, Button, Text, Card, Switch } from "react-native-paper";

const settings = [
    ['Email', 'Email', 'example@gmail.com'],
    // ['Username', 'Kullanıcı Adı', 'username'],
    // ['Password', 'Şifre', '********'],
    // ['Notifications', 'Bildirimler', ''],
    // ['Night Mode', 'Gece Modu', ''],
    ['Help Center', 'Yardım Merkezi', ''],
    ['About', 'Hakkında', ''],
    ['Version', 'Versiyon', '0.01'],
]

const ProfileSettings = ({ navigation }) => {

    const item = (data) => (
        <View key={data[0]} style={styles.card}>
            <Text variant="titleSmall" style={styles.cardTitle} >{data[1]}</Text>
            <Text variant="titleSmall" style={styles.cardSubtitle} >{data[2]}</Text>
        </View>
    )

    return (
        <ScrollView style={{
            flex:1
        }}>
            {
                settings.map(item)
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        elevation: 1,
        borderRadius: 0,
        margin: 1,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 15,
    },
    cardSubtitle: {
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 5
    },
});


export default ProfileSettings;
