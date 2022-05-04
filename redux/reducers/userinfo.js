const initialState = {
  username: "",
  language: "",
  orgCode: "",
  userRole: "",
  token: "",
  connection: ""
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.name };
    case "SET_LANGUAGE":
      return { ...state, language: action.language };
    case "SET_ORGCODE":
      return { ...state, orgCode: action.orgCode };
    case "SET_USERROLE":
      return { ...state, userRole: action.userRole };
    case "SET_TOKEN":
      return { ...state, token: action.token };
    case "SET_CONNECTION":
      return { ...action.connection };
    case "SET_LOGINOBJ":
      return { ...action.LoginObj };
    
    default:
      return state;
  }
};
export default userReducer;
