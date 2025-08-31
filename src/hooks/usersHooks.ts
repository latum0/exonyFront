import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
  emailVerified: boolean;
}

// GET ALL
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await api.get("/users/all");
  return response.data.users;
});

// CREATE
export const createUser = createAsyncThunk(
  "users/create",
  async (user: Omit<User, "id" | "emailVerified">) => {
    const response = await api.post("/users/create", user);
    return response.data;
  }
);

// UPDATE
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: number; data: any }, thunkAPI) => {
    try {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getUserById = createAsyncThunk(
  "users/getById",
  async (id: number, thunkAPI) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
// DELETE
export const deleteUser = createAsyncThunk("users/delete", async (id: number) => {
  await api.delete(`/users/${id}`);
  return id;
});

// UPDATE PERMISSIONS
export const updatePermissions = createAsyncThunk(
  "users/updatePermissions",
  async ({ id, permissions }: { id: number; permissions: string[] }) => {
    const response = await api.patch(`/users/${id}/permissions`, { permissions });
    return { id, permissions };
  }
);
