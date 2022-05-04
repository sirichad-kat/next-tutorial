export const setShowMenuSidebar = (value) => ({
   type: "SET_SHOW_MENU_SIDEBAR",
   value,
});

export const setShowLoadingBackdrop = (value,text) => ({
   type: "SET_SHOW_LOADING_BACKDROP",
   value: value,
   text : text
});

export const setProgramName = (value) => ({
   type: "SET_PROGRAM_NAME",
   value,
});

export const setProgramId = (value) => ({
   type: "SET_PROGRAM_ID",
   value,
});
