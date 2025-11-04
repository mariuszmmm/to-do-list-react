import { getUserToken } from "./getUserToken";
import { getDataApi } from "../api/fetchDataApi";

export const refreshData = async () => {
  const token = await getUserToken();
  if (!token) {
    console.error("No token found");
    throw new Error("refreshData:noToken");
  }

  const data = await getDataApi(token);
  if (!data || !data.lists) {
    console.error("No data");
    throw new Error("refreshData:noData");
  }

  return data;
};
