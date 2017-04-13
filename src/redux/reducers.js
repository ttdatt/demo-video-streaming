/**
 * Created by Dat Tran on 12/5/16.
 */
import {combineReducers} from 'redux'

import appReducer from './../reducers/app'

/**
 * This place is to register all reducers of the app.
 */

export default combineReducers({
  appReducer: appReducer
})