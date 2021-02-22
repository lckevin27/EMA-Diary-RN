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
    Dimensions,
    Switch,
    ActivityIndicator
  } from 'react-native';
var PushNotification = require("react-native-push-notification");
import {  Divider, Button, Slider } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import RNRestart from 'react-native-restart'; 
import Modal from 'react-native-modal';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

class SurveyScreen extends React.Component {
    constructor(props) {
      super(props);

      const { navigation } = this.props;

      this.state = SurveyScreenShared.getInitialState(false);
      let serverData = navigation.getParam('serverData', 'Unable to find server data.');

      if (!SurveyScreenShared.CheckServerData(this, serverData)) {
        return;
      }

      this.state.SurveyId = serverData.sId;
      this.state.SurveyQuestions = SurveyScreenShared.convertServerDataToSurvey(this, serverData.question);
      this.state.Username = navigation.getParam('username', 'Unable to find user data');
      this.state.Password = navigation.getParam('password', 'Unable to find user data');
      console.log("========================= USERNAME: " + this.state.Username);
    }

    componentDidMount() {
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function(token) {
          console.log("TOKEN:", token);
        },
        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
          RNRestart.Restart();
          //this.props.navigation.push('Survey', {serverData: responseJson, username: this.state.username, password: this.state.password});
          //console.log("NOTIFICATION:", notification);
        },
        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,
        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         */
        //requestPermissions: true,
        requestPermissions: Platform.OS === 'ios',
      });

      // Expo push notifications
      const registerForPushNotifications = async () => { 
        try {
           const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
           if (!permission.granted) return;
           const token = await Notifications.getExpoPushTokenAsync();
        console.log(token);
        } catch (error) {
          console.log('Error getting a token', error);
        }
      }

      // const AppNavigator = () => {
      //   useEffect(() => {
      //     registerForPushNotifications();
      //   }, [])

      SurveyScreenShared.loadNextQuestion(this, this.state);
    }

    sendNotification(context, seconds) {
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        message: "A survey is ready to be taken!", // (required)
        date: new Date(Date.now() + seconds * 1000) // in 60 secs
      });
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
    
                  <View style={{ height: 50, }}></View>
                  <View style={styles.body}>
                  {this.state.ShowAlternateQuestion ? <Text style={styles.sectionTitle}>{this.state.CurrentQuestionText}</Text> : null}

                  {this.state.IsCheckboxQuestion? 
                      <View style={{flex: 1, flexDirection: 'column', justifyContent:'center'}}>
                        {this.state.ShowCheckboxes[0] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 0, value)}} value={this.state.Checkboxes[0].checked}/><Text>{this.state.CheckboxText[0]}</Text></View> : null }
                        {this.state.ShowCheckboxes[1] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 1, value)}} value={this.state.Checkboxes[1].checked}/><Text>{this.state.CheckboxText[1]}</Text></View> : null }
                        {this.state.ShowCheckboxes[2] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 2, value)}} value={this.state.Checkboxes[2].checked}/><Text>{this.state.CheckboxText[2]}</Text></View> : null }
                        {this.state.ShowCheckboxes[3] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 3, value)}} value={this.state.Checkboxes[3].checked}/><Text>{this.state.CheckboxText[3]}</Text></View> : null }
                        {this.state.ShowCheckboxes[4] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 4, value)}} value={this.state.Checkboxes[4].checked}/><Text>{this.state.CheckboxText[4]}</Text></View> : null }
                        {this.state.ShowCheckboxes[5] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 5, value)}} value={this.state.Checkboxes[5].checked}/><Text>{this.state.CheckboxText[5]}</Text></View> : null }
                        {this.state.ShowCheckboxes[6] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 6, value)}} value={this.state.Checkboxes[6].checked}/><Text>{this.state.CheckboxText[6]}</Text></View> : null }
                        {this.state.ShowCheckboxes[7] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 7, value)}} value={this.state.Checkboxes[7].checked}/><Text>{this.state.CheckboxText[7]}</Text></View> : null }
                        {this.state.ShowCheckboxes[8] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 8, value)}} value={this.state.Checkboxes[8].checked}/><Text>{this.state.CheckboxText[8]}</Text></View> : null }
                        {this.state.ShowCheckboxes[9] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 9, value)}} value={this.state.Checkboxes[9].checked}/><Text>{this.state.CheckboxText[9]}</Text></View> : null }
                        {this.state.ShowCheckboxes[10] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 10, value)}} value={this.state.Checkboxes[10].checked}/><Text>{this.state.CheckboxText[10]}</Text></View> : null }
                        {this.state.ShowCheckboxes[11] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 11, value)}} value={this.state.Checkboxes[11].checked}/><Text>{this.state.CheckboxText[11]}</Text></View> : null }
                        {this.state.ShowCheckboxes[12] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 12, value)}} value={this.state.Checkboxes[12].checked}/><Text>{this.state.CheckboxText[12]}</Text></View> : null }
                        {this.state.ShowCheckboxes[13] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 13, value)}} value={this.state.Checkboxes[13].checked}/><Text>{this.state.CheckboxText[13]}</Text></View> : null }
                        {this.state.ShowCheckboxes[14] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 14, value)}} value={this.state.Checkboxes[14].checked}/><Text>{this.state.CheckboxText[14]}</Text></View> : null }
                        {this.state.ShowCheckboxes[15] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 15, value)}} value={this.state.Checkboxes[15].checked}/><Text>{this.state.CheckboxText[15]}</Text></View> : null }
                        {this.state.ShowCheckboxes[16] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 16, value)}} value={this.state.Checkboxes[16].checked}/><Text>{this.state.CheckboxText[16]}</Text></View> : null }
                        {this.state.ShowCheckboxes[17] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 17, value)}} value={this.state.Checkboxes[17].checked}/><Text>{this.state.CheckboxText[17]}</Text></View> : null }
                        {this.state.ShowCheckboxes[18] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 18, value)}} value={this.state.Checkboxes[18].checked}/><Text>{this.state.CheckboxText[18]}</Text></View> : null }
                        {this.state.ShowCheckboxes[19] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 19, value)}} value={this.state.Checkboxes[19].checked}/><Text>{this.state.CheckboxText[19]}</Text></View> : null }
                        
                      </View> : null
                    }

                  {this.state.ShowSlider ? 
                    <View style={{marginHorizontal: 20, marginVertical: 5}}>
                      <Slider 
                        value={this.state.sliderValue}
                        onValueChange={(value) => { SurveyScreenShared.updateSlider(this, value); }}
                        minimumValue={this.state.sliderMinValue}
                        maximumValue={this.state.sliderMaxValue}
                        step={this.state.sliderStepValue}/>
                      <Text>{this.state.sliderText}</Text>
                    </View> : null 
                  }

                  {this.state.ShowCatSlider ? 
                    <View>
                      <Text style={{marginLeft: "9%"}}>{"Value: " + this.state.CatAnswers[this.state.catValue]}</Text> 
                      <View style={styles.container}>
                        <Slider
                            style={{ width: 300}}
                            step={1}
                            minimumValue={this.state.catMinValue}
                            maximumValue={this.state.catMaxValue}
                            value={this.state.catValue}
                            onValueChange={val => {SurveyScreenShared.updateCatSlider(this, val); }}
                            thumbTintColor='rgb(252, 228, 149)'
                            maximumTrackTintColor='#d3d3d3' 
                            minimumTrackTintColor='rgb(252, 228, 149)'
                        />

                        <View style={styles.textCon}>
                            <Text style={styles.colorGrey} numberOfLines={1}>{SurveyScreenShared.GetCatSliderOption(this, 0)}</Text>
                            <Text style={styles.colorGrey} numberOfLines={1}>{SurveyScreenShared.GetCatSliderOption(this, Math.ceil(this.state.CatAnswers.length / 2) - 1)}</Text>
                            {this.state.CatAnswers.length % 2 == 0 ? <Text style={styles.colorGrey} numberOfLines={1}>{SurveyScreenShared.GetCatSliderOption(this, Math.ceil(this.state.CatAnswers.length / 2))}</Text> : null}
                            <Text style={styles.colorGrey} numberOfLines={1}>{SurveyScreenShared.GetCatSliderOption(this, this.state.CatAnswers.length - 1)}</Text>
                        </View>
                      </View> 
                      
                    </View>: null
                  }

                  <View>
                    <Modal isVisible={this.state.showLoadingModal}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{backgroundColor: '#FFF', width: 330, height: 110, justifyContent: 'center', alignItems: 'center' }}>
                          <ActivityIndicator size="large" color="#00ff00" />
                          <Text>Loading...</Text>
                        </View>
                      </View>
                    </Modal>
                  </View> 

                    {this.state.ViewArray.map(info => info)}
                  </View>
                  <View style={{ height: 50, }}></View>
    
              </View>
            </ScrollView>
          </SafeAreaView>
        </Fragment>
      );
    }
};

export default SurveyScreen;

const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: '#FFF',
    },
    body: {
      backgroundColor: '#FFF',
      textAlignVertical: 'center'
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#000',
      marginBottom: 15,
      marginHorizontal: 20,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: '#444',
    },
    checkboxStyle: {
      flex: 1, 
      flexDirection: 'row', 
      marginVertical: 5, 
      marginHorizontal: 20
    },

    container: {
      //flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    textCon: {
        width: 320,
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'justify',
        alignItems: 'flex-end',
        marginTop: 20,
        marginBottom: 8
    },
    colorGrey: {
        color: '#d3d3d3',
        //transform: [{ rotate: '-45deg'}],
        transform: [{ rotate: '-90deg'}],
        overflow: 'hidden',
        width: 82,
        //margin: 5

        
        
        //marginBottom: 35
    },
    colorYellow: {
        color: 'rgb(252, 228, 149)',
        transform: [{ rotate: '-90deg'}]
    }
  });