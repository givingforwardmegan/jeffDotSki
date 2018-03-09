import { GET_BLOG_CURRENT_ACTION } from './actions';

export default function (state={}, action){
  switch (action.type) {
    case GET_BLOG_CURRENT_ACTION:
      return action.payload.data;
    default:
  }
  return state;
}