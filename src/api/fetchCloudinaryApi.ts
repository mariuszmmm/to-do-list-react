import axios from "axios";
import { getUserToken } from "../utils/getUserToken";

export const getCloudinarySignature = async (
  publicId?: string,
  folder?: string
) => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.error("No token found");
      throw new Error("User token is null");
    }

    const params = new URLSearchParams();
    if (publicId) params.append("publicId", publicId);
    if (folder) params.append("folder", folder);
    const url = `/image${params.toString() ? "?" + params.toString() : ""}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching Cloudinary signature",
      error.message || error
    );
    throw error;
  }
};

export const deleteCloudinaryImage = async (publicId: string) => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.error("No token found");
      throw new Error("User token is null");
    }

    const res = await axios.delete(`/image?publicId=${publicId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error: any) {
    console.error("Error deleting Cloudinary image", error.message || error);
    throw error;
  }
};
