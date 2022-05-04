const initialState = {
  selectedProgram: "",
  selectedProgramName: "",
  selectedMenu: -1,
  allMenu: [],
  unGroupMenu: [],
  reloadMenu: false,
  expandedKeys: []
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_PROGRAM":
      return { ...state, selectedProgram: action.selectedProgram };
    case "SET_SELECTED_PROGRAMNAME":
      return { ...state, selectedProgramName: action.selectedProgramName };
    case "SET_SELECTED_MENU":
      return { ...state, selectedMenu: action.selectedMenu };
    case "SET_ALLMENU":
      return { ...state, allMenu: action.allMenu };
    case "SET_UNGROUPMENU":
      return { ...state, unGroupMenu: action.unGroupMenu };
    case "SET_RELOADMENU":
      return { ...state, reloadMenu: action.reloadMenu };
    case "SET_EXPANDED_KEYS":
      return { ...state, expandedKeys: action.expandedKeys };
    default:
      return state;
  }
};

export default menuReducer;
