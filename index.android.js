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
const DOWNLOAD_FILE_PATH = 'https://spout-output.s3.amazonaws.com/b555cc518a1b17b1/720p-rendering.mp4'
const STREAM_PATH = 'https://s3-ap-southeast-1.amazonaws.com/spout-output/b555cc518a1b17b1/720p-rendering.m3u8'

const DownloadStatus = {
  COMPLETE: 0,
  DOWNLOADING: 1,
  NONE: 2
}

function checkFileExist(complete) {
  RNFetchBlob.fs.exists(LOCAL_VIDEO_PATH)
    .then((exist) => {
      console.log('file exist', exist)
      complete(exist)
    })
    .catch(() => {
      alert('something went wrong')
    })
}

class LowerHalf extends Component {

  constructor() {
    super()
    this.progressBar = new Animated.Value(0)

    this.state = {
      fileExist: false
    }
  }

  componentDidMount() {
    checkFileExist(existed => {
      this.setState({fileExist: existed})
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
      .fetch('GET', DOWNLOAD_FILE_PATH, {
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
        this.downloadStatus = DownloadStatus.COMPLETE
        this.setState({fileExist: true})
      })
  }

  deleteFile(complete) {
    RNFetchBlob.fs.unlink(LOCAL_VIDEO_PATH)
      .then(() => {
        complete && complete()
      })
      .catch((err) => console.log('something went wrong', err))
  }

  render() {
    const {fileExist} = this.state

    return <View style={{flex: 1}}>
      <TouchableOpacity
        style={{alignItems: 'center', marginVertical: 8}}
        onPress={() => {
          if (this.downloadStatus !== DownloadStatus.DOWNLOADING) {
            this.downloadStatus = DownloadStatus.DOWNLOADING
            this.downloadVideo()
          }
          else
            alert('Downloading')
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
      {fileExist &&
      <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginHorizontal: 16}}>{'720-rendering.mp4'}</Text>
        <TouchableOpacity onPress={() => {
          this.deleteFile(() => {
            this.downloadStatus = DownloadStatus.NONE
            this.setState({fileExist: false})
            this.setState({reload: true})
          })
        }}>
          <Icon name="md-close" size={30} color="#4F8EF7"/>
        </TouchableOpacity>
      </View>}
    </View>
  }
}

class UpperHalf extends Component {

  constructor() {
    super()
    this.state = {
      isPlaying: false,
    }
  }

  componentDidMount() {
    checkFileExist(existed => {
      this.setState({fileExist: existed})
    })
  }

  render() {

    const {isPlaying, fileExist} = this.state
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
          this.setState({isPlaying: true})
        }}>
          <Icon name="ios-play-outline" size={80} color="#4F8EF7"/>
        </TouchableOpacity>
      </View>}
    </View>
  }
}

export default class StreamVideo extends Component {

  render() {
    return (
      <View style={styles.container}>
        <UpperHalf />
        <LowerHalf />
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
