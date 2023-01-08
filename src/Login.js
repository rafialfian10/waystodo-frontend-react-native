import { Text, Box, Image } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from 'react-query';

// api
import { API } from './config/api';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const Login = ({navigation, CheckLogin}) => {

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
      }, []);

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
            // konfigurasi file
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
                }

                CheckLogin()
                alert("Login successfully")
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