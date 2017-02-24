# life

#determine to building a rn app





```

/**
 * Navigator
 */

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
  Navigator,
  TouchableHighlight
} from 'react-native';

class Timmer extends Component{
  constructor(props) {
    super(props);
    this.abs = 0;
    this.state = {};
    
  }

  componentDidMount(){
    setInterval(() => {
      this.abs = this.abs+1;
      // console.warn(this.abs);
    },10);
  }

  render(){

    return(
      <TouchableHighlight onPress={() => this.props.onPress(this.props.nav, this.abs)}>
        <Text>Back</Text>
      </TouchableHighlight>
    );
  }
}

export default class NavAllDay extends Component {
  constructor(props) {
    super(props);
  
    this.state = {a:0};
    this.change = this.change.bind(this);
  }

  change(nav,a){
    console.warn(a);
    this.setState({a:a},()=>nav.pop());
  }
  render() {
    const routes = [
      {title: 'First Scene', index: 0},
      {title: 'Second Scene', index: 1},
    ];
    return (
      <Navigator
        initialRoute={routes[0]}
        renderScene={(route, navigator) =>{
          if(route.index === 0){
            return(
             <TouchableHighlight onPress={() => {
              if (route.index === 0) {
                navigator.push(routes[1]);
              } else {
                navigator.pop();
              }
            }}>
           
            <View>
              
              <Text>Hello {route.title}!
                            {this.state.a}
              </Text>
            </View>
            </TouchableHighlight>
            )
          }else{
            return(
             <TouchableHighlight onPress={() => {
              if (route.index === 0) {
                navigator.push(routes[1]);
              } else {
                navigator.pop();
              }
            }}>
           
            <View>
              
              <Timmer nav={navigator} onPress={this.change} />
               
              <Text>Hello {route.title}!
                            {this.state.a}
              </Text>
            </View>
            </TouchableHighlight>
            )
          }
         
        }}
        onDidFocus={(route,navigator)=>{
          // console.warn(route.index);
        }}
        navigationBar={
           <Navigator.NavigationBar
             routeMapper={{
               LeftButton: (route, navigator, index, navState) =>
                {
                  if (route.index === 0) {
                    return null;
                  } else {
                    return (
                      <View />
                      // <Timmer nav={navigator} onPress={this.change}>
                      // </Timmer>
                    );
                  }
                },
               RightButton: (route, navigator, index, navState) =>
                 { return (<Text>Done</Text>); },
               Title: (route, navigator, index, navState) =>
                 { return (<Text>Awesome Nav Bar</Text>); },
             }}
             style={{backgroundColor: 'gray'}}
           />
        }
        style={{padding: 100}}

        configureScene={(route, routeStack) =>
          Navigator.SceneConfigs.FloatFromBottom}
      />
    );
  }
}

AppRegistry.registerComponent('life', () => NavAllDay);


```