import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { createWrapper } from "next-redux-wrapper";
// import storage from 'redux-persist/lib/storage'
import logger from "redux-logger";
import rootReducer from "./reducers/rootReducer";

const reduxStore = (initialState) => {
  let store;

  const isClient = typeof window !== "undefined";

  if (isClient) {
    const persistConfig = {
      key: "root",
      storage: sessionStorage,
      blacklist: ["menu"],
    };

    store = createStore(
      persistReducer(persistConfig, rootReducer),
      initialState,
      applyMiddleware(logger)
    );

    store.__PERSISTOR = persistStore(store);
  } else {
    store = createStore(rootReducer, initialState, applyMiddleware(logger));
  }

  return store;
};

export const wrapper = createWrapper(reduxStore);

// const persistConfig = {
//   key: 'root',
//   storage: storageSession,
//   blacklist: ['menu']
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// const reduxStore = () => {
//   let store = createStore(persistedReducer, applyMiddleware(logger))
//   store.__PERSISTOR = persistStore(store);
//   return store
// }
// export const wrapper = createWrapper(reduxStore);
