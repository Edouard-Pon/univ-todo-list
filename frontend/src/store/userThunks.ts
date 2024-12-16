import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { User } from './types';
// import { setToken } from '../services/api';
import { handleAxiosError } from "./errors";

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user }: { user: User } = response.data;
      console.log(response.data);
      return { user };
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (newUser: { email: string; password: string; }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', newUser);
      console.log(response.data);
      const user: User = response.data;
      console.log(user);
      return { user };
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);
