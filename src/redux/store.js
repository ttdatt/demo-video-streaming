/**
 * Created by Dat Tran on 12/21/16.
 */

import {createStore, compose, applyMiddleware} from 'redux'
import reducers from './reducers'
import initialState from './initialState'
import thunk from 'redux-thunk';

/**
 *  Redux Store configuration
 */

// const middlewares = [
//     createEpicMiddleware(epic)
// ];

//create store
// let store = createStore(reducers, initialState
//     // composeWithDevTools(
//     //     // applyMiddleware(...middlewares)
//     // )
// );

let store = createStore(reducers, initialState, compose(applyMiddleware(thunk)))

export default store;