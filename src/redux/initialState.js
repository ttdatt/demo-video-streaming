/**
 * Created by Dat Tran on 12/5/16.
 */
import {DownloadStatus} from '../constants'

export default {
  appReducer: {
    showApp: false,
    progress: 0,
    isPlaying: false,
    fileExist: false,
    downloadStatus: DownloadStatus.NONE
  }
}