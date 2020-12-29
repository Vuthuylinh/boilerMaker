import sampleReducer from './sample'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  sample: sampleReducer
})


export default rootReducer
