import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const fetchBlacklist = createAsyncThunk(
  "clients/blacklist/fetchAll",
  async () => {
    const response = await api.get("/clients/blacklist");

    return response.data.data;
  }
);
export const deleteFromBlacklist = createAsyncThunk(
  "clients/blacklist/delete",
  async (clientId: number) => {
    const response = await api.patch(`/clients/deleteBlacklist/${clientId}`);
    return response.data.data;
  }
);
