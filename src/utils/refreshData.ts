import { getDataApi } from "../api/fetchDataApi";
import { getUserToken } from "./getUserToken";

export const refreshData = async () => {
  const token = await getUserToken();
  if (!token) {
    console.error("No token found");
    return;
  }

  const data = await getDataApi(token);
  if (!data || !data.lists || !data.version) {
    console.error("No data");
    return;
  }

  return data;
};
