// src/store/slices/notificationsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { Notification, NotificationsResponse } from "@/hooks/useNotifications";
import type { PayloadAction } from "@reduxjs/toolkit";
interface NotificationsState {
  notifications: NotificationsResponse;
  currentNotification: Notification | null;
  loading: boolean;
  error: string | null;
  deleting: string[]; // IDs des notifications en cours de suppression
}

const initialState: NotificationsState = {
  notifications: {
    items: [],
    meta: {
      total: 0,
      page: 1,
      limit: 25,
      totalPages: 0,
    },
  },
  currentNotification: null,
  loading: false,
  error: null,
  deleting: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Fetch all notifications
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<NotificationsResponse>) => {
      state.loading = false;
      state.notifications = action.payload;
      state.error = null;
    },
    fetchNotificationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single notification
    fetchNotificationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationSuccess: (state, action: PayloadAction<Notification>) => {
      state.loading = false;
      state.currentNotification = action.payload;
      state.error = null;
    },
    fetchNotificationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete notification
    deleteNotificationStart: (state, action: PayloadAction<string>) => {
      state.deleting.push(action.payload);
      state.error = null;
    },
    deleteNotificationSuccess: (state, action: PayloadAction<string>) => {
      state.deleting = state.deleting.filter(id => id !== action.payload);
      state.notifications.items = state.notifications.items.filter(
        notification => notification.id !== action.payload
      );
      state.notifications.meta.total -= 1;
    },
    deleteNotificationFailure: (state, action: PayloadAction<{ id: string; error: string }>) => {
      state.deleting = state.deleting.filter(id => id !== action.payload.id);
      state.error = action.payload.error;
    },

    // Reset state
    resetNotificationsState: (state) => {
      state.loading = false;
      state.error = null;
      state.deleting = [];
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchNotificationStart,
  fetchNotificationSuccess,
  fetchNotificationFailure,
  deleteNotificationStart,
  deleteNotificationSuccess,
  deleteNotificationFailure,
  resetNotificationsState,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;