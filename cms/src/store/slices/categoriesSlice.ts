import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesService, Category, CreateCategoryDto, UpdateCategoryDto } from '@/src/services';

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<{ categories: Category[] }, void>(
  'categories/fetchCategories',
  async (): Promise<{ categories: Category[] }> => {
    const response = await categoriesService.getCategories();
    if (response.success) {
      return response.data as { categories: Category[] };
    }
    throw new Error(response.error || 'Failed to fetch categories');
  }
);

export const fetchCategoryById = createAsyncThunk<Category, string>(
  'categories/fetchCategoryById',
  async (id: string): Promise<Category> => {
    const response = await categoriesService.getCategory(id);
    if (response.success) {
      return response.data as Category;
    }
    throw new Error(response.error || 'Failed to fetch category');
  }
);

export const createCategory = createAsyncThunk<Category, CreateCategoryDto>(
  'categories/createCategory',
  async (data: CreateCategoryDto): Promise<Category> => {
    const response = await categoriesService.createCategory(data);
    if (response.success) {
      return response.data as Category;
    }
    throw new Error(response.error || 'Failed to create category');
  }
);

export const updateCategory = createAsyncThunk<Category, { id: string; data: UpdateCategoryDto }>(
  'categories/updateCategory',
  async ({ id, data }: { id: string; data: UpdateCategoryDto }): Promise<Category> => {
    const response = await categoriesService.updateCategory(id, data);
    if (response.success) {
      return response.data as Category;
    }
    throw new Error(response.error || 'Failed to update category');
  }
);

export const deleteCategory = createAsyncThunk<string, string>(
  'categories/deleteCategory',
  async (id: string): Promise<string> => {
    const response = await categoriesService.deleteCategory(id);
    if (response.success) {
      return id;
    }
    throw new Error(response.error || 'Failed to delete category');
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.categories || [];
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch categories';
    });

    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload);
    });

    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
    });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
