import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";

export const deleteCloudinaryImage = async (publicId: string) => {
  const token = await getUserToken();

  if (!token) {
    throw new Error("User token is null");
  }

  const res = await axios.delete(`/image?publicId=${publicId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
