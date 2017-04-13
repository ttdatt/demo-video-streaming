/**
 * Created by Dat Tran on 4/13/17.
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View, Text,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux'
import {onLoadingApp} from './src/actions/app'
import {Provider} from 'react-redux'
import {LOCAL_VIDEO_PATH, STREAM_PATH, DOWNLOAD_FILE_PATH, DownloadStatus} from './src/constants'
import UpperHalf from './src/UpperHalf'
import LowerHalf from './src/LowerHalf'
import store from './src/redux/store'
const {width} = Dimensions.get('window');

class App extends Component {

  componentWillMount() {
    this.props.onLoadingApp()
  }

  render() {
    const {showApp} = this.props

    return <View  style={styles.container}>
      {
        showApp ? <View style={{flex: 1}}>
          <UpperHalf />
          <LowerHalf />
        </View> :
          <View><Text>Loading</Text></View>
      }
    </View>
  }
}

const ConnectedApp = connect(state => ({
  showApp: state.appReducer.showApp
}), dispatch => ({
  onLoadingApp: () => dispatch(onLoadingApp())
}))(App)

export default function provider() {
  return <Provider store={store}>
    <ConnectedApp/>
  </Provider>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,

    backgroundColor: '#F5FCFF',
  }
});