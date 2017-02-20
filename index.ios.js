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

class Timer extends Component{
 
  constructor(props) {
    super(props);
  
    this.state = {time: 0};
  }
  componentDidMount(){
    setInterval(() => {
      let time = this.state.time;
      this.setState({time: time+10});
    },10);
  }
  render(){
   
    return (
      <Text>{this.state.time}</Text>
    );
  }
}


class Detail extends Component{
  render(){
    return (
      <View style={{marginTop: 200, alignSelf: 'center'}}>
        <Timer />
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
      title: '详情页',
      passProps: { myProp: 'bar' }
    };
    return(
      <View>
        <TouchableHighlight  style={styles.row}  onPress={() => this._handleNextPress(nextRoute)}>
          <Text style={styles.listItem}>
            See you on the other nav {this.props.id}!
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class Home extends Component{
  

  render() {
    return(
      <View style={styles.home}>
        <Row navigator={this.props.navigator} 
        title="啊啊啊" id="1" 
        onPress={this._handleNextPress}/>
        <Row navigator={this.props.navigator} 
        title="啊啊啊" id="2" 
        onPress={this._handleNextPress}/>
        <Row navigator={this.props.navigator} 
        title="啊啊啊" id="3" 
        onPress={this._handleNextPress}/>
      </View>
    );
  }
}

export default class Life extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Home,
          title: '首页',
        }}
        style={{flex: 1}}
      />
    );
  }
}

const styles = StyleSheet.create({
  home: {
    paddingTop: 60
  },
  row: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 20,
    height: 40
  },
  listItem: {
    color: '#333',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 38,
  }
});

AppRegistry.registerComponent('life', () => Life);
