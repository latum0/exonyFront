import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";
import type { Client } from "@/components/clients/columns";

export const fetchClients = createAsyncThunk(
  "clients/blacklist/fetchAll",
  async () => {
    const response = await api.get("/clients/blacklist");
    return response.data.data;
  }
);

export const removeFromBlacklist = createAsyncThunk(
  "clients/blacklist/delete",
  async (clientId: number) => {
    const response = await api.patch(`/clients/deleteBlacklist/${clientId}`);
    return response.data.data;
  }
);

export interface BlacklistClient {
  idClient: number;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  numeroTelephone: string;
}

interface BlacklistState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: BlacklistState = {
  clients: [],
  loading: false,
  error: null,
};

const blacklistClientsSlice = createSlice({
  name: "blacklistClients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all
    builder.addCase(fetchClients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.clients = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchClients.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to fetch blacklist clients.";
    });

    // Remove client
    builder.addCase(removeFromBlacklist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromBlacklist.fulfilled, (state, action) => {
      state.clients = state.clients.filter(
        (client) => client.idClient !== action.payload.idClient
      );
      state.loading = false;
    });
    builder.addCase(removeFromBlacklist.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to remove client from blacklist.";
    });
  },
});

export default blacklistClientsSlice.reducer;
