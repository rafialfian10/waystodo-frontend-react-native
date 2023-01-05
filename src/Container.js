import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Index from './index';
import Register from './Register';
import Login from './Login';
import ListTodo from './ListTodo';
import AddCategory from './AddCategory';
import AddList from './AddList';
import DetailList from './DetailList';

const Stack = createStackNavigator();

const Container = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ListTodo" component={ListTodo} />
        <Stack.Screen name="AddCategory" component={AddCategory} />
        <Stack.Screen name="AddList" component={AddList} />
        <Stack.Screen name="DetailList" component={DetailList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Container