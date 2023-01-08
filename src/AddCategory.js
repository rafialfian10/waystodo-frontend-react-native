import { Text, Box, Button, HStack } from 'native-base';
import { StyleSheet, TextInput, SafeAreaView, ScrollView, } from 'react-native';
import  React, { useState } from 'react';
import { useQuery } from 'react-query';

// api
import { API } from './config/api';

const AddCategory = ({navigation}) => {

    // state category for get query data
    const [category, setCategory] = useState()

    // state error
    const [error, setError] = useState({
        name: '',
    })

    // get countries
    let { data: categories, refetch: refetchCategories} = useQuery('categoriesCaches', async () => {
        const response = await API.get(`/category`);
        return response.data
    });

    // state form for post data
    const [form, setForm] = useState({
        name: "",
    });

    // handle change
    const handleChange = (name, value) => {
        setForm({...form,[name]: value
        })
    }

    // handle submit category
    const handleSubmit =  async () => {
        try {
            // konfigurasi file
            const config = {
                headers: {
                  'Content-type': 'application/json',
                  
                },
            };

            const messageError = {
                name: '',
            }

            // validasi form title
            if (form.name === "") {
                messageError.name = "Name must be filled out";
            } else {
                messageError.name = ""
            }

            if (messageError.name === "") {
                const body = JSON.stringify(form)
                 // Insert trip data
                const response = await API.post('/category', body, config);
                refetchCategories()
                alert("Category has been added")
                navigation.navigate('AddCategory'); 
                } else {
                    setError(messageError)
                }
          } catch (err) {
              console.log(err)
          }
      }

      // function random color
      const randomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0');
        return `#${randomColor}`;
      };
    
    return (
        <SafeAreaView>
            <ScrollView>
            <Box>
                <Text style={styles.title}>Add Category</Text>
                <TextInput style={styles.textInput} placeholder="Name" onChangeText={(value) => handleChange("name", value)} value={form.name}/>
                {error.name && <Text style={{width:'75%', alignSelf:'center', color:'red'}}>{error.name}</Text>}
                <Button style={styles.button} onPress={handleSubmit}><Text style={styles.text}>Add category</Text></Button>
                <Text style={styles.title}>List Category</Text>
            
                {/* looping categories */}
                <HStack style={styles.listCategory}>
                    {categories?.map((item, i) => {
                        {if(item.name === "study") {
                            return (
                                <Box key={i} style={{height: 30, width: '20%', marginRight: 15, marginBottom: 10, borderRadius: 5, backgroundColor: '#81C8FF'}}>
                                    <Text style={styles.studyStatus}>{item.name}</Text>
                                </Box>
                            )} else if(item.name === "home work") {
                                return (
                                    <Box key={i} style={{height: 30, width: '20%', marginRight: 15, marginBottom: 10, borderRadius: 5, backgroundColor: '#FF8181'}}>
                                        <Text style={styles.studyStatus}>{item.name}</Text>
                                    </Box>
                            )} else if(item.name === "workout"){
                                return (
                                    <Box key={i} style={{height: 30, width: '20%', marginRight: 15, marginBottom: 10, borderRadius: 5,  backgroundColor: '#FFB681'}}>
                                        <Text style={styles.studyStatus}>{item.name}</Text>
                                    </Box>
                                    )
                            } else {
                                return (
                                    <Box key={i} style={{height: 30, width: '20%', marginRight: 15, marginBottom: 10, borderRadius: 5,  backgroundColor: randomColor()}}>
                                        <Text style={styles.studyStatus}>{item.name}</Text>
                                    </Box>
                            )
                        }}
                    })}
                </HStack>
            </Box>
            </ScrollView>
        </SafeAreaView>
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
    title: {
        paddingHorizontal: 40,
        paddingVertical: 5,
        fontSize: 25, 
        fontWeight: 'bold', 
        marginTop: 70,
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
      },
      text: {
        display:'flex',
        alignItems:'center',
        color: 'white',
        fontWeight: '800',
    },
    listCategory: {
        width: '80%',
        display:'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    studyStatus: {
        width: '100%',
        height: 30,
        color: 'white',
        textAlign: 'center',
        fontSize:11,
        fontWeight: '800',
        borderRadius: 5,
    },
})

export default AddCategory