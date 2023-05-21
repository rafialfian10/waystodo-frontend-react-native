import { Text, Box, Image, Button, NativeBaseProvider} from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { API } from './Config/api';

const Register = ({navigation}) => {
    
  // state form
    const [form, setForm] = useState({
      firstName: "",
      email: "",
      password: "",
    });

    // state error
    const [error, setError] = useState({
      firstName: "",
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
              firstName: "",
              email: "",
              password: "",
          }

          // validasi form name
          if (form.firstName === "") {
              messageError.firstName = "Name must be filled out";
          } else {
              messageError.firstName = ""
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

          if (messageError.firstName === "" && messageError.email === "" && messageError.password === "") {
              const body = JSON.stringify(form)

               // Insert trip data
              const response = await API.post('auth/register', body, config);
              // refetchCategories()
              alert("Register successfully")
              navigation.navigate('Login'); 
              } else {
                  setError(messageError)
              }
        } catch (err) {
            console.log(err)
        }
    }

    return (
      <NativeBaseProvider>
        <Box>
            <Image source={require('../assets/login.png')} style={styles.imageLogin} alt=""/>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.textInput} placeholder="Email" onChangeText={(value) => handleChange("email", value)} value={form.email}/>
            {error.email && <Text style={{width:'75%', alignSelf:'center', color:'red'}}>{error.email}</Text>}

            <TextInput style={styles.textInput} placeholder="Name" onChangeText={(value) => handleChange("firstName", value)} value={form.firstName}/>
            {error.firstName && <Text style={{width:'75%', alignSelf:'center', color:'red'}}>{error.firstName}</Text>}

            <TextInput style={styles.textInput} secureTextEntry={true} placeholder="Password" onChangeText={(value) => handleChange("password", value)} value={form.password}/>
            {error.password && <Text style={{width:'75%', alignSelf:'center', color:'red'}}>{error.password}</Text>}

            <Button onPress={handleSubmit} style={styles.button}><Text style={styles.text}>Register</Text></Button>
            <Text style={styles.textRegister}>Joined us before?<Text onPress={() => navigation.navigate("Login")} style={styles.linkRegister}> Login</Text></Text>
        </Box>
      </NativeBaseProvider>
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
        marginTop: 10,
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