'use strict'
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

// console.warn(Promise);

// var sleep = function (time) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve();
//         }, time);
//     })
// };

// var start = async function () {
//     // 在这里使用起来就像同步代码那样直观
//     console.warn('start');
//     await sleep(3000);
//     console.warn('end');
// };

// start();

// 用来解决timmer在组件卸载后仍然运行的问题
import TimerMixin from 'react-timer-mixin';
let reactMixin = require('react-mixin');
const storageId = 'myList';

class Timer extends Component{
 
  constructor(props) {
    super(props);
  
    this.state = {h: 0,m: 0,s: 0};
  }

  addTime(o){
    o.s++;
    if(o.s >= 60){
      o.s = o.s - 60;
      o.m++
    }
    if(o.m >= 60){
      o.m = o.m - 60;
      o.h++
    }

    return o;
  }
  componentDidMount(){
    let time = this.props.time;
    this.setState({h: time.hour,m: time.minute,s: time.second});

    this.setInterval(() => {
      let timeO = this.state;
      let time = this.addTime(timeO);
      this.setState(time);
      this.props.change(time);
    },1000);
  }
  render(){
    return (
      <Text>{this.state.h}:{this.state.m}:{this.state.s}</Text>
    );
  }
}
reactMixin.onClass(Timer, TimerMixin);

class Detail extends Component{
  render(){
    
    return (
      <View style={{marginTop: 200, alignSelf: 'center'}}>
      <Text>{this.props.myProp}</Text>
        <Timer change={this.props.change} time={this.props.time}/>
      </View>
    );
  }
}

class Row extends Component{
  constructor(props) {
    super(props);
  
    this.state = {id: 1,task: null};

    this.change = this.change.bind(this);
  }

   _handleBackPress() {
    this.props.navigator.pop();
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
  }
  
  componentDidMount(){
    this.setState({
      id: this.props.id,
      task: this.props.task
    }
    );
    
  }

  change(v){
    let task = this.state.task;
    task.time.hour = v.h;
    task.time.minute = v.m;
    task.time.second = v.s;
    this.setState(task);
  }

  render(){
    const nextRoute = {
      component: Detail,
      title: '详情页',
      passProps: { myProp: 'bar' ,change:this.change, time: this.props.task.time},
      leftButtonSystemIcon: 'add',
      onLeftButtonPress: ()=>{
        // alert(JSON.stringify(this.state.task));
        let back = async ()=>{
          await this.props.upDateTime(this.props.id , this.state.task).catch(
            (err) => {console.warn(err)}
          );
          this._handleBackPress();
        };
        back();
      }
    };
    let task = this.props.task;
    return(
      <View style={styles.list}>
        <Text>{task.name}</Text>
        <TouchableHighlight  style={styles.row} 
        onPress={() => this._handleNextPress(nextRoute)}>
          <Text style={styles.listItem}>
            {task.time.hour}:{task.time.minute}:{task.time.second}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

reactMixin.onClass(Row, TimerMixin);

let taskList = {tasks:[
      { name:'单词',
        key: 1,
        time:{
          hour: 0,
          minute: 0,
          second: 0
        }
      },
      { name:'健身',
        key: 2,
        time:{
          hour: 0,
          minute: 0,
          second: 0
        }
      },
      { name:'数学',
        key: 3,
        time:{
          hour: 0,
          minute: 0,
          second: 0
        }
      }
    ]};

class Home extends Component{
  constructor(props) {
    super(props);
  
    this.state = taskList;

    this.upDateTime = this.upDateTime.bind(this);
  }
  componentDidMount(){
    AsyncStorage.getItem(storageId,(err ,res)=>{
      if(!err){
        this.setState({tasks:JSON.parse(res)});
      }
    });
   
   // var aa = await AsyncStorage.getItem(storageId);
    
  }
  componentWillUnmount(){
    let tasks = this.state.tasks;
    // AsyncStorage.setItem(storageId, JSON.stringify(tasks));
  }
  upDateTime(index, value){
    return new Promise((resolve, reject) => {
      let tasks = this.state.tasks;
      tasks[index] = value;
      AsyncStorage.setItem(storageId, JSON.stringify(tasks), () => {
        // console.warn(JSON.stringify(tasks));
        this.setState({tasks: tasks},()=>{
          resolve();
        });
      });
    });
    
    // alert(JSON.stringify(tasks));
  }
  render() {
    let tasks = this.state.tasks;
    return(
      <View style={styles.home}>
        {
          tasks.map((v ,k) => {
            return (<Row navigator={this.props.navigator} 
            id = {k}
            key= {k} 
            upDateTime = {this.upDateTime}
            onPress={this._handleNextPress}
            task = {v}
            />);
          })
        }
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
  list: {
    margin: 20
  },
  row: {
    borderWidth: 1,
    borderColor: '#ccc',
    
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
