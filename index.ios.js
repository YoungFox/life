'use strict'
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  AsyncStorage,
  TouchableOpacity
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
    let s = (str < 10) ? ('0'+str) : str;
    return s;
  }
}

let globT = {};

class Timer extends Component{
 
  constructor(props) {
    super(props);
  
    this.state = {hour: 0,minute: 0,second: 0};
  }

  addTime(o){
    o.second++;
    if(o.second >= 60){
      o.second = o.second - 60;
      o.minute++
    }
    if(o.minute >= 60){
      o.minute = o.minute - 60;
      o.hour++
    }

    return o;
  }
  componentDidMount(){
    let time = this.props.time;
    let h = time.hour || 0;
    let m = time.minute || 0;
    let s = time.second || 0;
    this.setState({hour: h,minute: m,second: s});

    this.setInterval(() => {
      let timeO = this.state;
      let time = this.addTime(timeO);
      this.setState(time);
      globT = time;
    },1000);
  }
  render(){
    return (
      <View style={styles.timerWrap}>
        <Text style={styles.timerTxt}>{tools.format(this.state.hour)}:{tools.format(this.state.minute)}:{tools.format(this.state.second)}</Text>
      </View>
    );
  }
}
reactMixin.onClass(Timer, TimerMixin);

class Detail extends Component{
  render(){
    return (
      <View style={styles.detailWrap}>
        <Timer  time={this.props.time} />
      </View>
    );
  }
}

class Row extends Component{
  constructor(props) {
    super(props);
  
    this.state = {id: 1,task: null};

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

  render(){
    const nextRoute = {
      // component: Detail,
      // title: '修炼中',
      // titleTextColor: '#fff',
      // barTintColor: '#3b5999',
      // tintColor: '#fff',
      // passProps: { myProp: 'bar' ,change:this.change, time: this.props.task.time},
      // leftButtonSystemIcon: 'done',
      // onLeftButtonPress: ()=>{
      //   // 利用await方式，可以保证state更新完毕再跳转。
      //   let back = async ()=>{
      //     await this.props.upDateTime(this.props.id , this.state.task).catch(
      //       (err) => {console.warn(err)}
      //     );
      //     this._handleBackPress();
      //   };
      //   back();
      // }
      detail:{
        index: this.props.id
      },
      title: '修炼中',
      index: this.props.id +1
    };
    let task = this.props.task;
    if(task.time){
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
    }else{
      return(
        <View/>
      );
    }
    
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
 
  componentWillUnmount(){
    // ???什么时机触发？
    // let tasks = this.state.tasks;
  }
  
  render() {
    let tasks = this.props.tasks || taskList;
    return(
      <View style={styles.home}>
        {
          tasks.map((v ,k) => {
            return (
            // <View/>
            <Row navigator={this.props.navigator} 
            id = {k}
            key= {k} 
            upDateTime = {this.props.upDateTime}
            task = {v}
            />
            );
          })
        }
      </View>
    );
  }
}

// export default class Life extends Component {
//   render() {
//     return (
//       <NavigatorIOS
//         initialRoute={{
//           component: Home,
//           title: 'Life',
//           titleTextColor: '#fff',
//           barTintColor: '#3b5999'
//         }}
//         style={styles.nav}
//       />
//     );
//   }
// }
export default class Life extends Component {
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

  _handleBackPress(navigator) {
    navigator.pop();
  }
  upDateTime(index, value){
    console.warn(index);
    // console.warn(JSON.stringify(value));
    return new Promise((resolve, reject) => {
      let tasks = this.state.tasks;
      tasks[index].time = value;
      AsyncStorage.setItem(storageId, JSON.stringify(tasks), () => {
        // console.warn(JSON.stringify(tasks));
        this.setState({tasks: tasks},()=>{
          resolve();
        });
      });
    });
    
    // alert(JSON.stringify(tasks));
  }
  
  goHome(id,value,navigator){
    // 利用await方式，可以保证state更新完毕再跳转。
    let back = async ()=>{
      await this.upDateTime(id, value).catch(
        (err) => {
          console.warn(err)
        }
      );
      this._handleBackPress(navigator);
    };
    back();
  }

  render() {
    const routes = [
      {home:{},title:'首页',index:0}
    ];

    return (
      <Navigator
        ref={()=>{this.navigator = Navigator}}
        initialRoute={routes[0]}
        renderScene={(route, navigator) =>{
          if(route.home){
            return(
              <Home navigator={navigator} upDateTime={this.upDateTime} tasks={this.state.tasks}/>
            )
          }
          if(route.detail){
            let id = route.detail.index;
            return(
              <Detail time={this.state.tasks[id].time} 
              />
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
                  if (route.home) {
                    return null;
                  } else {
                  var previousRoute = navState.routeStack[index - 1];
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.goHome(route.detail.index,globT,navigator);
                        }}
                        style={styles.navBarLeftButton}>
                        <Text style={[styles.navBarText, styles.navBarButtonText]}>
                          {previousRoute.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                },
                RightButton: (route, navigator, index, navState) =>
                { return (<Text></Text>); },
                  Title: (route, navigator, index, navState) =>
                {
                if (route.home) { 
                  return (<Text style={{color: '#fff'}}>Life</Text>); 
                }else{
                  return (<Text style={{color: '#fff'}}>修炼中</Text>) 
                }
              }
             }}
             style={{backgroundColor: '#3b5999'}}
           />
        }

        configureScene={(route, routeStack) =>
          Navigator.SceneConfigs.FloatFromBottom}
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
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },

});

AppRegistry.registerComponent('life', () => Life);
