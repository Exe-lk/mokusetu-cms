import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { servicesService, Service, CreateServiceDto, UpdateServiceDto } from '@/services';

interface ServicesState {
  services: Service[];
  currentService: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk<
  { services: Service[] } | Service[],
  boolean | undefined
>(
  'services/fetchServices',
  async (active?: boolean) => {
    const response = await servicesService.getServices(active);
    if (response.success) {
      return response.data as { services: Service[] } | Service[];
    }
    throw new Error(response.error || 'Failed to fetch services');
  }
);

export const createService = createAsyncThunk<Service, CreateServiceDto>(
  'services/createService',
  async (data: CreateServiceDto) => {
    const response = await servicesService.createService(data);
    if (response.success) {
      return response.data as Service;
    }
    throw new Error(response.error || 'Failed to create service');
  }
);

export const updateService = createAsyncThunk<
  Service,
  { id: string; data: UpdateServiceDto }
>(
  'services/updateService',
  async ({ id, data }: { id: string; data: UpdateServiceDto }) => {
    const response = await servicesService.updateService(id, data);
    if (response.success) {
      return response.data as Service;
    }
    throw new Error(response.error || 'Failed to update service');
  }
);

export const deleteService = createAsyncThunk<string, string>(
  'services/deleteService',
  async (id: string) => {
    const response = await servicesService.deleteService(id);
    if (response.success) {
      return id;
    }
    throw new Error(response.error || 'Failed to delete service');
  }
);

export const fetchServiceById = createAsyncThunk<Service, string>(
  'services/fetchServiceById',
  async (id: string) => {
    const response = await servicesService.getService(id);
    if (response.success) {
      return response.data as Service;
    }
    throw new Error(response.error || 'Failed to fetch service');
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload;
      state.services = Array.isArray(payload) 
        ? payload 
        : (payload as { services: Service[] }).services || [];
    });
    builder.addCase(fetchServices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch services';
    });

    builder.addCase(fetchServiceById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchServiceById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentService = action.payload;
    });
    builder.addCase(fetchServiceById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch service';
    });

    builder.addCase(createService.fulfilled, (state, action) => {
      state.services.push(action.payload);
    });

    builder.addCase(updateService.fulfilled, (state, action) => {
      const index = state.services.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    });

    builder.addCase(deleteService.fulfilled, (state, action) => {
      state.services = state.services.filter((s) => s.id !== action.payload);
    });
  },
});

export const { clearError, clearCurrentService } = servicesSlice.actions;
export default servicesSlice.reducer;
