import { useLocation } from "react-router-dom";
import searchQueryParamName from "../utils/searchQueryParamName";

/**
 * Hook for retrieving a specific query parameter from the URL using react-router.
 * @param key - The query parameter name to retrieve
 * @returns The value of the query parameter or null if not present
 */
export const useQueryParameter = (key: typeof searchQueryParamName) => {
  const { search } = useLocation();

  return new URLSearchParams(search).get(key);
};
