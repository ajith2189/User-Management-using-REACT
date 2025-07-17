import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import usersReducer from "./features/users/usersSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist config only for auth
const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Root reducer includes both, but only auth is persisted
const rootReducer = {
  auth: persistedAuthReducer,
  users: usersReducer, // <- not persisted
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required by redux-persist
    }),
});

const persistor = persistStore(store);

export { store, persistor };
