import { useTokenValidation } from "../hooks";

/**
 * Komponent który zarządza tokenem bez renderowania czegokolwiek
 * Zawiera hooki które monitorują token, ale sam się nie renderuje
 */
export const TokenManager = () => {
  // Monitor token validity and logout when expired
  useTokenValidation();

  return null;
};
