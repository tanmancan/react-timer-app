import { connect } from "react-redux";
import { addTimer, updateTimer, deleteTimer, stopTimer, updateTimerOrder, timerDrag, undoTimerDelete } from "../store/actions/timer";
import { initTimerState } from '../store/reducers/timer';
import App from '../App';

window.undoState = {};

const getDragState = (state) => {
  return state.timerDrag;
}

const getAllTagsById = (state) => {
  return state.tagsById;
}

const getStateById = (state) => (id) => {
  return state.timerById[id];
}

const getAllTimerStates = (state) => {
  return state.timerById;
}

const getAllTimers = (state) => {
  return state.timers;
}

const getActiveTimer = (state) => {
  return state.activeTimer;
}

const getTotalTime = (state) => {
  return Object.entries(state.timerById)
    .reduce((total, [id, timerState]) => {
      return total + timerState.timeProgress
    }, 0);
}

const mapTimerStateToProps = globalState => {
  let state = globalState.timerState;

  return {
    getAllTagsById: getAllTagsById(globalState.tagState),
    getDragState: getDragState(state),
    getStateById: getStateById(state),
    getAllTimerStates: getAllTimerStates(state),
    getAllTimers: getAllTimers(state),
    getActiveTimer: getActiveTimer(state),
    getTotalTime: getTotalTime(state)
  }
}

const mapTimerDispatchToProps = dispatch => {
  return {
    onTimerAdd: () => {
      let uid = +`${Math.floor(Math.random() * 1000)}${+new Date()}`;
      let id = `timer-${uid}`;
      let timerState = {
        ...initTimerState,
        timerStartDate: +new Date(),
      }
      dispatch(addTimer({timerState, id}));
      window.showToast('Timer Added');
      return true;
    },
    onTimerUpdate: ({timerState, id}) => {
      dispatch(updateTimer({timerState, id}));
    },
    onTimerDelete: ({timerState, id}) => {
      dispatch(deleteTimer({ timerState, id }));

      window.undoState[id] = {
        timerState,
        id
      };

      // Only reason for this nonsense is because we are passing the closure via a string to the toast option
      // @TODO: implement a better way to pass undoDelete handler to toast options
      window.undoDelete = (target, id) => {
        if (window.undoState && window.undoState[id]) {
          dispatch(undoTimerDelete(window.undoState[id]));
          target.parentNode.innerHTML = 'Timer Restored';
        }
        delete window.undoState[id];
      }

      let deleteMessage = `
        Timer Deleted &nbsp; <a href="#undo" onclick="window.undoDelete(this, '${id}');" class="orange-text">Undo</a>
      `;

      window.showToast(deleteMessage, {displayLength: 6000});
    },
    onTimerStop: ({timerState, id}) => {
      dispatch(stopTimer({ timerState, id }));
      window.showToast('Timer Stopped');
    },
    onTimerUpdateOrder: ({targetPos, id}) => {
      dispatch(updateTimerOrder({targetPos, id}));
    },
    onTimerDrag: ({dragState, id}) => {
      dispatch(timerDrag({dragState, id}));
    }
  }
}

export default connect(
  mapTimerStateToProps,
  mapTimerDispatchToProps
)(App);
