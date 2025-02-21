import { useLocation } from "react-router-dom";
import searchQueryParamName from "../utils/searchQueryParamName";

export const useQueryParameter = (key: typeof searchQueryParamName) => {
  const { search } = useLocation();

  return new URLSearchParams(search).get(key);
};
