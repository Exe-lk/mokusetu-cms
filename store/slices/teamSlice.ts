import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamService, TeamMember, CreateTeamMemberDto, UpdateTeamMemberDto } from '@/services';

interface TeamState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teamMembers: [],
  loading: false,
  error: null,
};

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (active?: boolean) => {
    const response = await teamService.getTeamMembers(active);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch team members');
  }
);

export const createTeamMember = createAsyncThunk(
  'team/createTeamMember',
  async (data: CreateTeamMemberDto) => {
    const response = await teamService.createTeamMember(data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create team member');
  }
);

export const updateTeamMember = createAsyncThunk(
  'team/updateTeamMember',
  async ({ id, data }: { id: string; data: UpdateTeamMemberDto }) => {
    const response = await teamService.updateTeamMember(id, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update team member');
  }
);

export const deleteTeamMember = createAsyncThunk(
  'team/deleteTeamMember',
  async (id: string) => {
    const response = await teamService.deleteTeamMember(id);
    if (response.success) {
      return id;
    }
    throw new Error(response.error || 'Failed to delete team member');
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTeamMembers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTeamMembers.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload as { teamMembers?: typeof state.teamMembers };
      state.teamMembers = payload?.teamMembers || [];
    });
    builder.addCase(fetchTeamMembers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message || 'Failed to fetch team members';
    });

    builder.addCase(createTeamMember.fulfilled, (state, action) => {
      state.teamMembers.push(action.payload as TeamMember);
    });

    builder.addCase(updateTeamMember.fulfilled, (state, action) => {
      const payload = action.payload as TeamMember;
      const index = state.teamMembers.findIndex((t) => t.id === payload.id);
      if (index !== -1 && typeof action.payload === 'object' && action.payload !== null) {
        state.teamMembers[index] = payload;
      }
    });

    builder.addCase(deleteTeamMember.fulfilled, (state, action) => {
      state.teamMembers = state.teamMembers.filter((t) => t.id !== action.payload);
    });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;
