// components react
import { useState, useEffect, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// components native base
import { useTheme } from "native-base";

// components
import Dashboard from "./Dashboard";
import Register from "./Register";
import Login from "./Login";
import ListTodo from "./ListTodo";
import AddCategory from "./AddCategory";
import AddTodo from "./AddTodo";
import DetailList from "./DetailList";
import Profile from "./Profile";
import { UserContext } from "../../Context/UserContext";

// api
import { API, setAuthToken } from "../../Config/api";
// ---------------------------------------------------------

//Create Bottom Tab & tag Navigation
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTab() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="ListTodo"
      screenOptions={({ route }) => ({
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: theme.colors.brand["400"] },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "ListTodo") {
            iconName = focused ? "ios-list-circle" : "ios-list-outline";
          } else if (route.name === "AddTodo") {
            iconName = focused ? "ios-add-circle" : "ios-add-circle-outline";
          } else if (route.name === "AddCategory") {
            iconName = focused ? "md-duplicate" : "md-duplicate-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.brand["800"],
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="ListTodo" component={ListTodo} />
      <Tab.Screen name="AddTodo" component={AddTodo} />
      <Tab.Screen name="AddCategory" component={AddCategory} />
    </Tab.Navigator>
  );
}

const Containers = () => {
  // dispatch
  const [state, dispatch] = useContext(UserContext);

  const theme = useTheme();

  //state login
  const [login, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setLogin(true);
        setAuthToken(token);

        const response = await API.get("/check_auth");

        let payload = response?.data?.data;
        payload.token = token;

        dispatch({
          type: "USER_SUCCESS",
          payload: payload,
        });

        setIsLoading(false);
      } else {
        setLogin(false);
        setIsLoading(false);
      }
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: {},
      });
      setIsLoading(false);
      console.log(err);
    }
  };

  async function isAsyncTokenExist() {
    await AsyncStorage.getItem("token");
    checkLogin();
  }

  useEffect(() => {
    checkLogin();
    isAsyncTokenExist();
  }, []);

  return (
    <>
      {state.isLogin === true ? (
        <Stack.Navigator>
          <Stack.Screen
            name="MyTab"
            component={MyTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailList"
            component={DetailList}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: theme.colors.brand["400"] },
              headerTintColor: "whitesmoke",
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: theme.colors.brand["400"] },
              headerTintColor: "whitesmoke",
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Index"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "whitesmoke" },
              headerTitle: ""
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "whitesmoke" },
              headerTitle: ""
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default Containers;
