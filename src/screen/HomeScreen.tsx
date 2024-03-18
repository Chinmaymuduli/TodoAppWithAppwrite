import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';

import {useAppContext} from '../appwrite';
import {Client, Databases, ID} from 'appwrite';
import {APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID} from '../appwrite/service';

type UserObj = {
  name: String;
  email: String;
};
const COLORS = {primary: '#1f145c', white: '#fff'};

const HomeScreen = () => {
  const [todos, setTodos] = React.useState<any>([]);
  const [textInput, setTextInput] = React.useState('');
  const [userData, setUserData] = useState<UserObj>();
  const {appwrite, setIsLoggedIn} = useAppContext();

  const DATABASE_ID = '65f6e97c3e794ecab996';
  const COLLECTION_ID = '65f7d92e417b4070c236';

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  const handleLogout = () => {
    appwrite.logout().then(() => {
      setIsLoggedIn(false);
      Alert.alert('Success', 'Logout Successful');
    });
  };

  useEffect(() => {
    appwrite.getCurrentUser().then(response => {
      if (response) {
        const user: UserObj = {
          name: response.name,
          email: response.email,
        };
        setUserData(user);
      }
    });
  }, [appwrite]);

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input todo');
    } else {
      const promise = databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          todo: textInput,
          isCompleted: false,
        },
      );

      promise.then(
        function (response) {
          console.log(response);
          setTextInput('');
          getTodosFromUserDevice();
        },
        function (error) {
          console.log(error);
        },
      );
    }
  };

  const getTodosFromUserDevice = () => {
    let promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    promise.then(
      function (response) {
        console.log('response get data', response);
        setTodos(response?.documents);
      },
      function (error) {
        console.log(error);
      },
    );
  };

  const markTodoComplete = (todoId: any) => {
    const promise = databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      todoId,
      {
        isCompleted: true,
      },
    );

    promise.then(
      function (response) {
        console.log(response);
        getTodosFromUserDevice();
      },
      function (error) {
        console.log(error);
      },
    );
  };

  const deleteTodo = (todoId: any) => {
    const promise = databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      todoId,
    );

    promise.then(
      function (response) {
        console.log({response});
        getTodosFromUserDevice();
      },
      function (error) {
        console.log(error);
      },
    );
  };

  const ListItem = ({todoList}: any) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todoList?.isCompleted
                ? 'line-through'
                : 'none',
            }}>
            {todoList?.todo}
          </Text>
        </View>
        {!todoList?.isCompleted && (
          <TouchableOpacity onPress={() => markTodoComplete(todoList.$id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todoList.$id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: COLORS.primary,
          }}>
          TODO APP
        </Text>
        <View style={styles.iconBox}>
          <Icon name="logout" size={25} color="red" onPress={handleLogout} />
        </View>
      </View>
      <View style={{paddingHorizontal: 20, marginTop: 10}}>
        <Text style={{fontWeight: '800', color: 'black', fontSize: 18}}>
          Hello ,
        </Text>
        <Text>{userData?.name}</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todoList={item} />}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Image
              src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?t=st=1710749032~exp=1710752632~hmac=b70229977a8bd264371a1906871b58016b16300fe99411f0471cff8037586da6&w=900"
              style={{height: 200, width: 250}}
            />
            <Text style={{color: 'red', fontWeight: '800', fontSize: 17}}>
              No Todo Found
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo"
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  iconBox: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default HomeScreen;
