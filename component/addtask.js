
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Navigator,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity
} = ReactNative;

var _getRandomRoute = function() {
  return {
    title: '#' + Math.ceil(Math.random() * 1000),
  };
};

class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

class BreadcrumbNavSample extends React.Component {
  componentWillMount() {
    this._navBarRouteMapper = {
      rightContentForRoute: function(route, navigator) {
        return null;
      },
      titleContentForRoute: function(route, navigator) {
        return (
          <TouchableOpacity
            onPress={() => navigator.push(_getRandomRoute())}>
            <Text style={styles.titleText}>{route.title}</Text>
          </TouchableOpacity>
        );
      },
      iconForRoute: function(route, navigator) {
        return (
          <TouchableOpacity
            onPress={() => { navigator.popToRoute(route); }}
            style={styles.crumbIconPlaceholder}
          />
        );
      },
      separatorForRoute: function(route, navigator) {
        return (
          <TouchableOpacity
            onPress={navigator.pop}
            style={styles.crumbSeparatorPlaceholder}
          />
        );
      }
    };
  }

  _renderScene = (route, navigator) => {
    return (
      <ScrollView style={styles.scene}>
        <NavButton
          onPress={() => { navigator.push(_getRandomRoute()); }}
          text="Push"
        />
        <NavButton
          onPress={() => { navigator.immediatelyResetRouteStack([_getRandomRoute(), _getRandomRoute()]); }}
          text="Reset w/ 2 scenes"
        />
        <NavButton
          onPress={() => { navigator.popToTop(); }}
          text="Pop to top"
        />
        <NavButton
          onPress={() => { navigator.replace(_getRandomRoute()); }}
          text="Replace"
        />
        <NavButton
          onPress={() => { this.props.navigator.pop(); }}
          text="Close breadcrumb example"
        />
      </ScrollView>
    );
  };

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={_getRandomRoute()}
        renderScene={this._renderScene}
        navigationBar={
          <Navigator.BreadcrumbNavigationBar
            routeMapper={this._navBarRouteMapper}
          />
        }
      />
    );
  }
}

var styles = StyleSheet.create({
 
});

module.exports = BreadcrumbNavSample;
