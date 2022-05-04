const initialState = {
   isShowMenuSide: true,
   isShowloadingBackdrop: false,
   refreshPage: false,
   programName: "",
   programId: "",
   loadingText: "Loading",
};

const userReducer = (state = initialState, action) => {
   switch (action.type) {
      case "SET_SHOW_MENU_SIDEBAR":
         return { ...state, isShowMenuSide: action.value };
      case "SET_SHOW_LOADING_BACKDROP":
         return { ...state, isShowloadingBackdrop: action.value, loadingText: action.text };
      case "SET_PROGRAM_NAME":
         return { ...state, programName: action.value };
      case "SET_PROGRAM_ID":
         return { ...state, programId: action.value };
      default:
         return state;
   }
};
export default userReducer;
