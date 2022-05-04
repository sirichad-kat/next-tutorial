export const add_mapping = (key, orgCode) => {
  return {
    type: "ADD_MAPPING",
    payload: {
      key: key,
      orgCode: orgCode,
    },
  };
};

export const remove_mapping = (key, orgCode) => {
  return {
    type: "REMOVE_MAPPING",
    payload: {
      key: key,
      orgCode: orgCode,
    },
  };
};

export const reset_mapping = () => {
    return {
        type: "RESET_MAPPING"
    }
}