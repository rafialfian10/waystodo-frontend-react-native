import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, Box, Image } from 'native-base';
import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// user context
import { UserContext } from './Context/UserContext';

import { setAuthToken } from './Config/api';

// api
import { API } from './Config/api';

const Login = ({navigation}) => {

    const [state, dispatch] = useContext(UserContext);

     // state form
     const [form, setForm] = useState({
        email: "",
        password: "",
      });
  
      // state error
      const [error, setError] = useState({
        email: "",
        password: "",
      })
  
      // handle change
      const handleChange = (name, value) => {
        setForm({
        ...form,
        [name]: value,
        })
      };
  
    // handle submit category
    const handleSubmit =  async () => {
        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
            };
  
            const messageError = {
                email: "",
                password: "",
            }
  
            // validasi form email
            if (form.email === "") {
                messageError.email = "Email must be filled out";
            } else {
                messageError.email = ""
            }
  
            // validasi form password
            if (form.password === "") {
                messageError.password = "Password must be filled out";
            } else {
                messageError.password = ""
            }
  
            if (messageError.email === "" && messageError.password === "") {
                const body = JSON.stringify(form)
  
                // Insert trip data
                const response = await API.post('auth/login', body, config);

                if(response) {
                    await AsyncStorage.setItem("token", response.data.token)
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: response.data,
                    });
                    setAuthToken(response.data.token);
                    alert("Login successfully")
                }

            } else {
                setError(messageError)
            }
        } catch (err) {
            console.log(err)
            alert("Login failed (email / password incorrect)")
        }
    }
    return (
        <Box>
            <Image source={require('../assets/login.png')} style={styles.imageLogin} alt=""/>
            <Text style={styles.title}>Login</Text>

            <TextInput style={styles.textInput} placeholder="Email" onChangeText={(value) => handleChange("email", value)} value={form.email}/>

            <TextInput style={styles.textInput} placeholder="Password" secureTextEntry={true} onChangeText={(value) => handleChange("password", value)} value={form.password}/>

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