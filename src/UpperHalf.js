/**
 * Created by Dat Tran on 4/13/17.
 */
import React, {Component} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Ionicons';
import {LOCAL_VIDEO_PATH, STREAM_PATH, DOWNLOAD_FILE_PATH, DownloadStatus} from './constants'
import {checkFileExist, playVideo} from './actions/app'
const {width} = Dimensions.get('window');

class UpperHalf extends Component {

  constructor() {
    super()
  }

  render() {
    const {
      isPlaying, fileExist,
      onPlayVideo
    } = this.props

    const path = fileExist ? LOCAL_VIDEO_PATH : STREAM_PATH
    console.log('UpperHalf render', path)

    return <View style={styles.videoContainer}>
      <Video
        source={{uri: path}}
        ref={ref => this.player = ref}
        rate={1.0}
        volume={1.0}
        muted={false}
        paused={!isPlaying}
        onLoadStart={vid => {
          console.log('load start', vid)
        }}
        onLoad={vid => {
          console.log('on load', vid)
        }}
        resizeMode="contain"
        repeat={false}
        progressUpdateInterval={250.0}
        style={styles.video}
      />
      {!isPlaying && <View style={[styles.video, {
        backgroundColor: 'black',
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center'
      }]}>
        <TouchableOpacity onPress={() => {
          onPlayVideo()
        }}>
          <Icon name="ios-play-outline" size={80} color="#4F8EF7"/>
        </TouchableOpacity>
      </View>}
    </View>
  }
}

export default connect(store => {
  return {
    isPlaying: store.appReducer.isPlaying,
    fileExist: store.appReducer.fileExist
  }
}, dispatch => {
  return {
    onPlayVideo: () => dispatch(playVideo())
  }
})(UpperHalf)

const styles = StyleSheet.create({
  videoContainer: {
    width: width,
    height: 300
  },
  video: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});