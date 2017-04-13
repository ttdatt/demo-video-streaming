/**
 * Created by Dat Tran on 4/12/17.
 */

import {
  PLAY_VIDEO, DOWNLOAD_PROGRESS_CHANGED,
  CHECK_FILE_EXIST,
  ON_LOADING_APP
} from './../actions/app'

export default function appReducer(state = {}, action) {
  switch (action.type) {
    case PLAY_VIDEO:
      return {
        ...state,
        isPlaying: true
      }
    case DOWNLOAD_PROGRESS_CHANGED:
      console.log('down cc', action.downloadStatus)
      return {
        ...state,
        progress: action.progress,
        downloadStatus: action.downloadStatus
      }
    case CHECK_FILE_EXIST:
      return {
        ...state,
        fileExist: action.fileExist
      }
    case ON_LOADING_APP:
      return {
        ...state,
        fileExist: action.fileExist,
        showApp: action.showApp
      }
  }
  return state
}