import { useNavigate, useLocation } from "react-router-dom";

export const useQueryParameter = (key) => {
  const { search } = useLocation();

  return new URLSearchParams(search).get(key)
};

export const useReplaceQueryParameter = () => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const replaceQueryParameter = ({ key, value }) => {
    const queryParametr = new URLSearchParams(search);

    value ? queryParametr.set(key, value) : queryParametr.delete(key);
    
    navigate(`${pathname}?${queryParametr.toString()}`);
  };

  return replaceQueryParameter;
};


