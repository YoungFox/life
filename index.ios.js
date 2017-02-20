/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight
} from 'react-native';

class Detail extends Component{
  render(){
    return (
      <View style={{marginTop: 200, alignSelf: 'center'}}>
        <Text>
        详情啊啊啊
        </Text>
      </View>
    );
  }
}

class Row extends Component{

   _handleBackPress() {
    this.props.navigator.pop();
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
  }
  
  render(){
    const nextRoute = {
      component: Detail,
      title: '后退',
      passProps: { myProp: 'bar' }
    };
    return(
      <View style={styles.row}>
        <TouchableHighlight  onPress={() => this._handleNextPress(nextRoute)}>
          <Text style={{marginTop: 200, alignSelf: 'center'}}>
            See you on the other nav {this.props.id}!
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class Home extends Component{
  

  render() {
    return(<Row navigator={this.props.navigator} title="啊啊啊" id="1" onPress={this._handleNextPress}/>
          );
  }
}

export default class Life extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Home,
          title: 'My Initial Scene',
        }}
        style={{flex: 1}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  row: {
    backgroundColor: 'red',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  }
});

AppRegistry.registerComponent('life', () => Life);
