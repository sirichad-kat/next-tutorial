const initialState = {
  addMapping: [],
  removeMapping: [],
};

const mappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MAPPING":
      if (
        state.removeMapping.some(
          (item) =>
            item.key === action.payload.key &&
            item.orgCode === action.payload.orgCode
        )
      ) {
        return {
          ...state,
          removeMapping: [
            ...state.removeMapping.filter(
              (item) =>
                item.key !== action.payload.key &&
                item.orgCode !== action.payload.orgCode
            ),
          ],
        };
      } else if (
        !state.addMapping.some(
          (item) =>
            item.key === action.payload.key &&
            item.orgCode === action.payload.orgCode
        )
      ) {
        return {
          ...state,
          addMapping: [...state.addMapping, action.payload],
        };
      } else {
        return state;
      }
    case "REMOVE_MAPPING":
      if (
        state.addMapping.some(
          (item) =>
            item.key === action.payload.key &&
            item.orgCode === action.payload.orgCode
        )
      ) {
        return {
          ...state,
          addMapping: [
            ...state.addMapping.filter(
              (item) =>
                item.key !== action.payload.key ||
                item.orgCode !== action.payload.orgCode
            ),
          ],
        };
      } else {
        return {
          ...state,
          removeMapping: [...state.removeMapping, action.payload],
        };
      }
    case "RESET_MAPPING":
      return {
        addMapping: [],
        removeMapping: [],
      };
    default:
      return state;
  }
};

export default mappingReducer;
