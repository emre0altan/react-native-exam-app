import React from "react";
import { Text, Card, useTheme, Divider, Surface } from "react-native-paper";
import RefreshableList from "../components/RefreshableList";
import { getDepartmentCourses } from "../services/dataHandler";
import { getCourseItems } from "../components/ItemMaps";
import { globals, getKeyFast } from "../global";

const HomeCourses = ({ navigation }) => {
    const theme = useTheme();
    return (
        <Surface style={{flex:1}}>
            <Card elevation={3} style={{
                        margin: 20
                    }}>
                <Card.Content>
                <Text variant="titleLarge" style={{
                                color: 'black',
                            }}>
                    {getKeyFast(globals.DepartmentListItem, null, true)?.name}</Text>
                <Divider></Divider>
                <Text variant="titleMedium" style={{
                                color: 'black',
                                paddingTop: 10
                            }}>
                    {getKeyFast(globals.ProgrammeListItem, null, true)?.name}</Text>
                </Card.Content>
            </Card>
            
            <RefreshableList 
                fetchFunc={getDepartmentCourses}
                params={{'department_id': getKeyFast(globals.DepartmentListItem, null, true)?.id}}
                itemMap={getCourseItems} 
                navigation={navigation}
                filterText={''}
                theme={theme}
            />
        </Surface>
    );
};


export default HomeCourses;
