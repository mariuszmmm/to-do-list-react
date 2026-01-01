import { useLocation, useNavigate } from "react-router-dom";
import searchQueryParamName from "../utils/searchQueryParamName";

/**
 * Hook for replacing or removing a query parameter in the URL using react-router.
 * Returns a function to update the query parameter and navigate.
 */
export const useReplaceQueryParameter = () => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const replaceQueryParameter = ({
    key,
    value,
  }: {
    key: typeof searchQueryParamName;
    value?: string;
  }) => {
    // Create a new URLSearchParams object from the current search string
    const queryParametr = new URLSearchParams(search);

    // Set or remove the query parameter based on value
    value ? queryParametr.set(key, value) : queryParametr.delete(key);

    // Navigate to the new URL with updated query parameters
    navigate(`${pathname}?${queryParametr.toString()}`);
  };

  return replaceQueryParameter;
};
