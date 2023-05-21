import { Text, Box, Button, HStack } from 'native-base';
import { StyleSheet, TextInput, SafeAreaView, ScrollView, } from 'react-native';
import  React, { useState } from 'react';
import { useQuery } from 'react-query';

// api
import { API } from './Config/api';

const AddCategory = ({navigation}) => {

    // state title
    const [form, setForm] = useState({
        title: "",
    });

    // state error
    const [error, setError] = useState({
        title: "",
    })

    // get countries
    let { data: categories, refetch: refetchCategories} = useQuery('categoriesCaches', async () => {
        const response = await API.get(`/category`);
        return response.data
    });  

    // handle change
    const handleChange = (title, value) => {
        setForm({...form, 
            [title]: value
        })
    }

    // handle submit category
    const handleSubmit =  async () => {
        try {
            const config = {
                headers: {
                  "Content-type": "application/json",
                },
            };

            const messageError = {
                title: "",
            }

            // validasi form title
            if (form.title === "") {
                messageError.title = "Name must be filled out";
            } else {
                messageError.title = ""
            }

            if (messageError.title === "") {
                const body = JSON.stringify(form)
                 // Insert trip data
                const response = await API.post('/category', body, config);
                setForm("");
                refetchCategories();
                alert("Category has been added");
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
                        <TextInput style={styles.textInput} placeholder="Title" onChangeText={(value) => handleChange("title", value)} value={form.title}/>
                        {error.title && <Text style={{width:'75%', alignSelf:'center', color:'red'}}>{error.title}</Text>}
                        <Button style={styles.button} onPress={handleSubmit}><Text style={styles.text}>Add category</Text></Button>
                    <Text style={styles.title}>List Category</Text>
                
                    {/* looping categories */}
                    <HStack style={styles.listCategory}>
                        {categories?.map((item, i) => {
                            {if(item.title === "study") {
                                return (
                                    <Box key={i} style={{height: 30, marginRight: 15, marginBottom: 10, padding: 5, borderRadius: 5, backgroundColor: '#81C8FF'}}>
                                        <Text style={styles.studyStatus}>{item.title}</Text>
                                    </Box>
                                )} else if(item.title === "home work") {
                                    return (
                                        <Box key={i} style={{height: 30, marginRight: 15, marginBottom: 10, padding: 5, borderRadius: 5, backgroundColor: '#FF8181'}}>
                                            <Text style={styles.studyStatus}>{item.title}</Text>
                                        </Box>
                                )} else if(item.title === "workout"){
                                    return (
                                        <Box key={i} style={{height: 30, marginRight: 15, marginBottom: 10, padding: 5, borderRadius: 5,  backgroundColor: '#FFB681'}}>
                                            <Text style={styles.studyStatus}>{item.title}</Text>
                                        </Box>
                                        )
                                } else {
                                    return (
                                        <Box key={i} style={{height: 30, marginRight: 15, marginBottom: 10, padding: 5, borderRadius: 5, backgroundColor: randomColor()}}>
                                            <Text style={styles.studyStatus}>{item.title}</Text>
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
        marginBottom: 20,
    },
    textInput: {
        alignSelf: 'center',
        width: '80%', 
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
        width: '80%', 
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
        textAlign: 'center',
        lineHeight: 15,
        color: 'white',
        fontSize: 11,
        fontWeight: '800',
        borderRadius: 5,
    },
})

export default AddCategory