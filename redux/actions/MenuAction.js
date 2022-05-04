
export const setSelectedProgram = (selectedProgram) => {
  return {
    type: "SET_SELECTED_PROGRAM",
    selectedProgram
  };
};

export const setSelectedProgramName = (selectedProgramName) => {
  return {
    type: "SET_SELECTED_PROGRAMNAME",
    selectedProgramName
  };
};

export const setSelectedMenu = (selectedMenu) => {
  return {
    type: "SET_SELECTED_MENU",
    selectedMenu
  };
};

export const setAllMenu = (allMenu) => {
  return {
    type: "SET_ALLMENU",
    allMenu
  };
};

export const setReloadMenu = (reloadMenu) => {
  return {
    type: "SET_RELOADMENU",
    reloadMenu
  };
};

export const setUnGroupMenu = (unGroupMenu) => {
  return {
    type: "SET_UNGROUPMENU",
    unGroupMenu
  };
};

export const setExpandedKeys = (expandedKeys) => {
  return {
    type: "SET_EXPANDED_KEYS",
    expandedKeys
  };
};



