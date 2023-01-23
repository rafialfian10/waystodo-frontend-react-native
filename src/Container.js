import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "native-base";
import { setAuthToken } from './config/api';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// pages
import Index from './index';
import Register from './Register';
import Login from './Login';
import ListTodo from './ListTodo';
import AddCategory from './AddCategory';
import AddList from './AddList';
import DetailList from './DetailList';

const Stack = createStackNavigator();

//Create Bottom Tab Navigation
const Tab = createBottomTabNavigator();

function MyTab() {
  // Init Theme
  const theme = useTheme();

  return (
    <Tab.Navigator screenOptions={({ route }) => ({headerMode: "screen", headerTintColor: "white",headerStyle: { backgroundColor: theme.colors.primary["300"] },tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "ListTodo") {
            iconName = focused ? "ios-list-circle" : "ios-list-outline";
          }  else if (route.name === "AddList") {
            iconName = focused ? "ios-add-circle" : "ios-add-circle-outline";
          } else if (route.name === "AddCategory") {
            iconName = focused ? "md-duplicate" : "md-duplicate-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.colors.primary["800"],
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="ListTodo" component={ListTodo} />
      <Tab.Screen name="AddList" component={AddList} />
      <Tab.Screen name="AddCategory" component={AddCategory} />
    </Tab.Navigator>
  );
}

const Container = () => {
  const [login, setLogin] = useState(false)

  const CheckLogin = async () => {
    try {
      const response = await AsyncStorage.getItem("token")
      console.log(response)
      if(response){
        setLogin(true)
        setAuthToken(response)
      } else {
        setLogin(false)
      }
    } catch (err){
      console.log(err)
    }
  }

  useEffect(() => {
    CheckLogin()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index" >
        {login == false ? (
          <>
            <Stack.Screen name="Index" component={Index} options={{headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{headerShown: false }} />
            <Stack.Screen name="Login" component={() => <Login CheckLogin={CheckLogin}/>} options={{headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="MyTab" component={MyTab} options={{headerShown: false }} />
            <Stack.Screen name="ListTodo" component={ListTodo} options={{headerShown: true }} />
            <Stack.Screen name="AddList" component={AddList} options={{headerShown: true }} />
            <Stack.Screen name="AddCategory" component={AddCategory} options={{headerShown: true }} />
            <Stack.Screen name="DetailList" component={DetailList} options={{headerShown: true }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Container