// store/enterpriseThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { Enterprise, Team, Task } from './types';
import { handleAxiosError } from './errors';

export const createEnterprise = createAsyncThunk(
  'enterprise/createEnterprise',
  async (enterpriseData: { name: string; address: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/enterprise', enterpriseData);
      const enterprise: Enterprise = response.data;
      return { enterprise };
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const createTeam = createAsyncThunk(
  'enterprise/createTeam',
  async ({ enterpriseId, teamData }: { enterpriseId: string; teamData: { name: string } }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/enterprise/${enterpriseId}/teams`, teamData);
      const team: Team = response.data;
      return { team };
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const addTaskToTeam = createAsyncThunk(
  'enterprise/addTaskToTeam',
  async ({ enterpriseId, teamId, name }: { enterpriseId: string; teamId: string; name: Task }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/enterprise/${enterpriseId}/teams/${teamId}/tasks`, name);
      const task: Task = response.data;
      return { teamId, task };
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'enterprise/updateTaskStatus',
  async ({ enterpriseId, teamId, taskId, status }: { enterpriseId: string; teamId: string; taskId: string; status: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/enterprise/${enterpriseId}/teams/${teamId}/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const addWorkerToTeam = createAsyncThunk(
  'enterprise/addWorkerToTeam',
  async ({ enterpriseId, teamId, workerId }: { enterpriseId: string; teamId: string; workerId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/enterprise/${enterpriseId}/teams/${teamId}/workers`, { id: workerId });
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);