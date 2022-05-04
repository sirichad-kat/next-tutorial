
export const login = () => {
  return {
    type: "LOGIN",
    isLoggedIn: true
  };
};

export const logout = () => {
  return {
    type: "LOGOUT",
    isLoggedIn: false
  };
};