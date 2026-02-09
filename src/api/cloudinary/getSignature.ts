import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";

export const getCloudinarySignature = async (taskId?: string) => {
  const token = await getUserToken();

  if (!token) {
    throw new Error("User token is null");
  }

  const params = new URLSearchParams();
  if (taskId) {
    params.append("taskId", taskId);
  }
  const url = `/image${params.toString() ? "?" + params.toString() : ""}`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
