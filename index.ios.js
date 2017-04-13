/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated, Easing
} from 'react-native';
import Video from 'react-native-video'
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const LOCAL_VIDEO_PATH = RNFetchBlob.fs.dirs.DocumentDir + '/myVideo.mp4'
const REMOTE_FILE_PATH = 'https://spout-output.s3.amazonaws.com/b555cc518a1b17b1/720p-rendering.mp4'
const STREAM_PATH = 'https://s3-ap-southeast-1.amazonaws.com/spout-output/b555cc518a1b17b1/720p-rendering.m3u8'

export default class StreamVideo extends Component {

  constructor() {
    super()
    this.progressBar = new Animated.Value(0)
    this.state = {
      videoPath: STREAM_PATH,
      isPlaying: false
    }
  }

  componentDidMount() {
    this.checkFileExist(existed => {
      console.log('file ', existed)
      this.setState({videoPath: existed ? LOCAL_VIDEO_PATH : STREAM_PATH})
    })
  }

  downloadVideo() {
    console.log('start download file')
    RNFetchBlob
      .config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        path: LOCAL_VIDEO_PATH
      })
      .fetch('GET', REMOTE_FILE_PATH, {
        //some headers ..
      })
      .progress((received, total) => {
        console.log('progress', received / total)
        Animated.timing(this.progressBar, {
          easing: Easing.inOut(Easing.ease),
          duration: 100,
          toValue: received / total
        }).start()

      })
      .then((res) => {
        // the temp file path
        console.log('The file saved to ', res.path())
        this.setState({videoPath: LOCAL_VIDEO_PATH})
      })
  }

  checkFileExist(complete) {
    RNFetchBlob.fs.exists(LOCAL_VIDEO_PATH)
      .then((exist) => {
        complete(exist)
      })
      .catch(() => {
        alert('something went wrong')
      })
  }

  deleteFile(complete) {
    RNFetchBlob.fs.unlink(LOCAL_VIDEO_PATH)
      .then(() => {
        complete()
      })
      .catch((err) => alert('something went wrong'))
  }

  render() {
    const {videoPath, isPlaying} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            source={{uri: videoPath}}
            ref={ref => this.player = ref}
            rate={1.0}                     // 0 is paused, 1 is normal.
            volume={1.0}                   // 0 is muted, 1 is normal.
            muted={false}                  // Mutes the audio entirely.
            paused={!isPlaying}                 // Pauses playback entirely.
            onLoadStart={vid => {
              console.log('load start', vid)
            }}            // Callback when video starts to load
            onLoad={vid => {
              console.log('on load', vid)
            }}
            onProgress={(progress) => {
              console.log(progress)
            }}
            resizeMode="contain"             // Fill the whole screen at aspect ratio.
            repeat={false}                  // Repeat forever.
            playWhenInactive={false}       // [iOS] Video continues to play when control or notification center are shown.
            progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
            style={styles.video}
          />
          {!isPlaying && <View style={[styles.video, {
            backgroundColor: 'black',
            opacity: 0.6,
            justifyContent: 'center',
            alignItems: 'center'
          }]}>
            <TouchableOpacity onPress={() => {
              this.setState({isPlaying: true})
            }}>
              <Icon name="ios-play-outline" size={80} color="#4F8EF7"/>
            </TouchableOpacity>
          </View>}
        </View>

        <TouchableOpacity
          style={{alignItems: 'center', marginVertical: 8}}
          onPress={() => {
            if (videoPath === STREAM_PATH)
              this.downloadVideo()
            else
              alert('video already exist')
          }}>
          <View style={{
            width: 100,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#46895f'
          }}>
            <Text>Download</Text>
          </View>
        </TouchableOpacity>
        <View style={{
          width: '100%',
          height: 10,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: 'gray'
        }}>
          <Animated.View style={{
            backgroundColor: 'blue', height: 10, width: this.progressBar.interpolate({
              inputRange: [0, 1],
              outputRange: [0, width],
              extrapolate: 'clamp'
            })
          }}/>
        </View>
        {this.state.videoPath === LOCAL_VIDEO_PATH &&
        <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{marginHorizontal: 16}}>{'720-rendering.mp4'}</Text>
          <TouchableOpacity onPress={() => {
            this.deleteFile(() => this.setState({videoPath: STREAM_PATH}))
          }}>
            <Icon name="md-close" size={30} color="#4F8EF7"/>
          </TouchableOpacity>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,

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

AppRegistry.registerComponent('StreamVideo', () => StreamVideo);
