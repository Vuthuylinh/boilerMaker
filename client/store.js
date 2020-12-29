import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
// import loggingMiddleware from 'redux-logger' // https://github.com/evgenyrodionov/redux-logger
import rootReducer from './redux/index'

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    createLogger()
  )
);

//good place to console.log(store)
export default store
