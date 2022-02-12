import {
  GET_MESSAGE,
  GET_MESSAGES,
  SET_MESSAGE,
  SET_REPLY,
} from '../actions/SupportActions'

export const getMessages = () => {
  return { type: GET_MESSAGES }
}

export const getMessage = id => {
  return { type: GET_MESSAGE, payload: id }
}

export const setMessageReply = text => {
  return { type: SET_REPLY, payload: text }
}

export const setMessage = payload => {
  return { type: SET_MESSAGE, payload }
}
