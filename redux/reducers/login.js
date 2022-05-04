const loginReducer = (state = false, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.isLoggedIn;
    case "LOGOUT":
      return action.isLoggedIn;
    default:
      return state;
  }
};

export default loginReducer;