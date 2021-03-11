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
    ActivityIndicator
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
      showLoadingModal: false,
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

    this.state.showLoadingModal = true;
    this.forceUpdate();

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
    //fetch('http://192.168.20.7:3000/user-login', data) // https://emad-cits5206-2.herokuapp.com/user-login
    fetch('https://emad-uwa5206.herokuapp.com/user-login', data) // https://emad-cits5206-2.herokuapp.com/user-login
      .then((response) => response.json())
        .then((responseJson) => {

          // ============= on success ============== //
          this.state.showLoadingModal = false;
          this.forceUpdate();

          // Go to next screen with data
          console.log(responseJson);
          this.props.navigation.push('Survey', {serverData: responseJson, username: this.state.username, password: this.state.password});
          this.forceUpdate();

        }).catch((error) => {
        // ============= on failure ============== //
        this.state.error = true;
        this.state.showLoadingModal = false;
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
            <View style={{display: 'flex', flexDirection: 'column', justifyContent:'space-between', alignItems: 'center'}}>
              <Image source={{uri: 'https://www.courseseeker.edu.au/assets/images/institutions/1055.png'}} style={styles.logo} resizeMode="contain" />
              <View style={styles.sectionContainer}>
                <Text style={styles.inputTitle}>Username</Text>
                <TextInput
                  style={styles.userInput}
                  placeholder="Enter username here" 
                  onChangeText={(value) => { this.state.username = value; }} defaultValue={this.state.username}/>
                <Text style={styles.inputTitle}>Password </Text>
                <TextInput
                  style={styles.userInput}
                  secureTextEntry={true}
                  placeholder="Enter password here" onChangeText={(value) => { this.state.password = value; }} defaultValue={this.state.password}/>
                  {this.state.error? <Text style={styles.errorMsg}>Incorrect username or password.</Text> : null}
                <View style={styles.rememberMeSwitch}>
                  <Switch onValueChange={(value) => { this.state.rememberCredentials = value; this.forceUpdate(); }} value={this.state.rememberCredentials}/>
                  <Text style={styles.switchText}>Remember me</Text>
                </View>
                <View style={styles.loginBtn}>
                  <Button onPress={() => { this.login(); }} title="Login" />
                </View>
              </View>

              <View>
                <Modal isVisible={this.state.showLoadingModal}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <View style={{backgroundColor: '#FFF', width: 330, height: 130, justifyContent: 'center', alignItems: 'center', }}>
                      <ActivityIndicator size="large" color="#00ff00" />
                      <Text style={{marginTop: 10, color: '#333'}}>Logging in...</Text>
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
    sectionContainer: {
      paddingHorizontal: 24,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    logo: {
      width: '80%', 
      height: 110,  
      marginVertical: 50,
    },
    inputTitle: {
      fontSize: 16,
      color: '#666',
      fontWeight: '300'
    },
    userInput: {
      fontWeight: "300",
      fontSize: 16,
      padding: 8,
      marginBottom: 15,
      marginTop: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#CCC',
      flexBasis: '100%',
      borderRadius: 3,
    },
    errorMsg: {
      color: '#F00',
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 5,
    },
    rememberMeSwitch: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    }, 
    switchText: {
      color: '#666',
      marginHorizontal: 5,
      fontSize: 14,
    },
    loginBtn: {
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#007AFF',
      borderRadius: 3,
    },
  });