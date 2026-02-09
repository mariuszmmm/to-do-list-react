import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";

export const moveCloudinaryImage = async (publicId: string, folder: string) => {
  const token = await getUserToken();

  if (!token) {
    throw new Error("User token is null");
  }

  const params = new URLSearchParams();
  params.append("publicId", publicId);
  params.append("folder", folder);

  const res = await axios.post(`/image?${params.toString()}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
