import { combineReducers } from 'redux'
import userinfo from './userinfo'
import login from './login'
import menu from './menu'
import uiconfig from './uiconfig'
import mapping from './mapping'
import navigate from './navigate'

export default combineReducers({
  user: userinfo,
  isLoggedIn: login,
  menu,
  uiconfig,
  mapping,
  navigate
})