import { useLocation, useNavigate } from "react-router-dom";
import searchQueryParamName from "../../utils/searchQueryParamName";

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
    const queryParametr = new URLSearchParams(search);

    value ? queryParametr.set(key, value) : queryParametr.delete(key);

    navigate(`${pathname}?${queryParametr.toString()}`);
  };

  return replaceQueryParameter;
};
