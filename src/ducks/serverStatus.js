import {store} from 'index';


export const LOG_REQUEST  = 'app/serverStatus/LOG_REQUEST';
export const LOG_RESPONSE = 'app/serverStatus/LOG_RESPONSE';
export const TIMER_TICK   = 'app/serverStatus/TIMER_TICK';


let timer = 0;

const TIME_A = 7 * 1000;
const TIME_B = 20 * 1000;


export function logRequest (time) {
  if (!timer)
    timer = setInterval(() => store.dispatch(timerTick()), 1000);

  return {
    type: LOG_REQUEST,
    time
  };
}

export function logResponse (time) {
  let req = store.getState().serverStatus.requests;
  if (!req.length || req.length == 1 && req[0] == time) {
    clearInterval(timer);
    timer = 0;
  }

  return {
    type: LOG_RESPONSE,
    time
  };
}

function timerTick () {
  return {
    type: TIMER_TICK,
    time: Date.now()
  };
}


const initialState = {
  requests: [],
  problemA: false,
  problemB: false
};

export default function serverStatusReducer(state = initialState, action) {
  let requests = state.requests.slice();

  switch (action.type) {
    case LOG_REQUEST:
      requests.push(action.time);
      return {
        ...state,
        requests
      };

    case LOG_RESPONSE:
      requests.splice(requests.indexOf(action.time), 1);
      if (requests.length)
        return {
          ...state,
          requests
        };
      else
        return {
          ...state,
          requests,
          problemA: false,
          problemB: false
        };

    case TIMER_TICK:
      return {
        ...state,
        problemA: action.time - requests[0] > TIME_A,
        problemB: action.time - requests[0] > TIME_B
      };

    default:
      return state;
  }
}