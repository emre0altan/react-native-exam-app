import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBarIndicator } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";

const CustomTabBar = (props) => (
    <TabBar {...props}
        tabStyle={{backgroundColor:'transparent', elevation:0}}
        style={{backgroundColor:'transparent', elevation:0}}
        labelStyle={{color:'black', textTransform:'none'}}
        indicatorStyle={{ color: 'blue', backgroundColor:'blue', height: 5}}
    />
)

const LatestCourses = () => (
  <View style={{ flex: 1}} />
);

const SavedCourses = () => (
  <View style={{ flex: 1}} />
);

const renderScene = SceneMap({
  first: LatestCourses,
  second: SavedCourses,
});

const MyCourseTabs = (props) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Son Calıştıklarım' },
    { key: 'second', title: 'Kaydettiklerim' },
  ]);


  return (
    <TabView
        {...props}
        renderTabBar={props => <CustomTabBar {...props} />}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
    />
  );
};


export default MyCourseTabs;
