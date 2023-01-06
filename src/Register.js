import { Text, Box, Image} from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Register = ({navigation}) => {
    const [text, setText] = useState()
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
    });

    const handleChange = (e) => {
      setForm({
      ...form,
      [e.target.name]: e.target.value,
      })
  };

    return (
        <Box>
            <Image source={require('../assets/login.png')} style={styles.imageLogin} alt=""/>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.textInput} placeholder="Email" onChange={handleChange} onChangeText={newText => setText(newText)}defaultValue={text}/>
            <TextInput style={styles.textInput} placeholder="Name" onChange={handleChange} onChangeText={newText => setText(newText)}defaultValue={text}/>
            <TextInput style={styles.textInput} placeholder="Password" onChange={handleChange} onChangeText={newText => setText(newText)}defaultValue={text}/>
            <TouchableOpacity style={styles.button}><Text style={styles.text}>Register</Text></TouchableOpacity>
            <Text style={styles.textRegister}>Joined us before?<Text onPress={() => navigation.navigate("Login")} style={styles.linkRegister}> Login</Text></Text>
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
        marginBottom: 50,
        alignSelf: 'center'
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
      marginBottom: 10,
      width: 300, 
      height: 50, 
    },
    text: {
      color: 'white',
      fontWeight: '800',
      textAlign: 'center'
    },
    textRegister: {
      textAlign:'center'
    },
    linkRegister: {
      color:'#FF5555',
      fontWeight:'800',
    }
  });

export default Register