# life


目前思路是在底层Timer中定时走秒，并且更新Row中的state

因为Row中onLeftButtonPress不好控制，但是它在触发时能读到当前的state

此时，再更新Life组件的state，从而实现了计时页与首页时间同步的功能

jsx es6高亮用bable


```
npm install

react-native run-ios
```
#determine to building a rn app

```
/dev/test/AwesomeProject/node_modules/react-native/packager
```

```
真机调试时候报错
Failed to create provisioning profile. The app ID "com.facebook.react.uiapp" cannot be registered to your development team. Change your bundle identifier to a unique string to try again.
解决方案仔细看英文啊！！
```

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