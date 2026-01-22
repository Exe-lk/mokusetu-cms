import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import usersReducer from './slices/usersSlice';
import categoriesReducer from './slices/categoriesSlice';
import tagsReducer from './slices/tagsSlice';
import pagesReducer from './slices/pagesSlice';
import servicesReducer from './slices/servicesSlice';
import teamReducer from './slices/teamSlice';
import settingsReducer from './slices/settingsSlice';
import aboutReducer from './slices/aboutSlice';
import homeReducer from './slices/homeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    users: usersReducer,
    categories: categoriesReducer,
    tags: tagsReducer,
    pages: pagesReducer,
    services: servicesReducer,
    team: teamReducer,
    settings: settingsReducer,
    about: aboutReducer,
    home: homeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
