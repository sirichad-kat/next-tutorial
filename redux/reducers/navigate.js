const initialState = {
  criteria: null,
  dataNavigate: null,
  dataNavigateReport: null,
  tempObj: null,
  showDetailPage: false,
  stateProgram: "",
  isNew: false,
  historyPath: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CRITERIA":
      return { ...state, criteria: action.criteria };    
    case "SET_DATA_NAVIGATE":
      return { ...state, dataNavigate: action.dataNavigate };  
    case "SET_DATA_NAVIGATE_REPORT":
      return { ...state, dataNavigateReport: action.dataNavigate };  
    case "SET_TEMP_OBJ":
      return { ...state, tempObj: action.tempObj };  
    case "SET_SHOWDETAILPAGE":
      return { ...state, showDetailPage: action.showDetailPage };    
    case "SET_STATE_PROGRAM":
      return { ...state, stateProgram: action.stateProgram };    
    case "SET_ISNEW":
      return { ...state, isNew: action.isNew };    
    case "SET_HISTORY_PATH":
      return { ...state, historyPath: action.historyPath };    
    default:
      return state;
  }
};
export default userReducer;
