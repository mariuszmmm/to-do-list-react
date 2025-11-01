import { getDataApi } from "../api/fetchDataApi";
import { getUserToken } from "./getUserToken";

export const refreshData = async () => {
  const token = await getUserToken();
  if (!token) {
    console.error("No token found");
    throw new Error("refreshData:noToken");
  }

  const data = await getDataApi(token);
  if (!data || !data.lists || !data.version) {
    console.error("No data");
    throw new Error("refreshData:noData");
  }

  return data;
};
