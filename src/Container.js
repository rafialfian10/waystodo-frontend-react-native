import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "native-base";
import { useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// pages
import Index from './Index';
import Register from './Register';
import Login from './Login';
import ListTodo from './ListTodo';
import AddCategory from './AddCategory';
import AddList from './AddList';
import DetailList from './DetailList';

// API
import { API, setAuthToken } from './Config/api';
import { UserContext } from './Context/UserContext';

//Create Bottom Tab & tag Navigation
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTab() {
  // Init Theme
  const theme = useTheme();

  return (
    <Tab.Navigator initialRouteName="ListTodo" screenOptions={({ route }) => ({headerMode: "screen", headerTintColor: "white",headerStyle: { backgroundColor: theme.colors.primary["300"] },tabBarIcon: ({ focused, color, size }) => {
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

  const [state, dispatch] = useContext(UserContext);

  //state login
  const [login, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // const CheckLogin = async () => {
  //   try {
  //     const response = await AsyncStorage.getItem("token")
  //     console.log(response)
  //     if(response){
  //       setLogin(true)
  //       setAuthToken(response)
  //     } else {
  //       setLogin(false)
  //     }
  //   } catch (err){
  //     console.log(err)
  //   }
  // }

  const checkLogin = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if(token){
            setLogin(true);
            setAuthToken(token);

            const response = await API.get(`/auth/user?$lookup[*]=*`);
            
            let payload = response.data;
            payload.token = token;
            
            dispatch({
              type: 'USER_SUCCESS',
              payload: payload,
            });
            setIsLoading(false);
        } else {
            setLogin(false);
        }
    } catch (err){
        dispatch({
            type: "AUTH_ERROR",
            payload: {},
        });
        setIsLoading(false);
        console.log(err);
    }
  }

  async function isAsyncTokenExist() {
    await AsyncStorage.getItem("token");
    checkLogin();
  }

  useEffect(() => {
    checkLogin();
    isAsyncTokenExist();
  }, []);

  return (
      // <Stack.Navigator >
      //   {login === false ? (
      //     <>
      //       <Stack.Screen name="Index" component={Index} options={{headerShown: false }} />
      //       <Stack.Screen name="Register" component={Register} options={{headerShown: false }} />
      //       <Stack.Screen name="Login" component={Login} options={{headerShown: false }} />
      //     </>
      //   ) : (
      //     <>
      //       <Stack.Screen name="MyTab" component={MyTab} options={{headerShown: false }} />
      //       {/* <Stack.Screen name="ListTodo" component={ListTodo} options={{headerShown: true }} />
      //       <Stack.Screen name="AddList" component={AddList} options={{headerShown: true }} />
      //       <Stack.Screen name="AddCategory" component={AddCategory} options={{headerShown: true }} /> */}
      //       <Stack.Screen name="DetailList" component={DetailList} options={{headerShown: true }} />
      //     </>
      //   )}
      // </Stack.Navigator>

    <>
      {
      state.isLogin === true ? (
        <Stack.Navigator>
          <Stack.Screen name="MyTab" component={MyTab} options={{headerShown: false }} />
          <Stack.Screen name="DetailList" component={DetailList} options={{headerShown: true }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Index" component={Index} options={{headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{headerShown: false }} />
        </Stack.Navigator>
      )}
    </>
  );
}

export default Container