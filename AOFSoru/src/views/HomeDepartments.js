import React from "react";
import RefreshableList from "../components/RefreshableList";
import { Text, Card, useTheme, Surface } from "react-native-paper";
import { getProgrammeDepartments } from "../services/dataHandler";
import { getDepartmentItems } from "../components/ItemMaps";
import { globals, getKeyFast } from "../global";

const HomeDepartments = ({ navigation }) => {
    const theme = useTheme();
    return (
        <Surface style={{
            flex: 1
        }}>
            <Card elevation={3} style={{
                        marginHorizontal: 20, 
                        marginTop: 15
                    }}>
                <Card.Content>
                <Text variant="titleLarge">
                    {getKeyFast(globals.ProgrammeListItem, null, true)?.name}
                </Text>
                </Card.Content>
            </Card>
            <RefreshableList 
                fetchFunc={getProgrammeDepartments}
                params={{'programme_id': getKeyFast(globals.ProgrammeListItem, null, true)?.id}}
                itemMap={getDepartmentItems} 
                navigation={navigation}
                filterText={''}
                theme={theme}
            />
        </Surface>
    );
};


export default HomeDepartments;
