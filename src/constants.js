/**
 * Created by Dat Tran on 4/13/17.
 */
import RNFetchBlob from 'react-native-fetch-blob'
export const LOCAL_VIDEO_PATH = RNFetchBlob.fs.dirs.DocumentDir + '/myVideo.mp4'
export const DOWNLOAD_FILE_PATH = 'https://spout-output.s3.amazonaws.com/b555cc518a1b17b1/720p-rendering.mp4'
// export const DOWNLOAD_FILE_PATH = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
export const STREAM_PATH = 'https://s3-ap-southeast-1.amazonaws.com/spout-output/b555cc518a1b17b1/720p-rendering.m3u8'

export const DownloadStatus = {
  COMPLETE: 0,
  DOWNLOADING: 1,
  NONE: 2
}