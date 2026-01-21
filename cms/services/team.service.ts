import apiClient from '@/lib/api-client';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamMemberDto {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  active?: boolean;
  order?: number;
}

export interface UpdateTeamMemberDto {
  name?: string;
  role?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  active?: boolean;
  order?: number;
}

export const teamService = {
  async getTeamMembers(active?: boolean) {
    const params = active !== undefined ? { active: active.toString() } : undefined;
    return apiClient.get('/team', params);
  },

  async getTeamMember(id: string) {
    return apiClient.get(`/team/${id}`);
  },

  async createTeamMember(data: CreateTeamMemberDto) {
    return apiClient.post('/team', data);
  },

  async updateTeamMember(id: string, data: UpdateTeamMemberDto) {
    return apiClient.put(`/team/${id}`, data);
  },

  async deleteTeamMember(id: string) {
    return apiClient.delete(`/team/${id}`);
  },
};
