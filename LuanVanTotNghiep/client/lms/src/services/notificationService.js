import { axiosClient } from "./axiosClient";
export const notificationService = {
  getNotificationsByUser: async () => {
    const response = await axiosClient.get("/notifications");
    return response;
  },
  markAsAllRead: async () => {
    const response = await axiosClient.put("/notifications/read-all");
    return response;
  },
  deleteReadNotifications: async () => {
    const response = await axiosClient.delete("/notifications");
    return response;
  },
};
