import { Text, Box, Image } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Login = ({navigation}) => {

    const [text, setText] = useState('');

    const handleSubmit = () => {
        navigation.navigate("ListTodo")
    }

    return (
        <Box>
            <Image source={require('../assets/login.png')} style={styles.imageLogin} alt=""/>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.textInput} placeholder="Email" onChangeText={newText => setText(newText)}defaultValue={text}/>
            <TextInput style={styles.textInput} placeholder="Password" onChangeText={newText => setText(newText)}defaultValue={text}/>
            <TouchableOpacity style={styles.button}><Text style={styles.text} onPress={handleSubmit}>Login</Text></TouchableOpacity>
            <Text style={styles.textRegister}>New Users?<Text onPress={() => navigation.navigate("Register")} style={styles.linkRegister}> Register</Text></Text>
        </Box>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 100
    },
    countContainer: {
        alignItems: 'center',
        padding: 10
    },
    imageLogin: {
        justifyContent: 'center',
        marginTop: 100,
        marginBottom: 70,
        alignSelf: 'center',
    },
    title: {
        paddingHorizontal: 40,
        paddingVertical: 5,
        fontSize: 25, 
        fontWeight: 'bold', 
        marginBottom:20,
    },
    textInput: {
        alignSelf: 'center',
        width: 300, 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        paddingLeft: 20, 
        marginBottom: 10,
        justifyContent: 'center',
    },
    button: {
      alignSelf: 'center',
      backgroundColor: '#FF5555',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      width: 300, 
      height: 50, 
      marginBottom: 10,
    },
    text: {
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
    },
    textRegister: {
        textAlign:'center'
    },
    linkRegister: {
        color:'#FF5555',
        fontWeight:'800',
    }
  });

export default Login