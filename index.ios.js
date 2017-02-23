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

// await 例子
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

let tools = {
  format: function (str){
    // console.warn(typeof str);
    let s = (str < 10) ? ('0'+str) : str;
    return s;
  }
}

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
      <View style={styles.timerWrap}>
        <Text style={styles.timerTxt}>{tools.format(this.state.h)}:{tools.format(this.state.m)}:{tools.format(this.state.s)}</Text>
      </View>
    );
  }
}
reactMixin.onClass(Timer, TimerMixin);

class Detail extends Component{
  render(){
    return (
      <View style={styles.detailWrap}>
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
      title: '修炼中',
      titleTextColor: '#fff',
      barTintColor: '#3b5999',
      tintColor: '#fff',
      passProps: { myProp: 'bar' ,change:this.change, time: this.props.task.time},
      leftButtonSystemIcon: 'done',
      onLeftButtonPress: ()=>{
        // 利用await方式，可以保证state更新完毕再跳转。
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
        <TouchableHighlight  
        onPress={() => this._handleNextPress(nextRoute)}>
        <View style={styles.row}>
          <Text style={styles.listItemTitle}>{task.name}</Text>
          <Text style={styles.listItem}>
            {tools.format(task.time.hour)}:{tools.format(task.time.minute)}:{tools.format(task.time.second)}
          </Text>
        </View>
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
      { name:'经济学',
        key: 2,
        time:{
          hour: 0,
          minute: 0,
          second: 0
        }
      },
      { name:'Javascript',
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
      if(!err && res){
        this.setState({tasks:JSON.parse(res)});
      }
    });
   
    
  }
  componentWillUnmount(){
    // ???什么时机触发？
    let tasks = this.state.tasks;
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
    let tasks = this.state.tasks || taskList;
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
          title: 'Life',
          titleTextColor: '#fff',
          barTintColor: '#3b5999'
        }}
        style={styles.nav}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrap:{
    height: 1000
  },
  nav: {
    flex: 1
  },
  home: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  list: {
    marginTop: 20,
    backgroundColor: '#fff'
  },
  row: {
    borderWidth: 0.5,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: '#ccc',
    paddingLeft: 0,
    paddingRight: 0,
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  listItemTitle: {
    flex: 1,
    lineHeight: 79,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  listItem: {
    flex:4,
    color: '#333',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 79,
    fontSize: 20
  },
  detailWrap: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    marginTop: 120,
    alignItems: 'center',
  },
  timerWrap: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#19b955',
    height: 200,
    width: 200,
    borderRadius: 200
  },
  timerTxt: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 160,
    textAlign: 'center',
    lineHeight: 40,
    color: '#19b955',
    fontSize: 30
  }
});

AppRegistry.registerComponent('life', () => Life);
