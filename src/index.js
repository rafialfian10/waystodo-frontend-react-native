import React, { useState } from 'react';
import { Text, Box, Button, Image } from 'native-base';
import { StyleSheet, Alert, TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Index = ({navigation}) => {

  // navigate
  const Stack = createStackNavigator();
  const [text, setText] = useState('');

    const handleSubmit = () => {
        Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        )
    }
    return (
        <Box>
            <Image source={require('../assets/accept-request.png')} style={styles.image} alt=""/>
            <Image source={require('../assets/text.png')} style={{marginBottom: 50, alignSelf:'center', marginBottom:20}} alt=""/>
            <Text style={styles.desc}>Write your activity and finish your activity. Fast, Simple and Easy to use</Text>
            <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate('Login')}><Text style={styles.text}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Register')}><Text style={styles.text}>Register</Text></TouchableOpacity>
        </Box>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10
    },
    countContainer: {
        alignItems: 'center',
        padding: 10
    },
    image: {
      marginTop: 70, 
      alignSelf:'center', 
    },
    text: {
        color: 'white',
        fontWeight: '800',
        textAlign: 'center', 
    },
    desc: {
        width: 300,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom:100,
    },
    buttonLogin: {
      width: 320, 
      alignSelf: 'center',
      backgroundColor: '#FF5555',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      height: 50,
    },
    buttonRegister: {
      width: 320, 
      alignSelf: 'center',
      backgroundColor: '#c0c0c0',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      height: 50, 
    },
  });


export default Index