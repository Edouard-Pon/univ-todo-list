import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import enterpriseReducer from './enterprise';

const store = configureStore({
  reducer: {
    user: userReducer,
    enterprise: enterpriseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
export default store;