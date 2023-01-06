
import { Text, Box, Image, Button, TextArea, Select, CheckIcon } from 'native-base';
import { StyleSheet, TextInput } from 'react-native';
import  React, { useState } from 'react';

const AddList = ({navigation}) => {
    const [text, setText] = useState('');

    const [value, setValue] = React.useState("");

    const handleSubmit = () => {
        alert('Hello')
    }
    return (
        <>
            <Box>
                <Text style={styles.title}>Add List</Text>
                <TextInput style={styles.textInput} placeholder="Name" onChangeText={newText => setText(newText)}defaultValue={text}/>
                <Box style={styles.selectInput}>
                    <Select style={{marginLeft:7, fontSize:14, height:45}} selectedValue={value} placeholder="Category" onValueChange={itemValue => {setValue(itemValue);}} _selectedItem={{endIcon: <CheckIcon size={5} />}}>
                        <Select.Item label="Study" value="study"/>
                        <Select.Item label="Home Work" value="homework"/>
                        <Select.Item label="Workout" value="workout"/>
                    </Select>
                </Box>
                <TextInput style={styles.textInput} placeholder="Choose Date" onChangeText={newText => setText(newText)}defaultValue={text}/>
                <Box style={styles.textArea}>
                    <TextArea style={{fontSize:15, paddingLeft: 20}} h={40} placeholder="Description" w="100%" />
                </Box>
                <Button style={styles.button}><Text style={styles.text}>Add List</Text></Button>
            </Box>
            
            {/* navbar */}
            <Box style={styles.navbar}>
                <Button onPress={() => navigation.navigate("ListTodo")} style={styles.navbarButton}>
                <Image style={styles.navbarImage} source={require('../assets/white-clipboard-list.png')} alt=""/>
                </Button>
                <Button onPress={() => navigation.navigate("AddList")} style={styles.navbarButton}>
                    <Image style={styles.navbarImage} source={require('../assets/red-task-list-add.png')} alt=""/>
                </Button>
                <Button onPress={() => navigation.navigate("AddCategory")} style={styles.navbarButton}>
                    <Image style={styles.navbarImage} source={require('../assets/white-category.png')} alt=""/>
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
        width: '80%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        paddingLeft: 20, 
        marginBottom: 10,
        justifyContent: 'center',
    },
    selectInput: {
        alignSelf: 'center',
        width: '80%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        marginBottom: 10,
        color: '#999999',
    },
    textArea: {
        width: '80%',
        alignSelf: 'center',
        backgroundColor: '#dcdcdc',
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

export default AddList