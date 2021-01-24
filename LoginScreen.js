import { SurveyScreenShared } from './SurveyScreenShared.js';
import React, {Fragment} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    Button,
    Switch,
  } from 'react-native';
import Modal from 'react-native-modal';
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';



class LoginScreen extends React.Component {

    constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: false,
      rememberCredentials: true,
      checked: true,
      showModal: false,
    }
  }

  async componentDidMount() {
    // load previous credentials if exists
    let hasPrevCred = await this.loadPreviousCredentials();
    if (hasPrevCred) this.login();

  }

  async storeCredentials(user) {
    try {
       await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  async loadPreviousCredentials() {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);

      for (key in data) {
        if (key == "username") {
          this.state.username = data[key];
        }
        else if (key == "password") {
          this.state.password = data[key];
        }
        else if (key == "saveCredentials") {
          this.state.rememberCredentials = data[key];
        }
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }

    this.forceUpdate();

    if (this.state.username != "" && this.state.password != "")
      return true;
    return false;
    
  }


  login() {

    this.state.showModal = true;
    this.forceUpdate();

    // User data query
    let data = {
      method: 'POST',
      body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
      }),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
    }

    console.log(data);


    // ========================= Get server data ========================== //
    //fetch('http://192.168.20.9:3000/user-login', data) // https://emad-cits5206-2.herokuapp.com/user-login
    fetch('https://emad-uwa5206.herokuapp.com/user-login', data) // https://emad-cits5206-2.herokuapp.com/user-login
      .then((response) => response.json())
        .then((responseJson) => {

          // ============= on success ============== //
          // Remember recredentials
          if (this.state.rememberCredentials) {
            // store user credentials
            let user = {username: this.state.username, password: this.state.password, saveCredentials: this.state.rememberCredentials};
            this.storeCredentials(user);
          }
          else {
            // erase user credentials
            let user = {username: "", password: "", saveCredentials: this.state.rememberCredentials};
            this.storeCredentials(user);
          }

          this.state.showModal = false;
          this.forceUpdate();

          // Go to next screen with data
          console.log(responseJson);
          this.props.navigation.push('Survey', {serverData: responseJson, username: this.state.username, password: this.state.password});

        }).catch((error) => {
        // ============= on failure ============== //
        this.state.error = true;
        this.state.showModal = false;
        this.forceUpdate();

        console.error(error);
    }
    );

  }
  
  render() {

    return (
      <Fragment>
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
  
              <View style={{flex: 1, flexDirection: 'column', justifyContent:'space-between'}}>
              <View style={{ height: 25, }}></View>
  
                <Image source={{uri: 'https://www.courseseeker.edu.au/assets/images/institutions/1055.png'}} style={{width: 330, height: 110,  margin: 5,}} />
  
                <View>
                  <View style={{ height: 50, }}></View>
                  <View style={styles.body}>
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Login</Text>
                      <Text>Username: </Text>
                      <TextInput
                        style={styles.userInput}
                        placeholder="Enter username here." 
                        onChangeText={(value) => { this.state.username = value; }} defaultValue={this.state.username}/>
                      <Text>Password: </Text>
                      <TextInput
                        style={styles.userInput}
                        secureTextEntry={true}
                        placeholder="Enter password here." onChangeText={(value) => { this.state.password = value; }} defaultValue={this.state.password}/>
                        {this.state.error? <Text style={styles.errorMsg}>Incorrect username or password.</Text> : null}
                      <View style={styles.rememberMeSwitch}>
                        <Switch onValueChange={(value) => { this.state.rememberCredentials = value; this.forceUpdate(); }} value={this.state.rememberCredentials}/>
                        <Text>Remember Me</Text>
                      </View>
                      <Button style={{height: 40, marginVertical: 10,}} onPress={() => { this.login(); }} title="Login" />
                    </View>
                  </View> 
                </View>

                {/* { this.state.showModal ? */}
                <View>
                  <Modal isVisible={this.state.showModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{backgroundColor: '#FFF', width: 330, height: 110, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Logging in...</Text>
                      </View>
                      
                    </View>
                  </Modal>
                </View> 
  
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
};

export default withNavigation(LoginScreen);

const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: '#FFF',
    },
    body: {
      backgroundColor: '#FFF',
      textAlignVertical: 'center'
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
      padding: 10,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: '#000',
    },
    userInput: {
      height: 40, 
      marginVertical: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'grey',
    },
    errorMsg: {
      color: '#F00',
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 5,
    },
    rememberMeSwitch: {
      flex: 1, 
      flexDirection: 'row', 
      marginVertical: 5, 
      marginHorizontal: 5,
      textAlignVertical: "center",
    },
  });