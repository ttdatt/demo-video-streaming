/**
 * Created by Dat Tran on 4/13/17.
 */
import RNFetchBlob from 'react-native-fetch-blob'
import {LOCAL_VIDEO_PATH, STREAM_PATH, DOWNLOAD_FILE_PATH, DownloadStatus} from './../constants'

export const PLAY_VIDEO = 'PLAY_VIDEO'
export function playVideo() {
  return {
    type: PLAY_VIDEO
  }
}
export function checkFileExist() {
  return RNFetchBlob.fs.exists(LOCAL_VIDEO_PATH)
}

export const ON_LOADING_APP = 'ON_LOADING_APP'
export function onLoadingApp() {
  return dispatch => {
    checkFileExist().then(exist => {
      dispatch({type: ON_LOADING_APP, fileExist: exist, showApp: true})
    })
  }
}

export const DOWNLOAD_PROGRESS_CHANGED = 'DOWNLOAD_PROGRESS_CHANGED'
export const DOWNLOAD_COMPLETE = 'DOWNLOAD_COMPLETE'
export const DOWNLOADING = 'DOWNLOADING'
export const CHECK_FILE_EXIST = 'CHECK_FILE_EXIST'

export function downloadVideo() {
  console.log('start download file')
  return dispatch => {
    RNFetchBlob
      .config({
        fileCache: true,
        path: LOCAL_VIDEO_PATH
      })
      .fetch('GET', DOWNLOAD_FILE_PATH)
      .progress((received, total) => {
        console.log('progress', received / total)
        dispatch({type: DOWNLOAD_PROGRESS_CHANGED, progress: received / total, downloadStatus: DownloadStatus.DOWNLOADING})
      })
      .then((res) => {
        console.log('The file saved to ', res.path())
        dispatch({type: DOWNLOAD_PROGRESS_CHANGED, progress: 0, downloadStatus: DownloadStatus.COMPLETE})
        dispatch({type: CHECK_FILE_EXIST, fileExist: true})
      })
  }
}

export function deleteFile() {
  return dispatch => {
    RNFetchBlob.fs.unlink(LOCAL_VIDEO_PATH)
      .then(() => {
        dispatch({type: CHECK_FILE_EXIST, fileExist: false})
      })
      .catch((err) => console.log('something went wrong', err))
  }
}