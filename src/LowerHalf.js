/**
 * Created by Dat Tran on 4/13/17.
 */
import React, {Component} from 'react';
import {
  Dimensions,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated, Easing
} from 'react-native';
import {connect} from 'react-redux'
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/Ionicons';
import {LOCAL_VIDEO_PATH, STREAM_PATH, DOWNLOAD_FILE_PATH, DownloadStatus} from './constants'
import {checkFileExist, downloadVideo, deleteFile} from './actions/app'

const {width} = Dimensions.get('window');

class LowerHalf extends Component {

  constructor() {
    super()
    this.progressBar = new Animated.Value(0)
  }

  shouldComponentUpdate(nextProps) {
    Animated.timing(this.progressBar, {
      easing: Easing.inOut(Easing.ease),
      duration: 0,
      toValue: nextProps.progress
    }).start()

    return (this.props.fileExist !== nextProps.fileExist) || (this.props.downloadStatus !== nextProps.downloadStatus)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.progress === 1)
      this.progressBar = new Animated.Value(0)
  }

  render() {
    const {
      fileExist,
      downloadStatus,
      onDownloadVideo,
      onDeleteFile
    } = this.props
    console.log('downloadStatus', downloadStatus)
    return <View style={{flex: 1}}>
      <TouchableOpacity
        style={{alignItems: 'center', marginVertical: 8}}
        onPress={() => {
          if (downloadStatus !== DownloadStatus.DOWNLOADING) {
            onDownloadVideo()
          }
          else
            alert('Downloading')
        }}>
        <View style={styles.button}>
          <Text>Download</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.progressBar}>
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
        <Text style={{marginHorizontal: 16}}>{'my Video.mp4'}</Text>
        <TouchableOpacity onPress={() => {
          onDeleteFile()
        }}>
          <Icon name="md-close" size={30} color="#4F8EF7"/>
        </TouchableOpacity>
      </View>}
    </View>
  }
}

export default connect((store, props) => {
  return {
    fileExist: store.appReducer.fileExist,
    progress: store.appReducer.progress,
    downloadStatus: store.appReducer.downloadStatus
  }
}, dispatch => {
  return {
    onDownloadVideo: () => dispatch(downloadVideo()),
    onDeleteFile: () => dispatch(deleteFile())
  }
})(LowerHalf)

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#46895f'
  },
  progressBar: {
    width: '100%',
    height: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'gray'
  }
});