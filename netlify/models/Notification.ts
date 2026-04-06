import mongoose from "mongoose";

export interface ScheduledNotificationDoc extends mongoose.Document {
  userEmail: string;
  subscriptionId?: string;
  content: string;
  heading?: string;
  buttonText?: string;
  listName?: string;
  taskId?: string;
  lang?: string;
  displayImage?: string;
  send_after: number; // Unix timestamp in seconds
  status: "pending" | "sent" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const ScheduledNotificationSchema = new mongoose.Schema<ScheduledNotificationDoc>(
  {
    userEmail: { type: String, required: true, index: true },
    subscriptionId: { type: String, required: false },
    content: { type: String, required: true },
    heading: { type: String, required: false },
    buttonText: { type: String, required: false },
    listName: { type: String, required: false },
    taskId: { type: String, required: false },
    lang: { type: String, required: false },
    displayImage: { type: String, required: false },
    send_after: { type: Number, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "sent", "cancelled"],
      default: "pending",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<ScheduledNotificationDoc>) ||
  mongoose.model<ScheduledNotificationDoc>("Notification", ScheduledNotificationSchema, "notifications");

export default NotificationModel;
