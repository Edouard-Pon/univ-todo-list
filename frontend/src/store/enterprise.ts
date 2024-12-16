import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEnterprise, createTeam, addTaskToTeam, updateTaskStatus } from './enterpriseThunks';
import { RootState } from './store';
import { Enterprise, Team, Task } from './types';

export interface EnterpriseState {
  _id: string;
  name: string;
  address: string;
  email: string;
  teams: Team[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EnterpriseState = {
  _id: '',
  name: '',
  address: '',
  email: '',
  teams: [],
  status: 'idle',
  error: null,
};

export const enterpriseSlice = createSlice({
  name: 'enterprise',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEnterprise.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEnterprise.fulfilled, (state, action: PayloadAction<{ enterprise: Enterprise }>) => {
        state.status = 'succeeded';
        state._id = action.payload.enterprise._id;
        state.name = action.payload.enterprise.name;
        state.address = action.payload.enterprise.address;
        state.email = action.payload.enterprise.email;
        state.teams = action.payload.enterprise.teams;
        state.error = null;
      })
      .addCase(createEnterprise.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<{ team: Team }>) => {
        state.teams.push(action.payload.team);
      })
      .addCase(addTaskToTeam.fulfilled, (state, action: PayloadAction<{ teamId: string; task: Task }>) => {
        const team = state.teams.find(t => t._id === action.payload.teamId);
        if (team) {
          team.tasks.push(action.payload.task);
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<{ teamId: string; taskId: string; status: boolean }>) => {
        const team = state.teams.find(t => t._id === action.payload.teamId);
        if (team) {
          const task = team.tasks.find(t => t._id === action.payload.taskId);
          if (task) {
            task.status = action.payload.status;
          }
        }
      });
  },
});

export const selectEnterprise = (state: RootState) => state.enterprise;
export const selectEnterpriseStatus = (state: RootState) => state.enterprise?.status ?? 'idle';

export default enterpriseSlice.reducer;