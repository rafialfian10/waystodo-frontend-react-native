import { Text, Box, Button, Image } from 'native-base';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import  React, { useState } from 'react';

const DetailList = ({route, navigation}) => {

    const { courses } = route.params;
  
    return (
        <SafeAreaView>
            <ScrollView>
                <Box style={styles.contentDetail}>
                    <Text style={styles.title}>{courses.name}</Text>
                    <Text style={styles.date}>{courses.date}</Text>
                    <Text>Learn Golang to improve fundamentals and familiarize with coding.</Text>
                    <Text>Advantages of Go Go has advantages over other languages, including:</Text>
                    <Text>Supports concurrency at the language level with fairly easy application</Text>
                    <Text>Supports data processing with multiple processors at the same time (parallel processing)</Text>
                    <Text>Have a garbage collector The compilation process is very fast It's not a hierarchical programming language and it's not strict OOP, giving developers the freedom to how to write code.
                    </Text>
                    <Text>Listing Material :</Text>
                    <Text>Installation</Text>
                    <Text>Setup Go Modules</Text>
                    <Text>Setup Gopath & Workspace</Text>
                    <Text>Go Command</Text>
                    <Text>Hello World</Text>
                    <Text>Variable</Text>
                    <Text>Tipe DataKonstanta</Text>
                    <Text>Operator</Text>
                    <Text>Condition</Text> 
                    <Text>Loops</Text>       
                </Box>
            </ScrollView>
            {/* navbar */}
            <Box style={styles.navbar}>
                    <Button onPress={() => navigation.navigate("ListTodo")} style={styles.navbarButton}>
                    <Image style={styles.navbarImage} source={require('../assets/white-clipboard-list.png')} alt=""/>
                    </Button>
                    <Button onPress={() => navigation.navigate("AddList")} style={styles.navbarButton}>
                        <Image style={styles.navbarImage} source={require('../assets/white-task-list-add.png')} alt=""/>
                    </Button>
                    <Button onPress={() => navigation.navigate("AddCategory")} style={styles.navbarButton}>
                        <Image style={styles.navbarImage} source={require('../assets/white-category.png')} alt=""/>
                    </Button>
                </Box>
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
    contentDetail: {
        margin: 30,
        padding: 20,
        paddingBottom: 100,
        borderRadius: 5,
        backgroundColor: '#DAEFFF'
    },
    title: {
        paddingVertical: 5,
        fontSize: 25, 
        fontWeight: 'bold', 
        marginTop: 50,
        color: 'black'
    },
    date: {
        marginBottom: 50,
        paddingVertical: 5,
        fontWeight: 'bold', 
        color: 'black'
    },
})

export default DetailList