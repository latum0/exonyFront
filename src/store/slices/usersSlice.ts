import { createSlice } from "@reduxjs/toolkit";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updatePermissions,
} from "@/hooks/usersHooks";
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
  emailVerified: boolean;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
   selectedUser: User | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null, 
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Erreur";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updatePermissions.fulfilled, (state, action) => {
        const { id, permissions } = action.payload;
        const index = state.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          state.users[index].permissions = permissions;
        }
      })
      .addCase(getUserById.pending, (state) => {
  state.loading = true;
  state.selectedUser = null;
})
.addCase(getUserById.fulfilled, (state, action) => {
  state.loading = false;
  state.selectedUser = action.payload;
})
.addCase(getUserById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message ?? "Erreur lors du chargement de l'utilisateur";
})
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
