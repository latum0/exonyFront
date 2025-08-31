import { createSlice } from "@reduxjs/toolkit";
import {
  createClient,
  updateClient,
  fetchClients,
  addToBlacklist,
} from "@/hooks/clients-hook";
import type { Client } from "@/components/clients/columns";

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Clients
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
      state.error = action.error.message || "Failed to fetch clients.";
    });

    // Create Client
    builder.addCase(createClient.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createClient.fulfilled, (state, action) => {
      state.clients.push(action.payload);
      state.loading = false;
    });
    builder.addCase(createClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create client.";
    });

    // Update Client
    builder.addCase(updateClient.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateClient.fulfilled, (state, action) => {
      const index = state.clients.findIndex(
        (client) => client.idClient === action.payload.id
      );
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(updateClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update client.";
    });
    // Add To Blacklist
    builder.addCase(addToBlacklist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToBlacklist.fulfilled, (state, action) => {
      const index = state.clients.findIndex(
        (client) => client.idClient === action.payload.idClient
      );
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(addToBlacklist.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to add client to blacklist.";
    });
  },
});

export default clientsSlice.reducer;
