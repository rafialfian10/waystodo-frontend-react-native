
import { Text, Box, Image, Button, TextArea, Select } from 'native-base';
import { StyleSheet, TextInput } from 'react-native';
import  React, { useState } from 'react';

const AddList = ({navigation}) => {
    const [text, setText] = useState('');
    const [service, setService] = React.useState("");

    const handleSubmit = () => {
        alert('Hello')
    }
    return (
        <>
            <Box>
                <Text style={styles.title}>Add List</Text>
                <TextInput style={styles.textInput} placeholder="Name" onChangeText={newText => setText(newText)}defaultValue={text}/>
                <TextInput style={styles.textInput} placeholder="Category" onChangeText={newText => setText(newText)}defaultValue={text}/>
                {/* <Select selectedValue={service} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{bg: "teal.600", endIcon: <CheckIcon size="5" />}} mt={1} onValueChange={itemValue => setService(itemValue)}>
                    <Select.Item label="UX Research" value="ux" />
                    <Select.Item label="Web Development" value="web" />
                    <Select.Item label="Cross Platform Development" value="cross" />
                    <Select.Item label="UI Designing" value="ui" />
                    <Select.Item label="Backend Development" value="backend" />
                </Select> */}
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