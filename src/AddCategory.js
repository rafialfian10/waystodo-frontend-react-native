import { Text, Box, Image, Button } from 'native-base';
import { StyleSheet, TextInput, FlatList, View } from 'react-native';
import  React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { API } from './config/api';

const AddCategory = ({navigation}) => {
    const [text, setText] = useState('');

    const [category, setCategory] = useState()
    console.log("Category coy", category)

    useEffect(() => {
        (async () => {
            const response = await API.get(`/category`);
            setCategory(response.data);
        })()
      }, [])

    const handleSubmit = () => {
        alert("OK")
    }
    return (
        <>
            <Box>
                <Text style={styles.title}>Add Category</Text>
                <TextInput style={styles.textInput} placeholder="Name" onChangeText={newText => setText(newText)}defaultValue={text}/>
                <Button style={styles.button}><Text style={styles.text} onPress={handleSubmit}>Add category</Text></Button>
                <Text style={styles.title}>List Category</Text>
                <Box style={styles.listCategory}>
                    {/* looping categories */}
                    <FlatList data={category ? category : null} renderItem={({ item }) => {
                    return (
                        <Box>
                            <Text style={styles.studyStatus}>{item.name}</Text>
                        </Box>
                    )
                    }} keyExtractor={(item, index) => index} />
                </Box>
            </Box>
            <Box style={styles.navbar}>
                <Button onPress={() => navigation.navigate("ListTodo")} style={styles.navbarButton}>
                <Image style={styles.navbarImage} source={require('../assets/white-clipboard-list.png')} alt=""/>
                </Button>
                <Button onPress={() => navigation.navigate("AddList")} style={styles.navbarButton}>
                    <Image style={styles.navbarImage} source={require('../assets/white-task-list-add.png')} alt=""/>
                </Button>
                <Button onPress={() => navigation.navigate("AddCategory")} style={styles.navbarButton}>
                    <Image style={styles.navbarImage} source={require('../assets/red-category.png')} alt=""/>
                </Button>
            </Box>
        </>
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
    },
    studyStatus: {
        width: '25%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#81C8FF',
        color: 'black',
        textAlign: 'center',
        fontSize:11,
        fontWeight: '800',
        borderRadius: 5,
        marginBottom: 10,
        marginRight:10,
        display:'flex',
        flexDirection: 'row',
    },
    navbar: {
        position:'absolute',
        width: '100%',
        height: 60,
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
    },
    navbarButton: {
        backgroundColor:'transparent',
    },
    navbarImage: {
        width: 30,
        height: 30,
    }
})

export default AddCategory