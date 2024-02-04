import React from "react";
import { Card, Text, Divider, useTheme, Surface } from "react-native-paper";
import { getCourseExamInfos } from "../services/dataHandler";
import { getExamInfoItems } from "../components/ItemMaps";
import DownloadableRList from "../components/DownloadableRList";
import { globals, getKeyFast } from "../global";

const HomeExamInfos = ({ navigation }) => {
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
                    {getKeyFast(globals.CourseListItem, null, true)?.name}</Text>
                <Divider></Divider>
                <Text variant="titleMedium" style={{
                                color: 'black',
                                paddingTop: 10
                            }}>
                    {getKeyFast(globals.DepartmentListItem, null)?.name}</Text>
                <Divider></Divider>
                <Text variant="titleSmall" style={{
                                color: 'black',
                                paddingTop: 10
                            }}>
                    {getKeyFast(globals.ProgrammeListItem, null)?.name}</Text>
                </Card.Content>
            </Card>
            <DownloadableRList 
                fetchFunc={getCourseExamInfos}
                params={{'course_id': getKeyFast(globals.CourseListItem, null)?.id}}
                itemMap={getExamInfoItems} 
                navigation={navigation}
                filterText={''}
                theme={theme}
            />
        </Surface>
    );
};


export default HomeExamInfos;
